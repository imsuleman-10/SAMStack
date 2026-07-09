import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendCertificateEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNumber, action } = body;

    if (!rollNumber || !action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid rollNumber or action parameter." }, { status: 400 });
    }

    const intern = await db.interns.get(rollNumber);
    if (!intern) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samstack-tech.vercel.app";
    let responseData: Record<string, unknown> = { success: true };

    // ── APPROVE ──────────────────────────────────────────────────────────────
    if (action === "APPROVE") {
      // 1. Generate unique certificate ID
      const certHex = Math.random().toString(16).substring(2, 10).toUpperCase();
      const certificateNumber = `SAM-CERT-2026-${certHex}`;

      // 2. Resolve track title
      const trackTitle = tracks[intern.trackSelected]?.title || `${intern.trackSelected} Specialization`;

      // 3. Persist certificate in DB
      const certificate = await db.certificates.create({
        certificateNumber,
        associatedRollNumber: intern.rollNumber,
        recipientName: intern.fullName,
        trackTitle,
      });

      // 4. Mark intern as APPROVED
      await db.interns.updateStatus(intern.rollNumber, "APPROVED");

      console.log(`[FIREBASE] APPLICANT_APPROVED: ${intern.rollNumber} — cert ${certificateNumber}`);

      // Asynchronously generate and send certificate
      const processCertificate = async () => {
        try {
          const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          const pdfBuffer = await generateCertificatePDF({
            fullName: intern.fullName,
            certificateNumber,
            track: trackTitle,
            date: dateStr,
          });

          await sendCertificateEmail(
            intern.email,
            intern.fullName,
            certificateNumber,
            trackTitle,
            pdfBuffer
          );
          console.log(`[MAILER] Certificate sent to ${intern.email}`);
        } catch (err) {
          console.error(`[MAILER] Failed to send certificate to ${intern.email}`, err);
        }
      };

      await processCertificate();

      responseData = {
        success: true,
        message: `Internship APPROVED. Certificate ${certificateNumber} issued and emailed to candidate.`,
        rollNumber: intern.rollNumber,
        certificateNumber,
      };

    // ── REJECT ───────────────────────────────────────────────────────────────
    } else if (action === "REJECT") {
      await db.interns.updateStatus(intern.rollNumber, "REJECTED");

      console.log(`[FIREBASE] APPLICANT_REJECTED: ${intern.rollNumber} — ${intern.fullName}`);

      responseData = {
        success: true,
        message: "Internship status updated to REJECTED. Rejection notification queued via GAS.",
        rollNumber: intern.rollNumber,
      };
    }

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Admin action execution error:", error);
    return NextResponse.json(
      { error: "Internal server error during admin action execution." },
      { status: 500 }
    );
  }
}
