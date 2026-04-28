import { DEFAULT_AYANAMSHA, J2000_JULIAN_DAY } from "@/lib/astro/constants";
import { buildChartPrimitives } from "@/lib/astro/calculateChart";
import {
  calculateJulianDay,
  getIsoDateInTimeZone,
  resolveBirthUtcDate
} from "@/lib/astro/calculateJulianDay";
import { normalizeLongitude } from "@/lib/astro/calculateNakshatra";
import {
  computeAstronomiaPositions,
  isAstronomiaAvailable,
} from "@/lib/astro/calculateAstronomia";
import type {
  AyanamshaKey,
  BirthInput,
  ChartPrimitives,
  PlanetKey,
  ResolvedBirthInput
} from "@/lib/types/astrology";
import { hasExactBirthTime } from "@/lib/types/astrology";

// Webpack bundler detection — short-circuit if not running in Node
const IS_NODE = typeof process !== "undefined" && process.release?.name === "node";

function getRequire() {
  if (!IS_NODE) return null;
  try { return (0, eval)("require"); }
  catch { return null; }
}

type ProviderEngine = "swisseph" | "astronomia" | "approximation-fallback";

interface SiderealState {
  provider: ProviderEngine;
  julianDayUT: number;
  planetLongitudes: Record<PlanetKey, number>;
  /** Approximate daily longitudinal speed (°/day); negative = retrograde */
  planetSpeeds: Record<PlanetKey, number>;
  lagnaLongitude?: number;
}

interface AdapterRuntimeStatus {
  provider: ProviderEngine;
  swissephAvailable: boolean;
  note: string;
}

interface MinimalSwissephModule {
  swe_julday?: unknown;
  swe_calc_ut?: unknown;
  swe_set_sid_mode?: unknown;
  swe_houses_ex?: unknown;
}

const SWISSEPH_MODULE_NAME = "swisseph";

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function centuriesSinceJ2000(julianDayUT: number): number {
  return (julianDayUT - J2000_JULIAN_DAY) / 36525;
}

function daysSinceJ2000(julianDayUT: number): number {
  return julianDayUT - J2000_JULIAN_DAY;
}

function normalizeAyanamsha(ayanamsha: AyanamshaKey): AyanamshaKey {
  if (ayanamsha !== "lahiri") {
    throw new Error(`Unsupported ayanamsha: ${ayanamsha}`);
  }

  return ayanamsha;
}

function resolveBirthInput(birth: BirthInput): ResolvedBirthInput {
  if (birth.latitude === undefined || birth.longitude === undefined || !birth.timezone) {
    throw new Error("Birth input must include latitude, longitude, and timezone");
  }

  return {
    date: birth.date,
    time: birth.time,
    timeKnown: hasExactBirthTime(birth),
    place: birth.place ?? "Unknown place",
    latitude: birth.latitude,
    longitude: birth.longitude,
    timezone: birth.timezone
  };
}

function tryLoadSwissephRuntime(): MinimalSwissephModule | null {
  const r = getRequire();
  if (!r) return null;
  try {
    const candidate = r(SWISSEPH_MODULE_NAME) as unknown;
    if (typeof candidate === "object" && candidate !== null) {
      return candidate as MinimalSwissephModule;
    }
  } catch {
    return null;
  }
  return null;
}
  } catch {
    return null;
  }

  return null;
}

function getRuntimeStatus(): AdapterRuntimeStatus {
  if (isAstronomiaAvailable()) {
    return {
      provider: "astronomia",
      swissephAvailable: false,
      note:
        "Using astronomia (VSOP87B/ELP) for high-accuracy ephemeris (±0.01° planets, ±0.1° Moon).",
    };
  }

  const runtime = tryLoadSwissephRuntime();
  const swissephAvailable =
    runtime !== null &&
    typeof runtime.swe_julday === "function" &&
    typeof runtime.swe_calc_ut === "function";

  if (swissephAvailable) {
    return {
      provider: "approximation-fallback",
      swissephAvailable: true,
      note:
        "Native swisseph runtime detected but not yet wired; falling back to approximation provider.",
    };
  }

  return {
    provider: "approximation-fallback",
    swissephAvailable: false,
    note:
      "No high-accuracy engine available; using deterministic approximation provider (±2-11° error).",
  };
}

function calculateLahiriAyanamsha(julianDayUT: number): number {
  const centuries = centuriesSinceJ2000(julianDayUT);
  return 23.85675 + 1.396042 * centuries + 0.000308 * centuries * centuries;
}

function tropicalToSidereal(tropicalLongitude: number, julianDayUT: number): number {
  return normalizeLongitude(tropicalLongitude - calculateLahiriAyanamsha(julianDayUT));
}

function approximateSunLongitude(julianDayUT: number): number {
  const centuries = centuriesSinceJ2000(julianDayUT);
  const meanLongitude = normalizeLongitude(280.46646 + 36000.76983 * centuries);
  const meanAnomaly = normalizeLongitude(357.52911 + 35999.05029 * centuries);
  const anomalyRadians = toRadians(meanAnomaly);
  const equationOfCenter =
    (1.914602 - 0.004817 * centuries) * Math.sin(anomalyRadians) +
    0.019993 * Math.sin(2 * anomalyRadians) +
    0.000289 * Math.sin(3 * anomalyRadians);

  return normalizeLongitude(meanLongitude + equationOfCenter);
}

function approximateMoonLongitude(julianDayUT: number): number {
  const days = daysSinceJ2000(julianDayUT);
  const meanLongitude = normalizeLongitude(218.316 + 13.176396 * days);
  const moonAnomaly = normalizeLongitude(134.963 + 13.064993 * days);
  const sunAnomaly = normalizeLongitude(357.529 + 0.98560028 * days);
  const elongation = normalizeLongitude(297.85 + 12.190749 * days);
  const latitudeArgument = normalizeLongitude(93.272 + 13.22935 * days);

  return normalizeLongitude(
    meanLongitude +
      6.289 * Math.sin(toRadians(moonAnomaly)) +
      1.274 * Math.sin(toRadians(2 * elongation - moonAnomaly)) +
      0.658 * Math.sin(toRadians(2 * elongation)) -
      0.186 * Math.sin(toRadians(sunAnomaly)) -
      0.114 * Math.sin(toRadians(2 * latitudeArgument))
  );
}

function approximateInnerPlanetLongitude(
  julianDayUT: number,
  baseLongitude: number,
  meanMotion: number,
  amplitude: number,
  phase: number
): number {
  const days = daysSinceJ2000(julianDayUT);
  const meanLongitude = normalizeLongitude(baseLongitude + meanMotion * days);
  return normalizeLongitude(
    meanLongitude + amplitude * Math.sin(toRadians(meanLongitude + phase))
  );
}

function approximateOuterPlanetLongitude(
  julianDayUT: number,
  baseLongitude: number,
  meanMotion: number,
  amplitude: number
): number {
  const days = daysSinceJ2000(julianDayUT);
  const meanLongitude = normalizeLongitude(baseLongitude + meanMotion * days);
  return normalizeLongitude(meanLongitude + amplitude * Math.sin(toRadians(meanLongitude)));
}

function approximateNodeLongitude(julianDayUT: number): number {
  const days = daysSinceJ2000(julianDayUT);
  return normalizeLongitude(125.04452 - 0.0529539 * days);
}

function approximateAscendantLongitude(
  julianDayUT: number,
  latitude: number,
  longitude: number
): number {
  const centuries = centuriesSinceJ2000(julianDayUT);
  const gmst =
    280.46061837 +
    360.98564736629 * (julianDayUT - J2000_JULIAN_DAY) +
    0.000387933 * centuries * centuries -
    (centuries * centuries * centuries) / 38710000;
  const localSiderealTime = normalizeLongitude(gmst + longitude);
  const obliquity = 23.439291 - 0.0130042 * centuries;

  const ascendantRadians = Math.atan2(
    -Math.cos(toRadians(localSiderealTime)),
    Math.sin(toRadians(obliquity)) * Math.tan(toRadians(latitude)) +
      Math.cos(toRadians(obliquity)) * Math.sin(toRadians(localSiderealTime))
  );

  return normalizeLongitude(toDegrees(ascendantRadians));
}

function computeTropicalLongitudes(julianDayUT: number): Record<PlanetKey, number> {
  const rahuTropical = approximateNodeLongitude(julianDayUT);
  return {
    sun:     approximateSunLongitude(julianDayUT),
    moon:    approximateMoonLongitude(julianDayUT),
    mercury: approximateInnerPlanetLongitude(julianDayUT, 252.25084, 4.09233445, 7.5, 15),
    venus:   approximateInnerPlanetLongitude(julianDayUT, 181.97973, 1.60213034, 5.5, 75),
    mars:    approximateOuterPlanetLongitude(julianDayUT, 355.433, 0.52402068, 10),
    jupiter: approximateOuterPlanetLongitude(julianDayUT, 34.351, 0.083091, 4.5),
    saturn:  approximateOuterPlanetLongitude(julianDayUT, 50.077, 0.0334597, 3.5),
    rahu:    rahuTropical,
    ketu:    normalizeLongitude(rahuTropical + 180),
  };
}

/**
 * Compute approximate daily longitudinal speed (degrees per day) for each planet.
 * Positive = direct motion, Negative = retrograde.
 * Nodes (Rahu/Ketu) are always retrograde by definition (mean node).
 */
function computePlanetSpeeds(julianDayUT: number): Record<PlanetKey, number> {
  const delta = 0.5; // half-day step for central difference
  const before = computeTropicalLongitudes(julianDayUT - delta);
  const after  = computeTropicalLongitudes(julianDayUT + delta);

  const speeds: Partial<Record<PlanetKey, number>> = {};
  const planets: PlanetKey[] = ["sun","moon","mercury","venus","mars","jupiter","saturn","rahu","ketu"];
  for (const p of planets) {
    if (p === "rahu" || p === "ketu") {
      speeds[p] = -0.053; // mean node always retrograde
    } else {
      let diff = after[p] - before[p];
      // unwrap crossing 0°/360°
      if (diff > 180)  diff -= 360;
      if (diff < -180) diff += 360;
      speeds[p] = diff; // per full day (2×delta = 1 day)
    }
  }
  return speeds as Record<PlanetKey, number>;
}

function computeSiderealState(
  birth: ResolvedBirthInput,
  ayanamsha: AyanamshaKey
): SiderealState {
  normalizeAyanamsha(ayanamsha);

  const julianDayUT = calculateJulianDay(birth.date, birth.time, birth.timezone);
  const lagnaTropical = approximateAscendantLongitude(julianDayUT, birth.latitude, birth.longitude);

  // ── High-accuracy path: astronomia (VSOP87B + ELP) ──────────────────────────
  const astro = computeAstronomiaPositions(julianDayUT);
  if (astro.available) {
    return {
      provider: "astronomia",
      julianDayUT,
      planetLongitudes: astro.longitudes,
      planetSpeeds: astro.speeds,
      lagnaLongitude: birth.timeKnown
        ? tropicalToSidereal(lagnaTropical, julianDayUT)
        : undefined,
    };
  }

  // ── Fallback: polynomial approximation (±2-11° error) ───────────────────────
  const tropical = computeTropicalLongitudes(julianDayUT);
  const speeds   = computePlanetSpeeds(julianDayUT);

  const sidereal: Record<PlanetKey, number> = {} as Record<PlanetKey, number>;
  const planets: PlanetKey[] = ["sun","moon","mercury","venus","mars","jupiter","saturn","rahu","ketu"];
  for (const p of planets) {
    sidereal[p] = tropicalToSidereal(tropical[p], julianDayUT);
  }

  return {
    provider: "approximation-fallback",
    julianDayUT,
    planetLongitudes: sidereal,
    planetSpeeds: speeds,
    lagnaLongitude: birth.timeKnown
      ? tropicalToSidereal(lagnaTropical, julianDayUT)
      : undefined,
  };
}

function computeCurrentMoonLongitude(asOf: Date, ayanamsha: AyanamshaKey): number {
  normalizeAyanamsha(ayanamsha);
  const julianDayUT = J2000_JULIAN_DAY + (asOf.getTime() / 86400000 + 2440587.5 - J2000_JULIAN_DAY);
  return tropicalToSidereal(approximateMoonLongitude(julianDayUT), julianDayUT);
}

function normalizeAsOf(asOf: Date, timezone: string): Date {
  const localDate = getIsoDateInTimeZone(asOf, timezone);
  return resolveBirthUtcDate(localDate, "00:00", timezone);
}

export interface AstrologyAdapter {
  name: "sidereal-astrology-adapter";
  computeProvider: ProviderEngine;
  nativeEngineTarget: "swisseph";
  getRuntimeStatus: () => AdapterRuntimeStatus;
  computeSiderealState: (birth: BirthInput, ayanamsha?: AyanamshaKey) => SiderealState;
  computeChart: (birth: BirthInput, ayanamsha?: AyanamshaKey, asOf?: Date) => ChartPrimitives;
}

export const astrologyAdapter: AstrologyAdapter = {
  name: "sidereal-astrology-adapter",
  computeProvider: isAstronomiaAvailable() ? "astronomia" : "approximation-fallback",
  nativeEngineTarget: "swisseph",
  getRuntimeStatus,
  computeSiderealState(birth, ayanamsha = DEFAULT_AYANAMSHA) {
    const resolvedBirth = resolveBirthInput(birth);
    return computeSiderealState(resolvedBirth, ayanamsha);
  },
  computeChart(birth, ayanamsha = DEFAULT_AYANAMSHA, asOf = new Date()) {
    const timezone = birth.timezone ?? "UTC";
    // Future native-provider work should stay behind the adapter seam while preserving
    // the local-day normalization contract already proven by the current verification suite.
    const normalizedAsOf = normalizeAsOf(asOf, timezone);
    const siderealState = this.computeSiderealState(birth, ayanamsha);

    // Compute today's transit planet positions (for intensity scoring).
    // Julian Day for the normalized query date:
    const transitJD = normalizedAsOf.getTime() / 86400000 + 2440587.5;
    const transitAstro = computeAstronomiaPositions(transitJD);
    const transitLongitudes = transitAstro.available ? transitAstro.longitudes : undefined;
    // Use transit Moon from astronomia when available; fall back to approximation.
    const currentMoonLon = transitLongitudes?.moon
      ?? computeCurrentMoonLongitude(normalizedAsOf, ayanamsha);

    return buildChartPrimitives({
      birth,
      ayanamsha,
      julianDayUT: siderealState.julianDayUT,
      planetLongitudes: siderealState.planetLongitudes,
      planetSpeeds: siderealState.planetSpeeds,
      lagnaLongitude: siderealState.lagnaLongitude,
      currentMoonLongitude: currentMoonLon,
      transitPlanetLongitudes: transitLongitudes,
      asOf: normalizedAsOf
    });
  }
};
