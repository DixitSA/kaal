# Kaal - Roadmap

## Phases

- [x] Phase 1: Project Skeleton and Contracts (2 plans)
- [x] Phase 2: Sidereal Computation Core (3 plans)
- [x] Phase 3: Deterministic Interpretation Engines (3 plans)
- [x] Phase 4: API Delivery Layer (2 plans)
- [x] Phase 5: Verification and Extension Readiness (2 plans)

## Phase Details

### Phase 1: Project Skeleton and Contracts
**Goal**: Establish the Next.js backend structure, typed contracts, constants, utilities, and validation boundaries that every later phase builds on.
**Requirements**: R8, R9, R10, R12
**Recommended Agents**: project-manager-senior, engineering-backend-architect, engineering-senior-developer, testing-api-tester
**Success Criteria**:
- [ ] The requested folder structure exists with coherent module boundaries for `astro`, `engine`, `content`, `schemas`, `types`, `utils`, and tests.
- [ ] Core input/output/domain types and Zod schemas compile cleanly and cover the planned API surface.
- [ ] Shared constants, date/math helpers, and deterministic selection utilities are in place without leaking implementation details into route handlers.
**Plans**: 2

### Phase 2: Sidereal Computation Core
**Goal**: Implement the astrology adapter and pure computation modules that produce reliable sidereal chart primitives for both known-time and unknown-time births.
**Requirements**: R1, R2, R3
**Recommended Agents**: project-manager-senior, engineering-backend-architect, engineering-senior-developer, testing-api-tester
**Success Criteria**:
- [ ] All `swisseph` interactions are isolated inside `src/lib/astro/adapter.ts`.
- [ ] Chart primitive calculations return typed sidereal outputs with Lahiri ayanamsha defaults and confidence-aware handling for missing birth time.
- [ ] Helper modules correctly compute sign, nakshatra, pada, house, dasha shape, transit inputs, and tara bala inputs with test coverage.
**Plans**: 3

### Phase 3: Deterministic Interpretation Engines
**Goal**: Convert chart primitives into compact identity, phase, daily, and decision states using deterministic rules and phrase banks.
**Requirements**: R4, R5, R6, R7, R8
**Recommended Agents**: project-manager-senior, engineering-senior-developer, product-technical-writer, testing-qa-verification-specialist
**Success Criteria**:
- [ ] Identity, phase, daily, and decision engines all return typed outputs driven by deterministic mappings and scoring rules.
- [ ] Phrase banks produce short, modern, jargon-free copy through stable deterministic selection rather than random phrasing.
- [ ] Decision thresholds and phase/daily modifiers are configurable through named constants and remain easy to extend.
**Plans**: 3

### Phase 4: API Delivery Layer
**Goal**: Expose the engine through validated route handlers that return stable JSON responses for chart, profile, decision, and daily-state requests.
**Requirements**: R8, R9, R10, R12
**Recommended Agents**: project-manager-senior, engineering-backend-architect, engineering-frontend-developer, testing-api-tester
**Success Criteria**:
- [ ] `POST /api/chart/compute`, `POST /api/profile/generate`, and `POST /api/decision/evaluate` validate requests with Zod and return typed JSON responses.
- [ ] Invalid input produces clear 400 responses instead of runtime failures.
- [ ] `GET /api/today/[userId]` is structured cleanly as a placeholder for future persistence without forcing database adoption in v1.
**Plans**: 2

### Phase 5: Verification and Extension Readiness
**Goal**: Prove the backend behaves deterministically, is locally runnable, and is ready for future extension without redesigning the core architecture.
**Requirements**: R11, R12
**Recommended Agents**: project-management-project-shepherd, engineering-senior-developer, testing-api-tester, testing-qa-verification-specialist
**Success Criteria**:
- [ ] Automated tests cover the required astrology helpers, engine mappings, decision thresholds, invalid input paths, and happy-path API flows.
- [ ] The project runs locally with a documented setup path and no database dependency for v1.
- [ ] Deferred extension seams for richer transit logic, persistence, and additional decision categories are obvious from the code layout.
**Plans**: 2

## Progress

| Phase | Plans | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1: Project Skeleton and Contracts | 2 | 2 | Complete |
| Phase 2: Sidereal Computation Core | 3 | 3 | Complete |
| Phase 3: Deterministic Interpretation Engines | 3 | 3 | Complete |
| Phase 4: API Delivery Layer | 2 | 2 | Complete |
| Phase 5: Verification and Extension Readiness | 2 | 2 | Complete |
