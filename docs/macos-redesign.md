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
      windowRegistry.ts         ← Route/app metadata, default size, title, icon, toolbar
    MenuBar/
      MenuBar.tsx     ← Top bar (clock, Apple menu, app name)
      MenuDropdown.tsx← @radix-ui dropdown menus
    Dock/
      Dock.tsx        ← Bottom dock with magnification
      DockIcon.tsx    ← Individual dock item
    Window/
      Window.tsx      ← Window chrome (title bar, traffic lights, toolbar slot)
      WindowToolbar.tsx ← Per-page toolbar (passed in as children)
      TrafficLights.tsx ← Red/yellow/green buttons
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
- Top bar spanning full viewport width
- Left side: Apple logo menu + focused app name + File/Edit/View style dropdowns
- Right side: live clock (current time), Wi-Fi icon, battery icon (decorative)
- Frosted glass treatment (`backdrop-filter: blur`)

### Dock
- Centered at bottom
- Contains icons for each main section: Home, About, Projects, Contact, CV
- Hover magnification effect (framer-motion scale on hover + neighbors)
- Tooltip labels above icons on hover
- Active app indicator dot below any app with an open, non-minimized window
- Minimized windows remain represented in the dock and restore on click

### Window
- Positioned center-right of desktop (leaving room for sidebar icons if present)
- Title bar with: traffic light buttons + window title
- Optional per-page toolbar below title bar (each app defines its own)
- Drop shadow: `box-shadow: 0 22px 70px rgba(0,0,0,0.5)`
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
- Page transition inside window: `opacity: 0 → 1`, `y: 8 → 0`, `duration: 0.2`

---

## Desktop Icons / Shortcuts

Each icon represents a section. Icons use file-type metaphors:

| Label | File metaphor | Route |
|---|---|---|
| `about_me.txt` | Text document | `/about` |
| `projects/` | Folder | `/projects` |
| `contact.msg` | Mail message | `/contact` |
| `aden_guo_cv.pdf` | PDF document | `/cv` |

Icon visual: small file-type SVG (16×20px document shape with folded corner), label beneath in `11px` system font, selected state with blue highlight box.

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
9. **Phase 9 — Polish**: Reduced motion support, mobile fallback (show a "switch to website mode" notice like PostHog), performance audit.

---

## Mobile Strategy

macOS desktop UX does not translate to mobile. Two options:
- **Option A**: Show a styled "This experience is designed for desktop" message on small screens with a link to a simplified mobile view
- **Option B**: Detect viewport and render a conventional responsive layout instead

PostHog uses Option A (the "Switch to website mode" button in the sidebar). This is the recommended approach.

---

## Content

All existing page content is scrapped. Fresh content will be written for each app window during implementation. The only asset carried forward is `/public/cv.pdf`.

## Boot / Launch Sequence

On every page load, before the desktop is shown, a macOS-style boot screen plays:

1. **Black full-screen overlay** mounts immediately (z-index above everything)
2. **White Apple logo SVG** centered — fades in over ~0.4s
3. **Startup chime** plays via `<audio>` (autoplay on user gesture or directly — see note below)
4. After ~2.5s total, overlay **fades out** (opacity 1 → 0, ~0.6s) to reveal the desktop
5. Desktop appears with dock/menu bar sliding in

**Sound note**: The original Apple startup chime is Apple IP. Options:
- Use a royalty-free recreation (available on freesound.org)
- Commission/record a custom chime
- Make the sound opt-in (click anywhere to start + play chime) — this also solves browser autoplay restrictions

**Browser autoplay policy**: Most browsers block audio autoplay without a user gesture. Recommended approach: show a subtle "Click to enter" prompt over the boot screen, user click triggers both the audio and the boot animation.

**Implementation**: `BootScreen.tsx` component, rendered in `layout.tsx` above everything else, uses `framer-motion` `AnimatePresence` to unmount after sequence completes. State lives in a `useBootSequence` hook. `sessionStorage` flag prevents replaying on tab refresh (optional — user decides).
