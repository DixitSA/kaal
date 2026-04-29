import { NextRequest, NextResponse } from "next/server";
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

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Look up the Stripe customer by email — no local DB dependency
    const existing = await stripe.customers.list({ email: normalizedEmail, limit: 1 });
    const customer = existing.data[0];

    if (!customer) {
      return NextResponse.json(
        { error: "No Stripe customer found for this email. Subscribe first." },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[portal] error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
