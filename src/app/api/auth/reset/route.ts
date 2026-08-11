import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { adminAuth } from "@/lib/firebase-admin";

const getSecretKey = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "samstack-fallback-secret-key-2026-super-secure"
  );

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword, resetToken } = await request.json();

    if (!email || !newPassword || !resetToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // 1. Verify Reset Token
    try {
      const { payload } = await jwtVerify(resetToken, getSecretKey());
      
      if (payload.purpose !== 'password_reset' || payload.email !== email.toLowerCase()) {
         return NextResponse.json({ error: "Invalid or unauthorized reset token" }, { status: 403 });
      }
    } catch (tokenErr) {
      return NextResponse.json({ error: "Reset token expired or invalid" }, { status: 403 });
    }

    // 2. Reset Password via Firebase Admin
    if (!adminAuth) {
      throw new Error("Firebase Admin Auth not initialized.");
    }
    
    // Lookup user by email
    const userRecord = await adminAuth.getUserByEmail(email.toLowerCase());
    
    // Update password
    await adminAuth.updateUser(userRecord.uid, {
      password: newPassword
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (error: any) {
    console.error("Password reset error:", error);
    
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
