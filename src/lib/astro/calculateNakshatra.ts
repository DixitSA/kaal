import {
  DEGREES_IN_CIRCLE,
  DEGREES_PER_NAKSHATRA,
  DEGREES_PER_PADA,
  DEGREES_PER_SIGN,
  HOUSES_COUNT,
  NAKSHATRA_NAMES,
  RASHI_NAMES
} from "@/lib/astro/constants";
import type { HousePosition, PlanetPosition } from "@/lib/types/astrology";
import { roundTo } from "@/lib/utils/math";

export interface NakshatraPlacement {
  nakshatraIndex: number;
  nakshatra: string;
  pada: number;
  signIndex: number;
  sign: string;
  degreeInSign: number;
}

export function normalizeLongitude(longitude: number): number {
  return ((longitude % DEGREES_IN_CIRCLE) + DEGREES_IN_CIRCLE) % DEGREES_IN_CIRCLE;
}

export function getSignIndex(longitude: number): number {
  return Math.floor(normalizeLongitude(longitude) / DEGREES_PER_SIGN);
}

export function getSignName(longitude: number): string {
  return RASHI_NAMES[getSignIndex(longitude)];
}

export function getDegreeInSign(longitude: number): number {
  return roundTo(normalizeLongitude(longitude) % DEGREES_PER_SIGN, 6);
}

export function calculateNakshatra(longitude: number): NakshatraPlacement {
  const normalized = normalizeLongitude(longitude);
  const nakshatraIndex = Math.floor(normalized / DEGREES_PER_NAKSHATRA);

  return {
    nakshatraIndex,
    nakshatra: NAKSHATRA_NAMES[nakshatraIndex],
    pada: Math.floor((normalized % DEGREES_PER_NAKSHATRA) / DEGREES_PER_PADA) + 1,
    signIndex: getSignIndex(normalized),
    sign: getSignName(normalized),
    degreeInSign: getDegreeInSign(normalized)
  };
}

export function deriveHouse(planetLongitude: number, lagnaLongitude?: number): number | undefined {
  if (lagnaLongitude === undefined) {
    return undefined;
  }

  const houseOffset =
    Math.floor(
      (normalizeLongitude(planetLongitude) - normalizeLongitude(lagnaLongitude) + DEGREES_IN_CIRCLE) /
        DEGREES_PER_SIGN
    ) % HOUSES_COUNT;

  return houseOffset + 1;
}

export function createPlanetPosition(
  absoluteLongitude: number,
  lagnaLongitude?: number
): PlanetPosition {
  return {
    sign: getSignName(absoluteLongitude),
    degree: getDegreeInSign(absoluteLongitude),
    absoluteLongitude: roundTo(normalizeLongitude(absoluteLongitude), 6),
    house: deriveHouse(absoluteLongitude, lagnaLongitude)
  };
}

export function buildEqualHousePositions(lagnaLongitude: number): HousePosition[] {
  return Array.from({ length: HOUSES_COUNT }, (_, index) => {
    const cuspLongitude = normalizeLongitude(lagnaLongitude + index * DEGREES_PER_SIGN);

    return {
      house: index + 1,
      sign: getSignName(cuspLongitude),
      startDegree: getDegreeInSign(cuspLongitude)
    };
  });
}
