import { hashString } from "@/lib/utils/hash";

function normalizeSeed(seed: number | string): string {
  return typeof seed === "number" ? seed.toString(10) : seed;
}

export function deterministicPickIndex(length: number, seed: number | string): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("length must be a positive integer");
  }

  const hash = hashString(normalizeSeed(seed));
  return hash % length;
}

export function deterministicPick<T>(items: readonly T[], seed: number | string): T {
  if (items.length === 0) {
    throw new Error("items must not be empty");
  }

  return items[deterministicPickIndex(items.length, seed)] as T;
}
