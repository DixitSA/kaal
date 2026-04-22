import { NAKSHATRA_NAMES } from "@/lib/astro/constants";
import { ARCHETYPE_PHRASES } from "@/lib/content/archetypePhrases";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type {
  ChallengeTone,
  DecisionStyle,
  EmotionalStyle,
  IdentityArchetypeKey,
  IdentityProfile,
  IdentityState,
  PatternTone
} from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import { roundTo } from "@/lib/utils/math";

const EARTH_SIGNS = new Set(["Taurus", "Virgo", "Capricorn"]);
const WATER_SIGNS = new Set(["Cancer", "Scorpio", "Pisces"]);
const AIR_SIGNS = new Set(["Gemini", "Libra", "Aquarius"]);
const FIXED_SIGNS = new Set(["Taurus", "Leo", "Scorpio", "Aquarius"]);
const MUTABLE_SIGNS = new Set(["Gemini", "Virgo", "Sagittarius", "Pisces"]);

/**
 * Gana-based archetype mapping — astrologically grounded.
 * Each nakshatra belongs to one of three Ganas (temperaments):
 *   Rakshasa (fierce/transformative) → Catalyst
 *   Manushya (human/sustaining)      → Steward
 *   Deva     (idealistic/expansive)  → Seeker
 */
const NAKSHATRA_GANA: Record<string, IdentityArchetypeKey> = {
  // Rakshasa → Catalyst
  "Krittika":          "catalyst",
  "Ashlesha":          "catalyst",
  "Magha":             "catalyst",
  "Chitra":            "catalyst",
  "Vishakha":          "catalyst",
  "Jyeshtha":          "catalyst",
  "Mula":              "catalyst",
  "Dhanishta":         "catalyst",
  "Shatabhisha":       "catalyst",
  // Manushya → Steward
  "Bharani":           "steward",
  "Rohini":            "steward",
  "Ardra":             "steward",
  "Purva Phalguni":    "steward",
  "Uttara Phalguni":   "steward",
  "Purva Ashadha":     "steward",
  "Uttara Ashadha":    "steward",
  "Purva Bhadrapada":  "steward",
  "Uttara Bhadrapada": "steward",
  // Deva → Seeker
  "Ashwini":           "seeker",
  "Mrigashira":        "seeker",
  "Punarvasu":         "seeker",
  "Pushya":            "seeker",
  "Hasta":             "seeker",
  "Swati":             "seeker",
  "Anuradha":          "seeker",
  "Shravana":          "seeker",
  "Revati":            "seeker",
};

function getArchetypeKey(moonNakshatra: string): IdentityArchetypeKey {
  const normalized = moonNakshatra.trim();
  // Try exact match first, then case-insensitive
  const exact = NAKSHATRA_GANA[normalized];
  if (exact) return exact;
  const lower = normalized.toLowerCase();
  const caseInsensitive = Object.entries(NAKSHATRA_GANA).find(
    ([k]) => k.toLowerCase() === lower
  );
  if (caseInsensitive) return caseInsensitive[1];
  // Unknown nakshatra — char-code hash so unknowns spread across all three
  const archetypeOrder: IdentityArchetypeKey[] = ["catalyst", "steward", "seeker"];
  const fallbackIndex = lower.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 3;
  return archetypeOrder[fallbackIndex];
}

function getEmotionalStyle(moonSign: string): EmotionalStyle {
  if (WATER_SIGNS.has(moonSign)) {
    return "internalizing";
  }

  if (AIR_SIGNS.has(moonSign) || new Set(["Aries", "Leo", "Sagittarius"]).has(moonSign)) {
    return "expressive";
  }

  return "steady";
}

function getDecisionStyle(sign?: string): DecisionStyle {
  if (!sign) {
    return "adaptive";
  }

  if (FIXED_SIGNS.has(sign)) {
    return "deliberate";
  }

  if (MUTABLE_SIGNS.has(sign)) {
    return "adaptive";
  }

  return "decisive";
}

function getPatternTone(sign: string): PatternTone {
  if (FIXED_SIGNS.has(sign)) {
    return "steady";
  }

  if (MUTABLE_SIGNS.has(sign)) {
    return "restless";
  }

  return "intense";
}

function getChallengeTone(sign: string): ChallengeTone {
  if (EARTH_SIGNS.has(sign) || WATER_SIGNS.has(sign)) {
    return "overholding";
  }

  if (AIR_SIGNS.has(sign)) {
    return "scattered";
  }

  return "overreactive";
}

function getIdentityConfidence(chart: ChartPrimitives): number {
  const base = chart.confidence === "high" ? 0.9 : 0.7;
  return roundTo(chart.lagnaSign ? base : base - 0.08, 2);
}

function buildIdentitySeed(chart: ChartPrimitives, seed?: string): string {
  return seed ?? `${chart.moonNakshatra}:${chart.moonSign}`;
}

export function deriveIdentityState(chart: ChartPrimitives): IdentityState {
  const lagnaAwareSign = chart.lagnaSign ?? chart.moonSign;

  return {
    archetypeKey: getArchetypeKey(chart.moonNakshatra),
    emotionalStyle: getEmotionalStyle(chart.moonSign),
    decisionStyle: getDecisionStyle(lagnaAwareSign),
    patternTone: getPatternTone(chart.moonSign),
    challengeTone: getChallengeTone(chart.moonSign),
    confidence: getIdentityConfidence(chart)
  };
}

export function renderIdentityProfile(
  state: IdentityState,
  chart: ChartPrimitives,
  seed?: string
): IdentityProfile {
  const phraseSet = ARCHETYPE_PHRASES[state.archetypeKey];
  const stableSeed = buildIdentitySeed(chart, seed);
  const core = deterministicPick(phraseSet.core, `${stableSeed}:core`);
  const emotionalLine = deterministicPick(
    phraseSet.emotionalByStyle[state.emotionalStyle],
    `${stableSeed}:emotional`
  );
  const decisionLine = deterministicPick(
    phraseSet.decisionByStyle[state.decisionStyle],
    `${stableSeed}:decision:${chart.lagnaSign ?? "moon-led"}`
  );
  const patternLine = deterministicPick(
    phraseSet.patternByTone[state.patternTone],
    `${stableSeed}:pattern`
  );
  const challengeLine = deterministicPick(
    phraseSet.challengeByTone[state.challengeTone],
    `${stableSeed}:challenge`
  );

  return {
    archetype: phraseSet.label,
    summary: core,
    strengths: [emotionalLine, decisionLine],
    watchouts: [patternLine, challengeLine],
    confidence: state.confidence,
    core,
    emotionalLine,
    decisionLine,
    patternLine,
    challengeLine
  };
}

export function generateIdentityProfile(
  chart: ChartPrimitives,
  seed?: string
): IdentityProfile {
  return renderIdentityProfile(deriveIdentityState(chart), chart, seed);
}
