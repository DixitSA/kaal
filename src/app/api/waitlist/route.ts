import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const formEndpoint = process.env.LOOPS_FORM_ENDPOINT;
  if (!formEndpoint) {
    console.warn("[waitlist] LOOPS_FORM_ENDPOINT not set — skipping Loops");
    return NextResponse.json({ success: true });
  }

  const trimmed = email.trim().toLowerCase();

  try {
    const body = new URLSearchParams({ email: trimmed });
    const res = await fetch(formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (res.status === 429) {
      console.warn("[waitlist] Loops rate limited");
    } else {
      const data = await res.json();
      console.log("[waitlist] Loops response:", data);
    }
  } catch (err) {
    console.error("[waitlist] Loops form endpoint error:", err);
  }

  return NextResponse.json({ success: true });
}
