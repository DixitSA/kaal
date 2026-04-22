import { evaluateDecision } from "@/lib/engine/decisionEngine";
import { parseJsonRequest, successResponse } from "@/lib/api/routeHelpers";
import { decisionEvaluateRequestSchema } from "@/lib/schemas/input";
import { decisionResponseSchema } from "@/lib/schemas/output";

export async function POST(request: Request): Promise<Response> {
  const parsedRequest = await parseJsonRequest(request, decisionEvaluateRequestSchema, {
    invalidJsonDetail: "The decision route accepts a JSON object.",
    validationMessage: "Decision input did not match the shared decision request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  return successResponse(decisionResponseSchema, {
    ok: true,
    data: {
      contractVersion: "1.0",
      decision: evaluateDecision(parsedRequest.data.chart, parsedRequest.data.category)
    }
  });
}
