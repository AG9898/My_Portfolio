# TESTING.md — Verification Reference

Canonical source for how to verify changes. Code conventions that affect test structure live in [`CONVENTIONS.md`](CONVENTIONS.md).

---

## Quick Start

```bash
npm run lint
npm run build
```

There is no configured unit or end-to-end test framework yet.

---

## Test Stacks

| Stack | Tool | Version | Location | Run Command |
|---|---|---|---|---|
| Lint | ESLint / Next.js config | See `package.json` | `src/` and config files | `npm run lint` |
| Build | Next.js production build | `14.2.5` | App Router project | `npm run build` |
| Browser checks | Manual or Playwright when available | N/A | Running dev server | Project-specific |

---

## What Is Covered

- `npm run lint` checks ESLint and Next.js lint rules.
- `npm run build` checks TypeScript integration, route compilation, production bundling, and static build errors.

Not covered yet:
- Unit tests for reducer behavior.
- End-to-end interaction tests for window dragging, snapping, minimizing, and route focus.
- Visual regression tests for desktop shell and mobile fallback.
- Automated accessibility tests (axe-core or similar) for focus ring visibility, aria attributes, and keyboard operability.

---

## Accessibility Verification Checklist (V1_011A)

Run manually when shell chrome changes:

- [ ] Tab through Dock — each icon receives a visible focus ring before activation.
- [ ] Tab through desktop shortcut column — each shortcut receives a visible focus ring.
- [ ] Tab through menu bar — Apple menu, app name, File, Edit, View, Window, Help triggers all receive visible focus rings; Enter opens the menu; arrow keys navigate items; Escape closes.
- [ ] Tab to theme toggle button — focus ring visible; Enter toggles theme.
- [ ] Open a window; Tab to traffic lights — close, minimize, maximize each receive a visible outline ring.
- [ ] Right-click (or keyboard activate) the green traffic light — snap context menu opens, first enabled item is focused; ArrowDown/Up navigates; Escape closes.
- [ ] Confirm screen reader announces window title on focus (role="dialog" aria-modal="true" aria-label).

---

## Test File Inventory

*(No test files yet — add rows when a test suite is introduced.)*

---

## Writing New Tests

- If a test framework is added, document it here and add a `npm run test` script.
- Prioritize unit tests for window reducer behavior before testing animation details.
- Prefer behavior-level browser tests for desktop shell workflows: open app, focus app, minimize, restore, close, direct URL entry, and mobile fallback.
- Keep visual tests tolerant of animation timing unless the test is explicitly about motion behavior.
