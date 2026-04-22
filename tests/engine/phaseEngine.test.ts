import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";
import { derivePhaseState, generatePhaseProfile } from "@/lib/engine/phaseEngine";
import type { ChartPrimitives } from "@/lib/types/astrology";

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

describe("phaseEngine", () => {
  it("stays stable when dasha state is unchanged even if computedAt changes", () => {
    const first = generatePhaseProfile(baseChart);
    const second = generatePhaseProfile({
      ...baseChart,
      computedAt: "2026-04-11T04:00:00.000Z"
    });

    expect(second).toEqual(first);
  });

  it("lets antardasha refine the phase without replacing the mahadasha state", () => {
    const anchored: ChartPrimitives = {
      ...baseChart,
      dasha: {
        ...baseChart.dasha,
        mahadashaLord: "jupiter",
        antardashaLord: "saturn"
      }
    };
    const refined: ChartPrimitives = {
      ...anchored,
      dasha: {
        ...anchored.dasha,
        antardashaLord: "mars"
      }
    };

    expect(derivePhaseState(refined).stateKey).toBe(derivePhaseState(anchored).stateKey);
    expect(derivePhaseState(refined).intensity).not.toBe(derivePhaseState(anchored).intensity);
    expect(generatePhaseProfile(refined).summary).not.toBe(generatePhaseProfile(anchored).summary);
  });

  it("changes the primary phase when mahadasha changes", () => {
    const growthChart: ChartPrimitives = {
      ...baseChart,
      dasha: {
        ...baseChart.dasha,
        mahadashaLord: "jupiter",
        antardashaLord: "mercury"
      }
    };
    const visibleChart: ChartPrimitives = {
      ...baseChart,
      dasha: {
        ...baseChart.dasha,
        mahadashaLord: "sun",
        antardashaLord: "mercury"
      }
    };

    expect(derivePhaseState(visibleChart).stateKey).not.toBe(derivePhaseState(growthChart).stateKey);
  });
});
