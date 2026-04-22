# Phase 1: Project Skeleton and Contracts -- Context

## Phase Goal
Establish the Next.js backend structure, typed contracts, constants, utilities, and validation boundaries that every later phase builds on.

## Requirements Covered
- R8: Render all user-facing outputs from stable phrase banks so responses remain short, modern, deterministic, and jargon-free.
- R9: Expose four validated route handlers for chart computation, profile generation, decision evaluation, and a clean placeholder for daily user state.
- R10: Use TypeScript, Next.js App Router route handlers, Zod validation, modular architecture, typed interfaces, and pure functions wherever possible.
- R12: Keep v1 local-first and database-free unless absolutely necessary, while leaving clean seams for future persistence and engine expansion.

## What Already Exists (from prior phases)
- No prior implementation phases have run yet.
- Project planning artifacts exist:
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
- The project is still greenfield: no application code, config, tests, memory, spec, or codebase map files exist yet.

## Key Design Decisions
- Planning cap: `settings.json` is absent, so the default `planning.max_tasks_per_plan = 3` applies.
- Requirement context: `.planning/REQUIREMENTS.md` is absent, so decomposition uses the Phase 1 requirement IDs and descriptions from `PROJECT.md` and `ROADMAP.md`.
- Architecture proposals: skipped by user.
- Spec pipeline: skipped by user.
- Critique-driven revision: Wave 1 now must freeze request, success, and error envelopes for all four planned routes before Wave 2 can scaffold handlers safely.
- Wave structure rationale:
  - Wave 1 creates the workspace, typed contracts, Zod schemas, constants, and deterministic utilities that later plans should depend on instead of redefining inline.
  - Wave 2 adds route handlers, stubbed module seams, and API smoke tests after the shared contracts exist.
- Agent rationale:
  - `engineering-backend-architect` leads the contract and module-boundary plan because the work is structural and backend-centric.
  - `engineering-senior-developer` leads the route and placeholder implementation plan because the work shifts from architecture to executable scaffold code.
  - `testing-api-tester` is included on both plans because both plans modify code and establish API validation behavior.

## Plan Structure
- **Plan 01-01 (Wave 1)**: Bootstrap backend skeleton and shared contracts -- create the backend workspace, shared domain types, full endpoint contract envelopes, validation schemas, constants, deterministic utilities, and helper behavior checks.
- **Plan 01-02 (Wave 2)**: Create API surface skeleton and verification harness -- add route-handler stubs, placeholder domain modules, and API-level validation tests against the Wave 1 contract matrix.
