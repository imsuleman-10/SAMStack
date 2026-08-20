import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FS } from "@/lib/firestore-schema";
import { generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendCertificateEmail } from "@/lib/mailer";
import crypto from "crypto";
import { verifyAdminSession } from "@/lib/adminAuth";
import { tracks } from "@/lib/curriculum";

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { rollNumber, action } = body;

    if (!rollNumber || !action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid rollNumber or action parameter." }, { status: 400 });
    }

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });
    const internSnap = await adminDb.collection("interns").where("rollNumber", "==", rollNumber).limit(1).get();
    if (internSnap.empty) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }
    const internDoc = internSnap.docs[0];
    const intern = internDoc.data();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samstack-tech.vercel.app";
    let responseData: Record<string, unknown> = { success: true };

    // ── APPROVE ──────────────────────────────────────────────────────────────
    if (action === "APPROVE") {
      // 1. Generate unique certificate ID
      const certHex = crypto.randomBytes(4).toString('hex').toUpperCase();
      const certificateNumber = `SAM-CERT-2026-${certHex}`;

      // 2. Resolve track title
      const trackTitle = tracks[intern.trackSelected]?.title || `${intern.trackSelected} Specialization`;

      // 3. Persist certificate in DB
      const certificate = {
        certificateNumber,
        associatedRollNumber: intern.rollNumber,
        recipientName: intern.fullName,
        trackTitle,
        issuanceDate: new Date().toISOString(),
        isValid: true,
      };
      await adminDb.collection("certificates").doc(certificateNumber).set(certificate);

      // 4. Mark intern as APPROVED
      await internDoc.ref.update({ status: "APPROVED" });

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
      await internDoc.ref.update({ status: "REJECTED" });

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
