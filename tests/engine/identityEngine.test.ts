import { describe, expect, it } from "vitest";

import { astrologyAdapter } from "@/lib/astro/adapter";
import { deriveIdentityState, generateIdentityProfile } from "@/lib/engine/identityEngine";

const exactChart = astrologyAdapter.computeChart(
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

const timeUnknownChart = astrologyAdapter.computeChart(
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

describe("identityEngine", () => {
  it("keeps the moon-led identity stable in time-unknown mode", () => {
    const exactProfile = generateIdentityProfile(exactChart, "same-seed");
    const unknownProfile = generateIdentityProfile(timeUnknownChart, "same-seed");

    expect(unknownProfile.archetype).toBe(exactProfile.archetype);
    expect(unknownProfile.core).toBe(exactProfile.core);
    expect(unknownProfile.confidence).toBeLessThan(exactProfile.confidence);
  });

  it("uses lagna when available to shape decision style", () => {
    expect(deriveIdentityState({ ...exactChart, lagnaSign: "Taurus" }).decisionStyle).toBe("deliberate");
    expect(deriveIdentityState({ ...exactChart, lagnaSign: "Gemini" }).decisionStyle).toBe("adaptive");
    expect(deriveIdentityState({ ...exactChart, lagnaSign: "Aries" }).decisionStyle).toBe("decisive");
  });

  it("falls back to moon-led decision style when lagna is unavailable", () => {
    const moonLed = deriveIdentityState({ ...exactChart, lagnaSign: undefined });
    const explicitFallback = deriveIdentityState({ ...exactChart, lagnaSign: exactChart.moonSign });

    expect(moonLed.decisionStyle).toBe(explicitFallback.decisionStyle);
    expect(moonLed.confidence).toBeLessThan(deriveIdentityState(exactChart).confidence);
  });

  it("stays deterministic for the same chart and seed", () => {
    const first = generateIdentityProfile(exactChart, "identity-user");
    const second = generateIdentityProfile(exactChart, "identity-user");

    expect(second).toEqual(first);
  });
});
