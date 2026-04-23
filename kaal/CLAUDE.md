@AGENTS.md

# Kaal Frontend

## Stack
- Next.js 16+ (App Router), Tailwind CSS v4, TypeScript
- Fonts: Playfair Display (serif), Inter (sans) via `next/font/google`

## Commands
- `npm run dev` — dev server
- `npm run build` — prod build (verify after changes)
- `npm run lint` — linter

## Code Style
- TypeScript all files (.tsx, .ts)
- ES modules, not CommonJS
- Tailwind only — no extra CSS files except globals.css
- Functional components + hooks, no classes
- PascalCase components, camelCase utilities

## Architecture
- Routes: / (landing), /loading-screen, /dashboard
- UserContext holds form data
- localStorage for session persistence
- Mock data in `data/mock.ts` — no API calls
- SVG elements as React components, not image files

## Tailwind v4
- No `tailwind.config.ts` — tokens in `globals.css` under `@theme`
- Colors: cream, charcoal, warm-grey, terracotta, brass-gold, act-green, avoid-red
- Fonts: `--font-playfair`, `--font-inter` (from next/font CSS vars)

## Design Rules
- NO cards/boxes/containers on dashboard. Content on page directly.
- Playfair Display for headlines/emotional content. Inter for data/labels.
- "you" voice: "you internalize pressure" not "observation as defense mechanism"
- No astrology terms. No zodiac, planets, mercury retrograde.
- Background cream (#F5F0E8) all pages.
- Terracotta (#B5563E) only primary accent.

## Gotchas
- /loading-screen and /dashboard redirect to / if no user data in context
- `localStorage` check in `useEffect` — avoid SSR hydration mismatch
- `next/font/google` for fonts — no `<link>` tags
- Route must be `/loading-screen` not `/loading` (Next.js reserves `loading.tsx`)
- Font CSS vars: `--font-playfair-display`, `--font-inter-var` (set in `layout.tsx`)
