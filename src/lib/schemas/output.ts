import { z } from "zod";

import { TODAY_PLACEHOLDER_MODE } from "@/lib/astro/constants";
import {
  DECISION_CATEGORIES,
  DECISION_DRIVER_KEYS,
  DECISION_OUTCOMES,
  ENERGY_LEVELS,
  FOCUS_KEYS,
  PHASE_INTENSITIES,
  PHASE_STATE_KEYS,
  RISK_BIASES,
  SUPPORT_BIASES
} from "@/lib/types/engine";
import { chartPrimitivesInputSchema } from "@/lib/schemas/input";

const contractVersionSchema = z.literal("1.0");

const successEnvelopeSchema = <TData extends z.ZodTypeAny>(dataSchema: TData) =>
  z.object({
    ok: z.literal(true),
    data: dataSchema
  });

export const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.enum([
      "VALIDATION_ERROR",
      "NOT_IMPLEMENTED",
      "NOT_FOUND",
      "INTERNAL_ERROR",
      "UNAUTHORIZED",
      "PAYWALL_REQUIRED",
      "RATE_LIMITED"
    ]),
    message: z.string().min(1),
    details: z.array(z.string().min(1)).optional()
  })
});

export const chartResponseSchema = successEnvelopeSchema(
  z.object({
    contractVersion: contractVersionSchema,
    chart: chartPrimitivesInputSchema
  })
);

const identityProfileSchema = z.object({
  archetype: z.string().min(1),
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)),
  watchouts: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
  core: z.string().min(1),
  emotionalLine: z.string().min(1),
  decisionLine: z.string().min(1),
  patternLine: z.string().min(1),
  challengeLine: z.string().min(1)
});

const phaseProfileSchema = z.object({
  label: z.string().min(1),
  summary: z.string().min(1),
  supportAction: z.string().min(1),
  cautionAction: z.string().min(1),
  confidence: z.number().min(0).max(1),
  stateKey: z.string(),  // MD×AD combination name (e.g., "ketu / venus")
  intensity: z.enum(PHASE_INTENSITIES),
  supportBias: z.enum(SUPPORT_BIASES),
  riskBias: z.enum(RISK_BIASES)
});

export const profileResponseSchema = successEnvelopeSchema(
  z.object({
    contractVersion: contractVersionSchema,
    identity: identityProfileSchema,
    phase: phaseProfileSchema
  })
);

const decisionSchema = z.object({
  category: z.enum(DECISION_CATEGORIES),
  outcome: z.enum(DECISION_OUTCOMES),
  score: z.number().min(0).max(1),
  guidance: z.string().min(1),
  rationale: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
  primaryDriver: z.enum(DECISION_DRIVER_KEYS),
  secondaryDriver: z.enum(DECISION_DRIVER_KEYS)
});

export const decisionResponseSchema = successEnvelopeSchema(
  z.object({
    contractVersion: contractVersionSchema,
    decision: decisionSchema
  })
);

const locationLookupCandidateSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  displayName: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1),
  country: z.string().min(1).optional(),
  countryCode: z.string().length(2).optional(),
  admin1: z.string().min(1).optional(),
  admin2: z.string().min(1).optional()
});

export const locationLookupResponseSchema = successEnvelopeSchema(
  z.object({
    contractVersion: contractVersionSchema,
    provider: z.literal("open-meteo"),
    results: z.array(locationLookupCandidateSchema)
  })
);

const dailyStateSchema = z.object({
  energy: z.enum(ENERGY_LEVELS),
  focusArea: z.string().min(1),
  guidance: z.string().min(1),
  caution: z.string().min(1),
  confidence: z.number().min(0).max(1),
  focusKey: z.enum(FOCUS_KEYS),
  signalTone: z.string().min(1),
  clarityLevel: z.enum(ENERGY_LEVELS),
  pressureLevel: z.enum(ENERGY_LEVELS)
});

export const todayResponseSchema = successEnvelopeSchema(
  z.object({
    contractVersion: contractVersionSchema,
    userId: z.string().min(1),
    mode: z.literal(TODAY_PLACEHOLDER_MODE),
    generatedAt: z.string().datetime(),
    daily: dailyStateSchema
  })
);

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;
export type ChartResponseSchema = z.infer<typeof chartResponseSchema>;
export type ProfileResponseSchema = z.infer<typeof profileResponseSchema>;
export type DecisionResponseSchema = z.infer<typeof decisionResponseSchema>;
export type LocationLookupResponseSchema = z.infer<typeof locationLookupResponseSchema>;
export type TodayResponseSchema = z.infer<typeof todayResponseSchema>;
