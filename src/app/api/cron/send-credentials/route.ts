import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FS } from "@/lib/firestore-schema";
import { sendWelcomeEmailWithPassword } from "@/lib/mailer";
import crypto from "crypto";

// GET /api/cron/send-credentials
// This endpoint is meant to be called daily by a CRON job (e.g., Vercel Cron, GitHub Actions, Google Cloud Scheduler).
// It finds any users who have not received their credentials yet and emails them.
export async function GET(req: NextRequest) {
  // Optional: Secure this endpoint with a secret key token
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
  }

  if (!adminDb || !adminAuth) {
    return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
  }

  try {
    // Find all users who don't have the 'credentials_sent_at' field set yet.
    // In Firestore, checking for absence of a field requires either a specific query setup or client-side filtering.
    // For a small/medium scale, we can query active users created recently, and filter in memory.
    
    // Calculate timestamp 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const snapshot = await adminDb.collection(FS.USERS)
      .where("status", "==", "active")
      // .where("created_at", ">=", oneDayAgo) // Optional: limit to users created in the last 24h
      .get();

    const usersToProcess = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((user: any) => !user.credentials_sent_at && user.email);

    if (usersToProcess.length === 0) {
      return NextResponse.json({ success: true, message: "No new users pending credentials.", processed: 0 });
    }

    let processedCount = 0;
    const errors: any[] = [];

    for (const user of usersToProcess as any[]) {
      try {
        const namePart = (user.full_name || 'user').split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
        const tempPassword = `${namePart.charAt(0).toUpperCase()}${namePart.slice(1)}@${randomPart}99!`;

        let fbUid = user.id;
        try {
          const existing = await adminAuth.getUserByEmail(user.email);
          await adminAuth.updateUser(existing.uid, { password: tempPassword, emailVerified: true });
          fbUid = existing.uid;
        } catch {
          await adminAuth.createUser({
            uid: fbUid,
            email: user.email,
            password: tempPassword,
            displayName: user.full_name,
            emailVerified: true,
          });
        }

        // Send Email
        await sendWelcomeEmailWithPassword(user.email, user.full_name, tempPassword, user.role);

        // Mark as sent
        await adminDb.collection(FS.USERS).doc(user.id).update({
          credentials_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        processedCount++;
      } catch (err: any) {
        errors.push({ email: user.email, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent credentials to ${processedCount} users.`,
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err: any) {
    console.error("[cron-send-credentials] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
