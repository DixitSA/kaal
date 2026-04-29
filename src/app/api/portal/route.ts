import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { stripe } from "@/lib/stripe";

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

  const user = getUserByEmail(email);
  if (!user || !user.stripeCustomerId) {
    return NextResponse.json({ error: "User not found or missing Stripe customer" }, { status: 404 });
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
