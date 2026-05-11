"use client";

import { useState } from "react";

type Section = "about" | "how-i-work" | "frontend-focus" | "what-i-value";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "about", label: "About Aden", sub: "Profile note" },
  { id: "how-i-work", label: "How I Work", sub: "Process" },
  { id: "frontend-focus", label: "Frontend Focus", sub: "Craft" },
  { id: "what-i-value", label: "What I Value", sub: "Principles" },
];

const WORKING_NOTES = [
  "Translate product intent into screens that are easy to scan and hard to misuse.",
  "Keep UI state deterministic, especially when interactions overlap.",
  "Use motion as feedback for focus, navigation, and layout change instead of decoration.",
  "Document the constraints that future work needs to preserve.",
];

export default function About() {
  const [active, setActive] = useState<Section>("about");

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          about_me.txt
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
          {active === "about" && (
            <>
              <p className="text-[13px] text-label-secondary">
                Notes / About Aden
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">About Aden</h1>

              <div className="mt-6 space-y-4">
                <p>
                  I am a frontend-focused developer interested in interfaces with
                  strong interaction models: desktop metaphors, focused tools,
                  responsive work surfaces, and systems where visual polish is tied
                  to clear behavior.
                </p>
                <p>
                  The portfolio itself is part of that work. It uses a macOS-style
                  desktop to show how routing, state, animation, and content can fit
                  into one coherent browser experience without relying on a
                  conventional scrolling landing page.
                </p>
                <p className="text-label-secondary">
                  I like building from product shape down to implementation detail:
                  what the user should notice first, how controls reveal state, what
                  breaks on small screens, and which patterns need to be documented
                  before the next feature lands.
                </p>
              </div>

              <section className="mt-8 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Working Notes
                </h2>
                <ul className="mt-3 space-y-3">
                  {WORKING_NOTES.map((note) => (
                    <li key={note} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {active === "how-i-work" && (
            <>
              <p className="text-[13px] text-label-secondary">
                Notes / How I Work
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">How I Work</h1>

              <div className="mt-6 space-y-4">
                <p>
                  I work iteratively — starting from a clear product shape, shipping
                  something functional early, and tightening behavior and polish in
                  focused follow-up passes. Each pass has a defined scope so the
                  surface area stays manageable and reviewable.
                </p>
                <p>
                  Documentation runs alongside code, not after it. Constraints,
                  patterns, and architectural decisions get written down as they
                  emerge so the next task starts with accurate context instead of
                  having to rediscover what already exists.
                </p>
                <p className="text-label-secondary">
                  Motion and animation are treated as intentional signals — tied to
                  state changes, navigation, and focus shifts — rather than applied
                  for visual interest. If a transition does not communicate something
                  useful, it does not ship.
                </p>
              </div>
            </>
          )}

          {active === "frontend-focus" && (
            <>
              <p className="text-[13px] text-label-secondary">
                Notes / Frontend Focus
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Frontend Focus</h1>

              <div className="mt-6 space-y-4">
                <p>
                  My craft interest is in interaction models that match how people
                  actually think about their work — spatial layouts, persistent
                  surfaces, focused modes, and progressive disclosure of complexity.
                  Desktop metaphors in the browser are a compelling design space
                  because they carry learned affordances without requiring a native
                  install.
                </p>
                <p>
                  I pay close attention to how behavior and visual treatment reinforce
                  each other. A transition that mismatches its trigger, a focus state
                  that disappears at the wrong moment, or a layout that shifts
                  unexpectedly on interaction — each of these breaks the mental model
                  the interface was trying to establish.
                </p>
                <p className="text-label-secondary">
                  Polish, in this framing, is not decoration added at the end. It is
                  the accumulated result of keeping behavior precise and making sure
                  the visual layer accurately reflects what the system is doing at
                  every moment.
                </p>
              </div>
            </>
          )}

          {active === "what-i-value" && (
            <>
              <p className="text-[13px] text-label-secondary">
                Notes / What I Value
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">What I Value</h1>

              <div className="mt-6 space-y-4">
                <p>
                  Deterministic state is a prerequisite for trustworthy interfaces.
                  When a user performs an action, the system should respond
                  predictably — no race conditions, no ambiguous intermediate states,
                  no behavior that only reproduces under timing pressure. Reducer
                  patterns and explicit action types are a practical path to that
                  guarantee in UI code.
                </p>
                <p>
                  Accessible motion means respecting the signals people send through
                  their operating system settings. Animations that cannot be reduced
                  or paused are not just an accessibility gap — they are a failure of
                  craft. Motion should always be a choice, not a constraint.
                </p>
                <p className="text-label-secondary">
                  Documentation as a first-class output means the decisions, patterns,
                  and constraints that shape a codebase are written down with the same
                  care as the code itself. A well-documented system is faster to
                  extend, easier to hand off, and more honest about its own
                  complexity.
                </p>
              </div>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
