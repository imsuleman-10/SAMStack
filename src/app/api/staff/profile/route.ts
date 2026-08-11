import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";
export const dynamic = "force-dynamic";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("CRITICAL: JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("user_token")?.value || cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

// GET: Fetch current staff member's profile + homepage_team entry
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adb = createAdminDb(adminDb!);

  const [profile, teamCard] = await Promise.all([
    adb.users.get(user.id),
    adb.homepageTeam.getByUserId(user.id),
  ]);

  return NextResponse.json({
    profile: profile || null,
    teamCard: teamCard || null,
  });
}

// POST: Update staff profile avatar OR homepage team card
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adb = createAdminDb(adminDb!);
  const formData = await req.formData();
  const action = formData.get("action") as string;

  // ─── Upload profile avatar ──────────────────────────────────────
  if (action === "upload_avatar") {
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const path = `avatars/${user.id}-avatar.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const bucket = adminStorage!.bucket();
    const fileRef = bucket.file(path);
    await fileRef.save(buffer, { metadata: { contentType: file.type } });
    await fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${path}?t=${Date.now()}`;
    await adb.users.update(user.id, { image_url: imageUrl });

    return NextResponse.json({ success: true, imageUrl });
  }

  // ─── Save homepage team card info ───────────────────────────────
  if (action === "save_team_card") {
    const name = formData.get("name") as string;
    const designation = formData.get("designation") as string;
    const bio = formData.get("bio") as string || "";
    const badge = formData.get("badge") as string || "";
    const skills = formData.get("skills") as string || "[]";
    const file = formData.get("file") as File | null;

    if (!name || !designation) {
      return NextResponse.json({ error: "Name and designation are required" }, { status: 400 });
    }

    let image_url: string | undefined = undefined;

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `team/${user.id}-team.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const bucket = adminStorage!.bucket();
      const fileRef = bucket.file(path);
      await fileRef.save(buffer, { metadata: { contentType: file.type } });
      await fileRef.makePublic();
      image_url = `https://storage.googleapis.com/${bucket.name}/${path}?t=${Date.now()}`;
    }

    const existing = await adb.homepageTeam.getByUserId(user.id);

    const teamData: Record<string, any> = {
      user_id: user.id,
      name,
      designation,
      bio,
      badge,
      skills: JSON.parse(skills),
      is_active: true,
    };
    if (image_url) teamData.image_url = image_url;
    else if (!existing) teamData.image_url = "";

    const result = await adb.homepageTeam.upsertByUserId(user.id, teamData);

    return NextResponse.json({
      success: true,
      imageUrl: image_url || existing?.image_url || "",
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
