import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNumber = searchParams.get("id");

    if (!certificateNumber) {
      return NextResponse.json({ error: "Certificate Verification ID is required." }, { status: 400 });
    }

    const cert = await db.certificates.get(certificateNumber.trim());
    if (!cert) {
      return NextResponse.json({ 
        isValid: false, 
        error: "FORGERY WARNING: This Certificate Verification Token does not match any authenticated record in the SAMStack Tech registry database." 
      }, { status: 404 });
    }

    // Retrieve rich student telemetry using roll number
    const intern = await db.interns.get(cert.associatedRollNumber);

    return NextResponse.json({
      success: true,
      isValid: cert.isValid && (intern ? intern.status === "APPROVED" : true),
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      trackTitle: cert.trackTitle,
      issuanceDate: cert.issuanceDate,
      rollNumber: cert.associatedRollNumber,
      internData: intern ? {
        university: intern.university || "SAMStack Developer Academy",
        track: intern.trackSelected,
        completedTaskCount: intern.submissionData?.completedTaskCount || 3,
        githubRepositoryUrl: intern.submissionData?.githubRepositoryUrl || "",
        appliedAt: intern.applicationTimestamp
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error("Certificate verification API error:", error);
    return NextResponse.json({ error: "Internal server error during credential verification." }, { status: 500 });
  }
}
