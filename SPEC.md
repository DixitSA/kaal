# Landing Page UI/UX Improvements Design Document

## Status: ✓ Complete

This document captures the UI/UX refinements applied to the Kaal landing page form and header.

---

## 1. Contrast — WCAG Compliance

### Problem
Form labels, placeholders, and input borders were too light, failing WCAG contrast ratios against the card background.

### Solution
| Element | Before | After | Notes |
|---------|--------|-------|-------|
| Labels | `#2C2418` @ 50% opacity | `#3D3428` @ 100% opacity | Darkened, full opacity |
| Input text | `#2C2418` | `#2C2418` | — |
| Input border | `rgba(0,0,0,0.12)` | `#5C574F` | Solid mid-grey |
| Focus border | `#A34851` | `#5C574F` | Terracotta → muted |
| Error border | `rgba(181,86,62,0.4)` | `rgba(181,86,62,0.6)` | Higher opacity |
| Placeholders | `rgba(92,87,79,0.4)` | (unchanged) | Via globals.css |
| Microcopy | `#9C9488` | `#6B6560` | Increased to 11px |

---

## 2. Mobile-First Responsiveness

### Problem
- Date of Birth and Time of Birth fields displayed side-by-side on all viewports
- "I don't know" checkbox had a 13px touch target (below 44px minimum)

### Solution

#### Grid — CSS Media Query
```css
@media (max-width: 767px) {
  .dob-time-grid { grid-template-columns: 1fr; }
}
```
Located in `src/app/globals.css` — applied via desktop-down responsive block.

#### Touch Target — I Don't Know
| Property | Before | After |
|----------|--------|-------|
| Wrapper width | 13px | 22px min, 44px min-width |
| Wrapper height | 13px | 22px min, 44px min-height |
| Checkbox border | 1px | 1px (unchanged) |
| Inner dot | 4px | 6px | Better visibility |
| Label font | 10px | 11px | Matching label consistency |

---

## 3. Typography — Logo Harmonization

### Problem
Logo visually disconnected from main headline typography:
- Italic styling
- Lighter weight (default)
- Lower contrast

### Solution — Header Logo
| Property | Before | After |
|----------|--------|-------|
| Color | `#2C2418` @ 85% | `#2C2418` @ 100% |
| Font-weight | (default) | 600 (semi-bold) |
| Font-style | italic | normal |

Matches h1 headline (`#2C2418`, Playfair Display, font-weight 700).

---

## 4. Number Input Spin Buttons

### Problem
Default browser spinners on latitude/longitude number inputs:
- Inconsistent with custom aesthetic
- Easy to accidentally increment/decrement

### Solution — CSS Removal
```css
.birth-form-card input[type=number]::-webkit-inner-spin-button,
.birth-form-card input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.birth-form-card input[type=number] {
  -moz-appearance: textfield;
}
```
Located in `src/app/globals.css` (mobile-responsive block, max-width: 768px).

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/landing/BirthForm.tsx` | Contrast updates, touch target sizing |
| `src/app/globals.css` | Mobile grid, number spinners, input font-size @ 16px |
| `src/app/page.tsx` | Logo typography harmonization |

---

## Verification

Run locally to confirm:
```bash
npm run build && npm run typecheck && npm run test:run
```