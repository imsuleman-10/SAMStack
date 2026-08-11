import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { notifyPostLiked } from "@/lib/notifications";
import { FS } from "@/lib/firestore-schema";
import type { PostLike, CommunityPost, PlatformUser } from "@/lib/firestore-schema";

// ─── POST /api/community/posts/[id]/like ─────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { id } = await params;
  
  const postRef = adminDb.collection(FS.POSTS).doc(id);
  const likeRef = adminDb.collection(FS.POST_LIKES).doc(`${id}_${session.id}`);

  try {
    const result = await adminDb.runTransaction(async (t) => {
      const postSnap = await t.get(postRef);
      if (!postSnap.exists) throw new Error("Post not found");
      
      const likeSnap = await t.get(likeRef);
      let liked = false;

      if (likeSnap.exists) {
        // Unlike
        t.delete(likeRef);
        t.update(postRef, { like_count: (postSnap.data()?.like_count || 1) - 1 });
      } else {
        // Like
        const newLike: PostLike = {
          id: likeRef.id,
          post_id: id,
          user_id: session.id,
          created_at: new Date().toISOString(),
        };
        t.set(likeRef, newLike);
        t.update(postRef, { like_count: (postSnap.data()?.like_count || 0) + 1 });
        liked = true;
      }
      
      return { liked, author_id: postSnap.data()?.author_id };
    });

    if (result.liked && result.author_id && result.author_id !== session.id) {
      // Fetch user name to send in notification
      const likerSnap = await adminDb.collection(FS.USERS).doc(session.id).get();
      const likerName = likerSnap.exists ? (likerSnap.data() as PlatformUser).full_name : "Someone";
      await notifyPostLiked(result.author_id, likerName, id);
    }

    return NextResponse.json({ success: true, liked: result.liked });
  } catch (error: any) {
    console.error("Like post error:", error);
    return NextResponse.json({ error: error.message || "Failed to toggle like" }, { status: 500 });
  }
}
