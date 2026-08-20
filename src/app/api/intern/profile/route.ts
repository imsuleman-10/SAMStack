import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req as any, ["intern"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const profileSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(session.id).get();
    return NextResponse.json({ profile: profileSnap.data() || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
