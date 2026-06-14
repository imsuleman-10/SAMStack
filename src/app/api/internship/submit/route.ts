import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, rollNumber, githubUrl, liveUrl, figmaUrl, notes, completedTasks } = body;

    // Essential validation
    if (!email || !rollNumber) {
      return NextResponse.json({ error: "Registered email address and Roll Number are required." }, { status: 400 });
    }

    // Verify candidate in database
    const intern = await db.interns.getByEmailAndRoll(email, rollNumber);
    if (!intern) {
      return NextResponse.json({ 
        error: "Applicant credential verification failed. No registered record matched that email & Roll Number combination." 
      }, { status: 404 });
    }

    // Enforce submission state lock (prevent duplicate submissions)
    if (intern.status === "APPROVED") {
      return NextResponse.json({ error: "This internship has already been APPROVED and verified. Submission locked." }, { status: 400 });
    }

    // Field-specific validation rules
    if (!githubUrl || !githubUrl.trim().toLowerCase().startsWith("https://github.com/")) {
      return NextResponse.json({ error: "A valid, secure GitHub repository URL (starting with 'https://github.com/') is required." }, { status: 400 });
    }

    if (intern.trackSelected === "UI_UX") {
      if (!figmaUrl || !figmaUrl.trim().toLowerCase().startsWith("https://")) {
        return NextResponse.json({ error: "UI/UX track submissions must include a valid Figma project link (starting with 'https://')." }, { status: 400 });
      }
    } else {
      if (!liveUrl || !liveUrl.trim().toLowerCase().startsWith("https://")) {
        return NextResponse.json({ error: "A valid live staging deployment URL (starting with 'https://') is required." }, { status: 400 });
      }
    }

    // Validate checklist completion (minimum 3 tasks out of 5 required)
    if (!Array.isArray(completedTasks) || completedTasks.length < 3) {
      return NextResponse.json({ error: "Honor Code Violation: You must complete and check at least 3 out of the 5 specialized tasks." }, { status: 400 });
    }

    // Format submission package — Firestore rejects `undefined` values, so we build the object cleanly
    const submissionData: Record<string, unknown> = {
      submissionTimestamp: new Date().toISOString(),
      githubRepositoryUrl: githubUrl.trim(),
      studentNotes: (notes || "").trim(),
      completedTaskCount: completedTasks.length,
      completedTasks: completedTasks.map(Number),
    };
    // Only add optional URL fields if they have a real value
    if (liveUrl && liveUrl.trim()) submissionData.liveDeploymentUrl = liveUrl.trim();
    if (figmaUrl && figmaUrl.trim()) submissionData.figmaProjectUrl = figmaUrl.trim();

    // Commit to database
    const committed = await db.interns.submitWork(intern.rollNumber, submissionData);
    if (!committed) {
      return NextResponse.json({ error: "Database commit failed while submitting workspace. Please retry." }, { status: 500 });
    }

    console.log(`[FIREBASE] WORK_SUBMITTED: ${intern.rollNumber} — ${intern.fullName} (${intern.trackSelected})`);

    return NextResponse.json({
      success: true,
      message: "Engineering tasks submitted successfully. Status updated to SUBMITTED.",
      rollNumber: intern.rollNumber,
      status: "SUBMITTED"
    }, { status: 200 });

  } catch (error) {
    console.error("Work submission API exception:", error);
    return NextResponse.json({ error: "Internal server error occurred while archiving submission." }, { status: 500 });
  }
}
