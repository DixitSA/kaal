import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !user.stripeCustomerId) {
    return NextResponse.json({ error: "User not found or missing Stripe customer" }, { status: 404 });
  }

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "STRIPE_PRO_PRICE_ID not configured" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
