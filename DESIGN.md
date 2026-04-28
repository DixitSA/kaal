---
name: Kaal
description: Editorial Sanctuary — Vedic timing, luxe and grounded
colors:
  parchment-cream: "#F5F0E8"
  charcaol-ink: "#2C2418"
  warm-grey: "#7A7469"
  taupe-mist: "#9C9488"
  terracotta-clay: "#B5563E"
  terracotta-text: "#8B3620"
  terracotta-btn: "#C75B3A"
  terracotta-btn-hover: "#A65D46"
  brass-gold: "#786030"
  muted-sage: "#5E7A5E"
  avoid-red: "#A04040"
  olive-dark: "#4A4F46"
  faded-gold: "#B4A878"
  light-parchment: "#F5F2E9"
  soft-charcoal: "#2C2C2C"
  bright-terracotta: "#BC5434"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 1.5vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.04em"
  label:
    fontFamily: "Quattrocento Sans, Inter, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.12em"
    textTransform: "uppercase"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta-btn}"
    textColor: "{colors.parchment-cream}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-btn-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta-clay}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.2em"
    textTransform: "uppercase"
    borderBottom: "1px solid {colors.terracotta-clay}"
---

# Design System: Kaal

## 1. Overview

**Creative North Star: "The Editorial Sanctuary"**

Kaal is a high-end spiritual magazine brought to life as a Vedic timing app. Think Monocle meets ancient wisdom — tactile paper textures, editorial grids, sophisticated serif typography, and earthy luxury. The interface embodies the calm, intentional timing it teaches, with authoritative warmth like a seasoned Vedic counselor.

This system explicitly rejects new-age clichés (bright purple, neon gradients, starfield backgrounds, crystal clipart) and corporate SaaS sterility (corporate blue, card-heavy dashboards, generic templates). Instead, it dwells in the refined space between — luxurious but grounded, mystical but practical, ancient but contemporary.

**Key Characteristics:**
- Earthy palette rooted in parchment, terracotta, and sage
- Editorial typography with Playfair Display headlines and Inter body
- Mostly flat surfaces with subtle shadows for interactive states
- Ceremonial input underlines instead of bordered fields
- No cards as default — content flows editorial-style
- Uppercase micro-copy in spaced Outfit/Quattrocento Sans for ritual labels

## 2. Colors: The Earthy Editorial Palette

The palette draws from Vedic earth tones — parchment scrolls, terracotta clay, brushed brass, and forest sage. Every color has a role; no color is decorative.

### Primary

- **Terracotta Clay** (#B5563E): The accent for borders, dividers, and non-text elements. Used at 3.9:1 on cream — never for small text.
- **Terracotta Text** (#8B3620): Darkened terracotta for small labels and micro-copy. 5.6:1 on cream — passes WCAG AA for all text sizes.
- **Terracotta Button** (#C75B3A): Brighter terracotta for primary CTAs. High contrast on parchment cream.

### Neutral

- **Parchment Cream** (#F5F0E8): Primary background. Warmer than pure white, tinted toward terracotta.
- **Charcoal Ink** (#2C2418): Primary text color. Not pure black — tinted toward brown for warmth.
- **Warm Grey** (#7A7469): Navigation links, secondary text. Visible but receded.
- **Taupe Mist** (#9C9488): Muted text, citations, footer links. 3.2:1 on cream — for large text only.

### Secondary

- **Brass Gold** (#786030): Decorative accents, upgrade banners, phase highlights. 4.7:1 on cream — passes AA.
- **Muted Sage** (#5E7A5E): Success states, favorable tara indicators, positive signals.
- **Avoid Red** (#A04040): Error states, caution flags, unfavorable tara indicators. 5.2:1 on cream — passes AA.

### Named Rules

**The One Voice Rule.** Terracotta Clay is used on ≤15% of any given screen. Its rarity creates authority — when it appears, it means something.

**The Warm Tint Rule.** No `#000` or `#fff` anywhere. Every neutral is tinted toward the terracotta-brass hue family (chroma 0.005–0.01). Pure black or white feels clinical and breaks the editorial sanctuary.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)
**Label/Mono Font:** Quattrocento Sans (with Inter, sans-serif fallback)

**Character:** Editorial sophistication meets functional clarity. Playfair's high contrast brings magazine energy to headlines; Inter's neutrality keeps body text supremely readable at small sizes. Quattrocento Sans handles the ritual micro-copy — uppercase, spaced, intentional.

### Hierarchy

- **Display** (600, clamp(1.5rem, 5vw, 2rem), 1.2 line-height, 0.02em letter-spacing): Hero headlines, section headers (`Today`, `Phase`). Playfair Display only.
- **Headline** (600, 1.75rem, 1.3 line-height): Page titles, modal headers. Playfair Display.
- **Title** (500, 1.25rem, 1.4 line-height): Card titles, subsection heads. Inter or Quattrocento Sans.
- **Body** (400, clamp(0.875rem, 1.5vw, 1rem), 1.7 line-height, 0.04em letter-spacing, max 65–75ch): All body text, descriptions, guidance content. Inter.
- **Label** (500, 10px, 0.12em letter-spacing, uppercase): Form labels, nav items, focus areas, micro-copy. Quattrocento Sans or Inter.

### Named Rules

**The Lowercase Body Rule.** All body text, guidance, and descriptions are sentence-case or lowercase. Only labels, nav, and micro-copy are uppercase. The contrast creates rhythm — quiet content surrounded by intentional structure.

**The No-Em-Dash Rule.** Use commas, colons, semicolons, periods, or parentheses. Em dashes (—) are banned — they're the mark of AI-generated content and break the editorial sanctuary's human voice.

## 4. Elevation

Surfaces are mostly flat at rest. Depth comes from tonal layering (Parchment Cream background → white-ish overlays) and subtle border dividers (1px, low-opacity terracotta or charcoal). Shadows appear only as a response to state — button hovers get a slight lift, modals float with soft ambient blur, and focused inputs glow with the terracotta underline animation.

### Shadow Vocabulary

- **Ambient Low** (`0 2px 8px rgba(44,36,24,0.08)`): Button hover, interactive elements lifting.
- **Modal Overlay** (`0 0 0 9999px rgba(44,36,24,0.6)`): Paywall modal backdrop — warm charcoal overlay, not cold black.
- **Focus Glow** (`0 2px 0 #B5563E`): The ceremonial input underline — animated width expansion on focus.

### Named Rules

**The Flat-By-Default Rule.** All surfaces are flat until proven otherwise. Shadows appear only as a response to state (hover, focus, modal overlay). A resting card has no shadow.

**The Border-Not-Shadow Rule.** Depth and separation come from 1px borders at 8–12% opacity (rgba(122,116,105,0.08–0.12)), not from box-shadows. The editorial sanctuary uses typography and borders, not skeuomorphic depth.

## 5. Components

### Buttons

- **Shape:** Slightly rounded corners (4px radius)
- **Primary:** Terracotta Button (#C75B3A) background, Parchment Cream (#F5F0E8) text, 12px 24px padding, uppercase, 0.2em letter-spacing, 600 weight
- **Hover / Focus:** Darken to Terracotta Button Hover (#A65D46), subtle translateY(-1px) lift, 0.2s ease transition
- **Secondary / Ghost:** Transparent background, Terracotta Clay (#B5563E) text, bottom border only (1px solid), no box-shadow

### Inputs / Fields

- **Style:** No visible border except bottom underline (1px solid rgba(0,0,0,0.15) at rest)
- **Focus:** Animated underline expands from center — 2px height, Terracotta Clay (#B5563E), 0.3s cubic-bezier(0.4,0,0.2,1) timing
- **Error / Disabled:** Terracotta Clay text and border, no red (use the earthy terracotta, not aggressive #f00)
- **Placeholder:** Lowercase, font-weight 300, rgba(44,36,24,0.5), 0.04em letter-spacing

### Navigation

- **Style:** Uppercase, spaced (0.08–0.12em), Playfair Display for dashboard nav, Quattrocento Sans for micro-links
- **Default/Hover/Active:** Warm Grey (#7A7469) → Charcoal Ink (#2C2418) on hover, no underline unless it's a CTA
- **Mobile:** Horizontal scroll strip, no scrollbar, centered links with 8px 12px padding
- **Sticky header:** Parchment Cream at 90% opacity + 12px blur backdrop-filter

### Cards / Containers

- **Corner Style:** Minimal radius (2–4px) — not rounded-lg, not sharp
- **Background:** Transparent or Parchment Cream — no white cards on cream background
- **Shadow Strategy:** Flat by default, no elevation until interactive state
- **Border:** 1px solid rgba(122,116,105,0.08) for ceremonial section dividers, not card outlines
- **Internal Padding:** 20px clamp(20px,5vw,32px) 0 for sections, 1.75rem 1.25rem for mobile form cards

### Signature Component: InsightCard

- **Style:** No visible container, no card background. Content speaks for itself.
- **Type Variants:** "positive" (Muted Sage #5E7A5E label) and "negative" (Avoid Red #A04040 label)
- **Label:** Uppercase, 10px, 0.12em spacing, Quattrocento Sans
- **Content:** Body typography, sentence-case or lowercase
- **Animation:** Fade in + translateY(20px), 0.5s ease-out-quart, 0.1–0.45s stagger delay
- **Physical press:** Active state scales to 0.98 for tactile feedback

### Modal: PaywallModal

- **Overlay:** Fixed, inset 0, rgba(44,36,24,0.6) warm overlay
- **Content:** Parchment Cream background, 90% width max-480px, 24px padding, 8px radius
- **Close:** Terracotta Clay icon top-right, cursor pointer
- **Body text:** Taupe Mist (#9C9488), 11px, 1.6 line-height

## 6. Do's and Don'ts

### Do:

- **Do** use Parchment Cream (#F5F0E8) as the only background — it's warmer than white and sets the editorial sanctuary tone
- **Do** keep Terracotta Clay usage under 15% of screen real estate — its rarity creates authority
- **Do** write body text in sentence-case or lowercase — only labels and nav are uppercase
- **Do** use the ceremonial input underline animation (0.3s cubic-bezier) for all form fields
- **Do** separate sections with 1px borders at 8–12% opacity, not shadows or spacing alone
- **Do** use Playfair Display for all headlines and section headers — the editorial voice depends on it
- **Do** respect `prefers-reduced-motion` — disable all animations and transitions
- **Do** ensure 4.5:1 minimum contrast for normal text, 3:1 for large text (WCAG 2.1 AA)

### Don't:

- **Don't** use `#000` (pure black) or `#fff` (pure white) anywhere — every neutral must be tinted toward the terracotta-brass hue family
- **Don't** use side-stripe borders (`border-left` or `border-right` greater than 1px) as colored accents — use full borders, background tints, or leading numbers/icons
- **Don't** use gradient text (`background-clip: text` with gradients) — use a single solid color, emphasize via weight or size
- **Don't** use glassmorphism as default — blurred backgrounds are decorative, not functional. Use once, purposefully, or not at all
- **Don't** use em dashes (—) in any copy — use commas, colons, semicolons, periods, or parentheses
- **Don't** create identical card grids (same-sized cards with icon + heading + text, repeated) — Kaal is editorial, not a dashboard
- **Don't** use modal as first thought — exhaust inline/progressive alternatives first (the blurred section overlay with upgrade button is the right pattern)
- **Don't** use new-age clichés: bright purple, neon gradients, starfield backgrounds, crystal clipart, zodiac stock photography
- **Don't** use corporate SaaS patterns: corporate blue, stock photos, card-heavy dashboards, generic templates, sterile efficiency
