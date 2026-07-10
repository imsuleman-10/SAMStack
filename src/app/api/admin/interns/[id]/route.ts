import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params object as required by Next.js 15
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Intern ID is required." },
        { status: 400 }
      );
    }

    const success = await db.interns.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "Intern not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Intern successfully deleted.",
    });
  } catch (error: any) {
    console.error("Delete intern error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
