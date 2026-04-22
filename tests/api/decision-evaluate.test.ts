import { describe, expect, it } from "vitest";

import { POST as evaluateDecision } from "@/app/api/decision/evaluate/route";
import { astrologyAdapter } from "@/lib/astro/adapter";
import { decisionResponseSchema, errorResponseSchema } from "@/lib/schemas/output";
import { DECISION_CATEGORIES } from "@/lib/types/engine";

const sampleChart = astrologyAdapter.computeChart({
  date: "2001-08-12",
  time: "14:15",
  timezone: "America/New_York",
  latitude: 35.2271,
  longitude: -80.8431,
  timeUnknown: false
}, "lahiri", new Date("2026-04-07T00:00:00.000Z"));

describe("POST /api/decision/evaluate", () => {
  it("returns a shared validation envelope for malformed JSON", async () => {
    const response = await evaluateDecision(
      new Request("http://localhost/api/decision/evaluate", {
        method: "POST",
        body: "{",
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request body must be valid JSON."
      }
    });
  });

  it.each([DECISION_CATEGORIES[0], DECISION_CATEGORIES[2]])(
    "returns a stable placeholder decision for %s input",
    async (category) => {
      const response = await evaluateDecision(
        new Request("http://localhost/api/decision/evaluate", {
          method: "POST",
          body: JSON.stringify({
            chart: sampleChart,
            category
          }),
          headers: {
            "content-type": "application/json"
          }
        })
      );
      const payload = decisionResponseSchema.parse(await response.json());

      expect(response.status).toBe(200);
      expect(payload.ok).toBe(true);
      expect(payload.data.contractVersion).toBe("1.0");
      expect(payload).toMatchObject({
        data: {
          decision: {
            category,
            confidence: expect.any(Number),
            primaryDriver: expect.any(String),
            secondaryDriver: expect.any(String)
          }
        }
      });
      expect(["favorable", "neutral", "caution"]).toContain(payload.data.decision.outcome);
      expect(payload.data.decision.score).toBeGreaterThanOrEqual(0);
      expect(payload.data.decision.score).toBeLessThanOrEqual(1);
      expect(payload.data.decision.guidance).toEqual(expect.any(String));
      expect(payload.data.decision.rationale.length).toBeGreaterThan(0);
      expect(payload.data.decision.rationale.every((item) => typeof item === "string")).toBe(true);
    }
  );
});
