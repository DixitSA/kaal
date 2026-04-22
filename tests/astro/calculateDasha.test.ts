import { describe, expect, it } from "vitest";

import { calculateDasha } from "@/lib/astro/calculateDasha";

describe("calculateDasha", () => {
  it("returns a typed Vimshottari state shape", () => {
    const dasha = calculateDasha(
      {
        birth: {
          date: "2001-08-12",
          time: "14:15",
          timezone: "America/New_York",
          latitude: 35.2271,
          longitude: -80.8431,
          timeUnknown: false
        },
        natalMoonLongitude: 123.45
      },
      new Date("2026-04-07T00:00:00.000Z")
    );

    expect(dasha.mahadashaLord).toEqual(expect.any(String));
    expect(dasha.antardashaLord).toEqual(expect.any(String));
    expect(dasha.mahadashaStartedAt).toMatch(/Z$/);
    expect(dasha.antardashaEndsAt).toMatch(/Z$/);
    expect(dasha.confidence).toBe("high");
  });

  it("drops to medium confidence when birth time is unknown", () => {
    const dasha = calculateDasha(
      {
        birth: {
          date: "2001-08-12",
          timezone: "America/New_York",
          latitude: 35.2271,
          longitude: -80.8431,
          timeUnknown: true
        },
        natalMoonLongitude: 278.12
      },
      new Date("2026-04-07T00:00:00.000Z")
    );

    expect(dasha.confidence).toBe("medium");
  });
});
