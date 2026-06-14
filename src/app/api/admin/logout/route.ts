import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return NextResponse.json({ success: true, message: "Logged out successfully." }, { status: 200 });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "Internal server error during logout." }, { status: 500 });
  }
}
