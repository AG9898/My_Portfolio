"use client";

import { useState } from "react";
import { GitBranch, Clock, Layers } from "lucide-react";

const STACK = [
  "SvelteKit",
  "TypeScript",
  "Drizzle",
  "Supabase",
  "Bun",
  "Tailwind",
];

const FEATURES: { title: string; detail: string }[] = [
  {
    title: "Time entry tracking with project and task breakdowns",
    detail:
      "Employees log hours against specific projects and tasks, giving managers accurate breakdowns for billing and capacity planning.",
  },
  {
    title: "Expense submission and approval workflow",
    detail:
      "Staff submit expense claims with receipts; managers review, approve, or reject submissions through a dedicated workflow queue.",
  },
  {
    title: "Weekly and monthly timesheet reporting",
    detail:
      "Automated report generation aggregates approved entries into weekly and monthly views suitable for payroll and client billing exports.",
  },
  {
    title: "Role-based access for employees and managers",
    detail:
      "Two distinct permission tiers control which actions each user can perform — employees submit, managers approve and export.",
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Repository" },
];

export default function Sparse() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          sparse.app
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
                sparse.app / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Sparse</h1>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <span className="h-2 w-2 rounded-full bg-system-green" />
                  Active development
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Client work — Utilicom Technologies
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Private repository
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <p>
                  Sparse is a timesheet and expense management application built
                  for Utilicom Technologies. It provides employees with a clean
                  interface for logging hours against projects and tasks, while
                  giving managers an approval and reporting layer for payroll and
                  billing workflows.
                </p>
                <p className="text-label-secondary">
                  The app is in active development as a client engagement. It
                  handles the full lifecycle from time entry to manager sign-off,
                  with export targets for downstream billing systems.
                </p>
              </div>

              {/* Screenshot placeholder */}
              <div className="mt-8">
                <div className="flex aspect-video items-center justify-center rounded-lg border border-glass-edge bg-chrome text-[12px] text-label-secondary">
                  Screenshot coming soon
                </div>
              </div>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                sparse.app / Features
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
                      <div className="min-w-0">
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
                sparse.app / Tech Stack
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

              <section className="mt-6 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Dependencies
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STACK.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-glass-edge bg-window px-2.5 py-1 text-[11px] text-label-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}

          {active === "links" && (
            <>
              <p className="text-[13px] text-label-secondary">
                sparse.app / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Repository</h1>

              <div className="mt-6 flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <GitBranch
                  className="h-5 w-5 shrink-0 text-label-secondary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">Private repository</p>
                  <p className="mt-0.5 text-[12px] text-label-secondary">
                    Source is not publicly available. Contact for details.
                  </p>
                </div>
              </div>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
