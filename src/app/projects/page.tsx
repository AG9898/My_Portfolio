"use client";

import { useState } from "react";
import { ExternalLink, Folder, Grid3X3, List, Search } from "lucide-react";

type Category = "frontend" | "agent-tools" | "client-work" | "tooling";

const PROJECTS = [
  {
    name: "My Portfolio",
    kind: "Next.js portfolio",
    status: "Active redesign",
    path: "~/projects/My_Portfolio",
    description:
      "A browser-based macOS desktop portfolio with a persistent shell, dock, shortcuts, route-synced windows, and first-pass app content.",
    stack: ["Next.js", "TypeScript", "Tailwind", "framer-motion"],
    category: "frontend" as Category,
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
    category: "agent-tools" as Category,
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
    category: "agent-tools" as Category,
    link: "https://github.com/AG9898/Zellaude-Plus",
  },
  {
    name: "Glass Atlas",
    kind: "Editorial knowledge site",
    status: "Deployed",
    path: "~/projects/Glass-Atlas",
    description:
      "A SvelteKit editorial knowledge site with a public notes library, GitHub OAuth-protected admin workspace, and a streaming RAG chat grounded in published notes via pgvector cosine search.",
    stack: ["SvelteKit", "TypeScript", "Neon + pgvector", "OpenRouter", "Railway"],
    category: "frontend" as Category,
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
    category: "frontend" as Category,
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
    category: "tooling" as Category,
    link: null,
  },
  {
    name: "Weather & Wellness",
    kind: "Research web app",
    status: "Deployed",
    path: "~/projects/Weather-and-Wellness-Dashboard",
    description:
      "A UBC Psychology lab platform for administering validated psychological tasks and surveys, with server-side auto-scoring, weather-outcome mixed-effects modeling, and per-lab data isolation.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Supabase Auth", "statsmodels"],
    category: "client-work" as Category,
    link: "https://weather-and-wellness-dashboard.vercel.app",
  },
  {
    name: "Interactive MapLibre",
    kind: "Mapping playground",
    status: "Prototype",
    path: "~/projects/Interactive_MapLibre",
    description:
      "A MapLibre GL JS prototype with custom vector tile styling, dynamic layer controls, and gesture-driven navigation experiments.",
    stack: ["MapLibre GL", "TypeScript", "Vite"],
    category: "frontend" as Category,
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
    category: "frontend" as Category,
    link: "https://github.com/AG9898/movieboxd",
  },
];

const SIDEBAR_ITEMS: { label: string; category: Category | null }[] = [
  { label: "Recents", category: null },
  { label: "Frontend", category: "frontend" },
  { label: "Agent Tools", category: "agent-tools" },
  { label: "Client Work", category: "client-work" },
  { label: "Tooling", category: "tooling" },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const filteredProjects =
    selectedCategory === null
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  function handleSidebarClick(category: Category | null) {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }

  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-52 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          projects/
        </div>
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const count =
              item.category === null
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === item.category).length;
            const isActive = selectedCategory === item.category;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSidebarClick(item.category)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-left ${
                  isActive
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
                    isActive ? "text-label-primary" : "text-label-secondary"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
              {filteredProjects.length} items
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {filteredProjects.map((project) => (
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
