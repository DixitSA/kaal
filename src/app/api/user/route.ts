import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email query param required" }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, dob, timeOfBirth, placeOfBirth } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  let user = getUserByEmail(email);
  if (user) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  try {
    const customer = await stripe.customers.create({
      email: email.toLowerCase().trim(),
      name: name || undefined,
    });

    user = createUser({
      email,
      name,
      dob,
      timeOfBirth,
      placeOfBirth,
      stripeCustomerId: customer.id,
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("[user] POST error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
