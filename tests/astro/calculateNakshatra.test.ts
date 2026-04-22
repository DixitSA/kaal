import { describe, expect, it } from "vitest";

import {
  buildEqualHousePositions,
  calculateNakshatra,
  createPlanetPosition,
  getSignName
} from "@/lib/astro/calculateNakshatra";

describe("calculateNakshatra", () => {
  it("maps longitudes to the expected sign and nakshatra", () => {
    const placement = calculateNakshatra(15);

    expect(placement.sign).toBe("Aries");
    expect(placement.nakshatra).toBe("Bharani");
    expect(placement.pada).toBe(1);
  });

  it("creates planet positions with optional house mapping", () => {
    const position = createPlanetPosition(75, 15);

    expect(position.sign).toBe("Gemini");
    expect(position.house).toBe(3);
    expect(getSignName(210)).toBe("Scorpio");
  });

  it("builds equal houses from the lagna longitude", () => {
    const houses = buildEqualHousePositions(103.5);

    expect(houses).toHaveLength(12);
    expect(houses[0]).toMatchObject({
      house: 1,
      sign: "Cancer"
    });
  });
});
