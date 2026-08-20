import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { auditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  if (!adminDb || !adminAuth) return NextResponse.json({ error: "Firebase Admin not available" }, { status: 500 });

  try {
    const { userIds, action, payload } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    if (!["CHANGE_ROLE", "CHANGE_STATUS", "DELETE"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const batch = adminDb.batch();

    if (action === "CHANGE_ROLE" || action === "CHANGE_STATUS") {
      if (!payload) {
        return NextResponse.json({ error: "Missing payload for update" }, { status: 400 });
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (action === "CHANGE_ROLE") updateData.role = payload;
      if (action === "CHANGE_STATUS") updateData.status = payload;

      for (const uid of userIds) {
        const ref = adminDb.collection(FS.USERS).doc(uid);
        batch.update(ref, updateData);
      }

      await batch.commit();

      // Audit Logs
      for (const uid of userIds) {
        await auditLog(
          auth.session.id,
          action as any,
          uid,
          { newValue: payload, description: `Bulk action applied to ${uid}` }
        );
      }

      return NextResponse.json({ success: true, count: userIds.length });
    }

    if (action === "DELETE") {
      // 1. Delete from Firebase Auth
      await adminAuth.deleteUsers(userIds);

      // 2. Delete from Firestore Platform Users
      for (const uid of userIds) {
        const ref = adminDb.collection(FS.USERS).doc(uid);
        batch.delete(ref);
      }
      await batch.commit();

      // 3. Audit Logs
      for (const uid of userIds) {
        await auditLog(
          auth.session.id,
          "DELETE_USER" as any,
          uid,
          { description: `User deleted via bulk action by ${auth.session.id}` }
        );
      }

      return NextResponse.json({ success: true, count: userIds.length });
    }

    return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
  } catch (error: any) {
    console.error("Bulk API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute bulk action" }, { status: 500 });
  }
}
