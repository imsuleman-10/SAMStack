import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/interns (Public Intern Directory) ──────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  
  // Only return active profiles with visibility != private
  let q = adminDb.collection(FS.USERS)
    .where("role", "==", "intern")
    .where("status", "==", "active")
    .where("visibility", "in", ["public", "organization"]);

  const snapshot = await q.get();
  
  // We'll also fetch their profiles to show department etc.
  const internIds = snapshot.docs.map(d => d.id);
  let profilesMap: Record<string, any> = {};
  
  if (internIds.length > 0) {
    const profileSnaps = await adminDb.getAll(...internIds.map(id => adminDb!.collection(FS.INTERN_PROFILES).doc(id)));
    profileSnaps.forEach(p => {
      if (p.exists) profilesMap[p.id] = p.data();
    });
  }

  let interns = snapshot.docs.map(d => {
    const data = d.data() as PlatformUser;
    // Hide email/phone unless it's an admin/staff or they are in organization
    return {
      id: data.id,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role: data.role,
      skills: data.skills,
      profile: profilesMap[data.id] || null,
    };
  });

  if (search) {
    interns = interns.filter(i => 
      i.full_name?.toLowerCase().includes(search) || 
      i.profile?.department?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ interns });
}
