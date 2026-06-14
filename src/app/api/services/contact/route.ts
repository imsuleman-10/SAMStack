import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, organization, serviceType, budget, message } = body;

    // Simple robust validation
    if (!clientName || !clientEmail || !serviceType || !budget || !message) {
      return NextResponse.json(
        { error: "Missing required fields. Please satisfy all inputs." },
        { status: 400 }
      );
    }

    const newMsg = await db.messages.create({
      clientName,
      clientEmail,
      organization: organization || "N/A",
      serviceType,
      budget,
      message,
    });

    console.log(`[FIREBASE] CLIENT_INQUIRY: ${newMsg.id} — ${newMsg.clientName} (${newMsg.serviceType})`);

    return NextResponse.json(
      { success: true, message: "Inquiry successfully recorded.", inquiry: newMsg },
      { status: 201 }
    );
  } catch (error) {
    console.error("Client inquiry submission error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing your request." },
      { status: 500 }
    );
  }
}

