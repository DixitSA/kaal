import type {
  AyanamshaKey,
  BirthInput,
  ChartPrimitives
} from "@/lib/types/astrology";
import { TODAY_PLACEHOLDER_MODE } from "@/lib/astro/constants";
import type {
  DailyState,
  DecisionCategory,
  DecisionEvaluation,
  IdentityProfile,
  PhaseProfile
} from "@/lib/types/engine";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_IMPLEMENTED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface ApiErrorEnvelope {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: string[];
  };
}

export interface ApiSuccessEnvelope<TData> {
  ok: true;
  data: TData;
}

export interface ChartComputeRequest {
  birth: BirthInput;
  options?: {
    ayanamsha?: AyanamshaKey;
  };
}

export interface ChartComputeSuccessData {
  contractVersion: "1.0";
  chart: ChartPrimitives;
}

export type ChartComputeResponse = ApiSuccessEnvelope<ChartComputeSuccessData>;

export interface ProfileGenerateRequest {
  chart: ChartPrimitives;
  seed?: string;
}

export interface ProfileGenerateSuccessData {
  contractVersion: "1.0";
  identity: IdentityProfile;
  phase: PhaseProfile;
}

export type ProfileGenerateResponse = ApiSuccessEnvelope<ProfileGenerateSuccessData>;

export interface DecisionEvaluateRequest {
  chart: ChartPrimitives;
  category: DecisionCategory;
  contextTag?: string;
}

export interface DecisionEvaluateSuccessData {
  contractVersion: "1.0";
  decision: DecisionEvaluation;
}

export type DecisionEvaluateResponse = ApiSuccessEnvelope<DecisionEvaluateSuccessData>;

export interface LocationLookupRequest {
  query: string;
  count?: number;
  language?: string;
  countryCode?: string;
}

export interface LocationLookupCandidate {
  id: number;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  countryCode?: string;
  admin1?: string;
  admin2?: string;
}

export interface LocationLookupSuccessData {
  contractVersion: "1.0";
  provider: "open-meteo";
  results: LocationLookupCandidate[];
}

export type LocationLookupResponse = ApiSuccessEnvelope<LocationLookupSuccessData>;

export interface TodayPathParams {
  userId: string;
}

export interface TodaySuccessData {
  contractVersion: "1.0";
  userId: string;
  mode: typeof TODAY_PLACEHOLDER_MODE;
  generatedAt: string;
  daily: DailyState;
}

export type TodayResponse = ApiSuccessEnvelope<TodaySuccessData>;

export interface ApiRouteContracts {
  "/api/chart/compute": {
    method: "POST";
    request: ChartComputeRequest;
    success: ChartComputeResponse;
    error: ApiErrorEnvelope;
  };
  "/api/profile/generate": {
    method: "POST";
    request: ProfileGenerateRequest;
    success: ProfileGenerateResponse;
    error: ApiErrorEnvelope;
  };
  "/api/decision/evaluate": {
    method: "POST";
    request: DecisionEvaluateRequest;
    success: DecisionEvaluateResponse;
    error: ApiErrorEnvelope;
  };
  "/api/location/lookup": {
    method: "POST";
    request: LocationLookupRequest;
    success: LocationLookupResponse;
    error: ApiErrorEnvelope;
  };
  "/api/today/[userId]": {
    method: "GET";
    params: TodayPathParams;
    success: TodayResponse;
    error: ApiErrorEnvelope;
  };
}
