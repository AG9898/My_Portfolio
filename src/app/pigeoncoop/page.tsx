const GITHUB_URL = "https://github.com/AG9898/PigeonCoop";

const STACK_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Desktop Runtime",
    items: ["Tauri 2", "Rust (2021 edition)", "tauri-plugin-shell", "tauri-plugin-dialog"],
  },
  {
    label: "Frontend",
    items: ["React 18", "ReactFlow 11", "TypeScript 5", "Vite 5"],
  },
  {
    label: "Core Engine & Models",
    items: [
      "core-engine (async Tokio executor)",
      "workflow-model (WorkflowDefinition + NodeConfig)",
      "event-model (RunEvent schema + causation IDs)",
      "runtime-adapters (CLI wrapper + agent dispatch)",
    ],
  },
  {
    label: "Persistence",
    items: [
      "persistence crate",
      "rusqlite 0.31 (bundled)",
      "Run history & event logs",
      "Workflow definition storage",
    ],
  },
  {
    label: "Async & Serialisation",
    items: [
      "tokio 1 (full runtime)",
      "serde 1 + serde_json",
      "uuid 1 (v4 + serde)",
      "chrono 0.4 (timestamped events)",
    ],
  },
  {
    label: "Observability & Error Handling",
    items: [
      "tracing 0.1 (structured logging)",
      "thiserror 1 (typed error chains)",
      "anser (ANSI SGR → HTML spans)",
    ],
  },
  {
    label: "Tooling & Testing",
    items: [
      "Vitest 1 + Testing Library",
      "TypeScript strict mode",
      "Vite 5 (HMR dev build)",
      "tauri-build 2 (native bundler)",
    ],
  },
];

const IMAGE_DIMS: Record<string, { width: number; height: number }> = {
  "/PigeonCoop/Pigeon-workspace.png": { width: 1917, height: 941 },
  "/PigeonCoop/Pigeon-workspace-planned.png": { width: 1508, height: 855 },
  "/PigeonCoop/Pigeon-mermaid-diagram.png": { width: 2036, height: 3411 },
};

const FEATURES: { title: string; detail: string; images?: string[] }[] = [
  {
    title: "Visual workflow builder with drag-and-connect canvas",
    detail:
      "A ReactFlow graph canvas lets you drag seven node types — Start, End, Agent, Tool, Router, Memory, and Human Review — from a palette onto the canvas and wire them with directed edges. Each edge carries a condition kind (always / on_success / on_failure / expression) chosen at connection time. The NodeInspector panel opens on single-node selection and exposes per-kind config fields: prompts and provider hints for Agent nodes, shell commands and timeouts for Tool nodes, ordered rule lists for Router nodes. Invalid graph structures are highlighted with dashed orange borders and surfaced as a human-readable validation list before execution starts.",
    images: ["/PigeonCoop/Pigeon-workspace.png"],
  },
  {
    title: "Repository-aware CLI execution with live event streaming",
    detail:
      "Workflows run against a user-selected local workspace root via Tauri's shell plugin. The runtime-adapters crate wraps CLI commands and agent invocations, capturing stdout, stderr, exit codes, and durations as typed RunEvent records. Events are appended to SQLite in real time and forwarded to the frontend through Tauri IPC as run_event_appended events. The event feed panel color-codes events by family — run (blue), node (green), command (purple), agent (light blue), routing (amber), review (orange), memory (cyan), budget/guardrail (red) — so execution state is readable at a glance without hunting through raw logs.",
    images: ["/PigeonCoop/Pigeon-workspace-planned.png"],
  },
  {
    title: "Replay debugger with timeline scrubber and typed event inspector",
    detail:
      "Completed runs are fully reconstructable from their stored event log. The Replay View presents a timeline scrubber that rewinds and advances the graph state node by node or event by event. The EventInspector panel renders each selected event in three typed panes: an Envelope pane (event_id, event_type, timestamp, causation_id, correlation_id), a family-specific pane (command strings + exit codes for command events, branch rationale for routing events, input/output refs for node events), and a full JSON payload pane for complete transparency. Keyboard shortcuts (Arrow Left/Right, Home, End) enable scrubbing without the mouse.",
  },
  {
    title: "Human review nodes with keyboard-driven approve / reject flow",
    detail:
      "Any workflow can include Human Review nodes that pause execution and foreground the review reason, current run memory, and upstream outputs. The UI blocks progress until the developer explicitly approves, rejects, or retries the step. Keyboard shortcuts A / R / T (Approve / Reject / Retry) allow review decisions without a mouse click. The paused state is visually distinct — a breathing orange glow ring on the canvas node — so there is no ambiguity between a stuck workflow and one intentionally waiting for human input.",
  },
  {
    title: "Local-first SQLite persistence for workflows and run history",
    detail:
      "The persistence crate wraps rusqlite (bundled, no system library dependency) to store workflow definitions, versioned workflow metadata, run history, event logs, and app settings entirely on disk. No network connection or cloud account is required to run, replay, or export a workflow. Workflow definitions are serialised from the WorkflowDefinition Rust type via serde_json, making them human-readable JSON files that are versionable with git alongside the repository they operate on.",
  },
  {
    title: "Mission-control canvas with state-driven node animations",
    detail:
      "The canvas renders a 48px CSS grid overlay that gives the interface a tactical-map texture. Running nodes pulse with a 2 s blue glow ring (node-pulse keyframe), failed nodes flash a red ring twice before holding (node-fail-flash), and paused/review nodes breathe an orange ring (node-paused-blink). Active edges animate directional marching dashes (stroke-dashoffset, 0.8 s linear) to show flow direction. A prefers-reduced-motion media query disables all node and edge animations for users who opt out of motion.",
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Repository" },
];

export { GITHUB_URL, STACK_GROUPS, IMAGE_DIMS, FEATURES, NAV };
export type { Section };

export default function PigeonCoop() {
  return null;
}
