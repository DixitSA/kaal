import { z } from "zod";

import {
  AYANAMSHA_KEYS,
  BIRTH_TIME_MODES,
  CHART_CONFIDENCE_LEVELS,
  PLANET_KEYS,
  TARA_BALA_LEVELS,
  TRANSIT_MODIFIER_LEVELS
} from "@/lib/types/astrology";
import { DECISION_CATEGORIES } from "@/lib/types/engine";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const twentyFourHourTimePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function isRealCalendarDate(value: string): boolean {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const [yearString, monthString, dayString] = value.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const candidate = new Date(Date.UTC(0, month - 1, day));
  candidate.setUTCFullYear(year);

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

export const birthInputSchema = z
  .object({
    date: z.string().regex(isoDatePattern, "date must use YYYY-MM-DD"),
    time: z.string().regex(twentyFourHourTimePattern, "time must use HH:mm").optional(),
    timeKnown: z.boolean().optional(),
    timezone: z.string().min(1).max(80),
    place: z.string().min(1).max(120).optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    timeUnknown: z.boolean().optional().default(false)
  })
  .superRefine((value, ctx) => {
    if (
      value.timeKnown !== undefined &&
      value.timeUnknown !== undefined &&
      value.timeKnown === value.timeUnknown
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timeKnown and timeUnknown cannot agree; choose one time mode",
        path: ["timeKnown"]
      });
    }

    const exactTimeKnown = value.timeKnown ?? !value.timeUnknown;

    if (!isRealCalendarDate(value.date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "date must be a real calendar date",
        path: ["date"]
      });
    }

    if (!isValidTimeZone(value.timezone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timezone must be a valid IANA timezone",
        path: ["timezone"]
      });
    }

    if (exactTimeKnown && !value.time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "time is required when timeUnknown is false",
        path: ["time"]
      });
    }

    if (!exactTimeKnown && value.time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "time must be omitted when timeUnknown is true",
        path: ["time"]
      });
    }
  })
  .transform((value) => {
    const timeKnown = value.timeKnown ?? !value.timeUnknown;

    return {
      ...value,
      timeKnown,
      timeUnknown: !timeKnown
    };
  });

const planetPositionSchema = z.object({
  sign: z.string().min(1),
  degree: z.number().min(0).max(30),
  absoluteLongitude: z.number().min(0).max(360),
  house: z.number().int().min(1).max(12).optional()
});

const dashaSchema = z.object({
  mahadashaLord: z.enum(PLANET_KEYS),
  mahadashaStartedAt: z.string().datetime(),
  mahadashaEndsAt: z.string().datetime(),
  antardashaLord: z.enum(PLANET_KEYS),
  antardashaStartedAt: z.string().datetime(),
  antardashaEndsAt: z.string().datetime(),
  confidence: z.enum(CHART_CONFIDENCE_LEVELS)
});

export const chartPrimitivesInputSchema = z.object({
  ayanamsha: z.enum(AYANAMSHA_KEYS),
  birthTimeMode: z.enum(BIRTH_TIME_MODES),
  julianDayUT: z.number(),
  lagnaSign: z.string().min(1).optional(),
  lagnaDegree: z.number().min(0).max(30).optional(),
  moonSign: z.string().min(1),
  moonDegree: z.number().min(0).max(30),
  moonNakshatra: z.string().min(1),
  moonNakshatraPada: z.number().int().min(1).max(4),
  sunSignSidereal: z.string().min(1),
  planetPositions: z.object({
    sun: planetPositionSchema,
    moon: planetPositionSchema,
    mars: planetPositionSchema,
    mercury: planetPositionSchema,
    jupiter: planetPositionSchema,
    venus: planetPositionSchema,
    saturn: planetPositionSchema,
    rahu: planetPositionSchema,
    ketu: planetPositionSchema
  }),
  houses: z
    .array(
      z.object({
        house: z.number().int().min(1).max(12),
        sign: z.string().min(1),
        startDegree: z.number().min(0).max(30)
      })
    )
    .optional(),
  confidence: z.enum(CHART_CONFIDENCE_LEVELS),
  dasha: dashaSchema,
  transit: z.object({
    currentMoonSign: z.string().min(1),
    currentMoonDegree: z.number().min(0).max(30),
    currentMoonNakshatra: z.string().min(1),
    currentMoonNakshatraPada: z.number().int().min(1).max(4),
    taraBala: z.object({
      offset: z.number().int().min(1).max(27),
      level: z.enum(TARA_BALA_LEVELS),
      score: z.number().min(0).max(1)
    }),
    supportLevel: z.enum(TRANSIT_MODIFIER_LEVELS),
    pressureLevel: z.enum(TRANSIT_MODIFIER_LEVELS),
    clarityLevel: z.enum(TRANSIT_MODIFIER_LEVELS)
  }),
  computedAt: z.string().datetime(),
  computedDate: z.string().regex(isoDatePattern, "computedDate must use YYYY-MM-DD")
});

export const chartComputeRequestSchema = z.object({
  birth: birthInputSchema,
  options: z
    .object({
      ayanamsha: z.enum(AYANAMSHA_KEYS).default("lahiri")
    })
    .optional()
});

export const profileGenerateRequestSchema = z.object({
  chart: chartPrimitivesInputSchema,
  seed: z.string().min(1).max(128).optional()
});

export const decisionEvaluateRequestSchema = z.object({
  chart: chartPrimitivesInputSchema,
  category: z.enum(DECISION_CATEGORIES),
  contextTag: z.string().min(1).max(120).optional()
});

export const locationLookupRequestSchema = z.object({
  query: z.string().trim().min(2).max(160),
  count: z.number().int().min(1).max(10).optional().default(5),
  language: z
    .string()
    .trim()
    .min(2)
    .max(16)
    .regex(/^[A-Za-z-]+$/, "language must be a valid locale fragment")
    .optional()
    .default("en"),
  countryCode: z
    .string()
    .trim()
    .length(2)
    .regex(/^[A-Za-z]{2}$/, "countryCode must be a 2-letter ISO code")
    .transform((value) => value.toUpperCase())
    .optional()
});

export const todayPathParamsSchema = z.object({
  userId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "userId must contain only URL-safe characters")
});

export type BirthInputSchema = z.infer<typeof birthInputSchema>;
export type ChartComputeRequestSchema = z.infer<typeof chartComputeRequestSchema>;
export type ProfileGenerateRequestSchema = z.infer<typeof profileGenerateRequestSchema>;
export type DecisionEvaluateRequestSchema = z.infer<typeof decisionEvaluateRequestSchema>;
export type LocationLookupRequestSchema = z.infer<typeof locationLookupRequestSchema>;
export type TodayPathParamsSchema = z.infer<typeof todayPathParamsSchema>;
