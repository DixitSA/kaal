import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { SESSION_COOKIE, sessionMatchesEmail } from "@/lib/session";
import { getUserByEmail } from "@/lib/db";
import { mutationLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";

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

  const allowed = await checkRateLimit(mutationLimiter, `portal:${clientIp(req)}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionMatchesEmail(sessionCookie, normalizedEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for this email. Subscribe first." },
      { status: 404 }
    );
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[portal] error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
