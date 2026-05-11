"use client";

import { useState } from "react";
import { ExternalLink, Lock, Monitor, GitBranch } from "lucide-react";

const APP_URL = "https://techy-psi.vercel.app";

const STACK = ["React", "TypeScript", "Tailwind CSS", "Vercel"];

const FEATURES: { title: string; detail: string }[] = [
  {
    title: "GitHub authentication for access control",
    detail:
      "The app is protected behind GitHub OAuth, restricting access to authorised users only.",
  },
  {
    title: "Feature two",
    detail: "Add a one-sentence description of this feature here.",
  },
  {
    title: "Feature three",
    detail: "Add a one-sentence description of this feature here.",
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Repository" },
];

export default function Techy() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          techy.app
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
                techy.app / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Techy</h1>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <span className="h-2 w-2 rounded-full bg-system-green" />
                  Deployed
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  GitHub auth required
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Monitor
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Personal project
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <p>
                  Add a description of what Techy does and what motivated the
                  project. This is the main introduction visitors will read.
                </p>
                <p className="text-label-secondary">
                  Techy is protected by GitHub authentication, so the live app
                  is not directly accessible here. Screenshots and details are
                  provided below.
                </p>
              </div>

              {/* Screenshot placeholders — 2-column grid */}
              <section className="mt-8">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Screenshots
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="flex aspect-video items-center justify-center rounded-lg border border-glass-edge bg-chrome text-[12px] text-label-secondary">
                    Screenshot coming soon
                  </div>
                  <div className="flex aspect-video items-center justify-center rounded-lg border border-glass-edge bg-chrome text-[12px] text-label-secondary">
                    Screenshot coming soon
                  </div>
                </div>
              </section>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                techy.app / Features
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
                techy.app / Tech Stack
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
                techy.app / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Links</h1>

              {/* Auth-required notice card */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <GitBranch
                  className="h-5 w-5 shrink-0 text-label-secondary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">Access restricted</p>
                  <p className="mt-0.5 text-[12px] text-label-secondary">
                    The live app requires GitHub authentication. Contact for
                    access.
                  </p>
                </div>
              </div>

              {/* Live app external link */}
              <div className="mt-4">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <ExternalLink
                    className="h-5 w-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-accent">
                      Open Techy
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      {APP_URL}
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
