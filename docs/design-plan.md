# Portfolio Redesign Action Plan

## Current State (January 30, 2026)
- The Stitch brutalist layout is implemented in `src/app/page.tsx` with updated tokens and fonts in `src/app/globals.css` and `src/app/layout.tsx`.
- Remaining tasks are content wiring (real social links, email, “View All Projects”) and any image swaps.

## 1) References and Source of Truth
- Visual reference: `assets/stitch-homepage/screen.png`
- Layout/structure: `assets/stitch-homepage/code.html`
- Global rules: `docs/styleguide.md` (monochrome brutalist, typography, grid, motion, do-nots)

## 2) Current Site Snapshot (Observed via Playwright)
- Layout: single-column flow with hero → about → projects (flip cards) → contact.
- Visual style: dark/tech gradients and 3D card interactions; not brutalist.
- Typography: large hero, but no Archivo/Space Grotesk pairing; no bold grid framing.
- Interaction: flip-card projects; multiple icon-based skill badges; varied colors.

## 3) Target Experience (From Stitch + Style Guide)
- Monochrome brutalist: hard borders, strict grid, high-contrast type.
- Type-first hierarchy: oversized hero name, ghost text backdrop, uppercase section labels.
- Project grid: 2-column cards with grayscale imagery + hover reveal.
- Strong framed portrait/imagery, minimal iconography, no gradients or glass.

## 4) Gap Analysis
- Hero: replace current centered hero with left-aligned, border-accented name block and ghost text background.
- Navigation: add fixed minimal nav with uppercase links and blend mode behavior.
- Projects: replace flip cards with grid cards (image top, title/description bottom).
- About: switch to two-column text + framed image (sticky on desktop).
- Footer: bold "LET'S TALK" CTA with minimal social links.
- Typography + color tokens: implement Archivo/Space Grotesk and monochrome palette.

## 5) Component Mapping (Next.js App Router)
- `src/app/page.tsx`
  - `Hero` → rebuild to match stitch hero grid.
  - `Marquee` → add scrolling title band between hero and work.
  - `Projects` → replace flip-card implementation.
  - `About` → two-column layout with framed image and quote block.
  - `Footer/Contact` → large CTA + email + social grid.
- `src/app/components/*`
  - Update or replace existing components to match the new layout (reduce icon-heavy UI).
- `src/app/globals.css`
  - Add CSS variables per style guide and motion defaults.

## 6) Typography and Color Implementation
- Load fonts: Archivo (display) + Space Grotesk (body).
- Define CSS variables in `globals.css` per style guide.
- Ensure default is light theme; optional `.dark` support if desired.
- Use uppercase labels with tracking and tight line-height for headlines.

## 7) Motion and Interaction Plan
- Hover: grayscale → color, scale 1.02–1.05, 120–150ms.
- Section reveal: subtle translateY + opacity, 300–400ms.
- Respect `prefers-reduced-motion` (disable transform).

## 8) Content & Asset Tasks
- Swap images to match grayscale-with-hover pattern.
- Verify email/links in footer.
- Ensure hero subcopy reflects current positioning (GIS + creative technologist).
- Consider adding/keeping CV download link as in reference.

## 9) Implementation Steps (Order)
1. Add fonts + CSS tokens in `globals.css`; set base typography.
2. Rebuild layout skeleton in `page.tsx` to match stitch grid.
3. Implement hero + nav + marquee.
4. Replace project cards with 2x2 grid layout.
5. Build about two-column block with framed image and quote panel.
6. Rebuild footer CTA and social grid.
7. Apply motion rules + reduced motion guards.
8. Cross-check against `styleguide.md` and `screen.png`.

## 10) Acceptance Checklist
- Monochrome only, no gradients or glass.
- Border framing and grid alignment are obvious.
- Typography hierarchy matches scale (hero 72–96px, section 40–56px).
- Images grayscale with hover color reveal.
- Motion subtle and fast.
- Mobile layout remains clean and readable.
