# Design System Specification: Editorial Heritage

## 1. Overview & Creative North Star: "The Modern Archivist"
The Creative North Star for this design system is **The Modern Archivist**. This vision moves away from the sterile, high-velocity aesthetic of modern tech and toward a digital experience that feels curated, permanent, and tactile. 

The system rejects the "template" look by embracing **Intentional Asymmetry**. Instead of perfectly centered grids, we utilize generous, uneven whitespace and overlapping editorial elements to evoke the feeling of a premium Indian journal or a high-end Ayurvedic apothecary. This is a system of "Quiet Authority"—it does not shout with vibrant neons or aggressive animations; it commands respect through precision, mathematical Kolam-inspired layouts, and a sophisticated tonal palette.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the earth and the passage of time. We use Material-inspired token logic to ensure a systematic application of color across all surfaces.

### Surface Hierarchy & Nesting
To achieve a premium feel, we prohibit the use of 1px solid borders for sectioning. Boundaries are defined through **Tonal Transitions**.
- **The "No-Line" Rule:** Never use a stroke to separate a header from a body or a sidebar from a main view. Instead, shift from `surface` (#fcf9f1) to `surface_container_low` (#f6f3eb).
- **Nesting:** Treat the UI as stacked sheets of fine parchment. An inner card (`surface_container_lowest`) sitting on a `surface_container` background creates a natural, soft definition that feels organic rather than digital.

### The Glass & Gradient Rule
While the system is grounded, we introduce "visual soul" through:
- **Signature Gradients:** Use a subtle linear gradient from `primary` (#9a401e) to `primary_container` (#b95833) on large CTAs to provide a three-dimensional, "sun-baked" quality.
- **Parchment Glass:** Floating navigation bars should use `surface` at 85% opacity with a `20px` backdrop-blur, allowing the warm terracotta tones of the content to bleed through softly.

---

## 3. Typography: The Intellectual Contrast
The typography system relies on the interplay between the timeless **Noto Serif** and the mathematical precision of **Manrope**.

- **Display & Headlines (Noto Serif):** These are the "hero" elements. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, editorial presence. Headlines should always use the `on_surface` (#1c1c17) or `primary` (#9a401e) tokens.
- **Body & Labels (Manrope):** The sans-serif choice provides a functional, modern counterpoint. It ensures that while the brand feels heritage-driven, the utility is unmistakably contemporary.
- **The "Signature Label":** Small labels (e.g., `label-sm`) should frequently utilize the `secondary` Brass Gold (#755a2b) in uppercase with 10% letter spacing to mimic the gold-leaf detailing found in premium Indian stationery.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are a last resort. We communicate hierarchy through **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** 
    *   Level 0: `surface_dim` (Background)
    *   Level 1: `surface` (Main Content Area)
    *   Level 2: `surface_container_lowest` (Interactive Cards/Modals)
- **Ambient Shadows:** When an element must float (like a FAB or a Tooltip), use an extra-diffused shadow: `box-shadow: 0 12px 32px -4px rgba(45, 41, 38, 0.06)`. Note the use of the Charcoal Brown color in the shadow rather than pure black to maintain warmth.
- **The Ghost Border:** If accessibility requires a border, use the `outline_variant` token at 15% opacity. It should be felt, not seen.

---

## 5. Components: Precision & Minimalist Craft

### Buttons
- **Primary:** Filled with the `primary` Saffron (#9a401e). Use `ROUND_SIX` (0.375rem) corners. No border. Text in `on_primary` (White).
- **Secondary:** Transparent background with a `ghost-border` using `primary`. Text in `primary`.
- **Tertiary:** Text-only in `secondary` (Antique Brass), reserved for subtle actions.

### Cards & Lists
- **The Anti-Divider Rule:** Forbid 1px dividers. Separate list items using `16px` of vertical white space or a subtle background toggle between `surface` and `surface_container_low`.
- **Imagery:** Cards should feature high-contrast, desaturated photography or mathematical Kolam patterns as subtle watermarks in the background (`surface_variant`).

### Input Fields
- **State:** Active inputs use a `primary` (Saffron) 1.5px bottom-border only, mimicking the stroke of a calligraphy pen.
- **Background:** A subtle `surface_container_high` fill to differentiate the interaction zone from the parchment background.

### Custom Component: The Kolam Progress Indicator
Instead of a standard spinning circle, use a geometric Kolam pattern that assembles itself through SVG path animation using the `secondary` (Brass Gold) token.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins (e.g., a wider left margin than right) for a custom editorial look.
- **Do** use `secondary_fixed` (#ffdeac) for high-impact callouts or "New" badges to evoke gold-leaf embossing.
- **Do** allow elements to overlap (e.g., an image slightly breaking the container of a text block) to create depth.

### Don't
- **Don't** use 100% black (#000000). Always use the Charcoal Brown `on_surface` (#1c1c17) for text to maintain the "Aged Parchment" warmth.
- **Don't** use "Tech Blue" for links. All interactive elements must stay within the Saffron or Brass spectrum.
- **Don't** use sharp 90-degree corners or perfectly circular pills (unless for small chips). Stick to the `md` (ROUND_SIX) radius for a grounded, intentional feel.
- **Don't** over-animate. Transitions should be "Slow & Intentional" (300ms–500ms) with a soft bezier curve.