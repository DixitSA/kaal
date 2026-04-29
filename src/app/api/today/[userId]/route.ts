import { TODAY_PLACEHOLDER_MODE } from "@/lib/astro/constants";
import { generateStatelessDailyState } from "@/lib/engine/dailyEngine";
import { successResponse, validationError, errorResponse } from "@/lib/api/routeHelpers";
import { todayPathParamsSchema } from "@/lib/schemas/input";
import { todayResponseSchema } from "@/lib/schemas/output";
import { toUtcMidnightIso } from "@/lib/utils/dates";

type TodayRouteContext = {
  params: Promise<{ userId: string }>;
};

function getUtcIsoDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function buildTodayPlaceholderData(userId: string, now: Date): {
  contractVersion: "1.0";
  userId: string;
  mode: typeof TODAY_PLACEHOLDER_MODE;
  generatedAt: string;
  daily: ReturnType<typeof generateStatelessDailyState>;
} {
  const referenceDate = getUtcIsoDate(now);

  return {
    contractVersion: "1.0",
    userId,
    mode: TODAY_PLACEHOLDER_MODE,
    generatedAt: toUtcMidnightIso(referenceDate),
    daily: generateStatelessDailyState(userId, referenceDate)
  };
}

export async function GET(_request: Request, context: TodayRouteContext): Promise<Response> {
  const parsedParams = todayPathParamsSchema.safeParse(await context.params);
  if (!parsedParams.success) {
    return validationError(
      "Route params did not match the shared today path schema.",
      parsedParams.error.issues.map((issue) => issue.message)
    );
  }

  const { userId } = parsedParams.data;

  // This route is intentionally stateless in v1 and normalizes against UTC day boundaries
  // so the placeholder contract remains reproducible across machines. Any future persistence
  // should sit behind a dedicated storage seam rather than changing the contract ad hoc here.
  try {
    return successResponse(todayResponseSchema, {
      ok: true,
      data: buildTodayPlaceholderData(userId, new Date())
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "today state generation failed";
    return errorResponse("INTERNAL_ERROR", 500, message);
  }
}
