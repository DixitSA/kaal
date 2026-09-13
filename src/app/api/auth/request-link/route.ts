import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";
import { prisma } from "@/lib/prisma";
import { authLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const { email } = body as { email?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const allowed = await checkRateLimit(authLimiter, `request-link:${clientIp(req)}:${normalizedEmail}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  try {
    await prisma.verificationToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const magicLink = `${baseUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;

    const apiKey = process.env.LOOPS_API_KEY;
    const templateId = process.env.LOOPS_MAGIC_LINK_TEMPLATE_ID;
    if (apiKey && templateId) {
      await new LoopsClient(apiKey).sendTransactionalEmail({
        transactionalId: templateId,
        email: normalizedEmail,
        dataVariables: { magicLink },
      });
    } else if (process.env.NODE_ENV === "production") {
      throw new Error("Loops not configured (LOOPS_API_KEY / LOOPS_MAGIC_LINK_TEMPLATE_ID)");
    } else {
      console.warn("[auth/request-link] Loops not configured — magic link not sent:", magicLink);
    }
  } catch (err) {
    // Safe to surface: this route sends a link to any address, account or not,
    // so a failure here says nothing about whether the email has an account.
    console.error("[auth/request-link] error:", err);
    return NextResponse.json({ error: "Couldn't send a sign-in link. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
