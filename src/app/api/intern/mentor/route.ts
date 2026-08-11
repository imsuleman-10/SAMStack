import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { MentorAssignment, PlatformUser, MentorProfile } from "@/lib/firestore-schema";

// ─── GET /api/intern/mentor ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["intern", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  // Get active mentor assignment for this intern
  const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
    .where("intern_id", "==", session.id)
    .where("status", "==", "active")
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ mentor: null, assignment: null });
  }

  const assignment = snap.docs[0].data() as MentorAssignment;

  // Get mentor details
  const [mentorSnap, profileSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(assignment.mentor_id).get(),
    adminDb.collection(FS.MENTOR_PROFILES).doc(assignment.mentor_id).get(),
  ]);

  if (!mentorSnap.exists) {
    return NextResponse.json({ mentor: null, assignment });
  }

  const mentorUser = mentorSnap.data() as PlatformUser;
  const mentorProfile = profileSnap.exists ? profileSnap.data() as MentorProfile : null;

  return NextResponse.json({ 
    mentor: { ...mentorUser, mentor_profile: mentorProfile },
    assignment 
  });
}
