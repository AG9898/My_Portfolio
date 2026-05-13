# My Portfolio — Agent Working Guide

AGENTS.md is the canonical agent guide. CLAUDE.md is a symlink to it.

This is a living document. Update it when a task reveals a constraint, pitfall, or pattern that future agents should know.

---

## Overview

This repository is a frontend-only personal portfolio built with Next.js 14, TypeScript, and Tailwind CSS. The canonical product direction is a macOS desktop OS experience: persistent wallpaper, menu bar, dock, desktop shortcuts, and draggable/resizable app windows. The canonical task queue is [`docs/workboard.json`](docs/workboard.json).

Docs navigation: [`docs/INDEX.md`](docs/INDEX.md)

---

## Quick Start

```bash
npm install
npm run dev
npm run lint
npm run build
```

---

## Build & Verification Commands

| Command | What it checks | Speed |
|---|---|---|
| `npm run lint` | ESLint with Next.js rules | fast |
| `npm run build` | Production compile and static validation | slow |
| `npm run analyze` | Production build with bundle analysis | slow |
| `npm run performance` | Production build and local production start | slow |

Run `npm run lint` before marking code changes done. Run `npm run build` for structural, routing, or dependency changes.

---

## Repository Structure

```text
src/app/              Next.js App Router pages, layout, and app shell
src/app/components/   Desktop, window manager, menu bar, dock, and window UI
src/app/globals.css   Resets, theme tokens, and global motion rules only
public/               Static assets served from the site root
docs/                 Project documentation and task queue
  INDEX.md              Documentation navigation map
  PRD.md                Product requirements and success criteria
  ARCHITECTURE.md       Runtime topology and component responsibilities
  CONVENTIONS.md        Coding standards and implementation patterns
  DECISIONS.md          Architectural decision log
  ENV_VARS.md           Environment variable reference
  TESTING.md            Verification and testing guide
  macos-redesign.md     Canonical redesign direction
  workboard.json        Canonical task queue
  workboard.schema.json Workboard JSON Schema
  workboard.md          Workboard usage contract
```

---

## Architecture

- `docs/macos-redesign.md` is canonical. It supersedes the old brutalist/Stitch layout and any older style guide or design plan.
- `src/app/layout.tsx` owns the persistent desktop shell and should keep wallpaper, menu bar, dock, desktop icons, and the window manager mounted across route changes.
- Routes map to app windows: `/` home, `/projects`, `/about`, `/contact`, and `/cv`.
- The window manager owns open windows, focused route, z-index order, geometry, minimized state, maximized state, and snapped state.
- Enforce one window per app/route by default. Opening an already-open app focuses and restores it instead of creating a duplicate.
- Preserve `/public/cv.pdf` as the carried-forward CV asset.

Full topology and component responsibilities: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Code Style & Constraints

### Never

- Never use the old brutalist/Stitch design direction for new work.
- Never preserve old `src/` UI components or global styles unless explicitly requested.
- Never add new Heroicons usage; use `lucide-react`.
- Never bulk-rewrite `docs/workboard.json`; use targeted edits only.
- Never commit secrets, `.env.local`, or generated build output such as `.next/`.

### Always

- Always follow `docs/macos-redesign.md` for portfolio UX and visual direction.
- Always follow `docs/styling.md` for color tokens, glass materials, typography, and motion specs.
- Always use Tailwind for component styling and keep `globals.css` limited to resets, tokens, and global motion rules.
- Always use the macOS system font stack; do not add Google Fonts.
- Always keep window behavior deterministic in reducer-style code.
- Always update relevant docs when public behavior, architecture, conventions, or testing patterns change.

### Patterns

- Desktop shell components belong under `src/app/components/Desktop/`, `MenuBar/`, `Dock/`, `Window/`, and `WindowManager/`.
- Use `framer-motion` for window open/close/minimize/restore, dock magnification, and page transitions.
- Use `react-rnd` for draggable and resizable windows.
- Use `next-themes` for dark/light mode; dark mode is canonical and light mode is token inversion.

Full convention guide: [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)

---

## Maintaining Docs

Docs must stay current with code. Update the relevant doc in the same commit as the behavior or architecture change.

| What changed | Doc to update |
|---|---|
| Product scope, users, success criteria | [`docs/PRD.md`](docs/PRD.md) |
| Desktop shell topology, routing, window manager boundaries | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Coding pattern, naming rule, or never/always constraint | [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) |
| Env var added, removed, renamed, or changed | [`docs/ENV_VARS.md`](docs/ENV_VARS.md) |
| New architectural question or resolved decision | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| Test command, test file, or verification pattern changed | [`docs/TESTING.md`](docs/TESTING.md) |
| Any doc added, removed, renamed, or moved | [`docs/INDEX.md`](docs/INDEX.md) |
| Constraint or gotcha discovered during a task | This file, under Discoveries |

---

## Workboard

The canonical task queue is [`docs/workboard.json`](docs/workboard.json).
Schema and usage contract: [`docs/workboard.md`](docs/workboard.md).
Machine validation schema: [`docs/workboard.schema.json`](docs/workboard.schema.json).

A task is startable when:
- `status == "todo"`
- `blocked_by` is empty or missing
- all `depends_on` tasks have `status == "done"`

Targeted edit rules:
- Never rewrite the full workboard.
- Only update status fields for the task currently being worked.
- Roll back `in_progress` to `todo` if blocked mid-task and unresolved.

---

## Agent Workflow

1. Read this file at the start of every session.
2. Check [`docs/INDEX.md`](docs/INDEX.md) for the relevant docs.
3. Read [`docs/macos-redesign.md`](docs/macos-redesign.md) before UI architecture or design work.
4. Inspect the code before editing; prefer existing project patterns unless they conflict with the redesign doc.
5. Implement the requested change with focused edits.
6. Run the appropriate verification commands.
7. Update docs and this guide if the task changes constraints or reveals a durable gotcha.

### Stopping Conditions

Stop and report when:
- No startable workboard task exists and no direct user request is active.
- A verification command fails and the fix is not obvious.
- A destructive action, deployment, credential change, or external publish is required and not explicitly authorized.
- A requested design change conflicts with `docs/macos-redesign.md` and cannot be reconciled without product direction.

---

## Environment Variables

This project currently has no required environment variables for local development.

See [`docs/ENV_VARS.md`](docs/ENV_VARS.md) for the canonical variable and secret matrix.

---

## Testing

Fast check for code changes:

```bash
npm run lint
```

Broader check for routing, dependency, or build-sensitive changes:

```bash
npm run build
```

Full testing guidance: [`docs/TESTING.md`](docs/TESTING.md)

---

## Deployment

Deployment details are not documented in this repo yet. Do not manually deploy or publish production changes unless the user explicitly asks for it.

---

## Discoveries

### 2026-05-06 — Redesign Supersedes Existing UI

`docs/macos-redesign.md` is the source of truth for new portfolio work. Existing brutalist/Stitch UI and styling in `src/` should be treated as scrap material, not as a design system to preserve.

### 2026-05-12 — Window Content Decoupled from Next.js Routing

App window content is no longer driven by the Next.js `children` prop. `WindowRenderer` now imports every page component directly and maps them in a static `WINDOW_CONTENT: Record<AppId, React.ComponentType>` registry. All open windows render their content simultaneously regardless of which window has focus. Adding a new app window requires updating three places: `src/app/<slug>/page.tsx`, `appMetadata.ts` (`APPS` array), and `WINDOW_CONTENT` in `WindowRenderer.tsx`. Page components must never use `useParams`, `useSearchParams`, or other route-context hooks — they are always mounted as standalone component instances.

### 2026-05-13 — JSON Resume as CV Source of Truth

`src/data/resume.json` (JSON Resume v1 schema) is the agent-editable source for all CV content. The CV window renders it as styled HTML via `ResumeRenderer` — there is no PDF iframe. `public/cv.pdf` is a generated artifact for the download button only; it is not kept in sync automatically. Run `npm run export:cv` (puppeteer script) to regenerate it after editing `resume.json`.

### 2026-05-08 — V1 Complete: Key Implementation Patterns

The following patterns emerged during the complete V1 implementation and are now canonical:

- **`flushSync` before AnimatePresence dispatch**: When removing a component from the DOM via reducer dispatch (close/minimize), set the `exitModes` state with `flushSync` before dispatching the reducer action. Without `flushSync`, React batches both updates and the exit variant may not be set when `AnimatePresence` reads it.
- **`useReducedMotion` for framer-motion components**: Use `useReducedMotion()` from `framer-motion` (not CSS media query in JS) to check `prefers-reduced-motion` inside components that use motion variants. Pass it as a custom prop to variants.
- **`visibleIdsRef` pattern for AnimatePresence cleanup**: Use a `useRef` tracking current visible IDs, updated each render, so `onExitComplete` callbacks always read the current set instead of a stale closure.
- **syncRoute guard against feedback loops**: The `syncRoute` reducer action returns unchanged state if `focusedId` already matches the target app. This prevents the `useEffect`s in `WindowManagerProvider` from creating a push→sync→push cycle when the URL and window focus agree.
- **Dock indicator dot via `opacity` not `display`**: The 4×4px dot under dock icons uses `opacity: isOpen ? 0.9 : 0` rather than conditional rendering, so the layout slot is always reserved and no layout shift occurs on open/close.
