# Phase 2: Sidereal Computation Core -- Context

## Phase Goal
Implement the astrology adapter and pure computation modules that produce reliable sidereal chart primitives for both known-time and unknown-time births.

## Requirements Covered
- R1: Compute sidereal chart primitives with Lahiri ayanamsha as the default and return typed chart outputs.
- R2: Support both exact-time mode and time-unknown mode without crashing, including internal confidence handling.
- R3: Implement a dedicated astrology adapter around `swisseph` plus reusable constants and helper calculations for signs, nakshatras, padas, houses, dasha, transits, and tara bala.

## What Already Exists
- Phase 1 is complete and passed review:
  - `.planning/phases/01-project-skeleton-and-contracts/01-01-SUMMARY.md`
  - `.planning/phases/01-project-skeleton-and-contracts/01-02-SUMMARY.md`
  - `.planning/phases/01-project-skeleton-and-contracts/01-REVIEW.md`
- The repo already contains:
  - shared birth and chart validation boundaries in `src/lib/schemas/input.ts`
  - current astrology-facing types in `src/lib/types/astrology.ts`
  - a placeholder adapter and placeholder astro calculation files under `src/lib/astro`
  - chart route scaffolding and API smoke tests from Phase 1

## Key Design Decisions
- Planning cap: `settings.json` is absent, so the default `planning.max_tasks_per_plan = 3` applies.
- Requirement context: `.planning/REQUIREMENTS.md` is absent, so decomposition uses the requirement descriptions from `PROJECT.md` and `ROADMAP.md`.
- Architecture proposals: skipped by user.
- Spec pipeline: skipped by user.
- Plan critique: Phase 2 was revised after critique to require runtime adapter proof, explicit dasha input ownership, and direct contract reconciliation against the product spec rather than the current placeholder chart shape.
- Wave structure rationale:
  - Wave 1 isolates the provider boundary and low-level sidereal helper math before higher-level chart assembly depends on them.
  - Wave 2 implements timing and daily-state primitives independently so dasha, tara bala, and transit logic can be verified without being buried inside chart assembly.
  - Wave 3 integrates the helper modules into the real chart pipeline and aligns shared contracts with the Phase 2 output shape.
- Review-driven guardrails inherited from Phase 1:
  - Keep validation boundaries honest; malformed inputs should fail at the schema or route boundary rather than deeper in the pipeline.
  - Do not introduce undocumented alternate request shapes that drift from the shared contracts.
  - Favor direct `node node_modules/...` verification in this workspace because `node_modules/.bin` shims are currently unreliable.

## Existing Assets and Constraints
- Existing placeholder files to replace or deepen:
  - `src/lib/astro/adapter.ts`
  - `src/lib/astro/calculateJulianDay.ts`
  - `src/lib/astro/calculateChart.ts`
  - `src/lib/astro/calculateNakshatra.ts`
  - `src/lib/astro/calculateDasha.ts`
  - `src/lib/astro/calculateTransits.ts`
  - `src/lib/astro/calculateTaraBala.ts`
- Existing contracts likely to require alignment in Wave 3:
  - `src/lib/types/astrology.ts`
  - `src/lib/schemas/input.ts`
- Keep the backend local-first and database-free.
- All `swisseph` interactions must remain isolated to `src/lib/astro/adapter.ts`.
- The Phase 2 contract work must explicitly reconcile the current placeholder `ChartPrimitives` model with the product spec target shape, including Lahiri defaults, Moon/Lagna fields, optional houses, and clear exact-time versus time-unknown confidence semantics.
- House output responsibility is part of Phase 2 and cannot be left implicit; by the end of Wave 3 the team must either emit typed house data or model its absence explicitly and intentionally for time-unknown mode.
- Any `swisseph` install, ephemeris path, or runtime setup assumption discovered during implementation must be recorded in the relevant plan summary so later waves inherit the real execution constraints.

## Plan Structure
- **Plan 02-01 (Wave 1)**: Establish the ephemeris adapter and core astro helpers -- add the `swisseph` dependency, replace the placeholder adapter seam with a real isolated provider boundary, and implement the reusable sidereal helper math plus unit tests.
- **Plan 02-02 (Wave 2)**: Implement dasha, tara bala, and transit state modules -- add the timing and Moon-based state calculations with deterministic, confidence-aware handling and focused tests.
- **Plan 02-03 (Wave 3)**: Assemble chart primitives and align contracts -- wire the helper modules into chart computation, support exact-time and time-unknown paths, and align shared types/schemas/tests to the actual Phase 2 chart output.

## Agent Rationale
- `engineering-backend-architect` owns the adapter boundary and the final chart/contract alignment work because both tasks shape the long-term architecture.
- `engineering-senior-developer` owns the middle implementation wave because it is primarily execution-heavy module work on top of an established architecture.
- `testing-qa-verification-specialist` supports the helper and timing waves to keep the astro math, edge cases, and confidence behavior well tested.
- `testing-api-tester` supports the final integration wave to protect the chart contract and the route-facing validation surface.
