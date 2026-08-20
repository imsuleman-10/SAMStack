import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/session';
import { generateCertificatePDF, generateOfferLetterPDF } from '@/lib/pdfTemplates';

export async function POST(req: NextRequest) {
  // Allow Admin, Mentor, and Staff (Support) to generate documents
  const auth = await requireAuth(req, ['admin', 'mentor', 'staff']);
  if (isAuthError(auth)) return auth;

  try {
    const { type, fullName, identifier, track, date } = await req.json();

    if (!type || !fullName || !identifier || !track || !date) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    let pdfBuffer;
    if (type === 'certificate') {
      pdfBuffer = await generateCertificatePDF({
        fullName,
        certificateNumber: identifier,
        track,
        date
      });
    } else if (type === 'offer_letter') {
      pdfBuffer = await generateOfferLetterPDF({
        fullName,
        rollNumber: identifier,
        track,
        date
      });
    } else {
      return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}_${fullName.replace(/\s+/g, '_')}.pdf"`
      }
    });
  } catch (error: any) {
    console.error('Error generating document:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate document' }, { status: 500 });
  }
}
