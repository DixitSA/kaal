# Phase 3: Deterministic Interpretation Engines -- Context

## Phase Goal
Convert chart primitives into compact identity, phase, daily, and decision states using deterministic rules and phrase banks.

## Requirements Covered
- R4: Generate a deterministic identity profile driven primarily by Moon nakshatra and Lagna, with planetary influence modifiers.
- R5: Generate a deterministic phase profile driven primarily by Vimshottari mahadasha and antardasha state.
- R6: Generate a deterministic daily state driven primarily by tara bala plus simple Moon-based transit modifiers.
- R7: Generate deterministic preset-category decision outcomes for career, relationships, money, travel, move, and communication.
- R8: Render all user-facing outputs from stable phrase banks so responses remain short, modern, deterministic, and jargon-free.

## What Already Exists
- Phase 1 is complete and passed review:
  - `.planning/phases/01-project-skeleton-and-contracts/01-REVIEW.md`
- Phase 2 is complete and passed review:
  - `.planning/phases/02-sidereal-computation-core/02-REVIEW.md`
- The repo already contains:
  - a real Phase 2 chart primitive contract in `src/lib/types/astrology.ts`
  - deterministic chart computation and validation boundaries
  - placeholder-but-working engine files under `src/lib/engine`
  - starter phrase banks under `src/lib/content`
  - stable deterministic utilities under `src/lib/utils`

## Key Design Decisions
- Planning cap: `settings.json` is absent, so the default `planning.max_tasks_per_plan = 3` applies.
- Requirement context: `.planning/REQUIREMENTS.md` is absent, so decomposition uses the requirement descriptions from `PROJECT.md` and `ROADMAP.md`.
- Architecture proposals: user selected Proposal 2 -- Clean State Pipeline.
- Spec pipeline: user requested and generated `.planning/specs/03-deterministic-interpretation-engines-spec.md`.
- Critique-driven constraints added before execution:
  - decision scoring must move beyond generic hash shaping into explicit category-specific chart-derived weighting maps for all six decision categories
  - richer phrase-bank structures must be reconciled into the exported engine output contract during Phase 3 rather than deferred silently to Phase 4
  - daily and any date-aware rendering must share a normalized day-seed rule so same-day outputs stay stable while next-day outputs can change intentionally
  - verification must prove each engine renders from internal state keys, not only that phrase selection is deterministic in isolation
- Wave structure rationale:
  - Wave 1 establishes typed internal interpretation states and named scoring constants before phrasing expands.
  - Wave 2 expands phrase banks and deterministic renderers against those stable state keys.
  - Wave 3 integrates the engines against the real Phase 2 chart contract and locks behavior with focused tests.
- Review-driven guardrails inherited from prior phases:
  - Keep validation and output contracts honest; do not let engine refactors silently drift API-facing shapes.
  - Preserve deterministic behavior by avoiding implicit real-time entropy in engine selection logic.
  - Keep Moon-led fallback behavior strong for time-unknown mode.

## Selected Architecture
Proposal 2 -- Clean State Pipeline

Phase 3 must follow the architecture captured in:
- `.planning/specs/03-deterministic-interpretation-engines-spec.md`

The essential pattern is:
1. derive internal state from `ChartPrimitives`
2. classify or score with named constants
3. render through deterministic phrase banks

Phrase banks are data. Engines are rules. Do not collapse them back together.

## Existing Assets and Constraints
- Existing engine files to deepen:
  - `src/lib/engine/identityEngine.ts`
  - `src/lib/engine/phaseEngine.ts`
  - `src/lib/engine/dailyEngine.ts`
  - `src/lib/engine/decisionEngine.ts`
  - `src/lib/engine/scoring.ts`
- Existing phrase banks to expand:
  - `src/lib/content/archetypePhrases.ts`
  - `src/lib/content/phasePhrases.ts`
  - `src/lib/content/dailyPhrases.ts`
  - `src/lib/content/decisionPhrases.ts`
- Existing types likely to require alignment:
  - `src/lib/types/engine.ts`
- Existing residual environment constraint from Phase 2:
  - native `swisseph` activation is still blocked on this machine, so Phase 3 should consume Phase 2 chart outputs as-is and not depend on native runtime changes

## Additional Guardrails From Critique
- `src/lib/engine/scoring.ts` must expose category-safe weighting and driver helpers for:
  - `career`
  - `relationships`
  - `money`
  - `travel`
  - `move`
  - `communication`
- `src/lib/types/engine.ts` must become the explicit contract for richer Phase 3 rendered outputs so Phase 4 can wire routes without another major response-shape redesign.
- Any day-aware phrasing or evaluation must use a shared normalized date seed helper instead of raw timestamps or `computedAt` directly.
- Engine verification should cover:
  - same-day stability
  - next-day variation where intended
  - state-to-renderer wiring for identity, phase, daily, and decision flows

## Plan Structure
- **Plan 03-01 (Wave 1)**: Build internal state and scoring foundations -- add compact typed state derivation and named scoring/modifier maps for identity, phase, daily, and decision logic.
- **Plan 03-02 (Wave 2)**: Expand phrase banks and deterministic renderers -- grow the phrase data and renderer logic so outputs match the product direction without mixing rules and copy.
- **Plan 03-03 (Wave 3)**: Integrate engines with Phase 2 chart primitives and lock behavior -- connect the clean state pipeline to the real chart contract and protect exact-time versus time-unknown behavior with tests.

## Agent Rationale
- `engineering-senior-developer` is the primary implementation agent because this phase is mostly execution-heavy deterministic domain logic on top of a stable backend foundation.
- `testing-qa-verification-specialist` supports the logic-heavy waves to keep the mappings, thresholds, and fallback behavior explicitly tested.
- `product-technical-writer` supports the phrase-bank wave because the data shape and tone need to evolve toward the product response structure without losing determinism or clarity.
