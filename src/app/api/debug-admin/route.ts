import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// ⚠️ This endpoint is ONLY available in development mode.
// It auto-creates/syncs the admin account from ADMIN_EMAIL + ADMIN_PASSWORD env vars.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 403 });
  }

  const email = process.env.ADMIN_EMAIL || 'samstacktechs@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Salman123@';

  try {
    const envCheck = {
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 15) + '...',
      adminDbInitialized: !!adminDb,
      adminAuthInitialized: !!adminAuth,
    };

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: "Firebase Admin not initialized", envCheck }, { status: 500 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      await adminAuth.updateUser(userRecord.uid, { password });
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await adminAuth.createUser({
          email,
          password,
          emailVerified: true,
        });
      } else {
        throw e;
      }
    }

    const dbUser = await adminDb.collection('users').doc(userRecord.uid).get();
    if (!dbUser.exists) {
      await adminDb.collection('users').doc(userRecord.uid).set({
        email,
        full_name: 'Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
    } else if (dbUser.data()?.role !== 'admin') {
      await adminDb.collection('users').doc(userRecord.uid).update({ role: 'admin' });
    }

    return NextResponse.json({ success: true, message: "Admin account verified & updated.", envCheck });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
