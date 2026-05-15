"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GitFork, X, Construction, Cpu, HardDrive } from "lucide-react";

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

type Lightbox = { src: string; alt: string; zoomed: boolean };

export default function PigeonCoop() {
  const [active, setActive] = useState<Section>("overview");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openLightbox = (src: string, alt: string) =>
    setLightbox({ src, alt, zoomed: false });

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((lb) => lb && { ...lb, zoomed: !lb.zoomed });
  };

  return (
    <div className="relative flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          pigeoncoop.app
        </div>
        <div className="space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left ${
                active === item.id
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <div className="truncate text-[13px] font-medium">
                {item.label}
              </div>
              <div
                className={`truncate text-[11px] ${
                  active === item.id
                    ? "text-label-primary"
                    : "text-label-secondary"
                }`}
              >
                {item.sub}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main content pane */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
          {active === "overview" && (
            <>
              <p className="text-[13px] text-label-secondary">
                pigeoncoop.app / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">PigeonCoop</h1>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <Construction
                    className="h-3.5 w-3.5 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  In Development
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Rust / Tauri desktop app
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <HardDrive
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Local-first
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <p>
                  PigeonCoop is a local-first desktop application for
                  designing, running, monitoring, and replaying agent workflows
                  through a game-inspired 2D interface. It is built with
                  Rust and Tauri so every workflow, run history, and event log
                  lives entirely on disk — no cloud account, no API keys baked
                  into the app, no background sync required.
                </p>
                <p>
                  The core problem it solves is observability during agent
                  development. Running a multi-step CLI agent today means reading
                  interleaved stdout, guessing which step failed, and restarting
                  the whole run to reproduce a bug. PigeonCoop captures every{" "}
                  <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                    RunEvent
                  </code>{" "}
                  — stdout lines, exit codes, routing decisions, memory writes,
                  human-review pauses — as a typed, causation-linked record. A
                  complete run becomes a replayable, inspectable artifact rather
                  than a scrollback buffer.
                </p>
                <p className="text-label-secondary">
                  The workflow canvas uses a mission-control aesthetic: a 48px
                  CSS grid overlay, color-coded event families, and animated node
                  states (pulsing blue for running, flashing red for failed,
                  breathing orange for paused) so the developer can read
                  execution state at a glance. Workflows are serialised as
                  human-readable JSON and designed to live alongside the code
                  repositories they operate on.
                </p>
              </div>

              {/* Screenshots — 2-column grid */}
              <section className="mt-8">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Screenshots
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                    onClick={() =>
                      openLightbox(
                        "/PigeonCoop/Pigeon-workspace.png",
                        "PigeonCoop workflow canvas showing node graph and event feed",
                      )
                    }
                  >
                    <Image
                      src="/PigeonCoop/Pigeon-workspace.png"
                      alt="PigeonCoop workflow canvas showing node graph and event feed"
                      width={1917}
                      height={941}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                    onClick={() =>
                      openLightbox(
                        "/PigeonCoop/Pigeon-workspace-planned.png",
                        "PigeonCoop planned workspace layout with replay debugger and inspector panels",
                      )
                    }
                  >
                    <Image
                      src="/PigeonCoop/Pigeon-workspace-planned.png"
                      alt="PigeonCoop planned workspace layout with replay debugger and inspector panels"
                      width={1508}
                      height={855}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                pigeoncoop.app / Features
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Features</h1>

              <ul className="mt-6 space-y-4">
                {FEATURES.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-lg border border-glass-edge bg-chrome p-4"
                  >
                    <div className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium">
                          {feature.title}
                        </p>
                        <p className="mt-1 text-[13px] text-label-secondary">
                          {feature.detail}
                        </p>
                        {feature.images && feature.images.length > 0 && (
                          <div
                            className={`mt-3 grid gap-2 ${feature.images.length > 1 ? "sm:grid-cols-2" : ""}`}
                          >
                            {feature.images.map((src) => (
                              <div
                                key={src}
                                className="cursor-pointer overflow-hidden rounded-md border border-glass-edge"
                                onClick={() =>
                                  openLightbox(src, feature.title)
                                }
                              >
                                <Image
                                  src={src}
                                  alt={feature.title}
                                  width={IMAGE_DIMS[src]?.width ?? 1200}
                                  height={IMAGE_DIMS[src]?.height ?? 800}
                                  style={{ width: "100%", height: "auto" }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {active === "stack" && (
            <>
              <p className="text-[13px] text-label-secondary">
                pigeoncoop.app / Tech Stack
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

              <div className="mt-6 space-y-3">
                {STACK_GROUPS.map((group) => (
                  <section
                    key={group.label}
                    className="rounded-lg border border-glass-edge bg-chrome p-4"
                  >
                    <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                      {group.label}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-glass-edge bg-window px-2.5 py-1 text-[11px] text-label-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Architecture Notes */}
              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                  Architecture Notes
                </h2>
                <ul className="mt-3 space-y-2">
                  {[
                    "The core-engine crate owns the async Tokio executor; workflow execution is fully decoupled from the Tauri frontend via IPC events — the UI cannot block a running workflow.",
                    "Every side effect during a run (command output, agent response, routing decision, memory write) is emitted as a typed RunEvent with causation_id and correlation_id chains, making replay deterministic.",
                    "The persistence crate uses rusqlite with the bundled feature so no system SQLite library is required; the app ships as a self-contained binary.",
                    "Workflow definitions are serde_json-serialised WorkflowDefinition structs — plain JSON files designed to live in the same git repository as the code they automate.",
                    "Tauri IPC is the only bridge between Rust and React; no shared memory or FFI surface is exposed to the frontend.",
                  ].map((rule) => (
                    <li key={rule} className="flex gap-3 text-[13px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-label-secondary" />
                      <span className="text-label-secondary">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mermaid architecture diagram */}
              <section className="mt-4">
                <h2 className="mb-3 text-[11px] font-semibold uppercase text-label-secondary">
                  System Diagram
                </h2>
                <div
                  className="cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                  onClick={() =>
                    openLightbox(
                      "/PigeonCoop/Pigeon-mermaid-diagram.png",
                      "PigeonCoop system architecture diagram showing crate boundaries and IPC event flow",
                    )
                  }
                >
                  <Image
                    src="/PigeonCoop/Pigeon-mermaid-diagram.png"
                    alt="PigeonCoop system architecture diagram showing crate boundaries and IPC event flow"
                    width={2036}
                    height={3411}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </section>
            </>
          )}

          {active === "links" && (
            <>
              <p className="text-[13px] text-label-secondary">
                pigeoncoop.app / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Links</h1>

              {/* In Development notice card */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <Construction
                  className="h-5 w-5 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">In active development</p>
                  <p className="mt-0.5 text-[12px] text-label-secondary">
                    No public release yet. Source is available on GitHub for
                    review — issues and feedback are welcome.
                  </p>
                </div>
              </div>

              {/* GitHub repo link */}
              <div className="mt-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <GitFork
                    className="h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      View source on GitHub
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      github.com/AG9898/PigeonCoop
                    </p>
                  </div>
                </a>
              </div>
            </>
          )}
        </article>
      </main>

      {/* Lightbox overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={IMAGE_DIMS[lightbox.src]?.width ?? 1200}
            height={IMAGE_DIMS[lightbox.src]?.height ?? 800}
            onClick={toggleZoom}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              transform: lightbox.zoomed ? "scale(1.85)" : "scale(1)",
              transition: "transform 0.25s ease",
              cursor: lightbox.zoomed ? "zoom-out" : "zoom-in",
            }}
            className="rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
