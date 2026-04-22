import { describe, expect, it } from "vitest";

import { calculateJulianDay, resolveBirthUtcDate } from "@/lib/astro/calculateJulianDay";

describe("calculateJulianDay", () => {
  it("returns the same Julian day for the same local input", () => {
    expect(calculateJulianDay("2001-08-12", "14:15", "America/New_York")).toBe(
      calculateJulianDay("2001-08-12", "14:15", "America/New_York")
    );
  });

  it("accounts for timezone when resolving UTC birth time", () => {
    const utcDate = resolveBirthUtcDate("2001-08-12", "14:15", "America/New_York");

    expect(utcDate.toISOString()).toBe("2001-08-12T18:15:00.000Z");
  });

  it("uses noon when time is unknown", () => {
    const known = calculateJulianDay("2001-08-12", "12:00", "UTC");
    const unknown = calculateJulianDay("2001-08-12", undefined, "UTC");

    expect(unknown).toBe(known);
  });
});
