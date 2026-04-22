# Phase 3 Spec: Deterministic Interpretation Engines

## Phase
Phase 3 -- Deterministic Interpretation Engines

## Selected Architecture
Proposal 2 -- Clean State Pipeline

## Goal
Convert Phase 2 chart primitives into compact internal identity, phase, daily, and decision states, then render them through deterministic phrase banks into short user-facing outputs.

The core principle for this phase is separation of concerns:
1. derive internal states from chart primitives
2. score or classify those states with named constants
3. render final copy through deterministic phrase-bank selection

This phase should not introduce freeform interpretation text, astrology jargon in outputs, or random phrasing.

## Why This Architecture
- It matches the product’s four-stage pipeline most closely.
- It keeps deterministic rules testable without copy-selection noise.
- It prevents the engine files from becoming mixed “rules + phrasing + thresholds” blobs.
- It leaves Phase 4 free to wire APIs instead of reshaping engine internals.

## Inputs
- `ChartPrimitives` from Phase 2
- Deterministic seeds from chart fields, stable request seeds, and date-derived state where appropriate
- Existing phrase banks under `src/lib/content/*`

## Outputs
- Typed `IdentityProfile`
- Typed `PhaseProfile`
- Typed `DailyState`
- Typed `DecisionEvaluation`

## Design Rules
- Internal state derivation must be pure and deterministic.
- Phrase banks must remain declarative data, not mini-engines.
- Engine logic must not rely on hidden runtime time beyond explicit chart or seed input.
- Confidence handling must flow from chart confidence and any additional engine-specific degradation rules.
- User-facing outputs must stay short, modern, and jargon-free.
- Decision categories stay limited to the six preset values already defined in `src/lib/types/engine.ts`.

## Proposed Internal State Layer

### Identity State
Introduce a compact identity-state derivation step in `identityEngine.ts`.

Suggested internal shape:

```ts
type IdentityState = {
  archetypeKey: string;
  emotionalStyle: "internalizing" | "expressive" | "steady";
  decisionStyle: "deliberate" | "adaptive" | "decisive";
  patternTone: "steady" | "restless" | "intense";
  challengeTone: "overholding" | "overreactive" | "scattered";
  confidence: number;
};
```

Primary inputs:
- `chart.moonNakshatra`
- `chart.lagnaSign`
- `chart.confidence`
- simple planetary/support modifiers from Phase 2 chart primitives where helpful

Required behavior:
- Moon nakshatra remains the primary identity driver.
- Lagna modifies expression if available.
- Time-unknown mode must still produce identity output using Moon-led fallback behavior.

### Phase State
Introduce a phase-state derivation step in `phaseEngine.ts`.

Suggested internal shape:

```ts
type PhaseState = {
  stateKey: string;
  intensity: "low" | "steady" | "high";
  supportBias: "build" | "sharpen" | "pause";
  riskBias: "force" | "drift" | "overexpose";
  confidence: number;
};
```

Primary inputs:
- `chart.dasha.mahadashaLord`
- `chart.dasha.antardashaLord`
- `chart.dasha.confidence`

Required behavior:
- Mahadasha is the primary phase driver.
- Antardasha refines emphasis.
- Phase labels and summaries come from deterministic rendering of this compact state.

### Daily State
Introduce a daily-state derivation step in `dailyEngine.ts`.

Suggested internal shape:

```ts
type DailySignalState = {
  energyLevel: "low" | "steady" | "high";
  clarityLevel: "low" | "steady" | "high";
  pressureLevel: "low" | "steady" | "high";
  focusKey: "maintenance" | "follow-through" | "execution";
  confidence: number;
};
```

Primary inputs:
- `chart.transit.taraBala`
- `chart.transit.supportLevel`
- `chart.transit.pressureLevel`
- `chart.transit.clarityLevel`

Required behavior:
- Tara bala is the primary daily-state driver.
- Moon-based transit modifiers refine tone.
- `generateStatelessDailyState()` may remain as a placeholder helper, but the main chart-driven daily engine should be the authoritative path for Phase 4 integration.

### Decision State
Refactor `decisionEngine.ts` and `scoring.ts` so category-specific evaluation happens through a clean internal decision-state layer before phrase rendering.

Suggested internal shape:

```ts
type DecisionState = {
  category: DecisionCategory;
  score: number;
  outcome: "favorable" | "neutral" | "caution";
  primaryDriver: string;
  secondaryDriver: string;
  confidence: number;
};
```

Primary inputs:
- phase/daily style modifiers derived from chart
- `chart.dasha`
- `chart.transit`
- Moon/Lagna-driven stability or clarity traits where relevant

Required behavior:
- Decision logic remains deterministic and category-limited.
- Outcome thresholds must be named constants, not inline numbers.
- Final guidance and rationale lines come from deterministic phrase selection keyed by outcome plus driver state.

## Phrase Bank Requirements

### Identity Phrase Bank
Current `ARCHETYPE_PHRASES` is too small and too generic for the spec target.

Phase 3 should expand the identity phrase bank toward the product shape:
- core line
- emotional line
- decision line
- pattern line
- failure line

Even if the external response shape is still adapted later in Phase 4, the phrase-bank data should be rich enough now to support that structure.

### Phase Phrase Bank
Must support:
- state label
- short summary
- opportunity/support action
- risk/caution action

### Daily Phrase Bank
Must support:
- signal tone
- pressure/caution
- edge/guidance

### Decision Phrase Bank
Must support:
- short action-oriented guidance
- compact rationale or reasons
- category-safe deterministic tone

## Deterministic Selection Rules
- Use `deterministicPick()` for all phrasing selection.
- Phrase selection seeds should combine:
  - stable chart-derived keys
  - explicit user seed where available
  - current date only when the product concept is daily-state-specific

Avoid using full timestamps for phrase selection unless the timestamp is normalized to a stable day boundary.

## Constants and Scoring
Phase 3 should move interpretation thresholds and mapping constants into named structures instead of scattering them across engines.

Expected examples:
- identity modifier maps
- phase state maps by dasha lord combinations
- daily state thresholds from tara/transit inputs
- decision thresholds and category weighting maps

These may live in:
- `src/lib/engine/scoring.ts`
- `src/lib/astro/constants.ts`
- or a new engine-specific constant structure if it stays within Phase 3 scope

## Testing Requirements
Phase 3 must add engine-level tests for:
- archetype mapping
- lagna expression mapping
- mahadasha/antardasha phase mapping
- tara/transit daily-state mapping
- decision threshold behavior across multiple categories
- deterministic phrase selection stability
- time-unknown degradation behavior where relevant

Tests should prefer explicit assertions over snapshots.

## Non-Goals
- Do not redesign the Phase 2 chart contract.
- Do not change route handler request shapes yet unless absolutely required.
- Do not add persistence.
- Do not add long-form copy.
- Do not implement broad transit interpretation beyond the existing Phase 2 inputs.

## Risks to Guard Against
- Mixing internal rule derivation with phrase selection in the same branch-heavy code path
- Letting decision scoring become a generic hash-only output with no chart-derived meaning
- Keeping phrase banks too shallow to support the product response structure later
- Reintroducing non-determinism through implicit current time usage
- Overfitting identity to Lagna and weakening the Moon-led fallback for time-unknown mode

## Deliverable Expectation for Planning
Phase 3 plans should likely separate into:
1. internal state and scoring foundation
2. phrase-bank expansion and renderer alignment
3. engine integration plus tests

That split fits both the roadmap’s 3-plan estimate and the clean state pipeline architecture.
