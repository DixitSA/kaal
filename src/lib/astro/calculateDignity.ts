/**
 * calculateDignity.ts
 * Section 5 — Graha Dignity (BPHS / Saravali)
 * Section 2 — Combustion (Moudyami)
 */

import { normalizeLongitude } from "@/lib/astro/calculateNakshatra";
import type { PlanetKey } from "@/lib/types/astrology";

// ── Sign Lords (Rashiswami) ───────────────────────────────────────────────
// Signs 0-11 = Aries … Pisces

export const SIGN_LORDS: Record<number, PlanetKey> = {
  0: "mars",    // Aries
  1: "venus",   // Taurus
  2: "mercury", // Gemini
  3: "moon",    // Cancer
  4: "sun",     // Leo
  5: "mercury", // Virgo
  6: "venus",   // Libra
  7: "mars",    // Scorpio
  8: "jupiter", // Sagittarius
  9: "saturn",  // Capricorn
  10: "saturn", // Aquarius
  11: "jupiter" // Pisces
};

export function getSignLord(signIndex: number): PlanetKey {
  return SIGN_LORDS[((signIndex % 12) + 12) % 12];
}

/** Which planet rules a given house (1-12) from a given Ascendant sign (0-11). */
export function getHouseLord(houseNumber: number, lagnaSignIndex: number): PlanetKey {
  const signIndex = (lagnaSignIndex + houseNumber - 1) % 12;
  return getSignLord(signIndex);
}

/** House number (1-12) of a planet given planet-sign-index and lagna-sign-index. */
export function getHouseFromLagna(planetSignIndex: number, lagnaSignIndex: number): number {
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}

// ── Exaltation (Uccha) — sign index + exact degree ───────────────────────
interface DignityPoint { signIndex: number; degree: number }

export const EXALTATION: Record<PlanetKey, DignityPoint> = {
  sun:     { signIndex: 0,  degree: 10 }, // Aries 10°
  moon:    { signIndex: 1,  degree: 3  }, // Taurus 3°
  mars:    { signIndex: 9,  degree: 28 }, // Capricorn 28°
  mercury: { signIndex: 5,  degree: 15 }, // Virgo 15°
  jupiter: { signIndex: 3,  degree: 5  }, // Cancer 5°
  venus:   { signIndex: 11, degree: 27 }, // Pisces 27°
  saturn:  { signIndex: 6,  degree: 20 }, // Libra 20°
  rahu:    { signIndex: 1,  degree: 20 }, // Taurus 20°
  ketu:    { signIndex: 7,  degree: 20 }, // Scorpio 20°
};

// ── Debilitation (Neecha) — exactly 180° from exaltation ─────────────────
export const DEBILITATION: Record<PlanetKey, DignityPoint> = {
  sun:     { signIndex: 6,  degree: 10 }, // Libra 10°
  moon:    { signIndex: 7,  degree: 3  }, // Scorpio 3°
  mars:    { signIndex: 3,  degree: 28 }, // Cancer 28°
  mercury: { signIndex: 11, degree: 15 }, // Pisces 15°
  jupiter: { signIndex: 9,  degree: 5  }, // Capricorn 5°
  venus:   { signIndex: 5,  degree: 27 }, // Virgo 27°
  saturn:  { signIndex: 0,  degree: 20 }, // Aries 20°
  rahu:    { signIndex: 7,  degree: 20 }, // Scorpio
  ketu:    { signIndex: 1,  degree: 20 }, // Taurus
};

// ── Own Signs (Swakshetra) ────────────────────────────────────────────────
const OWN_SIGNS: Record<PlanetKey, number[]> = {
  sun:     [4],       // Leo
  moon:    [3],       // Cancer
  mars:    [0, 7],    // Aries, Scorpio
  mercury: [2, 5],    // Gemini, Virgo
  jupiter: [8, 11],   // Sagittarius, Pisces
  venus:   [1, 6],    // Taurus, Libra
  saturn:  [9, 10],   // Capricorn, Aquarius
  rahu:    [],
  ketu:    [],
};

// ── Moolatrikona Zones ────────────────────────────────────────────────────
interface MoolatrikonaZone { signIndex: number; startDeg: number; endDeg: number }

const MOOLATRIKONA: Partial<Record<PlanetKey, MoolatrikonaZone>> = {
  sun:     { signIndex: 4,  startDeg: 0,  endDeg: 20 }, // Leo 0-20
  moon:    { signIndex: 1,  startDeg: 4,  endDeg: 20 }, // Taurus 4-20
  mars:    { signIndex: 0,  startDeg: 0,  endDeg: 12 }, // Aries 0-12
  mercury: { signIndex: 5,  startDeg: 16, endDeg: 20 }, // Virgo 16-20
  jupiter: { signIndex: 8,  startDeg: 0,  endDeg: 10 }, // Sagittarius 0-10
  venus:   { signIndex: 6,  startDeg: 0,  endDeg: 15 }, // Libra 0-15
  saturn:  { signIndex: 10, startDeg: 0,  endDeg: 20 }, // Aquarius 0-20
};

// ── Naisargika Maitri (Natural Friendship) ────────────────────────────────
// +1 = friend, 0 = neutral, -1 = enemy
const NATURAL_RELATIONS: Record<PlanetKey, Record<PlanetKey, number>> = {
  sun: {
    sun: 0, moon: 1, mars: 1, mercury: 0, jupiter: 1,
    venus: -1, saturn: -1, rahu: -1, ketu: -1
  },
  moon: {
    sun: 1, moon: 0, mars: 0, mercury: 1, jupiter: 0,
    venus: 0, saturn: 0, rahu: -1, ketu: -1
  },
  mars: {
    sun: 1, moon: 1, mars: 0, mercury: -1, jupiter: 1,
    venus: 0, saturn: 0, rahu: -1, ketu: -1
  },
  mercury: {
    sun: 1, moon: -1, mars: 0, mercury: 0, jupiter: 0,
    venus: 1, saturn: 0, rahu: 0, ketu: 0
  },
  jupiter: {
    sun: 1, moon: 1, mars: 1, mercury: -1, jupiter: 0,
    venus: -1, saturn: 0, rahu: -1, ketu: -1
  },
  venus: {
    sun: -1, moon: -1, mars: 0, mercury: 1, jupiter: 0,
    venus: 0, saturn: 1, rahu: 1, ketu: 0
  },
  saturn: {
    sun: -1, moon: -1, mars: -1, mercury: 1, jupiter: 0,
    venus: 1, saturn: 0, rahu: 1, ketu: 0
  },
  rahu: {
    sun: -1, moon: -1, mars: 0, mercury: 1, jupiter: -1,
    venus: 1, saturn: 1, rahu: 0, ketu: 0
  },
  ketu: {
    sun: -1, moon: -1, mars: 1, mercury: 0, jupiter: 1,
    venus: 0, saturn: 0, rahu: 0, ketu: 0
  },
};

// ── Combustion Orbs ───────────────────────────────────────────────────────
const COMBUSTION_ORB: Record<string, number> = {
  moon:            12,
  mars_direct:     17, mars_retro:     17,
  mercury_direct:  14, mercury_retro:  12,
  jupiter_direct:  11, jupiter_retro:  11,
  venus_direct:    10, venus_retro:     8,
  saturn_direct:   15, saturn_retro:   15,
};

export function getAngularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(normalizeLongitude(lon1) - normalizeLongitude(lon2));
  return diff > 180 ? 360 - diff : diff;
}

export function isCombust(
  planet: PlanetKey,
  planetLon: number,
  sunLon: number,
  isRetrograde: boolean
): boolean {
  // Sun, Moon, Rahu, Ketu cannot be combust
  if (planet === "sun" || planet === "moon" || planet === "rahu" || planet === "ketu") {
    return false;
  }
  const dist = getAngularDistance(planetLon, sunLon);
  const suffix = isRetrograde ? "retro" : "direct";
  const orb = COMBUSTION_ORB[`${planet}_${suffix}`] ?? COMBUSTION_ORB[planet] ?? 15;
  return dist <= orb;
}

// ── Dignity Placement ─────────────────────────────────────────────────────
export type DignityPlacement =
  | "moolatrikona"
  | "exalted"
  | "own"
  | "friend"
  | "neutral"
  | "enemy"
  | "debilitated";

export function getDignityPlacement(
  planet: PlanetKey,
  signIndex: number,
  degreeInSign: number
): DignityPlacement {
  // Check moolatrikona first (overrides own-sign within that zone)
  const mt = MOOLATRIKONA[planet];
  if (
    mt &&
    signIndex === mt.signIndex &&
    degreeInSign >= mt.startDeg &&
    degreeInSign <= mt.endDeg
  ) {
    return "moolatrikona";
  }

  // Own sign (includes moolatrikona sign outside the MT zone)
  if (OWN_SIGNS[planet]?.includes(signIndex)) {
    return "own";
  }

  // Exaltation sign
  const exalt = EXALTATION[planet];
  if (exalt && signIndex === exalt.signIndex) {
    return "exalted";
  }

  // Debilitation sign
  const debit = DEBILITATION[planet];
  if (debit && signIndex === debit.signIndex) {
    return "debilitated";
  }

  // Natural relationship with sign lord
  const signLord = getSignLord(signIndex);
  if (signLord === planet) return "own"; // safety net
  const relation = NATURAL_RELATIONS[planet]?.[signLord] ?? 0;
  if (relation > 0) return "friend";
  if (relation < 0) return "enemy";
  return "neutral";
}

// ── Neecha Bhanga ─────────────────────────────────────────────────────────
export interface NeechaBhangaResult {
  active: boolean;
  reason?: string;
}

export interface PlanetBasicPos {
  signIndex: number;
  house?: number;
}

export function checkNeechaBhanga(
  planet: PlanetKey,
  planetSignIndex: number,
  isRetrograde: boolean,
  allPositions: Partial<Record<PlanetKey, PlanetBasicPos>>,
  moonSignIndex?: number
): NeechaBhangaResult {
  const debit = DEBILITATION[planet];
  if (!debit || planetSignIndex !== debit.signIndex) {
    return { active: false };
  }

  const KENDRAS = new Set([1, 4, 7, 10]);

  // Rule 1: Lord of the debilitation sign is in a kendra from Asc OR from Moon
  const debSignLord = getSignLord(debit.signIndex);
  const lordPos = allPositions[debSignLord];
  if (lordPos?.house && KENDRAS.has(lordPos.house)) {
    return { active: true, reason: "sign lord in kendra from Ascendant" };
  }
  if (moonSignIndex !== undefined && lordPos) {
    const lordSignFromMoon = ((lordPos.signIndex - moonSignIndex + 12) % 12) + 1;
    if (KENDRAS.has(lordSignFromMoon)) {
      return { active: true, reason: "sign lord in kendra from Moon" };
    }
  }

  // Rule 2: The planet exalted in that sign is in a kendra
  const exaltedInDebilSign = (Object.entries(EXALTATION) as [PlanetKey, DignityPoint][]).find(
    ([, e]) => e.signIndex === debit.signIndex
  );
  if (exaltedInDebilSign) {
    const exaltGraha = exaltedInDebilSign[0];
    const exaltPos = allPositions[exaltGraha];
    if (exaltPos?.house && KENDRAS.has(exaltPos.house)) {
      return { active: true, reason: "exalted planet in kendra" };
    }
  }

  // Rule 3: Debilitated planet is retrograde
  if (isRetrograde) {
    return { active: true, reason: "debilitated planet is retrograde" };
  }

  // Rule 4: Debilitated planet is aspected by its dispositor (7th-sign aspect)
  const dispositor = getSignLord(debit.signIndex);
  const dispositorPos = allPositions[dispositor];
  if (dispositorPos) {
    const signDiff = ((planetSignIndex - dispositorPos.signIndex + 12) % 12) + 1;
    if (signDiff === 7) {
      return { active: true, reason: "aspected by dispositor (7th sign)" };
    }
  }

  return { active: false };
}

// ── Dignity Score (composite) ─────────────────────────────────────────────
export interface DignityResult {
  placement: DignityPlacement;
  score: number;          // composite score; negative = weak
  neechaBhanga: boolean;
  neechaBhangaReason?: string;
}

export function computeDignityScore(
  planet: PlanetKey,
  signIndex: number,
  degreeInSign: number,
  isRetrograde: boolean,
  isCombusted: boolean,
  neechaBhanga: NeechaBhangaResult
): DignityResult {
  const placement = getDignityPlacement(planet, signIndex, degreeInSign);

  let score: number;
  if (neechaBhanga.active && placement === "debilitated") {
    score = 2; // Neecha Bhanga Raja Yoga: +2 instead of -2
  } else {
    switch (placement) {
      case "moolatrikona": score = 3; break;
      case "exalted":      score = 3; break;
      case "own":          score = 2; break;
      case "friend":       score = 1; break;
      case "neutral":      score = 0; break;
      case "enemy":        score = -1; break;
      case "debilitated":  score = -2; break;
      default:             score = 0;
    }
  }

  // Retrograde modifier: +1 if in own/exalt/moolatrikona/friend sign
  if (isRetrograde && planet !== "rahu" && planet !== "ketu" && planet !== "sun" && planet !== "moon") {
    if (
      placement === "moolatrikona" ||
      placement === "exalted" ||
      placement === "own" ||
      placement === "friend"
    ) {
      score += 1;
    }
  }

  // Combust: -2 (additive)
  if (isCombusted) {
    score -= 2;
  }

  return {
    placement,
    score,
    neechaBhanga: neechaBhanga.active,
    neechaBhangaReason: neechaBhanga.reason,
  };
}
