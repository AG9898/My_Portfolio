# Architecture

Canonical source for runtime topology, component responsibilities, routing, and state boundaries. Detailed design direction lives in [`macos-redesign.md`](macos-redesign.md).

---

## Overview

This is a frontend-only Next.js 14 App Router portfolio. The root layout owns a persistent macOS-style desktop shell, while route pages provide app-window content for Home, Projects, About, Contact, and CV.

---

## System Topology

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS.
- **Client interaction layer:** `framer-motion`, `react-rnd`, `next-themes`, Radix dropdown menus, `lucide-react`, canvas wallpaper using `simplex-noise`, and optional WebGL2 wallpaper rendering.
- **Static assets:** served from `public/`, including the carried-forward `cv.pdf`.
- **Backend/database/auth:** none.

---

## Component Responsibilities

### App Router

- `src/app/layout.tsx` mounts the persistent desktop shell and window manager provider.
  - `html` element carries `suppressHydrationWarning` (required by `next-themes`).
  - `ThemeProvider` uses `attribute="data-theme"` to match the CSS selector `[data-theme="light"]` in `globals.css`; `defaultTheme="dark"`, `enableSystem={false}`.
  - `WindowManagerProvider` wraps the desktop root, making window state available to all client components.
  - `MobileFallback` renders outside the desktop provider and is visible below the `md` breakpoint; the desktop provider/root are hidden at those widths.
  - `#desktop-root` div is `position: fixed; inset: 0; overflow: hidden; bg-desktop` — the stable shell container that never unmounts.
  - Font is set via inline `style` on `body` using the macOS system font stack (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif`); no Google Fonts import.
  - Inside `#desktop-root`, from back to front: `<Wallpaper />`, `<MenuBar />` (`z-50`, `h-7`), `<DesktopShortcuts />` (`z-10`, top: 48px), `<WindowRenderer />` (window z-index 21+), `<main>` page content area (`absolute`, `top: 28`, `bottom: 80`, `overflow-hidden`), `<Dock />` (`z-40`, `bottom-3`).
  - The `<main>` content area sits between the menu bar (28px tall) and the dock (80px clearance at the bottom), so route children never overlap shell chrome.
- Route pages provide content for their app windows.
- Route changes dispatch `syncRoute` so direct browser entry to `/`, `/projects`, `/about`, `/contact`, or `/cv` opens and focuses the matching app window without unmounting wallpaper, menu bar, dock, desktop icons, or other open windows.

### Desktop Shell

- Owns wallpaper, boot sequence, desktop icon column, menu bar, dock, and mobile fallback.
- Does not own per-window content state beyond shell-level navigation affordances.

#### MenuBar (`src/app/components/MenuBar/MenuBar.tsx`)

- Static 28px bar using `.glass-menubar` with `borderBottom: 1px solid rgba(255,255,255,0.08)`.
- Left: Apple logo Radix dropdown → focused-app name Radix dropdown (updates live as window focus changes, falls back to "Finder") → app-specific Radix dropdowns (File / Edit / View / Window / Help).
- Right: theme toggle button → Control Centre SVG → Battery visual (24×12px rect, 78% fill, decorative) → Wi-Fi SVG → date → live clock.
- Includes a right-side icon button that toggles the `next-themes` theme between dark and light.
- Includes a wallpaper picker in the right-side status cluster. The picker selects the active wallpaper theme and exposes compact color controls only for the active customizable theme inline inside the existing dropdown; it does not open a separate settings window.
- Dropdown menus are implemented in `src/app/components/MenuBar/MenuDropdown.tsx` using `@radix-ui/react-dropdown-menu`. Popovers use `.glass-chrome` styling and Radix animation state attributes for open/close transitions. Menus are keyboard accessible (arrow keys, Enter, Escape).
- Clock uses `useState<Date | null>(null)` initialised null on the server; `useEffect` populates it on the client and starts a 1000ms interval. Date and time strings are only rendered once non-null, eliminating SSR/client hydration mismatch. Requires `"use client"` directive.

#### Wallpaper (`src/app/components/Desktop/Wallpaper.tsx`)

- Renders the active full-viewport desktop wallpaper behind the shell chrome.
- Routes the selected wallpaper type to focused renderer components such as `FlowField`, `TahoeDawn`, `SpookySmoke`, and `GradientDots`.
- Keeps `.wallpaper-fallback` underneath animated/canvas renderers so SSR, no-JS, startup, and unsupported-renderer states never show a blank desktop.
- Canvas and WebGL renderers own their own RAF loops, resize listeners, DPR caps, first-frame readiness state, and cleanup.
- `spooky-smoke` is a WebGL2 shader wallpaper adapted from the 21st.dev Spooky Smoke Animation source. It uses a smoke color uniform controlled by `WallpaperProvider` and falls back gracefully if WebGL2 is unavailable.
- `gradient-dots` is exposed as Cyber Grid in the UI and renders a Three.js fragment shader adapted from the provided grid reference. It keeps transient background, grid-line, and pulse/glow colors, and uses a toned-down cursor warp so interaction feels smooth without bending the whole desktop.

#### WallpaperProvider (`src/app/components/Desktop/WallpaperProvider.tsx`)

- Owns the selected wallpaper type and transient per-wallpaper settings.
- Exposes setters for the active wallpaper and the active theme's color settings to `Wallpaper`, `MenuBar`, and mobile fallback surfaces.
- Does not persist wallpaper selection or custom colors to `localStorage`, `sessionStorage`, URL state, or cookies; selections reset on a full reload.
- Keeps each wallpaper's settings independent. For example, flow field background and line colors do not share state with Tahoe Dawn gradient colors, smoke color, or cyber grid colors.
- Supported wallpaper ids are `flow-field`, `tahoe-dawn`, `spooky-smoke`, and `gradient-dots`. Customizable settings are currently `flowFieldSettings.backgroundColor` and `lineColor`; `tahoeDawnSettings.backgroundColor`, `dawnColor`, and `glowColor`; `spookySmokeSettings.smokeColor`; and `gradientDotsSettings.backgroundColor`, `dotColor` for grid lines, and `rippleColor` for pulse/glow.

#### Dock (`src/app/components/Dock/Dock.tsx`)

- Static bottom dock using `.glass-dock`, absolutely positioned at `bottom-3`, centered horizontally.
- Dock border: `1px solid rgba(255,255,255,0.22)`. Dock shadow: inset top/bottom highlights + `0 30px 80px rgba(0,0,0,0.5)`.
- Dock padding: `8px 12px`, border radius: `22px`. Icon base size: `56px`.
- Renders one button per app from the `APPS` registry. Each icon uses an individual SVG matching the design handoff.
- Clicking a dock icon dispatches the `open` action; if the app is already open, focuses and restores it without duplicating.
- Magnification uses a cosine-falloff algorithm: 100px radius, 56px base, 86px max, -8px lift at peak. Implemented with `framer-motion` `useTransform`/`useSpring` reading a `useMotionValue` tracking `clientX`.
- Spring config: `{ stiffness: 600, damping: 35, duration: 0.22 }`.
- Tooltip labels appear above icons when pointer is within 30px; uses `useSpring` on `tooltipOpacity`.
- A 4×4px dot appears below each icon when the app window is open and non-minimized.
- Requires `"use client"` directive.

#### Desktop Shortcuts (`src/app/components/Desktop/DesktopShortcuts.tsx`)

- 88px-wide left sidebar column, positioned `left: 16px; top: 48px` (clears menu bar).
- Renders one shortcut item per app from the `APPS` registry (all five apps).
- Each shortcut is a 56×56px SVG using file-type metaphors: txt (home), folder (projects), person (about), msg (contact), pdf (cv).
- File labels are mapped via `ICON_LABELS` record (e.g., `"about_me.txt"`, `"projects/"`, `"aden_guo_cv.pdf"`); route/id come from `APPS`.
- Single click: selected state — `rgba(10,132,255,0.28)` background + `1px solid rgba(10,132,255,0.55)` border; label becomes `rgba(10,132,255,0.95)` pill.
- Double click: dispatches `open` action to the window manager; focuses and restores the window if already open.
- Requires `"use client"` directive; selection state is local (`useState<AppId | null>`).

#### App Metadata (`src/app/components/appMetadata.ts`)

- Shared registry of all five portfolio apps: Home, Projects, About, Contact, CV.
- Exports `AppId` union type, `AppSize` and `AppPosition` helper types, `AppMetadata` interface (id, route, label, title, icon, defaultSize, defaultPosition), and `APPS` array.
- `defaultSize` provides the window's initial `{width, height}` in pixels; `defaultPosition` provides the initial top-left `{x, y}` offset from the desktop area.
- `title` is the full window title bar string; `label` is the short dock/shortcut label.
- No state, no hooks, no reducer logic — pure static metadata consumed by the window manager and shell components.

### Window Manager

- Owns open window records, focused app, z-index order, geometry, minimized/maximized/snapped state, and restore geometry.
- Enforces one window per app/route by default.
- Handles open, focus, close, minimize, restore, maximize, snap, drag, and resize actions deterministically.

#### Window State Reducer (`src/app/components/WindowManager/windowReducer.ts`)

- Pure TypeScript module — no React hooks or side effects. Wired into `useReducer` by the WindowManagerProvider.
- **`WindowState`**: `openWindows: WindowEntry[]`, `focusedId: AppId | null`, `zIndexMap: Partial<Record<AppId, number>>`.
- **`WindowEntry`**: `id`, `route`, `geometry` (`x, y, width, height`), `restoreGeometry`, `minimized`, `maximized`, `snapped: "none" | "left" | "right"`.
- **`WindowAction`** union covers all 11 action types: `open`, `focus`, `close`, `minimize`, `restore`, `maximize`, `snapLeft`, `snapRight`, `drag`, `resize`, `syncRoute`.
- `open` action: if the app is already in `openWindows`, it focuses and unminimizes that entry without duplicating. Otherwise appends a new `WindowEntry` using `defaultSize`/`defaultPosition` from the caller.
- `syncRoute` action: maps the current pathname to the `APPS` registry, then opens/focuses/restores the matching app window using its default metadata. Existing windows are updated in place, so hydration and route changes do not create duplicates. Returns state unchanged if `focusedId` already equals the matched app id, preventing spurious z-index increments on URL-push feedback cycles.
- `close` action: removes the entry and selects the next highest z-index **visible (non-minimized)** open window as `focusedId`, or null if none remain. Minimized windows are excluded from this selection to avoid `focusedId` pointing at a non-rendered window.
- `maximize` action: saves current geometry to `restoreGeometry` and sets `geometry` to a zero-size sentinel — the WindowRenderer fills the desktop area using viewport dimensions. Toggling maximize again calls `restore`.
- `snapLeft`/`snapRight` actions: accept `desktopWidth`/`desktopHeight` from the caller and compute exact half-screen geometry.
- `drag`/`resize` actions: update geometry and `restoreGeometry` together; clear snapped and maximized flags.
- z-index is a monotonically incrementing counter (`nextZ = max(zIndexMap values) + 1`); every focus/open/snap/maximize/restore increments it.

#### WindowManagerProvider (`src/app/components/WindowManager/WindowManagerProvider.tsx`)

- `"use client"` component that wraps the app tree via `WindowManagerContext`.
- Owns the single `useReducer(windowReducer, initialWindowState)` call; provides `{ state, dispatch }` via context.
- Observes the current pathname and dispatches `syncRoute` so direct browser entry opens the corresponding app window.
- Observes `focusedId` and the focused window route, then calls `router.push(route)` when the focused window changes and the browser URL is stale. If no window is focused, the current URL is left unchanged.
- `useWindowManager()` hook returns context value; throws if called outside the provider.
- Mounted in `layout.tsx` wrapping the desktop root so all shell components (Dock, DesktopShortcuts, MenuBar) and window components share one state instance.

#### WindowRenderer (`src/app/components/WindowManager/WindowRenderer.tsx`)

- `"use client"` component that reads `state.openWindows` from `useWindowManager()` and renders one `AppWindow` shell per entry.
- Skips rendering for minimized windows (returns null).
- Uses `react-rnd` (`<Rnd>`) for drag and resize; `onDragStop` dispatches `drag` action, `onResizeStop` dispatches `resize` action.
- Clicking any part of a window dispatches a `focus` action via `onMouseDown`.
- z-index: each window's `zIndexMap[id]` value is added to `WINDOW_Z_BASE = 20`, placing windows above the wallpaper (0) and shortcuts (z-10) but below the dock (z-40) and menu bar (z-50).
- Maximized windows bypass `react-rnd` and render as a `position: fixed` div filling the desktop area (top: 28px, bottom: 80px).
- Each window is wrapped in a `framer-motion` `motion.div` inside `AnimatePresence`; open uses scale/opacity spring, close uses a quick 150ms ease-out exit. Minimize exit scales down toward the dock (scale 0.82, y+72). `prefers-reduced-motion` collapses all exit/enter to a plain opacity transition.
- Window drag handle is scoped to elements with the `.glass-chrome` class on the title bar.
- `exitModes` state tracks whether the last action for each window was `"close"` or `"minimize"` so `AnimatePresence` can choose the correct exit variant. `flushSync` is used when setting exitModes before dispatching the reducer action to avoid exit-before-set races.
- `visibleIdsRef` is kept current each render cycle; `onExitComplete` cleans up `exitModes` entries only for windows no longer visible, avoiding stale closure values.

### App Windows

- Render macOS-style chrome, traffic lights, optional toolbar, and the route app content.
- Use `react-rnd` for drag and resize behavior.
- Use `framer-motion` for opening, closing, minimizing, restoring, and inner page transitions.

### Theme

- `next-themes` controls dark/light mode.
- Dark mode tokens are canonical; light mode overrides invert the frosted-glass system.
- `ThemeProvider` disables system theme detection and defaults to dark, so first paint follows the canonical dark theme unless the user explicitly toggles light.

---

## Routing and State Flow

1. User clicks a desktop icon, dock item, in-window navigation target, or enters an app route directly in the browser.
2. Window manager opens or restores the corresponding app window.
3. Focused app becomes the highest z-index window.
4. URL updates to the focused app route.
5. Desktop shell remains mounted throughout the transition.
6. Closing the focused window focuses the next highest z-index open window; if no window remains focused, the URL is left unchanged.

---

## External Dependencies

| Dependency | Purpose | Required |
|---|---|---|
| `framer-motion` | Window, dock, boot, and page animations | Yes |
| `@radix-ui/react-dropdown-menu` | Accessible macOS-style menu dropdowns | Yes |
| `lucide-react` | Icon system | Yes |
| `react-rnd` | Window drag and resize | Yes |
| `next-themes` | Theme switching | Yes |
| `simplex-noise` | Generative wallpaper | Yes |
| `three` | Cyber Grid wallpaper shader renderer | Yes |
| WebGL2 browser API | Smoke shader wallpaper | Optional with fallback |

---

## Deployment Targets

| Environment | Frontend | Backend | Database |
|---|---|---|---|
| Production | Not documented yet | None | None |
| Staging | Not documented yet | None | None |
| Local dev | `localhost:3000` via `npm run dev` | None | None |

---

## Constraints

- Do not migrate away from Next.js App Router.
- Do not introduce a backend for portfolio content unless explicitly requested.
- Do not preserve old `src/` UI architecture when implementing the redesign.
- Keep global CSS minimal and token-focused.
- Use structured reducer-style state transitions for window behavior.
- Direct URL entry must open/focus the matching app window.
