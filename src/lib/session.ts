import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, type SessionPayload, type UserRole } from "./auth";

/**
 * Extracts and verifies the session from a NextRequest's cookies.
 * Supports unified session_token and legacy admin_token / user_token.
 */
export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const sessionToken =
    req.cookies.get("session_token")?.value ||
    req.cookies.get("admin_token")?.value ||
    req.cookies.get("user_token")?.value;

  if (!sessionToken) return null;
  return verifySessionToken(sessionToken);
}

/**
 * Validates session for an API route.
 * Returns the payload or a 401/403 NextResponse to be returned immediately.
 */
export async function requireAuth(
  req: NextRequest,
  allowedRoles?: UserRole[]
): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (session.status === "suspended") {
    return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });
  }

  if (session.status === "inactive") {
    return NextResponse.json({ error: "Your account is inactive." }, { status: 403 });
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: "You do not have permission to access this resource." }, { status: 403 });
  }

  return { session };
}

/**
 * Ensures the requesting user is accessing their own resource OR is an admin.
 */
export async function requireOwnerOrAdmin(
  req: NextRequest,
  resourceOwnerId: string
): Promise<{ session: SessionPayload } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;

  const { session } = result;
  if (session.id !== resourceOwnerId && session.role !== "admin") {
    return NextResponse.json({ error: "You do not have permission to modify this resource." }, { status: 403 });
  }

  return { session };
}

/**
 * Type guard — narrows the result of requireAuth.
 */
export function isAuthError(result: { session: SessionPayload } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
