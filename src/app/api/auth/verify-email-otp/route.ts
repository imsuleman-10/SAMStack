import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore/lite";
import { SignJWT } from "jose";

const getSecretKey = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "samstack-fallback-secret-key-2026-super-secure"
  );

export async function POST(request: NextRequest) {
  try {
    const { email, otp, isPasswordReset } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const docRef = doc(firestore, "email_otps", email.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const data = docSnap.data();

    if (Date.now() > data.expiresAt) {
      await deleteDoc(docRef);
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (data.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP code." }, { status: 400 });
    }

    // OTP is valid, delete it so it can't be reused
    await deleteDoc(docRef);
    
    if (isPasswordReset) {
      const resetToken = await new SignJWT({ email: email.toLowerCase(), purpose: 'password_reset' })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m") // 15 mins to reset
        .sign(getSecretKey());
        
      return NextResponse.json({ success: true, message: "Email verified successfully", resetToken });
    }

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
