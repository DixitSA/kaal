/**
 * calculateAstronomia.ts
 * High-accuracy ephemeris using the `astronomia` library (Meeus/VSOP87B/ELP).
 * Accuracy: Sun/planets ±0.01°, Moon ±0.1°, vs. approximation ±2-11°.
 *
 * Used by adapter.ts when astronomia is installed (pure-JS, no native build).
 * Falls back to approximation engine when the import fails.
 *
 * NOTE: This file must never be bundled for the client. All `astronomia` imports
 * are hidden behind runtime checks so webpack skips them at build time.
 */

import { J2000_JULIAN_DAY } from "@/lib/astro/constants";
import { normalizeLongitude } from "@/lib/astro/calculateNakshatra";
import type { PlanetKey } from "@/lib/types/astrology";

// ── Lazy-loaded astronomia modules ────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

// Webpack bundler detection — short-circuit if not running in Node
const IS_NODE = typeof process !== "undefined" && process.release?.name === "node";

function getNodeRequire(): NodeRequire | null {
  if (!IS_NODE) return null;
  try { return eval("require") as NodeRequire; }
  catch { return null; }
}

function loadAstronomia(): any | null {
  const r = getNodeRequire();
  if (!r) return null;
  try { return r("astronomia"); }
  catch { return null; }
}

function loadVsop(planet: string): any | null {
  const r = getNodeRequire();
  if (!r) return null;
  try {
    const mod = r(`astronomia/data/vsop87B${planet}`);
    return (mod as any).default ?? mod;
  } catch { return null; }
}

// ── Conversion helpers ────────────────────────────────────────────────────────

function toRad(deg: number): number { return deg * Math.PI / 180; }
function toDeg(rad: number): number { return rad * 180 / Math.PI; }

function centuriesFromJ2000(jd: number): number {
  return (jd - J2000_JULIAN_DAY) / 36525;
}

/** Compute mean obliquity of the ecliptic (degrees) */
function obliquityDeg(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
}

/** Compute Lahiri (Chitrapaksha) ayanamsha in degrees */
function lahiriAyanamsha(T: number): number {
  return 23.85675 + 1.396042 * T + 0.000308 * T * T;
}

/** Convert equatorial (RA, Dec) in radians to tropical ecliptic longitude in degrees */
function equatorialToEclipticLon(ra: number, dec: number, epsRad: number): number {
  const lon = Math.atan2(
    Math.sin(ra) * Math.cos(epsRad) + Math.tan(dec) * Math.sin(epsRad),
    Math.cos(ra)
  );
  return normalizeLongitude(toDeg(lon));
}

/** Convert heliocentric ecliptic (lon, lat, r) to Cartesian (radians, radians, AU) */
function helioToCart(lon: number, lat: number, r: number): [number, number, number] {
  return [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.cos(lat) * Math.sin(lon),
    r * Math.sin(lat),
  ];
}

/** Convert geocentric Cartesian to tropical ecliptic longitude (degrees) */
function cartToGeocentricLon(x: number, y: number): number {
  return normalizeLongitude(toDeg(Math.atan2(y, x)));
}

/** Apply Lahiri ayanamsha to get sidereal longitude */
function toSidereal(tropicalDeg: number, T: number): number {
  return normalizeLongitude(tropicalDeg - lahiriAyanamsha(T));
}

// ── Core computation ─────────────────────────────────────────────────────────

export interface AstronomiaPositions {
  /** Sidereal ecliptic longitudes in degrees (Lahiri) */
  longitudes: Record<PlanetKey, number>;
  /** Daily longitudinal speeds in degrees/day (negative = retrograde) */
  speeds: Record<PlanetKey, number>;
  /** Available if astronomia loaded successfully */
  available: boolean;
}

function computeSingleJd(
  jd: number,
  astro: any,
  vsopData: Record<string, any>,
  vsopEarth: any,
): Record<PlanetKey, number> {
  const T = centuriesFromJ2000(jd);
  const eps = toRad(obliquityDeg(T));

  // Earth heliocentric position (for geocentric conversion)
  const earthPlanet = new astro.planetposition.Planet(vsopEarth);
  const earthH = earthPlanet.position(jd);
  const [ex, ey, ez] = helioToCart(earthH.lon, earthH.lat, earthH.range);

  // ── Sun (geocentric ecliptic via apparentLongitude) ─────────────────────────
  const sunTropical = normalizeLongitude(toDeg(astro.solar.apparentLongitude(T)));
  const sunSidereal = toSidereal(sunTropical, T);

  // ── Moon (equatorial → ecliptic) ────────────────────────────────────────────
  const moonEq = astro.moonposition.position(jd);
  const moonTropical = equatorialToEclipticLon(moonEq._ra, moonEq._dec, eps);
  const moonSidereal = toSidereal(moonTropical, T);

  // ── Geocentric inner/outer planets (VSOP87B heliocentric → geocentric) ──────
  function planetSidereal(vsop: any): number {
    const pl = new astro.planetposition.Planet(vsop);
    const h  = pl.position(jd);
    const [px, py] = helioToCart(h.lon, h.lat, h.range);
    const tropical = cartToGeocentricLon(px - ex, py - ey);
    return toSidereal(tropical, T);
  }

  // ── Mean lunar node (Rahu) ───────────────────────────────────────────────────
  // astronomia moonposition.node returns mean node longitude in radians
  const rahuNodeRad = astro.moonposition.node(jd);
  const rahuTropical = normalizeLongitude(toDeg(rahuNodeRad));
  const rahuSidereal = toSidereal(rahuTropical, T);
  const ketuSidereal = normalizeLongitude(rahuSidereal + 180);

  return {
    sun:     sunSidereal,
    moon:    moonSidereal,
    mercury: planetSidereal(vsopData.mercury),
    venus:   planetSidereal(vsopData.venus),
    mars:    planetSidereal(vsopData.mars),
    jupiter: planetSidereal(vsopData.jupiter),
    saturn:  planetSidereal(vsopData.saturn),
    rahu:    rahuSidereal,
    ketu:    ketuSidereal,
  };
}

export function computeAstronomiaPositions(jd: number): AstronomiaPositions {
  const astro = loadAstronomia();
  if (!astro) {
    return { longitudes: {} as Record<PlanetKey, number>, speeds: {} as Record<PlanetKey, number>, available: false };
  }

  // Load VSOP87B data
  const vsopEarth = loadVsop("earth");
  const vsopData = {
    mercury: loadVsop("mercury"),
    venus:   loadVsop("venus"),
    mars:    loadVsop("mars"),
    jupiter: loadVsop("jupiter"),
    saturn:  loadVsop("saturn"),
  };

  if (!vsopEarth || Object.values(vsopData).some(v => !v)) {
    return { longitudes: {} as Record<PlanetKey, number>, speeds: {} as Record<PlanetKey, number>, available: false };
  }

  try {
    // Compute positions at JD
    const lons = computeSingleJd(jd, astro, vsopData, vsopEarth);

    // Compute speeds via central difference (±0.5 day)
    const delta = 0.5;
    const before = computeSingleJd(jd - delta, astro, vsopData, vsopEarth);
    const after  = computeSingleJd(jd + delta, astro, vsopData, vsopEarth);

    const planets: PlanetKey[] = ["sun","moon","mercury","venus","mars","jupiter","saturn","rahu","ketu"];
    const speeds: Partial<Record<PlanetKey, number>> = {};
    for (const p of planets) {
      if (p === "rahu" || p === "ketu") {
        speeds[p] = -0.053; // mean node always retrograde
      } else {
        let diff = after[p] - before[p];
        if (diff > 180)  diff -= 360;
        if (diff < -180) diff += 360;
        speeds[p] = diff; // per full day (2×delta = 1 day)
      }
    }

    return {
      longitudes: lons,
      speeds: speeds as Record<PlanetKey, number>,
      available: true,
    };
  } catch {
    return { longitudes: {} as Record<PlanetKey, number>, speeds: {} as Record<PlanetKey, number>, available: false };
  }
}

/** Quick availability check — no computation */
export function isAstronomiaAvailable(): boolean {
  const astro = loadAstronomia();
  if (!astro) return false;
  const earth = loadVsop("earth");
  return earth !== null;
}
