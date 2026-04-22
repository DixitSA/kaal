import { describe, expect, it } from "vitest";

import { calculateTaraBala, calculateTaraOffset } from "@/lib/astro/calculateTaraBala";

describe("calculateTaraBala", () => {
  it("classifies tara bala from nakshatra offsets", () => {
    const tara = calculateTaraBala(0, 1);

    expect(tara.offset).toBe(2);
    expect(tara.level).toBe("sampat");
    expect(tara.score).toBeGreaterThan(0.8);
  });

  it("wraps offsets across the 27-nakshatra cycle", () => {
    expect(calculateTaraOffset(26, 0)).toBe(2);
  });
});
