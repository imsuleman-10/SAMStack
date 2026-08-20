import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { firestore } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore/lite";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const emailKey = email.toLowerCase();
    const docRef = doc(firestore, "email_otps", emailKey);
    const docSnap = await getDoc(docRef);

    // Rate limiting: 2 minutes cooldown
    if (docSnap.exists()) {
      const data = docSnap.data();
      const now = Date.now();
      const timeSinceLastOtp = now - (data.createdAt || 0); // Assuming we'll add createdAt
      
      // If the last OTP was generated less than 2 minutes ago (120,000 ms), block it
      // For backward compatibility, if createdAt doesn't exist, we check expiresAt (which is +5 mins)
      // So if expiresAt is > now + 3 mins, it means it was generated < 2 mins ago
      const generatedAt = data.createdAt || (data.expiresAt - 5 * 60 * 1000);
      if (now - generatedAt < 2 * 60 * 1000) {
        return NextResponse.json({ error: "Please wait 2 minutes before requesting a new code." }, { status: 429 });
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    // Save to Firestore
    await setDoc(docRef, {
      otp,
      expiresAt,
      createdAt: now,
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SAMStack Tech" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code - SAMStack Tech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0ea5e9; text-align: center;">SAMStack Tech</h2>
          <p style="color: #334155; font-size: 16px;">Hello,</p>
          <p style="color: #334155; font-size: 16px;">Here is your 6-digit verification code. This code will expire in 5 minutes.</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">© 2026 SAMStack Tech. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Email OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
