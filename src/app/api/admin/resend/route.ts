import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail, sendCertificateEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNumber, type } = body; // type: "OFFER_LETTER" | "CERTIFICATE"

    if (!rollNumber || !["OFFER_LETTER", "CERTIFICATE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid rollNumber or type. Must be 'OFFER_LETTER' or 'CERTIFICATE'." },
        { status: 400 }
      );
    }

    // Fetch intern record
    const intern = await db.interns.get(rollNumber);
    if (!intern) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }

    const trackTitle = tracks[intern.trackSelected]?.title || intern.trackSelected;
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── RESEND OFFER LETTER ──────────────────────────────────────
    if (type === "OFFER_LETTER") {
      const pdfBuffer = await generateOfferLetterPDF({
        fullName: intern.fullName,
        rollNumber: intern.rollNumber,
        track: trackTitle,
        date: dateStr,
      });

      await sendOfferLetterEmail(
        intern.email,
        intern.fullName,
        intern.rollNumber,
        trackTitle,
        pdfBuffer
      );

      console.log(`[MAILER] Offer letter RESENT to ${intern.email} (${intern.rollNumber})`);

      return NextResponse.json({
        success: true,
        message: `Offer letter successfully resent to ${intern.email}.`,
      });
    }

    // ── RESEND CERTIFICATE ───────────────────────────────────────
    if (type === "CERTIFICATE") {
      if (intern.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Cannot send certificate — this intern has not been APPROVED yet." },
          { status: 400 }
        );
      }

      // Look up the certificate record
      const certificates = await db.certificates.list();
      const cert = certificates.find((c) => c.associatedRollNumber === intern.rollNumber);

      if (!cert) {
        return NextResponse.json(
          { error: "No certificate record found for this intern. Please approve first." },
          { status: 404 }
        );
      }

      const pdfBuffer = await generateCertificatePDF({
        fullName: intern.fullName,
        certificateNumber: cert.certificateNumber,
        track: trackTitle,
        date: dateStr,
      });

      await sendCertificateEmail(
        intern.email,
        intern.fullName,
        cert.certificateNumber,
        trackTitle,
        pdfBuffer
      );

      console.log(`[MAILER] Certificate RESENT to ${intern.email} (${cert.certificateNumber})`);

      return NextResponse.json({
        success: true,
        message: `Certificate (${cert.certificateNumber}) successfully resent to ${intern.email}.`,
      });
    }
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Internal server error while resending email." },
      { status: 500 }
    );
  }
}
