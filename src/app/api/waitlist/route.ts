import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();

  try {
    await loops.createContact(trimmed, { source: "waitlist" });
    await loops.sendEvent({ email: trimmed, eventName: "waitlist_signup" });
    console.log("[waitlist] added to Loops:", trimmed);
  } catch (err) {
    console.error("[waitlist] Loops error:", err);
    return NextResponse.json({ error: "Failed to add to waitlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
