import { adminDb } from "./firebase-admin";
import { FS } from "./firestore-schema";
import type { AuditAction, AuditLog } from "./firestore-schema";

/**
 * Writes an audit log entry to Firestore.
 * Should be called server-side (API routes / Server Actions only).
 */
export async function auditLog(
  actorId: string,
  action: AuditAction,
  targetUserId?: string | null,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (!adminDb) {
    console.warn("auditLog: adminDb not initialized");
    return;
  }

  try {
    const ref = adminDb.collection(FS.AUDIT_LOGS).doc();
    const entry: AuditLog = {
      id: ref.id,
      actor_id: actorId,
      action,
      target_user_id: targetUserId ?? null,
      metadata: metadata ?? {},
      created_at: new Date().toISOString(),
    };
    await ref.set(entry);
  } catch (error) {
    // Audit logging must never crash the main operation
    console.error("auditLog write failed:", error);
  }
}
