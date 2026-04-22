import { DAILY_PHRASES } from "@/lib/content/dailyPhrases";
import { buildStableSeed, normalizeDaySeed } from "@/lib/engine/scoring";
import type { ChartPrimitives } from "@/lib/types/astrology";
import type { DailySignalState, DailyState, EnergyLevel, FocusKey } from "@/lib/types/engine";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import { hashToUnitInterval } from "@/lib/utils/hash";
import { roundTo } from "@/lib/utils/math";

function getEnergyLevel(chart: ChartPrimitives): EnergyLevel {
  if (chart.transit.pressureLevel === "high" && chart.transit.supportLevel !== "high") {
    return "low";
  }

  if (chart.transit.supportLevel === "high" || chart.transit.taraBala.score >= 0.72) {
    return "high";
  }

  return "steady";
}

function getFocusKey(chart: ChartPrimitives): FocusKey {
  const level = chart.transit.taraBala.level;
  if (level === "vipat" || level === "naidhana" || level === "janma") {
    return "maintenance";
  }

  if (level === "sampat" || level === "kshema" || level === "mitra") {
    return "follow-through";
  }

  return "execution";
}

function getDailyConfidence(chart: ChartPrimitives): number {
  const base = chart.birthTimeMode === "time-unknown" ? 0.54 : 0.79;
  return roundTo(chart.transit.taraBala.score > 0.7 ? base + 0.05 : base, 2);
}

function buildDailySeed(chart: ChartPrimitives, seed?: string): string {
  return (
    seed ??
    buildStableSeed(
      normalizeDaySeed(chart.computedDate),
      chart.transit.currentMoonSign,
      chart.transit.taraBala.level
    )
  );
}

export function deriveDailyState(chart: ChartPrimitives): DailySignalState {
  const energyLevel = getEnergyLevel(chart);
  const clarityLevel = chart.transit.clarityLevel;
  const pressureLevel = chart.transit.pressureLevel;
  const focusKey = getFocusKey(chart);

  return {
    energyLevel,
    clarityLevel,
    pressureLevel,
    focusKey,
    confidence: getDailyConfidence(chart),
    signalTone: deterministicPick(
      DAILY_PHRASES.toneByEnergy[energyLevel],
      buildStableSeed(chart.transit.currentMoonNakshatra, chart.transit.taraBala.level, energyLevel)
    )
  };
}

export function renderDailyState(
  state: DailySignalState,
  chart: ChartPrimitives,
  seed?: string
): DailyState {
  const stableSeed = buildDailySeed(chart, seed);
  const focusGuidance = deterministicPick(
    DAILY_PHRASES.guidanceByFocus[state.focusKey],
    `${stableSeed}:guidance`
  );
  const clarityGuidance = deterministicPick(
    DAILY_PHRASES.guidanceByClarity[state.clarityLevel],
    `${stableSeed}:clarity`
  );
  const caution = deterministicPick(
    DAILY_PHRASES.cautionByPressure[state.pressureLevel],
    `${stableSeed}:caution`
  );
  const guidance =
    state.clarityLevel === "steady" ? focusGuidance : `${focusGuidance} ${clarityGuidance}`;

  return {
    energy: state.energyLevel,
    focusArea: DAILY_PHRASES.focusLabels[state.focusKey],
    guidance,
    caution,
    confidence: state.confidence,
    focusKey: state.focusKey,
    signalTone: state.signalTone,
    clarityLevel: state.clarityLevel,
    pressureLevel: state.pressureLevel
  };
}

export function generateDailyState(chart: ChartPrimitives, seed?: string): DailyState {
  return renderDailyState(deriveDailyState(chart), chart, seed);
}

export function generateStatelessDailyState(
  userId: string,
  referenceDate: Date | string = new Date()
): DailyState {
  const normalizedSeed = buildStableSeed(normalizeDaySeed(referenceDate), userId);
  const energy: EnergyLevel =
    hashToUnitInterval(`${normalizedSeed}:energy`) > 0.66
      ? "high"
      : hashToUnitInterval(`${normalizedSeed}:energy`) < 0.33
        ? "low"
        : "steady";
  const focusKey: FocusKey =
    energy === "low" ? "maintenance" : energy === "high" ? "execution" : "follow-through";
  const signalTone = deterministicPick(DAILY_PHRASES.toneByEnergy[energy], `${normalizedSeed}:tone`);

  return {
    energy,
    focusArea: DAILY_PHRASES.focusLabels[focusKey],
    guidance: deterministicPick(DAILY_PHRASES.guidanceByFocus[focusKey], `${normalizedSeed}:guidance`),
    caution: deterministicPick(DAILY_PHRASES.cautionByPressure[energy], `${normalizedSeed}:caution`),
    confidence: 0.42,
    focusKey,
    signalTone,
    clarityLevel: energy,
    pressureLevel: energy
  };
}
