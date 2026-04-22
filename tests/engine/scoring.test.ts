import { describe, expect, it } from "vitest";

import {
  DECISION_CATEGORY_WEIGHTS,
  getDecisionOutcome,
  normalizeDaySeed
} from "@/lib/engine/scoring";
import { DECISION_CATEGORIES } from "@/lib/types/engine";

describe("scoring helpers", () => {
  it("normalizes the same day to one deterministic seed", () => {
    expect(normalizeDaySeed("2026-04-07")).toBe(
      normalizeDaySeed("2026-04-07T22:45:00.000Z", "UTC")
    );
    expect(normalizeDaySeed("2026-04-08")).not.toBe(
      normalizeDaySeed("2026-04-07T22:45:00.000Z", "UTC")
    );
  });

  it("respects explicit local timezones for cross-midnight timestamps", () => {
    expect(
      normalizeDaySeed("2026-04-07T18:30:00.000Z", "Asia/Kolkata")
    ).toBe(normalizeDaySeed("2026-04-08"));
    expect(
      normalizeDaySeed("2026-04-07T03:30:00.000Z", "America/New_York")
    ).toBe(normalizeDaySeed("2026-04-06"));
    expect(
      normalizeDaySeed("2026-04-07T03:30:00.000Z", "UTC")
    ).not.toBe(normalizeDaySeed("2026-04-06"));
  });

  it("keeps explicit date-only seeds stable without timezone parsing", () => {
    expect(normalizeDaySeed("2026-04-07")).toBe("day:2026-04-07");
    expect(normalizeDaySeed("2026-04-07")).not.toBe(normalizeDaySeed("2026-04-08"));
  });

  it("defines chart-derived weights for all six decision categories", () => {
    for (const category of DECISION_CATEGORIES) {
      expect(DECISION_CATEGORY_WEIGHTS[category]).toBeDefined();
      expect(Object.keys(DECISION_CATEGORY_WEIGHTS[category]).length).toBeGreaterThanOrEqual(9);
    }
  });

  it("classifies threshold boundaries explicitly", () => {
    expect(getDecisionOutcome(0.32)).toBe("caution");
    expect(getDecisionOutcome(0.33)).toBe("caution");
    expect(getDecisionOutcome(0.34)).toBe("neutral");
    expect(getDecisionOutcome(0.66)).toBe("neutral");
    expect(getDecisionOutcome(0.67)).toBe("favorable");
    expect(getDecisionOutcome(0.68)).toBe("favorable");
  });
});
