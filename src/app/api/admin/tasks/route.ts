import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";
import { tracks, getTrackTasks } from "@/lib/curriculum";

// GET  /api/admin/tasks?track=PYTHON   → list tasks for a track (from DB, fallback to curriculum)
// POST /api/admin/tasks                → create a task
// PATCH /api/admin/tasks               → update a task
// DELETE /api/admin/tasks?taskId=xxx   → delete a task

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");

  if (!track) {
    // Return available track list
    const trackList = Object.values(tracks).map((t) => ({
      id: t.id,
      title: t.title,
      desc: t.desc,
    }));
    return NextResponse.json({ tracks: trackList });
  }

  try {
    if (!adminDb) throw new Error("DB not initialized");

    // Fetch custom tasks from DB first — no orderBy to avoid composite index requirement
    const snap = await adminDb
      .collection("track_tasks")
      .where("track_id", "==", track)
      .get();

    if (!snap.empty) {
      const tasks = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => (a.week_number ?? 0) - (b.week_number ?? 0));
      return NextResponse.json({ tasks, source: "database" });
    }

    // Fallback to default curriculum tasks
    const defaultTasks = getTrackTasks(track).map((t, i) => ({
      id: t.id,
      track_id: track,
      title: t.title,
      scope: t.scope,
      criteria: t.criteria,
      week_number: i + 1,
      created_at: new Date().toISOString(),
      isDefault: true,
    }));

    return NextResponse.json({ tasks: defaultTasks, source: "default" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  try {
    if (!adminDb) throw new Error("DB not initialized");

    const { track_id, title, scope, criteria, week_number } = await request.json();

    if (!track_id || !title || !scope || !criteria) {
      return NextResponse.json({ error: "track_id, title, scope, and criteria are required" }, { status: 400 });
    }

    const ref = adminDb.collection("track_tasks").doc();
    const task = {
      id: ref.id,
      track_id,
      title,
      scope,
      criteria,
      week_number: week_number || 1,
      created_by: auth.session.id,
      created_at: new Date().toISOString(),
    };

    await ref.set(task);
    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  try {
    if (!adminDb) throw new Error("DB not initialized");

    const { taskId, title, scope, criteria, week_number } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    const ref = adminDb.collection("track_tasks").doc(taskId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (scope !== undefined) updates.scope = scope;
    if (criteria !== undefined) updates.criteria = criteria;
    if (week_number !== undefined) updates.week_number = week_number;

    await ref.update(updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  try {
    if (!adminDb) throw new Error("DB not initialized");

    await adminDb.collection("track_tasks").doc(taskId).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
