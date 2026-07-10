import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");
    const type = searchParams.get("type"); // "OFFER_LETTER" | "CERTIFICATE"

    if (!rollNumber || !["OFFER_LETTER", "CERTIFICATE"].includes(type as string)) {
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

    if (type === "OFFER_LETTER") {
      const pdfBuffer = await generateOfferLetterPDF({
        fullName: intern.fullName,
        rollNumber: intern.rollNumber,
        track: trackTitle,
        date: dateStr,
      });

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="OfferLetter_${intern.rollNumber}.pdf"`,
        },
      });
    }

    if (type === "CERTIFICATE") {
      if (intern.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Cannot download certificate — this intern has not been APPROVED yet." },
          { status: 400 }
        );
      }

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

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Certificate_${cert.certificateNumber}.pdf"`,
        },
      });
    }

  } catch (error: any) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      { error: "Internal server error while generating PDF." },
      { status: 500 }
    );
  }
}
