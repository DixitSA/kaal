import {
  DEGREES_PER_NAKSHATRA,
  TOTAL_VIMSHOTTARI_YEARS,
  VIMSHOTTARI_SEQUENCE
} from "@/lib/astro/constants";
import { normalizeLongitude } from "@/lib/astro/calculateNakshatra";
import { resolveBirthUtcDate } from "@/lib/astro/calculateJulianDay";
import type { BirthInput, ChartConfidenceLevel, DashaState, PlanetKey } from "@/lib/types/astrology";
import { getBirthTimeMode } from "@/lib/types/astrology";

interface DashaPeriod {
  lord: PlanetKey;
  start: Date;
  end: Date;
}

export interface DashaCalculationInput {
  birth: BirthInput;
  natalMoonLongitude: number;
}

function addYears(date: Date, years: number): Date {
  return new Date(date.getTime() + years * 365.2425 * 24 * 60 * 60 * 1000);
}

function calculateBirthMahadashaRemainingYears(natalMoonLongitude: number, totalYears: number): number {
  const progressInNakshatra = (normalizeLongitude(natalMoonLongitude) % DEGREES_PER_NAKSHATRA) / DEGREES_PER_NAKSHATRA;
  return totalYears * (1 - progressInNakshatra);
}

function buildMahadashaTimeline(birthUtc: Date, natalMoonLongitude: number): DashaPeriod[] {
  const nakshatraIndex = Math.floor(normalizeLongitude(natalMoonLongitude) / DEGREES_PER_NAKSHATRA);
  const birthSequenceIndex = nakshatraIndex % VIMSHOTTARI_SEQUENCE.length;
  const timeline: DashaPeriod[] = [];

  let cursor = new Date(birthUtc.getTime());

  for (let offset = 0; offset < VIMSHOTTARI_SEQUENCE.length + 1; offset += 1) {
    const sequenceIndex = (birthSequenceIndex + offset) % VIMSHOTTARI_SEQUENCE.length;
    const period = VIMSHOTTARI_SEQUENCE[sequenceIndex];
    const years =
      offset === 0
        ? calculateBirthMahadashaRemainingYears(natalMoonLongitude, period.years)
        : period.years;
    const end = addYears(cursor, years);

    timeline.push({
      lord: period.lord,
      start: new Date(cursor.getTime()),
      end
    });
    cursor = end;
  }

  return timeline;
}

function findActiveMahadasha(periods: DashaPeriod[], asOf: Date): DashaPeriod {
  return (
    periods.find((period) => asOf >= period.start && asOf < period.end) ??
    periods[periods.length - 1]
  );
}

function buildAntardashaTimeline(mahadasha: DashaPeriod): DashaPeriod[] {
  const startIndex = VIMSHOTTARI_SEQUENCE.findIndex((period) => period.lord === mahadasha.lord);
  const totalMilliseconds = mahadasha.end.getTime() - mahadasha.start.getTime();
  const timeline: DashaPeriod[] = [];
  let cursor = new Date(mahadasha.start.getTime());

  for (let offset = 0; offset < VIMSHOTTARI_SEQUENCE.length; offset += 1) {
    const sequenceIndex = (startIndex + offset) % VIMSHOTTARI_SEQUENCE.length;
    const subperiod = VIMSHOTTARI_SEQUENCE[sequenceIndex];
    const fraction = subperiod.years / TOTAL_VIMSHOTTARI_YEARS;
    const durationMilliseconds = totalMilliseconds * fraction;
    const end = new Date(cursor.getTime() + durationMilliseconds);

    timeline.push({
      lord: subperiod.lord,
      start: new Date(cursor.getTime()),
      end
    });
    cursor = end;
  }

  return timeline;
}

function toConfidenceLevel(birth: BirthInput): ChartConfidenceLevel {
  return getBirthTimeMode(birth) === "time-unknown" ? "medium" : "high";
}

export function calculateDasha(
  input: DashaCalculationInput,
  asOf: Date = new Date()
): DashaState {
  const birthUtc = resolveBirthUtcDate(
    input.birth.date,
    input.birth.time,
    input.birth.timezone ?? "UTC"
  );
  const mahadashaTimeline = buildMahadashaTimeline(birthUtc, input.natalMoonLongitude);
  const activeMahadasha = findActiveMahadasha(mahadashaTimeline, asOf);
  const antardashaTimeline = buildAntardashaTimeline(activeMahadasha);
  const activeAntardasha =
    antardashaTimeline.find((period) => asOf >= period.start && asOf < period.end) ??
    antardashaTimeline[antardashaTimeline.length - 1];

  return {
    mahadashaLord: activeMahadasha.lord,
    mahadashaStartedAt: activeMahadasha.start.toISOString(),
    mahadashaEndsAt: activeMahadasha.end.toISOString(),
    antardashaLord: activeAntardasha.lord,
    antardashaStartedAt: activeAntardasha.start.toISOString(),
    antardashaEndsAt: activeAntardasha.end.toISOString(),
    confidence: toConfidenceLevel(input.birth)
  };
}
