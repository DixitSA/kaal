import type { LocationLookupCandidate } from "@/lib/types/api";

export type GeocodingProvider = "open-meteo";

export interface LocationLookupQuery {
  query: string;
  count?: number;
  language?: string;
  countryCode?: string;
}

export interface GeocodingLookupResult {
  provider: GeocodingProvider;
  results: LocationLookupCandidate[];
}

export class GeocodingProviderError extends Error {
  constructor(
    message: string,
    readonly kind: "disabled" | "upstream"
  ) {
    super(message);
    this.name = "GeocodingProviderError";
  }
}
