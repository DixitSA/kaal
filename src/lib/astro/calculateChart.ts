import { DEFAULT_AYANAMSHA } from "@/lib/astro/constants";
import { getIsoDateInTimeZone } from "@/lib/astro/calculateJulianDay";
import {
  buildEqualHousePositions,
  calculateNakshatra,
  createPlanetPosition,
  getDegreeInSign,
  getSignIndex,
  getSignName
} from "@/lib/astro/calculateNakshatra";
import { calculateDasha } from "@/lib/astro/calculateDasha";
import { calculateTransits } from "@/lib/astro/calculateTransits";
import {
  isCombust,
  computeDignityScore,
  checkNeechaBhanga,
  getSignLord,
  getHouseFromLagna,
  type NeechaBhangaResult,
  type PlanetBasicPos,
} from "@/lib/astro/calculateDignity";
import { NAKSHATRA_NAMES } from "@/lib/astro/constants";
import type {
  AyanamshaKey,
  BirthInput,
  ChartPrimitives,
  PlanetKey,
  PlanetPosition,
} from "@/lib/types/astrology";
import { getBirthTimeMode } from "@/lib/types/astrology";

export interface ChartAssemblyInput {
  birth: BirthInput;
  ayanamsha: AyanamshaKey;
  julianDayUT: number;
  planetLongitudes: Record<PlanetKey, number>;
  /** Approximate daily longitudinal speed (°/day) for each planet */
  planetSpeeds?: Record<PlanetKey, number>;
  lagnaLongitude?: number;
  currentMoonLongitude: number;
  /** Today's sidereal planet longitudes for transit/intensity computation. */
  transitPlanetLongitudes?: Record<PlanetKey, number>;
  asOf: Date;
}

const PLANET_KEYS: PlanetKey[] = [
  "sun","moon","mercury","venus","mars","jupiter","saturn","rahu","ketu"
];

export function buildChartPrimitives({
  birth,
  ayanamsha = DEFAULT_AYANAMSHA,
  julianDayUT,
  planetLongitudes,
  planetSpeeds,
  lagnaLongitude,
  currentMoonLongitude,
  transitPlanetLongitudes,
  asOf
}: ChartAssemblyInput): ChartPrimitives {
  const birthTimeMode = getBirthTimeMode(birth);
  const houses = lagnaLongitude === undefined ? undefined : buildEqualHousePositions(lagnaLongitude);
  const moonPlacement = calculateNakshatra(planetLongitudes.moon);
  const lagnaSignIndex = lagnaLongitude !== undefined ? getSignIndex(lagnaLongitude) : undefined;
  const moonSignIndex = getSignIndex(planetLongitudes.moon);

  // ── Retrograde detection ─────────────────────────────────────────────────
  const isRetrograde: Record<PlanetKey, boolean> = {} as Record<PlanetKey, boolean>;
  for (const p of PLANET_KEYS) {
    if (p === "rahu" || p === "ketu") {
      isRetrograde[p] = true; // nodes always retrograde
    } else if (p === "sun" || p === "moon") {
      isRetrograde[p] = false; // never retrograde
    } else {
      const speed = planetSpeeds?.[p] ?? 0;
      isRetrograde[p] = speed < 0;
    }
  }

  // ── Basic positions needed for dignity context ────────────────────────────
  const basicPositions: Partial<Record<PlanetKey, PlanetBasicPos>> = {};
  for (const p of PLANET_KEYS) {
    const si = getSignIndex(planetLongitudes[p]);
    const house = lagnaSignIndex !== undefined
      ? getHouseFromLagna(si, lagnaSignIndex)
      : undefined;
    basicPositions[p] = { signIndex: si, house };
  }

  // ── Combustion ────────────────────────────────────────────────────────────
  const sunLon = planetLongitudes.sun;
  const combustMap: Record<PlanetKey, boolean> = {} as Record<PlanetKey, boolean>;
  for (const p of PLANET_KEYS) {
    combustMap[p] = isCombust(p, planetLongitudes[p], sunLon, isRetrograde[p]);
  }

  // ── Neecha bhanga ─────────────────────────────────────────────────────────
  const nbMap: Record<PlanetKey, NeechaBhangaResult> = {} as Record<PlanetKey, NeechaBhangaResult>;
  for (const p of PLANET_KEYS) {
    nbMap[p] = checkNeechaBhanga(
      p,
      getSignIndex(planetLongitudes[p]),
      isRetrograde[p],
      basicPositions,
      moonSignIndex
    );
  }

  // ── Dignity scores ────────────────────────────────────────────────────────
  const dignityMap: ReturnType<typeof computeDignityScore>[] = [];
  const dignityByPlanet: Record<PlanetKey, ReturnType<typeof computeDignityScore>> =
    {} as Record<PlanetKey, ReturnType<typeof computeDignityScore>>;
  for (const p of PLANET_KEYS) {
    const si = getSignIndex(planetLongitudes[p]);
    const deg = getDegreeInSign(planetLongitudes[p]);
    const d = computeDignityScore(p, si, deg, isRetrograde[p], combustMap[p], nbMap[p]);
    dignityByPlanet[p] = d;
    dignityMap.push(d);
  }

  // ── Assemble enhanced PlanetPosition ─────────────────────────────────────
  function buildPosition(p: PlanetKey): PlanetPosition {
    const base = createPlanetPosition(planetLongitudes[p], lagnaLongitude);
    const nak  = calculateNakshatra(planetLongitudes[p]);
    const dig  = dignityByPlanet[p];
    return {
      ...base,
      nakshatra:       NAKSHATRA_NAMES[nak.nakshatraIndex],
      nakshatraPada:   nak.pada,
      isRetrograde:    isRetrograde[p],
      isCombust:       combustMap[p],
      dignityScore:    dig.score,
      dignityPlacement: dig.placement,
      neechaBhanga:   dig.neechaBhanga,
    };
  }

  const moonPos = buildPosition("moon");
  const sunPos  = buildPosition("sun");

  return {
    ayanamsha,
    birthTimeMode,
    julianDayUT,
    lagnaSign: lagnaLongitude === undefined ? undefined : getSignName(lagnaLongitude),
    lagnaDegree: lagnaLongitude === undefined ? undefined : getDegreeInSign(lagnaLongitude),
    moonSign: moonPos.sign,
    moonDegree: moonPos.degree,
    moonNakshatra: moonPlacement.nakshatra,
    moonNakshatraPada: moonPlacement.pada,
    sunSignSidereal: sunPos.sign,
    planetPositions: {
      sun:     sunPos,
      moon:    moonPos,
      mars:    buildPosition("mars"),
      mercury: buildPosition("mercury"),
      jupiter: buildPosition("jupiter"),
      venus:   buildPosition("venus"),
      saturn:  buildPosition("saturn"),
      rahu:    buildPosition("rahu"),
      ketu:    buildPosition("ketu"),
    },
    houses,
    confidence: birthTimeMode === "time-unknown" ? "medium" : "high",
    dasha: calculateDasha(
      { birth, natalMoonLongitude: planetLongitudes.moon },
      asOf
    ),
    transit: calculateTransits({
      natalMoonLongitude: planetLongitudes.moon,
      currentMoonLongitude,
      transitPlanetLongitudes,
    }),
    computedAt: asOf.toISOString(),
    computedDate: getIsoDateInTimeZone(asOf, birth.timezone ?? "UTC"),
  };
}
