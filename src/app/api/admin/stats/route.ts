import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, isAuthError } from '@/lib/session';
import { FS } from '@/lib/firestore-schema';

// GET /api/admin/stats — returns counts per role + status without loading all users into memory
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['admin', 'staff']);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: 'DB not available' }, { status: 500 });

  const usersRef = adminDb.collection(FS.USERS);

  // ─── Core counts ────────────────────────────────────────────────────────
  const [totalSnap, internSnap, mentorSnap, staffSnap, activeSnap] = await Promise.all([
    usersRef.count().get(),
    usersRef.where('role', '==', 'intern').count().get(),
    usersRef.where('role', '==', 'mentor').count().get(),
    usersRef.where('role', '==', 'staff').count().get(),
    usersRef.where('status', '==', 'active').count().get(),
  ]);

  // ─── Track distribution (from intern profiles) ───────────────────────
  const tracks = ['REACT', 'PYTHON', 'NODE', 'UI_UX', 'FLUTTER', 'DEVOPS'];
  const trackCounts = await Promise.all(
    tracks.map(track =>
      adminDb!.collection(FS.INTERN_PROFILES).where('track_selected', '==', track).count().get()
    )
  );
  const trackDistribution = tracks.map((track, i) => ({
    name: track.replace('_', '/').
      replace('REACT', 'React').replace('PYTHON', 'Python').replace('NODE', 'Node.js')
      .replace('UI/', 'UI/').replace('UX', 'UX').replace('FLUTTER', 'Flutter').replace('DEVOPS', 'DevOps'),
    value: trackCounts[i].data().count,
  })).filter(t => t.value > 0);

  // ─── Role distribution for pie chart ─────────────────────────────────
  const memberSnap = await usersRef.where('role', '==', 'member').count().get();
  const roleDistribution = [
    { name: 'Interns',  value: internSnap.data().count,  color: '#22d3ee' },
    { name: 'Mentors',  value: mentorSnap.data().count,  color: '#a78bfa' },
    { name: 'Staff',    value: staffSnap.data().count,   color: '#34d399' },
    { name: 'Members',  value: memberSnap.data().count,  color: '#fb923c' },
  ].filter(r => r.value > 0);

  // ─── Weekly registrations (last 8 weeks) ────────────────────────────
  // NOTE: Range queries on created_at may require a Firestore index.
  // We catch index errors and gracefully return zeros.
  const now = new Date();
  const weeklyRegs: { week: string; users: number }[] = [];
  try {
    for (let w = 7; w >= 0; w--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (w + 1) * 7);
      const end = new Date(now);
      end.setDate(now.getDate() - w * 7);
      const snap = await usersRef
        .where('created_at', '>=', start.toISOString())
        .where('created_at', '<', end.toISOString())
        .count().get();
      weeklyRegs.push({ week: `W${8 - w}`, users: snap.data().count });
    }
  } catch {
    // Index not yet created — return placeholder zeros
    for (let w = 7; w >= 0; w--) {
      weeklyRegs.push({ week: `W${8 - w}`, users: 0 });
    }
  }

  // ─── Task completion stats ───────────────────────────────────────────
  const [pendingTasksSnap, completedTasksSnap, reviewingTasksSnap] = await Promise.all([
    adminDb.collection('task_progress').where('status', '==', 'pending').count().get(),
    adminDb.collection('task_progress').where('status', '==', 'completed').count().get(),
    adminDb.collection('task_progress').where('status', '==', 'reviewing').count().get(),
  ]);
  const taskStats = [
    { name: 'Completed', value: completedTasksSnap.data().count, color: '#34d399' },
    { name: 'Reviewing', value: reviewingTasksSnap.data().count, color: '#fbbf24' },
    { name: 'Pending',   value: pendingTasksSnap.data().count,   color: '#6b7280' },
  ];

  return NextResponse.json({
    total:   totalSnap.data().count,
    interns: internSnap.data().count,
    mentors: mentorSnap.data().count,
    staff:   staffSnap.data().count,
    active:  activeSnap.data().count,
    // Chart data
    trackDistribution,
    roleDistribution,
    weeklyRegistrations: weeklyRegs,
    taskStats,
  });
}
