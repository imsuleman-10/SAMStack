import { adminDb } from "./firebase-admin";
import { FS } from "./firestore-schema";
import type { Notification, NotificationType } from "./firestore-schema";

async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  referenceId?: string
): Promise<void> {
  if (!adminDb) return;
  try {
    const ref = adminDb.collection(FS.NOTIFICATIONS).doc();
    const notif: Notification = {
      id: ref.id,
      user_id: userId,
      type,
      title,
      message,
      reference_id: referenceId ?? null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    await ref.set(notif);
  } catch (error) {
    console.error("createNotification failed:", error);
  }
}

// ─── Exported notification triggers ──────────────────────────────────────────

export async function notifyMentorAssigned(
  internId: string,
  mentorId: string,
  mentorName: string,
  internName: string
): Promise<void> {
  await Promise.all([
    createNotification(
      internId,
      "mentor_assigned",
      "Mentor Assigned",
      `${mentorName} has been assigned as your mentor.`,
      mentorId
    ),
    createNotification(
      mentorId,
      "mentor_assigned",
      "New Intern Assigned",
      `${internName} has been assigned to you as an intern.`,
      internId
    ),
  ]);
}

export async function notifyMentorChanged(
  internId: string,
  oldMentorId: string,
  newMentorId: string,
  newMentorName: string,
  internName: string
): Promise<void> {
  await Promise.all([
    createNotification(
      internId,
      "mentor_changed",
      "Mentor Changed",
      `Your mentor has been changed to ${newMentorName}.`,
      newMentorId
    ),
    createNotification(
      oldMentorId,
      "mentor_changed",
      "Intern Reassigned",
      `${internName} has been reassigned to another mentor.`,
      internId
    ),
    createNotification(
      newMentorId,
      "mentor_assigned",
      "New Intern Assigned",
      `${internName} has been assigned to you as an intern.`,
      internId
    ),
  ]);
}

export async function notifyMentorRemoved(
  internId: string,
  mentorId: string,
  internName: string
): Promise<void> {
  await Promise.all([
    createNotification(internId, "mentor_removed", "Mentor Unassigned", "Your mentor assignment has been removed."),
    createNotification(mentorId, "mentor_removed", "Intern Removed", `${internName} has been removed from your intern list.`, internId),
  ]);
}

export async function notifyPostLiked(
  postAuthorId: string,
  likerName: string,
  postId: string
): Promise<void> {
  await createNotification(
    postAuthorId,
    "post_liked",
    "Someone liked your post",
    `${likerName} liked your post.`,
    postId
  );
}

export async function notifyPostCommented(
  postAuthorId: string,
  commenterName: string,
  postId: string
): Promise<void> {
  await createNotification(
    postAuthorId,
    "post_commented",
    "New comment on your post",
    `${commenterName} commented on your post.`,
    postId
  );
}

export async function notifyAccountStatusChanged(
  userId: string,
  newStatus: "active" | "suspended" | "inactive"
): Promise<void> {
  const messages: Record<string, { title: string; message: string; type: NotificationType }> = {
    active: { title: "Account Activated", message: "Your account has been activated.", type: "account_activated" },
    suspended: { title: "Account Suspended", message: "Your account has been suspended. Contact support.", type: "account_suspended" },
    inactive: { title: "Account Deactivated", message: "Your account has been deactivated.", type: "account_suspended" },
  };
  const n = messages[newStatus];
  if (n) await createNotification(userId, n.type, n.title, n.message);
}

export async function notifyRoleChanged(
  userId: string,
  newRole: string
): Promise<void> {
  await createNotification(
    userId,
    "role_changed",
    "Role Updated",
    `Your account role has been changed to ${newRole}.`
  );
}
