import type { LocationLookupCandidate } from "@/lib/types/api";
import {
  GeocodingProviderError,
  type GeocodingLookupResult,
  type LocationLookupQuery
} from "@/lib/geo/provider";

const OPEN_METEO_PROVIDER = "open-meteo" as const;
const DEFAULT_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
}

interface OpenMeteoResponse {
  results?: OpenMeteoResult[];
}

function buildDisplayName(result: OpenMeteoResult): string {
  return [result.name, result.admin1, result.country]
    .filter((segment): segment is string => Boolean(segment))
    .join(", ");
}

function mapResult(result: OpenMeteoResult): LocationLookupCandidate | null {
  if (!result.timezone) {
    return null;
  }

  return {
    id: result.id,
    name: result.name,
    displayName: buildDisplayName(result),
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    country: result.country,
    countryCode: result.country_code,
    admin1: result.admin1,
    admin2: result.admin2
  };
}

export async function lookupLocationCandidates(
  request: LocationLookupQuery,
  fetchImpl: typeof fetch = fetch
): Promise<GeocodingLookupResult> {
  if (process.env.KAAL_DISABLE_REMOTE_GEOCODING === "true") {
    throw new GeocodingProviderError(
      "Remote geocoding is disabled in this environment.",
      "disabled"
    );
  }

  const baseUrl = process.env.KAAL_GEOCODING_BASE_URL ?? DEFAULT_BASE_URL;
  const params = new URLSearchParams({
    name: request.query,
    count: String(request.count ?? 5),
    language: request.language ?? "en",
    format: "json"
  });

  if (request.countryCode) {
    params.set("countryCode", request.countryCode.toLowerCase());
  }

  let response: Response;

  try {
    response = await fetchImpl(`${baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });
  } catch {
    throw new GeocodingProviderError(
      "The upstream geocoding provider could not be reached.",
      "upstream"
    );
  }

  if (!response.ok) {
    throw new GeocodingProviderError(
      `The upstream geocoding provider returned ${response.status}.`,
      "upstream"
    );
  }

  const payload = (await response.json()) as OpenMeteoResponse;
  const results = (payload.results ?? [])
    .map(mapResult)
    .filter((candidate): candidate is LocationLookupCandidate => candidate !== null);

  return {
    provider: OPEN_METEO_PROVIDER,
    results
  };
}
