# Cloo Showcase

Canonical product and interaction contract for the planned `/cloo` portfolio app.
The source project remains `/home/ag9898/projects/cloo`; this document governs only its browser
showcase in this repository.

---

## Status And Truthfulness

- The typed content layer, approved brand assets, and accessible single-pane command foundation are
  implemented. Multipane controls, Project info, responsive workspace state, and shell wiring remain
  planned.
- Cloo is a public, MIT-licensed, Linux x64 pre-alpha terminal multiplexer written in Rust.
- The runtime has a functional daemon, persistent sessions, attached clients, panes, tabs, input,
  resize, copy mode, and agent-workspace foundations. Its M9 work is aligning the live attached UI
  with the approved high-fidelity handoff.
- Approved Cloo handoff images are target visuals, not captures of the current sparse renderer.
- The browser experience must be labelled **Interactive product simulation** and **Pre-alpha**. It
  must not imply that it is a live Cloo process, a released npm package, or the shipped M9 renderer.
- The public source link is `https://github.com/AG9898/cloo`. Do not add npm or crates.io install
  links until the Cloo repository documents a real supported release.

---

## Product Shape

`/cloo` is intentionally exempt from the portfolio's standard four-panel project showcase. The
entire app content area reproduces a small Cloo workspace so the project demonstrates its own
interaction model instead of placing another case study inside a Notes-style sidebar.

The initial view contains:

- A session-aware tab row.
- One focused, fully framed shell pane using Cloo's Storm theme.
- A first-use hint for `help` and the `C-b` prefix.
- A compact status row with session, tab, attention, and prefix information.
- A persistent **Project info** control that opens semantic Overview, Features, Tech Stack, Status,
  and GitHub content without requiring terminal knowledge.
- A visible simulation disclosure that remains available after the initial transcript scrolls.

The Project info surface and terminal commands present the same canonical facts from the typed,
UI-free `clooData.ts` module. It exports project, status, feature, stack, architecture, brand-asset,
link, finite-command, and initial-transcript data. `CLOO_COMMANDS` is a compile-time complete record
over `ClooCommandName`; command results are declarative text, link, clear, or reset descriptors, not
executable behavior. The page component must not introduce separate project copy.

---

## Simulator Boundary

The showcase is a custom React simulator, not xterm.js, a PTY client, or a terminal emulator.

- Use semantic DOM for pane frames, transcripts, status, tabs, and project information.
- Use a native text input in the focused pane for line editing, IME behavior, and mobile keyboards.
- Keep all simulator state local and deterministic. A reset returns to the same initial workspace.
- Render trusted command results as React text and elements. Never use `eval`, `new Function`,
  `innerHTML`, executable user input, user-derived dynamic imports, WebSockets, or shell APIs.
- Do not fetch command output. The only outbound navigation is an ordinary validated GitHub link.
- Unknown input is displayed as text and receives a bounded local error.
- The command pane retains at most 80 transcript entries, 30 command-history entries, and 120 input
  characters so repeated or unknown commands cannot grow memory without bound.

The command registry should cover only portfolio discovery and simulator control:

| Command | Result |
|---|---|
| `help` | Commands, prefix controls, and simulation disclosure |
| `about` | Product objective and target users |
| `features` | Persistent sessions, panes/tabs, agent workflows, and terminal compatibility |
| `stack` | Rust workspace crates and key dependencies |
| `architecture` | Daemon/client ownership and Unix-socket topology |
| `status` | Truthful pre-alpha, M9, platform, and release state |
| `github` | A normal link to the public repository; never automatic navigation |
| `clear` | Clear the focused pane's transcript while preserving workspace state |
| `reset` | Restore the deterministic initial simulated workspace |

Support command history with Up/Down, command completion with Tab, normal selection/copy, and
focused-input-only `Ctrl+L` transcript clearing. Composition events retain native IME behavior. Do
not register document-wide handlers for ordinary terminal editing keys.

---

## Cloo Controls

Implement a truthful, bounded subset of Cloo's real tmux-shaped default keymap. `Ctrl+B` arms the
prefix and only the immediately following supported key is consumed by the workspace:

| Chord | Simulated behavior |
|---|---|
| `C-b %` | Split the focused pane vertically |
| `C-b "` | Split the focused pane horizontally |
| `C-b h/j/k/l` or arrow | Move focus to a neighboring pane |
| `C-b z` | Toggle zoom for the focused pane |
| `C-b c` | Create a tab |
| `C-b n/p` | Select next/previous tab |
| `C-b d` | Detach the simulated client while preserving workspace state |

Detach replaces the workspace with a clearly simulated detached state and a **Reattach** control.
Reattaching restores the same tabs, panes, transcripts, and focus. Splits and tabs use a small
fixed maximum so the demo stays legible and deterministic. Unsupported prefix keys show a concise
hint and return keyboard ownership to the focused input.

Every prefix action also needs a labelled clickable control in Help or a compact command surface so
touch and assistive-technology users can reach it without synthesizing key chords.

---

## Visual Contract

- Portfolio window chrome remains part of the macOS Liquid Glass shell and follows its active
  light/dark theme.
- The Cloo product surface remains intentionally dark in both portfolio themes.
- Define named `cloo-*` Tailwind colors from the Cloo Storm palette rather than using stock Tailwind
  colors or inline hex values in components.
- Preserve Cloo's hierarchy: frame/gutter, pane surface, raised surface, neutral border, accent focus,
  primary/default/muted text, and semantic success/warning/error/info roles.
- Never use color alone for focus or attention. Keep the `>` focus marker and `!`, `*`, or `x` state
  glyph where those states appear.
- Use the approved `cloo-product.svg` terminal-face mark for the Dock icon. Use the command mark only
  for compact supporting UI. Source SVG masters come from
  `/home/ag9898/projects/cloo/docs/assets/brand/` and portfolio copies live under `public/cloo/`.
- Motion may clarify split, focus, zoom, detach, and overlays, but must be short, interruptible, and
  removed or simplified under reduced motion.

---

## Responsive And Lifecycle Behavior

- The default Cloo window is `900x600`, consistent with other project apps.
- The simulator must remain usable when resized toward the window manager's `320x200` minimum.
  Narrow mode may show only the focused pane plus compact tab/status controls; it must not squeeze a
  fixed multipane grid into unreadable columns.
- Pane geometry derives from the simulator container, not the browser viewport.
- Do not autofocus on small or coarse-pointer layouts. A deliberate click/tap enters the prompt.
- The hidden desktop remains mounted below the portfolio's `md` breakpoint. The simulator must not
  type, animate, or steal focus while its desktop surface is hidden.
- Minimized windows are unmounted by the current window renderer. Restoring Cloo may reset the local
  simulator unless a later product decision explicitly requires persistence across minimize.
- Cloo is promoted into the Dock as its sixth app and does not render as a desktop shortcut. It is
  the deliberate project-showcase exception to the other projects' `showInDock: false` metadata.

---

## Accessibility

- Give the workspace and each pane an accessible name; expose focused, zoomed, attention, and
  detached state in text.
- Associate the focused pane input with a visible or screen-reader label.
- Keep transcript text selectable and expose new command results through one restrained polite live
  region. Never announce typewriter characters individually.
- Preserve browser and desktop shortcuts unless focus is inside the simulator and the exact Cloo
  prefix sequence is active.
- Project facts, the GitHub link, reset, reattach, and every simulated prefix action must be
  reachable through ordinary buttons or links.
- Respect `prefers-reduced-motion` and avoid automatic typing when reduced motion is active.

---

## Planned File Boundaries

| Path | Responsibility |
|---|---|
| `src/app/cloo/page.tsx` | Client page shell, simulation disclosure, and Project info surface |
| `src/app/cloo/clooData.ts` | Prepared typed project facts, commands, status, links, brand metadata, and initial transcript data |
| `src/app/cloo/ClooWorkspaceSimulator.tsx` | Implemented single-pane command foundation; later tasks extend its deterministic workspace and prefix actions |
| `public/cloo/` | Prepared byte-for-byte copies of the four approved full-color Cloo brand masters |
| Shell registries | Route, window, Dock icon, and Projects Finder integration |

Do not add a terminal dependency or backend route for this showcase.

---

## Verification

Run `npm run lint` and `npm run build`, then complete the Cloo checklist in
[`TESTING.md`](TESTING.md). Browser verification must include direct `/cloo` entry, keyboard and
touch-equivalent controls, window resizing, reduced motion, hidden mobile behavior, and the sixth
Dock app's magnification, tooltip, open indicator, and window animation target.
