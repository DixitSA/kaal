/**
 * calculateIntensity.ts
 * Section 8 — Intensity Scoring
 *
 * Produces a numeric score with breakdown, maps to low / medium / high / critical.
 */

import type { PlanetKey } from "@/lib/types/astrology";
import type {
  IntensityBreakdown,
  IntensityLevel,
  IntensityResult,
} from "@/lib/types/engine";
import { getAngularDistance } from "@/lib/astro/calculateDignity";
import { getSignIndex } from "@/lib/astro/calculateNakshatra";

export type { IntensityBreakdown, IntensityLevel, IntensityResult };

// ── Base MD intensity (Section 8) ─────────────────────────────────────────
export const MD_BASE_INTENSITY: Record<PlanetKey, number> = {
  rahu:    8,
  saturn:  7,
  mars:    7,
  ketu:    6,
  sun:     5,
  moon:    4,
  jupiter: 4,
  mercury: 4,
  venus:   3,
};

// ── Antardasha modifier ───────────────────────────────────────────────────
export function getAntardashaModifier(adLord: PlanetKey): number {
  if (["rahu", "saturn", "mars", "ketu"].includes(adLord)) return 1.0;
  if (["jupiter", "venus"].includes(adLord)) return -0.5;
  return 0;
}

// ── Transit intensity modifiers ───────────────────────────────────────────

export interface TransitModifier {
  name: string;
  delta: number;
}

export interface TransitNatalContext {
  /** Natal Moon sidereal longitude */
  natalMoonLon: number;
  /** Natal Sun sidereal longitude */
  natalSunLon: number;
  /** Natal Ascendant sidereal longitude (undefined if time unknown) */
  natalLagnaLon?: number;
  /** Natal Mars sidereal longitude */
  natalMarsLon: number;
  /** Natal Jupiter sidereal longitude */
  natalJupiterLon: number;

  /** Current transit Saturn longitude */
  transitSaturnLon: number;
  /** Current transit Rahu longitude */
  transitRahuLon: number;
  /** Current transit Ketu longitude */
  transitKetuLon: number;
  /** Current transit Mars longitude */
  transitMarsLon: number;
  /** Current transit Jupiter longitude */
  transitJupiterLon: number;
  /** Current transit Moon longitude */
  transitMoonLon: number;
}

function sameSign(lon1: number, lon2: number): boolean {
  return getSignIndex(lon1) === getSignIndex(lon2);
}

export function computeTransitModifiers(ctx: TransitNatalContext): TransitModifier[] {
  const mods: TransitModifier[] = [];

  // Sade Sati core: Saturn within 12° of natal Moon
  const satMoonDist = getAngularDistance(ctx.transitSaturnLon, ctx.natalMoonLon);
  if (satMoonDist <= 12) {
    mods.push({ name: "Sade Sati (Saturn conjunct natal Moon)", delta: 2.5 });
  }

  // Saturn transiting natal Ascendant sign
  if (ctx.natalLagnaLon !== undefined && sameSign(ctx.transitSaturnLon, ctx.natalLagnaLon)) {
    mods.push({ name: "Saturn transiting Ascendant", delta: 1.5 });
  }

  // Saturn within 12° of natal Sun
  const satSunDist = getAngularDistance(ctx.transitSaturnLon, ctx.natalSunLon);
  if (satSunDist <= 12) {
    mods.push({ name: "Saturn conjunct natal Sun", delta: 1.5 });
  }

  // Rahu transiting natal Moon (same sign)
  if (sameSign(ctx.transitRahuLon, ctx.natalMoonLon)) {
    mods.push({ name: "Rahu transiting natal Moon", delta: 2.0 });
  }

  // Ketu transiting natal Moon (same sign)
  if (sameSign(ctx.transitKetuLon, ctx.natalMoonLon)) {
    mods.push({ name: "Ketu transiting natal Moon", delta: 2.0 });
  }

  // Rahu transiting natal Ascendant (same sign)
  if (ctx.natalLagnaLon !== undefined && sameSign(ctx.transitRahuLon, ctx.natalLagnaLon)) {
    mods.push({ name: "Rahu transiting natal Ascendant", delta: 1.5 });
  }

  // Ketu transiting natal Ascendant (same sign)
  if (ctx.natalLagnaLon !== undefined && sameSign(ctx.transitKetuLon, ctx.natalLagnaLon)) {
    mods.push({ name: "Ketu transiting natal Ascendant", delta: 1.5 });
  }

  // Mars return: transit Mars same sign as natal Mars
  if (sameSign(ctx.transitMarsLon, ctx.natalMarsLon)) {
    mods.push({ name: "Mars return (transit Mars = natal Mars sign)", delta: 1.0 });
  }

  // Jupiter transiting 1st, 5th, or 9th from natal Moon → benefic (negative delta)
  const moonSignIdx = getSignIndex(ctx.natalMoonLon);
  const jupTransitSignIdx = getSignIndex(ctx.transitJupiterLon);
  const jupFromMoon = ((jupTransitSignIdx - moonSignIdx + 12) % 12) + 1; // 1-12
  if (jupFromMoon === 1 || jupFromMoon === 5 || jupFromMoon === 9) {
    mods.push({ name: `Jupiter in ${jupFromMoon}th from natal Moon (benefic)`, delta: -1.5 });
  }

  // Jupiter return: transit Jupiter same sign as natal Jupiter
  if (sameSign(ctx.transitJupiterLon, ctx.natalJupiterLon)) {
    mods.push({ name: "Jupiter return", delta: -1.0 });
  }

  return mods;
}

// ── Intensity threshold → level ───────────────────────────────────────────

export function scoreToIntensityLevel(score: number): IntensityLevel {
  if (score >= 9.0) return "critical";
  if (score >= 7.0) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

export function computeIntensity(
  mdLord: PlanetKey,
  adLord: PlanetKey,
  transitCtx: TransitNatalContext
): IntensityResult {
  const base_md = MD_BASE_INTENSITY[mdLord];
  const ad_modifier = getAntardashaModifier(adLord);
  const transits = computeTransitModifiers(transitCtx);
  const transitTotal = transits.reduce((sum, t) => sum + t.delta, 0);

  const rawScore = base_md + ad_modifier + transitTotal;
  const score = Math.round(rawScore * 10) / 10; // 1 decimal
  const level = scoreToIntensityLevel(score);

  return { score, level, breakdown: { base_md, ad_modifier, transits } };
}
