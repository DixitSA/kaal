import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { SESSION_COOKIE, sessionMatchesEmail } from "@/lib/session";
import { getUserByEmail } from "@/lib/db";
import { mutationLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";
import { FREE_TRIAL_DAYS } from "@/lib/constants";

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

  const allowed = await checkRateLimit(mutationLimiter, `checkout:${clientIp(req)}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // Checkout must never mint a session itself — it only ever acts on behalf of
  // whoever already holds a valid session for this email (see /api/auth/verify).
  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionMatchesEmail(sessionCookie, normalizedEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "STRIPE_PRO_PRICE_ID not configured" }, { status: 500 });
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: FREE_TRIAL_DAYS },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
