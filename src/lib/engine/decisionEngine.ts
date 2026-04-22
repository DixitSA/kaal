import { DECISION_PHRASES } from "@/lib/content/decisionPhrases";
import {
  buildStableSeed,
  normalizeDaySeed,
  scoreDecision
} from "@/lib/engine/scoring";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type { DecisionCategory, DecisionEvaluation, DecisionState } from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";

function buildDecisionSeed(chart: ChartPrimitives, category: DecisionCategory): string {
  return buildStableSeed(normalizeDaySeed(chart.computedDate), chart.moonNakshatra, category);
}

export function deriveDecisionState(
  chart: ChartPrimitives,
  category: DecisionCategory
): DecisionState {
  // Future decision categories should extend the shared scoring and phrase-bank layers,
  // then register the category in src/lib/types/engine.ts and the shared input/output
  // schemas instead of adding route-specific behavior or a separate transport contract.
  return scoreDecision(chart, category);
}

export function renderDecisionEvaluation(
  state: DecisionState,
  chart: ChartPrimitives
): DecisionEvaluation {
  const phraseSet = DECISION_PHRASES[state.category][state.outcome];
  const stableSeed = buildDecisionSeed(chart, state.category);
  const guidance = deterministicPick(phraseSet.guidance, `${stableSeed}:guidance`);
  const rationale = [
    deterministicPick(phraseSet.reasonsByDriver[state.primaryDriver], `${stableSeed}:primary`),
    deterministicPick(phraseSet.reasonsByDriver[state.secondaryDriver], `${stableSeed}:secondary`)
  ];

  return {
    category: state.category,
    outcome: state.outcome,
    score: state.score,
    guidance,
    rationale,
    confidence: state.confidence,
    primaryDriver: state.primaryDriver,
    secondaryDriver: state.secondaryDriver
  };
}

export function evaluateDecision(
  chart: ChartPrimitives,
  category: DecisionCategory
): DecisionEvaluation {
  return renderDecisionEvaluation(deriveDecisionState(chart, category), chart);
}
