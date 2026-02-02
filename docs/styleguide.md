# styleguide.md — Aden Guo Portfolio

## 0. Purpose
This style guide defines the visual, layout, typography, motion, and interaction rules for implementing the Aden Guo portfolio website.  
It is intended for **coding LLMs (Codex)** and developers to follow consistently when building or extending the site.

The design is **monochrome brutalist**: bold typography, strict grids, minimal color, and restrained motion.

---

## 1. Design Principles
- **Brutalist clarity**: hard edges, visible borders, minimal decoration
- **Type-first hierarchy**: typography leads; imagery supports
- **Monochrome palette**: black, white, gray only
- **Motion as feedback**: subtle, fast, purposeful
- **No visual noise**: avoid gradients, glows, heavy shadows, or bright colors

---

## 2. Color System

### Tokens
```css
--color-black: #000000;
--color-white: #ffffff;

--bg-light: #f3f3f3;
--bg-dark:  #0a0a0a;

--surface-light: #ffffff;
--surface-dark:  #1a1a1a;

--text-light: #111111;
--text-dark:  #eeeeee;

--accent-gray: #888888;
```

### Usage Rules
- Default theme: **light**
- Dark mode: `.dark` class
- Borders: solid black (light) / solid white (dark)
- No opacity-based color overlays except for media hover fades

---

## 3. Typography

### Fonts
- **Display / Headlines**: `Archivo` (700–900)
- **Body / UI**: `Space Grotesk` (300–600)
- **Mono (optional)**: system monospace

### Scale
| Use Case | Size |
|--------|------|
| Hero Name | 72–96px |
| Section Titles | 40–56px |
| Card Titles | 18–22px |
| Body Text | 14–16px |
| Meta / Labels | 11–12px |

### Rules
- Uppercase allowed for section headers
- Tight line-height for headlines (1.0–1.1)
- Generous letter-spacing only for small labels

---

## 4. Layout System

### Grid
- Desktop: 12-column grid
- Max width: ~1200–1320px
- Gutters: generous (24–32px)

### Section Spacing
- Major sections: 120–160px vertical spacing
- Cards within sections: 24–40px spacing

### Borders
- 1–2px solid borders used as primary separators
- Frames are intentional (portrait, cards)

---

## 5. Core Components

### Header / Navigation
- Minimal horizontal nav
- Logo / name left, nav right
- No background blur or transparency
- Sticky behavior allowed

### Hero Section
- Large name typography
- Background “ghost text” at low opacity
- Portrait framed with visible border
- CTA buttons: outlined, rectangular, sharp corners

### Project Cards
- Square or strict rectangle
- Grayscale image by default
- Hover reveals color + slight scale
- Clear title and short description

### About Section
- Two-column layout
- Text on left, framed image on right
- Image remains static; no parallax

### Footer / Contact
- Bold CTA text (“LET’S TALK”)
- Email is primary action
- Social links minimal and text-based

---

## 6. Motion & Animation Guidelines

### Philosophy
Motion should:
- Communicate interactivity
- Never distract
- Complete quickly

### Timing
```txt
Fast hover:     120–150ms
Standard UI:   180–220ms
Section reveal: 300–400ms
```

### Easing
- Default: `ease-out`
- Avoid spring physics
- Avoid bounce or elastic curves

### Allowed Effects
- `transform: scale(1.02–1.05)`
- `opacity` fade
- `filter: grayscale()`
- `translateY(4–8px)`

### Reduced Motion
Respect `prefers-reduced-motion`:
- Disable transforms
- Keep opacity fades only

---

## 7. Media Treatment

### Images
- Start grayscale
- Reveal color on hover
- Slight zoom-in on hover
- No heavy shadows

### Icons
- Monoline
- Black or white only
- No filled or colorful icons

---

## 8. Accessibility
- Minimum contrast: WCAG AA
- Interactive elements must have focus styles
- All images require alt text
- Buttons must be keyboard accessible

---

## 9. Implementation Notes for Codex
- Prefer **semantic HTML**
- Use utility-first CSS or clean component CSS
- Avoid animation libraries unless required
- Keep components modular and reusable
- Performance > visual tricks

---

## 10. Non‑Goals
Do NOT add:
- Bright accent colors
- Glassmorphism
- Heavy gradients
- Complex scroll-based animation systems
- Decorative motion without purpose

---

## 11. Acceptance Criteria
- Page loads fast
- Visual hierarchy is clear without color
- Motion feels intentional and subtle
- Design matches provided visual reference
