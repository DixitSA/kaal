import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";
import { generateDailyState } from "@/lib/engine/dailyEngine";
import { evaluateDecision } from "@/lib/engine/decisionEngine";
import { generateIdentityProfile } from "@/lib/engine/identityEngine";
import { generatePhaseProfile } from "@/lib/engine/phaseEngine";

const dayOneChart = astrologyAdapter.computeChart(
  {
    date: "2001-08-12",
    time: "14:15",
    timezone: "America/New_York",
    latitude: 35.2271,
    longitude: -80.8431,
    timeUnknown: false
  },
  "lahiri",
  new Date("2026-04-07T16:00:00.000Z")
);

const dayTwoChart = astrologyAdapter.computeChart(
  {
    date: "2001-08-12",
    time: "14:15",
    timezone: "America/New_York",
    latitude: 35.2271,
    longitude: -80.8431,
    timeUnknown: false
  },
  "lahiri",
  new Date("2026-04-08T16:00:00.000Z")
);

describe("phrase selection", () => {
  it("keeps identity and phase rendering stable for the same chart and seed", () => {
    expect(generateIdentityProfile(dayOneChart, "phrase-seed")).toEqual(
      generateIdentityProfile(dayOneChart, "phrase-seed")
    );
    expect(generatePhaseProfile(dayOneChart)).toEqual(generatePhaseProfile(dayOneChart));
  });

  it("keeps identity stable across days while daily output can change", () => {
    expect(generateIdentityProfile(dayOneChart, "stable-user")).toEqual(
      generateIdentityProfile(dayTwoChart, "stable-user")
    );
    expect(generateDailyState(dayTwoChart)).not.toEqual(generateDailyState(dayOneChart));
  });

  it("keeps decision phrasing deterministic for the same chart and category", () => {
    expect(evaluateDecision(dayOneChart, "career")).toEqual(
      evaluateDecision(dayOneChart, "career")
    );
  });
});
