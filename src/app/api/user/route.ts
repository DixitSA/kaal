import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, updateUser } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { SESSION_COOKIE, sessionMatchesEmail } from "@/lib/session";
import { mutationLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";

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

  const allowed = await checkRateLimit(mutationLimiter, `user:${clientIp(req)}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // A bare email is not proof of ownership. Every path below — creating a brand
  // new account or updating an existing one — requires a session already minted
  // by /api/auth/verify (i.e. the caller clicked a magic link sent to this
  // address). Without that, we never create or mutate a user record.
  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionMatchesEmail(sessionCookie, email)) {
    return NextResponse.json(
      { error: "Email not verified for this browser. Request a sign-in link at /api/auth/request-link." },
      { status: 401 }
    );
  }

  const parsedLat = latitude !== undefined ? Number(latitude) : undefined;
  const parsedLng = longitude !== undefined ? Number(longitude) : undefined;

  let user = await getUserByEmail(email);
  if (user) {
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

    return NextResponse.json(user);
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

    return NextResponse.json(user);
  } catch (err) {
    console.error("[user] POST error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
