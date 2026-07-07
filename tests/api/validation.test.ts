import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/session")>();
  return { ...actual, verifySession: () => "demo@example.com" };
});

vi.mock("@/lib/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/db")>();
  return {
    ...actual,
    getUserByEmail: async () =>
      ({
        id: "demo-user",
        subscriptionStatus: "pro",
        trialStartDate: new Date()
      }) as Awaited<ReturnType<typeof actual.getUserByEmail>>
  };
});

import { POST as evaluateDecision } from "@/app/api/decision/evaluate/route";
import { POST as computeChart } from "@/app/api/chart/compute/route";
import { POST as lookupLocation } from "@/app/api/location/lookup/route";
import { POST as generateProfile } from "@/app/api/profile/generate/route";
import { GET as getToday } from "@/app/api/today/[userId]/route";
import { birthInputSchema, locationLookupRequestSchema } from "@/lib/schemas/input";
import { chartResponseSchema, todayResponseSchema } from "@/lib/schemas/output";

describe("API validation contracts", () => {
  it.each([
    ["chart compute", computeChart, "http://localhost/api/chart/compute"],
    ["profile generate", generateProfile, "http://localhost/api/profile/generate"],
    ["decision evaluate", evaluateDecision, "http://localhost/api/decision/evaluate"],
    ["location lookup", lookupLocation, "http://localhost/api/location/lookup"]
  ] as const)("returns a shared validation envelope for malformed %s JSON", async (_, handler, url) => {
    const response = await handler(
      new Request(url, {
        method: "POST",
        body: "{",
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request body must be valid JSON."
      }
    });
    expect(payload.error.details).toEqual([expect.any(String)]);
  });

  it("returns a shared validation envelope for malformed chart input", async () => {
    const response = await computeChart(
      new Request("http://localhost/api/chart/compute", {
        method: "POST",
        body: JSON.stringify({
          birth: {
            date: "2001-08-12",
            timezone: "America/New_York",
            latitude: 35.2271
          }
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("rejects impossible calendar dates at the birth validation boundary", () => {
    const result = birthInputSchema.safeParse({
      date: "2024-02-30",
      time: "14:15",
      timezone: "America/New_York",
      latitude: 35.2271,
      longitude: -80.8431,
      timeUnknown: false
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "date")).toBe(true);
    }
  });

  it("returns a shared success envelope for valid chart input", async () => {
    const response = await computeChart(
      new Request("http://localhost/api/chart/compute", {
        method: "POST",
        body: JSON.stringify({
          birth: {
            date: "2001-08-12",
            time: "14:15",
            timezone: "America/New_York",
            latitude: 35.2271,
            longitude: -80.8431,
            timeUnknown: false
          }
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = chartResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.data.contractVersion).toBe("1.0");
    expect(payload).toMatchObject({
      data: {
        chart: {
          ayanamsha: "lahiri",
          birthTimeMode: "exact",
          confidence: "high",
          computedDate: expect.any(String),
          moonNakshatra: expect.any(String),
          planetPositions: {
            moon: {
              sign: expect.any(String)
            }
          }
        }
      }
    });
  });

  it("rejects invalid timezone identifiers at the birth validation boundary", () => {
    const result = birthInputSchema.safeParse({
      date: "2001-08-12",
      time: "14:15",
      timezone: "Mars/Base",
      latitude: 35.2271,
      longitude: -80.8431,
      timeUnknown: false
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "timezone")).toBe(true);
    }
  });

  it("rejects overly short location lookup queries at the route schema boundary", () => {
    const result = locationLookupRequestSchema.safeParse({
      query: "a"
    });

    expect(result.success).toBe(false);
  });

  it("keeps time-unknown chart computation explicit and non-crashing", async () => {
    const response = await computeChart(
      new Request("http://localhost/api/chart/compute", {
        method: "POST",
        body: JSON.stringify({
          birth: {
            date: "2001-08-12",
            timezone: "America/New_York",
            latitude: 35.2271,
            longitude: -80.8431,
            timeUnknown: true
          }
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = chartResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.data.contractVersion).toBe("1.0");
    expect(payload.data.chart.birthTimeMode).toBe("time-unknown");
    expect(payload.data.chart.confidence).toBe("medium");
    expect(payload.data.chart.lagnaSign).toBeUndefined();
    expect(payload.data.chart.houses).toBeUndefined();
    expect(payload.data.chart.computedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("keeps the today route stateless and deterministic for a valid userId", async () => {
    const first = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });
    const second = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });

    expect(first.status).toBe(200);
    const firstPayload = todayResponseSchema.parse(await first.json());
    const secondPayload = todayResponseSchema.parse(await second.json());

    expect(firstPayload).toEqual(secondPayload);
    expect(firstPayload.data.daily).toMatchObject({
      focusKey: expect.any(String),
      signalTone: expect.any(String),
      clarityLevel: expect.any(String),
      pressureLevel: expect.any(String)
    });
  });

  it("returns a shared validation envelope for an invalid today param", async () => {
    const response = await getToday(new Request("http://localhost/api/today/not allowed"), {
      params: Promise.resolve({ userId: "not allowed" })
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("VALIDATION_ERROR");
  });
});
