import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import crypto from "crypto";
import { FS } from "@/lib/firestore-schema";

// POST /api/admin/users/[id]/set-email
// Allows admin to manually update a user's email address.
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
  const { newEmail } = await req.json();

  if (!newEmail || typeof newEmail !== "string" || !newEmail.includes('@')) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  
  const lowerEmail = newEmail.trim().toLowerCase();

  // Load user from Firestore to verify existence
  const userSnap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!userSnap.exists)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const user = userSnap.data()!;
  
  // Check if new email is already in use
  try {
    const existing = await adminAuth.getUserByEmail(lowerEmail);
    if (existing && existing.uid !== id) {
      return NextResponse.json({ error: "The new email address is already in use by another user." }, { status: 400 });
    }
  } catch (err: any) {
    // auth/user-not-found means email is available, which is good.
    if (err.code !== 'auth/user-not-found') {
      console.error(err);
      return NextResponse.json({ error: "Failed to verify email availability." }, { status: 500 });
    }
  }

  try {
    try {
      // Try to update existing Firebase Auth user
      await adminAuth.updateUser(id, { email: lowerEmail, emailVerified: true });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
         // Create new Firebase Auth user if they don't exist yet but we have them in Firestore
         await adminAuth.createUser({
            uid: id,
            email: lowerEmail,
            password: crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) + "Aa1!",
            displayName: user.full_name,
            emailVerified: true,
         });
      } else {
         throw err;
      }
    }
    
    // Update Firestore User Record
    await adminDb.collection(FS.USERS).doc(id).update({
      email: lowerEmail,
      updated_at: new Date().toISOString()
    });
    
    // If intern, update profile as well
    if (user.role === 'intern') {
      const internRef = adminDb.collection(FS.INTERN_PROFILES).doc(id);
      const internSnap = await internRef.get();
      if (internSnap.exists) {
        await internRef.update({ email: lowerEmail, updated_at: new Date().toISOString() });
      }
    }

    await auditLog(session.id, "ADMIN_EDIT_PROFILE", id, {
      action: "admin_set_email",
      oldEmail: user.email,
      newEmail: lowerEmail,
    });

    return NextResponse.json({
      success: true,
      message: `Email successfully updated to ${lowerEmail}`,
    });
  } catch (error: any) {
    console.error("Set email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to set custom email." },
      { status: 500 }
    );
  }
}
