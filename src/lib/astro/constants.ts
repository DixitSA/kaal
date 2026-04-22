import type {
  AyanamshaKey,
  PlanetKey,
  TaraBalaLevel,
  TransitModifierLevel
} from "@/lib/types/astrology";

export const DEFAULT_AYANAMSHA: AyanamshaKey = "lahiri";
export const AYANAMSHA_LABELS: Record<AyanamshaKey, string> = {
  lahiri: "Lahiri"
};

export const RASHI_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
] as const;

export const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
] as const;

export const SIGNS_COUNT = RASHI_NAMES.length;
export const NAKSHATRAS_COUNT = NAKSHATRA_NAMES.length;
export const PADAS_PER_NAKSHATRA = 4;
export const HOUSES_COUNT = 12;

export const DEGREES_IN_CIRCLE = 360;
export const DEGREES_PER_SIGN = DEGREES_IN_CIRCLE / SIGNS_COUNT;
export const DEGREES_PER_NAKSHATRA = DEGREES_IN_CIRCLE / NAKSHATRAS_COUNT;
export const DEGREES_PER_PADA = DEGREES_PER_NAKSHATRA / PADAS_PER_NAKSHATRA;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_DAY = HOURS_PER_DAY * 60;
export const UNIX_EPOCH_JULIAN_DAY = 2_440_587.5;
export const J2000_JULIAN_DAY = 2_451_545;

export const VIMSHOTTARI_SEQUENCE: ReadonlyArray<{ lord: PlanetKey; years: number }> = [
  { lord: "ketu", years: 7 },
  { lord: "venus", years: 20 },
  { lord: "sun", years: 6 },
  { lord: "moon", years: 10 },
  { lord: "mars", years: 7 },
  { lord: "rahu", years: 18 },
  { lord: "jupiter", years: 16 },
  { lord: "saturn", years: 19 },
  { lord: "mercury", years: 17 }
];

export const TOTAL_VIMSHOTTARI_YEARS = VIMSHOTTARI_SEQUENCE.reduce(
  (total, period) => total + period.years,
  0
);

export const TARA_BALA_SEQUENCE: readonly TaraBalaLevel[] = [
  "janma",
  "sampat",
  "vipat",
  "kshema",
  "pratyari",
  "sadhaka",
  "naidhana",
  "mitra",
  "paramamitra"
];

export const TARA_BALA_SCORES: Record<TaraBalaLevel, number> = {
  janma: 0.45,
  sampat: 0.82,
  vipat: 0.22,
  kshema: 0.76,
  pratyari: 0.34,
  sadhaka: 0.88,
  naidhana: 0.12,
  mitra: 0.72,
  paramamitra: 0.93
};

export const DAILY_MODIFIER_THRESHOLDS: Record<TransitModifierLevel, number> = {
  low: 0.33,
  steady: 0.66,
  high: 1
};

export const DECISION_SCORE_THRESHOLDS = {
  favorable: 0.67,
  caution: 0.33
} as const;

export const TODAY_PLACEHOLDER_MODE = "stateless-placeholder" as const;
