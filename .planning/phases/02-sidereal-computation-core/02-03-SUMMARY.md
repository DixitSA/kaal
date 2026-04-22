# Plan 02-03 Summary

## Status
Complete

## Outcome
- Integrated the sidereal state output into a real chart primitive pipeline that supports both exact-time and time-unknown requests without crashing.
- Reconciled the Phase 1 placeholder chart contract against the Phase 2 target shape: Lahiri default, `julianDayUT`, Moon/Lagna fields, typed planet positions, optional houses, and explicit confidence semantics.
- Updated the chart request/response schema and route-facing validation so the reviewed API surface accepts the real chart output.

## Exact-Time vs Time-Unknown
- Exact-time mode emits Lagna, equal-house positions, and `confidence: "high"`.
- Time-unknown mode omits Lagna and houses intentionally and emits `confidence: "medium"` while preserving Moon-based fields, dasha, and transit state.

## Files
- `src/lib/types/astrology.ts`
- `src/lib/schemas/input.ts`
- `src/lib/astro/calculateChart.ts`
- `tests/astro/calculateChart.test.ts`
- `tests/api/validation.test.ts`
- `tests/api/profile-generate.test.ts`
- `tests/api/decision-evaluate.test.ts`

## Verification
- `node node_modules/typescript/bin/tsc --noEmit`
- `node node_modules/vitest/vitest.mjs run tests/astro/calculateChart.test.ts tests/api/validation.test.ts tests/api/profile-generate.test.ts tests/api/decision-evaluate.test.ts`
