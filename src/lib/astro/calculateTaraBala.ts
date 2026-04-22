import { TARA_BALA_SCORES, TARA_BALA_SEQUENCE } from "@/lib/astro/constants";
import type { TaraBala } from "@/lib/types/astrology";

export function calculateTaraOffset(
  birthNakshatraIndex: number,
  currentNakshatraIndex: number
): number {
  return ((currentNakshatraIndex - birthNakshatraIndex + 27) % 27) + 1;
}

export function calculateTaraBala(
  birthNakshatraIndex: number,
  currentNakshatraIndex: number
): TaraBala {
  const offset = calculateTaraOffset(birthNakshatraIndex, currentNakshatraIndex);
  const level = TARA_BALA_SEQUENCE[(offset - 1) % TARA_BALA_SEQUENCE.length];

  return {
    offset,
    level,
    score: TARA_BALA_SCORES[level]
  };
}
