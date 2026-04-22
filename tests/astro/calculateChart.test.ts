import { afterEach, describe, expect, it, vi } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";

afterEach(() => {
  vi.useRealTimers();
});

describe("chart computation", () => {
  it("builds exact-time chart primitives with lagna and houses", () => {
    const chart = astrologyAdapter.computeChart(
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

    expect(chart.birthTimeMode).toBe("exact");
    expect(chart.confidence).toBe("high");
    expect(chart.lagnaSign).toEqual(expect.any(String));
    expect(chart.houses).toHaveLength(12);
    expect(chart.planetPositions.moon.sign).toBe(chart.moonSign);
    expect(chart.dasha.mahadashaLord).toEqual(expect.any(String));
  });

  it("keeps time-unknown output explicit and lower confidence", () => {
    const chart = astrologyAdapter.computeChart(
      {
        date: "2001-08-12",
        timezone: "America/New_York",
        latitude: 35.2271,
        longitude: -80.8431,
        timeUnknown: true
      },
      "lahiri",
      new Date("2026-04-07T00:00:00.000Z")
    );

    expect(chart.birthTimeMode).toBe("time-unknown");
    expect(chart.confidence).toBe("medium");
    expect(chart.lagnaSign).toBeUndefined();
    expect(chart.houses).toBeUndefined();
  });

  it("stays deterministic across multiple calls on the same day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-07T09:15:00.000Z"));

    const first = astrologyAdapter.computeChart({
      date: "2001-08-12",
      time: "14:15",
      timezone: "America/New_York",
      latitude: 35.2271,
      longitude: -80.8431,
      timeUnknown: false
    });

    vi.setSystemTime(new Date("2026-04-07T22:45:00.000Z"));

    const second = astrologyAdapter.computeChart({
      date: "2001-08-12",
      time: "14:15",
      timezone: "America/New_York",
      latitude: 35.2271,
      longitude: -80.8431,
      timeUnknown: false
    });

    expect(second).toEqual(first);
  });

  it("normalizes asOf to the same local day in the birth timezone", () => {
    const earlyChart = astrologyAdapter.computeChart(
      {
        date: "2001-08-12",
        time: "14:15",
        timezone: "America/New_York",
        latitude: 35.2271,
        longitude: -80.8431,
        timeUnknown: false
      },
      "lahiri",
      new Date("2026-04-07T04:05:00.000Z")
    );
    const lateChart = astrologyAdapter.computeChart(
      {
        date: "2001-08-12",
        time: "14:15",
        timezone: "America/New_York",
        latitude: 35.2271,
        longitude: -80.8431,
        timeUnknown: false
      },
      "lahiri",
      new Date("2026-04-08T03:55:00.000Z")
    );

    expect(lateChart).toEqual(earlyChart);
  });
});
