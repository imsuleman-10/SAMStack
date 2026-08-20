import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";

export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  try {
    if (!adminDb) {
      return NextResponse.json({ error: "DB not initialized" }, { status: 500 });
    }

    const body = await request.json();
    const { fullName, email, university, trackSelected } = body;

    if (!fullName || !email || !university || !trackSelected) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Use a transaction or count to get next sequence (simplified here)
    const countSnap = await adminDb.collection("interns").count().get();
    const count = countSnap.data().count + 1;
    const rollNumber = `SAM-2026-${String(count).padStart(4, '0')}`;
    const id = `intern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newIntern = {
      id,
      fullName,
      email: email.toLowerCase(),
      university,
      trackSelected,
      rollNumber,
      applicationTimestamp: new Date().toISOString(),
      status: 'APPLIED',
      submissionData: null,
    };

    await adminDb.collection("interns").doc(id).set(newIntern);

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
