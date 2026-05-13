# DECISIONS.md — Architectural Decision Log

> **Open decisions:** Do not resolve without explicit instruction from the project owner.
>
> **To resolve an open decision:**
> 1. Move the block to the Resolved section.
> 2. Fill in the `Resolved` date and `Decision` / `Why` fields.
> 3. Update affected docs.
>
> **To add a new open decision:** copy the template below and assign the next `OPEN-XX` number.

---

## Open Decision Template

```text
### OPEN-XX — <Short Decision Title>

**Question:** <What needs to be decided?>

**Context:** <Why does this matter?>

**Options under consideration:**
1. **Option A** — description. Tradeoff: ...
2. **Option B** — description. Tradeoff: ...

**Blocking:** <What is blocked until this is resolved?>

**See also:** <related docs or tasks>
```

---

## Open Decisions

*(No open decisions currently.)*

---

## Resolved Decisions

### RESOLVED-01 — macOS Desktop Portfolio Direction

**Resolved:** 2026-05-06

**Decision:** Rebuild the portfolio as a macOS desktop OS experience with persistent wallpaper, menu bar, dock, desktop icons, and windowed app content.

**Why:** The OS metaphor creates a more memorable portfolio and gives the implementation room to demonstrate frontend interaction craft.

**Alternatives rejected:** Continuing the existing single-page brutalist/editorial layout.

**Affects:** [`PRD.md`](PRD.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`macos-redesign.md`](macos-redesign.md)

### RESOLVED-02 — Next.js App Router Remains the Framework

**Resolved:** 2026-05-06

**Decision:** Keep Next.js 14 App Router and implement the desktop shell through persistent layout state.

**Why:** The existing setup already supports the required routing model. Gatsby is not part of this project direction.

**Alternatives rejected:** Migrating to Gatsby or another framework to mimic PostHog's stack.

**Affects:** [`ARCHITECTURE.md`](ARCHITECTURE.md)

### RESOLVED-04 — JSON Resume as CV Source of Truth

**Resolved:** 2026-05-13

**Decision:** CV content lives in `src/data/resume.json` following the JSON Resume v1 schema. The CV window renders it as styled HTML via `ResumeRenderer`. `public/cv.pdf` is a generated artifact produced on demand by a local puppeteer script (`npm run export:cv`).

**Why:** A PDF iframe is opaque to agents and requires manual file replacement to update. A structured JSON file is diff-friendly, agent-editable, and keeps the web display and the downloadable PDF derived from the same source.

**Alternatives rejected:**
- **RenderCV** — excellent PDF output but requires a Python environment in an otherwise Node.js-only project.
- **Reactive Resume** — feature-rich but database-backed and not designed for file-based programmatic editing.

**PDF export strategy:** On-demand local script only (not CI-automated). Run `npm run export:cv` after editing `resume.json` to regenerate `public/cv.pdf`.

**Affects:** [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONVENTIONS.md`](CONVENTIONS.md)

### RESOLVED-03 — One Window Per App by Default

**Resolved:** 2026-05-06

**Decision:** Opening an already-open app focuses and restores that window instead of creating duplicates.

**Why:** This keeps the v1 window manager simpler and predictable while still supporting multiple simultaneous app windows across different routes.

**Alternatives rejected:** Duplicate windows for the same app in the initial implementation.

**Affects:** [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONVENTIONS.md`](CONVENTIONS.md)
