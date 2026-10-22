"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ExternalLink,
  Globe,
  MessageCircle,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  BFR_ARCHITECTURE,
  BFR_ARCHITECTURE_NOTES,
  BFR_BUILD_FACTS,
  BFR_DISCLAIMER,
  BFR_GAMEPLAY_VOLUME,
  BFR_INVOCATIONS,
  BFR_LINKS,
  BFR_NAV,
  BFR_OVERVIEW,
  BFR_SCALING_HEADLINE,
  BFR_SCALING_STEPS,
  BFR_SCALING_SUMMARY,
  BFR_SNAPSHOT_DATE,
  BFR_STACK_GROUPS,
  BFR_STATS,
  type BfrSection,
} from "./bfrData";

const formatCount = (n: number) => n.toLocaleString("en-US");

function InvocationsChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...BFR_INVOCATIONS.map((d) => d.value));
  const firstAfter = BFR_INVOCATIONS.findIndex((d) => d.phase === "after");

  return (
    <figure className="rounded-lg border border-glass-edge bg-chrome p-4">
      <figcaption>
        <p className="text-[13px] font-medium">Vercel function invocations per day</p>
        <p className="text-[12px] text-label-secondary">
          Static menus shipped during 15 Oct
        </p>
      </figcaption>

      <div className="relative mt-4 flex h-44 items-end gap-2" aria-hidden="true">
        {BFR_INVOCATIONS.map((d, i) => (
          <div
            key={d.day}
            className="relative flex h-full flex-1 flex-col items-center justify-end"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div className="glass-chrome pointer-events-none absolute -top-1 z-10 whitespace-nowrap rounded-md border border-glass-edge px-2 py-1 text-[11px] text-label-primary shadow-lg">
                {d.day}: {formatCount(d.value)}
              </div>
            )}
            {i === firstAfter && (
              <div className="absolute -left-[5px] bottom-0 top-6 border-l border-dashed border-label-secondary" />
            )}
            <div
              className={`w-full max-w-10 rounded-t bg-accent ${hovered === i ? "opacity-100" : "opacity-80"}`}
              style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2" aria-hidden="true">
        {BFR_INVOCATIONS.map((d) => (
          <span
            key={d.day}
            className="flex-1 text-center text-[11px] text-label-secondary"
          >
            {d.day}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Vercel function invocations per day</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Invocations</th>
          </tr>
        </thead>
        <tbody>
          {BFR_INVOCATIONS.map((d) => (
            <tr key={d.day}>
              <td>{d.day}</td>
              <td>{formatCount(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function StatGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-glass-edge bg-chrome px-3 py-3"
        >
          <p className="text-[18px] font-semibold tabular-nums">{item.value}</p>
          <p className="mt-0.5 text-[11px] leading-4 text-label-secondary">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Bfr() {
  const [active, setActive] = useState<BfrSection>("overview");

  return (
    <div className="relative flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          bfr.game
        </div>
        <div className="space-y-1">
          {BFR_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left ${
                active === item.id
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <div className="truncate text-[13px] font-medium">{item.label}</div>
              <div
                className={`truncate text-[11px] ${
                  active === item.id ? "text-label-primary" : "text-label-secondary"
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
              <p className="text-[13px] text-label-secondary">bfr.game / Overview</p>
              <h1 className="mt-1 text-[22px] font-semibold">
                BFR: Brave Frontier Reborn
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <span className="h-2 w-2 rounded-full bg-system-green" />
                  Live
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Browser RPG
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Solo-built
                </span>
              </div>

              <section className="mt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {BFR_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-glass-edge bg-chrome p-4"
                    >
                      <p className="text-[26px] font-semibold leading-8 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-[13px] font-medium">{stat.label}</p>
                      <p className="mt-0.5 text-[12px] text-label-secondary">
                        {stat.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-label-secondary">
                  Snapshot from production data, {BFR_SNAPSHOT_DATE}.
                </p>
              </section>

              <div className="mt-6 space-y-4">
                {BFR_OVERVIEW.map((paragraph, i) => (
                  <p
                    key={paragraph}
                    className={i === BFR_OVERVIEW.length - 1 ? "text-label-secondary" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <section className="mt-8">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Played so far
                </h2>
                <div className="mt-3">
                  <StatGrid items={BFR_GAMEPLAY_VOLUME} />
                </div>
              </section>

              <section className="mt-6">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Built in a month
                </h2>
                <div className="mt-3">
                  <StatGrid items={BFR_BUILD_FACTS} />
                </div>
              </section>

              <p className="mt-8 text-[11px] leading-5 text-label-secondary">
                {BFR_DISCLAIMER}
              </p>
            </>
          )}

          {active === "scaling" && (
            <>
              <p className="text-[13px] text-label-secondary">bfr.game / Scaling</p>
              <h1 className="mt-1 text-[22px] font-semibold">{BFR_SCALING_HEADLINE}</h1>
              <p className="mt-4">{BFR_SCALING_SUMMARY}</p>

              <div className="mt-6">
                <InvocationsChart />
              </div>

              <ul className="mt-6 space-y-4">
                {BFR_SCALING_STEPS.map((step) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-glass-edge bg-chrome p-4"
                  >
                    <div className="flex gap-3">
                      <Activity
                        className="mt-1 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium">{step.title}</p>
                        <p className="mt-1 text-[13px] text-label-secondary">
                          {step.detail}
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
              <p className="text-[13px] text-label-secondary">bfr.game / Tech Stack</p>
              <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

              <div className="mt-6 space-y-3">
                {BFR_STACK_GROUPS.map((group) => (
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

              {/* Request-path diagram, drawn in DOM so it needs no image asset */}
              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                  Request Path
                </h2>
                <div className="mt-3 space-y-1">
                  {BFR_ARCHITECTURE.map((lane, i) => (
                    <div key={lane.lane}>
                      <div className="grid grid-cols-[64px_1fr] items-stretch gap-3">
                        <span className="self-center text-[11px] font-medium uppercase text-label-secondary">
                          {lane.lane}
                        </span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {lane.nodes.map((node) => (
                            <div
                              key={node.title}
                              className="rounded-md border border-glass-edge bg-window px-3 py-2"
                            >
                              <p className="text-[12px] font-medium">{node.title}</p>
                              <p className="text-[11px] leading-4 text-label-secondary">
                                {node.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {i < BFR_ARCHITECTURE.length - 1 && (
                        <div className="grid grid-cols-[64px_1fr] gap-3">
                          <span />
                          <ArrowDown
                            className="mx-auto my-1 h-4 w-4 text-label-secondary"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                  Architecture Notes
                </h2>
                <ul className="mt-3 space-y-2">
                  {BFR_ARCHITECTURE_NOTES.map((note) => (
                    <li key={note} className="flex gap-3 text-[13px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-label-secondary" />
                      <span className="text-label-secondary">{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {active === "links" && (
            <>
              <p className="text-[13px] text-label-secondary">bfr.game / Links</p>
              <h1 className="mt-1 text-[22px] font-semibold">Links</h1>

              <div className="mt-6 space-y-3">
                <a
                  href={BFR_LINKS.site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <ExternalLink className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-accent">Play in the browser</p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      {BFR_LINKS.site.label}
                    </p>
                  </div>
                </a>
                <a
                  href={BFR_LINKS.discord.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-accent">Discord community</p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      {BFR_LINKS.discord.label}
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-4 flex gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <ShieldAlert
                  className="mt-0.5 h-5 w-5 shrink-0 text-label-secondary"
                  aria-hidden="true"
                />
                <div className="min-w-0 text-[12px] leading-5 text-label-secondary">
                  <p className="text-[13px] font-medium text-label-primary">
                    Source is private
                  </p>
                  <p className="mt-0.5">{BFR_DISCLAIMER}</p>
                </div>
              </div>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
