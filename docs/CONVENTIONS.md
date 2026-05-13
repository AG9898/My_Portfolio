# CONVENTIONS.md — Code Style and Patterns

Normative guide for code in this portfolio. Read before writing new UI architecture or components.

---

## Universal Rules

- No secrets in source. Use `.env.local` only if environment variables are added later.
- No orphaned code. Remove dead code instead of commenting it out.
- No old design carryover. The brutalist/Stitch layout is deprecated.
- Prefer small, focused components organized around the desktop OS metaphor.
- Keep docs current when behavior, architecture, or conventions change.

---

## Frontend (TypeScript / React / Next.js)

### Language and Types

- TypeScript is required for all app code.
- Prefer explicit domain types for window state, app registry entries, geometry, and actions.
- Avoid `any` in new code; use `unknown` with narrowing when needed.
- React components use PascalCase filenames and exports.
- Hooks use `useCamelCase`.

### Module and File Organization

- App routes live under `src/app/`.
- Desktop shell components belong under `src/app/components/Desktop/`.
- Window state and reducer code belongs under `src/app/components/WindowManager/`.
- Window chrome belongs under `src/app/components/Window/`.
- Menu bar components belong under `src/app/components/MenuBar/`.
- Dock components belong under `src/app/components/Dock/`.
- Keep shared app metadata in a registry module (`src/app/components/appMetadata.ts`) instead of duplicating route titles, icons, default sizes, positions, or app IDs. The `APPS` array is the canonical source for id, route, label, title, icon, defaultSize, defaultPosition, and showInDock.
- `showInDock: false` on an `AppMetadata` entry keeps the app in `DesktopShortcuts` but excludes it from the Dock. Use this for project-specific windows that are not core navigation destinations. The Dock filters `APPS` to entries where `showInDock !== false`; `DesktopShortcuts` renders the full registry.
- **Adding a new app window requires three coordinated changes:**
  1. Create the page component at `src/app/<slug>/page.tsx`.
  2. Add an entry to `APPS` in `src/app/components/appMetadata.ts` (new `AppId`, route, label, title, icon, defaultSize, showInDock).
  3. Add an entry to `WINDOW_CONTENT` in `src/app/components/WindowManager/WindowRenderer.tsx` mapping the new `AppId` to the imported component.
- App window page components must be self-contained: no `useParams`, `useSearchParams`, `useRouter`, or other route-context hooks. Content is always mounted independently of the active URL.
- **All app window pages** (project showcases and About) use a **panel-switching sidebar pattern**: a `"use client"` component with `useState` tracking the active section. Sidebar items are `<button>` elements that set the active section; the main pane renders only the active panel. There are no non-interactive (decorative) sidebars.
  - **Standard project nav** (Sparse, Techy, Weather & Wellness): four sections — Overview, Features, Tech Stack, Links. Each page defines its own typed `Section` union and `NAV` array. No shared component; each page is self-contained.
  - **Glass Atlas** (embeddable): Overview renders a full-bleed iframe (the live app). Its nav is Overview / About / Tech Stack / Links — "Overview" means the live embed, not the project description.
  - **About page**: four personal sections — About Aden, How I Work, Frontend Focus, What I Value.
  - **Media assets** — screenshots and video clips go inside the Overview or Features panel, in `aspect-video` placeholder slots (`<div>` or `<img>`) pointing to `/public/projects/<slug>/`. Placeholder divs stay in place until assets arrive so no layout changes are needed when they do.
- Iframe pages hardcode their `src` URL directly — no shared generic browser component. Full-bleed iframes use `h-full w-full border-0` on the `<iframe>` and `min-h-0 flex-1` on the containing `<div>`, with the outer window container using `flex h-full`.

### Styling

- Prefer Tailwind utilities for component styling.
- Keep `src/app/globals.css` limited to resets, CSS custom properties, theme tokens, and global motion rules.
- Use the macOS system font stack only; do not import Google Fonts.
- Dark mode is canonical. Light mode should be implemented through token overrides.
- Use frosted glass treatments for menu bar, dock, and window chrome.
- Wallpaper components may use inline dynamic CSS variables for user-selected color settings. These values are interactive wallpaper inputs, not hardcoded UI chrome colors.

### App Router client boundary

- Shell components that use state, effects, event handlers, or framer-motion must include `"use client"` at the top of the file. This applies to: `MenuBar`, `Dock`, `DockIcon`, `Window`, `TrafficLights`, `DesktopIcon`, `BootScreen`, and any component using `useWindowManager`.
- Prefer pushing `"use client"` to leaf components so parent layouts remain server components where possible.
- Never add `"use client"` to layout.tsx itself — mount client shell components as children instead.

### Interaction Patterns

- Window state changes should go through deterministic reducer actions. The canonical state types (`WindowState`, `WindowEntry`, `WindowAction`, `WindowGeometry`, `SnapState`) and `windowReducer` are defined in `src/app/components/WindowManager/windowReducer.ts`.
- Opening an already-open app focuses and restores it.
- Dragging and resizing use `react-rnd`.
- **Snap geometry** — `snapLeft`/`snapRight` actions accept `desktopWidth`, `desktopHeight`, and `desktopTop` (pixels from viewport top to the desktop area, i.e. the menu bar height). The snap geometry is set as `{ x: 0|half, y: desktopTop, width: half|remainder, height: desktopHeight }` so snapped windows align with the safe desktop area (below menu bar, above dock). `restoreGeometry` is saved only when the window is currently in the unsnapped state (`snapped === "none"`).
- **Maximize geometry** — `maximize` saves the current geometry to `restoreGeometry`, then renders the window as a `position:fixed` overlay covering the desktop area (top: 28px to bottom: 80px) via `WindowRenderer` — no geometry values are stored in reducer state for the maximized position.
- **Green traffic light behavior** — left-click maximizes an unmaximized, unsnapped window; left-click on a maximized or snapped window restores it. Right-click opens a context menu with Snap Left, Snap Right, Maximize, and Restore options.
- Animations use `framer-motion`. Use `AnimatePresence` for any component that needs an exit animation (window close, boot screen fade-out, inner window page transitions) — CSS transitions cannot animate unmounting.
- Inner window page transitions use a short opacity/y motion and must skip animation when `prefers-reduced-motion` is active.
- Menu bar dropdowns use `@radix-ui/react-dropdown-menu`.
- **`lucide-react` is for UI chrome glyphs only** (status bar icons, toolbar buttons, decorative controls). Desktop shortcut icons and dock app icons use custom SVG artwork — see `reference/design draft/design_handoff_macos_desktop_shell/desktop.jsx` for the exact SVG designs. Never substitute a lucide icon for an app icon.

### Wallpaper Patterns

- `WallpaperProvider` owns selected wallpaper and transient per-wallpaper settings. Do not persist wallpaper selection or custom colors unless a future task explicitly changes that product behavior.
- Keep customizable wallpaper settings typed per theme instead of sharing one palette object across unrelated renderers.
- Menu bar wallpaper controls stay inside the existing wallpaper dropdown and should render only for the active customizable theme. Prefer compact swatches and native color inputs for color values; use sliders only for numeric wallpaper settings.
- Keep wallpaper renderers isolated by theme so canvas, WebGL, and CSS-gradient code do not accumulate in one large branch.
- Canvas and WebGL wallpaper renderers must clean up requestAnimationFrame loops, resize listeners, shader/program resources, and any pointer listeners they create.
- Wallpaper animation must respect `prefers-reduced-motion`: throttle, pause, or simplify motion while preserving a recognizable static visual.

### Accessibility Patterns

- All interactive icon-only controls (dock buttons, traffic lights, theme toggle) must have `aria-label` describing their action.
- Purely decorative status icons in the menu bar (ControlCentre, Battery, Wi-Fi SVGs) must have `aria-hidden="true"`.
- Focus rings use `focus-visible:` variants only — not plain `focus:` — to avoid showing rings on mouse click.
  - Dock buttons and desktop shortcut buttons: `focus-visible:ring-2 focus-visible:ring-accent`.
  - Traffic light buttons: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70`.
  - MenuBar dropdown triggers: `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1`.
- App windows use `role="dialog" aria-modal="true" aria-label={title}`.
- The green traffic light snap context menu uses `role="menu"` on the container and `role="menuitem"` on items. On open it auto-focuses the first enabled item and supports ArrowUp/ArrowDown navigation and Escape to close.

---

## Testing

- There is no configured test framework yet.
- Run `npm run lint` for code changes.
- Run `npm run build` for route, dependency, TypeScript, or production-sensitive changes.
- Use browser or Playwright screenshots for major desktop shell and responsive fallback changes when practical.

Full testing guide: [`TESTING.md`](TESTING.md)

---

## Never

- Never follow deprecated `styleguide.md` or `design-plan.md` guidance for new work.
- Never add a new styling framework without explicit approval.
- Never introduce backend, database, or auth complexity for static portfolio content without explicit approval.
- Never duplicate app metadata across desktop icons, dock items, menu labels, and routes.
- Never bulk-rewrite `docs/workboard.json`.
- Never reconstruct the `.glass-*` backdrop-filter stack inline in component files — always use the named utility class.
- Never use inline hex values for UI surface backgrounds or text colors in component files. Traffic light colors must use `bg-traffic-red`, `bg-traffic-yellow`, `bg-traffic-green`. SVG design-handoff artwork (icons) is exempt.

## Always

- Always read [`macos-redesign.md`](macos-redesign.md) before redesign implementation.
- Always preserve `/public/cv.pdf` unless the user requests a replacement.
- Always keep `CLAUDE.md` as a symlink to root `AGENTS.md`.
- Always update [`INDEX.md`](INDEX.md) when docs change.
