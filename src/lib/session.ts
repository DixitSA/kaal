import crypto from "crypto";

export const SESSION_COOKIE = "kaal_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not configured");
  return secret;
}

function sign(email: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(email).digest("base64url");
}

export function signSession(email: string): string {
  const normalized = email.toLowerCase().trim();
  const signature = sign(normalized, getSecret());
  return `${Buffer.from(normalized, "utf-8").toString("base64url")}.${signature}`;
}

export function verifySession(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const [encodedEmail, signature] = cookieValue.split(".");
  if (!encodedEmail || !signature) return null;

  let email: string;
  try {
    email = Buffer.from(encodedEmail, "base64url").toString("utf-8");
  } catch {
    return null;
  }

  const expected = sign(email, getSecret());
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null;

  return email;
}

export function sessionMatchesEmail(cookieValue: string | undefined, email: string): boolean {
  const sessionEmail = verifySession(cookieValue);
  return sessionEmail !== null && sessionEmail === email.toLowerCase().trim();
}
