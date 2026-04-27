import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";

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

  // createContact is the critical step — success: false means duplicate, which is fine
  let contactResult;
  try {
    contactResult = await loops.createContact({ email: trimmed, properties: { source: "waitlist" } });
    console.log("[waitlist] createContact:", JSON.stringify(contactResult));
  } catch (err) {
    console.error("[waitlist] createContact error:", err);
    return NextResponse.json({ error: "Failed to add to waitlist" }, { status: 500 });
  }

  // sendEvent is best-effort — don't fail the request if the event isn't configured yet
  try {
    const eventResult = await loops.sendEvent({ email: trimmed, eventName: "waitlist_signup" });
    console.log("[waitlist] sendEvent:", JSON.stringify(eventResult));
  } catch (err) {
    console.error("[waitlist] sendEvent error (non-fatal):", err);
  }

  return NextResponse.json({ success: true });
}
