import { SignJWT, jwtVerify } from "jose";

// Get the secret key from environment variables, or fallback to a dummy key for development only
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn("JWT_SECRET is not defined in environment variables. Using a fallback secret. Do NOT do this in production.");
  }
  return new TextEncoder().encode(secret || "samstack-fallback-secret-key-2026-super-secure");
};

/**
 * Creates a signed JWT for the admin session
 * @param payload Data to encode in the JWT
 * @returns A signed JWT string
 */
export async function signAdminToken(payload: { email: string }): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(getSecretKey());
}

/**
 * Verifies a JWT admin token
 * @param token The JWT string to verify
 * @returns The payload if valid, or null if invalid/expired
 */
export async function verifyAdminToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { email: string };
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}
