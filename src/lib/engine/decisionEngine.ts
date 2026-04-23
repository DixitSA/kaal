/**
 * decisionEngine.ts — Section 7 rewrite
 * Decision evaluation uses house-lord dignity (when Ascendant is known)
 * with a signal-based fallback for time-unknown charts.
 * All six categories follow the spec's ACT / WAIT / AVOID rules.
 */

import { DECISION_PHRASES } from "@/lib/content/decisionPhrases";
import {
  buildStableSeed,
  normalizeDaySeed,
  scoreDecision,
} from "@/lib/engine/scoring";
import { getHouseLord, getSignLord } from "@/lib/astro/calculateDignity";
import { aspectsSign, getMaleficAspects } from "@/lib/astro/calculateDrishti";
import type { ChartPrimitives, PlanetKey } from "@/lib/types/astrology";
import type {
  DecisionCategory,
  DecisionDriverKey,
  DecisionEvaluation,
  DecisionOutcome,
  DecisionState,
} from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import { getSignIndex } from "@/lib/astro/calculateNakshatra";
import { NAKSHATRA_NAMES } from "@/lib/astro/constants";

// ── Helpers ───────────────────────────────────────────────────────────────

const DUSTHANAS = new Set([6, 8, 12]);
const KENDRAS   = new Set([1, 4, 7, 10]);
const TRIKONAS  = new Set([1, 5, 9]);

function dignity(chart: ChartPrimitives, planet: PlanetKey): number {
  return chart.planetPositions[planet]?.dignityScore ?? 0;
}

function combust(chart: ChartPrimitives, planet: PlanetKey): boolean {
  return chart.planetPositions[planet]?.isCombust ?? false;
}

function retrograde(chart: ChartPrimitives, planet: PlanetKey): boolean {
  return chart.planetPositions[planet]?.isRetrograde ?? false;
}

function planetHouse(chart: ChartPrimitives, planet: PlanetKey): number | undefined {
  return chart.planetPositions[planet]?.house;
}

function planetSign(chart: ChartPrimitives, planet: PlanetKey): number {
  return getSignIndex(chart.planetPositions[planet]?.absoluteLongitude ?? 0);
}

function isDebilitated(chart: ChartPrimitives, planet: PlanetKey): boolean {
  return chart.planetPositions[planet]?.dignityPlacement === "debilitated" &&
         !(chart.planetPositions[planet]?.neechaBhanga ?? false);
}

function inDusthana(chart: ChartPrimitives, planet: PlanetKey): boolean {
  const h = planetHouse(chart, planet);
  return h !== undefined && DUSTHANAS.has(h);
}

function inKendraTrikona(chart: ChartPrimitives, planet: PlanetKey): boolean {
  const h = planetHouse(chart, planet);
  return h !== undefined && (KENDRAS.has(h) || TRIKONAS.has(h));
}

// ── ACT/WAIT/AVOID per category (Section 7) ──────────────────────────────
// Each eval returns outcome + the two drivers that most explain the result.
// primaryDriver  → rationale[0] in the output
// secondaryDriver → rationale[1] in the output

interface EvalResult {
  outcome: DecisionOutcome;
  primaryDriver: DecisionDriverKey;
  secondaryDriver: DecisionDriverKey;
}

function evalCareer(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord10 = getHouseLord(10, lagnaSignIdx);
  const mdLord = chart.dasha.mahadashaLord;

  const d10    = dignity(chart, lord10);
  const dMd    = dignity(chart, mdLord);
  const md10Combust = combust(chart, lord10);
  const mdInDust    = inDusthana(chart, mdLord);

  // AVOID: 10th lord debilitated + combust  OR  MD lord in dusthana + debilitated
  if ((isDebilitated(chart, lord10) && md10Combust) ||
      (mdInDust && isDebilitated(chart, mdLord))) {
    return { outcome: "caution", primaryDriver: "pressure", secondaryDriver: "timing" };
  }

  // WAIT: 10th lord combust OR debilitated  OR  MD lord in dusthana  OR  retrograde+afflicted
  if (md10Combust || isDebilitated(chart, lord10) || mdInDust ||
      (retrograde(chart, lord10) && d10 < 0)) {
    return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "discipline" };
  }

  // ACT: 10th lord dignity >= +1, MD lord dignity >= 0 and in kendra/trikona
  if (d10 >= 1 && dMd >= 0 && inKendraTrikona(chart, mdLord)) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "timing" };
  }

  if (d10 >= 0 && dMd >= 0) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "support" };
  }
  return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "timing" };
}

function evalRelationships(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord7 = getHouseLord(7, lagnaSignIdx);
  const houseSign7Idx = (lagnaSignIdx + 6) % 12;

  const dVenus  = dignity(chart, "venus");
  const d7      = dignity(chart, lord7);
  const venusCombust = combust(chart, "venus");
  const rahuSign = planetSign(chart, "rahu");
  const maleficsIn7 = getMaleficAspects(
    {
      mars: planetSign(chart, "mars"),
      saturn: planetSign(chart, "saturn"),
      rahu: rahuSign,
      ketu: planetSign(chart, "ketu"),
    },
    houseSign7Idx
  ).filter(m => m.strength >= 1.0); // only full conjunctions

  // AVOID: Venus debilitated without NB  OR  Rahu in 7th  OR  7th lord debil+combust
  if ((isDebilitated(chart, "venus") && !chart.planetPositions.venus?.neechaBhanga) ||
      rahuSign === houseSign7Idx ||
      (isDebilitated(chart, lord7) && combust(chart, lord7))) {
    return { outcome: "caution", primaryDriver: "pressure", secondaryDriver: "attunement" };
  }

  // WAIT: Venus combust  OR  Venus/7th lord in dusthana  OR  Mars aspecting 7th
  const marsAspects7 = aspectsSign(planetSign(chart, "mars"), houseSign7Idx, "mars");
  if (venusCombust || inDusthana(chart, "venus") || inDusthana(chart, lord7) || marsAspects7) {
    return { outcome: "neutral", primaryDriver: "attunement", secondaryDriver: "timing" };
  }

  // ACT: Venus >= 0, 7th lord >= 0, no severe malefic in 7th
  if (dVenus >= 0 && d7 >= 0 && maleficsIn7.length === 0) {
    return { outcome: "favorable", primaryDriver: "attunement", secondaryDriver: "support" };
  }

  if (dVenus >= 0 && d7 >= 0) {
    return { outcome: "favorable", primaryDriver: "attunement", secondaryDriver: "timing" };
  }
  return { outcome: "neutral", primaryDriver: "attunement", secondaryDriver: "timing" };
}

function evalMoney(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord2  = getHouseLord(2, lagnaSignIdx);
  const lord11 = getHouseLord(11, lagnaSignIdx);
  const mdLord = chart.dasha.mahadashaLord;

  const dJup  = dignity(chart, "jupiter");
  const d2    = dignity(chart, lord2);
  const d11   = dignity(chart, lord11);

  // AVOID: 2nd lord debil+combust  OR  Rahu in 2nd + active Rahu MD/AD
  const house2Idx = (lagnaSignIdx + 1) % 12;
  const rahuIn2 = planetSign(chart, "rahu") === house2Idx;
  const rahuActive = mdLord === "rahu" || chart.dasha.antardashaLord === "rahu";
  if ((isDebilitated(chart, lord2) && combust(chart, lord2)) ||
      (rahuIn2 && rahuActive)) {
    return { outcome: "caution", primaryDriver: "pressure", secondaryDriver: "stability" };
  }

  // WAIT: Jupiter debilitated  OR  2nd/11th lord in dusthana
  if (isDebilitated(chart, "jupiter") || inDusthana(chart, lord2) || inDusthana(chart, lord11)) {
    return { outcome: "neutral", primaryDriver: "discipline", secondaryDriver: "timing" };
  }

  // Dhana yoga: 2nd and 11th lords in mutual aspect/exchange/conjunction
  const l2sign  = planetSign(chart, lord2);
  const l11sign = planetSign(chart, lord11);
  const dhanaYoga = l2sign === l11sign ||
    aspectsSign(l2sign, l11sign, lord2) ||
    aspectsSign(l11sign, l2sign, lord11);

  // ACT: Jupiter >= +1, 2nd and 11th lords both >= 0
  if (dJup >= 1 && d2 >= 0 && d11 >= 0) {
    return { outcome: "favorable",
      primaryDriver: "stability",
      secondaryDriver: dhanaYoga ? "support" : "discipline" };
  }

  if (d2 >= 0 && d11 >= 0) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "discipline" };
  }
  return { outcome: "neutral", primaryDriver: "discipline", secondaryDriver: "timing" };
}

function evalTravel(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord9 = getHouseLord(9, lagnaSignIdx);
  const lord3 = getHouseLord(3, lagnaSignIdx);
  const mercRetro = retrograde(chart, "mercury");
  const house9Idx = (lagnaSignIdx + 8) % 12;

  // AVOID: 9th lord debil+combust  OR  Rahu/Ketu transiting natal 9th
  const rahuIn9  = planetSign(chart, "rahu") === house9Idx;
  const ketuIn9  = planetSign(chart, "ketu") === house9Idx;
  if ((isDebilitated(chart, lord9) && combust(chart, lord9)) || rahuIn9 || ketuIn9) {
    return { outcome: "caution", primaryDriver: "stability", secondaryDriver: "timing" };
  }

  // WAIT: Mercury retrograde AND ruling 3rd/9th  OR  malefic in 9th without benefic
  const mercRules39 = lord3 === "mercury" || lord9 === "mercury";
  if (mercRetro && mercRules39) {
    return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "adaptability" };
  }

  // Jupiter aspecting 9th is a benefic counter
  const jupAspects9 = aspectsSign(planetSign(chart, "jupiter"), house9Idx, "jupiter");
  const maleficsIn9 = getMaleficAspects(
    { mars: planetSign(chart, "mars"), saturn: planetSign(chart, "saturn"),
      rahu: planetSign(chart, "rahu"), ketu: planetSign(chart, "ketu") },
    house9Idx
  ).filter(m => m.strength >= 1.0);
  if (maleficsIn9.length > 0 && !jupAspects9) {
    return { outcome: "neutral", primaryDriver: "adaptability", secondaryDriver: "timing" };
  }

  // ACT: 9th lord >= 0, Mercury direct
  const d9 = dignity(chart, lord9);
  if (d9 >= 0 && !mercRetro) {
    return { outcome: "favorable", primaryDriver: "adaptability", secondaryDriver: "timing" };
  }
  if (d9 >= 0 && mercRetro && !mercRules39) {
    return { outcome: "favorable", primaryDriver: "adaptability", secondaryDriver: "discipline" };
  }

  return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "timing" };
}

function evalMove(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord4 = getHouseLord(4, lagnaSignIdx);
  const house4Idx = (lagnaSignIdx + 3) % 12;

  const d4    = dignity(chart, lord4);
  const dMoon = dignity(chart, "moon");

  // AVOID: Saturn + Rahu both afflicting 4th  OR  4th lord in 8th/12th + debilitated
  const satIn4  = planetSign(chart, "saturn") === house4Idx;
  const rahuIn4 = planetSign(chart, "rahu") === house4Idx;
  const lord4House = planetHouse(chart, lord4);
  if ((satIn4 && rahuIn4) ||
      (isDebilitated(chart, lord4) && lord4House && [8, 12].includes(lord4House))) {
    return { outcome: "caution", primaryDriver: "pressure", secondaryDriver: "stability" };
  }

  // WAIT: Saturn transiting natal 4th  OR  Moon waning + in 8th/12th
  const moonPhase = chart.planetPositions.moon?.absoluteLongitude ?? 0;
  const sunLon    = chart.planetPositions.sun?.absoluteLongitude ?? 0;
  const moonWaning = ((moonPhase - sunLon + 360) % 360) > 180;
  const moonHouse  = planetHouse(chart, "moon");
  const moonIn812  = moonHouse !== undefined && [8, 12].includes(moonHouse);

  if (satIn4 || (moonWaning && moonIn812)) {
    return { outcome: "neutral", primaryDriver: "stability", secondaryDriver: "timing" };
  }

  // Jupiter aspecting 4th
  const jupAspects4 = aspectsSign(planetSign(chart, "jupiter"), house4Idx, "jupiter");

  // ACT: 4th lord >= +1, Moon >= 0
  if (d4 >= 1 && dMoon >= 0 && jupAspects4) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "support" };
  }
  if (d4 >= 1 && dMoon >= 0) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "timing" };
  }

  if (d4 >= 0 && dMoon >= 0) {
    return { outcome: "favorable", primaryDriver: "stability", secondaryDriver: "timing" };
  }
  return { outcome: "neutral", primaryDriver: "stability", secondaryDriver: "timing" };
}

function evalCommunication(chart: ChartPrimitives, lagnaSignIdx: number): EvalResult {
  const lord3 = getHouseLord(3, lagnaSignIdx);
  const mercRetro   = retrograde(chart, "mercury");
  const mercCombust = combust(chart, "mercury");
  const dMerc = dignity(chart, "mercury");
  const d3    = dignity(chart, lord3);

  // AVOID: Mercury combust + retrograde + enemy sign  OR  3rd lord debil + dusthana
  const mercEnemy = chart.planetPositions.mercury?.dignityPlacement === "enemy";
  if ((mercCombust && mercRetro && mercEnemy) ||
      (isDebilitated(chart, lord3) && inDusthana(chart, lord3))) {
    return { outcome: "caution", primaryDriver: "pressure", secondaryDriver: "clarity" };
  }

  // WAIT: Mercury combust  OR  retrograde
  if (mercCombust || mercRetro) {
    return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "discipline" };
  }

  // ACT: Mercury direct, dignity >= 0, 3rd lord >= 0
  if (!mercRetro && dMerc >= 0 && d3 >= 0) {
    return { outcome: "favorable", primaryDriver: "clarity", secondaryDriver: "timing" };
  }
  if (!mercRetro && dMerc >= 0) {
    return { outcome: "favorable", primaryDriver: "clarity", secondaryDriver: "support" };
  }

  return { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "timing" };
}

// ── Outcome → numeric score ───────────────────────────────────────────────

function outcomeToScore(outcome: DecisionOutcome): number {
  if (outcome === "favorable") return 0.75;
  if (outcome === "caution")   return 0.25;
  return 0.5;
}

// ── Rahu / Ketu shadow caveats (Section 7) ────────────────────────────────

function buildShadowCaveat(mdLord: PlanetKey, adLord: PlanetKey): string | undefined {
  const isNode = (p: PlanetKey) => p === "rahu" || p === "ketu";
  if (!isNode(mdLord) && !isNode(adLord)) return undefined;

  if (isNode(mdLord) && isNode(adLord)) {
    return "Both the larger and smaller cycle are node-driven. The ground itself is shifting. " +
      "Any action here is best treated as provisional, not foundational.";
  }
  const activeNode = isNode(mdLord) ? mdLord : adLord;
  if (activeNode === "rahu") {
    return "Rahu amplifies the visible signal but distorts scale. What looks like the full picture " +
      "is likely only part of it. Commitments made in this period carry forward into the next cycle.";
  }
  return "Ketu creates clarity through detachment, not accumulation. Acting from desire rather than " +
    "discernment tends to dissatisfy regardless of outcome.";
}

// ── Core evaluation ───────────────────────────────────────────────────────

function buildDecisionSeed(chart: ChartPrimitives, category: DecisionCategory): string {
  return buildStableSeed(normalizeDaySeed(chart.computedDate), chart.moonNakshatra, category);
}

export function deriveDecisionState(
  chart: ChartPrimitives,
  category: DecisionCategory
): DecisionState {
  const lagnaSign = chart.lagnaSign;

  // When Ascendant is known: use house-lord dignity path
  if (lagnaSign) {
    const lagnaSignIdx = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
      "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
      .indexOf(lagnaSign);

    if (lagnaSignIdx >= 0) {
      let result: EvalResult;
      switch (category) {
        case "career":        result = evalCareer(chart, lagnaSignIdx);        break;
        case "relationships": result = evalRelationships(chart, lagnaSignIdx); break;
        case "money":         result = evalMoney(chart, lagnaSignIdx);         break;
        case "travel":        result = evalTravel(chart, lagnaSignIdx);        break;
        case "move":          result = evalMove(chart, lagnaSignIdx);          break;
        case "communication": result = evalCommunication(chart, lagnaSignIdx); break;
        default:              result = { outcome: "neutral", primaryDriver: "clarity", secondaryDriver: "timing" };
      }
      return {
        category,
        score:           outcomeToScore(result.outcome),
        outcome:         result.outcome,
        primaryDriver:   result.primaryDriver,
        secondaryDriver: result.secondaryDriver,
        confidence:      0.8,
      };
    }
  }

  // Fallback: signal-based scoring (time-unknown charts)
  return scoreDecision(chart, category);
}

export function renderDecisionEvaluation(
  state: DecisionState,
  chart: ChartPrimitives
): DecisionEvaluation {
  const phraseSet  = DECISION_PHRASES[state.category][state.outcome];
  const stableSeed = buildDecisionSeed(chart, state.category);
  const guidance   = deterministicPick(phraseSet.guidance, `${stableSeed}:guidance`);
  const rationale  = [
    deterministicPick(phraseSet.reasonsByDriver[state.primaryDriver],  `${stableSeed}:primary`),
    deterministicPick(phraseSet.reasonsByDriver[state.secondaryDriver], `${stableSeed}:secondary`),
  ];
  const shadowCaveat = buildShadowCaveat(
    chart.dasha.mahadashaLord,
    chart.dasha.antardashaLord
  );

  return {
    category:        state.category,
    outcome:         state.outcome,
    score:           state.score,
    guidance,
    rationale,
    confidence:      state.confidence,
    primaryDriver:   state.primaryDriver,
    secondaryDriver: state.secondaryDriver,
    shadowCaveat,
  };
}

export function evaluateDecision(
  chart: ChartPrimitives,
  category: DecisionCategory
): DecisionEvaluation {
  return renderDecisionEvaluation(deriveDecisionState(chart, category), chart);
}
