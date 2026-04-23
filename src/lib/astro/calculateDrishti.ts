/**
 * calculateDrishti.ts
 * Section 6 — Graha Drishti (Sign-based Aspects, BPHS)
 *
 * All aspects are SIGN-BASED, not degree-based. A graha in sign X
 * aspects the entire sign Y — no orbs.
 *
 * All grahas:  7th sign from own sign (100%)
 * Mars:        4th (75%), 8th (75%)
 * Jupiter:     5th (100%), 9th (100%)
 * Saturn:      3rd (75%), 10th (75%)
 * Rahu:        5th, 9th (like Jupiter)
 * Ketu:        4th, 8th (like Mars)
 */

import type { PlanetKey } from "@/lib/types/astrology";

/** Count from source sign to target sign, inclusive (source=1). Returns 1-12. */
function signDistance(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

/**
 * Returns the aspect strength (0 = no aspect, 0.75 = partial, 1.0 = full)
 * of a graha at `grahaSign` (0-based) towards `targetSign` (0-based).
 */
export function aspectStrength(
  grahaSign: number,
  targetSign: number,
  graha: PlanetKey
): number {
  const dist = signDistance(grahaSign, targetSign);

  // Universal 7th aspect (all grahas)
  if (dist === 7) return 1.0;

  // Special aspects
  switch (graha) {
    case "mars":
    case "ketu":
      if (dist === 4 || dist === 8) return 0.75;
      break;
    case "jupiter":
    case "rahu":
      if (dist === 5 || dist === 9) return 1.0;
      break;
    case "saturn":
      if (dist === 3 || dist === 10) return 0.75;
      break;
    default:
      break;
  }

  return 0;
}

/**
 * Returns true if the graha aspects the target sign at any strength.
 */
export function aspectsSign(
  grahaSign: number,
  targetSign: number,
  graha: PlanetKey
): boolean {
  return aspectStrength(grahaSign, targetSign, graha) > 0;
}

/**
 * Returns all signs (0-based) aspected by a graha at `grahaSign`, with strengths.
 */
export function getAllAspects(
  grahaSign: number,
  graha: PlanetKey
): Array<{ signIndex: number; strength: number }> {
  const results: Array<{ signIndex: number; strength: number }> = [];
  for (let s = 0; s < 12; s++) {
    const str = aspectStrength(grahaSign, s, graha);
    if (str > 0) {
      results.push({ signIndex: s, strength: str });
    }
  }
  return results;
}

/**
 * Checks if any malefic (Mars, Saturn, Rahu, Ketu) aspects a target sign.
 * Returns the list of aspecting malefics with their sign and strength.
 */
export function getMaleficAspects(
  planetSignMap: Partial<Record<PlanetKey, number>>,
  targetSign: number
): Array<{ planet: PlanetKey; strength: number }> {
  const malefics: PlanetKey[] = ["mars", "saturn", "rahu", "ketu"];
  return malefics
    .filter((p) => planetSignMap[p] !== undefined)
    .map((p) => ({
      planet: p,
      strength: aspectStrength(planetSignMap[p]!, targetSign, p),
    }))
    .filter((x) => x.strength > 0);
}

/**
 * Checks if Jupiter aspects a target sign (benefic protection).
 */
export function jupiterAspects(
  jupiterSign: number,
  targetSign: number
): boolean {
  return aspectStrength(jupiterSign, targetSign, "jupiter") > 0;
}
