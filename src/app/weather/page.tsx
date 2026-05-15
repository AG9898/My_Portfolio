"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, FlaskConical, BarChart3 } from "lucide-react";

const APP_URL = "https://weather-and-wellness-dashboard.vercel.app";
const PRIMARY_URL = "https://ubcpsych.com";

const STACK_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Frontend",
    items: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Highcharts",
      "Anime.js",
      "Lucide React",
    ],
  },
  {
    label: "Backend",
    items: [
      "FastAPI",
      "Python",
      "SQLAlchemy",
      "Alembic",
      "statsmodels",
      "NumPy",
      "Pandas",
    ],
  },
  {
    label: "Data & Auth",
    items: [
      "Supabase Postgres",
      "Supabase Auth",
      "Upstash Redis",
      "Next.js Route Handlers",
    ],
  },
  {
    label: "Infrastructure",
    items: ["Vercel", "Render (current)", "Railway (planned)"],
  },
  {
    label: "Testing & Tooling",
    items: ["Vitest", "Playwright", "Storybook", "ESLint"],
  },
];

const FEATURES: { title: string; detail: string }[] = [
  {
    title: "RA and admin user management with lab-scoped access",
    detail:
      "Lab admins invite RAs by email through a protected /users page. Supabase Auth app_metadata carries a lab slug that scopes every DB read and write — rows from one lab are never visible to another. Role guards in Next.js middleware prevent unauthorized access to RA routes.",
  },
  {
    title: "Anonymous participant sessions with UUID-based identity",
    detail:
      "Participants have no login. An RA creates a session and a stable participant_uuid is assigned at first visit. Subsequent sessions for the same participant are linked by UUID without requiring any personal identifiers, satisfying ethics review requirements.",
  },
  {
    title: "Multi-instrument session runner for validated psychological tasks",
    detail:
      "RAs run a fixed battery per session: Backward Digit Span (working memory), ULS-8 (loneliness), CES-D 10 (depression), GAD-7 (anxiety), CogFunc 8a (cognitive function), and an optional Misokinesia 29-clip video sensitivity task. Each instrument has its own validated question set and response format.",
  },
  {
    title: "Server-side auto-scoring for all instruments",
    detail:
      "Each instrument has a pure-function Python scorer handling reverse-scored items, severity bands, and z-score transforms. Scores are computed on submit and stored alongside raw responses — no manual scoring required, and the scorer is unit-tested against reference values.",
  },
  {
    title: "Weather-psychology mixed linear model analytics",
    detail:
      "Daily weather data (temperature, precipitation, daylight hours) from the UBC EOS station is correlated with session outcomes using statsmodels mixed-effects regressions. Backend-generated statistical snapshots power an RA-only analytics dashboard with effect cards, fitted lines, and confidence intervals via Highcharts.",
  },
  {
    title: "Daily weather ingestion and historical backfill",
    detail:
      "A FastAPI endpoint (with GitHub Actions trigger) fetches and upserts daily weather observations from the UBC EOS station. A separate Open-Meteo backfill service populates historical rows for the full study period with idempotent upserts and per-station advisory locks.",
  },
  {
    title: "RA import/export and data management",
    detail:
      "A protected /import-export page lets RAs preview-import legacy CSV/XLSX data from Qualtrics exports and export study data as XLSX workbooks or zipped CSVs. All bulk data access is audit-logged and RA-only, with preview-first ingestion to prevent bad imports.",
  },
  {
    title: "Upstash Redis caching and session undo",
    detail:
      "Select RA dashboard reads are cached via Next.js Route Handlers backed by Upstash Redis on Vercel, reducing backend load for frequent weather and analytics reads. A narrow RA-only undo action allows transactional hard-delete of the most recent native session, with audit logging.",
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
                  <FlaskConical
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  UBC Psychology lab
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
                  Weather &amp; Wellness is a multi-instrument research platform
                  built for a UBC Psychology lab. Research assistants (RAs) and
                  lab admins use it to run validated psychological tasks and
                  surveys with anonymous participants — with full server-side
                  auto-scoring, per-lab data isolation, and a weather-linked
                  mixed-effects analytics dashboard.
                </p>
                <p>
                  The platform correlates daily weather conditions — temperature,
                  precipitation, and daylight hours from the UBC EOS station —
                  with session outcomes (digit span, loneliness, depression,
                  anxiety, cognitive function) using server-side mixed-effects
                  regression models via statsmodels. Stat cards, fitted lines,
                  and confidence intervals are rendered in an RA-only analytics
                  dashboard.
                </p>
                <p className="text-label-secondary">
                  Frontend on Vercel (Next.js + React), backend on
                  Render/Railway (FastAPI + PostgreSQL). Supabase Auth handles
                  RA sessions with lab-scoped claims. Upstash Redis caches
                  select dashboard reads on Vercel Route Handlers. Import/export
                  for legacy Qualtrics data via XLSX/CSV with preview-first
                  ingestion.
                </p>
              </div>

              {/* Weather timeline screenshot */}
              <div className="mt-8 overflow-hidden rounded-lg border border-glass-edge bg-chrome">
                <Image
                  src="/Weather-Wellness/WeatherCard.png"
                  alt="Weather timeline chart showing temperature over the study period"
                  width={925}
                  height={478}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
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

              {/* Stat screenshots */}
              <div className="mt-8 space-y-6">
                <div>
                  <div className="overflow-hidden rounded-lg border border-glass-edge bg-chrome">
                    <Image
                      src="/Weather-Wellness/Stat-example1.png"
                      alt="Day-level temperature summary with histogram and participant drill-down"
                      width={847}
                      height={801}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <p className="mt-2 text-center text-[12px] italic text-label-secondary">
                    Stat card values have been obscured in accordance with
                    confidentiality policy.
                  </p>
                </div>
                <div>
                  <div className="overflow-hidden rounded-lg border border-glass-edge bg-chrome">
                    <Image
                      src="/Weather-Wellness/Stat-example2.png"
                      alt="MLM statistical model result card showing effect plot and model fit"
                      width={904}
                      height={829}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <p className="mt-2 text-center text-[12px] italic text-label-secondary">
                    Stat card values have been obscured in accordance with
                    confidentiality policy.
                  </p>
                </div>
              </div>
            </>
          )}

          {active === "stack" && (
            <>
              <p className="text-[13px] text-label-secondary">
                weather_wellness / Tech Stack
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

              <div className="mt-6 space-y-3">
                <a
                  href={PRIMARY_URL}
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
                      Live platform — ubcpsych.com
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      {PRIMARY_URL}
                    </p>
                  </div>
                </a>

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
                      Legacy Vercel subdomain
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      {APP_URL}
                    </p>
                  </div>
                </a>

                <div className="rounded-lg border border-glass-edge bg-chrome p-4">
                  <p className="text-[13px] font-medium text-label-primary">
                    Source repository
                  </p>
                  <p className="mt-1 text-[13px] text-label-secondary">
                    Repository is private — access available on request.
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
