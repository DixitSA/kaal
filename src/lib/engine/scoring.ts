import { DECISION_SCORE_THRESHOLDS, NAKSHATRA_NAMES } from "@/lib/astro/constants";
import { getIsoDateInTimeZone } from "@/lib/astro/calculateJulianDay";
import type { ChartPrimitives, PlanetKey } from "@/lib/types/astrology";
import type {
  DecisionCategory,
  DecisionDriverKey,
  DecisionState,
  EnergyLevel,
  PhaseIntensity,
  PhaseStateKey,
  RiskBias,
  SupportBias
} from "@/lib/types/engine";
import { hashToUnitInterval } from "@/lib/utils/hash";
import { roundTo } from "@/lib/utils/math";

const EARTH_SIGNS = new Set(["Taurus", "Virgo", "Capricorn"]);
const WATER_SIGNS = new Set(["Cancer", "Scorpio", "Pisces"]);
const AIR_SIGNS = new Set(["Gemini", "Libra", "Aquarius"]);
const FIRE_SIGNS = new Set(["Aries", "Leo", "Sagittarius"]);
const FIXED_SIGNS = new Set(["Taurus", "Leo", "Scorpio", "Aquarius"]);
const MUTABLE_SIGNS = new Set(["Gemini", "Virgo", "Sagittarius", "Pisces"]);
const HIGH_LEVEL = 0.84;
const STEADY_LEVEL = 0.62;
const LOW_LEVEL = 0.34;
const DAY_SEED_PREFIX = "day";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface DecisionSignalScores {
  clarity: number;
  support: number;
  pressure: number;
  stability: number;
  adaptability: number;
  visibility: number;
  discipline: number;
  attunement: number;
  timing: number;
}

type DecisionCategoryWeights = Record<DecisionDriverKey, number>;

export const PHASE_MAHADASHA_STATE_KEYS: Record<PlanetKey, PhaseStateKey> = {
  sun: "visible-stretch",
  moon: "support-and-bond",
  mars: "visible-stretch",
  mercury: "adapt-and-reframe",
  jupiter: "steady-build",
  venus: "support-and-bond",
  saturn: "reset-and-sharpen",
  rahu: "adapt-and-reframe",
  ketu: "reset-and-sharpen"
};

export const PHASE_ANTARDASHA_INTENSITIES: Record<PlanetKey, PhaseIntensity> = {
  sun: "high",
  moon: "steady",
  mars: "high",
  mercury: "steady",
  jupiter: "steady",
  venus: "low",
  saturn: "low",
  rahu: "high",
  ketu: "low"
};

export const PHASE_SUPPORT_BIASES: Record<PlanetKey, SupportBias> = {
  sun: "sharpen",
  moon: "build",
  mars: "sharpen",
  mercury: "build",
  jupiter: "build",
  venus: "build",
  saturn: "pause",
  rahu: "sharpen",
  ketu: "pause"
};

export const PHASE_RISK_BIASES: Record<PlanetKey, RiskBias> = {
  sun: "overexpose",
  moon: "drift",
  mars: "force",
  mercury: "drift",
  jupiter: "overexpose",
  venus: "drift",
  saturn: "force",
  rahu: "overexpose",
  ketu: "force"
};

export const DECISION_CATEGORY_WEIGHTS: Record<DecisionCategory, DecisionCategoryWeights> = {
  career: {
    clarity: 0.2,
    support: 0.18,
    pressure: -0.16,
    stability: 0.14,
    adaptability: 0.08,
    visibility: 0.16,
    discipline: 0.18,
    attunement: 0.02,
    timing: 0.1
  },
  relationships: {
    clarity: 0.12,
    support: 0.16,
    pressure: -0.18,
    stability: 0.12,
    adaptability: 0.08,
    visibility: 0.04,
    discipline: 0.04,
    attunement: 0.18,
    timing: 0.12
  },
  money: {
    clarity: 0.18,
    support: 0.14,
    pressure: -0.14,
    stability: 0.16,
    adaptability: 0.06,
    visibility: 0.04,
    discipline: 0.18,
    attunement: 0.02,
    timing: 0.14
  },
  travel: {
    clarity: 0.12,
    support: 0.12,
    pressure: -0.12,
    stability: 0.04,
    adaptability: 0.22,
    visibility: 0.12,
    discipline: 0.02,
    attunement: 0.04,
    timing: 0.22
  },
  move: {
    clarity: 0.18,
    support: 0.14,
    pressure: -0.14,
    stability: 0.16,
    adaptability: 0.16,
    visibility: 0.06,
    discipline: 0.08,
    attunement: 0.02,
    timing: 0.12
  },
  communication: {
    clarity: 0.24,
    support: 0.14,
    pressure: -0.18,
    stability: 0.06,
    adaptability: 0.12,
    visibility: 0.12,
    discipline: 0.04,
    attunement: 0.08,
    timing: 0.12
  }
};

const POSITIVE_DRIVER_LABELS: Record<DecisionDriverKey, string> = {
  clarity: "clarity",
  support: "support",
  pressure: "pressure",
  stability: "stability",
  adaptability: "adaptability",
  visibility: "visibility",
  discipline: "discipline",
  attunement: "attunement",
  timing: "timing"
};

function getLevelScore(level: EnergyLevel): number {
  if (level === "high") {
    return HIGH_LEVEL;
  }

  if (level === "steady") {
    return STEADY_LEVEL;
  }

  return LOW_LEVEL;
}

function getPlanetSignal(planet: PlanetKey, target: "visibility" | "discipline" | "attunement"): number {
  const map: Record<typeof target, Record<PlanetKey, number>> = {
    visibility: {
      sun: 0.88,
      moon: 0.58,
      mars: 0.8,
      mercury: 0.62,
      jupiter: 0.76,
      venus: 0.6,
      saturn: 0.46,
      rahu: 0.84,
      ketu: 0.34
    },
    discipline: {
      sun: 0.58,
      moon: 0.48,
      mars: 0.62,
      mercury: 0.74,
      jupiter: 0.66,
      venus: 0.52,
      saturn: 0.86,
      rahu: 0.42,
      ketu: 0.58
    },
    attunement: {
      sun: 0.4,
      moon: 0.86,
      mars: 0.34,
      mercury: 0.58,
      jupiter: 0.62,
      venus: 0.82,
      saturn: 0.38,
      rahu: 0.28,
      ketu: 0.42
    }
  };

  return map[target][planet];
}

function getSignStability(sign: string, lagnaSign?: string): number {
  let score = 0.5;

  if (EARTH_SIGNS.has(sign)) {
    score += 0.24;
  } else if (WATER_SIGNS.has(sign)) {
    score += 0.14;
  } else if (FIRE_SIGNS.has(sign)) {
    score -= 0.02;
  } else {
    score += 0.04;
  }

  if (lagnaSign && FIXED_SIGNS.has(lagnaSign)) {
    score += 0.08;
  }

  return Math.min(0.95, Math.max(0.2, score));
}

function getSignAdaptability(sign: string, lagnaSign?: string): number {
  let score = 0.42;

  if (MUTABLE_SIGNS.has(sign)) {
    score += 0.28;
  } else if (AIR_SIGNS.has(sign)) {
    score += 0.16;
  } else if (FIXED_SIGNS.has(sign)) {
    score -= 0.08;
  }

  if (lagnaSign && MUTABLE_SIGNS.has(lagnaSign)) {
    score += 0.06;
  }

  return Math.min(0.92, Math.max(0.18, score));
}

function getNakshatraSignal(moonNakshatra: string): number {
  const index = NAKSHATRA_NAMES.indexOf(moonNakshatra as (typeof NAKSHATRA_NAMES)[number]);
  if (index === -1) {
    return 0.5;
  }

  return roundTo(0.35 + ((index % 9) / 8) * 0.5, 3);
}

function getTimeConfidenceScore(chart: ChartPrimitives): number {
  return chart.birthTimeMode === "time-unknown" ? 0.62 : 0.86;
}

function getPressurePenalty(chart: ChartPrimitives): number {
  const basePenalty = getLevelScore(chart.transit.pressureLevel);
  return chart.birthTimeMode === "time-unknown" ? roundTo(Math.min(1, basePenalty + 0.04), 3) : basePenalty;
}

function getLocalIsoDate(input: Date, timeZone?: string): string {
  if (timeZone) {
    return getIsoDateInTimeZone(input, timeZone);
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(input);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to derive a local ISO date for the day seed");
  }

  return `${year}-${month}-${day}`;
}

export function normalizeDaySeed(input: Date | string, timeZone?: string): string {
  if (typeof input === "string" && ISO_DATE_PATTERN.test(input)) {
    return `${DAY_SEED_PREFIX}:${input}`;
  }

  const normalized = input instanceof Date ? input : new Date(input);
  return `${DAY_SEED_PREFIX}:${getLocalIsoDate(normalized, timeZone)}`;
}

export function buildStableSeed(...parts: Array<string | number>): string {
  return parts.join(":");
}

export function getDecisionSignals(chart: ChartPrimitives): DecisionSignalScores {
  const moonSign = chart.moonSign;
  const lagnaSign = chart.lagnaSign;
  const mahadashaLord = chart.dasha.mahadashaLord;
  const taraScore = chart.transit.taraBala.score;

  return {
    clarity: roundTo(getLevelScore(chart.transit.clarityLevel), 3),
    support: roundTo(getLevelScore(chart.transit.supportLevel), 3),
    pressure: roundTo(getPressurePenalty(chart), 3),
    stability: roundTo(getSignStability(moonSign, lagnaSign), 3),
    adaptability: roundTo(getSignAdaptability(moonSign, lagnaSign), 3),
    visibility: roundTo((getPlanetSignal(mahadashaLord, "visibility") + getNakshatraSignal(chart.moonNakshatra)) / 2, 3),
    discipline: roundTo((getPlanetSignal(mahadashaLord, "discipline") + getTimeConfidenceScore(chart)) / 2, 3),
    attunement: roundTo((getPlanetSignal(mahadashaLord, "attunement") + (WATER_SIGNS.has(moonSign) ? 0.8 : 0.46)) / 2, 3),
    timing: roundTo((taraScore + getTimeConfidenceScore(chart)) / 2, 3)
  };
}

function getDriverRanking(
  category: DecisionCategory,
  signals: DecisionSignalScores
): Array<{ key: DecisionDriverKey; contribution: number }> {
  const weights = DECISION_CATEGORY_WEIGHTS[category];

  return (Object.keys(weights) as DecisionDriverKey[])
    .map((key) => ({
      key,
      contribution: roundTo(signals[key] * weights[key], 4)
    }))
    .sort((left, right) => Math.abs(right.contribution) - Math.abs(left.contribution));
}

export function scoreDecision(chart: ChartPrimitives, category: DecisionCategory): DecisionState {
  const signals = getDecisionSignals(chart);
  const weights = DECISION_CATEGORY_WEIGHTS[category];
  const weightedScore = (Object.keys(weights) as DecisionDriverKey[]).reduce(
    (total, key) => total + signals[key] * weights[key],
    0
  );
  const variation =
    (hashToUnitInterval(
      buildStableSeed(normalizeDaySeed(chart.computedDate), chart.moonNakshatra, category)
    ) -
      0.5) *
    0.08;
  const confidence = roundTo(getTimeConfidenceScore(chart), 2);
  const score = roundTo(Math.min(1, Math.max(0, 0.5 + weightedScore + variation)), 3);
  const driverRanking = getDriverRanking(category, signals);
  const [primary, secondary = driverRanking[0]] = driverRanking;

  const outcome = getDecisionOutcome(score);

  return {
    category,
    score,
    outcome,
    primaryDriver: primary.key,
    secondaryDriver: secondary.key,
    confidence
  };
}

export function getDecisionDriverLabel(driver: DecisionDriverKey): string {
  return POSITIVE_DRIVER_LABELS[driver];
}

export function getDecisionOutcome(score: number): DecisionState["outcome"] {
  if (score >= DECISION_SCORE_THRESHOLDS.favorable) {
    return "favorable";
  }

  if (score <= DECISION_SCORE_THRESHOLDS.caution) {
    return "caution";
  }

  return "neutral";
}
