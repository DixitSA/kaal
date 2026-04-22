import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";
import { generateDailyState } from "@/lib/engine/dailyEngine";

const birth = {
  date: "2001-08-12",
  time: "14:15",
  timezone: "America/New_York",
  latitude: 35.2271,
  longitude: -80.8431,
  timeUnknown: false
} as const;

describe("dailyEngine", () => {
  it("is stable across the same local day", () => {
    const morningChart = astrologyAdapter.computeChart(
      birth,
      "lahiri",
      new Date("2026-04-07T13:00:00.000Z")
    );
    const eveningChart = astrologyAdapter.computeChart(
      birth,
      "lahiri",
      new Date("2026-04-07T23:00:00.000Z")
    );

    expect(generateDailyState(eveningChart)).toEqual(generateDailyState(morningChart));
  });

  it("can change on the next local day", () => {
    const dayOneChart = astrologyAdapter.computeChart(
      birth,
      "lahiri",
      new Date("2026-04-07T16:00:00.000Z")
    );
    const dayTwoChart = astrologyAdapter.computeChart(
      birth,
      "lahiri",
      new Date("2026-04-08T16:00:00.000Z")
    );

    expect(generateDailyState(dayTwoChart)).not.toEqual(generateDailyState(dayOneChart));
  });

  it("degrades confidence but keeps a valid contract in time-unknown mode", () => {
    const exactChart = astrologyAdapter.computeChart(
      birth,
      "lahiri",
      new Date("2026-04-07T16:00:00.000Z")
    );
    const unknownChart = astrologyAdapter.computeChart(
      {
        ...birth,
        time: undefined,
        timeUnknown: true
      },
      "lahiri",
      new Date("2026-04-07T16:00:00.000Z")
    );

    const exactDaily = generateDailyState(exactChart);
    const unknownDaily = generateDailyState(unknownChart);

    expect(unknownDaily.guidance).toEqual(expect.any(String));
    expect(unknownDaily.caution).toEqual(expect.any(String));
    expect(unknownDaily.focusArea).toEqual(expect.any(String));
    expect(unknownDaily.confidence).toBeLessThan(exactDaily.confidence);
  });
});
