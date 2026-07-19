"use client";

import { useState } from "react";
import { GitFork, PackageCheck, Terminal, Layers, Cpu } from "lucide-react";
import PetSprite from "./PetSprite";
import TerminalSimulator from "./TerminalSimulator";
import {
  FEATURES,
  STACK_GROUPS,
} from "./buddyData";

const GITHUB_URL = "https://github.com/AG9898/buddy";
const NPM_URL = "https://www.npmjs.com/package/@ag9898/buddy";

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Install and source" },
];

const ARCH_NOTES = [
  "The CLI layer (Node.js / TypeScript) owns command parsing and process orchestration. It is the only surface that interacts with the file system and spawns the Electron app or calls WSL interop.",
  "Electron main runs the HTTP sidecar on 127.0.0.1:7777 and owns all BrowserWindow management. It is the bridge between system-level events and the Svelte renderer via contextBridge IPC.",
  "The Svelte renderer is stateless except for animation state and drag/resize geometry. It receives state strings from Electron main and maps them to spritesheet sequences — no direct knowledge of the CLI or HTTP layer.",
  "The Rust WSL bridge (petdex-bridge) is a single-purpose CLI binary compiled for x86_64-unknown-linux-gnu. It reads the shared update token from disk and POSTs state updates to the Windows sidecar over the WSL localhost passthrough — no custom port forwarding required.",
];

export default function Buddy() {
  const [active, setActive] = useState<Section>("overview");
  const [petState, setPetState] = useState("idle");

  return (
    <div className="relative flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          buddy.cli
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
                buddy.cli / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">buddy</h1>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <PackageCheck
                    className="h-3.5 w-3.5 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  Published · v1.0.1
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  npm CLI
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Windows
                </span>
              </div>

              {/* 2-column layout: description left, pet + terminal right */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Left: description */}
                <div className="space-y-4 text-[14px] leading-6">
                  <p>
                    buddy is a Windows npm CLI and Electron floating pixel-art
                    pet that lives on your desktop while you code. It reacts in
                    real time to{" "}
                    <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                      Claude Code
                    </code>{" "}
                    and{" "}
                    <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                      Codex CLI
                    </code>{" "}
                    lifecycle hook events — jumping when you submit a prompt,
                    running while a tool executes, waving when the session ends.
                  </p>
                  <p>
                    The hook-to-animation mapping is enforced at a local HTTP
                    sidecar running on{" "}
                    <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                      127.0.0.1:7777
                    </code>
                    , not inside the renderer. This means the pet state updates
                    are token-validated and isolated from the rendering layer —
                    any tool that can issue an HTTP POST can drive the animation
                    without touching Electron internals.
                  </p>
                  <p className="text-label-secondary">
                    buddy includes a WSL-aware setup flow. On Windows, the
                    Electron app launches directly. Inside WSL, a companion Rust
                    binary (petdex-bridge) bridges shell hook events across the
                    WSL boundary to the Windows sidecar over localhost passthrough
                    — no manual port forwarding required. Run{" "}
                    <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                      buddy hooks install
                    </code>{" "}
                    to write all hook entries automatically.
                  </p>
                </div>

                {/* Right: pet sprite + terminal simulator */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex justify-center">
                    <PetSprite state={petState} />
                  </div>
                  <TerminalSimulator onStateChange={setPetState} />
                </div>
              </div>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                buddy.cli / Features
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
                buddy.cli / Tech Stack
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

              <div className="mt-6 space-y-3">
                {STACK_GROUPS.map((group) => (
                  <section
                    key={group.group}
                    className="rounded-lg border border-glass-edge bg-chrome p-4"
                  >
                    <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                      {group.group}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item.name}
                          className="rounded-full border border-glass-edge bg-window px-2.5 py-1 text-[11px] text-label-secondary"
                          title={item.note}
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Architecture Notes */}
              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase text-label-secondary">
                  <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Architecture Notes — 4-component topology
                </h2>
                <ul className="mt-3 space-y-2">
                  {ARCH_NOTES.map((rule) => (
                    <li key={rule} className="flex gap-3 text-[13px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-label-secondary" />
                      <span className="text-label-secondary">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {active === "links" && (
            <>
              <p className="text-[13px] text-label-secondary">
                buddy.cli / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Links</h1>

              {/* Public package notice */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <PackageCheck
                  className="h-5 w-5 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">Available on npm</p>
                  <p className="mt-0.5 text-[12px] text-label-secondary">
                    Install the public package with npm install -g @ag9898/buddy.
                  </p>
                </div>
              </div>

              {/* npm package link */}
              <div className="mt-4">
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <PackageCheck
                    className="h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      Install @ag9898/buddy
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      npmjs.com/package/@ag9898/buddy
                    </p>
                  </div>
                </a>
              </div>

              {/* GitHub repo link */}
              <div className="mt-3">
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
                      github.com/AG9898/buddy
                    </p>
                  </div>
                </a>
              </div>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
