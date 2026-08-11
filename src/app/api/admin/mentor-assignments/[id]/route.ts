import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { notifyMentorRemoved } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { MentorAssignment, PlatformUser } from "@/lib/firestore-schema";

// ─── DELETE /api/admin/mentor-assignments/[id] ───────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  
  const snap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  
  const assignment = snap.data() as MentorAssignment;
  
  if (assignment.status !== "active") {
    return NextResponse.json({ error: "Cannot remove an inactive assignment." }, { status: 400 });
  }

  try {
    const now = new Date().toISOString();
    await adminDb.collection(FS.MENTOR_ASSIGNMENTS).doc(id).update({
      status: "removed",
      ended_at: now,
      updated_at: now,
    });

    await auditLog(session.id, "REMOVE_MENTOR_ASSIGNMENT", assignment.intern_id, { 
      mentor_id: assignment.mentor_id,
      assignment_id: id 
    });

    // Notify the intern
    const internSnap = await adminDb.collection(FS.USERS).doc(assignment.intern_id).get();
    const internName = internSnap.exists ? (internSnap.data() as PlatformUser).full_name : "An intern";
    await notifyMentorRemoved(assignment.intern_id, assignment.mentor_id, internName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ error: "Failed to remove assignment." }, { status: 500 });
  }
}
