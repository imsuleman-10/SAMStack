import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const rollNumber = searchParams.get("rollNumber");

    if (!email || !rollNumber) {
      return NextResponse.json({ error: "Missing email address or Roll Number parameters." }, { status: 400 });
    }

    const intern = await db.interns.getByEmailAndRoll(email, rollNumber);
    if (!intern) {
      return NextResponse.json({ error: "Applicant credential verification failed. No matching profile found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      fullName: intern.fullName,
      email: intern.email,
      track: intern.trackSelected,
      status: intern.status,
      appliedAt: intern.applicationTimestamp,
      submission: intern.submissionData
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch applicant info exception:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
