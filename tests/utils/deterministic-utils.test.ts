import { describe, expect, it } from "vitest";

import { daysBetweenIsoDates, isIsoDate, toUtcMidnightIso } from "@/lib/utils/dates";
import { deterministicPick, deterministicPickIndex } from "@/lib/utils/deterministicPick";
import { hashString } from "@/lib/utils/hash";
import { clamp, normalizeRange, roundTo } from "@/lib/utils/math";

describe("hash utilities", () => {
  it("returns the same hash for the same seed", () => {
    const first = hashString("kaal-seed");
    const second = hashString("kaal-seed");

    expect(first).toBe(second);
  });

  it("returns different hashes for different seeds", () => {
    const one = hashString("seed-one");
    const two = hashString("seed-two");

    expect(one).not.toBe(two);
  });
});

describe("deterministicPick utilities", () => {
  it("selects the same item for the same seed", () => {
    const phraseBank = ["focus", "pause", "plan", "execute"] as const;
    const first = deterministicPick(phraseBank, "moon-lagna-seed");
    const second = deterministicPick(phraseBank, "moon-lagna-seed");

    expect(first).toBe(second);
    expect(deterministicPickIndex(phraseBank.length, "moon-lagna-seed")).toBe(
      deterministicPickIndex(phraseBank.length, "moon-lagna-seed")
    );
  });

  it("throws when trying to pick from an empty list", () => {
    expect(() => deterministicPick([], "seed")).toThrow("items must not be empty");
  });
});

describe("date and math helpers", () => {
  it("computes leap-year day differences in UTC", () => {
    expect(daysBetweenIsoDates("2024-02-28", "2024-03-01")).toBe(2);
    expect(toUtcMidnightIso("2026-04-07")).toBe("2026-04-07T00:00:00.000Z");
    expect(isIsoDate("2026-04-07")).toBe(true);
    expect(isIsoDate("04/07/2026")).toBe(false);
  });

  it("clamps and normalizes values deterministically", () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(5, 0, 1)).toBe(1);
    expect(roundTo(0.12345, 3)).toBe(0.123);
    expect(normalizeRange(25, 0, 100)).toBe(0.25);
  });
});
