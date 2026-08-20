import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });


    if (!adminDb) return NextResponse.json({ error: "DB not initialized." }, { status: 500 });

    const internsSnap = await adminDb.collection("interns").get();
    const certsSnap = await adminDb.collection("certificates").get();
    
    const batch = adminDb.batch();
    internsSnap.docs.forEach(d => batch.delete(d.ref));
    certsSnap.docs.forEach(d => batch.delete(d.ref));
    
    await batch.commit();
    return NextResponse.json({
      success: true,
      message: "Intake database and certificate records purged successfully. Counters reset to 0.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to purge database: ${error.message || error}` },
      { status: 500 }
    );
  }
}
