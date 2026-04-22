# Phase 5: Verification and Extension Readiness -- Context

## Phase Goal
Prove the backend behaves deterministically, is locally runnable, and is ready for future extension without redesigning the core architecture.

## Requirements Covered
- R11: Add automated tests across astrology logic, engine logic, and API validation and success flows.
- R12: Keep v1 local-first and database-free unless absolutely necessary, while leaving clean seams for future persistence and engine expansion.

## What Already Exists
- Phase 1 is complete and passed review:
  - `.planning/phases/01-project-skeleton-and-contracts/01-REVIEW.md`
- Phase 2 is complete and passed review:
  - `.planning/phases/02-sidereal-computation-core/02-REVIEW.md`
- Phase 3 is complete and passed review:
  - `.planning/phases/03-deterministic-interpretation-engines/03-REVIEW.md`
- Phase 4 is complete and passed review:
  - `.planning/phases/04-api-delivery-layer/04-REVIEW.md`
- The repo already contains:
  - deterministic astro helpers and an adapter seam under `src/lib/astro`
  - deterministic identity, phase, daily, and decision engines under `src/lib/engine`
  - shared route contracts under `src/lib/api`, `src/lib/schemas`, and `src/lib/types`
  - thin App Router handlers under `src/app/api`
  - test suites under `tests/astro`, `tests/engine`, `tests/api`, and `tests/utils`
  - local scripts in `package.json` for `dev`, `build`, `typecheck`, `test`, and `test:run`
- At planning start, the repo did not yet contain:
  - a root `README.md` with a maintainer-facing local setup path
  - one explicit readiness narrative tying tests, local execution, and deferred extension seams together

## Key Design Decisions
- Planning cap: `settings.json` is absent, so the default `planning.max_tasks_per_plan = 3` applies.
- Requirement context: `.planning/REQUIREMENTS.md` is absent, so decomposition uses the requirement descriptions from `PROJECT.md` and `ROADMAP.md`.
- Architecture proposals: user selected Proposal 2 -- Clean Verification Matrix.
- Spec pipeline: user requested and generated `.planning/specs/05-verification-and-extension-readiness-spec.md`.
- Readiness guardrails inherited from prior phases:
  - Keep the existing `astro -> engine -> api` split intact; Phase 5 verifies and documents it instead of replacing it.
  - Keep `/api/today/[userId]` explicit, deterministic, and stateless in v1.
  - Keep the codebase local-first and database-free.
  - Keep the optional `swisseph` seam honest in documentation; do not imply native support is required for basic v1 verification in this environment.
  - Treat reproducibility as a first-class proof target rather than a side effect of adding more assertions.
  - Require concrete seam handoff artifacts instead of satisfying extension-readiness only through generic prose.
- Wave structure rationale:
  - Wave 1 hardens the verification matrix and establishes the canonical local verification contract first so Wave 2 can document reality instead of assumptions.
  - Wave 2 converts the verified codebase into a clean local-run and extension-readiness handoff using proven commands, assumptions, and seam notes.

## Selected Architecture
Proposal 2 -- Clean Verification Matrix

Phase 5 must follow the architecture captured in:
- `.planning/specs/05-verification-and-extension-readiness-spec.md`

The essential Phase 5 framing is:
1. `src/lib/astro` remains the deterministic astrology helper and adapter seam
2. `src/lib/engine` remains the pure interpretation and scoring layer
3. `src/lib/api` plus `src/lib/schemas` remain the contract boundary
4. `src/app/api/*` remains a thin transport shell

This phase adds a readiness layer around that architecture:
- a deliberate verification matrix
- a documented local run path
- explicit notes about where future transit depth, persistence, and decision growth belong
- a reproducibility contract that can be repeated by a future maintainer

## Existing Assets and Constraints
- Existing verification surface to audit and tighten:
  - `tests/astro/adapter.test.ts`
  - `tests/astro/calculateChart.test.ts`
  - `tests/astro/calculateDasha.test.ts`
  - `tests/astro/calculateJulianDay.test.ts`
  - `tests/astro/calculateNakshatra.test.ts`
  - `tests/astro/calculateTaraBala.test.ts`
  - `tests/astro/calculateTransits.test.ts`
  - `tests/engine/identityEngine.test.ts`
  - `tests/engine/phaseEngine.test.ts`
  - `tests/engine/dailyEngine.test.ts`
  - `tests/engine/decisionEngine.test.ts`
  - `tests/engine/phraseSelection.test.ts`
  - `tests/engine/scoring.test.ts`
  - `tests/api/validation.test.ts`
  - `tests/api/profile-generate.test.ts`
  - `tests/api/decision-evaluate.test.ts`
  - `tests/api/today-route.test.ts`
  - `tests/utils/deterministic-utils.test.ts`
- Existing runtime constraints:
  - `swisseph` is listed as an optional dependency
  - this environment has previously relied on the deterministic approximation fallback path in the adapter seam
  - the workspace is not a git repository, so execution and review commits cannot be created here even when the work succeeds

## Additional Guardrails
- Do not add a database, persistence layer, or hidden state just to improve the “readiness” story.
- Do not reopen API contracts unless verification reveals a real defect.
- Do not let documentation over-promise capabilities that are not proven locally.
- Keep extension seams explicit:
  - richer transits belong in `src/lib/astro`
  - persistence belongs in a future dedicated seam, not in the today route
  - new decision categories belong in engine scoring/content registries, not in route-specific conditionals
  - each deferred seam should have at least one concrete handoff artifact, invariant, or code-adjacent note that points to the intended extension boundary

## Plan Structure
- **Plan 05-01 (Wave 1)**: Harden the deterministic verification matrix and reproducibility contract -- audit and tighten coverage so the final suite proves helper correctness, deterministic engine behavior, threshold edges, route validation flows, and a repeatable local verification path.
- **Plan 05-02 (Wave 2)**: Document local run and extension readiness -- add the maintainer-facing README and make the deferred extension seams obvious through concrete handoff artifacts grounded in the proven Phase 5 verification contract.

## Agent Rationale
- `testing-qa-verification-specialist` leads the first wave because the main risk is false confidence from broad but incomplete verification.
- `testing-api-tester` supports the first wave because invalid-input and route-flow honesty are still core to the final proof.
- `engineering-senior-developer` leads the second wave because the handoff must stay faithful to the actual code and runtime behavior.
- `project-management-project-shepherd` supports the second wave because Phase 5 succeeds only if the final setup, verification story, and extension framing are understandable to the next maintainer.
