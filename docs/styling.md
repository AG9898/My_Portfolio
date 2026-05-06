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

| Class | Used for |
|---|---|
| `.glass` | Window panels, sheets, popovers |
| `.glass-chrome` | Window title bars, toolbars |
| `.glass-dock` | Dock background |
| `.glass-menubar` | Menu bar (fully transparent in Tahoe) |

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
| `--color-glass-edge` | `border-glass-edge` | Glass border / edge highlight |

**Text:**

| Token | Class | Purpose |
|---|---|---|
| `--color-label-primary` | `text-label-primary` | Primary body text |
| `--color-label-secondary` | `text-label-secondary` | Secondary / muted text |
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

## Motion

Use `framer-motion`. Do not use CSS transitions for window open/close/minimize — they must be motion-animated for correct macOS feel.

**Canonical spring configs:**

```ts
// Window open / restore
const windowSpring = { type: 'spring', stiffness: 400, damping: 30 }

// Window minimize (scale to dock)
const minimizeSpring = { type: 'spring', stiffness: 300, damping: 28 }

// Dock magnification
const dockMagnify = { type: 'spring', stiffness: 600, damping: 35 }

// Page / content transitions
const contentFade = { duration: 0.15, ease: 'easeOut' }
```

---

## Theming

- `next-themes` manages dark/light via a `.light` class on `<html>`
- CSS variables in `:root` are the dark (canonical) values; `.light` overrides them
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
