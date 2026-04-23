export const DECISION_CATEGORIES = [
  "career",
  "relationships",
  "money",
  "travel",
  "move",
  "communication"
] as const;

export const DECISION_OUTCOMES = ["favorable", "neutral", "caution"] as const;
export const ENERGY_LEVELS = ["low", "steady", "high"] as const;
export const EMOTIONAL_STYLES = ["internalizing", "expressive", "steady"] as const;
export const DECISION_STYLES = ["deliberate", "adaptive", "decisive"] as const;
export const PATTERN_TONES = ["steady", "restless", "intense"] as const;
export const CHALLENGE_TONES = ["overholding", "overreactive", "scattered"] as const;
export const PHASE_INTENSITIES = ["low", "steady", "high"] as const;
export const SUPPORT_BIASES = ["build", "sharpen", "pause"] as const;
export const RISK_BIASES = ["force", "drift", "overexpose"] as const;
export const FOCUS_KEYS = ["maintenance", "follow-through", "execution"] as const;
export const IDENTITY_ARCHETYPE_KEYS = ["catalyst", "steward", "seeker"] as const;
export const PHASE_STATE_KEYS = [
  "steady-build",
  "visible-stretch",
  "reset-and-sharpen",
  "support-and-bond",
  "adapt-and-reframe"
] as const;
export const DECISION_DRIVER_KEYS = [
  "clarity",
  "support",
  "pressure",
  "stability",
  "adaptability",
  "visibility",
  "discipline",
  "attunement",
  "timing"
] as const;

export type DecisionCategory = (typeof DECISION_CATEGORIES)[number];
export type DecisionOutcome = (typeof DECISION_OUTCOMES)[number];
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
export type EmotionalStyle = (typeof EMOTIONAL_STYLES)[number];
export type DecisionStyle = (typeof DECISION_STYLES)[number];
export type PatternTone = (typeof PATTERN_TONES)[number];
export type ChallengeTone = (typeof CHALLENGE_TONES)[number];
export type PhaseIntensity = (typeof PHASE_INTENSITIES)[number];
export type SupportBias = (typeof SUPPORT_BIASES)[number];
export type RiskBias = (typeof RISK_BIASES)[number];
export type FocusKey = (typeof FOCUS_KEYS)[number];
export type IdentityArchetypeKey = (typeof IDENTITY_ARCHETYPE_KEYS)[number];
export type PhaseStateKey = (typeof PHASE_STATE_KEYS)[number];
export type DecisionDriverKey = (typeof DECISION_DRIVER_KEYS)[number];

export interface IdentityState {
  archetypeKey: IdentityArchetypeKey;
  emotionalStyle: EmotionalStyle;
  decisionStyle: DecisionStyle;
  patternTone: PatternTone;
  challengeTone: ChallengeTone;
  confidence: number;
}

export interface PhaseState {
  stateKey: PhaseStateKey;
  intensity: PhaseIntensity;
  supportBias: SupportBias;
  riskBias: RiskBias;
  confidence: number;
}

export interface DailySignalState {
  energyLevel: EnergyLevel;
  clarityLevel: EnergyLevel;
  pressureLevel: EnergyLevel;
  focusKey: FocusKey;
  confidence: number;
  signalTone: string;
}

export interface DecisionState {
  category: DecisionCategory;
  score: number;
  outcome: DecisionOutcome;
  primaryDriver: DecisionDriverKey;
  secondaryDriver: DecisionDriverKey;
  confidence: number;
}

export interface IdentityProfile {
  archetype: string;
  summary: string;
  strengths: string[];
  watchouts: string[];
  confidence: number;
  core: string;
  emotionalLine: string;
  decisionLine: string;
  patternLine: string;
  challengeLine: string;
}

export interface PhaseProfile {
  label: string;
  summary: string;
  supportAction: string;
  cautionAction: string;
  confidence: number;
  stateKey: PhaseStateKey;
  intensity: PhaseIntensity;
  supportBias: SupportBias;
  riskBias: RiskBias;
  /** 2-3 short descriptor tags derived from stateKey + biases. */
  tags: string[];
}

export interface DailyState {
  energy: EnergyLevel;
  focusArea: string;
  guidance: string;
  caution: string;
  confidence: number;
  focusKey: FocusKey;
  signalTone: string;
  clarityLevel: EnergyLevel;
  pressureLevel: EnergyLevel;
}

export interface DecisionEvaluation {
  category: DecisionCategory;
  outcome: DecisionOutcome;
  score: number;
  guidance: string;
  rationale: string[];
  confidence: number;
  primaryDriver: DecisionDriverKey;
  secondaryDriver: DecisionDriverKey;
  shadowCaveat?: string;
}

export interface IntensityTransitItem {
  name: string;
  delta: number;
}

export interface IntensityBreakdown {
  base_md: number;
  ad_modifier: number;
  transits: IntensityTransitItem[];
}

export type IntensityLevel = "low" | "medium" | "high" | "critical";

export interface IntensityResult {
  score: number;
  level: IntensityLevel;
  breakdown: IntensityBreakdown;
}
