import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { FS } from "@/lib/firestore-schema";

// POST /api/admin/users/[id]/set-password
// Allows admin to manually set/edit a user's password.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  if (!adminAuth || !adminDb)
    return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });

  const { id } = await params;
  const { newPassword } = await req.json();

  if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
  }

  // Load user from Firestore to get email
  const userSnap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!userSnap.exists)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const user = userSnap.data()!;
  if (!user.email)
    return NextResponse.json({ error: "User has no email address on file" }, { status: 400 });

  try {
    try {
      const existing = await adminAuth.getUserByEmail(user.email);
      // Update password for existing user
      await adminAuth.updateUser(existing.uid, { password: newPassword.trim(), emailVerified: true });
    } catch {
      // Create new Firebase Auth user if they don't exist yet
      await adminAuth.createUser({
        uid: id,
        email: user.email,
        password: newPassword.trim(),
        displayName: user.full_name,
        emailVerified: true,
      });
    }

    await auditLog(session.id, "ADMIN_EDIT_PROFILE", id, {
      action: "admin_set_password",
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      message: `Password manually updated for ${user.email}`,
    });
  } catch (err: any) {
    console.error("[set-password]", err);
    return NextResponse.json({ error: err.message || "Failed to set password" }, { status: 500 });
  }
}
