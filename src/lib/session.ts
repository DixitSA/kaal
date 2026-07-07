import crypto from "crypto";

export const SESSION_COOKIE = "kaal_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface SessionPayload {
  email: string;
  iat: number;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not configured");
  return secret;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function signSession(email: string): string {
  const normalized = email.toLowerCase().trim();
  const now = Date.now();
  const payload: SessionPayload = { email: normalized, iat: now, exp: now + SESSION_TTL_MS };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = sign(encodedPayload, getSecret());
  return `${encodedPayload}.${signature}`;
}

export function verifySession(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload, getSecret());
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }

  if (typeof payload.email !== "string" || typeof payload.exp !== "number") return null;
  if (Date.now() >= payload.exp) return null;

  return payload.email;
}

export function sessionMatchesEmail(cookieValue: string | undefined, email: string): boolean {
  const sessionEmail = verifySession(cookieValue);
  return sessionEmail !== null && sessionEmail === email.toLowerCase().trim();
}
