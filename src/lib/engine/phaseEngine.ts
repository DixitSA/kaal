import { PHASE_PHRASES } from "@/lib/content/phasePhrases";
import {
  PHASE_ANTARDASHA_INTENSITIES,
  PHASE_MAHADASHA_STATE_KEYS,
  PHASE_RISK_BIASES,
  PHASE_SUPPORT_BIASES
} from "@/lib/engine/scoring";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type { PhaseProfile, PhaseState } from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import { roundTo } from "@/lib/utils/math";

function buildPhaseSeed(chart: ChartPrimitives): string {
  return `${chart.dasha.mahadashaLord}:${chart.dasha.antardashaLord}:${chart.dasha.mahadashaStartedAt}`;
}

function getPhaseConfidence(chart: ChartPrimitives): number {
  const base = chart.dasha.confidence === "high" ? 0.88 : 0.68;
  return roundTo(chart.birthTimeMode === "time-unknown" ? base - 0.06 : base, 2);
}

export function derivePhaseState(chart: ChartPrimitives): PhaseState {
  return {
    stateKey: PHASE_MAHADASHA_STATE_KEYS[chart.dasha.mahadashaLord],
    intensity: PHASE_ANTARDASHA_INTENSITIES[chart.dasha.antardashaLord],
    supportBias: PHASE_SUPPORT_BIASES[chart.dasha.mahadashaLord],
    riskBias: PHASE_RISK_BIASES[chart.dasha.antardashaLord],
    confidence: getPhaseConfidence(chart)
  };
}

export function renderPhaseProfile(state: PhaseState, chart: ChartPrimitives): PhaseProfile {
  const phraseSet = PHASE_PHRASES[state.stateKey];
  const stableSeed = buildPhaseSeed(chart);
  const label = deterministicPick(phraseSet.label, `${stableSeed}:label`);
  const summary = deterministicPick(
    phraseSet.summaryByIntensity[state.intensity],
    `${stableSeed}:summary`
  );
  const supportAction = deterministicPick(
    phraseSet.supportByBias[state.supportBias],
    `${stableSeed}:support`
  );
  const cautionAction = deterministicPick(
    phraseSet.cautionByBias[state.riskBias],
    `${stableSeed}:caution`
  );

  return {
    label,
    summary,
    supportAction,
    cautionAction,
    confidence: state.confidence,
    stateKey: state.stateKey,
    intensity: state.intensity,
    supportBias: state.supportBias,
    riskBias: state.riskBias
  };
}

export function generatePhaseProfile(chart: ChartPrimitives): PhaseProfile {
  return renderPhaseProfile(derivePhaseState(chart), chart);
}
