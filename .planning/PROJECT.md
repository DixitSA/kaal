# Kaal

## What This Is
Kaal is a backend-first life navigation system that uses Vedic astrology as a hidden computation layer for a mobile-first product. It computes sidereal chart primitives, converts them into compact internal states, and returns short structured JSON for identity, phase, daily state, and decision guidance.

## Core Value
Kaal turns complex astrology inputs into deterministic, jargon-free guidance for normal users navigating life. The product is not a chart reader, horoscope engine, or long-form report generator; it is a compact decision-support backend with stable outputs.

## Who It's For
Normal users who want short, practical guidance about identity, timing, daily state, and preset life decisions without needing to study astrology.

## Requirements

### Validated
(None yet - ship to validate)

### Active
- [ ] R1. Compute sidereal chart primitives with Lahiri ayanamsha as the default and return typed chart outputs.
- [ ] R2. Support both exact-time mode and time-unknown mode without crashing, including internal confidence handling.
- [ ] R3. Implement a dedicated astrology adapter around `swisseph` plus reusable constants and helper calculations for signs, nakshatras, padas, houses, dasha, transits, and tara bala.
- [ ] R4. Generate a deterministic identity profile driven primarily by Moon nakshatra and Lagna, with planetary influence modifiers.
- [ ] R5. Generate a deterministic phase profile driven primarily by Vimshottari mahadasha and antardasha state.
- [ ] R6. Generate a deterministic daily state driven primarily by tara bala plus simple Moon-based transit modifiers.
- [ ] R7. Generate deterministic preset-category decision outcomes for career, relationships, money, travel, move, and communication.
- [ ] R8. Render all user-facing outputs from stable phrase banks so responses remain short, modern, deterministic, and jargon-free.
- [ ] R9. Expose four validated route handlers for chart computation, profile generation, decision evaluation, and a clean placeholder for daily user state.
- [ ] R10. Use TypeScript, Next.js App Router route handlers, Zod validation, modular architecture, typed interfaces, and pure functions wherever possible.
- [ ] R11. Add automated tests across astrology logic, engine logic, and API validation/success flows.
- [ ] R12. Keep v1 local-first and database-free unless absolutely necessary, while leaving clean seams for future persistence and engine expansion.

### Out of Scope
- Chart visualization
- Astrology education workflows
- Verbose reports or long narrative paragraphs
- Random AI-style insight generation
- Free-text decision evaluation
- Database-backed persistence for v1 unless implementation proves it is unavoidable

## Constraints
- Default to sidereal computation with Lahiri ayanamsha.
- Treat Moon nakshatra, Lagna, Vimshottari dasha, and tara bala plus simple Moon-based transits as the v1 backbone.
- Keep all final user-facing copy concise, deterministic, and free of astrology jargon.
- No LLM is required for core interpretation logic.
- If phrasing variation is needed, use deterministic phrase banks and stable hashing rather than freeform generation.
- Wrap all `swisseph` usage in `src/lib/astro/adapter.ts` so the ephemeris provider can be swapped later.
- Keep functions small, typed, and modular with no `any` and no unexplained magic numbers.
- The backend must run locally first.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Project definition source | Imported from the user-provided specification | Plan directly from the supplied backend PRD instead of running broad discovery |
| Product scope | User explicitly constrained the product shape | Build a deterministic backend for identity, phase, daily state, and decision outputs, not a chart-reader or horoscope app |
| Astrology backbone | User confirmation after spec import | Use Lahiri ayanamsha with Moon nakshatra, Lagna, Vimshottari dasha, and tara bala plus simple Moon-based transits as the v1 backbone |
| Output strategy | Product principles require stable behavior | Use deterministic phrase banks, hashing, and short modern copy with no astrology jargon in API responses |
| Tech stack | User requirement | Use TypeScript, Next.js App Router route handlers, and Zod |
| Ephemeris isolation | Swapability and maintainability | Contain all `swisseph` integration inside a dedicated astrology adapter layer |
| Persistence strategy | User requested local-first delivery | Avoid a database in v1 and keep `/api/today/[userId]` ready for later persistence |
| Execution mode | User selection | Autonomous |
| Planning depth | User selection | Standard |
| Cost profile | User selection | Balanced |

## Architecture Influences
- Organize the backend as a four-stage pipeline: astrology computation, internal interpretation, output rendering, and API delivery.
- Preserve the requested folder structure under `src/app`, `src/lib`, and `tests` unless a clearly better structure is required during implementation.
- Keep interpretation logic deterministic and separate from raw chart calculation.
- Model exact-time and time-unknown behavior explicitly in types and engine outputs, including confidence-aware fallbacks.
- Prefer pure functions and typed domain modules so the same logic can be reused by route handlers, tests, and future clients.

---
*Last updated: 2026-04-06 after initialization*
