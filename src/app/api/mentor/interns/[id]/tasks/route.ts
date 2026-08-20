import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request, ["mentor"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id: internId } = await params;
    if (!adminDb) throw new Error("DB not initialized");

    // Check if mentor is actually assigned to this intern
    const assignmentSnap = await adminDb.collection("mentor_assignments")
      .where("mentor_id", "==", auth.session.id)
      .where("intern_id", "==", internId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (assignmentSnap.empty) {
      return NextResponse.json({ error: "Unauthorized access to intern data." }, { status: 403 });
    }

    const snap = await adminDb.collection("task_progress")
      .where("intern_id", "==", internId)
      .get();
      
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Sort tasks by updated_at descending
    tasks.sort((a, b) => new Date((b as any).updated_at || 0).getTime() - new Date((a as any).updated_at || 0).getTime());
    
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("Fetch intern tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
