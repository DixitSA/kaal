/**
 * Server-side proxy to the Python/FastAPI backend.
 * The browser calls this Next.js route (same origin = no CORS).
 * This route forwards the request to Python server-side (server-to-server = no CORS).
 */

const PYTHON_API_URL =
  process.env.KAAL_API_URL ?? // server-side env (no NEXT_PUBLIC_ prefix needed)
  process.env.NEXT_PUBLIC_KAAL_API_URL ??
  "http://127.0.0.1:8000";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    try {
      const pythonResponse = await fetch(`${PYTHON_API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(40_000),
      });

      if (!pythonResponse.ok) {
        const errorDetail = await pythonResponse.text();
        return Response.json(
          { detail: `Python backend error: ${errorDetail}` },
          { status: pythonResponse.status }
        );
      }

      const data = await pythonResponse.json();
      return Response.json(data, { status: 200 });
    } catch (fetchErr) {
      if (fetchErr instanceof Error && fetchErr.name === "TimeoutError") {
        return Response.json({ detail: "Python backend timed out" }, { status: 504 });
      }
      throw fetchErr;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Python backend unreachable";
    return Response.json({ detail: message }, { status: 502 });
  }
}
