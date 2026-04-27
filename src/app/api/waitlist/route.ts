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

  try {
    await loops.createContact({ email: trimmed, properties: { source: "waitlist" } });
    await loops.sendEvent({ email: trimmed, eventName: "waitlist_signup" });
    console.log("[waitlist] added to Loops:", trimmed);
  } catch (err) {
    console.error("[waitlist] Loops error:", err);
    return NextResponse.json({ error: "Failed to add to waitlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
