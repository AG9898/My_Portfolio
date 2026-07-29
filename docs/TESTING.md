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
- [ ] Tab through menu bar — portfolio menu, app name, File, Edit, View, Window, Help triggers all receive visible focus rings; Enter opens the menu; arrow keys navigate items; Escape closes.
- [ ] Tab to theme toggle button — focus ring visible; Enter toggles theme.
- [ ] Open a window; Tab to traffic lights — close, minimize, maximize each receive a visible outline ring.
- [ ] Right-click (or keyboard activate) the green traffic light — snap context menu opens, first enabled item is focused; ArrowDown/Up navigates; Escape closes.
- [ ] Confirm screen reader announces window title on focus (role="dialog" aria-modal="true" aria-label).

---

## Startup Sequence Checklist

Run manually when the desktop shell startup overlay changes:

- [ ] First desktop load in a browser tab shows boot progress, then the sign-in screen.
- [ ] Sign-in screen shows clock/date, `Aden Guo`, the portfolio logo avatar, and a click-to-enter control.
- [ ] Click or non-Tab keypress starts the signing-in animation and reveals the desktop.
- [ ] Refreshing after completion in the same tab skips the startup sequence.
- [ ] Direct entry to a route such as `/projects` still opens the matching window under the overlay.
- [ ] Reduced-motion mode keeps the same phases with fade-only/shortened motion.
- [ ] Small viewports still render the mobile fallback instead of the desktop startup sequence.

---

## Test File Inventory

*(No test files yet — add rows when a test suite is introduced.)*

---

## Window State Edge Case Checklist (V1_011C)

Run manually after any window manager change:

- [ ] Open a window, close it, open again — geometry and title are correct; no duplicate window.
- [ ] Minimize a window, then close a second open window — `focusedId` does not point to the minimized window; next focused window is a visible (non-minimized) one.
- [ ] Maximize a window 5+ times by toggling the green button — window consistently fills desktop area, then restores to previous geometry.
- [ ] Snap left, then snap right, then restore — geometry returns to the pre-snap position each time.
- [ ] Open two windows; close the focused one — the remaining window gains focus automatically.
- [ ] Navigate directly to `/projects` in the browser — projects window opens with desktop shell fully mounted; no duplicate window.
- [ ] Navigate from `/projects` to `/about` via the URL bar — about window opens; projects window remains open but unfocused.

---

## Cloo Showcase Checklist

Run manually when the planned `/cloo` showcase or its shell integration changes:

- [ ] Direct `/cloo` entry opens exactly one centered `900x600` Cloo window and preserves the desktop shell.
- [ ] The window and Project info surface clearly identify the experience as an interactive product simulation and Cloo as pre-alpha.
- [ ] `help`, `about`, `features`, `stack`, `architecture`, `status`, `github`, `clear`, and `reset` return deterministic local results; unknown input is rendered as text and cannot execute code or network requests.
- [ ] `github` adds a normal `https://github.com` link without navigating automatically; repeated commands retain no more than 80 transcript entries, 30 history entries, or 120 input characters.
- [ ] Up/Down history, Tab completion, text selection, copy, IME input, and focused-input `Ctrl+L` clearing work without document-wide keyboard capture.
- [ ] Each completed command produces one concise polite live-region update; transcript rendering does not announce output character by character.
- [ ] Supported `C-b` split, focus, zoom, tab, and detach actions match [`CLOO.md`](CLOO.md); unsupported prefix keys recover cleanly.
- [ ] Every prefix action, Project info section, reset, GitHub link, and reattach action is reachable through ordinary labelled controls.
- [ ] A fifth pane or fifth tab is rejected with a concise limit hint; directional movement never leaves focus pointing at a missing pane.
- [ ] Detach and reattach preserve tabs, panes, transcripts, focus, and zoom; reset restores the documented one-tab, one-pane initial workspace.
- [ ] Resize toward `320x200` keeps the focused pane, status, commands, and recovery controls usable without unreadable fixed-width panes.
- [ ] Reduced motion removes automatic typing and simplifies layout motion without hiding state changes.
- [ ] Below `md`, the hidden desktop simulator does not type, animate, autofocus, or consume keys behind MobileFallback.
- [ ] Light and dark portfolio themes preserve themed macOS chrome while the Cloo product surface remains intentionally dark.
- [ ] Cloo appears once as the sixth Dock app using the approved terminal-face product mark; magnification, tooltip, open indicator, click-to-open/focus/restore, and source animation work, and no Cloo desktop shortcut or Get Info entry appears.

---

## Writing New Tests

- If a test framework is added, document it here and add a `npm run test` script.
- Prioritize unit tests for window reducer behavior before testing animation details.
- Prefer behavior-level browser tests for desktop shell workflows: open app, focus app, minimize, restore, close, direct URL entry, and mobile fallback.
- Keep visual tests tolerant of animation timing unless the test is explicitly about motion behavior.
