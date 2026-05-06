# Handoff: macOS Desktop Shell — Center Window, Sidebar Shortcuts, Dock

## Overview

This handoff covers the **center-screen window**, **left-sidebar desktop shortcuts**, **menu bar**, and **dock with magnification** for the `My_Portfolio` macOS-OS redesign. It also includes a sample of the **window-open animation** and the **boot screen** sequence.

The mockup demonstrates Phase 1 (Shell) + Phase 5 (Animation) of the implementation roadmap defined in `docs/macos-redesign.md` of the `AG9898/My_Portfolio` repo.

## About the Design Files

The files in this bundle are **design references created in HTML/React** — a single-file prototype showing intended look, layout, and motion. They are **not** production code to copy directly.

The task is to **recreate these designs inside the existing `My_Portfolio` Next.js 14 + TypeScript + Tailwind codebase** using the patterns already prescribed by the repo's docs:

- `docs/PRD.md` — product scope and success criteria
- `docs/styling.md` — color tokens, glass utilities, typography, motion specs
- `docs/macos-redesign.md` — canonical visual + architectural direction
- `CLAUDE.md` / `AGENTS.md` — agent working guide

The HTML prototype uses Tailwind's CDN build and inline-React/Babel for fast iteration. Production should use the project's real Tailwind config, the `glass-*` utility classes from `globals.css`, `framer-motion` for all motion (per `docs/styling.md`), and `react-rnd` for window dragging/resize (out of scope for this mock).

## Fidelity

**High-fidelity** for visuals, layout, and motion feel. Specifically:

- Colors, gradients, glass blur values, shadows, border radii, and font sizes are final and match the tokens in `docs/styling.md`
- The dock magnification curve, window open spring, and tooltip placement are reference-quality
- Copy in the home window is **placeholder** — replace with real content
- Wallpaper is a **CSS-gradient stand-in** for the spec'd Canvas + simplex-noise flow field; production should keep the gradient as the static fallback and layer the animated canvas on top
- Window dragging/resize, snap previews, and minimize-to-dock are **not** implemented in the mock — those belong to Phase 2/4

## Screens / Views

This mockup is one screen: the **persistent desktop shell** with one app window (Home / TextEdit) open at center.

### Layout (top → bottom, left → right)

| Layer | Element | Position | Size |
|---|---|---|---|
| 0 | Wallpaper | Full viewport | 100vw × 100vh |
| 1 | Desktop sidebar shortcuts | `left: 16px, top: 48px`, vertical stack | 88px column, gap 12px |
| 2 | Home window | Centered (`top:50%, left:50%, translate(-50%,-50%)`) | 760 × 520 |
| 3 | Menu bar | Pinned top, full width | height 28px |
| 4 | Dock | Pinned bottom-center, `bottom: 12px` | content-width, height ~76px |
| 5 | Boot screen overlay (when shown) | Full viewport, z-index 100 | 100vw × 100vh |

### Components

#### MenuBar (`h-7`, ~28px tall)
- **Background**: `rgba(20,20,22,0.45)` + `backdrop-filter: blur(28px) saturate(180%)`
- **Border-bottom**: `1px solid rgba(255,255,255,0.08)`
- **Left**: Apple logo SVG (14×16, white, opacity 0.9), then bold app name ("TextEdit" / "Finder"), then menu items: File, Edit, View, Window, Help — each `text-[13px]`, `text-white/90`, with `hover:bg-white/10 px-1.5 py-0.5 rounded`
- **Right**: Control Center icon (4 rounded rects), battery (24×12 rect, 78% fill), Wi-Fi glyph, date (`Mon, May 6`), time (`10:24 AM`, `tabular-nums`)
- All right-side text: `text-[12.5px] text-white/85`
- Live clock updates every 1000ms

#### Desktop Sidebar Shortcuts (left column)
- 88px wide buttons, vertical stack with 12px gap, starting `top: 48px`
- Each shortcut: 56×56 SVG file icon + label below
- **Label**: `text-[11px]`, white, `text-shadow: 0 1px 2px rgba(0,0,0,0.7)` for legibility on wallpaper
- **Selected state**: container gets `background: rgba(10,132,255,0.28)`, `border: 1px solid rgba(10,132,255,0.55)`, label gets solid `rgba(10,132,255,0.95)` background pill (no text-shadow)
- Single click = select, double click = open

**Icon kinds (SVG primitives):**

| Kind | Visual |
|---|---|
| `txt` (about_me.txt) | White doc rect 48×60 with folded top-right corner (14px), 4 grey content lines, grey "TXT" badge `#8E8E93` at bottom-left |
| `folder` (projects/) | Two-tone blue folder. Back: linear-gradient `#5AA8E8 → #2D6FB8`. Front flap: `#7CC2FF → #3A8DDB` with 2px white/35 highlight at top edge |
| `msg` (contact.msg) | White doc with blue envelope outline + flap, blue "MSG" badge `#0A84FF` |
| `pdf` (aden_guo_cv.pdf) | White doc with red "PDF" badge `#FF453A`, 4 content lines |

#### Home Window (TextEdit metaphor)
- **Size**: 760 × 520
- **Border radius**: 12px
- **Background**: `rgba(28,28,30,0.78)` + `backdrop-filter: blur(28px) saturate(180%)`
- **Border**: `1px solid rgba(255,255,255,0.10)`
- **Shadow**: `0 22px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`

**Title bar (40px tall, `bg-chrome` = `rgba(44,44,46,0.72)` + glass)**
- Traffic lights at left (12px, 8px gap):
  - Red `#FF5F57` (close)
  - Yellow `#FEBC2E` (minimize)
  - Green `#28C840` (maximize)
  - Inset shadow `0 0 0 0.5px rgba(0,0,0,0.25)`
  - On group hover: glyphs (×, −, +) appear at `rgba(0,0,0,0.55)`, 8px bold
- Centered title: `text-[13px] font-medium text-white/90` — "home — TextEdit"

**Toolbar (40px, decorative TextEdit-style)**
- Background: `rgba(255,255,255,0.02)`, border-bottom `1px solid rgba(255,255,255,0.05)`
- Buttons: 28×28, rounded, hover `bg-white/10`, B/I/U glyphs styled (bold/italic/underline), then paragraph/align glyphs
- Two select dropdowns: font family ("SF Pro"), size ("15") — `bg-white/5 border border-white/10`

**Content area**
- Padding: 48px horizontal, 40px vertical
- Title: `text-[22px] font-semibold text-white` — "hi, I'm Aden Guo."
- Caption: `text-[13px] text-white/55 tabular-nums` — "~/home/aden — last edited today"
- Body: `text-[15px] leading-[1.6] text-white/90`
- Inline links: `text-system-blue` (`#0A84FF`), `underline decoration-dotted underline-offset-2`
- Tag chips at bottom: `text-[11px] px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/75`

**Resize handle**
- Bottom-right 16×16, diagonal grip via `linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)`, `cursor: nwse-resize`

#### Dock (bottom-center)
- **Container**: `padding: 8px 12px`, `border-radius: 22px`, `glass-dock`:
  - `background: rgba(255,255,255,0.14)`
  - `border: 1px solid rgba(255,255,255,0.22)`
  - `box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2), 0 30px 80px rgba(0,0,0,0.5)`
  - `backdrop-filter: blur(28px) saturate(180%)`
- **Icons**: base 56px, max 86px on hover, gap 8px
- **Magnification**: cosine-eased falloff over 100px range from cursor, `transform: translateY(-8px * f)` lift on hovered icon
- **Tooltip**: shows above icon when cursor within 30px, `glass-chrome` background, `text-[12px] text-white`, `px-2.5 py-1 rounded-md`, sits at `top: -36px`
- **Running indicator**: 4×4 `rgba(255,255,255,0.85)` dot below icon, transparent if not running
- **Order**: Finder, Home, About (Notes), Projects (Folder), Contact (Mail), CV (Preview), 1px white/20 separator, Trash

**Dock icon glyphs (64×64 viewBox, rounded rect base + filter `drop-shadow(0 6px 10px rgba(0,0,0,0.35))`):**

| App | Background | Glyph |
|---|---|---|
| Finder | gradient `#7BC1FF → #1E88E5` | Two white vertical eye-strokes + smile |
| Home | `#0a0a18` | Green `#34C759` house silhouette |
| About (Notes) | `#FFEFB0` body, `#FFD86B` header strip | 4 horizontal lines `#C9A24B` |
| Projects (Folder) | folder gradient `#7CC2FF → #3A8DDB` | (folder shape) |
| Contact (Mail) | gradient `#7BC1FF → #0A84FF` | White envelope with blue flap |
| CV (Preview) | `#1c1c1e` | Red magnifier `#FF3B30` |
| Trash | white/18 fill, white/30 border | White can outline |

## Interactions & Behavior

### Window Open Animation
- Initial state: `transform: scale(0.94) translate(-50%,-50%)`, `opacity: 0`
- After 320ms: `scale(1)`, `opacity: 1`
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot spring)
- In production, replace with `framer-motion` spring per `docs/styling.md`:
  ```ts
  const windowSpring = { type: 'spring', stiffness: 400, damping: 30 }
  ```
  Animate `scale: 0.95 → 1`, `opacity: 0 → 1`. The mockup uses 0.94 / 320ms because CSS lacks true springs; the FM config above is canonical.

### Dock Magnification
- Mouse-move on dock container captures `clientX`
- For each icon: `dist = |mouseX - iconCenterX|`
- If `dist < 100`: `f = 1 - dist/100`, `eased = cos((1-f) * π/2)`
- `size = 56 + (86-56) * eased`, `lift = -8 * eased`
- On `mouseleave`: `size`/`transform` transition back over 220ms ease
- In production, prefer `framer-motion` `useMotionValue` + `useTransform` with the canonical config:
  ```ts
  const dockMagnify = { type: 'spring', stiffness: 600, damping: 35 }
  ```

### Boot Screen
- Black overlay, z-index 100
- White Apple logo (64×76) centered
- Progress bar 176×4, `rgba(255,255,255,0.15)` track, `rgba(255,255,255,0.85)` fill
- Total duration: 2400ms fill + 400ms fade-out
- Container opacity ramps from 1 → 0 once progress > 0.85
- In production: implement as `BootScreen.tsx` mounted in `layout.tsx`, use `framer-motion` `AnimatePresence` to unmount, gate replay with `sessionStorage`

### Shortcut Selection
- Single click selects (blue highlight box + label pill)
- Double click opens the corresponding app window (in mock, only `home` opens)
- Selection clears when clicking another icon

### Traffic Lights
- Red close button removes window from open state
- Group hover reveals glyphs on all three buttons simultaneously (not per-button)
- In production, wire yellow → minimize-to-dock animation, green → maximize toggle, right-click green → snap menu

## State Management

In production code, the desktop shell owns minimal state at the top, and a `WindowManagerProvider` (per `docs/macos-redesign.md`) owns all window state via reducer:

```ts
type AppWindow = {
  id: string
  route: "/" | "/projects" | "/about" | "/contact" | "/cv"
  app: "home" | "projects" | "about" | "contact" | "cv"
  title: string
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  previousPosition?: { x: number; y: number }
  previousSize?: { width: number; height: number }
  state: "open" | "minimized" | "maximized" | "snapped-left" | "snapped-right"
}
```

Local UI state in this mockup:
- `selected` — currently-selected desktop shortcut id
- `openWindows` — array of open app ids (mock allows only `home`)
- `booting` — boot screen visibility
- `mouseX` (in Dock) — for magnification calculation
- `now` (in MenuBar) — clock tick

## Design Tokens

All values come from `docs/styling.md` and `docs/macos-redesign.md`. The handoff uses these exact values:

### Surface colors (dark canonical)
| Token | Value |
|---|---|
| `--color-desktop` | `#0a0a0f` (fallback) |
| `--color-window` | `rgba(28,28,30,0.78)` |
| `--color-chrome` | `rgba(44,44,46,0.72)` |
| `--color-glass-edge` | `rgba(255,255,255,0.10)` |
| Menu bar bg | `rgba(20,20,22,0.45)` |
| Dock bg | `rgba(255,255,255,0.14)` |

### Text
| Token | Value |
|---|---|
| `--color-label-primary` | `#F5F5F7` |
| `--color-label-secondary` | `rgba(255,255,255,0.50)` |

### macOS system colors
| Token | Hex |
|---|---|
| `system-blue` | `#0A84FF` |
| `system-red` | `#FF453A` |
| `system-green` | `#30D158` |
| `system-yellow` | `#FFD60A` |

### Traffic lights (fixed)
| Token | Hex |
|---|---|
| `traffic-red` | `#FF5F57` |
| `traffic-yellow` | `#FEBC2E` |
| `traffic-green` | `#28C840` |

### Glass material
- `backdrop-filter: blur(28px) saturate(180%)` — apply via `.glass`, `.glass-chrome`, `.glass-dock`, `.glass-menubar` utilities (already defined in `src/app/globals.css` per `docs/styling.md`)

### Typography
- Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif`
- Window title: `13px / 500`
- Menu bar items: `13px / 400`
- Body: `15px / 400`
- Caption: `11px / 400`
- Large title: `22px / 600`

### Motion (canonical FM springs)
```ts
const windowSpring   = { type: 'spring', stiffness: 400, damping: 30 } // open / restore
const minimizeSpring = { type: 'spring', stiffness: 300, damping: 28 } // minimize to dock
const dockMagnify    = { type: 'spring', stiffness: 600, damping: 35 } // dock hover
const contentFade    = { duration: 0.15, ease: 'easeOut' }              // page transitions
```

### Spacing
- Window radius: 12px
- Window shadow: `0 22px 70px rgba(0,0,0,0.5)`
- Dock radius: 22px
- Title bar / toolbar height: 40px
- Menu bar height: 28px
- Sidebar icon column width: 88px

## Wallpapers (mockup options)

The mockup ships four CSS-gradient wallpapers as static fallbacks. Production should keep one of these as the fallback under the animated Canvas + `simplex-noise` flow field per `docs/macos-redesign.md`.

| Id | Description |
|---|---|
| `tahoe-dawn` | radial gradient orange → pink → purple → blue → near-black |
| `tahoe-night` | radial gradient deep blue → purple → indigo |
| `sequoia` | radial gradient forest green → midnight |
| `sonoma` | radial gradient magenta → violet → near-black |

## Assets

No external image assets are used. Everything is inline SVG (Apple logo, file icons, dock icons, menu-bar glyphs) or CSS gradients. Production CV asset `/public/cv.pdf` is preserved per the PRD.

Replace dock icons with real macOS-style production icons when available; the SVGs in the mock are simplified stand-ins.

## Files

- `Desktop Mockup.html` — entry HTML (Tailwind CDN + React 18 + Babel + script imports)
- `desktop.jsx` — all components (MenuBar, DesktopSidebar, Dock, HomeWindow, BootScreen, Wallpaper, App)
- `tweaks-panel.jsx` — Tweaks UI shell (used to swap wallpaper / replay boot in the mock; not part of production)

## Mapping to repo file structure

When implementing, place the components per `docs/macos-redesign.md`:

```
src/app/
  layout.tsx                                 ← mount Desktop, MenuBar, Dock, WindowManagerProvider
  globals.css                                ← .glass-* utilities + tokens (already exists)
  components/
    Desktop/
      Desktop.tsx                            ← wallpaper + DesktopSidebar
      DesktopIcon.tsx                        ← single shortcut (txt/folder/msg/pdf SVGs)
    MenuBar/
      MenuBar.tsx                            ← clock, app name, status icons
      MenuDropdown.tsx                       ← @radix-ui/react-dropdown-menu
    Dock/
      Dock.tsx                               ← magnification logic
      DockIcon.tsx                           ← single dock icon + tooltip + running dot
    Window/
      Window.tsx                             ← chrome + traffic lights + react-rnd wrapper
      TrafficLights.tsx
      WindowToolbar.tsx                      ← per-app toolbar slot (TextEdit, Finder, Mail, Preview)
    WindowManager/
      WindowManagerProvider.tsx
      windowReducer.ts
      windowRegistry.ts                      ← per-route metadata: title, default size, icon, toolbar
    BootScreen/
      BootScreen.tsx                         ← Apple logo + progress, AnimatePresence unmount
```

Open the prototype side-by-side while implementing — the JSX components in `desktop.jsx` are organized to map 1:1 onto the file structure above.
