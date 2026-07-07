---
status: awaiting_human_verify
trigger: "Uncaught TypeError: can't access property 'length', e is undefined — crashes app when navigating to /dashboard after entering birth details"
created: 2026-04-29T00:00:00Z
updated: 2026-04-29T00:00:00Z
---

## Current Focus

hypothesis: Multiple motion.* elements throughout the user flow (/ → /loading-screen → /dashboard) are missing `initial` props that cover the properties they animate. Framer-motion v12 reads CSS computed values via getComputedStyle() when `initial` is absent; "none" (the CSS default for scale/rotate shorthand) is unparseable, returns undefined, and crashes on undefined.length.
test: Audit every motion.* element in the full user flow for (a) animate prop with transform properties and (b) matching initial prop
expecting: Several elements found missing initial props; fix all in one pass
next_action: Apply all fixes

## Symptoms

expected: After submitting birth details on /, user is taken through /loading-screen and lands on /dashboard without errors
actual: Application error page shown — "a client-side exception has occurred"
errors: |
  Uncaught TypeError: can't access property "length", e is undefined
  (Firefox error format; originates in framer-motion minified code where `e` is the parsed initial CSS value)
reproduction: Enter birth details → submit → crash occurs during /loading-screen or /dashboard render
started: Persistent across multiple fix rounds. Fix attempt #4+.

## Eliminated

- hypothesis: @vercel/analytics causing Suspense boundary crash
  evidence: already removed (fix #1)
  timestamp: prior session

- hypothesis: app/page.tsx motion.div missing initial scale/opacity/rotate
  evidence: already fixed with initial={{ scale: 1, opacity: 0.88, rotate: 0 }} (fix #2)
  timestamp: prior session

- hypothesis: app/relic/page.tsx yantra div missing initial rotate/scale
  evidence: already fixed (fix #3)
  timestamp: prior session

- hypothesis: loading-screen yantra outer/inner divs missing initial
  evidence: already fixed (fix #4, #5)
  timestamp: prior session

- hypothesis: loading-screen motion.main missing initial
  evidence: already fixed (fix #6)
  timestamp: prior session

- hypothesis: loading-screen glow dot missing initial opacity
  evidence: already fixed (fix #7)
  timestamp: prior session

- hypothesis: DecisionSection sliding underline missing initial
  evidence: already fixed with initial={false} (fix #8)
  timestamp: prior session

## Evidence

- timestamp: 2026-04-29T00:00:00Z
  checked: app/relic/page.tsx — yantra motion.div
  found: Has initial={{ rotate: 0, scale: 1 }} covering all animated props (rotate, scale). CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: app/relic/page.tsx — wordmark motion.div
  found: initial={{ opacity: 0 }}, animate={{ opacity: 1 }}. No transform props. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: app/relic/page.tsx — decorative divider motion.div
  found: initial={{ opacity: 0, scaleX: 0 }}, animate={{ opacity: 1, scaleX: 1 }}, style={{ transformOrigin: "center" }}
  NOTE: style has NO inline `transform: "..."` string — transformOrigin is NOT a transform shorthand. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: app/relic/page.tsx — motion.span (word-by-word headline)
  found: Uses variants wordVariants with hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }. No scale/rotate. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/landing/BirthForm.tsx — motion.div wrappers (custom=0,1,2,3)
  found: All use variants approach: hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 }. No scale/rotate. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/landing/BirthForm.tsx — motion.button (submit)
  found: whileHover={{ y: -2, boxShadow: ... }}, whileTap={{ scale: 0.98, y: 0 }}. NO `initial` prop set. style has no transform string.
  implication: whileHover/whileTap are gesture props, not animate. Framer-motion reads CSS baseline for hover/tap too. scale: 0.98 in whileTap — if CSS computed scale is "none", crash. SUSPICIOUS.

- timestamp: 2026-04-29T00:00:00Z
  checked: app/loading-screen/page.tsx — progress bar motion.div
  found: initial={{ scaleX: 0 }}, animate={{ scaleX: 1 }}. style has NO transform string. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: app/loading-screen/page.tsx — glow dot motion.div
  found: initial={{ opacity: 0.6 }}, animate={{ opacity: [0.6, 1, 0.6] }}. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/dashboard/PhaseSection.tsx — intensity dots motion.div
  found: animate={isCritical && filled ? { opacity: [1, 0.4, 1] } : {}}. NO `initial` prop. No style transform string.
  implication: When isCritical is false, animate={} (empty). No crash risk. When isCritical is true, animates opacity only — opacity CSS default is "1" (parseable as number). LOW RISK but technically missing initial.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/dashboard/DecisionSection.tsx — motion.p (action word: WAIT/ACT/AVOID)
  found: initial={{ scale: shouldReduce ? 1 : 0.95 }}, animate={{ scale: 1 }}. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/dashboard/DecisionSection.tsx — shadow_caveat motion.div
  found: initial={{ opacity: 0 }}, animate={{ opacity: 1 }}. No transform props. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/ui/SettingsDropdown.tsx — motion.button (gear icon)
  found: whileHover={{ rotate: 45 }}. NO `initial` prop. style={{ background: "none", border: "none", display: "flex" }} — no transform string.
  implication: whileHover animates rotate. CSS computed rotate = "none". When user hovers, crash. CONFIRMED BUG.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/ui/SettingsDropdown.tsx — dropdown motion.div (AnimatePresence)
  found: initial={{ opacity: 0, scale: 0.95, y: -4 }}, animate={{ opacity: 1, scale: 1, y: 0 }}. Has initial covering scale. CLEAN.

- timestamp: 2026-04-29T00:00:00Z
  checked: components/dashboard/TodaySection.tsx — left border motion.div (scaleY)
  found: initial={{ scaleY: 0 }}, whileInView={{ scaleY: 1 }}. CLEAN.

## Resolution

root_cause: |
  Two motion elements are missing `initial` props that cover transform properties they gesture-animate:
  1. BirthForm.tsx submit button: whileTap={{ scale: 0.98 }} with no initial — framer-motion reads CSS computed scale ("none") on tap, crashes.
  2. SettingsDropdown.tsx gear button: whileHover={{ rotate: 45 }} with no initial — framer-motion reads CSS computed rotate ("none") on hover, crashes.
  The SettingsDropdown crash is on the dashboard (guaranteed to be reached). The BirthForm crash is on the form submit button on /relic (tapping it triggers whileTap before navigation).

fix: |
  BirthForm.tsx motion.button: add initial={{ scale: 1 }}
  SettingsDropdown.tsx motion.button: add initial={{ rotate: 0 }}

verification: empty
files_changed:
  - components/landing/BirthForm.tsx
  - components/ui/SettingsDropdown.tsx
