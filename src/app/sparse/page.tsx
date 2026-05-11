import { GitBranch, Clock, Layers } from "lucide-react";

const STACK = [
  "SvelteKit",
  "TypeScript",
  "Drizzle",
  "Supabase",
  "Bun",
  "Tailwind",
];

const FEATURES = [
  "Time entry tracking with project and task breakdowns",
  "Expense submission and approval workflow",
  "Weekly and monthly timesheet reporting",
  "Role-based access for employees and managers",
];

export default function Sparse() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          sparse.app
        </div>
        <div className="space-y-1">
          <div className="rounded-lg px-3 py-2 bg-accent text-label-primary">
            <div className="truncate text-[13px] font-medium">Overview</div>
            <div className="truncate text-[11px] text-label-primary">
              Project detail
            </div>
          </div>
          <div className="rounded-lg px-3 py-2 text-label-secondary hover:bg-[var(--color-control-hover)]">
            <div className="truncate text-[13px] font-medium">Tech Stack</div>
            <div className="truncate text-[11px] text-label-secondary">
              Dependencies
            </div>
          </div>
          <div className="rounded-lg px-3 py-2 text-label-secondary hover:bg-[var(--color-control-hover)]">
            <div className="truncate text-[13px] font-medium">Features</div>
            <div className="truncate text-[11px] text-label-secondary">
              Scope
            </div>
          </div>
        </div>
      </aside>

      {/* Main content pane */}
      <main className="min-w-0 flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
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
              Sparse is a timesheet and expense management application built for
              Utilicom Technologies. It provides employees with a clean interface
              for logging hours against projects and tasks, while giving managers
              an approval and reporting layer for payroll and billing workflows.
            </p>
            <p className="text-label-secondary">
              The app is in active development as a client engagement. It handles
              the full lifecycle from time entry to manager sign-off, with export
              targets for downstream billing systems.
            </p>
          </div>

          {/* Tech stack */}
          <section className="mt-8 rounded-lg border border-glass-edge bg-chrome p-4">
            <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
              Tech Stack
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

          {/* Features */}
          <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
            <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
              Features
            </h2>
            <ul className="mt-3 space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3 text-[13px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Repository note */}
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
        </article>
      </main>
    </div>
  );
}
