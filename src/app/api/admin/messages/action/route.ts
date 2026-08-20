import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, status } = body;

    if (!messageId || !status) {
      return NextResponse.json({ error: "Missing parameters messageId or status." }, { status: 400 });
    }

    if (status !== "UNREAD" && status !== "READ" && status !== "RESPONDED") {
      return NextResponse.json({ error: "Invalid status value specified." }, { status: 400 });
    }

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });
    const ref = adminDb.collection("messages").doc(messageId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Client message not found." }, { status: 404 });
    }
    await ref.update({ status });

    return NextResponse.json({ success: true, message: "Client message status updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Admin messages update error:", error);
    return NextResponse.json({ error: "Failed to update client message status." }, { status: 500 });
  }
}
