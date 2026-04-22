import { errorResponse, parseJsonRequest, successResponse } from "@/lib/api/routeHelpers";
import { lookupLocationCandidates } from "@/lib/geo/openMeteo";
import { GeocodingProviderError } from "@/lib/geo/provider";
import { locationLookupRequestSchema } from "@/lib/schemas/input";
import { locationLookupResponseSchema } from "@/lib/schemas/output";

export async function POST(request: Request): Promise<Response> {
  const parsedRequest = await parseJsonRequest(request, locationLookupRequestSchema, {
    invalidJsonDetail: "The location lookup route accepts a JSON object.",
    validationMessage: "Location lookup input did not match the shared lookup request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  try {
    const lookup = await lookupLocationCandidates(parsedRequest.data);

    return successResponse(locationLookupResponseSchema, {
      ok: true,
      data: {
        contractVersion: "1.0",
        provider: lookup.provider,
        results: lookup.results
      }
    });
  } catch (error) {
    if (error instanceof GeocodingProviderError) {
      return error.kind === "disabled"
        ? errorResponse("NOT_IMPLEMENTED", 501, error.message)
        : errorResponse("INTERNAL_ERROR", 502, error.message);
    }

    return errorResponse(
      "INTERNAL_ERROR",
      500,
      "Location lookup failed unexpectedly."
    );
  }
}
