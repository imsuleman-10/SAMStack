import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";

/**
 * GET /api/admin/certificates
 * Returns all intern profiles with a non-null certificate_status,
 * enriched with full user data. Accessible to admin, mentor, and staff.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin", "mentor", "staff"]);
  if (isAuthError(auth)) return auth;

  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status"); // "pending" | "approved" | "rejected" | null

    // Fetch all profiles to completely bypass any Firestore indexing requirements
    const profilesSnap = await adminDb.collection(FS.INTERN_PROFILES).get();

    if (profilesSnap.empty) {
      return NextResponse.json({ requests: [], summary: { pending: 0, approved: 0, rejected: 0 } });
    }

    // Filter in JS
    const docs = profilesSnap.docs.filter((doc) => {
      const status = doc.data().certificate_status;
      if (!status) return false;
      if (statusFilter && statusFilter !== 'all') return status === statusFilter;
      return ['pending', 'approved', 'rejected'].includes(status);
    });

    if (docs.length === 0) {
      return NextResponse.json({ requests: [], summary: { pending: 0, approved: 0, rejected: 0 } });
    }

    // Batch-fetch user documents
    const userIds = docs.map((d) => d.id);
    const userFetches = userIds.map((uid) =>
      adminDb!.collection(FS.USERS).doc(uid).get()
    );
    const userSnaps = await Promise.all(userFetches);

    const requests = docs.map((profileDoc, i) => {
      const profile = profileDoc.data();
      const user = userSnaps[i].data();
      return {
        intern_id: profileDoc.id,
        full_name: user?.full_name || "Unknown",
        email: user?.email || null,
        avatar_url: user?.avatar_url || null,
        roll_number: profile.roll_number || null,
        track_selected: profile.track_selected || null,
        certificate_status: profile.certificate_status,
        certificate_id: profile.certificate_id || null,
        updated_at: profile.updated_at,
        joining_date: profile.joining_date || null,
        university: profile.university || null,
        department: profile.department || null,
      };
    });

    // Sort newest first in memory
    requests.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));

    // Summary counts
    const summary = {
      pending: requests.filter((r) => r.certificate_status === "pending").length,
      approved: requests.filter((r) => r.certificate_status === "approved").length,
      rejected: requests.filter((r) => r.certificate_status === "rejected").length,
    };

    return NextResponse.json({ requests, summary });
  } catch (err: any) {
    console.error("GET /api/admin/certificates error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
