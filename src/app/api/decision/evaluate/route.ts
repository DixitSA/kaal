import { evaluateDecision } from "@/lib/engine/decisionEngine";
import { parseJsonRequest, successResponse, errorResponse } from "@/lib/api/routeHelpers";
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

  try {
    return successResponse(decisionResponseSchema, {
      ok: true,
      data: {
        contractVersion: "1.0",
        decision: evaluateDecision(parsedRequest.data.chart, parsedRequest.data.category)
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "decision evaluation failed";
    return errorResponse("INTERNAL_ERROR", 500, message);
  }
}
