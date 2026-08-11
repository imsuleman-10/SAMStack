import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { AuditLog, PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/admin/audit-logs ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));

  let q = adminDb.collection(FS.AUDIT_LOGS) as FirebaseFirestore.Query;
  
  if (action) {
    q = q.where("action", "==", action);
  }
  
  q = q.orderBy("created_at", "desc").limit(limit);

  const snap = await q.get();
  const logs = snap.docs.map(d => d.data() as AuditLog);

  // Hydrate actor and target users
  const userIds = new Set<string>();
  logs.forEach(l => {
    userIds.add(l.actor_id);
    if (l.target_user_id) userIds.add(l.target_user_id);
  });

  const userMap: Record<string, any> = {};
  if (userIds.size > 0) {
    const userSnaps = await adminDb.getAll(...Array.from(userIds).map(id => adminDb!.collection(FS.USERS).doc(id)));
    userSnaps.forEach(u => {
      if (u.exists) {
        const d = u.data() as PlatformUser;
        userMap[u.id] = { id: d.id, full_name: d.full_name, email: d.email, role: d.role };
      }
    });
  }

  const enriched = logs.map(l => ({
    ...l,
    actor: userMap[l.actor_id] || null,
    target_user: l.target_user_id ? (userMap[l.target_user_id] || null) : null,
  }));

  return NextResponse.json({ logs: enriched });
}
