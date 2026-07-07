import { astrologyAdapter } from "@/lib/astro/adapter";
import { parseJsonRequest, successResponse, errorResponse } from "@/lib/api/routeHelpers";
import { chartComputeRequestSchema } from "@/lib/schemas/input";
import { chartResponseSchema } from "@/lib/schemas/output";
import { computeLimiter, checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(request: Request): Promise<Response> {
  const allowed = await checkRateLimit(computeLimiter, `chart-compute:${clientIp(request)}`);
  if (!allowed) {
    return errorResponse("RATE_LIMITED", 429, "Too many requests. Please try again later.");
  }

  const parsedRequest = await parseJsonRequest(request, chartComputeRequestSchema, {
    invalidJsonDetail: "The chart compute route accepts a JSON object.",
    validationMessage: "Birth input did not match the shared chart request schema."
  });
  if (!parsedRequest.success) {
    return parsedRequest.response;
  }

  try {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "chart computation failed";
    return errorResponse("INTERNAL_ERROR", 500, message);
  }
}
