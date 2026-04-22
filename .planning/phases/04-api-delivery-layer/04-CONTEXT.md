# Phase 4: API Delivery Layer -- Context

## Phase Goal
Expose the engine through validated route handlers that return stable JSON responses for chart, profile, decision, and daily-state requests.

## Requirements Covered
- R8: Render all user-facing outputs from stable phrase banks so responses remain short, modern, deterministic, and jargon-free.
- R9: Expose four validated route handlers for chart computation, profile generation, decision evaluation, and a clean placeholder for daily user state.
- R10: Use TypeScript, Next.js App Router route handlers, Zod validation, modular architecture, typed interfaces, and pure functions wherever possible.
- R12: Keep v1 local-first and database-free unless absolutely necessary, while leaving clean seams for future persistence and engine expansion.

## What Already Exists
- Phase 1 is complete and passed review:
  - `.planning/phases/01-project-skeleton-and-contracts/01-REVIEW.md`
- Phase 2 is complete and passed review:
  - `.planning/phases/02-sidereal-computation-core/02-REVIEW.md`
- Phase 3 is complete and passed review:
  - `.planning/phases/03-deterministic-interpretation-engines/03-REVIEW.md`
- The repo already contains:
  - route handlers for `chart/compute`, `profile/generate`, `decision/evaluate`, and `today/[userId]`
  - shared request and response schemas in `src/lib/schemas`
  - shared API contract types in `src/lib/types/api.ts`
  - a real chart computation pipeline and richer Phase 3 engine outputs
  - route-level tests under `tests/api`

## Key Design Decisions
- Planning cap: `settings.json` is absent, so the default `planning.max_tasks_per_plan = 3` applies.
- Requirement context: `.planning/REQUIREMENTS.md` is absent, so decomposition uses the requirement descriptions from `PROJECT.md` and `ROADMAP.md`.
- Architecture proposals: user selected Proposal 2 -- Clean Delivery Boundary.
- Spec pipeline: user requested and generated `.planning/specs/04-api-delivery-layer-spec.md`.
- Review-driven guardrails inherited from prior phases:
  - Keep runtime Zod schemas and TypeScript API contracts aligned; do not allow route-layer drift.
  - Keep routes thin and declarative instead of reintroducing business logic into delivery code.
  - Preserve exact-time versus time-unknown behavior and the richer Phase 3 output contract at the API boundary.
  - Keep `/api/today/[userId]` explicit, deterministic, and database-free in v1.
- Wave structure rationale:
  - Wave 1 stabilizes shared delivery contracts and the three POST routes before today-route work depends on them.
  - Wave 2 finishes the stateless today seam and locks the full API layer with route-focused verification.

## Selected Architecture
Proposal 2 -- Clean Delivery Boundary

Phase 4 must follow the architecture captured in:
- `.planning/specs/04-api-delivery-layer-spec.md`

The essential route pattern is:
1. parse and validate input
2. call adapter or engine logic
3. shape the shared success envelope
4. return a consistent shared error envelope

Routes are orchestrators only. Business logic stays in `src/lib/astro` and `src/lib/engine`.

## Existing Assets and Constraints
- Existing route files to refine:
  - `src/app/api/chart/compute/route.ts`
  - `src/app/api/profile/generate/route.ts`
  - `src/app/api/decision/evaluate/route.ts`
  - `src/app/api/today/[userId]/route.ts`
- Existing shared contract files to keep aligned:
  - `src/lib/types/api.ts`
  - `src/lib/schemas/input.ts`
  - `src/lib/schemas/output.ts`
- Existing API tests to deepen:
  - `tests/api/validation.test.ts`
  - `tests/api/profile-generate.test.ts`
  - `tests/api/decision-evaluate.test.ts`
- Existing environment constraint:
  - the workspace is not a git repository, so execution and review commits cannot be created here even when the work succeeds

## Additional Guardrails
- Shared delivery helpers are allowed only if they reduce drift; do not build a heavy route gateway.
- The runtime route contract must remain honest across:
  - request schema
  - response schema
  - `src/lib/types/api.ts`
  - actual returned payloads
- `/api/today/[userId]` must keep the placeholder mode explicit and must not imply persistence that does not exist.
- Route-level tests should become the primary proof for this phase rather than relying mainly on engine tests.

## Plan Structure
- **Plan 04-01 (Wave 1)**: Align shared API delivery contracts and thin route helpers -- stabilize request/response contracts and remove route drift across the three POST handlers.
- **Plan 04-02 (Wave 2)**: Finalize today-route placeholder behavior and lock API verification -- make the today route explicitly stateless and strengthen route-level verification across the full API surface.

## Agent Rationale
- `engineering-backend-architect` leads the contract and route-boundary wave because the main risk is schema drift and delivery-layer architecture, not domain logic.
- `engineering-senior-developer` leads the second wave because it is a narrower execution-and-verification pass over the final route surface.
- `testing-api-tester` supports both waves because this phase succeeds or fails on route-level contract honesty and regression coverage.
