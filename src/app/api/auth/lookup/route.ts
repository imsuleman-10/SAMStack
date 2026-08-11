import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";

// Lookup Firebase email from phone number stored in Firestore
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    const adb = createAdminDb(adminDb!);

    // Normalize phone
    const cleaned = phone.replace(/[^0-9+]/g, '');
    const normalized = cleaned.startsWith('+') ? cleaned : `+92${cleaned.replace(/^0/, '')}`;

    // Look up user in Firestore
    const user = await adb.users.getByPhone(normalized);

    if (!user) {
      // Not found — return fallback so client can use phone-as-email format
      return NextResponse.json({
        found: false,
        firebaseEmail: `${normalized}@samstack.com`
      });
    }

    // If user has a real email (registered via new signup flow)
    if (user.email && !user.email.endsWith('@samstack.com')) {
      return NextResponse.json({ found: true, firebaseEmail: user.email });
    }

    // Otherwise use the phone-as-email format (old accounts)
    return NextResponse.json({ found: true, firebaseEmail: `${normalized}@samstack.com` });
  } catch (err: any) {
    console.error("Phone lookup error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
