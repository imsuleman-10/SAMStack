import { NextRequest, NextResponse } from "next/server";
import { db, createAdminDb } from "@/lib/db";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const adb = createAdminDb(adminDb!);

    // Fetch Firestore interns (legacy) + Firestore intern_profiles (new), and certificates
    const [firebaseInterns, certificates, firestoreProfiles] = await Promise.all([
      db.interns.list(),
      db.certificates.list(),
      adb.internProfiles.listWithUsers(),
    ]);

    // Map Firestore profiles to common shape
    const mappedFirestoreInterns = firestoreProfiles.map((p) => ({
      id: p.user_id,
      fullName: p.user?.full_name || "Unknown",
      email: p.user?.email || p.email || p.user?.phone_number || "",
      university: p.university || "Unknown",
      trackSelected: p.track_selected || "UNKNOWN",
      rollNumber: p.roll_number || "",
      applicationTimestamp: p.created_at || new Date().toISOString(),
      status: p.application_status || "APPLIED",
      submissionData: null,
    }));

    // Merge: avoid duplicates (prefer new Firestore records)
    const newRollNumbers = new Set(mappedFirestoreInterns.map(i => i.rollNumber).filter(Boolean));
    const legacyOnly = firebaseInterns.filter(i => !newRollNumbers.has(i.rollNumber));
    const interns = [...mappedFirestoreInterns, ...legacyOnly];

    // Build certificate lookup map
    const certMap: Record<string, string> = {};
    for (const cert of certificates) {
      certMap[cert.associatedRollNumber] = cert.certificateNumber;
    }

    // Sort: SUBMITTED first, then APPLIED, then APPROVED/REJECTED
    const sorted = [...interns].sort((a, b) => {
      const statusPriority: Record<string, number> = {
        SUBMITTED: 1, APPLIED: 2, APPROVED: 3, REJECTED: 4,
      };
      const pa = statusPriority[a.status] || 5;
      const pb = statusPriority[b.status] || 5;
      if (pa !== pb) return pa - pb;
      return (
        new Date(b.applicationTimestamp).getTime() -
        new Date(a.applicationTimestamp).getTime()
      );
    });

    const enriched = sorted.map((intern) => ({
      ...intern,
      certificateNumber: certMap[intern.rollNumber] || null,
    }));

    return NextResponse.json({ success: true, interns: enriched }, { status: 200 });
  } catch (error) {
    console.error("Fetch admin applications error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
