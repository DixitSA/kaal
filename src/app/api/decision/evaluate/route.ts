import { evaluateDecision } from "@/lib/engine/decisionEngine";
import { parseJsonRequest, successResponse, errorResponse, unauthorizedResponse, paywallRequiredResponse } from "@/lib/api/routeHelpers";
import { decisionEvaluateRequestSchema } from "@/lib/schemas/input";
import { decisionResponseSchema } from "@/lib/schemas/output";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { getUserByEmail } from "@/lib/db";
import { computeLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";
import { FREE_TRIAL_DAYS } from "@/lib/constants";

function isTrialExpired(trialStartDate: Date, subscriptionStatus: string): boolean {
  if (subscriptionStatus === "pro") return false;
  const daysOnFree = Math.floor((Date.now() - trialStartDate.getTime()) / 86_400_000);
  return daysOnFree > FREE_TRIAL_DAYS;
}

export async function POST(request: Request): Promise<Response> {
  const allowed = await checkRateLimit(computeLimiter, `decision:${clientIp(request)}`);
  if (!allowed) {
    return errorResponse("RATE_LIMITED", 429, "Too many requests. Please try again later.");
  }

  // The Decision section is the app's one paywalled feature (dashboard gates it
  // client-side too, but that's a UX affordance only — this is the real check).
  // It must be derived from the DB, never trusted from the client.
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  const email = verifySession(sessionCookie);
  if (!email) {
    return unauthorizedResponse("Sign in to evaluate a decision.");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return unauthorizedResponse("Sign in to evaluate a decision.");
  }

  if (isTrialExpired(user.trialStartDate, user.subscriptionStatus)) {
    return paywallRequiredResponse("Your free trial has ended. Upgrade to keep evaluating decisions.");
  }

  const parsedRequest = await parseJsonRequest(request, decisionEvaluateRequestSchema, {
    invalidJsonDetail: "The decision route accepts a JSON object.",
    validationMessage: "Decision input did not match the shared decision request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  try {
    return successResponse(decisionResponseSchema, {
      ok: true,
      data: {
        contractVersion: "1.0",
        decision: evaluateDecision(parsedRequest.data.chart, parsedRequest.data.category)
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "decision evaluation failed";
    return errorResponse("INTERNAL_ERROR", 500, message);
  }
}
