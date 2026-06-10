# Architecture

Canonical source for runtime topology, component responsibilities, routing, and state boundaries. Detailed design direction lives in [`macos-redesign.md`](macos-redesign.md).

---

## Overview

This is a frontend-only Next.js 14 App Router portfolio. The root layout owns a persistent macOS-style desktop shell, while route pages provide app-window content for Home, Projects, About, Contact, and CV.

---

## System Topology

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS.
- **Client interaction layer:** `framer-motion`, `react-rnd`, `next-themes`, Radix dropdown menus, `lucide-react`, canvas wallpaper using `simplex-noise`, and optional WebGL2 wallpaper rendering.
- **Static assets:** served from `public/`, including `cv.pdf` (generated artifact for CV download).
- **Static data:** `src/data/resume.json` — JSON Resume v1 schema file; agent-editable source of truth for all CV content.
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
  - Inside `#desktop-root`, from back to front: `<Wallpaper />`, `<MenuBar />` (`z-50`, `h-7`), `<DesktopShortcuts />` (`z-10`, top: 48px), a desktop-sized `[data-desktop-layer="windows"]` wrapper containing `<WindowRenderer />` (window z-index 21+), `<Dock />` (`z-40`, `bottom-3`).
  - `<WindowRenderer />` takes no children — it resolves content from the `WINDOW_CONTENT` registry internally.
- App window content is decoupled from Next.js routing. `WindowRenderer` imports every page component directly and maps them to their `AppId` in a static `WINDOW_CONTENT` registry. Each open window always mounts its own component instance, so multiple windows are simultaneously visible regardless of which window has focus.
- Route changes dispatch `syncRoute` so direct browser entry to `/`, `/projects`, `/about`, `/contact`, `/cv`, `/glass-atlas`, `/techy`, `/sparse`, `/weather`, `/pigeoncoop`, or `/buddy` opens and focuses the matching app window without unmounting wallpaper, menu bar, dock, desktop icons, or other open windows.

### Desktop Shell

- Owns wallpaper, startup sequence, desktop icon column, menu bar, dock, and mobile fallback.
- Does not own per-window content state beyond shell-level navigation affordances.

#### StartupSequence (`src/app/components/Desktop/StartupSequence.tsx`)

- Renders above the mounted desktop shell as the boot/sign-in overlay for `md` and larger viewports.
- Plays once per browser tab/session using a startup-specific `sessionStorage` flag, falling back to replay when storage is unavailable.
- Phases: black boot panel with the portfolio logo and progress bar, Tahoe-inspired sign-in panel with clock/date and `Aden Guo`, signing-in password dots/loading bar, then unmount.
- Click or non-Tab keypress on the sign-in panel starts the signing-in phase. No startup audio is used.
- Respects `prefers-reduced-motion` by shortening timing and using fade-only transitions.

#### MenuBar (`src/app/components/MenuBar/MenuBar.tsx`)

- Static 28px bar using `.glass-menubar` with `borderBottom: 1px solid rgba(255,255,255,0.08)`.
- Left: portfolio logo Radix dropdown → focused-app name Radix dropdown (updates live as window focus changes, falls back to "Finder") → app-specific Radix dropdowns (File / Edit / View / Window / Help).
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
- Renders one button per app from `APPS` filtered to `showInDock !== false` — the five core apps only (Home, Projects, About, Contact, CV). Project-specific apps set `showInDock: false` and appear only in `DesktopShortcuts`. Each icon uses an individual SVG matching the design handoff.
- Clicking a dock icon dispatches the `open` action; if the app is already open, focuses and restores it without duplicating.
- Magnification uses a cosine-falloff algorithm: 100px radius, 56px base, 86px max, -8px lift at peak. Implemented with `framer-motion` `useTransform`/`useSpring` reading a `useMotionValue` tracking `clientX`.
- Spring config: `{ stiffness: 600, damping: 35, duration: 0.22 }`.
- Tooltip labels appear above icons when pointer is within 30px; uses `useSpring` on `tooltipOpacity`.
- A 4×4px dot appears below each icon when the app window is open and non-minimized.
- Requires `"use client"` directive.

#### Desktop Shortcuts (`src/app/components/Desktop/DesktopShortcuts.tsx`)

- 88px-wide left sidebar column, positioned `left: 16px; top: 48px` (clears menu bar).
- Renders one shortcut item per app from the full `APPS` registry — all nine apps, including the four project apps that are excluded from the Dock.
- Each shortcut is a 56×56px SVG using file-type or thematic metaphors: txt (home), folder (projects), person (about), msg (contact), pdf (cv), globe (glass-atlas), graph-node (techy), table/grid (sparse), cloud (weather).
- File labels are mapped via `ICON_LABELS` record (e.g., `"about_me.txt"`, `"projects/"`, `"aden_guo_cv.pdf"`, `"glass_atlas/"`, `"techy.app"`, `"sparse.app"`, `"weather.dash"`); route/id come from `APPS`.
- Single click: selected state — `rgba(10,132,255,0.28)` background + `1px solid rgba(10,132,255,0.55)` border; label becomes `rgba(10,132,255,0.95)` pill.
- Double click: dispatches `open` action to the window manager; focuses and restores the window if already open.
- Requires `"use client"` directive; selection state is local (`useState<AppId | null>`).

#### App Metadata (`src/app/components/appMetadata.ts`)

- Shared registry of all portfolio apps: Home, Projects, About, Contact, CV, Glass Atlas, Techy, Sparse, Weather & Wellness, PigeonCoop, and buddy.
- Exports `AppId` union type, `AppSize` and `AppPosition` helper types, `AppMetadata` interface (id, route, label, title, icon, defaultSize, defaultPosition, showInDock), and `APPS` array.
- `AppId` is `"home" | "projects" | "about" | "contact" | "cv" | "glass-atlas" | "techy" | "sparse" | "weather" | "pigeoncoop" | "buddy"`.
- `AppMetadata.route` is a string literal union covering `/`, `/projects`, `/about`, `/contact`, `/cv`, `/glass-atlas`, `/techy`, `/sparse`, `/weather`, `/pigeoncoop`, `/buddy`.
- `defaultSize` provides the window's initial `{width, height}` in pixels; runtime open paths center the window in the desktop safe area with `getCenteredWindowPositionForViewport()`. `defaultPosition` remains a fallback for non-browser contexts.
- `title` is the full window title bar string; `label` is the short dock/shortcut label.
- `showInDock?: boolean` — when explicitly `false`, the app appears in `DesktopShortcuts` only and is excluded from the Dock. When omitted or `true`, the app appears in both. The five core apps (Home, Projects, About, Contact, CV) omit this field; the project apps (Glass Atlas, Techy, Sparse, Weather, PigeonCoop, buddy) set it to `false`.
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
- Focus-driven URL sync uses `router.push(route, { scroll: false })` so opening, focusing, closing, and restoring windows does not trigger browser or App Router scroll restoration jumps inside the fixed desktop shell.
- Dock opens, desktop shortcut opens, and direct route entry pass centered default positions into the reducer so new windows appear centered by default.

#### WindowRenderer (`src/app/components/WindowManager/WindowRenderer.tsx`)

- `"use client"` component that reads `state.openWindows` from `useWindowManager()` and renders one `AppWindow` shell per entry.
- Accepts no children prop. A static `WINDOW_CONTENT: Record<AppId, React.ComponentType>` maps every `AppId` to its page component. Each `AppWindow` always renders `<WindowContent />` for its id — content is never conditionally suppressed based on focus state.
- Skips rendering for minimized windows (returns null).
- Uses `react-rnd` (`<Rnd>`) for drag and resize; `onDragStop` dispatches `drag` action, `onResizeStop` dispatches `resize` action.
- The layout wrapper around `WindowRenderer` must remain `position:absolute; inset:0` because `react-rnd` uses `bounds="parent"` for draggable window limits.
- Clicking any part of a window dispatches a `focus` action via `onMouseDown`.
- z-index: each window's `zIndexMap[id]` value is added to `WINDOW_Z_BASE = 20`, placing windows above the wallpaper (0) and shortcuts (z-10) but below the dock (z-40) and menu bar (z-50).
- Maximized windows bypass `react-rnd` and render as a `position: fixed` div filling the desktop area (top: 28px, bottom: 80px).
- Each window is wrapped in a `framer-motion` `motion.div` inside `AnimatePresence`; open/restore use a macOS-style source animation from the matching dock icon or desktop shortcut, close uses a quick 150ms ease-out exit, and minimize uses a classic `genie`-style non-uniform scale/travel animation into the matching icon. `prefers-reduced-motion` collapses all exit/enter to a plain opacity transition.
- Dock buttons and desktop shortcuts expose `data-window-animation-target` attributes so `WindowRenderer` can resolve the correct icon rectangle at animation time. Dock targets are preferred when present; desktop shortcut targets are used for apps excluded from the dock.
- Window drag handle is scoped to the `.window-drag-handle` title bar class, not the reusable `.glass-chrome` material class. Toolbar chrome can use `.glass-chrome` without becoming a drag surface.
- `exitModes` state tracks whether the last action for each window was `"close"` or `"minimize"` so `AnimatePresence` can choose the correct exit variant. `flushSync` is used when setting exitModes before dispatching the reducer action to avoid exit-before-set races.
- `visibleIdsRef` is kept current each render cycle; `onExitComplete` cleans up `exitModes` entries only for windows no longer visible, avoiding stale closure values.

### App Windows

- Render macOS-style chrome, traffic lights, optional toolbar, and the route app content.
- Use `react-rnd` for drag and resize behavior.
- Use `framer-motion` for opening, closing, minimizing, restoring, and inner page transitions.

#### App window routes (project showcases and About)

All app window pages use a **panel-switching sidebar pattern**: `"use client"` with `useState` for the active section; sidebar items are `<button>` elements; each section renders a dedicated content panel. See CONVENTIONS.md for the full pattern spec.

- **`/sparse`** — Sparse (SvelteKit timesheet/expense app for Utilicom Technologies). Nav: Overview, Features, Tech Stack, Links. Private repo, no iframe.
- **`/weather`** — Weather & Wellness (Python/Flask dashboard). Nav: Overview, Features, Tech Stack, Links. Live at `https://weather-and-wellness-dashboard.vercel.app`.
- **`/techy`** — Techy (SvelteKit knowledge graph, GitHub auth required). Nav: Overview, Features, Tech Stack, Links. Live at `https://techy-psi.vercel.app`. Source: `https://github.com/AG9898/Techy`.
- **`/glass-atlas`** — Glass Atlas (embeddable Next.js app). Nav: Overview (full-bleed iframe), About, Tech Stack, Links. Live at `https://glass-atlas-production.up.railway.app`.
- **`/pigeoncoop`** — PigeonCoop (Rust/Tauri agent workflow desktop app). Nav: Overview, Features, Tech Stack, Links. In active development, no live URL.
- **`/buddy`** — buddy (Windows npm CLI + Electron floating pet). Nav: Overview (terminal demo + pet sprite), Features, Tech Stack, Links. In active development, pre-release. Two co-located sub-components live alongside the page: `PetSprite.tsx` (CSS spritesheet animation) and `TerminalSimulator.tsx` (auto-play typewriter demo). Sprite asset: `public/buddy/spritesheet.webp` (8 cols × 9 rows WebP, copied from source project). Terminal demo sequences through real CLI commands and emits `onStateChange` to drive the pet's animation state.
- **`/about`** — About page. Nav: About Aden, How I Work, Frontend Focus, What I Value.
- Content is hardcoded in each route file — no backend, no CMS.

#### CV window (`/cv`)

- `ResumeRenderer` (`src/app/components/CV/ResumeRenderer.tsx`) reads `src/data/resume.json` via a static import and renders all resume sections as styled HTML inside the window.
- The macOS Preview chrome is preserved: a toolbar row (open-in-tab, download buttons) and a left sidebar showing section names (Summary, Experience, Education, Skills, Projects) as a mini nav.
- The sidebar section nav is the only interactive sidebar in the CV window; clicking a section name scrolls the main content pane to that section.
- `/cv/print` is a route handler that returns standalone, parser-safe resume HTML for PDF export. It intentionally bypasses the persistent desktop shell so exported PDFs contain selectable text instead of a rendered desktop screenshot.
- `public/cv.pdf` is a generated artifact used exclusively for the download and open-in-tab buttons. It is not kept in sync automatically — run `npm run export:cv` to regenerate it after editing `resume.json` (or `npm run publish:resume` to regenerate **and** push the resume to the downstream Waunder app — see *Resume Sync to Waunder* below).
- Media assets (screenshots, video) go in `aspect-video` placeholder slots within Overview or Features panels, pointing to `/public/projects/<slug>/`.

### Theme

- `next-themes` controls dark/light mode.
- Dark mode tokens are canonical; light mode overrides invert the frosted-glass system.
- `ThemeProvider` disables system theme detection and defaults to dark, so first paint follows the canonical dark theme unless the user explicitly toggles light.

---

---

## Build & Tooling

### CV Export Script (`scripts/export-cv.js`)

- Node.js script using `puppeteer` that assumes `npm run dev` is already running on `localhost:3000`, navigates to `/cv/print`, prints the standalone resume HTML to PDF, and writes the output to `public/cv.pdf`.
- Run via `npm run export:cv` (defined in `package.json`).
- If the dev server is running on a different port, run `CV_EXPORT_ORIGIN=http://localhost:<port> npm run export:cv` so Puppeteer exports this app instead of whichever process owns port 3000.
- Not run as part of CI or the production build — on-demand only.
- After running, `public/cv.pdf` is the up-to-date artifact to commit for the download button. Verify parser safety with `pdftotext -layout public/cv.pdf -` when available; the output should contain the resume text in reading order.

### Resume Sync to Waunder (`scripts/sync-resume.js`)

- This portfolio is the **single source of truth** for the resume. A separate project, **Waunder**
  (a personal job-application assistant), consumes the resume to score jobs and draft applications.
- `npm run sync:resume` pushes three artifacts to Waunder's ingest endpoint
  (`POST $WAUNDER_BASE_URL/api/profile/resume`): the canonical `src/data/resume.json` (JSON Resume),
  `public/CV_AG.md` (text), and `public/cv.pdf` (the file Waunder's worker uploads to ATS forms).
  Waunder maps the JSON deterministically — it does **not** parse the PDF.
- Auth: Waunder is single-user. The script opens a session by POSTing `WAUNDER_APP_SECRET` to
  `/api/session`, then reuses the returned cookie for the upload. The secret is read from the
  environment and never logged.
- Push-on-export convenience: `npm run publish:resume` runs `export:cv` then `sync:resume`. Run the
  dev server first (export:cv needs it). Requires `WAUNDER_BASE_URL` and `WAUNDER_APP_SECRET` (see
  [`ENV_VARS.md`](ENV_VARS.md)). On-demand only; not part of CI or the production build.

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
| Waunder (`POST /api/profile/resume`) | Downstream consumer of the resume; `sync:resume` pushes the JSON Resume + PDF/markdown to it. Outbound, on-demand, dev-machine only — not part of the deployed site. | Optional |

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
