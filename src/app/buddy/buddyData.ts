/**
 * buddyData.ts — Data constants for the buddy portfolio page.
 *
 * Sourced from:
 *   /projects/buddy/pets/default/pet.json   — animation state machine
 *   /projects/buddy/docs/CLI.md             — command contract and terminal UX
 *   /projects/buddy/src/cli/output.ts       — ANSI output format and banner
 *   /projects/buddy/README.md               — project overview and architecture
 *   /projects/buddy/docs/ARCHITECTURE.md    — system topology
 *   /projects/buddy/package.json            — dependencies
 */

// ── Features ──────────────────────────────────────────────────────────────────

export interface Feature {
  title: string
  detail: string
}

export const FEATURES: Feature[] = [
  {
    title: "Hook-driven animation state machine",
    detail:
      "buddy listens to Claude Code and Codex CLI lifecycle hook events and maps each event to a specific pet animation — jumping when you submit a prompt, running when a tool fires, idle after a tool completes, waiting on a permission request, and waving when the session ends. The mapping is enforced at the HTTP sidecar layer, not in the renderer.",
  },
  {
    title: "Transparent always-on-top overlay window",
    detail:
      "Electron main creates a frameless, transparent, non-focusable, skip-taskbar BrowserWindow pinned above all other windows via setAlwaysOnTop('floating'). The window uses setIgnoreMouseEvents with forward:true so clicks pass through to applications underneath — pointer interactivity only activates when hovering the pet itself.",
  },
  {
    title: "WSL and Windows dual-environment support",
    detail:
      "The buddy CLI detects whether it is running inside WSL or natively on Windows by inspecting /proc/version. On Windows it spawns the Electron app directly. In WSL it invokes buddy.exe via the WSL interop layer. The companion petdex-bridge Rust binary runs inside WSL and bridges shell hook events to the Windows sidecar over localhost passthrough — no ports need manual forwarding.",
  },
  {
    title: "Local HTTP sidecar with token-validated state updates",
    detail:
      "Electron main runs a loopback HTTP sidecar on 127.0.0.1:7777. Every POST to /state must carry the X-Petdex-Update-Token header. The token lives at %USERPROFILE%\\.petdex-win\\runtime\\update-token and is shared with petdex-bridge via a symlink or file copy. The sidecar returns HTTP 401 on a missing or incorrect token, providing defence-in-depth against other local processes.",
  },
  {
    title: "CSS spritesheet animation with per-frame durations",
    detail:
      "The Svelte renderer drives the pet character using CSS background-position stepping over an 8-column × 9-row spritesheet. Each animation state (idle, running, jumping, waiting, waving, review, failed, running-left, running-right) defines its own frame sequence with individual per-frame durations in milliseconds — from 110 ms for fast blink frames to 320 ms for held poses.",
  },
  {
    title: "buddy hatch — AI-generated pet assets via Codex CLI",
    detail:
      "buddy hatch <prompt> delegates visual generation to Codex CLI so buddy never owns image-provider credentials. Codex handles the $imagegen call; buddy receives the outputs, validates the pet.json state machine and spritesheet, and packages the result into the buddy-managed pets directory. Progress is shown concisely in the terminal; raw subprocess output is hidden unless --verbose is set.",
  },
  {
    title: "Polished CLI with warm orange accent theme",
    detail:
      "All terminal output uses a shared output layer with ANSI 256-color warm orange accent, styled separators, symbols (✔ ✖ ⚠ ◆ •), and a tasteful ASCII logo banner. Output degrades cleanly to plain ASCII in non-TTY contexts, CI environments, or terminals that report NO_COLOR. Errors are actionable and include a recovery hint — raw stack traces are never shown for expected user failures.",
  },
  {
    title: "Drag, resize, and bounds persistence",
    detail:
      "The Svelte renderer exposes drag and resize handles that send IPC events to Electron main. Main repositions or resizes the BrowserWindow in response, preserving click-through behavior throughout. Bounds are saved to state.json on drag-end, resize-end, display-change, and window close. On next launch, stored bounds are clamped into the nearest display work area so the pet cannot appear off-screen after a monitor layout change.",
  },
]

// ── Stack groups ───────────────────────────────────────────────────────────────

export interface StackItem {
  name: string
  note?: string
}

export interface StackGroup {
  group: string
  items: StackItem[]
}

export const STACK_GROUPS: StackGroup[] = [
  {
    group: "CLI Layer",
    items: [
      { name: "Node.js 18+", note: "runtime for the npm bin entry point" },
      { name: "TypeScript 5.7" },
      { name: "commander 12", note: "argument parsing for all subcommands" },
      { name: "Vite CLI build", note: "emits out/cli/index.js via vite.cli.config.ts" },
    ],
  },
  {
    group: "Electron Runtime",
    items: [
      { name: "Electron 35", note: "BrowserWindow, IPC, system tray, app packaging" },
      { name: "electron-vite 3", note: "dev server + bundling for main and renderer" },
      { name: "electron-builder 25", note: "npm package publishing and production builds" },
      { name: "contextBridge + preload", note: "contextIsolation: true, nodeIntegration: false" },
    ],
  },
  {
    group: "Svelte Renderer",
    items: [
      { name: "Svelte 5", note: "pet character, sprite animation state machine, drag and resize" },
      { name: "Vite 6", note: "renderer dev/build tooling" },
      { name: "CSS background-position animation", note: "8×9 spritesheet stepping at per-frame durations" },
    ],
  },
  {
    group: "Rust WSL Bridge",
    items: [
      { name: "Rust (x86_64-unknown-linux-gnu)", note: "cross-compiled for WSL" },
      { name: "petdex-bridge", note: "single-purpose CLI — reads token, POSTs state to sidecar" },
      { name: "buddy-bridge npm package", note: "companion package, ships the pre-built Linux binary" },
    ],
  },
  {
    group: "Tooling & Testing",
    items: [
      { name: "Vitest 2", note: "unit tests for CLI, output layer, and pet validation" },
      { name: "@vitest/coverage-v8", note: "V8 coverage reports" },
      { name: "Playwright", note: "end-to-end smoke tests" },
      { name: "svelte-check + tsc", note: "type checking across renderer and node layers" },
    ],
  },
]

// ── Terminal demo script ───────────────────────────────────────────────────────

export interface TerminalEntry {
  command: string
  output: string[]
  petState: string
}

/** Canonical Buddy ASCII logo from docs/CLI.md, used as the banner. */
export const BUDDY_BANNER = `    ____            __    __
   / __ )__  ______/ /___/ /_  __
  / __  / / / / __  / __  / / / /
 / /_/ / /_/ / /_/ / /_/ / /_/ /
/_____/\\__,_/\\__,_/\\__,_/\\__, /
                        /____/`

/** Windows floating desktop pet */
export const BUDDY_TAGLINE = "Windows floating desktop pet"

export const TERMINAL_SCRIPT: TerminalEntry[] = [
  {
    command: "buddy start",
    output: [
      "◆ Launching Electron pet window...",
      "✔ buddy started.",
      "  → Pet window is now visible on your desktop.",
    ],
    petState: "running",
  },
  {
    command: "buddy hooks install",
    output: [
      "◆ Detecting shell rc file...",
      "  → Target: ~/.zshrc",
      "◆ Writing Claude Code hook entries...",
      "  → UserPromptSubmit  → buddy state jumping",
      "  → PreToolUse        → buddy state running",
      "  → PostToolUse       → buddy state idle",
      "  → PermissionRequest → buddy state waiting",
      "  → Stop              → buddy state waving",
      "✔ Hooks installed. Restart your shell to activate.",
    ],
    petState: "waiting",
  },
  {
    command: "buddy doctor",
    output: [
      "",
      "buddy doctor",
      "────────────────────────────────────────────────",
      "  ✔  Electron process running",
      "  ✔  Sidecar responding on 127.0.0.1:7777",
      "  ✔  Update token present",
      "  ✔  Claude Code hooks installed",
      "       ✔  claudeCode.UserPromptSubmit",
      "       ✔  claudeCode.PreToolUse",
      "       ✔  claudeCode.PostToolUse",
      "       ✔  claudeCode.Stop",
      "────────────────────────────────────────────────",
    ],
    petState: "idle",
  },
  {
    command: "buddy state waving",
    output: [
      "◆ Sending state update to sidecar...",
      "✔ State set: waving",
    ],
    petState: "waving",
  },
  {
    command: "buddy stop",
    output: [
      "◆ Terminating Electron pet window...",
      "✔ buddy stopped.",
    ],
    petState: "idle",
  },
]

// ── Pet animation state map ────────────────────────────────────────────────────

export interface AnimationFrame {
  row: number
  col: number
  ms: number
}

export interface AnimationState {
  frames: AnimationFrame[]
  once?: boolean
  fallback?: string
}

/**
 * PET_ANIMATION_STATES — derived from /projects/buddy/pets/default/pet.json.
 * Spritesheet: 8 columns × 9 rows, 192×208 px per frame.
 */
export const PET_ANIMATION_STATES: Record<string, AnimationState> = {
  idle: {
    frames: [
      { row: 0, col: 0, ms: 280 },
      { row: 0, col: 1, ms: 110 },
      { row: 0, col: 2, ms: 110 },
      { row: 0, col: 3, ms: 140 },
      { row: 0, col: 4, ms: 140 },
      { row: 0, col: 5, ms: 320 },
    ],
  },
  "running-right": {
    frames: [
      { row: 1, col: 0, ms: 120 },
      { row: 1, col: 1, ms: 120 },
      { row: 1, col: 2, ms: 120 },
      { row: 1, col: 3, ms: 120 },
      { row: 1, col: 4, ms: 120 },
      { row: 1, col: 5, ms: 120 },
      { row: 1, col: 6, ms: 120 },
      { row: 1, col: 7, ms: 220 },
    ],
  },
  "running-left": {
    frames: [
      { row: 2, col: 0, ms: 120 },
      { row: 2, col: 1, ms: 120 },
      { row: 2, col: 2, ms: 120 },
      { row: 2, col: 3, ms: 120 },
      { row: 2, col: 4, ms: 120 },
      { row: 2, col: 5, ms: 120 },
      { row: 2, col: 6, ms: 120 },
      { row: 2, col: 7, ms: 220 },
    ],
  },
  waving: {
    frames: [
      { row: 3, col: 0, ms: 140 },
      { row: 3, col: 1, ms: 140 },
      { row: 3, col: 2, ms: 140 },
      { row: 3, col: 3, ms: 280 },
    ],
    once: true,
    fallback: "idle",
  },
  jumping: {
    frames: [
      { row: 4, col: 0, ms: 140 },
      { row: 4, col: 1, ms: 140 },
      { row: 4, col: 2, ms: 140 },
      { row: 4, col: 3, ms: 140 },
      { row: 4, col: 4, ms: 280 },
    ],
    once: true,
    fallback: "idle",
  },
  failed: {
    frames: [
      { row: 5, col: 0, ms: 140 },
      { row: 5, col: 1, ms: 140 },
      { row: 5, col: 2, ms: 140 },
      { row: 5, col: 3, ms: 140 },
      { row: 5, col: 4, ms: 140 },
      { row: 5, col: 5, ms: 140 },
      { row: 5, col: 6, ms: 140 },
      { row: 5, col: 7, ms: 240 },
    ],
  },
  waiting: {
    frames: [
      { row: 6, col: 0, ms: 150 },
      { row: 6, col: 1, ms: 150 },
      { row: 6, col: 2, ms: 150 },
      { row: 6, col: 3, ms: 150 },
      { row: 6, col: 4, ms: 150 },
      { row: 6, col: 5, ms: 260 },
    ],
  },
  running: {
    frames: [
      { row: 7, col: 0, ms: 120 },
      { row: 7, col: 1, ms: 120 },
      { row: 7, col: 2, ms: 120 },
      { row: 7, col: 3, ms: 120 },
      { row: 7, col: 4, ms: 120 },
      { row: 7, col: 5, ms: 220 },
    ],
  },
  review: {
    frames: [
      { row: 8, col: 0, ms: 150 },
      { row: 8, col: 1, ms: 150 },
      { row: 8, col: 2, ms: 150 },
      { row: 8, col: 3, ms: 150 },
      { row: 8, col: 4, ms: 150 },
      { row: 8, col: 5, ms: 280 },
    ],
  },
}
