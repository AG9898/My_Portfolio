"use client";

import { useState } from "react";
import { ExternalLink, Globe, Layers, Zap } from "lucide-react";

const APP_URL = "https://glass-atlas-production.up.railway.app";

const STACK = [
  "SvelteKit 2",
  "Svelte 5 (runes)",
  "TypeScript",
  "Tailwind CSS v4",
  "Drizzle ORM",
  "Neon PostgreSQL",
  "pgvector",
  "OpenRouter",
  "Auth.js",
  "Railway",
  "Bun",
];

const FEATURES = [
  "Public notes library with markdown CRUD and wiki-link relationships ([[slug]] syntax)",
  "GitHub OAuth-protected admin authoring workspace with series and category support",
  "Streaming RAG chat (SSE) grounded exclusively in published notes via pgvector cosine search",
  "Write-time embeddings generated on note save for semantic retrieval (OpenRouter embeddings)",
  "First-party media upload via Railway Storage Buckets with presigned S3-compatible URLs",
  "Anonymous cookie-based chat rate limiting with per-hour message quotas",
  "Section-aware chunked retrieval with lexical + semantic fusion and confidence tiers",
];

type Section = "overview" | "about" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Live app" },
  { id: "about", label: "About", sub: "Project detail" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Resources" },
];

export default function GlassAtlas() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="flex h-full bg-window text-label-primary">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:flex md:flex-col">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          glass_atlas/
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
                  active === item.id ? "text-label-primary" : "text-label-secondary"
                }`}
              >
                {item.sub}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Overview: full-bleed iframe */}
      {active === "overview" && (
        <div className="min-h-0 flex-1">
          <iframe
            title="Glass Atlas"
            src={APP_URL}
            className="h-full w-full border-0 bg-window"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="lazy"
          />
        </div>
      )}

      {/* Other sections: scrollable content */}
      {active !== "overview" && (
        <main className="min-w-0 flex-1 overflow-y-auto">
          <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
            {active === "about" && (
              <>
                <p className="text-[13px] text-label-secondary">
                  glass_atlas / About
                </p>
                <h1 className="mt-1 text-[22px] font-semibold">Glass Atlas</h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] font-medium text-label-primary">
                    <span className="h-2 w-2 rounded-full bg-system-green" />
                    Deployed
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                    <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Live on Railway
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                    <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Personal project
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <p>
                    Glass Atlas is a SvelteKit editorial knowledge site for a single
                    author. It combines a public notes library, a GitHub
                    OAuth-protected admin writing workspace, and a streaming RAG chat
                    experience that answers questions grounded exclusively in
                    published notes.
                  </p>
                  <p>
                    The project is built around strict server-side boundaries: all
                    database access, embedding generation, and AI I/O live in
                    SvelteKit server routes and load functions. The chat endpoint
                    streams responses via SSE using a hybrid retrieval pipeline —
                    pgvector cosine search fused with lexical matching — with
                    confidence tiers that gate whether the LLM path fires or falls
                    back to a deterministic reply.
                  </p>
                  <p className="text-label-secondary">
                    Deployed on Railway with a Bun HTTP server, Neon PostgreSQL (with
                    pgvector), and Railway Storage Buckets for first-party media. The
                    database shares a Neon project with my Techy knowledge graph,
                    isolated under a separate Postgres schema.
                  </p>
                </div>
              </>
            )}

            {active === "stack" && (
              <>
                <p className="text-[13px] text-label-secondary">
                  glass_atlas / Tech Stack
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
              </>
            )}

            {active === "links" && (
              <>
                <p className="text-[13px] text-label-secondary">
                  glass_atlas / Links
                </p>
                <h1 className="mt-1 text-[22px] font-semibold">Resources</h1>

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
                        Open Glass Atlas
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-label-secondary">
                        {APP_URL}
                      </p>
                    </div>
                  </a>
                </div>

                <div className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                  <Layers
                    className="h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-[13px] font-medium">
                    Add repository or docs links here
                  </p>
                  <p className="mt-0.5 text-[12px] text-label-secondary">
                    GitHub, docs, or other resources.
                  </p>
                </div>
              </>
            )}
          </article>
        </main>
      )}
    </div>
  );
}
