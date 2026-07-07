import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, updateUser } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { SESSION_COOKIE, signSession, sessionMatchesEmail } from "@/lib/session";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email query param required" }, { status: 400 });
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionMatchesEmail(sessionCookie, email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const { email, name, dob, timeOfBirth, unknownTime, placeOfBirth, latitude, longitude, timezone } = body as {
    email?: string;
    name?: string;
    dob?: string;
    timeOfBirth?: string;
    unknownTime?: boolean;
    placeOfBirth?: string;
    latitude?: number | string;
    longitude?: number | string;
    timezone?: string;
  };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const parsedLat = latitude !== undefined ? Number(latitude) : undefined;
  const parsedLng = longitude !== undefined ? Number(longitude) : undefined;

  let user = await getUserByEmail(email);
  if (user) {
    // Same-device resume: if this browser already holds a valid session for this
    // email (set on original signup/checkout), refresh their intake fields and let
    // them back in without losing their subscription. A bare email with no matching
    // cookie is not proof of ownership, so that case is left as a 409 (unchanged).
    const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionMatchesEmail(sessionCookie, email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    user = await updateUser(email, {
      name,
      dob,
      timeOfBirth,
      unknownTime,
      placeOfBirth,
      latitude: Number.isFinite(parsedLat) ? parsedLat : undefined,
      longitude: Number.isFinite(parsedLng) ? parsedLng : undefined,
      timezone,
    });

    const response = NextResponse.json(user);
    response.cookies.set(SESSION_COOKIE, signSession(email), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  try {
    const customer = await stripe.customers.create({
      email: email.toLowerCase().trim(),
      name: name || undefined,
    });

    user = await createUser({
      email,
      name,
      dob,
      timeOfBirth,
      unknownTime,
      placeOfBirth,
      latitude: Number.isFinite(parsedLat) ? parsedLat : undefined,
      longitude: Number.isFinite(parsedLng) ? parsedLng : undefined,
      timezone,
      stripeCustomerId: customer.id,
    });

    const response = NextResponse.json(user);
    response.cookies.set(SESSION_COOKIE, signSession(email), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (err) {
    console.error("[user] POST error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
