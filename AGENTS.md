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

`src/data/resume.json` (JSON Resume v1 schema) is the agent-editable source for all CV content. The CV window renders it as styled HTML via `ResumeRenderer` — there is no PDF iframe. `public/cv.pdf` is a generated artifact for the download button only; it is not kept in sync automatically. After editing `resume.json`, run `npm run publish:resume` to regenerate `public/cv.pdf` **and** push the resume to the downstream Waunder app (see the *Resume Sync to Waunder* discovery below); use `npm run export:cv` alone only when you deliberately want to skip the Waunder sync.

### 2026-06-06 — CV Export Must Use Route Handler

The parser-safe PDF export surface is `/cv/print`, implemented as a route handler that returns standalone resume HTML. Do not export from `/cv?print=1`: the persistent desktop shell does not render route children directly, so Puppeteer can capture the desktop shell or a rasterized page instead of selectable resume text. After export, verify with `pdftotext -layout public/cv.pdf -`; empty output means the PDF is not ATS-safe.

### 2026-06-06 — CV Subsystem Doc + Drift Reconciled

The legacy `/cv?print=1` in-window mode and its dead `body.cv-print-mode` print CSS were removed; `/cv/print` is the sole export surface. Date/URL formatting (`formatDate`, `formatDateRange`, `displayUrl`) is now shared via `src/app/components/CV/resumeFormat.ts`, imported by both `ResumeRenderer.tsx` and `cv/print/route.ts`. The `/cv/print` layout is the canonical section order — `Summary → Skills → Experience → Education → Projects` — and `ResumeRenderer` plus the window's `SECTION_NAV` mirror it; section order is not enforced by the shared helpers, so reorder all three together. `docs/CV.md` is the canonical reference for the CV subsystem. `public/cv.pdf` is the in-use export; `public/CV_AG.*` are legacy/unused.

### 2026-05-25 — buddy Added as Desktop Shortcut

buddy (`/buddy`) is a Windows npm CLI + Electron floating pixel-art pet app. The pet (default: Ragdoll cat) reacts to Claude Code / Codex hook events. Source codebase: `/projects/buddy`. GitHub: `github.com/AG9898/buddy`. Status: in active development, pre-release, no npm publish yet. Spritesheet asset: `/projects/buddy/pets/default/spritesheet.webp` — copy to `public/buddy/spritesheet.webp` for use in the portfolio. Animation state machine: `/projects/buddy/pets/default/pet.json` (8 cols × 9 rows, 9 states). The page has two co-located helper components: `PetSprite.tsx` (mirrors PetSprite.svelte logic using CSS background-position stepping + requestAnimationFrame) and `TerminalSimulator.tsx` (auto-play typewriter that sequences through real CLI commands and fires `onStateChange` to update the sprite). CLI output format: read `/projects/buddy/src/cli/output.ts` and `/projects/buddy/docs/CLI.md`. Hook event → animation state mapping: `UserPromptSubmit → jumping`, `PreToolUse → running`, `PostToolUse → idle`, `PermissionRequest → waiting`, `Stop → waving`.

### 2026-05-15 — PigeonCoop Added as Desktop Shortcut

PigeonCoop (`/pigeoncoop`) is a Rust/Tauri local-first desktop app for designing, running, monitoring, and replaying agent workflows through a game-inspired 2D interface. Source codebase: `/projects/PigeonCoop`. GitHub: `github.com/AG9898/PigeonCoop`. Status: in active development, no live URL. Image assets: `/public/PigeonCoop/` (three images: `Pigeon-workspace.png`, `Pigeon-workspace-planned.png`, `Pigeon-mermaid-diagram.png`). The page component is authored from the source codebase docs at `/projects/PigeonCoop/docs/` — read `PRD.md`, `DESIGN_SPEC.md`, and `Cargo.toml` for content; `ARCHITECTURE.md` for tech architecture highlights. Detail level and page structure must match `src/app/techy/page.tsx` — four sidebar panels (Overview, Features, Tech Stack, Links), lightbox, real content throughout, no placeholder text.

### 2026-06-10 — Resume Sync to Waunder (push-on-export)

`scripts/sync-resume.js` (`npm run sync:resume`, or `publish:resume` = `export:cv` + `sync:resume`)
pushes the resume to **Waunder**, a separate personal job-application assistant (`/projects/Waunder`)
that uses the resume to score jobs and draft applications. This portfolio stays the single source of
truth: the script POSTs `src/data/resume.json` (JSON Resume), `public/CV_AG.md`, and `public/cv.pdf` to
`POST $WAUNDER_BASE_URL/api/profile/resume`. Waunder maps the JSON deterministically into its own
Profile/ResumeDocument and does NOT parse the PDF, so keep `resume.json` canonical and rerun
`export:cv` before syncing so the pushed PDF matches. Auth is a shared secret: the script opens a
Waunder session via `POST /api/session` with `WAUNDER_APP_SECRET` (= Waunder's `APP_SHARED_SECRET`),
then reuses the cookie. Needs `WAUNDER_BASE_URL` + `WAUNDER_APP_SECRET` (see `docs/ENV_VARS.md`); the
secret is read from env and never logged. Node 22's global `fetch`/`FormData`/`Blob` are used — no deps
added. This is dev-machine/on-demand only; it is not part of the deployed site, CI, or the build.

### 2026-06-17 — Native Desktop Interactions (marquee + context menus + Get Info)

The empty desktop now supports macOS-style interactions, owned by a new `DesktopProvider`
context (selection set, open context menu, open Get Info app id) that wraps the shell inside
`WallpaperProvider`. Key constraints for future work:

- **`DesktopSurface` is the empty-space catcher at `z-index: 5`** (above wallpaper `0`, below
  shortcuts `10` and windows `20+`). It only acts when `e.target === e.currentTarget`, so it never
  steals clicks from icons, windows, dock, or menu bar. Marquee hit-tests `[data-desktop-icon]`
  elements by `getBoundingClientRect`; every shortcut therefore carries `data-desktop-icon` +
  `data-app-id`. The marquee rectangle renders inside the surface, so it sits *behind* icons (z-10) —
  acceptable since icons highlight on selection; do not expect the band to paint over icons.
- **Icon selection is multi-select in `DesktopProvider`**, not local state. `DesktopShortcuts` no
  longer owns `selectedId`. `ShortcutFileIcon` and `ICON_LABELS` are exported from
  `DesktopShortcuts.tsx` for reuse (the Get Info panel renders the icon).
- **Context menu + Get Info render via `DesktopMenuLayer`**, mounted last in the shell, at
  `z-index: 10000` / `9000` so they stack above everything. `ContextMenu` dismisses on outside
  click / Escape / scroll / resize / blur.
- **Get Info content lives in `desktopInfo.ts` (`DESKTOP_INFO`)** keyed by `AppId` — only the six
  desktop-shortcut apps have entries. The "Comments" field is the easter-egg line; keep additions
  playful but accurate to what each app actually is.
- **"Change Wallpaper" cycles** `flow-field → tahoe-dawn → spooky-smoke → gradient-dots` via
  `WallpaperProvider.setWallpaper`; the desktop menu also toggles light/dark via `next-themes`.
- Testing note: when the Home window is open and centered it overlaps the lower desktop icons, so a
  Playwright `dblclick` on a lower icon (e.g. `buddy`) is intercepted by the window — drive top icons
  or move the window first.

### 2026-07-16 — Bites Showcase Direction

Bites (`/bites`) is a private, single-owner SvelteKit PWA that turns TikTok food posts into
verified saved places on a MapLibre map. Source codebase: `/projects/bites`. Both the deployed
Railway application and GitHub repository are private; the portfolio Links panel must state that
access is private and render no outbound links or URLs. The showcase follows the Techy/PigeonCoop
four-panel structure (Overview, Features, Tech Stack, Links) and uses real deployed data in its
map, expanded place-sheet, saved-list, and add-link screenshots. Assets belong under
`public/bites/`. Keep an editable Mermaid source alongside the rendered workflow diagram; the
diagram covers URL import → TikTok normalization/parsing → OCR/evidence extraction → Google
Places verification → explicit confirm/correct/discard → Place Details → Drizzle/Neon writes →
`GET /api/places` → MapLibre/List rendering. Never commit login credentials, cookies, or storage
state used while capturing the private deployment.

Asset pack (staged by V2_027, ahead of the React showcase): `public/bites/` holds the four
production screenshots — `bites-map.png`, `bites-place-detail.png`, `bites-add-link.png` (each a
390×844 phone viewport) and `bites-places-list.png` (the extra-tall saved-list capture cropped to
a representative 418×800 top viewport so the DINING list and bottom dock read at display size).
The editable diagram source is `src/app/bites/bites-workflow.mmd`, rendered to
`public/bites/bites-workflow.svg`; regenerate with
`npx --yes @mermaid-js/mermaid-cli -i src/app/bites/bites-workflow.mmd -o public/bites/bites-workflow.svg -b transparent`.
The diagram uses dashed nodes for transient parsing/provider work and solid nodes for the explicit
review gate and durable Drizzle/Neon writes. Mermaid is invoked via `npx` only — it is not a
package.json dependency, so do not add it.

Content layer (V2_028): unlike Techy/PigeonCoop, whose showcase content lives inline in
`page.tsx`, the Bites showcase content is a separate typed, UI-free module —
`src/app/bites/bitesData.ts`. It exports the four-section nav, status chips, overview copy,
feature cards, grouped stack, architecture notes, screenshot metadata (`BITES_SCREENSHOTS`,
`BITES_IMAGE_DIMS`), workflow metadata (`BITES_WORKFLOW`), and the private-access notice
(`BITES_ACCESS`). The future page component imports from it and adds no content of its own. The
module holds only local `/bites/*` asset paths — no deployed-site URL, repository URL, href, or
outbound link target — so keep the Links panel URL-free by sourcing its copy from `BITES_ACCESS`.

Page component (V2_029): `src/app/bites/page.tsx` is a `"use client"` static showcase that mirrors
the Techy panel-switching + lightbox pattern and consumes only `bitesData.ts` — no route-context
hook, iframe, or Mermaid runtime. The Overview screenshot grid renders all four `BITES_SCREENSHOTS`;
the Tech Stack panel renders the workflow diagram in a `max-h`/`overflow-y-auto` container and shares
the same lightbox. Gotcha: the workflow asset is an **SVG** and `next.config.js` does not set
`dangerouslyAllowSVG`, so the Next `Image` for any `.svg` source must pass `unoptimized` (the page
gates this on `src.endsWith(".svg")`); PNG screenshots go through the optimizer normally. Wiring into
the shell (AppId, APPS, WINDOW_CONTENT, shortcuts, Get Info, Projects Finder) is V2_030, not this
page.

Shell wiring (V2_030, done): `bites`/`/bites` added to `appMetadata.ts` (`AppId`, route union, `APPS`
with `defaultSize` 900×600 and `showInDock: false`); imported + mapped in `WindowRenderer.tsx`
(`WINDOW_CONTENT`, `WINDOW_TITLES`); `bites.app` shortcut with a rose food-map pin icon (`BitesIcon`)
in `DesktopShortcuts.tsx`; a private-PWA Get Info entry in `desktopInfo.ts`; and a frontend-category
Projects Finder card with `link: null` (no external-link control). No reducer, Dock, mobile-fallback,
resume, or CV files were touched.

### 2026-05-08 — V1 Complete: Key Implementation Patterns

The following patterns emerged during the complete V1 implementation and are now canonical:

- **`flushSync` before AnimatePresence dispatch**: When removing a component from the DOM via reducer dispatch (close/minimize), set the `exitModes` state with `flushSync` before dispatching the reducer action. Without `flushSync`, React batches both updates and the exit variant may not be set when `AnimatePresence` reads it.
- **`useReducedMotion` for framer-motion components**: Use `useReducedMotion()` from `framer-motion` (not CSS media query in JS) to check `prefers-reduced-motion` inside components that use motion variants. Pass it as a custom prop to variants.
- **`visibleIdsRef` pattern for AnimatePresence cleanup**: Use a `useRef` tracking current visible IDs, updated each render, so `onExitComplete` callbacks always read the current set instead of a stale closure.
- **syncRoute guard against feedback loops**: The `syncRoute` reducer action returns unchanged state if `focusedId` already matches the target app. This prevents the `useEffect`s in `WindowManagerProvider` from creating a push→sync→push cycle when the URL and window focus agree.
- **Dock indicator dot via `opacity` not `display`**: The 4×4px dot under dock icons uses `opacity: isOpen ? 0.9 : 0` rather than conditional rendering, so the layout slot is always reserved and no layout shift occurs on open/close.
