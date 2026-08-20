import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, InternProfile, MentorAssignment } from "@/lib/firestore-schema";
import { generateUniqueCertificateId } from "@/lib/certificate";

// ─── GET /api/mentor/interns/[id] ────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["mentor", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;

  // Verify that this intern is actually assigned to this mentor (unless it's an admin)
  if (session.role === "mentor") {
    const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
      .where("mentor_id", "==", session.id)
      .where("intern_id", "==", id)
      .where("status", "==", "active")
      .limit(1)
      .get();
      
    if (snap.empty) {
      return NextResponse.json({ error: "Access denied. Intern not assigned to you." }, { status: 403 });
    }
  }

  // Fetch intern details
  const [userSnap, profileSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(id).get(),
    adminDb.collection(FS.INTERN_PROFILES).doc(id).get(),
  ]);

  if (!userSnap.exists || (userSnap.data() as PlatformUser).role !== "intern") {
    return NextResponse.json({ error: "Intern not found." }, { status: 404 });
  }

  return NextResponse.json({ 
    intern: userSnap.data(),
    profile: profileSnap.exists ? profileSnap.data() : null
  });
}

// ─── POST /api/mentor/interns/[id] ────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["mentor", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;

  if (session.role === "mentor") {
    const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
      .where("mentor_id", "==", session.id)
      .where("intern_id", "==", id)
      .where("status", "==", "active")
      .limit(1)
      .get();
      
    if (snap.empty) {
      return NextResponse.json({ error: "Access denied. Intern not assigned to you." }, { status: 403 });
    }
  }

  const { action } = await req.json();

  if (action === "approve_certificate") {
    const now = new Date().toISOString();
    const certificateId = await generateUniqueCertificateId(adminDb);
    
    await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(
      { 
        certificate_status: 'approved',
        certificate_id: certificateId,
        updated_at: now
      },
      { merge: true }
    );
    return NextResponse.json({ success: true, certificate_id: certificateId });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
