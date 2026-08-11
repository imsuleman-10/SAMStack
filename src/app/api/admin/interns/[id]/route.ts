import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Intern ID is required." }, { status: 400 });
    }

    const adb = createAdminDb(adminDb!);

    // Delete user document from Firestore (cascades to intern_profile, task_progress, complaints)
    const userExists = await adb.users.get(id);
    if (!userExists) {
      return NextResponse.json({ error: "Intern not found." }, { status: 404 });
    }

    // Delete all related data in parallel
    await Promise.all([
      adb.internProfiles.delete(id),
      adb.taskProgress.deleteForUser(id),
      adb.complaints.deleteForUser(id),
    ]);

    // Delete user document
    await adb.users.delete(id);

    // Delete from Firebase Auth
    if (adminAuth) {
      try {
        await adminAuth.deleteUser(id);
      } catch {
        // User might not exist in Auth — not critical
      }
    }

    // Also try to delete from legacy Firestore interns collection (safe to fail)
    try {
      const { db } = await import("@/lib/db");
      await db.interns.delete(id);
    } catch {
      // Legacy deletion not critical
    }

    return NextResponse.json({
      success: true,
      message: "Intern record deleted permanently.",
    });
  } catch (error: any) {
    console.error("Delete intern error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
