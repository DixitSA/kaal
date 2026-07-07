import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

function makeLimiter(tokens: number, window: `${number} ${"s" | "m" | "h"}`): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
  });
}

// Most sensitive: mints access via emailed links.
export const authLimiter = makeLimiter(5, "15 m");
// Account/profile/billing mutations and outbound-email triggers.
export const mutationLimiter = makeLimiter(20, "1 m");
// CPU-bound astrology/proxy compute endpoints.
export const computeLimiter = makeLimiter(30, "1 m");

export function clientIp(req: NextRequest | Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

/**
 * Returns true if the request is allowed. Fails open (with a warning) when
 * Upstash isn't configured, so local dev without Upstash env vars still works.
 */
export async function checkRateLimit(limiter: Ratelimit | null, key: string): Promise<boolean> {
  if (!limiter) {
    console.warn("[rateLimit] Upstash not configured — skipping rate limit check");
    return true;
  }
  const { success } = await limiter.limit(key);
  return success;
}
