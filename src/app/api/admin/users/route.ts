import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, UserRole, AccountStatus } from "@/lib/firestore-schema";

// ─── GET /api/admin/users — paginated, searchable user list ──────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;

  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "25"));

  let q = adminDb.collection(FS.USERS) as FirebaseFirestore.Query;
  if (role) q = q.where("role", "==", role);
  if (status) q = q.where("status", "==", status);
  q = q.orderBy("created_at", "desc");

  const snapshot = await q.get();
  let users = snapshot.docs.map(d => d.data() as PlatformUser);

  if (search) {
    users = users.filter(
      u =>
        u.full_name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.username?.toLowerCase().includes(search)
    );
  }

  const total = users.length;
  const paginated = users.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ users: paginated, total, page, limit, pages: Math.ceil(total / limit) });
}

// ─── POST /api/admin/users — create user ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  if (!adminDb || !adminAuth)
    return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const body = await req.json();
  const { full_name, email, password, role, phone, department, position, status = "active", avatar_url } =
    body as {
      full_name: string; email: string; password: string; role: UserRole;
      phone?: string; department?: string; position?: string;
      status?: AccountStatus; avatar_url?: string;
    };

  if (!full_name || !email || !password || !role)
    return NextResponse.json({ error: "full_name, email, password, and role are required." }, { status: 400 });

  const allowedRoles: UserRole[] = ["intern", "mentor", "staff", "member", "user"];
  if (!allowedRoles.includes(role))
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });

  try {
    const fbUser = await adminAuth.createUser({ email, password, displayName: full_name });
    const now = new Date().toISOString();
    const userDoc: PlatformUser = {
      id: fbUser.uid, full_name: full_name.trim(), email: email.toLowerCase(),
      phone: phone ?? null, avatar_url: avatar_url ?? null, role, status,
      visibility: "organization", skills: [], created_at: now, updated_at: now,
    };
    await adminDb.collection(FS.USERS).doc(fbUser.uid).set(userDoc);

    if (role === "intern") {
      await adminDb.collection(FS.INTERN_PROFILES).doc(fbUser.uid).set({
        user_id: fbUser.uid, department: department ?? null, position: position ?? null, created_at: now, updated_at: now,
      });
    } else if (role === "mentor") {
      await adminDb.collection(FS.MENTOR_PROFILES).doc(fbUser.uid).set({
        user_id: fbUser.uid, department: department ?? null, designation: position ?? null, created_at: now, updated_at: now,
      });
    } else if (role === "staff") {
      await adminDb.collection(FS.STAFF_PROFILES).doc(fbUser.uid).set({
        user_id: fbUser.uid, department: department ?? null, position: position ?? null, created_at: now, updated_at: now,
      });
    }

    await auditLog(session.id, "CREATE_USER", fbUser.uid, { role, email });
    return NextResponse.json({ success: true, id: fbUser.uid }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Create user error:", msg);
    if (msg.includes("email-already-exists"))
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
