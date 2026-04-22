# Phase 5 Spec: Verification and Extension Readiness

## Phase
Phase 5 - Verification and Extension Readiness

## Goal
Prove that Kaal's backend behaves deterministically, runs locally without a database, and is structurally ready for future extension without requiring another architectural redesign.

## Selected Architecture
Proposal 2 - Clean Verification Matrix

Phase 5 should formalize the architecture that already exists:
1. `src/lib/astro` remains the deterministic astrology helper and adapter seam
2. `src/lib/engine` remains the pure interpretation, scoring, and rendering layer
3. `src/lib/api` plus `src/lib/schemas` remain the contract boundary
4. `src/app/api/*` remains a thin transport shell

The phase should add a deliberate readiness layer around that structure:
- a clear verification matrix across helpers, engines, and routes
- a documented local setup and execution path
- explicit handoff notes showing where richer transit logic, persistence, and new decision categories belong later

## Inputs
- [PROJECT.md](D:/Vibecoded%20Projects/Kaal/.planning/PROJECT.md)
- [ROADMAP.md](D:/Vibecoded%20Projects/Kaal/.planning/ROADMAP.md)
- [STATE.md](D:/Vibecoded%20Projects/Kaal/.planning/STATE.md)
- [04-REVIEW.md](D:/Vibecoded%20Projects/Kaal/.planning/phases/04-api-delivery-layer/04-REVIEW.md)
- current scripts in `package.json`
- current code layout under:
  - `src/lib/astro`
  - `src/lib/engine`
  - `src/lib/api`
  - `src/lib/schemas`
  - `src/app/api`
- current test layout under:
  - `tests/astro`
  - `tests/engine`
  - `tests/api`
  - `tests/utils`

## Scope
In scope:
- strengthen and organize the verification surface for astrology helpers, engine mappings, decision thresholds, route validation, and deterministic date-sensitive behavior
- ensure the test suite clearly proves the promised v1 behavior instead of only exercising broad happy paths
- document a real local setup and run workflow for a database-free v1 backend
- document the optional `swisseph` seam honestly, including the current deterministic fallback behavior in this environment
- make deferred extension seams obvious for richer transit logic, persistence, and additional decision categories

Out of scope:
- adding a database or persistence
- adding authentication, queues, or background jobs
- redesigning the route layer or engine architecture
- implementing richer transit interpretation or new decision categories in Phase 5
- changing product scope beyond verification, documentation, and extension readiness

## Verification Principles
- Verification must prove deterministic behavior, not just file presence.
- Threshold-sensitive logic should be tested at the edges, not only with representative middle cases.
- Route behavior should remain thin and contract-focused; route tests should verify transport behavior rather than re-test engine internals indirectly.
- The final verification story should be understandable by a new maintainer without reverse-engineering every test file.
- The project must remain local-first and database-free in v1.

## Required Deliverables

### 1. Verification Matrix
- Tighten or add coverage so the final suite clearly proves:
  - astrology helper correctness and seam behavior
  - deterministic engine mappings and phrase selection stability
  - decision threshold behavior, including category-sensitive edge cases
  - invalid input handling and happy-path API flows
  - date and timezone-sensitive deterministic behavior where the API promises it
- The test surface should feel intentional and complete, not incidental.

### 2. Local Run Documentation
- Add a root `README.md` that documents:
  - what Kaal is
  - local setup commands
  - local verification commands
  - how to run the backend locally
  - that v1 has no database dependency
  - the role of optional `swisseph` support versus the deterministic fallback path used in constrained environments
- Keep the documentation honest about current runtime assumptions.

### 3. Extension Readiness Notes
- Make future seams explicit without implementing them:
  - richer transit logic should extend the astro layer rather than the route layer
  - persistence should be introduced as a separate seam rather than implied in `/api/today/[userId]`
  - additional decision categories should extend the engine scoring and content layers, not route contracts
- This can be expressed through docs, comments, or both, but it must be easy to find.

## Phase-Specific Expectations

### Testing Expectations
- The final verification pass should cover:
  - astro adapter seam behavior
  - chart helper math and structure guarantees
  - engine determinism for identity, phase, daily, and decision outputs
  - decision threshold boundaries
  - malformed JSON and schema validation failures
  - happy-path profile, decision, and today-route API behavior
  - deterministic date handling for today-state behavior

### Documentation Expectations
- A new maintainer should be able to clone the repo, install dependencies, run tests, and start the local server using only the README.
- The README should not imply native `swisseph` availability is required for basic v1 verification.

### Extension Expectations
- Future persistence must remain an explicit deferred seam rather than a hidden assumption.
- Future transit depth should slot into `src/lib/astro` and not leak into routes.
- Future decision growth should extend typed engine registries and phrase banks instead of forcing route redesign.

## Guardrails From Prior Phases
- Do not reopen the API contract shape unless verification reveals a real contract bug.
- Do not mix transport concerns back into engine logic or engine logic back into routes.
- Do not let documentation over-promise runtime capabilities that the current local environment does not actually provide.
- Do not add a database just to satisfy the “readiness” goal.
- Keep the today-state placeholder semantics explicit and honest.

## Desired End State
At the end of Phase 5:
- the backend has an intentional and trustworthy verification matrix
- the project can be set up and run locally from a documented path
- v1 remains deterministic, local-first, and database-free
- extension seams for transit depth, persistence, and new decision categories are obvious from the codebase and documentation
- the project is ready for final review without another architecture pass
