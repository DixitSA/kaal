import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_TTL_MS, signSession } from "@/lib/session";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function redirectWithError(baseUrl: string, message: string): NextResponse {
  const url = new URL("/", baseUrl);
  url.searchParams.set("authError", message);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return redirectWithError(baseUrl, "Missing verification token.");
  }

  const tokenHash = hashToken(token);
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.consumedAt || record.expiresAt.getTime() < Date.now()) {
    return redirectWithError(baseUrl, "This link is invalid or has expired. Please request a new one.");
  }

  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  const url = new URL("/auth/complete", baseUrl);
  url.searchParams.set("email", record.email);
  const response = NextResponse.redirect(url);
  response.cookies.set(SESSION_COOKIE, signSession(record.email), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return response;
}
