# Phase 4 Spec: API Delivery Layer

## Phase
Phase 4 - API Delivery Layer

## Goal
Expose Kaal's chart, profile, decision, and daily-state capabilities through validated Next.js App Router route handlers that preserve the shared runtime contract, keep delivery behavior consistent, and remain local-first.

## Selected Architecture
Proposal 2 - Clean Delivery Boundary

The route layer should stay thin and declarative:
1. parse and validate input
2. call adapter or engine logic
3. shape the shared success envelope
4. return a consistent shared error envelope

Shared delivery helpers may be introduced for parsing and response shaping, but business logic must remain in `src/lib/astro` and `src/lib/engine`.

## Inputs
- [PROJECT.md](D:/Vibecoded%20Projects/Kaal/.planning/PROJECT.md)
- [ROADMAP.md](D:/Vibecoded%20Projects/Kaal/.planning/ROADMAP.md)
- [STATE.md](D:/Vibecoded%20Projects/Kaal/.planning/STATE.md)
- [03-REVIEW.md](D:/Vibecoded%20Projects/Kaal/.planning/phases/03-deterministic-interpretation-engines/03-REVIEW.md)
- existing route handlers:
  - `src/app/api/chart/compute/route.ts`
  - `src/app/api/profile/generate/route.ts`
  - `src/app/api/decision/evaluate/route.ts`
  - `src/app/api/today/[userId]/route.ts`
- shared contract files:
  - `src/lib/types/api.ts`
  - `src/lib/schemas/input.ts`
  - `src/lib/schemas/output.ts`

## Scope
In scope:
- make route behavior consistent across parsing, validation failure, success envelopes, and route-local errors
- ensure runtime Zod schemas and TypeScript API types stay aligned
- keep routes thin and free of duplicate business logic
- preserve the Phase 3 richer runtime output contract at the API boundary
- keep `/api/today/[userId]` explicitly stateless and ready for future persistence
- strengthen route-level verification for both invalid and happy paths

Out of scope:
- adding a database or persistence
- authentication, sessions, or rate limiting
- redesigning engine or astrology logic
- freeform personalization or LLM-based delivery

## Delivery Principles
- The route layer is not allowed to recompute engine or astro rules.
- Route handlers should only orchestrate validation, engine invocation, and envelope shaping.
- Runtime schemas in `src/lib/schemas` must remain the authoritative validation boundary.
- `src/lib/types/api.ts` must match the runtime route contract instead of drifting into a type-only wish shape.
- Error envelopes should remain shared and predictable.
- `/api/today/[userId]` must remain local-first, deterministic, and database-free in v1.

## Required Deliverables

### 1. Shared Delivery Consistency
- Consolidate repeated route concerns where it improves consistency:
  - JSON parse failure handling
  - shared validation error shaping
  - success envelope shaping or helper boundaries if useful
- Avoid over-abstracting into a heavy gateway.

### 2. Route Contract Alignment
- Confirm each route is aligned across:
  - request schema
  - runtime response schema
  - `src/lib/types/api.ts`
  - actual returned payload
- Ensure Phase 3 fields remain visible where the public contract now includes them.

### 3. Route-Specific Expectations

#### `POST /api/chart/compute`
- validate request body with shared chart request schema
- call the astrology adapter only once
- return the chart success envelope with the current chart contract
- preserve exact-time vs time-unknown behavior without route-specific branching leaks

#### `POST /api/profile/generate`
- validate chart-first request body
- call profile engine functions only
- return the richer profile contract from Phase 3 without narrowing it at runtime

#### `POST /api/decision/evaluate`
- validate chart-first request body plus decision category
- call the decision engine only
- return the richer decision contract from Phase 3 without narrowing it at runtime

#### `GET /api/today/[userId]`
- validate path params with shared schema
- remain deterministic and stateless
- make the persistence seam obvious but not required
- keep the placeholder mode explicit instead of implying database-backed user state

## Testing Expectations
- Route-level tests should cover:
  - invalid JSON or malformed input
  - schema validation failures
  - happy-path success envelopes
  - deterministic behavior where the route promises it
  - time-unknown compatibility where applicable
- The verification suite should be centered on API tests, not just engine tests.

## Guardrails From Prior Review
- Do not allow runtime schema drift between `src/lib/types/api.ts` and `src/lib/schemas/output.ts`.
- Do not let route delivery reintroduce timestamp-driven instability where Phase 3 already normalized behavior.
- Do not smuggle business logic into delivery helpers.

## Desired End State
At the end of Phase 4:
- all four route handlers are thin, validated, and contract-honest
- route behavior is consistent across parsing and error handling
- API contracts are ready for Phase 5 verification without another route-layer redesign
- the codebase is still database-free and local-first
