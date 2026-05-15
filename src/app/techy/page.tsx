"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Lock, Monitor, GitBranch, GitFork, X } from "lucide-react";

const APP_URL = "https://techy-psi.vercel.app";
const GITHUB_URL = "https://github.com/AG9898/Techy";

const STACK_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Framework & Language",
    items: ["SvelteKit 2", "Svelte 5 (runes)", "TypeScript (strict)", "Vite 7"],
  },
  {
    label: "Styling & UI",
    items: ["Tailwind CSS v4", "Melt UI", "GSAP", "marked"],
  },
  {
    label: "Database & ORM",
    items: [
      "Neon PostgreSQL",
      "@neondatabase/serverless",
      "Drizzle ORM",
      "drizzle-kit (migrations)",
    ],
  },
  {
    label: "AI & Providers",
    items: [
      "Anthropic Claude SDK",
      "OpenAI SDK",
      "OpenRouter (OpenAI-compatible)",
      "Multi-provider abstraction (models.ts)",
    ],
  },
  {
    label: "Auth",
    items: [
      "Auth.js + GitHub OAuth",
      "@auth/drizzle-adapter",
      "Single-user allowlist gate",
    ],
  },
  {
    label: "Visualisation",
    items: [
      "D3.js v7 (force-directed graph)",
      "Node radius by link degree",
      "Graph settings → localStorage",
    ],
  },
  {
    label: "Runtime & Tooling",
    items: [
      "@sveltejs/adapter-auto (Vercel)",
      "PWA (Workbox / service worker)",
      "Vitest + svelte-check + ESLint",
    ],
  },
];

const IMAGE_DIMS: Record<string, { width: number; height: number }> = {
  "/techy/graph.png": { width: 1919, height: 946 },
  "/techy/repository.png": { width: 1710, height: 938 },
  "/techy/chat.png": { width: 1080, height: 939 },
  "/techy/create.png": { width: 939, height: 884 },
  "/techy/note.png": { width: 434, height: 879 },
};

const FEATURES: { title: string; detail: string; images?: string[] }[] = [
  {
    title: "GitHub OAuth access control",
    detail:
      "Auth.js handles GitHub OAuth. A single allowlisted GitHub username can sign in; all other requests are redirected to the sign-in page. Sessions are stored in Neon PostgreSQL via the Drizzle adapter.",
  },
  {
    title: "D3 force-directed graph with live physics tuning",
    detail:
      "All notes and their wikilink connections render as a live D3 force simulation. Node radius scales with link degree (centrality) and colours map to either category or note maturity status. Charge strength, link distance, collision radius, and centering are tunable in a settings panel and persisted to localStorage.",
    images: ["/techy/graph.png"],
  },
  {
    title: "Wikilink connections with automatic edge syncing",
    detail:
      "Notes use [[wikilink]] syntax to reference each other by title. On every save, links are extracted via regex, resolved against the database, and synced to the note_links table as directed edges — old links deleted, new ones inserted. Unresolved links render as broken-link spans. The individual note view shows incoming and outgoing connections.",
    images: ["/techy/note.png"],
  },
  {
    title: "AI assistant for note drafting and wikilink suggestions",
    detail:
      "A built-in chat interface backed by Anthropic, OpenAI, or OpenRouter can research a topic and propose a fully structured note: title, category, status, tags, aliases, and a Markdown body with pre-wired wikilinks. The draft is reviewed in-chat and committed with a single click.",
    images: ["/techy/chat.png", "/techy/create.png"],
  },
];

type Section = "overview" | "features" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Repository" },
];

type Lightbox = { src: string; alt: string; zoomed: boolean };

export default function Techy() {
  const [active, setActive] = useState<Section>("overview");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openLightbox = (src: string, alt: string) =>
    setLightbox({ src, alt, zoomed: false });

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((lb) => lb && { ...lb, zoomed: !lb.zoomed });
  };

  return (
    <div className="relative flex min-h-full bg-window text-label-primary">
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
                  Techy is a personal knowledge graph for tracking and
                  connecting technical notes. Each note has a title, category
                  (one of 15 canonical types — Programming Languages, Frameworks
                  &amp; Libraries, AI &amp; Machine Learning, and more),
                  maturity status (stub → growing → mature), open tags, and a
                  Markdown body. Notes reference each other using{" "}
                  <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">
                    [[wikilink]]
                  </code>{" "}
                  syntax — every link automatically creates a directed edge, so
                  the web of relationships builds itself as you write.
                </p>
                <p className="text-label-secondary">
                  Access is gated behind GitHub OAuth so only I can log in, but
                  the architecture and screenshots are documented here.
                </p>
              </div>

              {/* Screenshots — 2-column grid */}
              <section className="mt-8">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Screenshots
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                    onClick={() =>
                      openLightbox(
                        "/techy/graph.png",
                        "D3 force-directed graph of note connections",
                      )
                    }
                  >
                    <Image
                      src="/techy/graph.png"
                      alt="D3 force-directed graph of note connections"
                      width={1919}
                      height={946}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                    onClick={() =>
                      openLightbox(
                        "/techy/repository.png",
                        "Notes repository list with category filters",
                      )
                    }
                  >
                    <Image
                      src="/techy/repository.png"
                      alt="Notes repository list with category filters"
                      width={1710}
                      height={938}
                      style={{ width: "100%", height: "auto" }}
                    />
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium">
                          {feature.title}
                        </p>
                        <p className="mt-1 text-[13px] text-label-secondary">
                          {feature.detail}
                        </p>
                        {feature.images && feature.images.length > 0 && (
                          <div
                            className={`mt-3 grid gap-2 ${feature.images.length > 1 ? "sm:grid-cols-2" : ""}`}
                          >
                            {feature.images.map((src) => (
                              <div
                                key={src}
                                className="cursor-pointer overflow-hidden rounded-md border border-glass-edge"
                                onClick={() =>
                                  openLightbox(src, feature.title)
                                }
                              >
                                <Image
                                  src={src}
                                  alt={feature.title}
                                  width={IMAGE_DIMS[src]?.width ?? 1200}
                                  height={IMAGE_DIMS[src]?.height ?? 800}
                                  style={{ width: "100%", height: "auto" }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
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

              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                  Architecture Rules
                </h2>
                <ul className="mt-3 space-y-2">
                  {[
                    "All server work lives in SvelteKit server modules (+page.server.ts, +server.ts) — no separate backend service.",
                    "AI provider calls are routed through a unified request contract; models.ts is the single provider/model registry.",
                    "Auth is enforced server-side in hooks.server.ts — no client-side route guards.",
                    "Graph view settings are persisted to localStorage only and never written to the database.",
                    "Schema changes apply through Drizzle ORM migrations only — no direct ALTER TABLE.",
                  ].map((rule) => (
                    <li key={rule} className="flex gap-3 text-[13px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-label-secondary" />
                      <span className="text-label-secondary">{rule}</span>
                    </li>
                  ))}
                </ul>
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

              {/* GitHub repo link */}
              <div className="mt-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-glass-edge bg-chrome p-4 hover:bg-[var(--color-control-hover)]"
                >
                  <GitFork
                    className="h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      View source on GitHub
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                      github.com/AG9898/Techy
                    </p>
                  </div>
                </a>
              </div>
            </>
          )}
        </article>
      </main>

      {/* Lightbox overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={IMAGE_DIMS[lightbox.src]?.width ?? 1200}
            height={IMAGE_DIMS[lightbox.src]?.height ?? 800}
            onClick={toggleZoom}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              transform: lightbox.zoomed ? "scale(1.85)" : "scale(1)",
              transition: "transform 0.25s ease",
              cursor: lightbox.zoomed ? "zoom-out" : "zoom-in",
            }}
            className="rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
