import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail } from "@/lib/mailer";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";
import crypto from "crypto";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("CRITICAL: JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
};

async function getSessionUser() {
  const cookieStore = await cookies();
  // Prefer unified session_token, fall back to legacy cookies
  const token =
    cookieStore.get("session_token")?.value ||
    cookieStore.get("user_token")?.value ||
    cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

// GET: Fetch data for current user's dashboard
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!adminDb) return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
  const adb = createAdminDb(adminDb);

  try {
    // ── profile ────────────────────────────────────────────────────
    if (type === "profile") {
      const fsUser = await adb.users.get(user.id);
      if (!fsUser) return NextResponse.json({ profile: null });
      const internProfile = await adb.internProfiles.get(user.id);
      return NextResponse.json({
        profile: {
          ...fsUser,
          intern_profiles: internProfile ? [internProfile] : [],
        },
      });
    }

    // ── my_tasks ───────────────────────────────────────────────────
    if (type === "my_tasks") {
      const internProfile = await adb.internProfiles.get(user.id);

      if (!internProfile?.track_selected) {
        return NextResponse.json({ tasks: [], current_week: 1 });
      }

      // Calculate current week
      const startDate = new Date(internProfile.start_date || internProfile.created_at);
      const today = new Date();
      const msPerWeek = 1000 * 60 * 60 * 24 * 7;
      const weeksSinceStart = Math.max(
        1,
        Math.floor((today.getTime() - startDate.getTime()) / msPerWeek) + 1
      );
      const currentWeek = Math.min(weeksSinceStart, 5);

      // Fetch track tasks and progress in parallel
      const [tasks, progressList] = await Promise.all([
        adb.trackTasks.list([internProfile.track_selected]),
        adb.taskProgress.listForIntern(user.id),
      ]);

      const completionMap = new Map(progressList.map(p => [p.task_id, p]));

      // Fetch mentor info if assigned
      let personalMentorName: string | null = null;
      let personalMentorImage: string | null = null;
      let personalMentorId: string | null = internProfile.assigned_mentor_id || null;

      if (personalMentorId) {
        const mentorUser = await adb.users.get(personalMentorId);
        personalMentorName = mentorUser?.full_name || null;
        personalMentorImage = mentorUser?.image_url || null;
      }

      // Fallback: find any mentor for this track
      if (!personalMentorImage) {
        const allMentors = await adb.users.list('mentor');
        const trackMentor = allMentors.find(
          m => m.assigned_tracks?.includes(internProfile.track_selected!) && m.image_url
        );
        if (trackMentor) {
          if (!personalMentorImage) personalMentorImage = trackMentor.image_url;
          if (!personalMentorName) personalMentorName = trackMentor.full_name;
        }
      }

      // Fetch individual task mentor info
      const mentorIds = [...new Set(tasks.map(t => t.mentor_id).filter(Boolean))];
      const mentorDocs = await Promise.all(mentorIds.map(mid => adb.users.get(mid)));
      const mentorMap = new Map<string, { name: string; image: string | null }>();
      mentorDocs.forEach(m => {
        if (m) mentorMap.set(m.id, { name: m.full_name, image: m.image_url });
      });

      const tasksWithStatus = tasks.map(t => {
        const progress = completionMap.get(t.id);
        const taskMentor = mentorMap.get(t.mentor_id);
        return {
          ...t,
          mentor_name: taskMentor?.name || personalMentorName || "SAMStack Staff",
          mentor_image: taskMentor?.image || personalMentorImage || null,
          mentor_id: t.mentor_id || personalMentorId || null,
          unlocked: t.week_number <= currentWeek,
          status: progress?.status || "pending",
          submission_link: progress?.submission_link || null,
          mentor_feedback: progress?.mentor_feedback || null,
        };
      });

      return NextResponse.json({ tasks: tasksWithStatus, current_week: currentWeek });
    }

    // ── mentor_interns ─────────────────────────────────────────────
    if (type === "mentor_interns") {
      const mentorUser = await adb.users.get(user.id);
      const assignedTracks: string[] = mentorUser?.assigned_tracks || [];
      const mentorGender: string | null = mentorUser?.gender || null;

      const interns = await adb.internProfiles.getByMentorTracks(assignedTracks, mentorGender);

      return NextResponse.json({ interns, mentorTracks: assignedTracks });
    }

    // ── track_tasks ────────────────────────────────────────────────
    if (type === "track_tasks") {
      const mentorUser = await adb.users.get(user.id);
      const assignedTracks: string[] = mentorUser?.assigned_tracks || [];
      if (assignedTracks.length === 0) return NextResponse.json({ tasks: [] });

      const tasks = await adb.trackTasks.list(assignedTracks);

      // Attach mentor name
      const tasksWithMentor = tasks.map(t => ({
        ...t,
        mentor_name: mentorUser?.full_name || null,
      }));

      return NextResponse.json({ tasks: tasksWithMentor });
    }

    // ── complaints ─────────────────────────────────────────────────
    if (type === "complaints") {
      let complaints;
      if (user.role === "intern") {
        complaints = await adb.complaints.list(user.id);
      } else {
        complaints = await adb.complaints.listWithUsers();
      }
      return NextResponse.json({ complaints });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Submit task completion, complaints, profile updates, etc.
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, payload } = await request.json();
  if (!adminDb) return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
  const adb = createAdminDb(adminDb);

  try {
    // ── complete_task ──────────────────────────────────────────────
    if (action === "complete_task") {
      const { task_id, submission_url, notes } = payload;
      await adb.taskProgress.upsert(user.id, task_id, {
        status: "completed",
        submission_link: submission_url || null,
        mentor_feedback: notes || null,
      });
      return NextResponse.json({ success: true, message: "Task marked as complete!" });
    }

    // ── submit_onboarding ──────────────────────────────────────────
    if (action === "submit_onboarding") {
      const { track, university, degree, city, cgpa, github, linkedIn, phone, email, gender } = payload;

      if (!track) {
        return NextResponse.json({ error: "Track is required" }, { status: 400 });
      }

      const uppercaseTrack = track.toUpperCase();
      const trackCodes: Record<string, string> = {
        PYTHON: "PY", UI_UX: "UX", CPP: "CP", WEB_DEV: "WD", REACT: "RX", NEXT_JS: "NJ", MERN: "MN",
      };
      const code = trackCodes[uppercaseTrack] || "IN";
      const ts = Date.now();
      const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
      const rollNumber = `SAM-${code}-${ts}-${rand}`;

      const userData = await adb.users.get(user.id);
      const phoneNumberToSave = phone?.trim() || userData?.phone_number || "";

      // Update user fields
      const userUpdates: Record<string, any> = {};
      if (phoneNumberToSave && phoneNumberToSave !== userData?.phone_number)
        userUpdates.phone_number = phoneNumberToSave;
      if (email?.trim() && !userData?.email)
        userUpdates.email = email.trim().toLowerCase();
      if (gender && !userData?.gender)
        userUpdates.gender = gender.toUpperCase();
      if (Object.keys(userUpdates).length > 0) {
        await adb.users.update(user.id, userUpdates);
      }

      // Upsert intern profile
      const now = new Date().toISOString();
      await adb.internProfiles.upsert(user.id, {
        user_id: user.id,
        track_selected: uppercaseTrack,
        university: university?.trim() || null,
        degree: degree?.trim() || null,
        city: city?.trim() || null,
        cgpa: cgpa?.trim() || null,
        linkedin_url: linkedIn?.trim() || null,
        github_url: github?.trim() || null,
        roll_number: rollNumber,
        phone_number: phoneNumberToSave,
        email: email?.trim().toLowerCase() || userData?.email || null,
        application_status: 'APPLIED',
        start_date: now.split("T")[0],
        enrolled_at: now,
      });

      // Send Offer Letter async
      const offerEmail = email?.trim() || userData?.email || "";
      if (offerEmail && offerEmail.includes("@")) {
        const trackTitle = tracks[uppercaseTrack as keyof typeof tracks]?.title || uppercaseTrack;
        (async () => {
          try {
            const dateStr = new Date().toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            });
            const pdfBuffer = await generateOfferLetterPDF({
              fullName: userData?.full_name || "Intern",
              rollNumber,
              track: trackTitle,
              date: dateStr,
            });
            await sendOfferLetterEmail(
              offerEmail, userData?.full_name || "Intern", rollNumber, trackTitle, pdfBuffer
            );
          } catch (e) {
            console.error("[Onboarding] Offer letter email error:", e);
          }
        })();
      }

      return NextResponse.json({
        success: true,
        message: "Profile completed successfully!",
        rollNumber,
      });
    }

    // ── submit_complaint ───────────────────────────────────────────
    if (action === "submit_complaint") {
      const { title, description } = payload;
      await adb.complaints.create(user.id, title, description);
      return NextResponse.json({ success: true, message: "Ticket submitted successfully." });
    }

    // ── update_profile ─────────────────────────────────────────────
    if (action === "update_profile") {
      const { full_name, avatar_url, phone, university, degree, city, linkedin, github, gender } = payload;

      const userUpdates: Record<string, any> = { full_name };
      if (avatar_url) userUpdates.image_url = avatar_url;
      if (phone) userUpdates.phone_number = phone;
      if (gender) userUpdates.gender = gender;
      await adb.users.update(user.id, userUpdates);

      // Update intern profile fields
      if (university || degree || city || linkedin !== undefined || github !== undefined || phone) {
        const internUpdates: Record<string, any> = {};
        if (university) internUpdates.university = university;
        if (degree) internUpdates.degree = degree;
        if (city) internUpdates.city = city;
        if (linkedin !== undefined) internUpdates.linkedin_url = linkedin;
        if (github !== undefined) internUpdates.github_url = github;
        if (phone) internUpdates.phone_number = phone;

        if (Object.keys(internUpdates).length > 0) {
          await adb.internProfiles.upsert(user.id, internUpdates);
        }
      }

      return NextResponse.json({ success: true, message: "Profile updated!" });
    }

    // ── update_complaint_status ────────────────────────────────────
    if (action === "update_complaint_status") {
      if (user.role !== "support" && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { complaint_id, status } = payload;
      await adb.complaints.updateStatus(complaint_id, status);
      return NextResponse.json({ success: true });
    }

    // ── add_track_task ─────────────────────────────────────────────
    if (action === "add_track_task") {
      if (user.role !== "mentor" && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden — Only mentors can add tasks" }, { status: 403 });
      }
      const { track_id, title, scope, criteria, week_number } = payload;
      if (!track_id || !title || !scope) {
        return NextResponse.json({ error: "track_id, title and scope are required" }, { status: 400 });
      }

      // Verify mentor is assigned to this track
      if (user.role !== "admin") {
        const mentorUser = await adb.users.get(user.id);
        const assigned: string[] = mentorUser?.assigned_tracks || [];
        if (!assigned.includes(track_id)) {
          return NextResponse.json({ error: "You are not assigned to this track" }, { status: 403 });
        }
      }

      const resolvedWeek = Math.max(1, Math.min(5, parseInt(week_number) || 1));
      await adb.trackTasks.create({
        track_id,
        mentor_id: user.id,
        title: title.trim(),
        scope: scope.trim(),
        criteria: criteria?.trim() || '',
        week_number: resolvedWeek,
      });
      return NextResponse.json({ success: true, message: "Task added successfully" });
    }

    // ── edit_track_task ────────────────────────────────────────────
    if (action === "edit_track_task") {
      if (user.role !== "mentor" && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { task_id, title, scope, criteria, week_number } = payload;
      if (!task_id || !title || !scope) {
        return NextResponse.json({ error: "task_id, title and scope are required" }, { status: 400 });
      }

      // Verify ownership for non-admin
      if (user.role !== "admin") {
        const task = await adb.trackTasks.get(task_id);
        if (task?.mentor_id !== user.id) {
          return NextResponse.json({ error: "Forbidden — you can only edit your own tasks" }, { status: 403 });
        }
      }

      const resolvedWeek = Math.max(1, Math.min(5, parseInt(week_number) || 1));
      await adb.trackTasks.update(task_id, {
        title: title.trim(),
        scope: scope.trim(),
        criteria: criteria?.trim() || '',
        week_number: resolvedWeek,
      });
      return NextResponse.json({ success: true, message: "Task updated successfully" });
    }

    // ── delete_track_task ──────────────────────────────────────────
    if (action === "delete_track_task") {
      if (user.role !== "mentor" && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { task_id } = payload;
      // Pass mentorId for ownership check (admin bypasses)
      await adb.trackTasks.delete(task_id, user.role !== "admin" ? user.id : undefined);
      return NextResponse.json({ success: true, message: "Task deleted" });
    }

    // ── change_password ────────────────────────────────────────────
    if (action === "change_password") {
      const { newPassword } = payload;
      if (!newPassword || newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }
      await adminAuth!.updateUser(user.id, { password: newPassword.trim() });
      return NextResponse.json({ success: true, message: "Password updated successfully." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Dashboard POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
