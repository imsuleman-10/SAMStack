import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, university, trackSelected } = body;

    if (!fullName || !email || !university || !trackSelected) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newIntern = await db.interns.create({
      fullName,
      email,
      university,
      trackSelected,
    });

    return NextResponse.json({
      success: true,
      message: `Intern ${fullName} successfully added.`,
      intern: newIntern,
    });
  } catch (error: any) {
    console.error("Add intern error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
