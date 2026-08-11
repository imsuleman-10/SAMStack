import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { MentorAssignment, PlatformUser, InternProfile } from "@/lib/firestore-schema";

// ─── GET /api/mentor/interns ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["mentor", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  // Get active assignments where this user is the mentor
  const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
    .where("mentor_id", "==", session.id)
    .where("status", "==", "active")
    .get();

  if (snap.empty) {
    return NextResponse.json({ interns: [] });
  }

  const assignments = snap.docs.map(d => d.data() as MentorAssignment);
  const internIds = assignments.map(a => a.intern_id);

  // Fetch intern users and profiles
  const [userSnaps, profileSnaps] = await Promise.all([
    adminDb.getAll(...internIds.map(id => adminDb!.collection(FS.USERS).doc(id))),
    adminDb.getAll(...internIds.map(id => adminDb!.collection(FS.INTERN_PROFILES).doc(id))),
  ]);

  const profilesMap: Record<string, InternProfile> = {};
  profileSnaps.forEach(p => {
    if (p.exists) profilesMap[p.id] = p.data() as InternProfile;
  });

  const interns = userSnaps
    .filter(u => u.exists)
    .map(u => {
      const user = u.data() as PlatformUser;
      const assignment = assignments.find(a => a.intern_id === user.id);
      return {
        ...user,
        intern_profile: profilesMap[user.id] || null,
        assignment,
      };
    });

  return NextResponse.json({ interns });
}
