import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as getToday } from "@/app/api/today/[userId]/route";
import { generateStatelessDailyState } from "@/lib/engine/dailyEngine";
import { todayResponseSchema } from "@/lib/schemas/output";

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /api/today/[userId]", () => {
  it("returns an explicit stateless placeholder contract", async () => {
    const response = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });
    const payload = todayResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      data: {
        contractVersion: "1.0",
        userId: "demo-user",
        mode: "stateless-placeholder",
        daily: {
          focusArea: expect.any(String),
          focusKey: expect.any(String)
        }
      }
    });
    expect(payload.data.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });

  it("stays deterministic for the same user within the same UTC day", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-07T00:05:00.000Z"));

    const first = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });

    vi.setSystemTime(new Date("2026-04-07T23:55:00.000Z"));

    const second = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });

    expect(todayResponseSchema.parse(await first.json())).toEqual(
      todayResponseSchema.parse(await second.json())
    );
  });

  it("uses the same reference date for generatedAt and placeholder daily content", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-07T12:00:00.000Z"));

    const response = await getToday(new Request("http://localhost/api/today/demo-user"), {
      params: Promise.resolve({ userId: "demo-user" })
    });
    const payload = todayResponseSchema.parse(await response.json());
    const referenceDate = payload.data.generatedAt.slice(0, 10);

    expect(payload.data.daily).toEqual(generateStatelessDailyState("demo-user", referenceDate));
  });

  it("rolls to the next reference date after UTC midnight", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-07T23:59:00.000Z"));

    const beforeMidnight = todayResponseSchema.parse(
      await (
        await getToday(new Request("http://localhost/api/today/demo-user"), {
          params: Promise.resolve({ userId: "demo-user" })
        })
      ).json()
    );

    vi.setSystemTime(new Date("2026-04-08T00:01:00.000Z"));

    const afterMidnight = todayResponseSchema.parse(
      await (
        await getToday(new Request("http://localhost/api/today/demo-user"), {
          params: Promise.resolve({ userId: "demo-user" })
        })
      ).json()
    );

    expect(beforeMidnight.data.generatedAt).toBe("2026-04-07T00:00:00.000Z");
    expect(afterMidnight.data.generatedAt).toBe("2026-04-08T00:00:00.000Z");
    expect(afterMidnight.data.daily).toEqual(generateStatelessDailyState("demo-user", "2026-04-08"));
  });

  it("rejects invalid route params with the shared validation envelope", async () => {
    const response = await getToday(new Request("http://localhost/api/today/not allowed"), {
      params: Promise.resolve({ userId: "not allowed" })
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });
});
