import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adb = createAdminDb(adminDb!);
    const members = await adb.homepageTeam.list(true); // activeOnly = true

    const team = members.map((member) => ({
      name: member.name,
      role: member.designation,
      badge: member.badge || "Specialist",
      description: member.bio || "",
      skills: member.skills || [],
      image: member.image_url || "",
      initials: member.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
      badgeColor: "bg-brand-500",
      from: "from-brand-600",
      to: "to-indigo-600",
    }));

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Exception fetching homepage team:", error);
    return NextResponse.json({ team: [] });
  }
}
