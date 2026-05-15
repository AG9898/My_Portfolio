"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Globe, GitFork, Lock, Zap } from "lucide-react";

const APP_URL = "https://glass-atlas-production.up.railway.app";
const GITHUB_URL = "https://github.com/AG9898/Glass-Atlas";

const STACK_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Framework & Language",
    items: [
      "SvelteKit 2",
      "Svelte 5 (runes)",
      "TypeScript (strict)",
    ],
  },
  {
    label: "Styling & UI",
    items: ["Tailwind CSS v4", "Bits UI", "GSAP"],
  },
  {
    label: "Database & ORM",
    items: [
      "Neon PostgreSQL",
      "pgvector (cosine similarity)",
      "Drizzle ORM",
      "drizzle-kit (migrations)",
    ],
  },
  {
    label: "AI & Retrieval",
    items: [
      "OpenRouter (LLM + embeddings)",
      "Gemini 2.0 Flash (streaming chat)",
      "text-embedding-3-small (1536-dim vectors)",
      "Hybrid semantic/lexical fusion",
      "Confidence-tiered RAG fallbacks",
    ],
  },
  {
    label: "Auth & Storage",
    items: [
      "Auth.js + GitHub OAuth",
      "Railway Storage Buckets (private, S3-compatible)",
      "Presigned URL upload and delivery",
    ],
  },
  {
    label: "Runtime & Tooling",
    items: [
      "Bun HTTP server",
      "Railway (auto-deploy on push)",
      "@sveltejs/adapter-node",
      "Vitest + svelte-check + ESLint",
    ],
  },
];

type Section = "overview" | "about" | "stack" | "links";

const NAV: { id: Section; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Live app" },
  { id: "about", label: "About", sub: "Case study" },
  { id: "stack", label: "Tech Stack", sub: "Architecture" },
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
                    <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Admin: GitHub OAuth
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] text-label-secondary">
                    <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Personal project
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <p>
                    Glass Atlas is a SvelteKit editorial knowledge site built for
                    a single author to publish long-form notes and let visitors
                    interrogate them through an LLM-powered chat interface. The
                    primary design constraint: every chat response must be grounded
                    exclusively in the author&apos;s published notes — the system
                    cannot fabricate answers from general knowledge.
                  </p>
                  <p>
                    The engineering problem it solves is making a personal
                    knowledge base conversational. A recruiter or engineer can ask
                    &ldquo;What does this person know about CI/CD?&rdquo; and receive
                    a streaming answer sourced from real, linked notes rather than
                    a generic bio summary. Notes are authored in markdown with
                    Obsidian-style <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">[[wiki-link]]</code> syntax,
                    which builds a relationship graph between notes automatically.
                  </p>
                  <p>
                    The admin workspace is a split-pane CodeMirror 6 editor with
                    live markdown preview, <code className="rounded bg-chrome px-1 py-0.5 text-[13px]">[[slug]]</code>{" "}
                    autocomplete, and an optional streaming AI critique pass before
                    publish. GitHub OAuth with a single-account allowlist gates all
                    admin routes — server-side, no client guards.
                  </p>
                  <p className="text-label-secondary">
                    Deployed as a persistent Bun HTTP server on Railway with
                    auto-deploy on push to{" "}
                    <code className="rounded bg-chrome px-1 py-0.5 text-[12px]">main</code>.
                    Neon PostgreSQL stores notes, wiki-link edges, chunk
                    embeddings, and anonymous chat rate-limit state. First-party
                    media uploads go to private Railway Storage Buckets delivered
                    via presigned URLs — no permanent public bucket URLs are
                    assumed.
                  </p>
                </div>

                <section className="mt-8">
                  <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                    Engineering Highlights
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {[
                      "Hybrid retrieval: pgvector chunk-level cosine search fused with lexical ILIKE matching; semantic and lexical branches run in parallel via Promise.all.",
                      "Confidence tiers gate the LLM path: high-confidence evidence gets a grounded answer, borderline evidence gets an explicitly scoped limited-coverage response, and low-confidence retrieval returns a deterministic no-LLM fallback.",
                      "Write-time embeddings only — note and chunk vectors are generated on save, not at query time. The sole real-time embedding call is the query vector in POST /api/chat.",
                      "Section-aware chunking: note bodies are split into section/paragraph chunks with title and tag metadata baked into each embedding payload for richer retrieval signals.",
                      "Anonymous rate limiting: chat is capped at 10 messages/hour per browser session using an opaque cookie and a server-side hash — no PII stored.",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-[13px]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {active === "stack" && (
              <>
                <p className="text-[13px] text-label-secondary">
                  glass_atlas / Tech Stack
                </p>
                <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

                {/* RAG architecture diagram */}
                <div className="mt-6 overflow-hidden rounded-lg border border-glass-edge bg-chrome">
                  <Image
                    src="/Glass-Atlas/Glass-Atlas RAG diagram.png"
                    alt="Glass Atlas RAG pipeline diagram"
                    width={912}
                    height={1427}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
                <p className="mt-2 text-center text-[11px] text-label-secondary">
                  RAG pipeline: query embedding → hybrid retrieval → confidence
                  gating → streaming LLM response
                </p>

                {/* Stack groups */}
                <div className="mt-6 space-y-3">
                  {STACK_GROUPS.map((group) => (
                    <section
                      key={group.label}
                      className="rounded-lg border border-glass-edge bg-chrome p-4"
                    >
                      <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                        {group.label}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2">
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

                {/* Architecture constraints */}
                <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                  <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                    Architecture Rules
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {[
                      "All external I/O (DB queries, LLM calls, embeddings) stays server-side in src/lib/server/ — client components hold no credentials.",
                      "Chat streams via ReadableStream/SSE — responses are never buffered as JSON.",
                      "The system prompt personality lives in a single server-side file and is never inlined elsewhere.",
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
                  glass_atlas / Links
                </p>
                <h1 className="mt-1 text-[22px] font-semibold">Resources</h1>

                <div className="mt-6 space-y-3">
                  {/* Live app */}
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

                  {/* GitHub repo */}
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
                        github.com/AG9898/Glass-Atlas
                      </p>
                    </div>
                  </a>
                </div>

                {/* Notes on access */}
                <div className="mt-6 rounded-lg border border-glass-edge bg-chrome p-4">
                  <p className="text-[13px] font-medium">Notes on access</p>
                  <p className="mt-1 text-[13px] text-label-secondary">
                    The public app and the GitHub repository are open. The admin
                    authoring workspace at{" "}
                    <code className="rounded bg-window px-1 py-0.5 text-[12px]">
                      /admin
                    </code>{" "}
                    requires GitHub OAuth and is restricted to a single
                    allowlisted account.
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
