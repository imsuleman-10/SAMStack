import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { notifyRoleChanged, notifyAccountStatusChanged } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, UserRole, AccountStatus } from "@/lib/firestore-schema";

// ─── GET /api/admin/users/[id] ───────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  const snap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Fetch role-specific profile
  const user = snap.data() as PlatformUser;
  let roleProfile = null;
  let staffProfile = null;
  if (user.role === "intern") {
    const p = await adminDb.collection(FS.INTERN_PROFILES).doc(id).get();
    if (p.exists) roleProfile = p.data();
  } else if (user.role === "mentor") {
    const p = await adminDb.collection(FS.MENTOR_PROFILES).doc(id).get();
    if (p.exists) roleProfile = p.data();
  } else if (user.role === "staff") {
    const p = await adminDb.collection(FS.STAFF_PROFILES).doc(id).get();
    if (p.exists) {
      roleProfile = p.data();
      staffProfile = p.data();
    }
  }

  // Fetch active mentor assignment (with mentor's name)
  let mentorAssignment = null;
  if (user.role === "intern") {
    const aSnap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
      .where("intern_id", "==", id)
      .where("status", "==", "active")
      .limit(1)
      .get();
    if (!aSnap.empty) {
      const assignment = aSnap.docs[0].data();
      // Fetch mentor's name
      let mentorName = '';
      try {
        const mentorSnap = await adminDb.collection(FS.USERS).doc(assignment.mentor_id).get();
        if (mentorSnap.exists) mentorName = (mentorSnap.data() as any).full_name || '';
      } catch { /* silent */ }
      mentorAssignment = { ...assignment, mentor_name: mentorName };
    }
  }

  return NextResponse.json({ user, roleProfile, staffProfile, mentorAssignment });
}

// ─── PATCH /api/admin/users/[id] ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  const body = await req.json();

  const snap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const existing = snap.data() as PlatformUser;

  const allowedFields: (keyof PlatformUser)[] = [
    "full_name", "phone", "avatar_url", "bio", "city", "country", "region", "language",
    "date_of_birth", "gender", "address", "skills", "social_links", "visibility",
  ];

  const updates: Partial<PlatformUser> = { updated_at: new Date().toISOString() };
  for (const field of allowedFields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }

  // Handle role change
  if (body.role && body.role !== existing.role) {
    updates.role = body.role as UserRole;
    await auditLog(session.id, "CHANGE_ROLE", id, { from: existing.role, to: body.role });
    await notifyRoleChanged(id, body.role);
  }

  // Handle status change
  if (body.status && body.status !== existing.status) {
    updates.status = body.status as AccountStatus;
    await auditLog(session.id, "CHANGE_STATUS", id, { from: existing.status, to: body.status });
    if (["active", "suspended", "inactive"].includes(body.status)) {
      await notifyAccountStatusChanged(id, body.status);
    }
  }

  await adminDb.collection(FS.USERS).doc(id).update(updates);

  // Update intern-specific profile fields if present
  if (existing.role === "intern" || body.role === "intern") {
    const internAllowed = ["track_selected", "university", "department", "semester", "position", "joining_date", "end_date", "status"] as const;
    const internUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const field of internAllowed) {
      if (field in body) internUpdates[field] = body[field];
    }
    if (Object.keys(internUpdates).length > 1) {
      await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(internUpdates, { merge: true });
    }
  }

  await auditLog(session.id, "ADMIN_EDIT_PROFILE", id, { fields: Object.keys(updates) });

  return NextResponse.json({ success: true });
}

// ─── DELETE /api/admin/users/[id] ────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb || !adminAuth) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;

  // Cannot delete yourself
  if (id === session.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

  const snap = await adminDb.collection(FS.USERS).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const user = snap.data() as PlatformUser;

  try {
    // Delete Firebase Auth user
    await adminAuth.deleteUser(id).catch(() => {});

    // Delete Firestore documents
    const batch = adminDb.batch();
    batch.delete(adminDb.collection(FS.USERS).doc(id));
    batch.delete(adminDb.collection(FS.INTERN_PROFILES).doc(id));
    batch.delete(adminDb.collection(FS.MENTOR_PROFILES).doc(id));
    batch.delete(adminDb.collection(FS.STAFF_PROFILES).doc(id));
    await batch.commit();

    await auditLog(session.id, "DELETE_USER", id, { email: user.email, role: user.role });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
