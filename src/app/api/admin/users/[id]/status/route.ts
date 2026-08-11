import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { notifyAccountStatusChanged } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, AccountStatus } from "@/lib/firestore-schema";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  if (id === session.id) {
    return NextResponse.json({ error: "You cannot change your own account status." }, { status: 400 });
  }

  const body = await req.json();
  const newStatus = body.status as AccountStatus;
  
  if (!["active", "inactive", "suspended", "pending"].includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const snap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "User not found." }, { status: 404 });
  const user = snap.data() as PlatformUser;

  if (user.status === newStatus) {
    return NextResponse.json({ success: true, message: "Status unchanged." });
  }

  try {
    await adminDb.collection(FS.USERS).doc(id).update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    await auditLog(session.id, "CHANGE_STATUS", id, { from: user.status, to: newStatus });
    
    if (["active", "suspended", "inactive"].includes(newStatus)) {
      await notifyAccountStatusChanged(id, newStatus as "active" | "suspended" | "inactive");
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Change status error:", error);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
