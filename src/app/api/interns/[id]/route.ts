import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/interns/[id] (Public Intern Profile) ───────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  
  const [userSnap, profileSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(id).get(),
    adminDb.collection(FS.INTERN_PROFILES).doc(id).get(),
  ]);

  if (!userSnap.exists) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const user = userSnap.data() as PlatformUser;
  
  if (user.role !== "intern" || user.status !== "active" || user.visibility === "private") {
    return NextResponse.json({ error: "Profile not found or is private." }, { status: 404 });
  }

  // Hide PII unless the user is admin, staff, or it's their own profile
  const canSeePII = session.role === "admin" || session.role === "staff" || session.id === id;
  
  if (!canSeePII) {
    delete user.email;
    delete user.phone;
    delete user.address;
    delete user.date_of_birth;
  }

  return NextResponse.json({ 
    user,
    profile: profileSnap.exists ? profileSnap.data() : null
  });
}
