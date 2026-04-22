# Kaal

Kaal is a backend-first, deterministic life-guidance API built on a Vedic astrology computation core. It turns chart inputs into short, structured JSON for chart primitives, identity, phase, daily state, and preset decision guidance.

This repo is intentionally:
- local-first
- database-free in v1
- deterministic rather than LLM-driven
- organized around a thin API shell over pure `astro` and `engine` modules

## What It Does

Kaal exposes four route handlers:
- `POST /api/chart/compute`
- `POST /api/profile/generate`
- `POST /api/decision/evaluate`
- `POST /api/location/lookup`
- `GET /api/today/[userId]`

The profile and decision outputs stay short, typed, and jargon-light, while the chart endpoint intentionally exposes typed astrology primitives through the internal engine layers.
The location lookup endpoint exists to resolve a human birthplace label into the timezone and coordinates the chart pipeline actually needs.

## Local Setup

Prerequisites:
- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Kaal does not require a database for v1. There is no persistence bootstrap step, migration workflow, or seed data requirement.

## Local Verification

Primary npm-script verification:

```bash
npm run build
npm run typecheck
npm run test:run
```

Phase 5 canonical verification was proven locally with:

```bash
cmd /c npm run build
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run tests/astro/adapter.test.ts tests/astro/calculateChart.test.ts tests/astro/calculateDasha.test.ts tests/astro/calculateJulianDay.test.ts tests/astro/calculateNakshatra.test.ts tests/astro/calculateTaraBala.test.ts tests/astro/calculateTransits.test.ts tests/engine/identityEngine.test.ts tests/engine/phaseEngine.test.ts tests/engine/dailyEngine.test.ts tests/engine/decisionEngine.test.ts tests/engine/phraseSelection.test.ts tests/engine/scoring.test.ts tests/api/validation.test.ts tests/api/profile-generate.test.ts tests/api/decision-evaluate.test.ts tests/api/today-route.test.ts tests/utils/deterministic-utils.test.ts
```

This canonical contract is the reproducibility baseline for the current v1 backend.
Because `tsconfig.json` includes `.next/types/**/*.ts`, run `npm run build` once before the raw `tsc --noEmit` command on a clean checkout.

## Run Locally

Start the local Next.js server:

```bash
npm run dev
```

Create a production build locally:

```bash
npm run build
```

## Runtime Notes

### `swisseph` and Fallback Behavior

`swisseph` is kept as an optional dependency and future native-engine seam, but Kaal is designed to remain locally runnable even when native `swisseph` support is unavailable.

The adapter can detect whether native `swisseph` is installed, but the current v1 chart computation still runs through the deterministic approximation provider implemented in `src/lib/astro/adapter.ts`. That keeps the verification path stable and local-first instead of blocking the backend on native tooling, and it keeps the seam honest: native activation is deferred rather than silently active.

### Geocoding Lookup

Birthplace lookup runs through a dedicated geocoding seam instead of letting the frontend call a third-party provider directly.

- Default provider: Open-Meteo geocoding
- Route: `POST /api/location/lookup`
- Output: normalized `displayName`, `latitude`, `longitude`, and `timezone`

Optional environment controls:

- `KAAL_DISABLE_REMOTE_GEOCODING=true` disables remote birthplace lookup and makes the route return `501`
- `KAAL_GEOCODING_BASE_URL` overrides the upstream search URL if you need a proxy or self-hosted edge

### Determinism Assumptions

Kaal's verification contract depends on:
- stable test fixtures
- explicit UTC or timezone-aware day normalization for date-sensitive flows
- route-level validation contracts
- deterministic phrase selection and scoring

The current test suite now proves those assumptions directly instead of relying on incidental green runs.

## Project Layout

Core layers:
- `src/lib/astro` - chart helpers, time utilities, tara/transit inputs, and the astrology adapter seam
- `src/lib/engine` - deterministic identity, phase, daily, and decision logic
- `src/lib/api` and `src/lib/schemas` - request parsing, validation, and shared response contracts
- `src/app/api` - thin App Router transport handlers
- `tests/astro`, `tests/engine`, `tests/api`, `tests/utils` - reproducibility and route-contract proof

## Extension Seams

Future work should extend the existing seams instead of redesigning the current architecture.

### Richer Transit Logic

Transit depth belongs in `src/lib/astro`, not in route handlers. The current adapter and helper split leaves room to deepen transit calculations without changing API transport code.

### Persistence

Persistence is intentionally deferred. The today route is a stateless placeholder seam, not a hidden pseudo-database. Any real persistence should be introduced as a dedicated storage or repository boundary rather than embedded into `src/app/api/today/[userId]/route.ts`.

### Additional Decision Categories

New decision categories should extend the typed scoring and phrase-bank layers in `src/lib/engine` and `src/lib/content`, then register in `src/lib/types/engine.ts` plus the shared request and response schemas. They should not require route-specific branching or a new public transport shape.

## Current V1 Boundaries

Included:
- deterministic chart computation
- deterministic identity, phase, daily, and decision outputs
- validated route handlers
- local-first verification with no database dependency

Deferred for future phases:
- native `swisseph` as an active compute provider
- database-backed persistence
- richer transit interpretation depth
- additional decision categories beyond the current preset set
