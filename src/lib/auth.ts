import { SignJWT, jwtVerify } from "jose";

export type UserRole = "admin" | "mentor" | "intern" | "staff" | "member" | "user";
export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

export interface SessionPayload {
  id: string;
  role: UserRole;
  email?: string;
  status?: AccountStatus;
}

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("CRITICAL: JWT_SECRET is not defined in environment variables.");
  }
  return new TextEncoder().encode(secret);
};

/**
 * Creates a unified signed JWT session token for any role.
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(getSecretKey());
}

/**
 * Verifies a session token and returns the payload.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const p = payload as Record<string, unknown>;

    // Support legacy admin_token format: { email } with no role
    if (p.email && !p.role) {
      return { id: p.email as string, role: "admin", email: p.email as string, status: "active" };
    }

    if (!p.id || !p.role) return null;

    return {
      id: p.id as string,
      role: p.role as UserRole,
      email: p.email as string | undefined,
      status: (p.status as AccountStatus) ?? "active",
    };
  } catch {
    return null;
  }
}

// ─── Legacy compat — kept so existing callers don't break ────────────────────

/** @deprecated Use signSessionToken instead */
export async function signAdminToken(payload: { email: string }): Promise<string> {
  return signSessionToken({ id: payload.email, role: "admin", email: payload.email, status: "active" });
}

/** @deprecated Use verifySessionToken instead */
export async function verifyAdminToken(token: string): Promise<{ email: string } | null> {
  const session = await verifySessionToken(token);
  if (!session || session.role !== "admin") return null;
  return { email: session.email ?? session.id };
}
