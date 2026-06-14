import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Standard secure developer credentials for out-of-the-box local operation
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "samstacktechs@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Salman123@";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await signAdminToken({ email });

      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({ success: true, message: "Authentication successful." }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid operator credentials. Access Denied." }, { status: 401 });
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json({ error: "Internal server error occurred during authentication." }, { status: 500 });
  }
}
