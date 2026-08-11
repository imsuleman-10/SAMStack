import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });


    await db.interns.purgeAll();
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
