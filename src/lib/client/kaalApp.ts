import { hashString } from "@/lib/utils/hash";
import type {
  ChartComputeResponse,
  LocationLookupCandidate,
  LocationLookupResponse
} from "@/lib/types/api";
import type { ChartPrimitives } from "@/lib/types/astrology";
import {
  computeIntensity,
  type IntensityResult,
  type TransitNatalContext,
} from "@/lib/astro/calculateIntensity";
import {
  DECISION_CATEGORIES,
  IDENTITY_ARCHETYPE_KEYS,
  type DecisionCategory,
  type DecisionEvaluation,
  type DailyState,
  type DecisionOutcome,
  type EnergyLevel,
  type FocusKey,
  type IdentityProfile,
  type PhaseIntensity,
  type PhaseProfile,
  type PhaseStateKey,
  type RiskBias,
  type SupportBias
} from "@/lib/types/engine";
import { deriveIdentityState, renderIdentityProfile, generateIdentityProfile } from "@/lib/engine/identityEngine";
import { generatePhaseProfile } from "@/lib/engine/phaseEngine";
import { generateDailyState } from "@/lib/engine/dailyEngine";
import { evaluateDecision } from "@/lib/engine/decisionEngine";

// ---------------------------------------------------------------------------
// Python backend response shapes
// ---------------------------------------------------------------------------

interface PythonPhaseData {
  name: string;
  summary: string;
  opportunity: string;
  risk: string;
}

interface PythonTodayData {
  signal: string;
  pressure: string;
  edge: string;
  caution: string;
}

interface PythonDecisionData {
  action: "ACT" | "WAIT" | "AVOID";
  reason: string;
  risk: string;
}

interface PythonPatternData {
  headline: string;
  traits: string[];
  failure: string;
  archetype: string;
}

interface PythonProfileResponse {
  phase: PythonPhaseData;
  today: PythonTodayData;
  decisions: Record<string, PythonDecisionData>;
  pattern: PythonPatternData;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface KaalIntake {
  name: string;
  dob: string;
  timeOfBirth: string;
  unknownTime: boolean;
  placeOfBirth: string;
  timezone: string;
  latitude: string;
  longitude: string;
}

export interface KaalSnapshot {
  userId: string;
  chart: ChartPrimitives;
  identity: IdentityProfile;
  phase: PhaseProfile;
  daily: DailyState;
  todayGeneratedAt: string;
  todayMode: string;
  decisions: Record<DecisionCategory, DecisionEvaluation>;
  /** Full intensity result (score, level, breakdown). Optional for backward compat. */
  intensity?: IntensityResult;
}

export interface LocationLookupResult {
  provider: "open-meteo";
  results: LocationLookupCandidate[];
}

type StageReporter = (message: string) => void;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PYTHON_API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_KAAL_API_URL) ||
  "http://127.0.0.1:8000";

interface ApiErrorPayload {
  ok: false;
  error: {
    message: string;
    details?: string[];
  };
}

function normalizeUserSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function parseCoordinate(label: string, value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }
  return parsed;
}

async function requestJson<TResponse>(
  input: RequestInfo,
  init?: RequestInit,
  timeoutMs = 35_000
): Promise<TResponse> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      let msg = `Request failed with status ${response.status}`;
      try {
        const errPayload = await response.json() as { detail?: string; error?: { message?: string; details?: string[] } };
        const asDetail = errPayload.detail;
        const asMsg = errPayload.error?.message;
        const asDetails = errPayload.error?.details?.join(" ") ?? "";
        msg = [asDetail ?? asMsg ?? msg, asDetails].filter(Boolean).join(" ");
      } catch {
        // non-JSON error body — keep the status-based message
      }
      throw new Error(msg);
    }

    return (await response.json()) as TResponse;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timerId);
  }
}

function mapAction(action: "ACT" | "WAIT" | "AVOID"): DecisionOutcome {
  if (action === "ACT") return "favorable";
  if (action === "AVOID") return "caution";
  return "neutral";
}

function deriveStateKey(phaseName: string): PhaseStateKey {
  const n = phaseName.toLowerCase();
  if (n.includes("stretch") || n.includes("visible") || n.includes("expand")) return "visible-stretch";
  if (n.includes("reset") || n.includes("recover") || n.includes("rest") || n.includes("sharpen")) return "reset-and-sharpen";
  if (n.includes("support") || n.includes("bond") || n.includes("connect")) return "support-and-bond";
  if (n.includes("adapt") || n.includes("reframe") || n.includes("shift") || n.includes("adjust")) return "adapt-and-reframe";
  return "steady-build";
}

function deriveIntensity(phase: PythonPhaseData): PhaseIntensity {
  const text = `${phase.risk} ${phase.summary}`.toLowerCase();
  if (text.includes("significant") || text.includes("strong") || text.includes("intense") || text.includes("major")) return "high";
  if (text.includes("low") || text.includes("mild") || text.includes("gentle") || text.includes("minor")) return "low";
  return "steady";
}

function deriveSupportBias(stateKey: PhaseStateKey): SupportBias {
  if (stateKey === "reset-and-sharpen") return "sharpen";
  if (stateKey === "support-and-bond" || stateKey === "adapt-and-reframe") return "pause";
  return "build";
}

function deriveRiskBias(riskText: string): RiskBias {
  const t = riskText.toLowerCase();
  if (t.includes("drift") || t.includes("passive") || t.includes("complacent") || t.includes("stagnate")) return "drift";
  if (t.includes("overexpose") || t.includes("scatter") || t.includes("spread") || t.includes("overcommit")) return "overexpose";
  return "force";
}

const SIGN_ORDER = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
] as const;

function buildTransitNatalContext(chart: ChartPrimitives): TransitNatalContext {
  const pp = chart.planetPositions;
  const tl = chart.transit.transitPlanetLongitudes;

  const transitMoonLon =
    tl?.moon ??
    (SIGN_ORDER.indexOf(chart.transit.currentMoonSign as (typeof SIGN_ORDER)[number]) * 30 +
      chart.transit.currentMoonDegree);

  const natalLagnaLon =
    chart.lagnaSign !== undefined && chart.lagnaDegree !== undefined
      ? SIGN_ORDER.indexOf(chart.lagnaSign as (typeof SIGN_ORDER)[number]) * 30 + chart.lagnaDegree
      : undefined;

  return {
    natalMoonLon:      pp.moon.absoluteLongitude,
    natalSunLon:       pp.sun.absoluteLongitude,
    natalLagnaLon,
    natalMarsLon:      pp.mars.absoluteLongitude,
    natalJupiterLon:   pp.jupiter.absoluteLongitude,
    transitSaturnLon:  tl?.saturn  ?? pp.saturn.absoluteLongitude,
    transitRahuLon:    tl?.rahu    ?? pp.rahu.absoluteLongitude,
    transitKetuLon:    tl?.ketu    ?? pp.ketu.absoluteLongitude,
    transitMarsLon:    tl?.mars    ?? pp.mars.absoluteLongitude,
    transitJupiterLon: tl?.jupiter ?? pp.jupiter.absoluteLongitude,
    transitMoonLon,
  };
}

function computeChartIntensity(chart: ChartPrimitives): IntensityResult {
  return computeIntensity(
    chart.dasha.mahadashaLord,
    chart.dasha.antardashaLord,
    buildTransitNatalContext(chart)
  );
}

function deriveEnergyLevel(text: string): EnergyLevel {
  const t = text.toLowerCase();
  if (t.includes("high") || t.includes("strong") || t.includes("active") || t.includes("momentum") || t.includes("favorable")) return "high";
  if (t.includes("low") || t.includes("tired") || t.includes("drain") || t.includes("weak") || t.includes("caution")) return "low";
  return "steady";
}

function deriveFocusKey(pressureText: string): FocusKey {
  const t = pressureText.toLowerCase();
  if (t.includes("execut") || t.includes("deliver") || t.includes("complet") || t.includes("finish")) return "execution";
  if (t.includes("maintain") || t.includes("sustain") || t.includes("keep") || t.includes("preserve")) return "maintenance";
  return "follow-through";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildUserId(intake: KaalIntake): string {
  const humanSegment =
    normalizeUserSegment(intake.name) ||
    normalizeUserSegment(intake.placeOfBirth) ||
    "user";
  const stableHash = hashString(
    `${intake.name}:${intake.dob}:${intake.placeOfBirth}:${intake.timezone}`
  )
    .toString(16)
    .slice(0, 8);

  return `${humanSegment}-${stableHash}`;
}

export function needsDailyRefresh(snapshot: KaalSnapshot | null): boolean {
  if (!snapshot) return true;
  return snapshot.todayGeneratedAt.slice(0, 10) !== new Date().toISOString().slice(0, 10);
}

export async function runProfilePipeline(
  intake: KaalIntake,
  reportStage?: StageReporter
): Promise<KaalSnapshot> {
  const userId = buildUserId(intake);
  const lat = parseCoordinate("Latitude", intake.latitude);
  const lng = parseCoordinate("Longitude", intake.longitude);

  const birth = {
    date: intake.dob,
    time: intake.unknownTime ? undefined : intake.timeOfBirth,
    timeUnknown: intake.unknownTime,
    timeKnown: !intake.unknownTime,
    timezone: intake.timezone,
    place: intake.placeOfBirth,
    latitude: lat,
    longitude: lng
  };

  // 1. Compute chart locally via Next.js adapter (pure TS, fast, no network)
  reportStage?.("computing your chart...");
  let chart: ChartPrimitives;
  try {
    const chartResponse = await requestJson<ChartComputeResponse>("/api/chart/compute", {
      method: "POST",
      body: JSON.stringify({ birth })
    });
    chart = chartResponse.data.chart;
  } catch (err) {
    const message = err instanceof Error ? err.message : "chart computation failed";
    throw new Error(`Failed to compute chart: ${message}`);
  }

  // 2. Try Python backend (AI narrative). Falls back to local TS engines if unavailable.
  reportStage?.("reading the stars...");
  const pythonPayload = {
    name: intake.name,
    dob: intake.dob,
    time_of_birth: intake.unknownTime ? "12:00" : (intake.timeOfBirth || "12:00"),
    unknown_time: intake.unknownTime,
    place_of_birth: intake.placeOfBirth,
    latitude: lat,
    longitude: lng,
    timezone: intake.timezone
  };

  let py: PythonProfileResponse | null = null;
  try {
    py = await requestJson<PythonProfileResponse>(
      "/api/python/profile",
      { method: "POST", body: JSON.stringify(pythonPayload) }
    );
  } catch {
    // Python backend unavailable — local deterministic engines will be used below
  }

  reportStage?.("building your profile...");

  // ── Local-engine fallback (no Python backend) ─────────────────────────────
  if (!py) {
    const identity = generateIdentityProfile(chart);
    const phase    = generatePhaseProfile(chart);
    const daily    = generateDailyState(chart);
    const decisions = {} as Record<DecisionCategory, DecisionEvaluation>;
    for (const category of DECISION_CATEGORIES) {
      decisions[category] = evaluateDecision(chart, category);
    }
    return {
      userId,
      chart,
      identity,
      phase,
      daily,
      todayGeneratedAt: new Date().toISOString(),
      todayMode: "local-ts",
      decisions,
      intensity: computeChartIntensity(chart),
    };
  }
  // ── Python path continues below ───────────────────────────────────────────

  // 3. Map Python response → KaalSnapshot

  const phaseStateKey = deriveStateKey(py.phase.name);
  const phaseSupportBias = deriveSupportBias(phaseStateKey);
  const phaseRiskBias = deriveRiskBias(py.phase.risk);
  const phase: PhaseProfile = {
    label: py.phase.name,
    summary: py.phase.summary,
    supportAction: py.phase.opportunity,
    cautionAction: py.phase.risk,
    confidence: 0.85,
    stateKey: phaseStateKey,
    intensity: deriveIntensity(py.phase),
    supportBias: phaseSupportBias,
    riskBias: phaseRiskBias,
    tags: [
      phaseStateKey.replace(/-/g, " "),
      `${phaseSupportBias} mode`,
      `avoid: ${phaseRiskBias}`,
    ],
  };

  const traits = py.pattern.traits;

  // Derive archetype deterministically from Moon Nakshatra — the Python/Gemini
  // response has no distribution constraint and defaults to "steward" for most
  // users. The local engine maps nakshatra → archetype via modulo-3 cycling,
  // giving an even spread across catalyst / steward / seeker. We keep all AI
  // narrative content (traits, headline, failure) but lock the archetype key to
  // the deterministic result. If the nakshatra is unavailable we fall back to
  // the Python value only when it is a recognised key.
  const localState = deriveIdentityState(chart);
  const localProfile = renderIdentityProfile(localState, chart);
  const pyArchetypeNorm = py.pattern.archetype.trim().toLowerCase();
  const resolvedArchetype =
    (IDENTITY_ARCHETYPE_KEYS as readonly string[]).includes(pyArchetypeNorm)
      ? localProfile.archetype               // always prefer deterministic
      : localProfile.archetype;              // deterministic as hard fallback too

  const identity: IdentityProfile = {
    archetype: resolvedArchetype,
    summary: py.pattern.headline,
    strengths: traits.slice(0, 2),
    watchouts: [py.pattern.failure],
    confidence: 0.85,
    core: py.pattern.headline,
    emotionalLine: traits[0] ?? "",
    decisionLine: traits[1] ?? "",
    patternLine: traits[2] ?? "",
    challengeLine: py.pattern.failure
  };

  const daily: DailyState = {
    signalTone: py.today.signal,
    focusArea: py.today.pressure,
    guidance: py.today.edge,
    caution: py.today.caution,
    energy: deriveEnergyLevel(py.today.signal),
    confidence: 0.8,
    focusKey: deriveFocusKey(py.today.pressure),
    clarityLevel: deriveEnergyLevel(py.today.edge),
    pressureLevel: deriveEnergyLevel(py.today.pressure)
  };

  const decisions = {} as Record<DecisionCategory, DecisionEvaluation>;
  for (const category of DECISION_CATEGORIES) {
    const d = py.decisions[category];
    if (d) {
      const outcome = mapAction(d.action);
      decisions[category] = {
        category,
        outcome,
        score: outcome === "favorable" ? 0.75 : outcome === "caution" ? 0.25 : 0.5,
        guidance: d.reason,
        rationale: [d.risk, d.reason],
        confidence: 0.8,
        primaryDriver: "clarity",
        secondaryDriver: "timing"
      };
    } else {
      // LLM returned wrong key — use neutral fallback so dashboard never gets undefined
      decisions[category] = {
        category,
        outcome: "neutral",
        score: 0.5,
        guidance: "act on what is clear, hold on what is not",
        rationale: ["timing unclear", "wait for more signal"],
        confidence: 0.5,
        primaryDriver: "clarity",
        secondaryDriver: "timing"
      };
    }
  }

  return {
    userId,
    chart,
    identity,
    phase,
    daily,
    todayGeneratedAt: new Date().toISOString(),
    todayMode: "python-groq",
    decisions,
    intensity: computeChartIntensity(chart),
  };
}

export async function lookupBirthPlace(
  query: string,
  countryCode?: string
): Promise<LocationLookupResult> {
  try {
    const response = await requestJson<LocationLookupResponse>("/api/location/lookup", {
      method: "POST",
      body: JSON.stringify({
        query,
        count: 5,
        language: "en",
        countryCode
      })
    });

    return {
      provider: response.data.provider,
      results: response.data.results
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "location lookup failed";
    throw new Error(`Failed to lookup location: ${message}`);
  }
}
