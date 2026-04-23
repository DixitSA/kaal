import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";

const sampleBirth = {
  date: "2001-08-12",
  time: "14:15",
  timezone: "America/New_York",
  latitude: 35.2271,
  longitude: -80.8431,
  timeUnknown: false
} as const;

describe("astrologyAdapter", () => {
  it("exposes a deterministic runtime status", () => {
    const first = astrologyAdapter.getRuntimeStatus();
    const second = astrologyAdapter.getRuntimeStatus();

    expect(second).toEqual(first);
    expect(first.provider).toBe(astrologyAdapter.computeProvider);
    expect(astrologyAdapter.nativeEngineTarget).toBe("swisseph");
    expect(typeof first.swissephAvailable).toBe("boolean");
    expect(first.note.length).toBeGreaterThan(0);
    // note describes whichever provider is active — just verify it is non-empty
    expect(typeof first.note).toBe("string");
  });

  it("returns normalized sidereal state through the adapter seam", () => {
    const state = astrologyAdapter.computeSiderealState(sampleBirth);

    expect(state.julianDayUT).toBeGreaterThan(2400000);
    expect(state.planetLongitudes.sun).toBeGreaterThanOrEqual(0);
    expect(state.planetLongitudes.sun).toBeLessThan(360);
    expect(state.planetLongitudes.moon).toBeGreaterThanOrEqual(0);
    expect(state.planetLongitudes.moon).toBeLessThan(360);
  });

  it("throws a clear error when required location inputs are missing", () => {
    expect(() =>
      astrologyAdapter.computeSiderealState({
        date: "2001-08-12",
        time: "14:15",
        timeUnknown: false
      })
    ).toThrow("Birth input must include latitude, longitude, and timezone");
  });
});
