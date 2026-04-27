import { NextRequest, NextResponse } from "next/server";
import { LoopsClient, APIError } from "loops";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    console.error("[waitlist] LOOPS_API_KEY not set");
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const trimmed = email.trim().toLowerCase();
  const loops = new LoopsClient(apiKey);

  try {
    await loops.createContact({ email: trimmed });
    console.log("[waitlist] createContact: success");
  } catch (err) {
    if (err instanceof APIError && err.statusCode === 409) {
      // Duplicate contact — already on the waitlist, treat as success
      console.log("[waitlist] createContact: duplicate, already exists");
    } else {
      console.error("[waitlist] createContact error:", err);
      return NextResponse.json({ error: "Failed to add to waitlist" }, { status: 500 });
    }
  }

  // sendEvent is best-effort — don't fail the request if the event isn't configured yet
  try {
    await loops.sendEvent({ email: trimmed, eventName: "waitlist_signup" });
    console.log("[waitlist] sendEvent: success");
  } catch (err) {
    console.error("[waitlist] sendEvent error (non-fatal):", err);
  }

  return NextResponse.json({ success: true });
}
