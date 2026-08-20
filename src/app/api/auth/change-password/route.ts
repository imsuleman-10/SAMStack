import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";

// POST /api/auth/change-password
// Allows any logged-in user to change their own password.
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  if (!adminAuth)
    return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });

  const { newPassword } = await req.json();

  if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
  }

  try {
    await adminAuth.updateUser(session.id, { password: newPassword.trim() });
    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err: any) {
    console.error("[change-password]", err);
    return NextResponse.json({ error: err.message || "Failed to update password." }, { status: 500 });
  }
}
