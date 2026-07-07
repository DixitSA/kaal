import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";
import { mutationLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  let parsedBody: Record<string, unknown>;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const { email } = parsedBody as { email?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const allowed = await checkRateLimit(mutationLimiter, `waitlist:${clientIp(req)}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const trimmed = email.trim().toLowerCase();

  const apiKey = process.env.LOOPS_API_KEY;
  if (apiKey) {
    const loops = new LoopsClient(apiKey);

    try {
      await loops.createContact({ email: trimmed });
      console.log("[waitlist] createContact: success", trimmed);
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 409) {
        console.log("[waitlist] createContact: duplicate contact, already on list");
      } else {
        console.error("[waitlist] createContact failed — status:", status, err);
      }
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
