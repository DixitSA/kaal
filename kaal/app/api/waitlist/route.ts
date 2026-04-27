import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();

  const apiKey = process.env.LOOPS_API_KEY;
  if (apiKey) {
    const loops = new LoopsClient(apiKey);

    try {
      await loops.createContact({ email: trimmed });
      console.log("[waitlist] createContact: success", trimmed);
    } catch (err: unknown) {
      // Log the real error for debugging — don't block the user
      const status = (err as { statusCode?: number })?.statusCode;
      console.error("[waitlist] createContact failed — status:", status, err);
    }

    try {
      await loops.sendEvent({ email: trimmed, eventName: "waitlist_signup" });
      console.log("[waitlist] sendEvent: success");
    } catch (err) {
      console.error("[waitlist] sendEvent failed (non-fatal):", err);
    }
  } else {
    console.warn("[waitlist] LOOPS_API_KEY not set — email not forwarded to Loops:", trimmed);
  }

  // Always return success so the form confirms regardless of Loops state
  return NextResponse.json({ success: true });
}
