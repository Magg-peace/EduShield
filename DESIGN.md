# Design System Specification: The Sentinel Aesthetic

## 1. Overview & Creative North Star
### Creative North Star: "The Ethereal Guardian"
This design system moves away from the clinical, spreadsheet-heavy look of traditional academic software. Instead, it adopts an editorial, high-end dashboard feel that treats data as a living organism. By combining deep-space backgrounds with hyper-vibrant neon accents, we create a sense of urgency and precision.

The "Ethereal Guardian" breaks the rigid "web-template" grid through:
*   **Intentional Asymmetry:** Off-setting data visualizations to lead the eye.
*   **Depth through Translucency:** Using glassmorphism to layer information, suggesting that the system is looking *through* the data to find the student.
*   **High-Contrast Scale:** Utilizing dramatic shifts between `display-lg` typography and `label-sm` metadata to create a sense of professional authority.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, nocturnal base (`#060e20`) to allow the neon "Risk Indicators" and vibrant gradients to vibrate with life.

### The "No-Line" Rule
**Borders are a design failure in this system.** Do not use 1px solid strokes to separate sections. Structure must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-high` element against a `surface` background.
2.  **Glass Differentiation:** Using `backdrop-filter: blur(20px)` to create a perceived boundary.
3.  **Negative Space:** Using the spacing scale to let the background breathe between "islands" of data.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#060e20) – The infinite floor.
*   **Lower Level:** `surface-container-low` – Subtle grouping for background logic.
*   **The Hero Layer:** `surface-container-highest` – For primary data cards.
*   **Glass Floating Layer:** Semi-transparent `primary` or `surface-variant` with a blur for active modals or hovering tooltips.

### The "Glass & Gradient" Rule
Primary CTAs and Data "Vines" (trends) should use a signature gradient: 
*   **Vibe Gradient:** `primary` (#ba9eff) → `secondary` (#53ddfc) → `tertiary` (#699cff).
*   **Glass Effect:** Backgrounds for cards should use `surface-variant` at 40% opacity with a `24px` backdrop blur.

---

## 3. Typography
We utilize a triple-typeface strategy to create a high-end editorial feel.

*   **The Authority (Manrope):** Used for `display` and `headline` levels. This font provides the "Modernist" tech feel. Use heavy weights for student names or high-risk percentages.
*   **The Narrative (Inter):** Used for `title` and `body`. It is the workhorse. It ensures that complex academic records remain legible even when layered over glass.
*   **The Data (Space Grotesk):** Used for `label` styles. This monospaced-leaning sans-serif should be used for IDs, timestamps, and risk-level chips to give a "system-read" aesthetic.

---

## 4. Elevation & Depth
### The Layering Principle
Avoid "drop shadows" that look like dark smudges. Instead, use **Tonal Layering**.
*   **Primary Elevation:** A `surface-container-highest` card sitting on a `surface` background creates a natural 3D lift.
*   **Ambient Shadows:** For floating elements (Modals), use a shadow color derived from `surface-tint` (#ba9eff) at 6% opacity with a 40px blur. This mimics a purple-tinted glow rather than a grey shadow.

### The "Ghost Border" Fallback
If a boundary is required for accessibility, use the `outline-variant` token at 15% opacity. It should look like a faint breath on glass, not a solid line.

---

## 5. Components

### Glassy Cards
Cards are the core of this system. 
*   **Background:** `surface-container-highest` at 60% opacity.
*   **Blur:** `backdrop-filter: blur(16px)`.
*   **Corner Radius:** `xl` (1.5rem) for main cards; `md` (0.75rem) for nested cards.
*   **Padding:** Always use at least `1.5rem` internal padding to maintain the "premium" feel.

### Action Buttons
*   **Primary:** A gradient-filled container (`primary` to `secondary`) with `on-primary-fixed` text. No border.
*   **Secondary (Glass):** `surface-variant` at 20% opacity with a `ghost border`.
*   **Tertiary:** Ghost button with `primary` text and no container until hover.

### Risk Indicators (Neon Accents)
Risk must be instantly recognizable through color saturation:
*   **High Risk:** `error` (#ff6e84) – Glow effect enabled.
*   **Medium Risk:** `secondary_fixed` (#65e1ff) – A sharp, energetic amber/teal.
*   **Low Risk:** `primary_fixed` (#ae8dff) – A calm, stable purple.

### Data Visualization
*   **The Pulse Line:** Use a 3px stroke for line charts. Use a gradient stroke that changes color from `primary` (low risk area) to `error` (high risk area).
*   **The Grid:** Forbid horizontal/vertical grid lines. Use a single `outline-variant` baseline and nothing else.

### Input Fields
*   **State:** Use `surface-container-lowest` as the fill. 
*   **Focus:** Instead of a thick border, use a 2px outer glow using `primary_dim` at 30% opacity.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use extreme vertical whitespace to separate student profiles.
*   **DO** overlap elements (e.g., a student's photo slightly breaking the top edge of a glass card).
*   **DO** use `display-lg` for single, impactful numbers (e.g., "84%" Dropout Probability).

### Don’t:
*   **DON'T** use pure white (#FFFFFF) for text. Use `on-surface` (#dee5ff) to keep the dark-mode harmony.
*   **DON'T** use 1px dividers. Use a 24px gap instead.
*   **DON'T** use sharp corners. Everything in a student-centric system should feel approachable and organic; use the `xl` or `full` roundedness tokens.
*   **DON'T** place high-saturation gradients behind body text. Gradients are for "soul," not for backgrounds of readable content.