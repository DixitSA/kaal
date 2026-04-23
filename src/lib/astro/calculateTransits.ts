import { calculateNakshatra } from "@/lib/astro/calculateNakshatra";
import { calculateTaraBala } from "@/lib/astro/calculateTaraBala";
import type { TransitModifierLevel, TransitState } from "@/lib/types/astrology";

export interface TransitCalculationInput {
  natalMoonLongitude: number;
  currentMoonLongitude: number;
  transitPlanetLongitudes?: Record<string, number>;
}

function toModifierLevel(score: number): TransitModifierLevel {
  if (score >= 0.67) {
    return "high";
  }

  if (score <= 0.33) {
    return "low";
  }

  return "steady";
}

export function calculateTransits(input: TransitCalculationInput): TransitState {
  const natalMoon = calculateNakshatra(input.natalMoonLongitude);
  const currentMoon = calculateNakshatra(input.currentMoonLongitude);
  const taraBala = calculateTaraBala(natalMoon.nakshatraIndex, currentMoon.nakshatraIndex);
  const signDistance = (currentMoon.signIndex - natalMoon.signIndex + 12) % 12;

  const supportScore = Math.min(1, taraBala.score * 0.7 + (signDistance === 1 || signDistance === 5 ? 0.25 : 0.05));
  const pressureScore = Math.min(
    1,
    (1 - taraBala.score) * 0.7 + (signDistance === 6 || signDistance === 8 ? 0.25 : 0.1)
  );
  const clarityScore = Math.min(
    1,
    taraBala.score * 0.5 + (signDistance === 0 || signDistance === 9 ? 0.3 : 0.1)
  );

  return {
    currentMoonSign: currentMoon.sign,
    currentMoonDegree: currentMoon.degreeInSign,
    currentMoonNakshatra: currentMoon.nakshatra,
    currentMoonNakshatraPada: currentMoon.pada,
    taraBala,
    supportLevel: toModifierLevel(supportScore),
    pressureLevel: toModifierLevel(pressureScore),
    clarityLevel: toModifierLevel(clarityScore),
    transitPlanetLongitudes: input.transitPlanetLongitudes,
  };
}
