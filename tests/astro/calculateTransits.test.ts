import { describe, expect, it } from "vitest";

import { calculateTransits } from "@/lib/astro/calculateTransits";

describe("calculateTransits", () => {
  it("returns deterministic Moon-based transit modifiers", () => {
    const first = calculateTransits({
      natalMoonLongitude: 123.45,
      currentMoonLongitude: 210.25
    });
    const second = calculateTransits({
      natalMoonLongitude: 123.45,
      currentMoonLongitude: 210.25
    });

    expect(first).toEqual(second);
    expect(first.taraBala.offset).toBeGreaterThanOrEqual(1);
    expect(first.taraBala.offset).toBeLessThanOrEqual(27);
    expect(["low", "steady", "high"]).toContain(first.supportLevel);
  });
});
