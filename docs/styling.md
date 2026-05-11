# Styling

Reference this guide when working on any CSS or Tailwind styles. It defines the visual contract for macOS 26 Tahoe (Liquid Glass design language).

---

## Tailwind rules

- Do not use stock Tailwind colors for any surface, chrome, or UI element
- Use only colors defined in `tailwind.config.js` and CSS variables in `globals.css`
- Dark mode is canonical; light mode is token inversion via CSS vars — rarely need `dark:` prefix
- Never write raw `backdrop-filter` inline; always use a `.glass-*` utility class

```tsx
// Correct
<div className="bg-window text-label-primary border-glass-edge" />

// Wrong — stock colors for UI chrome
<div className="bg-zinc-900 text-white border-white/10" />
```

---

## Material system (Liquid Glass)

macOS Tahoe replaces flat dark surfaces with translucent glass panels. Four named materials cover all chrome surfaces:

| Class | Used for | Background (dark) | Blur |
|---|---|---|---|
| `.glass` | Window panels, sheets, popovers | `var(--color-window)` | `blur(28px) saturate(180%)` |
| `.glass-chrome` | Window title bars, toolbars | `var(--color-chrome)` | `blur(28px) saturate(180%)` |
| `.glass-dock` | Dock background | `var(--color-dock)` | `blur(28px) saturate(180%)` |
| `.glass-menubar` | Menu bar | `var(--color-menubar)` | `blur(28px) saturate(180%)` |

All glass surfaces use the same blur stack: `backdrop-filter: blur(28px) saturate(180%)`. The inset top-edge highlight `inset 0 1px 0 rgba(255,255,255,N)` varies by surface weight (see shadow specs below).

These are defined in `src/app/globals.css` as `@layer utilities`. Use the class — never reconstruct the `backdrop-filter` stack ad hoc.

```tsx
// Correct
<div className="glass rounded-xl" />

// Wrong — manual reconstruction
<div className="bg-black/30 backdrop-blur-xl backdrop-saturate-150" />
```

---

## Color tokens

All semantic colors are Tailwind utilities backed by CSS variables. The variables flip between dark (canonical) and light via `.light` class on `<html>`.

**Surfaces:**

| Token | Class | Purpose |
|---|---|---|
| `--color-desktop` | `bg-desktop` | Desktop wallpaper fallback |
| `--color-window` | `bg-window` | Window panel background |
| `--color-chrome` | `bg-chrome` | Title bar / toolbar background |
| `--color-dock` | `.glass-dock` | Dock material background |
| `--color-menubar` | `.glass-menubar` | Menu bar material background |
| `--color-glass-edge` | `border-glass-edge` | Glass border / edge highlight |

**Text:**

| Token | Class | Purpose |
|---|---|---|
| `--color-label-primary` | `text-label-primary` | Primary body text |
| `--color-label-secondary` | `text-label-secondary` | Secondary / muted text |
| `--color-label-tertiary` | CSS var | Status-icon and tertiary chrome text |
| `--color-accent` | `text-accent` / `bg-accent` | Links, focus rings, active state |

**macOS system colors (fixed, no CSS var needed):**

| Token | Class | Purpose |
|---|---|---|
| `#0A84FF` / `#007AFF` | `text-system-blue` / `bg-system-blue` | Links, selection, active (dark/light via next-themes) |
| `#FF453A` / `#FF3B30` | `text-system-red` | Destructive actions |
| `#30D158` / `#34C759` | `text-system-green` | Success, positive states |
| `#FFD60A` / `#FFCC00` | `text-system-yellow` | Warnings |

**Traffic lights (fixed hex — never deviate):**

| Token | Class |
|---|---|
| `#FF5F57` | `bg-traffic-red` |
| `#FEBC2E` | `bg-traffic-yellow` |
| `#28C840` | `bg-traffic-green` |

---

## Typography

The macOS system font stack is set on `body` in `globals.css`. Never add a `font-*` Tailwind utility to chrome or shell components.

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
```

SF Pro size reference (use Tailwind equivalents):

| Use | Size | Weight | Tailwind |
|---|---|---|---|
| Window title | 13px | 500 | `text-[13px] font-medium` |
| Menu bar items | 13px | 400 | `text-[13px]` |
| Body / content | 15px | 400 | `text-[15px]` |
| Caption / label | 11px | 400 | `text-[11px]` |
| Large title | 22px | 600 | `text-[22px] font-semibold` |

---

## Shadow specs

| Surface | Shadow |
|---|---|
| Window | `0 22px 70px rgba(0,0,0,0.55)` + `inset 0 1px 0 rgba(255,255,255,0.06)` |
| Dock | `inset 0 1px 0 rgba(255,255,255,0.35)`, `inset 0 -1px 0 rgba(0,0,0,0.2)`, `0 30px 80px rgba(0,0,0,0.5)` |

Glass borders use `1px solid rgba(255,255,255,0.10)` for windows and `1px solid rgba(255,255,255,0.22)` for the dock.

---

## Wallpaper

The wallpaper system is rendered by `src/app/components/Desktop/Wallpaper.tsx` and selected through `WallpaperProvider`. It supports multiple full-viewport desktop themes while preserving the macOS shell layering: wallpaper at the back, menu bar and dock above it, and window chrome using independent glass tokens.

The canonical animated wallpaper remains the Canvas simplex-noise flow field. It uses `simplex-noise` to steer particles through a dark abstract field, caps device pixel ratio for predictable paint cost, and fades the canvas in only after the first frame has painted so there is no blank flash.

The `tahoe-dawn` CSS gradient remains underneath the canvas as the server-rendered static fallback for SSR, no-JS, and initial canvas startup. Keep this fallback in the `.wallpaper-fallback` class in `globals.css`; do not move it back into inline component styles.

| Theme | Basis | Character | Custom controls |
|---|---|---|---|
| `flow-field` | Canvas + `simplex-noise` particles | Dark abstract motion field | Background and line colors |
| `tahoe-dawn` | CSS radial gradient, drifting blobs, grain | Warm orange/pink/purple | Background, dawn, and glow colors |
| `spooky-smoke` | WebGL2 fragment shader adapted from 21st.dev Spooky Smoke Animation | Dense cinematic smoke with tinted highlights | Smoke color |
| `gradient-dots` | Three.js fragment shader adapted from the Cybernetic Grid reference | Animated grid field with subtle cursor warp | Background, grid, and pulse colors |

The `tahoe-dawn` fallback uses `radial-gradient(...)` with fallback desktop bg `#0a0a0f` and the following stops: `#ff8a3c -> #ff5b8a -> #a15bff -> #2b3bd6 -> #0a0a18` at `120% 90% at 80% 10%`.

**21st.dev translation notes**:

- `spooky-smoke` should adapt the referenced React/WebGL2 renderer and its `smokeColor` uniform rather than treat it as a third-party runtime dependency. Keep the shader isolated in the wallpaper component, cap DPR, fade in after first paint, clean up RAF loops/listeners/programs, and fall back to `.wallpaper-fallback` if WebGL2 is unavailable.
- `gradient-dots` now renders a Three.js-backed cyber grid shader adapted from the provided grid reference. Keep the wallpaper id for compatibility, but expose it as Cyber Grid in UI. The grid color control drives line color, ripple drives pulse/glow color, and cursor warp should stay restrained rather than rubbery.

**Color customization**: wallpaper color controls are exploratory only. They live in the existing menu bar wallpaper picker, render only for the active customizable theme, update the active wallpaper live, and do not persist across visits. Each wallpaper owns its own settings shape; do not force all themes through a shared palette.

Default transient colors live in `WallpaperProvider`: flow field starts with background `#0a0a0f` and lines `#7dd3fc`; Tahoe Dawn starts with background `#0a0a18`, dawn `#ff5b8a`, and glow `#788cff`; spooky smoke starts with `#a78bfa`; cyber grid starts with background `#080b14`, grid lines `#f8fafc`, and pulse/glow `#38bdf8`. These defaults are in-memory React state and reset on full page reload.

**Grain overlay**: SVG `feTurbulence` filter, opacity `0.06`, static — applied as a full-viewport pseudo-element.

**Reduced motion**: when `prefers-reduced-motion: reduce` is active, animated wallpapers keep the same visual language but sharply throttle or pause movement. Cursor-aware dot interactions should reduce to a subtle opacity or color response without ripple travel or drag motion.

---

## Layout / sizing reference

| Element | Spec |
|---|---|
| Menu bar height | `28px` |
| Desktop sidebar column width | `88px` |
| Desktop sidebar left offset | `16px` from viewport left |
| Desktop sidebar top offset | `48px` (clears menu bar) |
| Desktop icon gap | `12px` |
| Desktop icon SVG size | `56×56px` |
| Desktop icon label | `11px` system font, below icon |
| Window default size | `760×520px` |
| Window border radius | `12px` |
| Window title bar height | `40px` |
| Window toolbar height | `40px` |
| Dock padding | `8px 12px` |
| Dock border radius | `22px` |
| Dock icon base size | `56px` |
| Dock icon magnified max | `86px` |
| Dock bottom offset | `12px` from viewport bottom |
| Traffic light button diameter | `12px` |
| Traffic light gap | `8px` |
| Boot logo size | `64×64px`, centered in viewport |
| Boot progress bar | `176×4px`, positioned `64px` below center |

## App content surfaces

- Home, About, Projects, and Contact content should use the same token-backed surfaces as shell chrome: `bg-window`, `bg-chrome`, `border-glass-edge`, `text-label-primary`, `text-label-secondary`, and `bg-accent`.
- Notes/TextEdit-style sidebars should stay compact and use deterministic widths (`w-48` to `w-56`) so resizable windows do not reflow unpredictably.
- Finder-style project browsers should keep sidebars deterministic (`w-52` is the current project-window width) and use token-backed cards or rows for repeated project entries.
- Mail-style compose views should use deterministic mailbox sidebars (`w-52` is the current Contact width), token-backed compose headers, and normal outbound links instead of backend form controls.
- Decorative editor controls must use token-backed hover and border styles; do not introduce inline hex or one-off backdrop classes inside page content.

---

## Dock magnification algorithm

Applied via `useMotionValue` + `useTransform` in `Dock.tsx`. For each icon on `mousemove`:

```ts
const dist = Math.abs(mouseX - iconCenterX)
if (dist < 100) {
  const f = 1 - dist / 100
  const eased = Math.cos((1 - f) * Math.PI / 2) // cosine falloff
  size = 56 + (86 - 56) * eased
  lift = -8 * eased // translateY upward at peak
}
// implemented with a 220ms exit transition and spring { stiffness: 600, damping: 35 }
```

---

## Motion

Use `framer-motion`. Do not use CSS transitions for window open/close/minimize — they must be motion-animated for correct macOS feel.

**Canonical spring configs:**

```ts
// Window open / restore
const windowSpring = { type: 'spring', stiffness: 240, damping: 32, mass: 0.95 }

// Window minimize (genie-style travel into dock/desktop icon)
const minimizeSpring = { type: 'spring', stiffness: 300, damping: 28 }

// Dock magnification
const dockMagnify = { type: 'spring', stiffness: 600, damping: 35 }

// Page / content transitions
const contentFade = { duration: 0.15, ease: 'easeOut' }

// Boot overlay fade
const bootFade = { duration: 0.4, ease: 'easeOut' }
```

Window open/restore/minimize animations resolve the matching icon with
`data-window-animation-target`. Prefer dock targets when available, and fall
back to desktop shortcut targets for shortcut-only project windows. The
classic macOS `genie` feel is approximated with non-uniform `scaleX`/`scaleY`,
travel keyframes, and a small skew toward the target icon; reduced motion keeps
the state change functional with opacity only.

---

## Theming

- `next-themes` manages dark/light via a `[data-theme="light"]` attribute on `<html>`
- CSS variables in `:root` are the dark (canonical) values; `[data-theme="light"]` overrides them
- `.glass-*` utilities must reference CSS variables so light mode flips material colors without component-level overrides
- Tailwind `dark:` prefix is almost never needed — token classes handle both modes automatically

```tsx
// Correct — tokens handle both modes
<div className="bg-window text-label-primary" />

// Wrong — explicit dark: prefix for surfaces
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white" />
```

---

## What agents must not do

- No inline hex values for surfaces or chrome (`bg-[#1c1c1e]`, etc.)
- No raw `backdrop-filter` / `backdrop-blur-*` outside the `.glass-*` classes
- No Google Fonts — system font stack only
- No Heroicons — use `lucide-react`
- No stock Tailwind grays (`gray-*`, `zinc-*`, `neutral-*`) for UI chrome
- No hardcoded opacity variants for window backgrounds — use the token

## Overflow prevention

All text-bearing shell elements must guard against overflow at 1280px and 1440px widths:

- Menu bar left nav: `min-w-0 flex-1 overflow-hidden` on the nav container; `max-w-[120px] truncate` on the focused-app name span.
- Menu bar right status area: `shrink-0` so icons are never pushed off-screen.
- Dock tooltips: `max-w-[120px] truncate` on the tooltip `<span>`.
- Desktop shortcut labels: `max-w-full truncate` on the label `<span>`.
- Window title bar: `overflow: hidden; textOverflow: ellipsis; whiteSpace: nowrap` with `padding: 0 80px` to clear traffic lights on both sides.
