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
- Keep shared app metadata in a registry module (`src/app/components/appMetadata.ts`) instead of duplicating route titles, icons, default sizes, positions, or app IDs. The `APPS` array is the canonical source for id, route, label, title, icon, defaultSize, and defaultPosition.

### Styling

- Prefer Tailwind utilities for component styling.
- Keep `src/app/globals.css` limited to resets, CSS custom properties, theme tokens, and global motion rules.
- Use the macOS system font stack only; do not import Google Fonts.
- Dark mode is canonical. Light mode should be implemented through token overrides.
- Use frosted glass treatments for menu bar, dock, and window chrome.

### App Router client boundary

- Shell components that use state, effects, event handlers, or framer-motion must include `"use client"` at the top of the file. This applies to: `MenuBar`, `Dock`, `DockIcon`, `Window`, `TrafficLights`, `DesktopIcon`, `BootScreen`, and any component using `useWindowManager`.
- Prefer pushing `"use client"` to leaf components so parent layouts remain server components where possible.
- Never add `"use client"` to layout.tsx itself — mount client shell components as children instead.

### Interaction Patterns

- Window state changes should go through deterministic reducer actions. The canonical state types (`WindowState`, `WindowEntry`, `WindowAction`, `WindowGeometry`, `SnapState`) and `windowReducer` are defined in `src/app/components/WindowManager/windowReducer.ts`.
- Opening an already-open app focuses and restores it.
- Dragging and resizing use `react-rnd`.
- Animations use `framer-motion`. Use `AnimatePresence` for any component that needs an exit animation (window close, boot screen fade-out) — CSS transitions cannot animate unmounting.
- Menu bar dropdowns use `@radix-ui/react-dropdown-menu`.
- **`lucide-react` is for UI chrome glyphs only** (status bar icons, toolbar buttons, decorative controls). Desktop shortcut icons and dock app icons use custom SVG artwork — see `reference/design draft/design_handoff_macos_desktop_shell/desktop.jsx` for the exact SVG designs. Never substitute a lucide icon for an app icon.

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

## Always

- Always read [`macos-redesign.md`](macos-redesign.md) before redesign implementation.
- Always preserve `/public/cv.pdf` unless the user requests a replacement.
- Always keep `CLAUDE.md` as a symlink to root `AGENTS.md`.
- Always update [`INDEX.md`](INDEX.md) when docs change.
