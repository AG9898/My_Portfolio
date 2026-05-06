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

### RESOLVED-03 — One Window Per App by Default

**Resolved:** 2026-05-06

**Decision:** Opening an already-open app focuses and restores that window instead of creating duplicates.

**Why:** This keeps the v1 window manager simpler and predictable while still supporting multiple simultaneous app windows across different routes.

**Alternatives rejected:** Duplicate windows for the same app in the initial implementation.

**Affects:** [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONVENTIONS.md`](CONVENTIONS.md)
