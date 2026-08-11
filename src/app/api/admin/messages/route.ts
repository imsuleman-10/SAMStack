import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const messages = await db.messages.list();
    // Sort by timestamp descending
    messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("Admin messages list error:", error);
    return NextResponse.json({ error: "Failed to fetch operator client messages." }, { status: 500 });
  }
}
