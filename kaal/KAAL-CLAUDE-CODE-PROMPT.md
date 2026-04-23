# KAAL — Claude Code Build Instructions

## How to Use This File

This is your complete build spec for the Kaal frontend. Use it with Claude Code in three phases:

### Phase 1: Setup & Explore
```
Start a new Claude Code session. Paste:

"Read @KAAL-CLAUDE-CODE-PROMPT.md completely. Then scaffold the Next.js project with the file structure, install dependencies, configure Tailwind with the custom colors and fonts, and create the CLAUDE.md file. Don't build any pages yet — just the foundation. Run `npm run dev` to verify the dev server starts clean."
```

### Phase 2: Build Screen by Screen
```
After Phase 1 succeeds, run /clear, then:

"Read @KAAL-CLAUDE-CODE-PROMPT.md. The project is scaffolded. Build the Landing Page (/) exactly as specified. Run `npm run build` after to verify no errors. Take a screenshot if Chrome extension is available and compare to the reference mockup."

Then /clear again:

"Read @KAAL-CLAUDE-CODE-PROMPT.md. Landing page is done. Build the Loading Screen (/loading-screen) exactly as specified. Run `npm run build` to verify."

Then /clear again:

"Read @KAAL-CLAUDE-CODE-PROMPT.md. Landing and loading pages are done. Build the Dashboard (/dashboard) with all four sections and the interactive Decision section. Run `npm run build` to verify. Test that clicking each decision category changes the displayed result."
```

### Phase 3: Integration & Polish
```
/clear, then:

"Read @KAAL-CLAUDE-CODE-PROMPT.md. All three pages are built. Now wire the full flow: form submission on landing → loading screen with 3s timer → dashboard. Test localStorage persistence — returning users should skip to dashboard. Test the settings gear 'Clear profile' action. Run `npm run build` and `npm run dev`, verify the entire flow works end to end."
```

### Attach These Reference Images
With each phase, attach the three final mockup images:
1. Landing page (oversized serif headline, underline form fields, terracotta button)
2. Loading screen (centered Kaal wordmark, rotating italic text, progress line)
3. Dashboard (editorial layout, four sections, large WAIT text)

---

## CLAUDE.md (Create This File in Project Root)

```markdown
# Kaal Frontend

## Stack
- Next.js 14+ (App Router), Tailwind CSS, TypeScript
- Fonts: Playfair Display (serif headlines), Inter (sans-serif body) via next/font/google

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build (use this to verify after changes)
- `npm run lint` — run linter

## Code Style
- Use TypeScript for all files (.tsx, .ts)
- Use ES modules (import/export), not CommonJS
- Tailwind utility classes only — no separate CSS files except globals.css
- Components are functional with hooks, no class components
- File naming: PascalCase for components, camelCase for utilities

## Architecture
- Three routes: / (landing), /loading-screen, /dashboard
- React Context (UserContext) holds user form data
- localStorage for persistence across sessions
- Mock data in data/mock.ts — no API calls
- SVG visual elements are React components, not image files

## Design Rules — IMPORTANT
- NO cards, boxes, or containers on the dashboard. Content sits directly on the page.
- Serif (Playfair Display) for headlines and emotional content. Sans-serif (Inter) for data and labels.
- Every trait/insight line uses the "you" voice: "you internalize pressure" NOT "observation as a defense mechanism"
- No astrology terminology anywhere. No zodiac, planets, mercury retrograde.
- Background color is cream (#F5F0E8) on ALL pages.
- Terracotta (#B5563E) is the only primary accent color.

## Common Gotchas
- The loading page must redirect to / if no user data exists in context
- The dashboard must redirect to / if no user data exists in context
- localStorage check should happen in useEffect to avoid SSR hydration mismatch
- next/font/google handles font loading — do not use <link> tags
- Do NOT name the loading route /loading — Next.js reserves loading.tsx. Use /loading-screen instead.
```

---

## Project Specification

### Tech Stack
- **Framework:** Next.js 14+ with App Router, TypeScript
- **Styling:** Tailwind CSS v3+
- **Fonts:** Google Fonts via next/font/google — Playfair Display (serif), Inter (sans-serif)
- **State:** React Context for user data
- **Storage:** localStorage for returning user persistence
- **Animations:** CSS transitions + Tailwind animate utilities only

---

### Design Tokens (tailwind.config.ts)

```typescript
// Extend Tailwind config with these values:
colors: {
  cream:      '#F5F0E8',
  charcoal:   '#2C2418',
  warmGrey:   '#9C9488',
  terracotta: '#B5563E',
  brassGold:  '#A0884D',
  actGreen:   '#5E7A5E',
  avoidRed:   '#A04040',
}

fontFamily: {
  playfair: ['var(--font-playfair)'],
  inter:    ['var(--font-inter)'],
}
```

### Typography Scale (use these Tailwind classes consistently)

```
Hero headline:    font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold
Phase headline:   font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
Section headline: font-playfair text-xl sm:text-2xl md:text-3xl
Body large:       font-inter text-base sm:text-lg md:text-xl
Body:             font-inter text-sm sm:text-base
Label:            font-inter text-[10px] sm:text-xs uppercase tracking-[0.2em]
```

---

### Routing & Navigation

```
/               → Landing page (form-as-hero)
/loading-screen → Loading transition (3 second timer)
/dashboard      → Main dashboard (four sections)
```

**Navigation rules:**
- Landing → Loading: on form submit, save to context + localStorage, navigate to /loading-screen
- Loading → Dashboard: auto-navigate after 3 seconds
- Dashboard → Landing: via "Clear profile" in settings dropdown
- Returning user (data in localStorage): redirect from / to /dashboard on mount
- Direct visit to /loading-screen or /dashboard without data: redirect to /

---

### File Structure

```
kaal/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, UserProvider, BackgroundPattern
│   ├── page.tsx                # Landing page
│   ├── loading-screen/
│   │   └── page.tsx            # Loading screen
│   └── dashboard/
│       └── page.tsx            # Dashboard
├── components/
│   ├── svg/
│   │   ├── YantraMandala.tsx   # Circular yantra/mandala SVG
│   │   ├── DecorativeDivider.tsx # Lotus-bud horizontal divider SVG
│   │   └── BackgroundPattern.tsx # Tiling paisley/lotus background SVG
│   ├── landing/
│   │   └── BirthForm.tsx       # Form component with validation
│   ├── dashboard/
│   │   ├── PhaseSection.tsx    # Section 1: Current Phase
│   │   ├── TodaySection.tsx    # Section 2: Today
│   │   ├── DecisionSection.tsx # Section 3: Decision (interactive)
│   │   └── PatternSection.tsx  # Section 4: Your Pattern
│   └── ui/
│       ├── SectionDivider.tsx  # Hairline divider between sections
│       └── SettingsDropdown.tsx # Gear icon + dropdown
├── context/
│   └── UserContext.tsx         # React context: user data + localStorage sync
├── data/
│   └── mock.ts                # All mock data
├── CLAUDE.md
├── tailwind.config.ts
└── globals.css
```

**IMPORTANT:** Do not name the loading route `/loading` — Next.js reserves `loading.tsx` as a special file. Use `/loading-screen` instead.

---

### SVG Visual Elements

Build these as React components that render inline SVG. Do NOT use image files.

#### 1. YantraMandala.tsx
A circular geometric pattern with concentric circles and petal shapes radiating outward, inspired by rangoli floor art. Props: `size` (default 500), `opacity` (default 0.12), `className`. Color: #C4A96A (warm golden-brown). Used behind the landing page headline and the loading screen wordmark. On the loading screen, apply a slow CSS rotation animation (1 rotation per 20s).

#### 2. DecorativeDivider.tsx
A horizontal repeating pattern of small lotus-bud shapes connected by dots and thin lines. Props: `width` (default 300), `opacity` (default 0.25), `className`. Color: #C4A96A. Used between the landing page headline and form.

#### 3. BackgroundPattern.tsx
A subtle tiling pattern using simplified paisley teardrop shapes and small dot clusters. Applied as a fixed, full-viewport background via CSS. Opacity 6-8%. Color: #C4A96A. Applied in the root layout so it appears on ALL three screens. Use CSS `background-image` with an inline SVG data URI for efficient tiling.

---

### Screen 1: Landing Page (/)

**Layout:**
- Full viewport height (`min-h-screen`), content vertically and horizontally centered
- "Kaal" wordmark: top-left, fixed position, font-playfair text-xl, charcoal
- Content max-width: 600px, centered with padding

**Content stack (top to bottom, centered):**

1. **YantraMandala** — positioned absolute, centered behind headline, z-0, 500px, 12% opacity
2. **Headline** — `"know what's happening.\nknow what to do."` — hero size, font-playfair, bold, charcoal, text-center, z-10 relative
3. **DecorativeDivider** — centered, 300px wide, 20px vertical margin
4. **Form (BirthForm component):**
   - Full Name: text input, border-bottom only (1px warmGrey), no box, placeholder "Full Name" in warmGrey, font-inter text-lg, charcoal text
   - Date of Birth + Time of Birth: side by side on md+, stacked on mobile. DOB is type="date", TOB is type="time". Both have border-bottom only styling. Small uppercase labels above each ("DATE OF BIRTH", "TIME OF BIRTH") in label style, warmGrey
   - "I DON'T KNOW MY BIRTH TIME" — small checkbox + label below time field, label style, warmGrey
   - Place of Birth: text input, border-bottom only, placeholder "Place of Birth"
   - All inputs: bg-transparent, no outline on focus (or subtle terracotta underline on focus)
5. **Submit button** — `"GENERATE PROFILE →"` — full width, bg-terracotta, text-cream, font-inter, uppercase, tracking-widest, text-sm, py-4, rounded-sm. Hover: slightly darker terracotta.
6. **Footer text** — `"BUILT ON VEDIC TIMING SYSTEMS"` — label style, warmGrey, centered, mt-6

**Form validation:**
- Name required (min 1 character)
- DOB required
- Time of birth required UNLESS "I don't know" is checked
- Place of birth required
- On submit: save to UserContext + localStorage, router.push('/loading-screen')

**Animations:**
- Headline: fade in on mount, 0 → 1 opacity over 0.8s
- Form elements: stagger fade-in, 0.15s delay between each, starting 0.3s after headline
- Button: fade in last

**Verification:** After building, run `npm run build`. The page should render at localhost:3000 with the oversized headline visible and form fields functional. Submit with valid data should navigate to /loading-screen.

---

### Screen 2: Loading Screen (/loading-screen)

**Layout:**
- Full viewport height, everything centered (flex items-center justify-center)
- No nav bar, no other elements

**Content (centered vertically):**

1. **YantraMandala** — positioned absolute, centered behind wordmark, 400px, 15% opacity, CSS animation: `slow-spin 20s linear infinite`
2. **"Kaal" wordmark** — font-playfair text-3xl sm:text-4xl, charcoal, relative z-10
3. **Rotating status text** — font-playfair italic, text-base sm:text-lg, warmGrey. Use React state to cycle through three messages every 1s with a fade transition (opacity 0→1→0):
   - "mapping your pattern…"
   - "reading your current phase…"
   - "calculating today's signal…"
4. **Progress line** — 200px wide, 2px tall container in warmGrey at 20% opacity. Inner fill animates from width 0 to 100% over 3s, terracotta colored.

**Behavior:**
- On mount: check if user data exists in context. If not, redirect to /
- After 3 seconds: router.push('/dashboard')

**Verification:** Navigate to /loading-screen with valid context data. The three messages should cycle, the progress bar should fill, and after 3 seconds the page should redirect to /dashboard.

---

### Screen 3: Dashboard (/dashboard)

**Layout:**
- "Kaal" wordmark top-left (font-playfair text-xl charcoal, p-6)
- Settings gear icon top-right (simple SVG gear, 20px, warmGrey, cursor-pointer, p-6)
- Content: max-w-2xl (720px) mx-auto, px-6, pt-24 pb-32
- Sections separated by ~80-100px vertical space
- SectionDivider (1px hairline, warmGrey at 30% opacity) between each section

**Guard:** On mount, check user data in context. If missing, check localStorage. If still missing, redirect to /.

#### Section 1: PhaseSection

```
Label:       "CURRENT PHASE" — label style, brassGold
Headline:    "pressure and discipline" — phase headline size, charcoal, mt-3
Summary:     "life is asking for consistency, not speed" — font-playfair italic text-lg, warmGrey, mt-4
Opportunity: "OPPORTUNITY" label (terracotta) + "slow effort compounds right now" (body, charcoal) — mt-8
Risk:        "RISK" label (terracotta) + "forcing results creates frustration" (body, charcoal) — mt-4
```

#### Section 2: TodaySection

```
Label:       "TODAY" — label style, brassGold
Signal:      "mixed day. act only on what is already clear" — section headline, charcoal, mt-3
Pressure:    border-l-2 border-terracotta pl-4, "PRESSURE" label (terracotta), text below (body, charcoal) — mt-8
Edge:        border-l-2 border-terracotta pl-4, "EDGE" label (terracotta), text below (body, charcoal) — mt-6
```

#### Section 3: DecisionSection (interactive)

```
State: activeCategory (default: "career")

Label:       "DECISION" — label style, brassGold
Categories:  Six inline text buttons in a flex-wrap row, gap-x-6 gap-y-2, mt-4
             Active: text-terracotta border-b-2 border-terracotta pb-1 font-inter text-sm
             Inactive: text-warmGrey border-b-2 border-transparent pb-1 font-inter text-sm hover:text-charcoal
Result:      action word in font-playfair text-5xl sm:text-6xl md:text-7xl font-bold, centered, mt-10
             WAIT → text-terracotta
             ACT → text-actGreen
             AVOID → text-avoidRed
Reason:      body, warmGrey, centered, mt-4
Risk line:   "risk: {text}", body, warmGrey/70, centered, mt-1
```

Clicking a different category should immediately swap the displayed result. Add a subtle opacity transition (150ms) on the result block.

#### Section 4: PatternSection

```
Label:       "YOUR PATTERN" — label style, brassGold
Headline:    "you move carefully, but not weakly" — font-playfair italic text-2xl sm:text-3xl, charcoal, mt-3
Traits:      Three <p> lines, body, charcoal, space-y-3, mt-8
Failure:     "you hold too much for too long, then shut down" — font-playfair italic text-sm, warmGrey, mt-8
Archetype:   "TYPE: STEWARD" — label style, brassGold, mt-6
```

#### SettingsDropdown

- Gear icon click toggles a small dropdown (absolute positioned, top-right)
- Dropdown: bg-cream border border-warmGrey/20 rounded-sm shadow-sm p-3
- One option: "Clear profile" — font-inter text-sm, charcoal, cursor-pointer, hover:text-terracotta
- Clicking "Clear profile": clear localStorage, reset context, router.push('/')
- Click outside dropdown: close it (useEffect with document click listener)

**Verification:** All four sections should render with correct typography hierarchy. Clicking decision categories should change the action/reason/risk. Settings gear should open dropdown. "Clear profile" should redirect to landing page.

---

### Mock Data (data/mock.ts)

```typescript
export const mockData = {
  phase: {
    name: "pressure and discipline",
    summary: "life is asking for consistency, not speed",
    opportunity: "slow effort compounds right now",
    risk: "forcing results creates frustration",
  },
  today: {
    signal: "mixed day. act only on what is already clear",
    pressure: "uncertainty triggers overcorrection",
    edge: "small disciplined moves work better than big emotional ones",
  },
  decisions: {
    career: {
      action: "WAIT" as const,
      reason: "timing is active, but clarity is not",
      risk: "acting now creates cleanup later",
    },
    relationships: {
      action: "ACT" as const,
      reason: "openness is supported right now",
      risk: "hesitation reads as disinterest",
    },
    money: {
      action: "WAIT" as const,
      reason: "the numbers aren't settled yet",
      risk: "premature commitment locks you in",
    },
    travel: {
      action: "ACT" as const,
      reason: "movement creates new input",
      risk: "over-planning kills the momentum",
    },
    move: {
      action: "AVOID" as const,
      reason: "the ground isn't stable enough",
      risk: "relocation now compounds instability",
    },
    communication: {
      action: "ACT" as const,
      reason: "your words land well today",
      risk: "silence is being misread",
    },
  },
  pattern: {
    headline: "you move carefully, but not weakly",
    traits: [
      "you internalize pressure before reacting",
      "you wait for clarity, then move cleanly",
      "you stay steady while others become inconsistent",
    ],
    failure: "you hold too much for too long, then shut down",
    archetype: "steward",
  },
};

export type DecisionCategory = keyof typeof mockData.decisions;
export type ActionType = "WAIT" | "ACT" | "AVOID";
```

---

### UserContext (context/UserContext.tsx)

```typescript
interface UserData {
  name: string;
  dob: string;
  timeOfBirth: string;
  unknownTime: boolean;
  placeOfBirth: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
  isLoading: boolean; // true while checking localStorage on mount
}
```

- On setUserData: save to state AND localStorage key "kaal-user"
- On mount: check localStorage in useEffect, hydrate state if found, set isLoading to false
- On clearUserData: clear state AND remove "kaal-user" from localStorage
- Export useUser() hook for consuming context

---

### Global Styles (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #F5F0E8;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-subtle {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes progress-fill {
  from { width: 0%; }
  to { width: 100%; }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-subtle {
  animation: fade-in-subtle 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slow-spin {
  animation: slow-spin 20s linear infinite;
}

.animate-progress {
  animation: progress-fill 3s ease-out forwards;
}
```

---

## What NOT to Build

- No charts or data visualizations
- No social features or sharing
- No multiple pages beyond the three specified
- No authentication, accounts, or signup
- No API calls — everything uses mock data
- No dark mode toggle (v1 is warm cream only)
- No bottom navigation bar
- No hamburger menu
- No icons except the settings gear
- No card containers or box shadows on the dashboard
- No astrology terminology in any copy

---

## Verification Checklist

After the full build, verify each item. Run `npm run build` as the baseline — it must pass with zero errors.

1. [ ] `npm run build` completes with zero errors
2. [ ] Landing page: headline renders at hero scale, serif font
3. [ ] Landing page: form fields have underline-only styling (no boxes)
4. [ ] Landing page: submit button is terracotta with cream text
5. [ ] Landing page: form validation prevents empty submissions
6. [ ] Landing page: "I don't know" checkbox disables time field
7. [ ] Landing page → loading: submit saves data and navigates to /loading-screen
8. [ ] Loading screen: three messages cycle with fade transition
9. [ ] Loading screen: progress bar fills over 3 seconds
10. [ ] Loading screen: auto-redirects to /dashboard after 3 seconds
11. [ ] Loading screen: direct visit without data redirects to /
12. [ ] Dashboard: all four sections render with correct hierarchy
13. [ ] Dashboard: clicking decision categories changes action/reason/risk
14. [ ] Dashboard: WAIT is terracotta, ACT is green, AVOID is red
15. [ ] Dashboard: settings gear opens dropdown with "Clear profile"
16. [ ] Dashboard: "Clear profile" clears data and redirects to /
17. [ ] Dashboard: direct visit without data redirects to /
18. [ ] Returning user: visiting / with localStorage data redirects to /dashboard
19. [ ] Background SVG pattern visible on all three screens
20. [ ] Yantra visible behind landing headline and loading wordmark
21. [ ] Fonts load correctly (Playfair Display serif, Inter sans-serif)
22. [ ] Mobile responsive: form stacks on small viewports, text scales
