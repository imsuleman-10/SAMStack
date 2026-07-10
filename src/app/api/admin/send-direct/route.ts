import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail, sendCertificateEmail } from "@/lib/mailer";

/**
 * POST /api/admin/send-direct
 *
 * Bypasses all status checks. Admin can send an offer letter OR a certificate
 * to ANY intern at any time — no submission or approval required.
 *
 * Body: { rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNumber, type } = body;

    if (!rollNumber || !["OFFER_LETTER", "CERTIFICATE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid request. Provide rollNumber and type ('OFFER_LETTER' | 'CERTIFICATE')." },
        { status: 400 }
      );
    }

    const intern = await db.interns.get(rollNumber);
    if (!intern) {
      return NextResponse.json({ error: `Intern with roll number ${rollNumber} not found.` }, { status: 404 });
    }

    const trackTitle = tracks[intern.trackSelected]?.title || intern.trackSelected;
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── DIRECT OFFER LETTER ─────────────────────────────────────────
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

      console.log(`[ADMIN] Direct offer letter sent to ${intern.email} (${intern.rollNumber})`);

      return NextResponse.json({
        success: true,
        message: `Offer letter sent directly to ${intern.fullName} (${intern.email}).`,
      });
    }

    // ── DIRECT CERTIFICATE ──────────────────────────────────────────
    if (type === "CERTIFICATE") {
      // Check if a certificate already exists for this intern
      const certificates = await db.certificates.list();
      let cert = certificates.find((c) => c.associatedRollNumber === intern.rollNumber);

      if (!cert) {
        // Auto-generate a new certificate record (no approval needed)
        const certHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        const certificateNumber = `SAM-CERT-2026-${certHex}`;

        cert = await db.certificates.create({
          certificateNumber,
          associatedRollNumber: intern.rollNumber,
          recipientName: intern.fullName,
          trackTitle,
        });

        // Also upgrade intern status to APPROVED so cert is discoverable
        await db.interns.updateStatus(intern.rollNumber, "APPROVED");

        console.log(`[ADMIN] Certificate auto-created: ${certificateNumber} for ${intern.rollNumber}`);
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

      console.log(`[ADMIN] Direct certificate sent to ${intern.email} (${cert.certificateNumber})`);

      return NextResponse.json({
        success: true,
        message: `Certificate (${cert.certificateNumber}) sent directly to ${intern.fullName} (${intern.email}).`,
        certificateNumber: cert.certificateNumber,
      });
    }
  } catch (error: any) {
    console.error("[ADMIN] Direct send error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during direct send." },
      { status: 500 }
    );
  }
}
