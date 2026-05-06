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
- Route pages provide content for their app windows.
- Route changes focus/open app windows without unmounting wallpaper, menu bar, dock, desktop icons, or other open windows.

### Desktop Shell

- Owns wallpaper, boot sequence, desktop icon column, menu bar, dock, and mobile fallback.
- Does not own per-window content state beyond shell-level navigation affordances.

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
