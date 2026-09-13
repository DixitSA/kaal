import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_TTL_MS, signSession } from "@/lib/session";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// The emailed link lands here. It must NOT consume the token: mail scanners
// (Outlook Safe Links, Gmail prefetch) GET links before the user clicks, which
// would burn it. Hand the token to /auth/complete, which POSTs it back below.
export async function GET(req: NextRequest) {
  const url = new URL("/auth/complete", req.nextUrl.origin);
  const token = req.nextUrl.searchParams.get("token");
  if (token) url.searchParams.set("token", token);
  return NextResponse.redirect(url);
}

export async function POST(req: NextRequest) {
  let token: unknown;
  try {
    ({ token } = await req.json());
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const tokenHash = hashToken(token);
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });

  // Conditional update so two concurrent requests can't both consume the token.
  const consumed = record
    ? await prisma.verificationToken.updateMany({
        where: { id: record.id, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      })
    : { count: 0 };

  if (!record || consumed.count === 0) {
    return NextResponse.json(
      { error: "This link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ email: record.email });
  response.cookies.set(SESSION_COOKIE, signSession(record.email), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return response;
}
