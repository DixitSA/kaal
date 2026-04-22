import { afterEach, describe, expect, it, vi } from "vitest";

import { POST as lookupLocation } from "@/app/api/location/lookup/route";
import { errorResponseSchema, locationLookupResponseSchema } from "@/lib/schemas/output";

describe("POST /api/location/lookup", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.KAAL_DISABLE_REMOTE_GEOCODING;
  });

  it("returns normalized location candidates from the geocoding provider", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        results: [
          {
            id: 5128581,
            name: "New York",
            latitude: 40.7143,
            longitude: -74.006,
            timezone: "America/New_York",
            country: "United States",
            country_code: "US",
            admin1: "New York"
          }
        ]
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await lookupLocation(
      new Request("http://localhost/api/location/lookup", {
        method: "POST",
        body: JSON.stringify({
          query: "New York"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const payload = locationLookupResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      data: {
        contractVersion: "1.0",
        provider: "open-meteo",
        results: [
          {
            id: 5128581,
            name: "New York",
            displayName: "New York, New York, United States",
            latitude: 40.7143,
            longitude: -74.006,
            timezone: "America/New_York",
            country: "United States",
            countryCode: "US",
            admin1: "New York"
          }
        ]
      }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("https://geocoding-api.open-meteo.com/v1/search?"),
      expect.objectContaining({
        method: "GET",
        cache: "no-store"
      })
    );
  });

  it("returns a successful empty result set when no matches are found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({}))
    );

    const response = await lookupLocation(
      new Request("http://localhost/api/location/lookup", {
        method: "POST",
        body: JSON.stringify({
          query: "Xyznotarealplace"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const payload = locationLookupResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload.data.results).toEqual([]);
  });

  it("maps provider outages to a shared upstream error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down"))
    );

    const response = await lookupLocation(
      new Request("http://localhost/api/location/lookup", {
        method: "POST",
        body: JSON.stringify({
          query: "London"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const payload = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(502);
    expect(payload).toMatchObject({
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "The upstream geocoding provider could not be reached."
      }
    });
  });

  it("returns not implemented when remote geocoding is disabled", async () => {
    process.env.KAAL_DISABLE_REMOTE_GEOCODING = "true";

    const response = await lookupLocation(
      new Request("http://localhost/api/location/lookup", {
        method: "POST",
        body: JSON.stringify({
          query: "Paris"
        }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const payload = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(501);
    expect(payload.error.code).toBe("NOT_IMPLEMENTED");
  });
});
