/**
 * phaseEngine.ts — Section 10 rewrite
 * Phase name and description from MD×AD 81-combination matrix.
 */

import { getPhaseDescriptor } from "@/lib/content/phaseMatrix";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type { PhaseProfile, PhaseState } from "@/lib/types/engine";
import { roundTo } from "@/lib/utils/math";

// Keep legacy state-key mapping for PhaseState.stateKey (used by scoring.ts)
import {
  PHASE_MAHADASHA_STATE_KEYS,
  PHASE_ANTARDASHA_INTENSITIES,
  PHASE_SUPPORT_BIASES,
  PHASE_RISK_BIASES,
} from "@/lib/engine/scoring";

function getPhaseConfidence(chart: ChartPrimitives): number {
  const base = chart.dasha.confidence === "high" ? 0.88 : 0.68;
  return roundTo(chart.birthTimeMode === "time-unknown" ? base - 0.06 : base, 2);
}

export function derivePhaseState(chart: ChartPrimitives): PhaseState {
  return {
    stateKey:    PHASE_MAHADASHA_STATE_KEYS[chart.dasha.mahadashaLord],
    intensity:   PHASE_ANTARDASHA_INTENSITIES[chart.dasha.antardashaLord],
    supportBias: PHASE_SUPPORT_BIASES[chart.dasha.mahadashaLord],
    riskBias:    PHASE_RISK_BIASES[chart.dasha.antardashaLord],
    confidence:  getPhaseConfidence(chart),
  };
}

export function renderPhaseProfile(
  state: PhaseState,
  chart: ChartPrimitives
): PhaseProfile {
  // Section 10: use the MD×AD descriptor matrix
  const desc = getPhaseDescriptor(
    chart.dasha.mahadashaLord,
    chart.dasha.antardashaLord
  );

  return {
    label:         desc.name,
    summary:       desc.summary,
    supportAction: desc.opportunity,
    cautionAction: desc.risk,
    confidence:    state.confidence,
    stateKey:      desc.name,  // MD×AD combination name, not static mahadasha-level key
    intensity:     state.intensity,
    supportBias:   state.supportBias,
    riskBias:      state.riskBias,
    tags: [
      desc.name,
      `${state.supportBias} mode`,
      `avoid: ${desc.avoidTag}`,
    ],
  };
}

export function generatePhaseProfile(chart: ChartPrimitives): PhaseProfile {
  return renderPhaseProfile(derivePhaseState(chart), chart);
}
