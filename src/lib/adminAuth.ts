import { cookies } from "next/headers";
import { verifySessionToken, type SessionPayload } from "./auth";

/**
 * Reads the unified session_token (or legacy admin_token/user_token) from cookies
 * and returns the verified payload, or null if invalid/missing.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();

    // Prefer unified session_token
    const sessionToken = cookieStore.get("session_token")?.value;
    if (sessionToken) return verifySessionToken(sessionToken);

    // Legacy: admin_token
    const adminToken = cookieStore.get("admin_token")?.value;
    if (adminToken) return verifySessionToken(adminToken);

    // Legacy: user_token
    const userToken = cookieStore.get("user_token")?.value;
    if (userToken) return verifySessionToken(userToken);

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns session or null — for admin server components.
 * Accepts both unified and legacy token formats.
 */
export async function verifyAdminSession(): Promise<{ id: string; role: string; email?: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return { id: session.id, role: session.role, email: session.email };
}
