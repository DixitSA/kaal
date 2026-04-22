import { describe, expect, it } from "vitest";

import { POST as generateProfile } from "@/app/api/profile/generate/route";
import { astrologyAdapter } from "@/lib/astro/adapter";
import { errorResponseSchema, profileResponseSchema } from "@/lib/schemas/output";

const sampleChart = astrologyAdapter.computeChart({
  date: "2001-08-12",
  time: "14:15",
  timezone: "America/New_York",
  latitude: 35.2271,
  longitude: -80.8431,
  timeUnknown: false
}, "lahiri", new Date("2026-04-07T00:00:00.000Z"));

const alternateChart = astrologyAdapter.computeChart({
  date: "1994-11-03",
  time: "06:45",
  timezone: "America/Los_Angeles",
  latitude: 34.0522,
  longitude: -118.2437,
  timeUnknown: false
}, "lahiri", new Date("2026-04-07T00:00:00.000Z"));

describe("POST /api/profile/generate", () => {
  it("returns a shared validation envelope for malformed JSON", async () => {
    const response = await generateProfile(
      new Request("http://localhost/api/profile/generate", {
        method: "POST",
        body: "{",
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request body must be valid JSON."
      }
    });
  });

  it("returns a deterministic placeholder profile payload", async () => {
    const request = new Request("http://localhost/api/profile/generate", {
      method: "POST",
      body: JSON.stringify({
        chart: sampleChart,
        seed: "test-user"
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    const first = await generateProfile(request);
    const second = await generateProfile(
      new Request("http://localhost/api/profile/generate", {
        method: "POST",
        body: JSON.stringify({
          chart: sampleChart,
          seed: "test-user"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    expect(first.status).toBe(200);

    const firstPayload = profileResponseSchema.parse(await first.json());
    const secondPayload = profileResponseSchema.parse(await second.json());

    expect(firstPayload).toEqual(secondPayload);
    expect(firstPayload.ok).toBe(true);
    expect(firstPayload.data.contractVersion).toBe("1.0");
    expect(firstPayload).toMatchObject({
      data: {
        identity: {
          archetype: expect.any(String),
          summary: expect.any(String),
          strengths: expect.any(Array),
          watchouts: expect.any(Array),
          confidence: expect.any(Number),
          core: expect.any(String),
          emotionalLine: expect.any(String),
          decisionLine: expect.any(String),
          patternLine: expect.any(String),
          challengeLine: expect.any(String)
        },
        phase: {
          label: expect.any(String),
          summary: expect.any(String),
          supportAction: expect.any(String),
          cautionAction: expect.any(String),
          confidence: expect.any(Number),
          stateKey: expect.any(String),
          intensity: expect.any(String),
          supportBias: expect.any(String),
          riskBias: expect.any(String)
        }
      }
    });
  });

  it("changes the profile output when the chart input changes", async () => {
    const firstResponse = await generateProfile(
      new Request("http://localhost/api/profile/generate", {
        method: "POST",
        body: JSON.stringify({
          chart: sampleChart,
          seed: "test-user"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const secondResponse = await generateProfile(
      new Request("http://localhost/api/profile/generate", {
        method: "POST",
        body: JSON.stringify({
          chart: alternateChart,
          seed: "test-user"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const firstPayload = profileResponseSchema.parse(await firstResponse.json());
    const secondPayload = profileResponseSchema.parse(await secondResponse.json());

    expect(secondPayload).not.toEqual(firstPayload);
    expect(
      firstPayload.data.identity.archetype !== secondPayload.data.identity.archetype ||
        firstPayload.data.identity.summary !== secondPayload.data.identity.summary ||
        firstPayload.data.phase.label !== secondPayload.data.phase.label ||
        firstPayload.data.phase.summary !== secondPayload.data.phase.summary
    ).toBe(true);
  });

  it("rejects birth-first profile requests", async () => {
    const response = await generateProfile(
      new Request("http://localhost/api/profile/generate", {
        method: "POST",
        body: JSON.stringify({
          birth: {
            date: "2001-08-12",
            time: "14:15",
            timezone: "America/New_York",
            latitude: 35.2271,
            longitude: -80.8431,
            timeUnknown: false
          }
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );
    const payload = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });
});
