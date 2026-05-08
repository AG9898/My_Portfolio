# Portfolio Redesign — macOS Desktop OS

> **This document is the canonical direction for the portfolio.**
> It supersedes `design-plan.md` and `styleguide.md`. Those files are kept for reference only
> and should not be followed for new work. All existing code in `src/` is being scrapped
> and rebuilt from scratch.

---

## Context

The current portfolio is a single-page brutalist/editorial layout — bold type, monochrome, scroll-driven sections. It is competent but generic. The new direction takes the site in a completely different and memorable direction: **the browser becomes a macOS desktop**. The identity and personality of the portfolio comes from the OS metaphor itself, not from typography choices or color palettes.

Inspiration: [posthog.com](https://posthog.com) — persistent desktop wallpaper + sidebar icons, with pages rendered inside draggable, resizable windowed applications. The URL changes, but the desktop chrome never unmounts. Multiple app windows can remain open at once, and navigation focuses, restores, opens, or replaces windows depending on the shortcut/action.

---

## What We Are Scrapping

- All styles in `src/app/globals.css` (keeping only resets and CSS custom properties we redefine)
- The entire `src/app/page.tsx` single-page layout
- All components in `src/app/components/`
- The brutalist design language from `docs/styleguide.md` and `docs/design-plan.md`
- The Archivo + Space Grotesk font pairing

---

## Tech Stack (Canonical)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Keep existing setup |
| Language | TypeScript | Keep existing setup |
| Styling | Tailwind CSS | Keep existing setup |
| Animation | `framer-motion` | Add — window open/close/minimize, dock magnification, page transitions |
| Menu bar dropdowns | `@radix-ui/react-dropdown-menu` | Add — accessible macOS-style menu dropdowns |
| Icons | `lucide-react` | Add — replaces `@heroicons/react` |
| Fonts | SF Pro Display / `-apple-system` font stack | CSS only, no Google Fonts import needed |
| Window dragging | `react-rnd` | Add — windows are draggable and resizable |
| Theme switching | `next-themes` | Add — dark/light mode toggle in menu bar |
| Generative wallpaper | Canvas + `simplex-noise` | Add — animated flow field / noise particle background |

**Framework note**: Gatsby is not part of the direction. PostHog's Gatsby usage is content/build infrastructure, not a requirement for the desktop metaphor. The relevant pattern to adopt is the persistent app/window state provider, implemented in Next.js App Router.

---

## Architecture

The Next.js App Router layout system maps directly onto the OS metaphor. `layout.tsx` owns a persistent client-side desktop shell, and a `WindowManagerProvider` owns all open window state.

```
src/app/
  layout.tsx          ← Desktop shell (wallpaper + sidebar icons + menu bar + dock) — NEVER unmounts
  page.tsx            ← Home app content
  projects/
    page.tsx          ← Projects app content
  about/
    page.tsx          ← About app content
  contact/
    page.tsx          ← Contact app content
  cv/
    page.tsx          ← CV viewer content
  components/
    Desktop/
      Desktop.tsx     ← Wallpaper + icon grid
      DesktopIcon.tsx ← Individual shortcut icon
    WindowManager/
      WindowManagerProvider.tsx ← Open/focus/close/minimize/snap/maximize state
      windowReducer.ts          ← Reducer/actions for deterministic window behavior
    MenuBar/
      MenuBar.tsx     ← Top bar (clock, Apple menu, app name)
      MenuDropdown.tsx← @radix-ui dropdown menus
    Dock/
      Dock.tsx        ← Bottom dock with magnification, tooltips, and open indicators
    appMetadata.ts    ← Shared app registry (id, route, label, icon; extended in V1_005A)
    Window/
      WindowChrome.tsx  ← Title bar: glass-chrome, traffic light group, centered title
      WindowToolbar.tsx ← Per-page toolbar (passed in as children, future)
```

The `WindowManagerProvider` lives inside `layout.tsx`. It renders one `Window` per open app window and uses the current route only to decide which window is focused. Page modules provide content for windows, but the window manager is the source of truth for open windows, z-index, geometry, minimized state, and snap/maximize state.

### Window State Model

Each open window should be represented by structured state:

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

Initial implementation can enforce one window per route/app. Opening an already-open app focuses and restores that window instead of creating a duplicate. Duplicate windows are out of scope unless explicitly added later.

---

## Desired Behavior

### Desktop (root `/`)
- Full-viewport desktop — no scrolling anywhere on the site
- Persistent wallpaper background across all routes
- Desktop shortcut icons arranged on screen (position TBD — see open decisions)
- Menu bar pinned to top of viewport
- Dock pinned to bottom of viewport

### Navigation
- Clicking a desktop icon or dock item opens that app's window, or focuses/restores it if already open
- URL updates to the focused window route (`/projects`, `/about`, etc.)
- The desktop wallpaper, menu bar, dock, desktop icons, and other open windows **stay mounted**
- Opening a new app creates a new window without closing existing windows
- Clicking inside a window brings it to front and updates the URL to that window's route
- Closing the focused window removes it, then focuses the next highest z-index open window; if no windows remain, return to `/`
- Window opens with a macOS-style scale + fade animation (framer-motion spring)
- Closing a window plays the reverse animation before removing it from state

### Menu Bar
- Top bar spanning full viewport width, `28px` height
- Left side: Apple logo SVG → focused app name (bold) → menu items (File, Edit, View, Window, Help) — each `13px`, hover `bg-white/10`
- Right side (all `12.5px`, `white/85` opacity, left-to-right): Control center icon (4 rounded rects SVG) → Battery (24×12px rect, 78% fill visual, decorative) → Wi-Fi glyph → Date (`weekday short, month short, day numeric`) → Time (`hour numeric, minute 2-digit`, `tabular-nums`, updates every 1000ms)
- Theme toggle: icon-only control in the right-side status cluster switches between dark and light modes through `next-themes`; dark remains the default canonical theme.
- Glass treatment: `.glass-menubar` utility; bottom edge `1px solid rgba(255,255,255,0.08)`

### Dock
- Centered at bottom
- Contains icons for each main section: Home, About, Projects, Contact, CV
- Hover magnification effect (framer-motion scale on hover + neighbors)
- Tooltip labels above icons on hover
- Active app indicator dot below any app with an open, non-minimized window
- Minimized windows remain represented in the dock and restore on click

### Window
- Default size: `760×520px`; centered on first open
- Title bar with: traffic light buttons + centered window title (`13px font-medium`)
- Optional per-page toolbar below title bar (`40px`, `glass-chrome`, border-bottom)
- Drop shadow: `box-shadow: 0 22px 70px rgba(0,0,0,0.55)` + `inset 0 1px 0 rgba(255,255,255,0.06)`
- Border radius: `12px`
- Draggable and resizable through `react-rnd`
- Window chrome color and frosted glass follow dark/light theme tokens
- Each window preserves position and size while open
- Optional persistence: save last position and size per app in `localStorage`

### Window Controls
- Red traffic light: close window
- Yellow traffic light: minimize to dock
- Green traffic light: maximize/restore
- Green traffic light context menu or long-press/right-click: snap left, snap right, maximize, restore
- Double-click title bar: maximize/restore

**Traffic light group hover** (important UX detail): on hover over the traffic light *group container*, all three buttons simultaneously reveal glyphs — × (red), − (yellow), + (green) — in `rgba(0,0,0,0.55)` at 8px bold. Individual button hover is not used; the group state triggers all glyphs at once. This is the canonical macOS behavior.
- Dragging a window near the left/right edge previews snap state; releasing snaps to half screen
- Resize handles update `size`; restoring from maximized/snapped uses `previousPosition` and `previousSize`
- Keyboard shortcuts can be added after base behavior: close focused window, minimize, cycle windows, snap left/right

### Per-App Window Style

| Route | App metaphor | Toolbar style |
|---|---|---|
| `/` (home) | TextEdit / Notes | Rich text toolbar (decorative) |
| `/projects` | Finder | View toggle (grid/list), search bar |
| `/about` | Notes | Minimal — just title |
| `/contact` | Mail | Compose toolbar (To, Subject fields, Send button) |
| `/cv` | Preview | Zoom controls, page navigation |

The Contact window content is a static Mail-style compose sheet. Its Send action uses a `mailto:` link, profile cards link out to practical contact paths, and the page must not introduce backend form submission.

---

## Visual Design

### Colors (Dark mode canonical — light mode via `next-themes` inversion)
```
Desktop wallpaper:   Canvas — animated flow field noise particles, very dark bg (#0a0a0f)
Window bg:           rgba(28, 28, 30, 0.85)  — frosted glass (dark)
Window chrome:       rgba(44, 44, 46, 0.92)
Menu bar:            rgba(20, 20, 22, 0.80)  + backdrop-filter: blur(20px)
Dock bg:             rgba(255,255,255,0.12)  + backdrop-filter: blur(20px)
Text primary:        #F5F5F7  (macOS system light)
Text secondary:      rgba(255,255,255,0.50)
Accent:              #0A84FF  (macOS system blue)
Traffic light red:   #FF5F57
Traffic light yellow:#FEBC2E
Traffic light green: #28C840
```
Light mode overrides (`next-themes` dark class removed):
```
Window bg:           rgba(242, 242, 247, 0.92)
Window chrome:       rgba(255, 255, 255, 0.90)
Menu bar:            rgba(236, 236, 236, 0.80)
Text primary:        #1C1C1E
Dock bg:             rgba(0,0,0,0.08)
```

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
```
No external font import required — uses the OS native font on macOS/iOS, falls back gracefully on other platforms.

### Animations (framer-motion)
- Window open: `scale: 0.95 → 1`, `opacity: 0 → 1`, spring `{ stiffness: 300, damping: 30 }`
- Window close: reverse of open, `duration: 0.15`
- Window minimize: scale/fade toward dock icon, then mark as minimized
- Window restore: scale/fade from dock icon toward saved position
- Dock magnification: `scale` on hovered icon and adjacent icons using `useMotionValue` + `useTransform`
- Page transition inside window: `opacity: 0 → 1`, `y: 8 → 0`, `duration: 0.2`; skip the transition when `prefers-reduced-motion` is active

---

## Desktop Icons / Shortcuts

Each icon represents a section. Icons use file-type metaphors:

| Label | File metaphor | Route |
|---|---|---|
| `about_me.txt` | Text document | `/about` |
| `projects/` | Folder | `/projects` |
| `contact.msg` | Mail message | `/contact` |
| `aden_guo_cv.pdf` | PDF document | `/cv` |

Icon visual: `56×56px` SVG (file-type document shape with folded corner), label beneath in `11px` system font.

**Interaction:**
- Single click → **select** state: `rgba(10,132,255,0.28)` highlight box + `1px solid rgba(10,132,255,0.55)` border; label becomes a blue pill (`rgba(10,132,255,0.95)`)
- Double click → open the app's window (same effect as clicking the dock item)
- Click on empty desktop → deselects all

**Icon SVG metaphors (finalized):**
| Label | SVG style | Badge |
|---|---|---|
| `about_me.txt` | White document, folded corner, 4 grey content lines | Grey "TXT" (`#8E8E93`) |
| `projects/` | Two-tone blue folder with tab flap (`#7CC2FF → #3A8DDB`) | — |
| `contact.msg` | White document with blue envelope outline + flap | Blue "MSG" (`#0A84FF`) |
| `aden_guo_cv.pdf` | White document, 4 content lines | Red "PDF" (`#FF453A`) |

---

## Confirmed Decisions

| Decision | Choice | Notes |
|---|---|---|
| Color mode | Dark primary + light toggle | Define dark as canonical, `next-themes` handles inversion |
| Wallpaper | Abstract generative — flow field / noise particles | Canvas + `simplex-noise`, animated |
| Window dragging | Draggable + resizable | `react-rnd`; windows can be moved freely on the desktop |
| Desktop icon placement | Left sidebar column | Vertical stack on left edge, PostHog-style |
| Window model | Multiple simultaneous app windows | One window per app/route by default; focus existing windows instead of duplicating |
| Framework | Next.js App Router | Do not migrate to Gatsby; use a client window manager provider |

---

## Implementation Phases

Once open decisions are resolved:

1. **Phase 1 — Shell**: `layout.tsx` with wallpaper, static menu bar, static dock, desktop icons, and empty `WindowManagerProvider`.
2. **Phase 2 — Window manager**: reducer/state for open, focus, close, minimize, restore, maximize, snap left/right, and z-index ordering.
3. **Phase 3 — Routing integration**: desktop icons and dock items open/focus windows; focused window updates the URL; direct URL loads the matching window.
4. **Phase 4 — Geometry**: `react-rnd` dragging/resizing, snap previews, restore from previous size/position, optional `localStorage` persistence.
5. **Phase 5 — Animation**: framer-motion window open/close/minimize/restore, dock magnification, page transitions inside windows.
6. **Phase 6 — Menu bar**: `@radix-ui` dropdowns, live clock, focused app name, app-specific menu actions.
7. **Phase 7 — Per-app toolbars**: Each page's window toolbar (Finder toolbar, Mail toolbar, etc.)
8. **Phase 8 — Content**: Port project content, about text, contact form, and CV into their respective app windows.
9. **Phase 9 — Polish**: Reduced motion support, performance audit, and final responsive checks.

---

## Mobile Strategy

macOS desktop UX does not translate to mobile. Two options:
- **Option A**: Show a styled "This experience is designed for desktop" message on small screens with a link to a simplified mobile view
- **Option B**: Detect viewport and render a conventional responsive layout instead

Current implementation uses Option A at small viewports: the desktop shell is hidden below the `md` breakpoint and `MobileFallback` renders a deliberate full-screen fallback with the wallpaper, CV access, and the same dark/light theme toggle. Tablet and larger viewports keep the full desktop shell.

---

## Content

All existing page content is scrapped. Fresh content is being written for each app window during implementation. Home now uses a TextEdit-style document with a decorative rich text toolbar, note sidebar, and first-pass portfolio introduction. About now uses a Notes-style sidebar and document pane with first-pass profile and working-principle copy. Projects now uses a Finder-style browser with a sidebar, grid/list toolbar controls, search field, and real project entries with stack and repo/path metadata. Contact now uses a static Mail-style compose sheet with outbound contact links. CV now uses a Preview-style PDF viewer that embeds `/public/cv.pdf` and exposes open-in-tab and download actions. The only asset carried forward is `/public/cv.pdf`.

## Boot / Launch Sequence

On every page load, before the desktop is shown, a macOS-style boot screen plays:

1. **Black full-screen overlay** mounts immediately (z-index above everything)
2. **White Apple logo SVG** centered
3. **Progress bar** below center fills linearly over `2400ms`
4. When progress exceeds `85%`, overlay **fades out** (opacity 1 → 0, `400ms`) to reveal the desktop
5. Desktop appears with wallpaper, dock, menu bar, shortcuts, and any route-synced windows already mounted underneath

**Sound note**: The original Apple startup chime is Apple IP. Options:
- Use a royalty-free recreation (available on freesound.org)
- Commission/record a custom chime
- Make the sound opt-in (click anywhere to start + play chime) — this also solves browser autoplay restrictions
- Current implementation uses no audio. Any future audio path must require a user gesture.

**Timing**: Progress bar fills linearly over `2400ms`. When progress > 85%, container opacity fades from 1 → 0 over `400ms`. Total visible ~`2800ms`. Progress bar dimensions: `176×4px`, track `rgba(255,255,255,0.15)`, fill `rgba(255,255,255,0.85)`.

**Browser autoplay policy**: Most browsers block audio autoplay without a user gesture. Recommended approach: show a subtle "Click to enter" prompt over the boot screen, user click triggers both the audio and the boot animation.

**Implementation**: `BootScreen.tsx` component, rendered in `layout.tsx` above everything else, uses `framer-motion` to fade and unmount after the sequence completes. The current implementation replays on each full page load; a `sessionStorage` flag to skip replay is optional later.

---

## Design Handoff Reference

`reference/design draft/design_handoff_macos_desktop_shell/` contains the finalized Phase 1 prototype (high-fidelity React mockup + README spec). Agents working on visual implementation tasks should treat it as the visual ground truth for:
- All glass material values (exact RGBA opacities — these differ from earlier drafts)
- Dock, menu bar, sidebar, window layout/sizing
- Icon SVG designs (desktop shortcuts + dock icons)
- Wallpaper fallback gradient and grain treatment
- Boot screen composition
- Traffic light group hover behavior

**What the mockup covers**: Phase 1 static shell + boot screen + home window open animation.

**What is intentionally not in the mockup** (implement from docs, Phases 2–9):
- Window dragging / resizing (`react-rnd`)
- Snap preview grid + edge snapping
- Minimize-to-dock animation
- Green traffic light context menu
- Projects / About / Contact / CV windows
- Keyboard shortcuts
- Dock right-click context menus
- Multi-window z-order management
