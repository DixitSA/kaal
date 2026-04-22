import { z } from "zod";

import { errorResponseSchema } from "@/lib/schemas/output";

interface JsonRequestMessages {
  invalidJsonDetail: string;
  validationMessage: string;
}

type ApiErrorCode = "VALIDATION_ERROR" | "NOT_IMPLEMENTED" | "NOT_FOUND" | "INTERNAL_ERROR";

export function errorResponse(
  code: ApiErrorCode,
  status: number,
  message: string,
  details?: string[]
): Response {
  return Response.json(
    errorResponseSchema.parse({
      ok: false,
      error: {
        code,
        message,
        details
      }
    }),
    { status }
  );
}

export function validationError(message: string, details?: string[]): Response {
  return errorResponse("VALIDATION_ERROR", 400, message, details);
}

export function successResponse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  payload: z.input<TSchema>
): Response {
  return Response.json(schema.parse(payload));
}

export async function parseJsonRequest<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema,
  messages: JsonRequestMessages
): Promise<{ success: true; data: z.output<TSchema> } | { success: false; response: Response }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: validationError("Request body must be valid JSON.", [
        messages.invalidJsonDetail
      ])
    };
  }

  const parsedRequest = schema.safeParse(body);
  if (!parsedRequest.success) {
    return {
      success: false,
      response: validationError(
        messages.validationMessage,
        parsedRequest.error.issues.map((issue) => issue.message)
      )
    };
  }

  return {
    success: true,
    data: parsedRequest.data
  };
}
