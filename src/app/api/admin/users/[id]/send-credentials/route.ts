import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { FS, UserRole } from "@/lib/firestore-schema";
import { sendWelcomeEmailWithPassword } from "@/lib/mailer";
import crypto from "crypto";

// POST /api/admin/users/[id]/send-credentials
// Creates (or resets) Firebase Auth for the user and emails them their credentials.
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

  // Load user from Firestore
  const userSnap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!userSnap.exists)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const user = userSnap.data()!;
  if (!user.email)
    return NextResponse.json({ error: "User has no email address on file" }, { status: 400 });

  // Generate a strong temp password: Name123!XXXX
  const namePart = (user.full_name as string)?.split(" ")[0]?.replace(/[^a-zA-Z]/g, "") || "User";
  const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  const tempPassword = `${namePart.charAt(0).toUpperCase()}${namePart.slice(1)}@${randomPart}99!`;

  try {
    // Try to get existing auth user
    let fbUid: string;
    try {
      const existing = await adminAuth.getUserByEmail(user.email);
      // Reset password for existing user
      await adminAuth.updateUser(existing.uid, { password: tempPassword, emailVerified: true });
      fbUid = existing.uid;
    } catch {
      // Create new Firebase Auth user
      const newUser = await adminAuth.createUser({
        uid: id, // Use Firestore doc id as UID for consistency
        email: user.email,
        password: tempPassword,
        displayName: user.full_name,
        emailVerified: true,
      });
      fbUid = newUser.uid;
    }

    // Send credentials email
    await sendWelcomeEmailWithPassword(
      user.email,
      user.full_name,
      tempPassword,
      user.role
    );

    // Update Firestore to mark credentials as sent
    await adminDb.collection(FS.USERS).doc(id).update({
      credentials_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await auditLog(session.id, "ADMIN_EDIT_PROFILE", id, {
      action: "send_credentials",
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      message: `Login credentials sent to ${user.email}`,
      email: user.email,
    });
  } catch (err: any) {
    console.error("[send-credentials]", err);
    return NextResponse.json({ error: err.message || "Failed to send credentials" }, { status: 500 });
  }
}
