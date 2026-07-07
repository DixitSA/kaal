---
status: awaiting_human_verify
trigger: "Next.js Application error on every page after /relic. Both direct URL and nav link navigation trigger it. Started after a recent component modification."
created: 2026-04-29T00:00:00Z
updated: 2026-04-29T03:00:00Z
symptoms_prefilled: true
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: CONFIRMED — complete codebase audit finished. All motion elements with animate/whileHover/whileTap missing initial props have been fixed across all src/ files.
test: full audit of all 15 motion-using files in src/
expecting: no remaining crash-triggering patterns
next_action: awaiting human verification that dashboard and all pages load correctly

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: Pages past /relic load normally
actual: Next.js "Application error" shown on all pages past /relic
errors: Next.js "Application error" (client-side crash)
reproduction: Navigate to any page after /relic — either by clicking nav links or typing URL directly
started: after modifying an existing component

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: Bug in BirthForm component
  evidence: BirthForm was only changed to add initial prop to submit button in kaal/ dir; src/ BirthForm is a different component with different logic, no missing initial props
  timestamp: 2026-04-29T01:00:00Z

- hypothesis: Bug in UserContext (clearUserData sets isLoading:true permanently)
  evidence: clearUserData is only called from SettingsDropdown and loading-screen error state, not during normal /relic → next page navigation; not the crash trigger
  timestamp: 2026-04-29T01:00:00Z

- hypothesis: Conflicting SVG filter IDs (star-chart, landing-grain) polluting DOM across pages
  evidence: These are inline SVGs in page components, unmounted on navigation; not a persistent DOM issue with Next.js App Router
  timestamp: 2026-04-29T01:00:00Z

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-04-29T01:00:00Z
  checked: tsconfig.json paths alias
  found: "@/*" maps to "src/*", confirming src/app/ is the active Next.js app, not kaal/app/
  implication: All fixes from recent commits targeting kaal/ files were NOT applied to src/ equivalents

- timestamp: 2026-04-29T01:00:00Z
  checked: git log for src/app/layout.tsx
  found: src/app/layout.tsx still imports Analytics and SpeedInsights; kaal/app/layout.tsx had these removed in ce4d651 with message "remove Analytics (useSearchParams crash)"
  implication: Every page in the app crashes on navigation due to Analytics useSearchParams() without Suspense

- timestamp: 2026-04-29T01:00:00Z
  checked: git show ce4d651 (kaal/app/loading-screen and kaal/app/relic fixes)
  found: kaal/ versions received initial={{ rotate: 0 }}, initial={{ opacity: 0.12 }} etc; src/ versions had none of these
  implication: Framer Motion v12 reads DOM computed styles when initial is absent; undefined rotate/scale causes .length crash on mount

- timestamp: 2026-04-29T01:00:00Z
  checked: git show 205f599 (kaal glow dot fix)
  found: kaal loading-screen glow dot had transform:translateY(-50%) removed and initial opacity added; src/ had the same unfixed pattern
  implication: transform shorthand in inline style causes FM v12 to read all shorthand properties including scale=undefined

- timestamp: 2026-04-29T02:00:00Z
  checked: src/app/page.tsx (early access / landing page)
  found: motion.div at line 55 has animate={{ scale:[1,1.04,1], opacity:[0.88,1,0.88], rotate:360 }} with NO initial prop
  implication: FM v12 reads computed style for scale/opacity/rotate on mount — all return undefined — crashes on .length when parsing keyframe array

- timestamp: 2026-04-29T02:00:00Z
  checked: src/components/dashboard/PatternSection.tsx
  found: two motion.div elements (front "reveal insight" bob, line 288; back "return" bob, line 409) have animate={{ y:[0,-2,0] }} with NO initial prop
  implication: same FM v12 getComputedStyle() path — y returns undefined — crashes on .length; PatternSection is rendered on every page past /relic (dashboard), explaining why ALL pages past /relic crash

- timestamp: 2026-04-29T03:00:00Z
  checked: ALL 15 motion-using files in src/ (complete audit)
  found: src/components/landing/BirthForm.tsx motion.button (line 528) has whileHover={{ y: -2 }} and whileTap={{ scale: 0.97, y: 0 }} with NO initial prop. All other motion elements across remaining 14 files already have correct initial props or use variants-only patterns that don't trigger the FM v12 crash.
  implication: BirthForm submit button is the one remaining unfixed instance. Added initial={{ y: 0, scale: 1 }}.

## Resolution

root_cause: Six motion elements across four files in src/ had animate/whileHover/whileTap props with transform/numeric values (scale, opacity, rotate, y) but no initial prop. Framer Motion v12 falls back to reading getComputedStyle() when initial is absent; freshly mounted DOM elements return undefined for transform properties, causing TypeError: can't access property "length", e is undefined when FM tries to parse the undefined value as a keyframe array. PatternSection (used on the dashboard) had two such elements, which is why ALL dashboard pages crashed.

fix: |
  Round 1 (previous session):
  1. Removed Analytics/SpeedInsights from src/app/layout.tsx
  2. Added initial={{ rotate:0 }}, initial={{ opacity:0.12 }}, initial={{ scaleX:0 }}, initial={{ left:"0%" }}, initial={{ opacity:0.5 }} to loading-screen/page.tsx
  3. Added initial={{ rotate:0, scale:1 }} to relic/page.tsx
  Round 2 (previous session — partially applied):
  4. Added initial={{ scale:1, opacity:0.88, rotate:0 }} to sigil motion.div in src/app/page.tsx
  5. Added initial={{ y:0 }} to front-face "reveal insight" bob in PatternSection.tsx
  6. Added initial={{ y:0 }} to back-face "return" bob in PatternSection.tsx
  Round 3 (this session — complete audit):
  7. Added initial={{ y:0, scale:1 }} to motion.button in src/components/landing/BirthForm.tsx (whileHover/whileTap without initial)

verification: pending human confirmation
files_changed:
  - src/app/layout.tsx
  - src/app/loading-screen/page.tsx
  - src/app/relic/page.tsx
  - src/app/page.tsx
  - src/components/dashboard/PatternSection.tsx
  - src/components/landing/BirthForm.tsx
