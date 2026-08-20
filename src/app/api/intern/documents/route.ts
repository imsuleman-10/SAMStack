import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateCertificatePDF, generateOfferLetterPDF } from "@/lib/pdfTemplates";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["intern"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    const [userSnap, profileSnap] = await Promise.all([
      adminDb.collection(FS.USERS).doc(session.id).get(),
      adminDb.collection(FS.INTERN_PROFILES).doc(session.id).get(),
    ]);

    if (!userSnap.exists || !profileSnap.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const profileData = profileSnap.data();

    const fullName = userData?.full_name || "Intern";
    const track = profileData?.track_selected || "Engineering";
    const rollNumber = profileData?.roll_number || "PENDING";
    const certificateId = profileData?.certificate_id || rollNumber;
    const certificateStatus = profileData?.certificate_status || "pending";
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    let pdfBuffer;

    if (type === 'offer_letter') {
      pdfBuffer = await generateOfferLetterPDF({
        fullName,
        rollNumber,
        track,
        date
      });
    } else if (type === 'certificate') {
      if (certificateStatus !== 'approved' && certificateStatus !== 'issued') {
        return NextResponse.json({ error: "Certificate not approved yet." }, { status: 403 });
      }
      
      pdfBuffer = await generateCertificatePDF({
        fullName,
        certificateNumber: certificateId, 
        track,
        date
      });
    } else {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}_${fullName.replace(/\s+/g, '_')}.pdf"`
      }
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
