import { generateIdentityProfile } from "@/lib/engine/identityEngine";
import { generatePhaseProfile } from "@/lib/engine/phaseEngine";
import { parseJsonRequest, successResponse } from "@/lib/api/routeHelpers";
import { profileGenerateRequestSchema } from "@/lib/schemas/input";
import { profileResponseSchema } from "@/lib/schemas/output";

export async function POST(request: Request): Promise<Response> {
  const parsedRequest = await parseJsonRequest(request, profileGenerateRequestSchema, {
    invalidJsonDetail: "The profile route accepts a JSON object.",
    validationMessage: "Profile input did not match the shared profile request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  return successResponse(profileResponseSchema, {
    ok: true,
    data: {
      contractVersion: "1.0",
      identity: generateIdentityProfile(parsedRequest.data.chart, parsedRequest.data.seed),
      phase: generatePhaseProfile(parsedRequest.data.chart)
    }
  });
}
