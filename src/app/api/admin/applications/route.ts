import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [interns, certificates] = await Promise.all([
      db.interns.list(),
      db.certificates.list(),
    ]);

    // Build a lookup map: rollNumber → certificateNumber
    const certMap: Record<string, string> = {};
    for (const cert of certificates) {
      certMap[cert.associatedRollNumber] = cert.certificateNumber;
    }

    // Sort: SUBMITTED first, then APPLIED, then APPROVED/REJECTED
    const sorted = [...interns].sort((a, b) => {
      const statusPriority: Record<string, number> = {
        SUBMITTED: 1,
        APPLIED: 2,
        APPROVED: 3,
        REJECTED: 4
      };
      const pa = statusPriority[a.status] || 5;
      const pb = statusPriority[b.status] || 5;
      if (pa !== pb) return pa - pb;
      return new Date(b.applicationTimestamp).getTime() - new Date(a.applicationTimestamp).getTime();
    });

    // Attach certificateNumber to each approved intern
    const enriched = sorted.map((intern) => ({
      ...intern,
      certificateNumber: certMap[intern.rollNumber] || null,
    }));

    return NextResponse.json({ success: true, interns: enriched }, { status: 200 });
  } catch (error) {
    console.error("Fetch admin applications error:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
