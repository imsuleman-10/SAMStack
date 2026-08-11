import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { notifyPostCommented } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { PostComment, CommunityPost, PlatformUser } from "@/lib/firestore-schema";

// ─── GET /api/community/posts/[id]/comments ──────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  
  const snap = await adminDb.collection(FS.POST_COMMENTS)
    .where("post_id", "==", id)
    .orderBy("created_at", "asc")
    .get();

  const comments = snap.docs.map(d => d.data() as PostComment);

  // Hydrate authors
  const authorIds = [...new Set(comments.map(c => c.user_id))];
  const authorMap: Record<string, any> = {};
  
  if (authorIds.length > 0) {
    const authorSnaps = await adminDb.getAll(...authorIds.map(uid => adminDb!.collection(FS.USERS).doc(uid)));
    authorSnaps.forEach(a => {
      if (a.exists) {
        const u = a.data() as PlatformUser;
        authorMap[u.id] = { id: u.id, full_name: u.full_name, avatar_url: u.avatar_url, role: u.role };
      }
    });
  }

  const enriched = comments.map(c => ({
    ...c,
    author: authorMap[c.user_id] || null,
  }));

  return NextResponse.json({ comments: enriched });
}

// ─── POST /api/community/posts/[id]/comments ─────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Comment content is required." }, { status: 400 });
  }

  const postRef = adminDb.collection(FS.POSTS).doc(id);
  const commentRef = adminDb.collection(FS.POST_COMMENTS).doc();

  try {
    const result = await adminDb.runTransaction(async (t) => {
      const postSnap = await t.get(postRef);
      if (!postSnap.exists) throw new Error("Post not found");
      
      const now = new Date().toISOString();
      const newComment: PostComment = {
        id: commentRef.id,
        post_id: id,
        user_id: session.id,
        content: content.trim(),
        created_at: now,
        updated_at: now,
      };
      
      t.set(commentRef, newComment);
      t.update(postRef, { comment_count: (postSnap.data()?.comment_count || 0) + 1 });
      
      return { comment: newComment, author_id: postSnap.data()?.author_id };
    });

    if (result.author_id && result.author_id !== session.id) {
      const commenterSnap = await adminDb.collection(FS.USERS).doc(session.id).get();
      const commenterName = commenterSnap.exists ? (commenterSnap.data() as PlatformUser).full_name : "Someone";
      await notifyPostCommented(result.author_id, commenterName, id);
    }

    // Hydrate the return object for the UI
    const commenterSnap = await adminDb.collection(FS.USERS).doc(session.id).get();
    let authorData = null;
    if (commenterSnap.exists) {
        const u = commenterSnap.data() as PlatformUser;
        authorData = { id: u.id, full_name: u.full_name, avatar_url: u.avatar_url, role: u.role };
    }

    return NextResponse.json({ success: true, comment: { ...result.comment, author: authorData } }, { status: 201 });
  } catch (error: any) {
    console.error("Post comment error:", error);
    return NextResponse.json({ error: error.message || "Failed to post comment" }, { status: 500 });
  }
}
