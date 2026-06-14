import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
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
