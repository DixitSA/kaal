import { DEFAULT_AYANAMSHA } from "@/lib/astro/constants";
import { getIsoDateInTimeZone } from "@/lib/astro/calculateJulianDay";
import {
  buildEqualHousePositions,
  calculateNakshatra,
  createPlanetPosition,
  getDegreeInSign,
  getSignName
} from "@/lib/astro/calculateNakshatra";
import { calculateDasha } from "@/lib/astro/calculateDasha";
import { calculateTransits } from "@/lib/astro/calculateTransits";
import type {
  AyanamshaKey,
  BirthInput,
  ChartPrimitives,
  PlanetKey
} from "@/lib/types/astrology";
import { getBirthTimeMode } from "@/lib/types/astrology";

export interface ChartAssemblyInput {
  birth: BirthInput;
  ayanamsha: AyanamshaKey;
  julianDayUT: number;
  planetLongitudes: Record<PlanetKey, number>;
  lagnaLongitude?: number;
  currentMoonLongitude: number;
  asOf: Date;
}

export function buildChartPrimitives({
  birth,
  ayanamsha = DEFAULT_AYANAMSHA,
  julianDayUT,
  planetLongitudes,
  lagnaLongitude,
  currentMoonLongitude,
  asOf
}: ChartAssemblyInput): ChartPrimitives {
  const birthTimeMode = getBirthTimeMode(birth);
  const moonPosition = createPlanetPosition(planetLongitudes.moon, lagnaLongitude);
  const sunPosition = createPlanetPosition(planetLongitudes.sun, lagnaLongitude);
  const houses = lagnaLongitude === undefined ? undefined : buildEqualHousePositions(lagnaLongitude);
  const moonPlacement = calculateNakshatra(planetLongitudes.moon);

  return {
    ayanamsha,
    birthTimeMode,
    julianDayUT,
    lagnaSign: lagnaLongitude === undefined ? undefined : getSignName(lagnaLongitude),
    lagnaDegree: lagnaLongitude === undefined ? undefined : getDegreeInSign(lagnaLongitude),
    moonSign: moonPosition.sign,
    moonDegree: moonPosition.degree,
    moonNakshatra: moonPlacement.nakshatra,
    moonNakshatraPada: moonPlacement.pada,
    sunSignSidereal: sunPosition.sign,
    planetPositions: {
      sun: sunPosition,
      moon: moonPosition,
      mars: createPlanetPosition(planetLongitudes.mars, lagnaLongitude),
      mercury: createPlanetPosition(planetLongitudes.mercury, lagnaLongitude),
      jupiter: createPlanetPosition(planetLongitudes.jupiter, lagnaLongitude),
      venus: createPlanetPosition(planetLongitudes.venus, lagnaLongitude),
      saturn: createPlanetPosition(planetLongitudes.saturn, lagnaLongitude),
      rahu: createPlanetPosition(planetLongitudes.rahu, lagnaLongitude),
      ketu: createPlanetPosition(planetLongitudes.ketu, lagnaLongitude)
    },
    houses,
    confidence: birthTimeMode === "time-unknown" ? "medium" : "high",
    dasha: calculateDasha(
      {
        birth,
        natalMoonLongitude: planetLongitudes.moon
      },
      asOf
    ),
    transit: calculateTransits({
      natalMoonLongitude: planetLongitudes.moon,
      currentMoonLongitude
      }),
    computedAt: asOf.toISOString()
    ,
    computedDate: getIsoDateInTimeZone(asOf, birth.timezone ?? "UTC")
  };
}
