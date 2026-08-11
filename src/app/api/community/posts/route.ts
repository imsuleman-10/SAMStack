import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, CommunityPost } from "@/lib/firestore-schema";

// ─── GET /api/community/posts ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));

  // Organization-wide + Public posts. (No "private" unless own, simplified for now)
  const snap = await adminDb.collection(FS.POSTS)
    .where("visibility", "in", ["public", "organization"])
    .orderBy("created_at", "desc")
    .limit(limit)
    .get();

  const posts = snap.docs.map(d => d.data() as CommunityPost);

  // Hydrate authors
  const authorIds = [...new Set(posts.map(p => p.author_id))];
  const authorMap: Record<string, any> = {};
  
  if (authorIds.length > 0) {
    const authorSnaps = await adminDb.getAll(...authorIds.map(id => adminDb!.collection(FS.USERS).doc(id)));
    authorSnaps.forEach(a => {
      if (a.exists) {
        const u = a.data() as PlatformUser;
        authorMap[u.id] = { id: u.id, full_name: u.full_name, avatar_url: u.avatar_url, role: u.role };
      }
    });
  }

  // Hydrate user's like status
  let userLikedPostIds = new Set<string>();
  if (posts.length > 0) {
    const likesSnap = await adminDb.collection(FS.POST_LIKES)
      .where("user_id", "==", session.id)
      .where("post_id", "in", posts.map(p => p.id).slice(0, 30)) // Firestore 'in' limit is 30
      .get();
    likesSnap.forEach(l => userLikedPostIds.add(l.data().post_id));
  }

  const enriched = posts.map(p => ({
    ...p,
    author: authorMap[p.author_id] || null,
    liked_by_me: userLikedPostIds.has(p.id),
  }));

  return NextResponse.json({ posts: enriched });
}

// ─── POST /api/community/posts ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { content, media_url, visibility = "organization" } = await req.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Post content is required." }, { status: 400 });
  }

  const ref = adminDb.collection(FS.POSTS).doc();
  const now = new Date().toISOString();
  const newPost: CommunityPost = {
    id: ref.id,
    author_id: session.id,
    content: content.trim(),
    media_url: media_url ?? null,
    visibility,
    like_count: 0,
    comment_count: 0,
    created_at: now,
    updated_at: now,
  };

  await ref.set(newPost);

  return NextResponse.json({ success: true, post: newPost }, { status: 201 });
}
