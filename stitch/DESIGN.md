# Design System Document

## 1. Overview & Creative North Star: The Kinetic Luminary
This design system is built upon the "Kinetic Luminary" creative north star. It moves away from the static, boxy constraints of traditional SaaS interfaces toward a fluid, high-end editorial experience. By blending "Casi negro" (#282E2F) authoritative typography with a vibrant, tech-forward gradient pulse, the system creates an environment that feels both grounded and innovative.

We reject the "generic template" look. Instead, we embrace **intentional asymmetry**, high-contrast type scales, and a depth model based on light and transparency rather than lines and strokes. The interface should feel like a living digital dashboard—clean, minimalist, and perpetually in motion.

---

## 2. Colors & Surface Logic

### The Palette
The core identity is driven by the tension between the deep neutrals and the vibrant electric accents.

*   **Primary Pulse:** `primary` (#3653BD) and `secondary` (#5F3ED4).
*   **The Deep Neutral:** `on_surface` (#171D1E) and `inverse_surface` (#2B3132).
*   **Signature Gradient:** A linear transition from `#627DE9` to `#461CBC` at 135 degrees. This is reserved for Hero actions, progress indicators, and primary UX switches.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. 
Structure must be defined through:
1.  **Tonal Shifts:** Placing a `surface_container_low` section against a `surface` background.
2.  **Negative Space:** Utilizing the Spacing Scale (specifically tokens 10 through 24) to create mental groupings.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
*   **Level 0 (Base):** `surface` (#F5FAFB).
*   **Level 1 (Sections):** `surface_container_low`.
*   **Level 2 (Cards/Interaction):** `surface_container_lowest` (#FFFFFF) for maximum "pop" and focus.

### The Glass & Gradient Rule
To achieve a premium "digital curator" feel, use **Glassmorphism** for floating elements (modals, dropdowns, navigation bars). 
*   **Recipe:** `surface_container_lowest` at 70% opacity + `backdrop-blur: 20px`.
*   **Texture:** Apply subtle gradients (Primary to Primary-Container) to primary CTAs to give them a tactile, "lit-from-within" soul.

---

## 3. Typography: Editorial Authority
We utilize **Poppins** and **Plus Jakarta Sans** to create a sophisticated hierarchy that balances tech-modernism with readability.

*   **Display (Plus Jakarta Sans):** Used for "Hero" moments. The massive size (3.5rem) combined with the tight tracking creates an immediate "Editorial" impact.
*   **Headline (Plus Jakarta Sans):** Bold and unapologetic. Use `headline-lg` (2rem) for major section breaks to command attention.
*   **Body (Manrope):** Chosen for its high x-height and technical clarity. `body-lg` (1rem) is the workhorse for all descriptive text.
*   **Labels (Manrope):** `label-md` (0.75rem) should be used in all-caps with increased letter spacing for a "Pro" metadata look.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for this system. We achieve lift through light.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A `surface_container_lowest` card on a `surface_container_low` background creates a natural, soft lift.
*   **Ambient Shadows:** For floating components (Modals/Poppers), use an ultra-diffused shadow:
    *   `box-shadow: 0 20px 40px rgba(23, 29, 30, 0.06);` (Using a tinted version of `on_surface`).
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use `outline_variant` at **15% opacity**. Never use a high-contrast 100% opaque border.

---

## 5. Components

### Buttons & Switches
*   **Primary Button:** Uses the signature blue-to-purple gradient. Roundedness: `full`. No border. High-contrast `on_primary` (#FFFFFF) text in Poppins Bold.
*   **Secondary/Ghost:** `outline` token at 20% opacity. Text color is `primary`.
*   **UX Switches:** Inspired by the branding's "o" element. The "On" state must use the vibrant purple-blue gradient, while the "Off" state uses `surface_dim`.

### Cards & Containers
*   **Style:** Forbid the use of divider lines. 
*   **Separation:** Use `spacing-8` (2rem) as a minimum gutter between content blocks.
*   **Radius:** Standardize on `xl` (1.5rem) for large containers to soften the technological edge.

### Input Fields
*   **State:** Background should be `surface_container_highest`. 
*   **Interaction:** On focus, the background stays neutral, but a 2px "Glow" (not border) of `primary` is applied via `box-shadow`.

### Chips & Tags
*   **Aesthetic:** Small, pill-shaped (`rounded-full`). 
*   **Color:** Use `primary_fixed` with `on_primary_fixed` for high legibility without the "heaviness" of a solid dark button.

---

## 6. Do's and Don'ts

### Do
*   **DO** use white space as a structural element. If a layout feels cluttered, increase the spacing token rather than adding a line.
*   **DO** use Poppins Black for titles to lean into the "Bold Tech" brand personality.
*   **DO** use asymmetrical layouts (e.g., 60/40 splits) to avoid a "Bootstrap" or "Grid-template" appearance.

### Don't
*   **DON'T** use pure black (#000000) for shadows or text. Always use "Casi negro" (#282E2F) or the `on_surface` token.
*   **DON'T** use 1px solid borders. They break the fluid, glass-like illusion of the interface.
*   **DON'T** place vibrant gradients on top of vibrant gradients. Use the "Casi negro" or "Blanco" surfaces to let the gradients breathe and serve as focal points.