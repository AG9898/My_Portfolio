# PRD — My Portfolio

> **Status** (2026-05-11)
>
> | Track | State |
> |---|---|
> | Shipped | V1 complete — boot, persistent shell, window manager, 5 core app windows, motion, mobile fallback, wallpaper themes. |
> | In Progress | V2 — project shortcut windows, embedded live sites, Projects sidebar filter, project link polish. |
> | Planned | Further content updates and project additions as portfolio grows. |

---

## Objective

Build a memorable frontend portfolio where the browser behaves like a macOS desktop. The site should communicate personality, design taste, frontend implementation skill, and project experience through the OS metaphor rather than a conventional scrolling portfolio page.

---

## Users

- **Recruiters and hiring managers** — scan work, skills, contact paths, and CV quickly.
- **Engineers and design reviewers** — inspect interaction quality, architecture choices, polish, and implementation craft.
- **Aden** — maintain portfolio content and iterate on projects without rebuilding the shell.

---

## Scope

### Phase 1 — Desktop Shell

- Persistent desktop wallpaper, menu bar, dock, desktop icons, and boot screen.
- Static shell mounts from `src/app/layout.tsx` and does not unmount across route changes.
- Mobile fallback for small screens, including CV access and theme switching instead of rendering cramped draggable windows.

### Phase 2 — Window Manager

- Open, focus, close, minimize, restore, maximize, snap left/right, and z-index ordering.
- One window per route/app by default.
- Direct URL loads the matching app window.

### Phase 3 — App Content

- Home, About, Projects, Contact, and CV app windows.
- Per-app metaphors and toolbars: Notes/TextEdit, Finder, Mail, and Preview.
- Fresh content written for the redesign. Preserve `/public/cv.pdf`.
- Home and About use Notes/TextEdit-style document layouts with real first-pass portfolio copy.
- Projects uses a Finder-style browser with real project entries, descriptions, stack tags, and repo/path metadata.
- Contact uses a Mail-style compose sheet with practical outbound contact links and no backend form submission.
- CV uses a Preview-style PDF viewer around `/public/cv.pdf`, with open-in-tab and download actions.

### Complete V1 Boundary

- V1 is considered complete when the boot sequence, persistent desktop shell, working shortcut routes, full window interactions, complete motion/styling pass, mobile fallback, and first-pass real app content are implemented.

### Phase 4 — V2 Project Expansion

- Four new desktop shortcut icons: Glass Atlas, Techy, Sparse, and Weather & Wellness. Each has a distinctive SVG icon and appears only in the desktop shortcuts sidebar (not the dock).
- Glass Atlas and Techy open as iframe windows rendering their deployed sites (`https://glass-atlas-production.up.railway.app` and `https://techy-psi.vercel.app`). Each has an "open in new tab" fallback if embedding is blocked.
- Sparse and Weather & Wellness open as project showcase windows — static styled detail pages with description, status, stack, and links. No iframe.
- Projects window: sidebar categories become interactive filters. Project list updated with real clickable links and expanded to include all active projects (Zellaude-Plus, Glass Atlas, Techy, Sparse, Weather & Wellness, PigeonCoop).
- All existing project `ExternalLink` icons wired to real `href` values.

### Out of Scope

- Backend services, databases, authentication, or user accounts.
- Multi-user collaboration.
- Native desktop or mobile apps.
- Duplicate windows for the same route/app unless explicitly added later.

---

## Success Criteria

- Desktop shell persists while navigating between `/`, `/projects`, `/about`, `/contact`, `/cv`, `/glass-atlas`, `/techy`, `/sparse`, and `/weather`, including direct browser entry to any of those routes.
- Users can open multiple app windows, focus existing windows, minimize to dock, restore, close, maximize, and snap.
- URL reflects the focused app without unmounting the desktop chrome.
- The visual system reads as macOS-inspired: frosted glass, traffic lights, dock, menu bar, system typography, and dark canonical theme.
- Production build succeeds and the core experience works on modern desktop Chromium, Safari, and Firefox.
- Small screens receive an intentional full-screen fallback instead of a broken desktop layout.

---

## Constraints

- Frontend-only portfolio in Next.js 14 App Router.
- Tailwind CSS is the primary styling tool.
- Dark mode is canonical; light mode is a token inversion through `next-themes`.
- No external font imports; use the macOS system font stack.
- The old brutalist/Stitch UI is not a compatibility target.
- Audio in the boot sequence must respect browser autoplay restrictions and avoid Apple-owned chime assets unless explicitly licensed.

---

## Non-Goals

- This is not a general website builder or CMS.
- This is not intended to perfectly clone macOS; it should borrow the metaphor and interaction grammar while remaining a portfolio.
- Mobile does not need a full desktop simulation.
