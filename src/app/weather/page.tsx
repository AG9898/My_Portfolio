import { ExternalLink, CloudRain, BarChart3 } from "lucide-react";

const APP_URL = "https://weather-and-wellness-dashboard.vercel.app";

const STACK = ["Python", "Flask", "Vercel", "HTML/CSS", "JavaScript"];

const FEATURES = [
  "Local weather conditions fetched from a public weather API",
  "Air quality index and UV index alongside temperature and wind data",
  "Wellness tips that adapt to current weather conditions",
  "Responsive dashboard layout suitable for a daily overview",
];

export default function WeatherWellness() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      {/* Notes-style sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          weather.dash
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
              <CloudRain className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Weather dashboard
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
              <BarChart3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Python / Flask
            </span>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-4">
            <p>
              Weather &amp; Wellness is a deployed Python/Flask dashboard that
              surfaces local weather data alongside wellness context — air
              quality, UV index, and condition-aware tips — in a single daily
              overview.
            </p>
            <p className="text-label-secondary">
              The project was built to explore server-side rendering with Flask
              and Vercel deployment. It pulls from a public weather API and
              presents the output in a clean dashboard layout without a frontend
              build step.
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

          {/* Live site link */}
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
        </article>
      </main>
    </div>
  );
}
