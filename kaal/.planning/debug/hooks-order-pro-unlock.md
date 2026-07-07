---
status: awaiting_human_verify
trigger: "Uncaught Error: Rendered more hooks than during the previous render when attempting to unlock the pro version"
created: 2026-04-29T00:00:00Z
updated: 2026-04-29T00:00:00Z
---

## Current Focus

hypothesis: PaywallModal has two useState calls split by an early return — useState(loading) is before `if (!open) return null`, useState(error) is AFTER it. React sees different hook count between renders where open=false vs open=true.
test: Read PaywallModal.tsx — confirmed violation at lines 15 and 38 bracketing the early return at line 17.
expecting: Moving all hooks before the early return will fix the hooks-order error.
next_action: Fix PaywallModal.tsx — move useState(error) before the early return, and remove dead useSubscription import/call.

## Symptoms

expected: Clicking "unlock pro" / navigating to upgrade/pricing page works without error
actual: Application error: "a client-side exception has occurred" — "Uncaught Error: Rendered more hooks than during the previous render"
errors: |
  Uncaught Error: Rendered more hooks than during the previous render.
  (React hooks rules violation — hooks called in different order between renders)
timeline: Unknown — git log shows prior fixes: "fix: remove useUser from upgrade page" and "fix: remove useSubscription from upgrade page to fix hooks error". Pattern of hooks issues on upgrade/paywall flow.
reproduction: Attempt to unlock/access pro version on the deployed site — triggers PaywallModal open state change

## Eliminated

- hypothesis: upgrade/page.tsx has the violation
  evidence: upgrade/page.tsx only has useState(loading) and useState(error) both before any early return — clean
  timestamp: 2026-04-29T00:00:00Z

- hypothesis: pricing/page.tsx has the violation
  evidence: pricing/page.tsx calls useReducedMotion and useUser both unconditionally at top — clean
  timestamp: 2026-04-29T00:00:00Z

## Evidence

- timestamp: 2026-04-29T00:00:00Z
  checked: PaywallModal.tsx lines 13-38
  found: |
    Line 14: const { handleUpgrade } = useSubscription();  ← hook #1 (calls useUser internally)
    Line 15: const [loading, setLoading] = useState(false); ← hook #2
    Line 17: if (!open) return null;                        ← EARLY RETURN
    Line 38: const [error, setError] = useState("");        ← hook #3 — AFTER early return
  implication: When open=false, React renders 2 hooks. When open=true, React renders 3 hooks. This violates the Rules of Hooks and triggers "Rendered more hooks than during the previous render".

- timestamp: 2026-04-29T00:00:00Z
  checked: useSubscription.ts and PaywallModal.tsx
  found: PaywallModal imports handleUpgrade from useSubscription but never calls it — it has its own inline checkout logic. useSubscription is dead code in this component.
  implication: Can safely remove useSubscription import and call, simplifying component.

- timestamp: 2026-04-29T00:00:00Z
  checked: SettingsDropdown.tsx
  found: Clean — all hooks (useRouter, useUser) called unconditionally before any conditional logic.
  implication: Not the source of the error.

## Resolution

root_cause: PaywallModal.tsx violates Rules of Hooks — useState("") for the error state is declared AFTER the early return `if (!open) return null`. When open transitions from false to true (user opens the paywall), React detects a different number of hooks than the previous render and throws "Rendered more hooks than during the previous render". Additionally useSubscription is called but unused.
fix: Move useState(error) declaration to before the early return; remove unused useSubscription import and call.
verification: 
files_changed: [src/components/ui/PaywallModal.tsx]
