import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { Notification } from "@/lib/firestore-schema";

// ─── GET /api/notifications ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  let notifications: Notification[] = [];

  try {
    const snap = await adminDb.collection(FS.NOTIFICATIONS)
      .where("user_id", "==", session.id)
      .orderBy("created_at", "desc")
      .limit(50)
      .get();
    notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Notification);
  } catch (indexErr: any) {
    // Composite index may not exist yet — fall back to simple query, sort in memory
    console.warn("[Notifications] Composite index missing, falling back:", indexErr?.message);
    try {
      const snap = await adminDb.collection(FS.NOTIFICATIONS)
        .where("user_id", "==", session.id)
        .limit(50)
        .get();
      notifications = snap.docs
        .map(d => ({ id: d.id, ...d.data() }) as Notification)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch {
      // If even this fails, return empty gracefully — no crash
      notifications = [];
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return NextResponse.json({ notifications, unreadCount });
}

// ─── PATCH /api/notifications — mark as read ─────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id, markAll } = await req.json();

  try {
    const batch = adminDb.batch();

    if (markAll) {
      const unreadSnap = await adminDb.collection(FS.NOTIFICATIONS)
        .where("user_id", "==", session.id)
        .where("is_read", "==", false)
        .get();
        
      unreadSnap.forEach(doc => {
        batch.update(doc.ref, { is_read: true });
      });
    } else if (id) {
      const ref = adminDb.collection(FS.NOTIFICATIONS).doc(id);
      const snap = await ref.get();
      if (snap.exists && snap.data()?.user_id === session.id) {
        batch.update(ref, { is_read: true });
      } else {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications update error:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
// ─── POST /api/notifications — mark as read (used by NotificationContext) ────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  let body: any = {};
  try { body = await req.json(); } catch { /* empty body */ }

  const { action, notificationId } = body;

  try {
    const batch = adminDb.batch();

    if (action === "mark_all_read") {
      const unreadSnap = await adminDb.collection(FS.NOTIFICATIONS)
        .where("user_id", "==", session.id)
        .where("is_read", "==", false)
        .get();
      unreadSnap.forEach(doc => batch.update(doc.ref, { is_read: true }));
    } else if (action === "mark_read" && notificationId) {
      const ref = adminDb.collection(FS.NOTIFICATIONS).doc(notificationId);
      const snap = await ref.get();
      if (snap.exists && snap.data()?.user_id === session.id) {
        batch.update(ref, { is_read: true });
      } else {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications POST error:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
