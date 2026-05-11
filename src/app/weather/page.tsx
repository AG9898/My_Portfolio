"use client";

import { useState } from "react";
import { ExternalLink, CloudRain, BarChart3 } from "lucide-react";

const APP_URL = "https://weather-and-wellness-dashboard.vercel.app";

const STACK = ["Python", "Flask", "Vercel", "HTML/CSS", "JavaScript"];

const FEATURES: { title: string; detail: string }[] = [
  {
    title: "Local weather conditions fetched from a public weather API",
    detail:
      "Current temperature, wind speed, and conditions are retrieved on page load from an open-source weather API, requiring no user account or API key setup.",
  },
  {
    title: "Air quality index and UV index alongside temperature and wind data",
    detail:
      "AQI and UV readings are surfaced next to the core weather figures so users can assess outdoor safety at a glance without switching between services.",
  },
  {
    title: "Wellness tips that adapt to current weather conditions",
    detail:
      "The dashboard generates condition-aware recommendations — hydration reminders on hot days, air-quality alerts on poor-visibility days — rendered server-side by Flask.",
  },
  {
    title: "Responsive dashboard layout suitable for a daily overview",
    detail:
      "The single-page layout scales from mobile to desktop without a frontend build step, relying on plain CSS grid and the Flask template engine.",
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Live dashboard" },
];

export default function WeatherWellness() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          weather.dash
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
                weather.dash / Overview
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
                  Weather dashboard
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                  <BarChart3
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Python / Flask
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <p>
                  Weather &amp; Wellness is a deployed Python/Flask dashboard
                  that surfaces local weather data alongside wellness context —
                  air quality, UV index, and condition-aware tips — in a single
                  daily overview.
                </p>
                <p className="text-label-secondary">
                  The project was built to explore server-side rendering with
                  Flask and Vercel deployment. It pulls from a public weather
                  API and presents the output in a clean dashboard layout
                  without a frontend build step.
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
                weather.dash / Features
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
                weather.dash / Tech Stack
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
                weather.dash / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">
                Live Dashboard
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
                      View live dashboard
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
