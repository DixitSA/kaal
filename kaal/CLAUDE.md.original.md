@AGENTS.md

# Kaal Frontend

## Stack
- Next.js 16+ (App Router), Tailwind CSS v4, TypeScript
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

## Tailwind v4 Notes
- No tailwind.config.ts — design tokens live in globals.css under @theme
- Custom colors: cream, charcoal, warm-grey, terracotta, brass-gold, act-green, avoid-red
- Custom fonts: --font-playfair and --font-inter (mapped from next/font CSS vars)

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
- localStorage check happens in useEffect to avoid SSR hydration mismatch
- next/font/google handles font loading — do not use <link> tags
- Do NOT name the loading route /loading — Next.js reserves loading.tsx. Use /loading-screen instead.
- Font CSS variable names: --font-playfair-display and --font-inter-var (set in layout.tsx)
