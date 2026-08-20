import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const snap = await adminDb.collection("messages").get();
    const messages = snap.docs.map(d => d.data());
    // Sort by timestamp descending
    messages.sort((a, b) => new Date((b as any).timestamp).getTime() - new Date((a as any).timestamp).getTime());
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("Admin messages list error:", error);
    return NextResponse.json({ error: "Failed to fetch operator client messages." }, { status: 500 });
  }
}
