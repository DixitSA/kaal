@AGENTS.md

# Kaal Frontend

## Stack
- Next.js 15 (App Router), Tailwind CSS v4, TypeScript
- Fonts: Playfair Display (serif), Inter (sans), Quattrocento Sans via `next/font/google`
- Animation: framer-motion
- Testing: Vitest

## Commands
- `npm run dev` — dev server
- `npm run build` — prod build (must pass before committing)
- `npx vitest run` — run tests

## Architecture

### User flow
Landing form (`/`) → `/loading-screen` → `runProfilePipeline()` → `/dashboard`

### Data pipeline
`runProfilePipeline()` in `src/lib/client/kaalApp.ts`:
1. POST `/api/chart/compute` — computes `ChartPrimitives` via astronomia (VSOP87B/ELP) locally
2. POST `/api/python/profile` — optional Python/Groq narrative layer (proxied through Next.js)
3. Falls back to local TS engines when Python backend is unavailable

### Context
`UserContext` (`src/context/UserContext.tsx`) holds:
- `userData: KaalIntake | null` — birth form values, persisted in localStorage
- `computedData: KaalSnapshot | null` — full computed profile, persisted in localStorage
- `isLoading: boolean` — true until localStorage hydration completes

### KaalSnapshot shape
```
chart: ChartPrimitives      — planet positions, dasha, transit, houses
identity: IdentityProfile   — archetype, traits, watchouts
phase: PhaseProfile         — current MD×AD phase label + tags + biases
daily: DailyState           — signal tone, guidance, caution, tara bala
decisions: Record<category, DecisionEvaluation>
intensity: IntensityResult  — score/level/breakdown (low|medium|high|critical)
```

### Computation engines
- `src/lib/astro/adapter.ts` — orchestrates ephemeris (astronomia ≫ polynomial fallback)
- `src/lib/astro/calculateIntensity.ts` — MD/AD base + transit modifiers → score
- `src/lib/engine/phaseEngine.ts` — MD×AD matrix via `src/lib/content/phaseMatrix.ts`
- `src/lib/engine/identityEngine.ts` — Moon nakshatra → archetype + identity profile
- `src/lib/engine/dailyEngine.ts` — transit state → daily signal
- `src/lib/engine/decisionEngine.ts` — house lord dignity per category → ACT/WAIT/AVOID

### API routes (Next.js)
- `/api/chart/compute` — chart computation (server-side, uses adapter)
- `/api/python/profile` — proxy to external Python/Groq service
- `/api/location/lookup` — geocoding via open-meteo
- `/api/decision/evaluate` — single-category decision (used in tests)
- `/api/profile/generate` — full profile (used in tests)
- `/api/today/[userId]` — daily refresh endpoint

### Dashboard components
All in `src/components/dashboard/`:
- `PhaseSection` — current phase, 4-level intensity dots (pulse on critical), phase tags
- `TodaySection` — daily signal + tara bala chip
- `DecisionSection` — tabbed ACT/WAIT/AVOID per category, shadowCaveat when present
- `PatternSection` — flippable identity card (gana front / traits back)

## Code Style
- TypeScript strict — no `any` except in calculateAstronomia.ts (dynamic import)
- ES modules only
- Functional components + hooks, no class components
- PascalCase components, camelCase utilities, SCREAMING_SNAKE for constants
- Tailwind v4 utility classes for layout/spacing; inline `style={}` for design tokens

## Tailwind v4
- No `tailwind.config.ts` — all tokens in `src/app/globals.css` under `@theme`
- Design tokens: cream (#F5F0E8), charcoal (#2C2418), warm-grey (#7A7469), terracotta (#B5563E)

## Design Rules
- NO cards/boxes/containers on dashboard — content sits directly on page
- Playfair Display for all headlines and emotional content
- Inter for data labels, chips, metadata (11-12px, tracking)
- Quattrocento Sans for body text blocks
- Cream background (#F5F0E8) on all pages
- Terracotta (#B5563E) as the only primary accent; #A04040 for critical/danger states
- Text always lowercase via `textTransform: "lowercase"` — never ALL CAPS in content

## Environment Variables
- `KAAL_API_URL` — server-side URL for Python/Groq backend (optional)
- `NEXT_PUBLIC_KAAL_API_URL` — client-side fallback URL for same backend
- `KAAL_DISABLE_REMOTE_GEOCODING` — set to "true" to skip open-meteo in tests
- `KAAL_GEOCODING_BASE_URL` — override geocoding base URL

## Gotchas
- `/loading-screen` not `/loading` — Next.js reserves `loading.tsx`
- Font CSS vars: `--font-playfair-display`, `--font-inter-var`, `--font-quattrocento-sans`
- `localStorage` reads happen in `useEffect` to avoid SSR hydration mismatch
- `computedData.intensity?.level` is optional (backward compat) — always guard with `??`
- `phase.tags` is always present from both local TS and Python paths
- Transit planet longitudes only available when astronomia is loaded; guard with `?.`
