export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("min must be less than or equal to max");
  }

  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals: number = 2): number {
  const precision = 10 ** decimals;
  return Math.round(value * precision) / precision;
}

export function normalizeRange(value: number, min: number, max: number): number {
  if (min === max) {
    throw new Error("min and max cannot be equal");
  }

  return clamp((value - min) / (max - min), 0, 1);
}
