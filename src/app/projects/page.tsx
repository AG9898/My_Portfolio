import { ExternalLink, Folder, Grid3X3, List, Search } from "lucide-react";

const PROJECTS = [
  {
    name: "My Portfolio",
    kind: "Next.js portfolio",
    status: "Active redesign",
    path: "~/projects/My_Portfolio",
    description:
      "A browser-based macOS desktop portfolio with a persistent shell, dock, shortcuts, route-synced windows, and first-pass app content.",
    stack: ["Next.js", "TypeScript", "Tailwind", "framer-motion"],
    category: "frontend" as const,
    link: "https://github.com/AG9898/My_Portfolio",
  },
  {
    name: "PigeonCoop",
    kind: "Desktop workflow tool",
    status: "Active development",
    path: "~/projects/PigeonCoop",
    description:
      "A local-first Tauri app for designing, running, monitoring, and replaying agent workflows through a game-inspired 2D interface.",
    stack: ["Rust", "Tauri", "React", "SQLite"],
    category: "agent-tools" as const,
    link: "https://github.com/AG9898/PigeonCoop",
  },
  {
    name: "Zellaude-Plus",
    kind: "Claude API client",
    status: "Active development",
    path: "~/projects/Zellaude-Plus",
    description:
      "An extended Claude API wrapper and chat interface with prompt-caching utilities, streaming controls, and conversation management.",
    stack: ["TypeScript", "Node.js", "Anthropic SDK"],
    category: "agent-tools" as const,
    link: "https://github.com/AG9898/Zellaude-Plus",
  },
  {
    name: "Glass Atlas",
    kind: "3D data visualiser",
    status: "Deployed",
    path: "~/projects/Glass_Atlas",
    description:
      "An interactive three-dimensional geospatial atlas with frosted-glass UI, animated globe layers, and dataset overlays served from Railway.",
    stack: ["React", "Three.js", "TypeScript", "Railway"],
    category: "frontend" as const,
    link: "https://glass-atlas-production.up.railway.app",
  },
  {
    name: "Techy",
    kind: "Knowledge graph",
    status: "Deployed",
    path: "~/projects/Techy",
    description:
      "A personal, single-user tech knowledge graph built around notes, wikilinks, D3 graph views, Auth.js, Drizzle, and Neon PostgreSQL.",
    stack: ["SvelteKit", "TypeScript", "Drizzle", "D3"],
    category: "frontend" as const,
    link: "https://techy-psi.vercel.app",
  },
  {
    name: "Sparse",
    kind: "Minimal text editor",
    status: "Local product",
    path: "~/projects/Sparse",
    description:
      "A distraction-free writing environment with a single-file approach, markdown preview, and a calm typographic baseline — no cloud sync.",
    stack: ["Electron", "TypeScript", "CodeMirror"],
    category: "tooling" as const,
    link: null,
  },
  {
    name: "Weather & Wellness",
    kind: "Health dashboard",
    status: "In progress",
    path: "~/projects/Weather_Wellness",
    description:
      "A personal wellness tracker that correlates local weather data with logged mood, sleep, and activity entries using lightweight ML models.",
    stack: ["Next.js", "Python", "FastAPI", "Chart.js"],
    category: "client-work" as const,
    link: "https://github.com/AG9898/Weather_Wellness",
  },
  {
    name: "Interactive MapLibre",
    kind: "Mapping playground",
    status: "Prototype",
    path: "~/projects/Interactive_MapLibre",
    description:
      "A MapLibre GL JS prototype with custom vector tile styling, dynamic layer controls, and gesture-driven navigation experiments.",
    stack: ["MapLibre GL", "TypeScript", "Vite"],
    category: "frontend" as const,
    link: "https://github.com/AG9898/Interactive_MapLibre",
  },
  {
    name: "movieboxd",
    kind: "Movie tracker",
    status: "Prototype",
    path: "~/projects/movieboxd",
    description:
      "A Letterboxd-inspired personal movie log with a clean card-grid UI, watchlist management, and TMDB API integration.",
    stack: ["React", "TypeScript", "TMDB API", "Supabase"],
    category: "frontend" as const,
    link: "https://github.com/AG9898/movieboxd",
  },
];

const SIDEBAR_ITEMS = [
  { label: "Recents", count: PROJECTS.length, active: true },
  {
    label: "Frontend",
    count: PROJECTS.filter((p) => p.category === "frontend").length,
    active: false,
  },
  {
    label: "Agent Tools",
    count: PROJECTS.filter((p) => p.category === "agent-tools").length,
    active: false,
  },
  {
    label: "Client Work",
    count: PROJECTS.filter((p) => p.category === "client-work").length,
    active: false,
  },
  {
    label: "Tooling",
    count: PROJECTS.filter((p) => p.category === "tooling").length,
    active: false,
  },
];

export default function Projects() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-52 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          projects/
        </div>
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] ${
                item.active
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Folder className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </span>
              <span
                className={`text-[11px] ${
                  item.active ? "text-label-primary" : "text-label-secondary"
                }`}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="glass-chrome flex h-10 shrink-0 items-center gap-2 border-b border-glass-edge px-3">
          <div className="flex h-7 rounded-md border border-glass-edge bg-window p-0.5">
            <button
              type="button"
              className="flex h-6 w-7 items-center justify-center rounded bg-accent text-label-primary"
              aria-label="Grid view"
            >
              <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex h-6 w-7 items-center justify-center rounded text-label-secondary hover:bg-[var(--color-control-hover)]"
              aria-label="List view"
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="ml-auto flex h-7 w-full max-w-56 items-center gap-2 rounded-md border border-glass-edge bg-window px-2 text-[12px] text-label-secondary">
            <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Search Projects</span>
          </div>
        </div>

        <section className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[13px] text-label-secondary">
                Finder / projects/
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Projects</h1>
            </div>
            <p className="hidden text-[12px] text-label-secondary sm:block">
              {PROJECTS.length} items
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {PROJECTS.map((project) => (
              <article
                key={project.name}
                className="rounded-lg border border-glass-edge bg-chrome p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-12 shrink-0 items-end rounded-md border border-glass-edge bg-accent/80 px-1 pb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
                    <div className="h-7 w-full rounded-sm bg-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-semibold">
                          {project.name}
                        </h2>
                        <p className="truncate text-[12px] text-label-secondary">
                          {project.kind} - {project.status}
                        </p>
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.name} in a new tab`}
                          className="mt-0.5 shrink-0 text-label-secondary transition-colors hover:text-label-primary"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-[13px] leading-6 text-label-primary">
                      {project.description}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid gap-2 text-[12px] text-label-secondary">
                  <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-label-primary">Path</dt>
                    <dd className="min-w-0 truncate">{project.path}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-label-primary">Link</dt>
                    <dd className="min-w-0 truncate">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          {project.link.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-label-secondary">Local repo</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-glass-edge bg-window px-2.5 py-1 text-[11px] text-label-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
