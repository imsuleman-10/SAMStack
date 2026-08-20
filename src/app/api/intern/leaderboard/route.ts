import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS, type PlatformUser, type InternProfile } from "@/lib/firestore-schema";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    // 1. Fetch all task progress that is either 'completed' or 'reviewing'
    const progressSnap = await adminDb.collection("task_progress").get();
    
    // intern_id -> { completed: number, reviewing: number }
    const internStats = new Map<string, { completed: number; reviewing: number }>();
    
    progressSnap.docs.forEach(doc => {
      const data = doc.data();
      const status = data.status;
      const internId = data.intern_id;
      
      if (!internId) return;
      if (status !== 'completed' && status !== 'reviewing') return;

      if (!internStats.has(internId)) {
        internStats.set(internId, { completed: 0, reviewing: 0 });
      }
      
      const stats = internStats.get(internId)!;
      if (status === 'completed') stats.completed++;
      if (status === 'reviewing') stats.reviewing++;
    });

    if (internStats.size === 0) {
      return NextResponse.json({ leaderboard: [], myRank: null });
    }

    // 2. Fetch profiles and users for interns that have points
    const profilesSnap = await adminDb.collection(FS.INTERN_PROFILES).get(); 
    
    const profilesMap = new Map<string, InternProfile>();
    profilesSnap.docs.forEach(doc => {
      const p = doc.data() as InternProfile;
      profilesMap.set(p.user_id || doc.id, p);
    });

    const usersSnap = await adminDb.collection(FS.USERS).where("role", "==", "intern").get();
    const usersMap = new Map<string, PlatformUser>();
    usersSnap.docs.forEach(doc => {
      const u = doc.data();
      usersMap.set(doc.id, { id: doc.id, ...u } as PlatformUser);
    });

    // 3. Assemble and calculate scores
    const leaderboard = [];
    for (const [internId, stats] of internStats.entries()) {
      const user = usersMap.get(internId);
      const profile = profilesMap.get(internId);
      
      if (!user) continue; 

      const score = (stats.completed * 10) + (stats.reviewing * 5);
      
      leaderboard.push({
        user_id: internId,
        full_name: user.full_name || "Unknown Intern",
        avatar_url: user.avatar_url || (user as any).image_url || null, 
        track: profile?.track_selected || "Unassigned",
        completed_tasks: stats.completed,
        reviewing_tasks: stats.reviewing,
        score: score,
      });
    }

    // 4. Sort and assign ranks
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.completed_tasks !== a.completed_tasks) return b.completed_tasks - a.completed_tasks;
      return a.full_name.localeCompare(b.full_name);
    });

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    const myEntry = rankedLeaderboard.find(e => e.user_id === session.id);

    return NextResponse.json({
      leaderboard: rankedLeaderboard.slice(0, 100), 
      myRank: myEntry || null,
    });
    
  } catch (error: any) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
