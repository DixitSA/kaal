const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;
const MAX_UINT32 = 4294967295;

export function hashString(input: string, seed: number = FNV_OFFSET_BASIS): number {
  let hash = seed >>> 0;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }

  return hash >>> 0;
}

export function hashToUnitInterval(input: string, seed?: number): number {
  return hashString(input, seed) / MAX_UINT32;
}
