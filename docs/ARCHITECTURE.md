# Architecture

Canonical source for runtime topology, component responsibilities, routing, and state boundaries. Detailed design direction lives in [`macos-redesign.md`](macos-redesign.md).

---

## Overview

This is a frontend-only Next.js 14 App Router portfolio. The root layout owns a persistent macOS-style desktop shell, while route pages provide app-window content for Home, Projects, About, Contact, and CV.

---

## System Topology

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS.
- **Client interaction layer:** `framer-motion`, `react-rnd`, `next-themes`, Radix dropdown menus, `lucide-react`, and canvas wallpaper using `simplex-noise`.
- **Static assets:** served from `public/`, including the carried-forward `cv.pdf`.
- **Backend/database/auth:** none.

---

## Component Responsibilities

### App Router

- `src/app/layout.tsx` mounts the persistent desktop shell and window manager provider.
  - `html` element carries `suppressHydrationWarning` (required by `next-themes`).
  - `ThemeProvider` uses `attribute="data-theme"` to match the CSS selector `[data-theme="light"]` in `globals.css`; `defaultTheme="dark"`, `enableSystem={false}`.
  - `#desktop-root` div is `position: fixed; inset: 0; overflow: hidden; bg-desktop` — the stable shell container that never unmounts.
  - Font is set via inline `style` on `body` using the macOS system font stack (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif`); no Google Fonts import.
  - Inside `#desktop-root`, from back to front: wallpaper placeholder div (`absolute inset-0 bg-desktop`), `<MenuBar />` (`z-50`, `h-7`), `<DesktopShortcuts />` (`z-10`, top: 48px), `<main>` page content area (`absolute`, `top: 28`, `bottom: 80`, `overflow-hidden`), `<Dock />` (`z-40`, `bottom-3`).
  - The `<main>` content area sits between the menu bar (28px tall) and the dock (80px clearance at the bottom), so route children never overlap shell chrome.
- Route pages provide content for their app windows.
- Route changes focus/open app windows without unmounting wallpaper, menu bar, dock, desktop icons, or other open windows.

### Desktop Shell

- Owns wallpaper, boot sequence, desktop icon column, menu bar, dock, and mobile fallback.
- Does not own per-window content state beyond shell-level navigation affordances.

#### MenuBar (`src/app/components/MenuBar/MenuBar.tsx`)

- Static 28px bar using `.glass-menubar` with `borderBottom: 1px solid rgba(255,255,255,0.08)`.
- Left: Apple logo SVG → app name placeholder (static "Finder" until V1_008A wires focused-app name) → File / Edit / View / Window / Help menu buttons.
- Right: Control Centre SVG → Battery visual (24×12px rect, 78% fill, decorative) → Wi-Fi SVG → date → live clock.
- Clock uses `useState<Date | null>(null)` initialised null on the server; `useEffect` populates it on the client and starts a 1000ms interval. Date and time strings are only rendered once non-null, eliminating SSR/client hydration mismatch. Requires `"use client"` directive.

#### Dock (`src/app/components/Dock/Dock.tsx`)

- Static bottom dock using `.glass-dock`, absolutely positioned at `bottom-3`, centered horizontally.
- Dock border: `1px solid rgba(255,255,255,0.22)`. Dock shadow: inset top/bottom highlights + `0 30px 80px rgba(0,0,0,0.5)`.
- Dock padding: `8px 12px`, border radius: `22px`. Icon base size: `56px`.
- Renders one button per app from the `APPS` registry. Each icon uses an individual SVG matching the design handoff.
- No magnification, tooltip, or animation in this phase — deferred to V1_009B.
- Running indicator dot slot is present but transparent until V1_009B wires window state.
- Requires `"use client"` directive.

#### Desktop Shortcuts (`src/app/components/Desktop/DesktopShortcuts.tsx`)

- 88px-wide left sidebar column, positioned `left: 16px; top: 48px` (clears menu bar).
- Renders one shortcut item per app from the `APPS` registry (all five apps).
- Each shortcut is a 56×56px SVG using file-type metaphors: txt (home), folder (projects), person (about), msg (contact), pdf (cv).
- File labels are mapped via `ICON_LABELS` record (e.g., `"about_me.txt"`, `"projects/"`, `"aden_guo_cv.pdf"`); route/id come from `APPS`.
- Single click: selected state — `rgba(10,132,255,0.28)` background + `1px solid rgba(10,132,255,0.55)` border; label becomes `rgba(10,132,255,0.95)` pill.
- Double click: open stub (no-op) — wired to window manager in V1_007B.
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

### App Windows

- Render macOS-style chrome, traffic lights, optional toolbar, and the route app content.
- Use `react-rnd` for drag and resize behavior.
- Use `framer-motion` for opening, closing, minimizing, restoring, and inner page transitions.

### Theme

- `next-themes` controls dark/light mode.
- Dark mode tokens are canonical; light mode overrides invert the frosted-glass system.

---

## Routing and State Flow

1. User clicks a desktop icon, dock item, or in-window navigation target.
2. Window manager opens or restores the corresponding app window.
3. Focused app becomes the highest z-index window.
4. URL updates to the focused app route.
5. Desktop shell remains mounted throughout the transition.
6. Closing the focused window focuses the next highest z-index open window or returns to `/` if none remain.

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
