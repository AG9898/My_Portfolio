"use client";

import { useState } from "react";
import { ExternalLink, CloudRain, BarChart3 } from "lucide-react";

const APP_URL = "https://weather-and-wellness-dashboard.vercel.app";

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "FastAPI",
  "Python",
  "SQLAlchemy",
  "Alembic",
  "PostgreSQL",
  "Supabase Auth",
  "Highcharts",
  "Anime.js",
  "statsmodels",
  "NumPy / Pandas",
  "Vercel",
];

const FEATURES: { title: string; detail: string }[] = [
  {
    title: "Multi-instrument session runner for validated psychological tasks",
    detail:
      "RAs start a session for an anonymous participant and administer a fixed battery: Backwards Digit Span (working memory), ULS-8 (loneliness), CES-D 10 (depression), GAD-7 (anxiety), CogFunc 8a (cognitive function), and an optional Misokinesia video-clip task.",
  },
  {
    title: "Server-side auto-scoring for all instruments",
    detail:
      "Each instrument has a pure-function Python scorer (reverse-scored items, severity bands, z-score transforms). Scores are computed on submit and stored alongside raw responses — no manual scoring required.",
  },
  {
    title: "Weather-psychology mixed linear model analytics",
    detail:
      "Daily weather data (temperature, precipitation, daylight hours) from the UBC EOS station is correlated with session outcomes using statsmodels mixed-effects regressions. Effect cards with fitted lines and confidence intervals are visualised via Highcharts.",
  },
  {
    title: "Daily weather ingestion and historical backfill",
    detail:
      "A FastAPI endpoint (with GitHub Actions trigger) fetches and upserts daily weather observations. A separate Open-Meteo backfill service populates historical rows for the full study period, with idempotent upserts and per-station advisory locks.",
  },
  {
    title: "RA import/export and data management",
    detail:
      "A protected /import-export page lets RAs preview-import legacy CSV/XLSX data and export study data as XLSX workbooks or zipped CSVs. All bulk data access is audit-logged and RA-only.",
  },
  {
    title: "Anonymous participant model with per-lab data isolation",
    detail:
      "Participants have no login — identity is a stable UUID assigned at first session. All data is scoped to a lab slug via Supabase Auth app_metadata, keeping multi-lab rows strictly isolated.",
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Research platform" },
];

export default function WeatherWellness() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          weather_wellness/
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
                weather_wellness / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">
                Weather &amp; Wellness
              </h1>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                  <span className="h-2 w-2 rounded-full bg-system-green" />
                  Deployed
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <CloudRain
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Research platform
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <BarChart3
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Next.js + FastAPI
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <p>
                  Weather &amp; Wellness is a multi-instrument research web
                  application built for a UBC Psychology lab. Research
                  assistants use it to run validated psychological tasks and
                  surveys with anonymous participants, with full server-side
                  auto-scoring and per-lab data isolation.
                </p>
                <p>
                  The platform correlates daily weather data — temperature,
                  precipitation, and daylight hours from the UBC EOS station —
                  with session outcomes (digit span, loneliness, depression,
                  anxiety, cognitive function) using server-side mixed-effects
                  regression models via statsmodels. Effect cards and fitted
                  lines are rendered in an RA-only analytics dashboard.
                </p>
                <p className="text-label-secondary">
                  Frontend on Vercel (Next.js 16 + React 19), backend on
                  Render/Railway (FastAPI + Python + PostgreSQL). Supabase Auth
                  handles RA sessions with lab-scoped claims. Import/export
                  for legacy data via XLSX/CSV with preview-first ingestion.
                </p>
              </div>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                weather_wellness / Features
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
                weather_wellness / Tech Stack
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
                weather_wellness / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">
                Research Platform
              </h1>

              <div className="mt-6">
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
                      View live platform
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
