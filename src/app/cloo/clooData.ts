/** Typed, UI-free source of truth for the Cloo portfolio simulation. */

export type ClooCommandName =
  | "help"
  | "about"
  | "features"
  | "stack"
  | "architecture"
  | "status"
  | "github"
  | "clear"
  | "reset";

export type ClooCommandResult =
  | { kind: "text"; lines: readonly string[] }
  | { kind: "link"; linkId: "github"; lines: readonly string[] }
  | { kind: "clear" }
  | { kind: "reset" };

export interface ClooCommand {
  name: ClooCommandName;
  summary: string;
  result: ClooCommandResult;
}

export interface ClooFeature {
  title: string;
  detail: string;
}

export interface ClooStackGroup {
  label: string;
  items: readonly string[];
}

export interface ClooArchitectureLayer {
  label: string;
  detail: string;
}

export interface ClooTranscriptEntry {
  id: string;
  kind: "system" | "command" | "output";
  text: string;
}

export const CLOO_PROJECT = {
  name: "cloo",
  label: "Interactive product simulation",
  status: "Pre-alpha",
  license: "MIT",
  platform: "Linux x64",
  tagline: "A terminal multiplexer for the way concurrent coding work looks now.",
  overview:
    "Cloo is a public, local-first client-server terminal multiplexer written in Rust. A daemon owns PTYs, terminal grids, scrollback, tabs, panes, and layout state while thin clients attach over a Unix socket. It is designed as a calm workspace for developers coordinating several long-running coding-agent harnesses without sacrificing ordinary shell and TUI behavior.",
  audience:
    "The primary workflow is one developer coordinating concurrent Codex, Claude Code, and shell tasks. Tmux and Zellij users are the secondary audience, so Cloo keeps a familiar prefix-driven mental model while concentrating its product effort on clearer navigation and visual hierarchy.",
} as const;

export const CLOO_STATUS = {
  runtime:
    "The source-built pre-alpha runtime is functional: the daemon, persistent sessions, attach/detach, panes, tabs, input, resize, copy mode, profile launches, attention data, and client-side chrome foundations are implemented and tested.",
  visualPass:
    "M9 is the active visual-fidelity pass. The current attached renderer is a sparse functional scaffold; the approved high-fidelity handoff is the destination and must not be presented as a runtime capture.",
  distribution:
    "There is no supported npm or crates.io release. Registry placeholders and the prepared Linux x64 clooterminal package are release infrastructure, not an install recommendation.",
  platform:
    "Linux x64 is the supported distribution target. Other Unix targets remain source-build territory, and Windows is outside the v1 scope.",
} as const;

export const CLOO_FEATURES: readonly ClooFeature[] = [
  {
    title: "Persistent daemon-owned sessions",
    detail:
      "Closing or detaching a client leaves daemon-owned PTYs, grids, scrollback, and layout alive. A later client can reattach to the same local workspace, and multiple clients can observe one session.",
  },
  {
    title: "Tmux-shaped panes and tabs",
    detail:
      "Binary splits, directional focus, ratio-based resizing, pane zoom, named tabs, and a C-b prefix preserve a familiar multiplexer model. Layout ratios survive terminal resizing rather than collapsing into fixed cell counts.",
  },
  {
    title: "Concurrent coding-agent workspace",
    detail:
      "Validated local profiles launch generic shells, Codex, or Claude Code panes. Names, task labels, and attention provenance are explicit; Cloo never guesses agent state by scraping terminal transcripts.",
  },
  {
    title: "Terminal compatibility boundaries",
    detail:
      "An Alacritty-based emulator wrapper handles grids and child modes, while typed input events, capability-gated outer-terminal effects, bracketed paste, focus, mouse routing, alternate screen, and raw-mode restoration protect ordinary terminal applications.",
  },
  {
    title: "Calm client-owned presentation",
    detail:
      "The client owns frames, focus treatment, themes, status chrome, overlays, and bounded motion. The server sends content and geometry only, so visual preferences never become authoritative session state.",
  },
] as const;

export const CLOO_STACK: readonly ClooStackGroup[] = [
  {
    label: "Language and runtime",
    items: [
      "Rust 2024 edition (minimum Rust 1.85)",
      "Tokio actor-shaped async runtime",
      "Linux PTYs and Unix domain sockets via libc",
    ],
  },
  {
    label: "Rust workspace crates",
    items: [
      "cloo: CLI and composition root",
      "cloo-server: daemon, PTY reactor, sessions, and damage tracking",
      "cloo-client: attach loop, raw mode, rendering, input, and themes",
      "cloo-core: session, tab, pane, layout, profile, keymap, and config models",
      "cloo-proto: versioned wire types and length-framed transport",
      "cloo-term: isolated alacritty_terminal emulation wrapper",
    ],
  },
  {
    label: "Core dependencies",
    items: [
      "alacritty_terminal (exactly pinned terminal backend)",
      "Serde + Postcard (typed local protocol)",
      "TOML (configuration parsing)",
      "Regex (server-owned copy-mode search)",
    ],
  },
] as const;

export const CLOO_ARCHITECTURE: readonly ClooArchitectureLayer[] = [
  {
    label: "Daemon authority",
    detail:
      "One server-side session task serializes every mutation. It owns the PTYs, emulated grids, scrollback, tabs, panes, attention, and ratio-based layout; there is no database or cloud service.",
  },
  {
    label: "Local versioned transport",
    detail:
      "Thin clients attach over a length-framed Unix socket protocol. They receive snapshots and coalesced damage updates, while typed input and workspace actions travel back to the daemon.",
  },
  {
    label: "Client rendering",
    detail:
      "Clients cache visible cells and compose all chrome locally. Rendering, capability negotiation, raw-mode restoration, input decoding, themes, overlays, and terminal-safe effects remain client concerns.",
  },
  {
    label: "Explicit agent signals",
    detail:
      "Coding harnesses remain ordinary local programs. Profiles are declarative, attention includes its provenance, and optional adapters use a separate restricted control socket rather than screen scraping or arbitrary command execution.",
  },
] as const;

export const CLOO_LINKS = {
  github: {
    label: "Public source on GitHub",
    href: "https://github.com/AG9898/cloo",
  },
} as const;

export const CLOO_BRAND_ASSETS = {
  product: {
    src: "/cloo/cloo-product.svg",
    alt: "Cloo product mark: a rounded terminal with a prompt, cursor, and underscore",
    plannedUse: "Dock app mark",
  },
  command: {
    src: "/cloo/cloo-command.svg",
    alt: "Cloo command mark: a compact prompt and underscore",
    plannedUse: "Compact supporting interface",
  },
  workspace: {
    src: "/cloo/cloo-workspace.svg",
    alt: "Cloo workspace mark: stacked terminals representing persistent sessions",
    plannedUse: "Workspace feature storytelling",
  },
  agentSignal: {
    src: "/cloo/cloo-agent-signal.svg",
    alt: "Cloo agent signal mark: opposing prompts representing agent workflow signals",
    plannedUse: "Agent workflow storytelling",
  },
} as const;

const ABOUT_LINES = [
  CLOO_PROJECT.overview,
  CLOO_PROJECT.audience,
] as const;

const FEATURE_LINES = CLOO_FEATURES.map(
  ({ title, detail }) => `${title}: ${detail}`,
);

const STACK_LINES = CLOO_STACK.flatMap(({ label, items }) => [
  `${label}:`,
  ...items.map((item) => `  ${item}`),
]);

const ARCHITECTURE_LINES = CLOO_ARCHITECTURE.map(
  ({ label, detail }) => `${label}: ${detail}`,
);

const STATUS_LINES = [
  `Status: ${CLOO_PROJECT.status}`,
  `Platform: ${CLOO_PROJECT.platform}`,
  `License: ${CLOO_PROJECT.license}`,
  CLOO_STATUS.runtime,
  CLOO_STATUS.visualPass,
  CLOO_STATUS.distribution,
] as const;

export const CLOO_COMMAND_ORDER: readonly ClooCommandName[] = [
  "help",
  "about",
  "features",
  "stack",
  "architecture",
  "status",
  "github",
  "clear",
  "reset",
] as const;

export const CLOO_COMMANDS = {
  help: {
    name: "help",
    summary: "List the finite command catalog and simulated C-b controls.",
    result: {
      kind: "text",
      lines: [
        "Commands: help, about, features, stack, architecture, status, github, clear, reset",
        'Prefix controls: C-b %, C-b \", C-b h/j/k/l or arrows, C-b z, C-b c, C-b n/p, C-b d',
        "This is a deterministic portfolio simulation, not a live shell or Cloo process.",
      ],
    },
  },
  about: {
    name: "about",
    summary: "Describe Cloo and its intended users.",
    result: { kind: "text", lines: ABOUT_LINES },
  },
  features: {
    name: "features",
    summary: "Show the implemented product foundations.",
    result: { kind: "text", lines: FEATURE_LINES },
  },
  stack: {
    name: "stack",
    summary: "Show the Rust workspace and core dependencies.",
    result: { kind: "text", lines: STACK_LINES },
  },
  architecture: {
    name: "architecture",
    summary: "Explain daemon, transport, client, and agent-signal boundaries.",
    result: { kind: "text", lines: ARCHITECTURE_LINES },
  },
  status: {
    name: "status",
    summary: "Report truthful runtime, M9, platform, and release status.",
    result: { kind: "text", lines: STATUS_LINES },
  },
  github: {
    name: "github",
    summary: "Offer the public source repository as a normal link.",
    result: {
      kind: "link",
      linkId: "github",
      lines: ["Cloo is public and MIT-licensed. Open the source repository:"],
    },
  },
  clear: {
    name: "clear",
    summary: "Clear the focused simulated transcript.",
    result: { kind: "clear" },
  },
  reset: {
    name: "reset",
    summary: "Restore the deterministic initial simulated workspace.",
    result: { kind: "reset" },
  },
} as const satisfies Record<ClooCommandName, ClooCommand>;

export const CLOO_INITIAL_TRANSCRIPT: readonly ClooTranscriptEntry[] = [
  {
    id: "simulation-label",
    kind: "system",
    text: "Interactive product simulation | Pre-alpha | Linux x64",
  },
  {
    id: "simulation-boundary",
    kind: "system",
    text: "Local deterministic showcase only: no PTY, shell, daemon, or network-backed commands.",
  },
  {
    id: "welcome-command",
    kind: "command",
    text: "cloo status",
  },
  {
    id: "welcome-output",
    kind: "output",
    text: "Functional workspace foundations are implemented; M9 is aligning the sparse attached renderer with the approved handoff.",
  },
  {
    id: "help-hint",
    kind: "system",
    text: "Type help for project commands or use the simulated C-b prefix controls.",
  },
] as const;
