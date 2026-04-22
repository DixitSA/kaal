export const AYANAMSHA_KEYS = ["lahiri"] as const;
export const BIRTH_TIME_MODES = ["exact", "time-unknown"] as const;
export const CHART_CONFIDENCE_LEVELS = ["high", "medium"] as const;
export const PLANET_KEYS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "rahu",
  "ketu"
] as const;
export const TARA_BALA_LEVELS = [
  "janma",
  "sampat",
  "vipat",
  "kshema",
  "pratyari",
  "sadhaka",
  "naidhana",
  "mitra",
  "paramamitra"
] as const;
export const TRANSIT_MODIFIER_LEVELS = ["low", "steady", "high"] as const;

export type AyanamshaKey = (typeof AYANAMSHA_KEYS)[number];
export type BirthTimeMode = (typeof BIRTH_TIME_MODES)[number];
export type ChartConfidenceLevel = (typeof CHART_CONFIDENCE_LEVELS)[number];
export type PlanetKey = (typeof PLANET_KEYS)[number];
export type TaraBalaLevel = (typeof TARA_BALA_LEVELS)[number];
export type TransitModifierLevel = (typeof TRANSIT_MODIFIER_LEVELS)[number];

export interface BirthInput {
  date: string;
  time?: string;
  timeKnown?: boolean;
  timeUnknown?: boolean;
  place?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface ResolvedBirthInput {
  date: string;
  time?: string;
  timeKnown: boolean;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetPosition {
  sign: string;
  degree: number;
  absoluteLongitude: number;
  house?: number;
}

export interface HousePosition {
  house: number;
  sign: string;
  startDegree: number;
}

export interface DashaState {
  mahadashaLord: PlanetKey;
  mahadashaStartedAt: string;
  mahadashaEndsAt: string;
  antardashaLord: PlanetKey;
  antardashaStartedAt: string;
  antardashaEndsAt: string;
  confidence: ChartConfidenceLevel;
}

export interface TaraBala {
  offset: number;
  level: TaraBalaLevel;
  score: number;
}

export interface TransitState {
  currentMoonSign: string;
  currentMoonDegree: number;
  currentMoonNakshatra: string;
  currentMoonNakshatraPada: number;
  taraBala: TaraBala;
  supportLevel: TransitModifierLevel;
  pressureLevel: TransitModifierLevel;
  clarityLevel: TransitModifierLevel;
}

export interface ChartPrimitives {
  ayanamsha: AyanamshaKey;
  birthTimeMode: BirthTimeMode;
  julianDayUT: number;
  lagnaSign?: string;
  lagnaDegree?: number;
  moonSign: string;
  moonDegree: number;
  moonNakshatra: string;
  moonNakshatraPada: number;
  sunSignSidereal: string;
  planetPositions: Record<PlanetKey, PlanetPosition>;
  houses?: HousePosition[];
  confidence: ChartConfidenceLevel;
  dasha: DashaState;
  transit: TransitState;
  computedAt: string;
  computedDate: string;
}

export function getBirthTimeMode(input: Pick<BirthInput, "timeKnown" | "timeUnknown">): BirthTimeMode {
  if (input.timeKnown === true) {
    return "exact";
  }

  if (input.timeUnknown === true) {
    return "time-unknown";
  }

  return "exact";
}

export function hasExactBirthTime(
  input: Pick<BirthInput, "timeKnown" | "timeUnknown">
): boolean {
  return getBirthTimeMode(input) === "exact";
}
