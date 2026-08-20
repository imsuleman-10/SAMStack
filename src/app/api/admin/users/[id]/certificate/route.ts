import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateUniqueCertificateId } from "@/lib/certificate";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  const { action } = await req.json();

  if (action === "approve") {
    try {
      const now = new Date().toISOString();
      const certificateId = await generateUniqueCertificateId(adminDb);
      
      await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(
        { 
          certificate_status: 'approved',
          certificate_id: certificateId,
          updated_at: now
        },
        { merge: true }
      );
      
      // Notify the intern
      const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await adminDb.collection(FS.NOTIFICATIONS).doc(notifId).set({
        id: notifId,
        user_id: id,
        type: "certificate_approved",
        title: "Certificate Approved",
        message: "Your certificate request has been approved. You can now download it from your dashboard.",
        is_read: false,
        created_at: now
      });

      return NextResponse.json({ success: true, message: "Certificate approved", certificate_id: certificateId });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (action === "reject") {
    try {
      const now = new Date().toISOString();
      await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(
        { certificate_status: 'rejected', updated_at: now },
        { merge: true }
      );
      // Notify intern
      const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await adminDb.collection(FS.NOTIFICATIONS).doc(notifId).set({
        id: notifId,
        user_id: id,
        type: "certificate_rejected",
        title: "Certificate Request Rejected",
        message: "Your certificate request has been reviewed and was not approved at this time. Please contact your mentor for more details.",
        is_read: false,
        created_at: now,
      });
      return NextResponse.json({ success: true, message: "Certificate request rejected" });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
