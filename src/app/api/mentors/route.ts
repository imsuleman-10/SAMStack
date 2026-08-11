import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/mentors (Public Mentor Directory) ──────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  
  let q = adminDb.collection(FS.USERS)
    .where("role", "==", "mentor")
    .where("status", "==", "active")
    .where("visibility", "in", ["public", "organization"]);

  const snapshot = await q.get();
  
  const mentorIds = snapshot.docs.map(d => d.id);
  let profilesMap: Record<string, any> = {};
  
  if (mentorIds.length > 0) {
    const profileSnaps = await adminDb.getAll(...mentorIds.map(id => adminDb!.collection(FS.MENTOR_PROFILES).doc(id)));
    profileSnaps.forEach(p => {
      if (p.exists) profilesMap[p.id] = p.data();
    });
  }

  let mentors = snapshot.docs.map(d => {
    const data = d.data() as PlatformUser;
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
    mentors = mentors.filter(m => 
      m.full_name?.toLowerCase().includes(search) || 
      m.profile?.department?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ mentors });
}
