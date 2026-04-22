import { astrologyAdapter } from "@/lib/astro/adapter";
import { parseJsonRequest, successResponse } from "@/lib/api/routeHelpers";
import { chartComputeRequestSchema } from "@/lib/schemas/input";
import { chartResponseSchema } from "@/lib/schemas/output";

export async function POST(request: Request): Promise<Response> {
  const parsedRequest = await parseJsonRequest(request, chartComputeRequestSchema, {
    invalidJsonDetail: "The chart compute route accepts a JSON object.",
    validationMessage: "Birth input did not match the shared chart request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  const chart = astrologyAdapter.computeChart(
    parsedRequest.data.birth,
    parsedRequest.data.options?.ayanamsha
  );

  return successResponse(chartResponseSchema, {
    ok: true,
    data: {
      contractVersion: "1.0",
      chart
    }
  });
}
