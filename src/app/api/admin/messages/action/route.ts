import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const success = await db.messages.updateStatus(messageId, status);
    if (!success) {
      return NextResponse.json({ error: "Client message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Client message status updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Admin messages update error:", error);
    return NextResponse.json({ error: "Failed to update client message status." }, { status: 500 });
  }
}
