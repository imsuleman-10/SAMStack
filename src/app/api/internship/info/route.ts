import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const rollNumber = searchParams.get("rollNumber");

    if (!email || !rollNumber) {
      return NextResponse.json({ error: "Missing email address or Roll Number parameters." }, { status: 400 });
    }

    if (!adminDb) return NextResponse.json({ error: "DB not initialized." }, { status: 500 });

    const internQuery = await adminDb.collection("interns")
      .where("email", "==", email.toLowerCase())
      .where("rollNumber", "==", rollNumber)
      .limit(1)
      .get();
      
    if (internQuery.empty) {
      return NextResponse.json({ error: "Applicant credential verification failed. No matching profile found." }, { status: 404 });
    }
    
    const intern = internQuery.docs[0].data();

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
