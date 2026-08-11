import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { notifyMentorAssigned, notifyMentorChanged, notifyMentorRemoved } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { MentorAssignment, PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/admin/mentor-assignments ───────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "active";

  const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
    .where("status", "==", status)
    .orderBy("assigned_at", "desc")
    .get();

  const assignments = snap.docs.map(d => d.data() as MentorAssignment);

  // Hydrate with user names
  const userIds = new Set<string>();
  assignments.forEach(a => { userIds.add(a.intern_id); userIds.add(a.mentor_id); });

  const userSnaps = await Promise.all(
    [...userIds].map(uid => adminDb!.collection(FS.USERS).doc(uid).get())
  );
  const usersMap: Record<string, PlatformUser> = {};
  userSnaps.forEach(s => { if (s.exists) usersMap[s.id] = s.data() as PlatformUser; });

  const enriched = assignments.map(a => ({
    ...a,
    intern: usersMap[a.intern_id] ?? null,
    mentor: usersMap[a.mentor_id] ?? null,
  }));

  return NextResponse.json({ assignments: enriched });
}

// ─── POST /api/admin/mentor-assignments — create or reassign ─────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { intern_id, mentor_id } = await req.json() as { intern_id: string; mentor_id: string };
  if (!intern_id || !mentor_id)
    return NextResponse.json({ error: "intern_id and mentor_id are required." }, { status: 400 });

  // Validate both users exist and have correct roles
  const [internSnap, mentorSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(intern_id).get(),
    adminDb.collection(FS.USERS).doc(mentor_id).get(),
  ]);
  if (!internSnap.exists || (internSnap.data() as PlatformUser).role !== "intern")
    return NextResponse.json({ error: "Intern not found." }, { status: 404 });
  if (!mentorSnap.exists || (mentorSnap.data() as PlatformUser).role !== "mentor")
    return NextResponse.json({ error: "Mentor not found." }, { status: 404 });

  const internData = internSnap.data() as PlatformUser;
  const mentorData = mentorSnap.data() as PlatformUser;
  const now = new Date().toISOString();
  let isReassignment = false;
  let oldMentorId: string | null = null;

  // End any existing active assignment for this intern
  const existingSnap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
    .where("intern_id", "==", intern_id)
    .where("status", "==", "active")
    .get();

  const batch = adminDb.batch();

  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0].data() as MentorAssignment;
    oldMentorId = existing.mentor_id;

    if (existing.mentor_id === mentor_id)
      return NextResponse.json({ error: "This intern is already assigned to this mentor." }, { status: 409 });

    batch.update(existingSnap.docs[0].ref, { status: "ended", ended_at: now, updated_at: now });
    isReassignment = true;
  }

  // Create new assignment
  const newRef = adminDb.collection(FS.MENTOR_ASSIGNMENTS).doc();
  const newAssignment: MentorAssignment = {
    id: newRef.id,
    mentor_id,
    intern_id,
    assigned_by: session.id,
    status: "active",
    assigned_at: now,
    ended_at: null,
    created_at: now,
    updated_at: now,
  };
  batch.set(newRef, newAssignment);
  await batch.commit();

  // Audit & notifications
  const action = isReassignment ? "REASSIGN_MENTOR" : "ASSIGN_MENTOR";
  await auditLog(session.id, action, intern_id, { mentor_id, intern_id, old_mentor_id: oldMentorId });

  if (isReassignment && oldMentorId) {
    await notifyMentorChanged(intern_id, oldMentorId, mentor_id, mentorData.full_name, internData.full_name);
  } else {
    await notifyMentorAssigned(intern_id, mentor_id, mentorData.full_name, internData.full_name);
  }

  return NextResponse.json({ success: true, assignment: newAssignment }, { status: 201 });
}
