/**
 * identityEngine.ts — Section 9 rewrite
 * Generates identity profiles from the 27-nakshatra table (with pada overlay).
 * Falls back to archetype-phrase system when nakshatra is unrecognised.
 */

import { NAKSHATRA_NAMES } from "@/lib/astro/constants";
import { ARCHETYPE_PHRASES } from "@/lib/content/archetypePhrases";
import {
  getNakshatraProfile,
  NAKSHATRA_PROFILES,
} from "@/lib/content/nakshatraProfiles";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type {
  IdentityArchetypeKey,
  IdentityProfile,
  IdentityState,
  ChallengeTone,
  DecisionStyle,
  EmotionalStyle,
  PatternTone,
} from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import { roundTo } from "@/lib/utils/math";

// ── Nakshatra number from name ────────────────────────────────────────────

function getNakshatraNumber(nakshatraName: string): number | null {
  const idx = (NAKSHATRA_NAMES as readonly string[]).indexOf(nakshatraName);
  if (idx === -1) return null;
  return idx + 1; // 1-based
}

// ── Archetype key from nakshatra profile ──────────────────────────────────

function archetypeKeyFromProfileName(name: string): IdentityArchetypeKey {
  // Map the Section-9 archetype names to the 3 IdentityArchetypeKeys used in
  // ARCHETYPE_PHRASES (for the fallback phrases that need them).
  const CATALYST_ARCHETYPES = new Set([
    "pioneer","cutter","dissolver","excavator","catalyst","force","champion",
    "conductor","achiever","elder","architect","gatekeeper","heir"
  ]);
  const STEWARD_ARCHETYPES = new Set([
    "cultivator","nourisher","patron","builder","maker","listener",
    "steward","healer","guide","returner","lover"
  ]);
  if (CATALYST_ARCHETYPES.has(name)) return "catalyst";
  if (STEWARD_ARCHETYPES.has(name))  return "steward";
  return "seeker";
}

// ── Supplemental style derivations (still used for IdentityState) ─────────

const WATER_SIGNS = new Set(["Cancer", "Scorpio", "Pisces"]);
const AIR_SIGNS   = new Set(["Gemini", "Libra", "Aquarius"]);
const FIRE_SIGNS  = new Set(["Aries", "Leo", "Sagittarius"]);
const FIXED_SIGNS = new Set(["Taurus", "Leo", "Scorpio", "Aquarius"]);
const MUTABLE_SIGNS = new Set(["Gemini", "Virgo", "Sagittarius", "Pisces"]);
const EARTH_SIGNS = new Set(["Taurus", "Virgo", "Capricorn"]);

function getEmotionalStyle(moonSign: string): EmotionalStyle {
  if (WATER_SIGNS.has(moonSign)) return "internalizing";
  if (AIR_SIGNS.has(moonSign) || FIRE_SIGNS.has(moonSign)) return "expressive";
  return "steady";
}

function getDecisionStyle(sign?: string): DecisionStyle {
  if (!sign) return "adaptive";
  if (FIXED_SIGNS.has(sign))   return "deliberate";
  if (MUTABLE_SIGNS.has(sign)) return "adaptive";
  return "decisive";
}

function getPatternTone(sign: string): PatternTone {
  if (FIXED_SIGNS.has(sign))   return "steady";
  if (MUTABLE_SIGNS.has(sign)) return "restless";
  return "intense";
}

function getChallengeTone(sign: string): ChallengeTone {
  if (EARTH_SIGNS.has(sign) || WATER_SIGNS.has(sign)) return "overholding";
  if (AIR_SIGNS.has(sign)) return "scattered";
  return "overreactive";
}

function getIdentityConfidence(chart: ChartPrimitives): number {
  const base = chart.confidence === "high" ? 0.9 : 0.7;
  return roundTo(chart.lagnaSign ? base : base - 0.08, 2);
}

function buildIdentitySeed(chart: ChartPrimitives, seed?: string): string {
  return seed ?? `${chart.moonNakshatra}:${chart.moonSign}`;
}

// ── Public API ────────────────────────────────────────────────────────────

export function deriveIdentityState(chart: ChartPrimitives): IdentityState {
  const lagnaAwareSign = chart.lagnaSign ?? chart.moonSign;
  const nakNum = getNakshatraNumber(chart.moonNakshatra);
  const profile = nakNum ? NAKSHATRA_PROFILES[nakNum - 1] : null;

  const archetypeKey: IdentityArchetypeKey = profile
    ? archetypeKeyFromProfileName(profile.archetype)
    : "steward";

  return {
    archetypeKey,
    emotionalStyle: getEmotionalStyle(chart.moonSign),
    decisionStyle:  getDecisionStyle(lagnaAwareSign),
    patternTone:    getPatternTone(chart.moonSign),
    challengeTone:  getChallengeTone(chart.moonSign),
    confidence:     getIdentityConfidence(chart),
  };
}

export function renderIdentityProfile(
  state: IdentityState,
  chart: ChartPrimitives,
  seed?: string
): IdentityProfile {
  const nakNum = getNakshatraNumber(chart.moonNakshatra);
  const pada   = chart.moonNakshatraPada ?? 1;

  // ── Section-9 path: nakshatra profile available ──────────────────────────
  if (nakNum !== null) {
    const full = getNakshatraProfile(nakNum, pada);

    return {
      archetype:     full.archetype,
      summary:       full.headline,
      strengths:     [full.traits[0], full.traits[1]],
      watchouts:     [full.shadow],
      confidence:    state.confidence,
      core:          full.headline,
      emotionalLine: full.traits[0],
      decisionLine:  full.traits[1],
      patternLine:   full.trait3Modified, // pada-modified
      challengeLine: full.shadow,
    };
  }

  // ── Fallback: use archetype phrase banks ─────────────────────────────────
  const phraseSet  = ARCHETYPE_PHRASES[state.archetypeKey];
  const stableSeed = buildIdentitySeed(chart, seed);
  const core          = deterministicPick(phraseSet.core, `${stableSeed}:core`);
  const emotionalLine = deterministicPick(
    phraseSet.emotionalByStyle[state.emotionalStyle], `${stableSeed}:emotional`
  );
  const decisionLine = deterministicPick(
    phraseSet.decisionByStyle[state.decisionStyle],
    `${stableSeed}:decision:${chart.lagnaSign ?? "moon-led"}`
  );
  const patternLine   = deterministicPick(
    phraseSet.patternByTone[state.patternTone],  `${stableSeed}:pattern`
  );
  const challengeLine = deterministicPick(
    phraseSet.challengeByTone[state.challengeTone], `${stableSeed}:challenge`
  );

  return {
    archetype:     phraseSet.label,
    summary:       core,
    strengths:     [emotionalLine, decisionLine],
    watchouts:     [patternLine, challengeLine],
    confidence:    state.confidence,
    core,
    emotionalLine,
    decisionLine,
    patternLine,
    challengeLine,
  };
}

export function generateIdentityProfile(
  chart: ChartPrimitives,
  seed?: string
): IdentityProfile {
  return renderIdentityProfile(deriveIdentityState(chart), chart, seed);
}
