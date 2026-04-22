import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";
import { evaluateDecision } from "@/lib/engine/decisionEngine";
import type { ChartPrimitives } from "@/lib/types/astrology";
import { DECISION_CATEGORIES } from "@/lib/types/engine";

const baseChart = astrologyAdapter.computeChart(
  {
    date: "2001-08-12",
    time: "14:15",
    timezone: "America/New_York",
    latitude: 35.2271,
    longitude: -80.8431,
    timeUnknown: false
  },
  "lahiri",
  new Date("2026-04-07T00:00:00.000Z")
);

const supportiveChart: ChartPrimitives = {
  ...baseChart,
  transit: {
    ...baseChart.transit,
    supportLevel: "high",
    clarityLevel: "high",
    pressureLevel: "low",
    taraBala: {
      ...baseChart.transit.taraBala,
      score: 0.93,
      level: "paramamitra"
    }
  }
};

const pressuredChart: ChartPrimitives = {
  ...baseChart,
  birthTimeMode: "time-unknown" as const,
  confidence: "medium" as const,
  lagnaSign: undefined,
  lagnaDegree: undefined,
  houses: undefined,
  transit: {
    ...baseChart.transit,
    supportLevel: "low",
    clarityLevel: "low",
    pressureLevel: "high",
    taraBala: {
      ...baseChart.transit.taraBala,
      score: 0.12,
      level: "naidhana"
    }
  }
};

describe("decisionEngine", () => {
  it.each(DECISION_CATEGORIES)("stays deterministic for %s", (category) => {
    const first = evaluateDecision(supportiveChart, category);
    const second = evaluateDecision(supportiveChart, category);

    expect(second).toEqual(first);
    expect(first.rationale).toHaveLength(2);
    expect(first.primaryDriver).toEqual(expect.any(String));
    expect(first.secondaryDriver).toEqual(expect.any(String));
  });

  it("responds to supportive versus pressured conditions", () => {
    expect(evaluateDecision(supportiveChart, "career").score).toBeGreaterThan(
      evaluateDecision(pressuredChart, "career").score
    );
    expect(evaluateDecision(supportiveChart, "communication").score).toBeGreaterThan(
      evaluateDecision(pressuredChart, "communication").score
    );
  });

  it("keeps travel and move meaningfully distinct", () => {
    const travel = evaluateDecision(supportiveChart, "travel");
    const move = evaluateDecision(supportiveChart, "move");

    expect(
      travel.score === move.score &&
        travel.primaryDriver === move.primaryDriver &&
        travel.secondaryDriver === move.secondaryDriver
    ).toBe(false);
  });
});
