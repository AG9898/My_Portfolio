"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileText, FolderOpen, Mail, User } from "lucide-react";

import { APPS, type AppId } from "./components/appMetadata";
import { useWindowManager } from "./components/WindowManager/WindowManagerProvider";
import { getCenteredWindowPositionForViewport } from "./components/WindowManager/windowGeometry";

// ─── Content ──────────────────────────────────────────────────────────────────

type SectionId = "intro" | "stack" | "open";

const NAV: { id: SectionId; title: string; meta: string }[] = [
  { id: "intro", title: "Intro", meta: "Start here" },
  { id: "stack", title: "Stack", meta: "What I build with" },
  { id: "open", title: "Open", meta: "Launch an app" },
];

const STACK_GROUPS: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "TypeScript", "Go", "Rust", "SQL"] },
  { label: "Web & Frameworks", items: ["React", "Next.js", "SvelteKit", "Node.js", "FastAPI"] },
  { label: "AI & LLM", items: ["Claude API", "Vercel AI SDK", "RAG", "pgvector"] },
  { label: "Data & Infra", items: ["PostgreSQL", "Docker", "Azure", "Vercel", "CI/CD"] },
  { label: "GIS & Spatial", items: ["ArcGIS", "QGIS", "PostGIS", "GeoPandas", "GDAL"] },
];

const QUICK_LAUNCH: { id: AppId; label: string; meta: string; Icon: typeof FolderOpen }[] = [
  { id: "projects", label: "Projects", meta: "Scan the work", Icon: FolderOpen },
  { id: "about", label: "About", meta: "The longer note", Icon: User },
  { id: "cv", label: "CV", meta: "Full résumé", Icon: FileText },
  { id: "contact", label: "Contact", meta: "Reach me", Icon: Mail },
];

// ─── Toolbar (decorative editor chrome) ─────────────────────────────────────────

function ToolbarButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] text-label-primary hover:bg-[var(--color-control-hover)] ${className}`}
      aria-hidden="true"
      tabIndex={-1}
    >
      {children}
    </button>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const { dispatch } = useWindowManager();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    intro: null,
    stack: null,
    open: null,
  });
  const [activeSection, setActiveSection] = useState<SectionId>("intro");

  function openApp(id: AppId) {
    const app = APPS.find((candidate) => candidate.id === id);
    if (!app) return;
    dispatch({
      type: "open",
      payload: {
        id: app.id,
        route: app.route,
        defaultSize: app.defaultSize,
        defaultPosition: getCenteredWindowPositionForViewport(app.defaultSize),
      },
    });
  }

  function scrollToSection(id: SectionId) {
    const target = sectionRefs.current[id];
    const container = scrollRef.current;
    if (!target || !container) return;
    container.scrollTo({ top: target.offsetTop - 16, behavior: "smooth" });
    setActiveSection(id);
  }

  // Highlight the nav item for the section currently at the top of the scroller.
  // A scroll handler is more reliable than IntersectionObserver here because the
  // window can be too short for the last section to ever reach the top.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    function updateActive() {
      const el = scrollRef.current;
      if (!el) return;

      // At the bottom of the scroll, the last section is active even if it
      // never reaches the top edge.
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
        setActiveSection(NAV[NAV.length - 1].id);
        return;
      }

      const marker = el.scrollTop + 24;
      let current: SectionId = NAV[0].id;
      for (const { id } of NAV) {
        const section = sectionRefs.current[id];
        if (section && section.offsetTop <= marker) {
          current = id;
        }
      }
      setActiveSection(current);
    }

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });
    return () => container.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <div className="flex h-full bg-window text-label-primary">
      <aside className="hidden w-48 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 sm:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-label-secondary">
          Notes
        </div>
        <nav className="space-y-1">
          {NAV.map((note) => {
            const active = note.id === activeSection;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => scrollToSection(note.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left transition-colors ${
                  active
                    ? "bg-accent text-label-primary"
                    : "text-label-secondary hover:bg-[var(--color-control-hover)]"
                }`}
              >
                <div className="truncate text-[13px] font-medium">{note.title}</div>
                <div
                  className={`truncate text-[11px] ${
                    active ? "text-label-primary" : "text-label-secondary"
                  }`}
                >
                  {note.meta}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="glass-chrome flex h-10 shrink-0 items-center gap-1 border-b border-glass-edge px-3">
          <ToolbarButton className="font-bold">B</ToolbarButton>
          <ToolbarButton className="italic">I</ToolbarButton>
          <ToolbarButton className="underline">U</ToolbarButton>
          <div className="mx-2 h-5 w-px bg-glass-edge" />
          <ToolbarButton>p</ToolbarButton>
          <ToolbarButton>&lt;</ToolbarButton>
          <ToolbarButton>=</ToolbarButton>
          <ToolbarButton>&gt;</ToolbarButton>
          <div className="mx-2 hidden h-5 w-px bg-glass-edge sm:block" />
          <div className="hidden rounded-md border border-glass-edge bg-window px-2 py-1 text-[12px] text-label-secondary sm:block">
            SF Pro
          </div>
          <div className="hidden rounded-md border border-glass-edge bg-window px-2 py-1 text-[12px] text-label-secondary sm:block">
            15
          </div>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
            {/* Intro */}
            <section
              id="intro"
              ref={(el) => {
                sectionRefs.current.intro = el;
              }}
              className="scroll-mt-4"
            >
              <p className="text-[13px] text-label-secondary">
                ~/home/aden — last edited today
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">hi, I&apos;m Aden Guo.</h1>

              <div className="mt-6 space-y-4 text-label-primary">
                <p>
                  I&apos;m a software engineer who builds full-stack web apps, AI/LLM
                  tools, and spatial/GIS systems. Right now I&apos;m a GIS Technologist
                  at Canada West Land.
                </p>
                <p>
                  This portfolio is a desktop. Open{" "}
                  <button
                    type="button"
                    onClick={() => openApp("projects")}
                    className="font-medium text-accent underline-offset-2 hover:underline"
                  >
                    Projects
                  </button>{" "}
                  to scan the work,{" "}
                  <button
                    type="button"
                    onClick={() => openApp("about")}
                    className="font-medium text-accent underline-offset-2 hover:underline"
                  >
                    About
                  </button>{" "}
                  for the longer note,{" "}
                  <button
                    type="button"
                    onClick={() => openApp("cv")}
                    className="font-medium text-accent underline-offset-2 hover:underline"
                  >
                    CV
                  </button>{" "}
                  for the full résumé, or{" "}
                  <button
                    type="button"
                    onClick={() => openApp("contact")}
                    className="font-medium text-accent underline-offset-2 hover:underline"
                  >
                    Contact
                  </button>{" "}
                  to reach me — windows you can drag, resize, and snap.
                </p>
                <p className="text-label-secondary">
                  The shell itself is Next.js with a persistent App Router layout, a
                  reducer-backed window manager, draggable and resizable windows, dock
                  restore behavior, and reduced-motion-aware transitions.
                </p>
              </div>
            </section>

            {/* Stack */}
            <section
              id="stack"
              ref={(el) => {
                sectionRefs.current.stack = el;
              }}
              className="mt-12 scroll-mt-4"
            >
              <h2 className="text-[13px] font-medium uppercase tracking-wide text-label-secondary">
                Stack
              </h2>
              <div className="mt-4 space-y-4">
                {STACK_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="text-[12px] font-medium text-label-primary">
                      {group.label}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-glass-edge bg-chrome px-2.5 py-1 text-[11px] text-label-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Open an app */}
            <section
              id="open"
              ref={(el) => {
                sectionRefs.current.open = el;
              }}
              className="mt-12 scroll-mt-4 pb-4"
            >
              <h2 className="text-[13px] font-medium uppercase tracking-wide text-label-secondary">
                Open an app
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_LAUNCH.map(({ id, label, meta, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openApp(id)}
                    className="group flex items-center gap-3 rounded-xl border border-glass-edge bg-chrome/60 px-4 py-3 text-left transition-colors hover:bg-[var(--color-control-hover)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass-edge bg-window text-label-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-label-primary">
                        {label}
                      </span>
                      <span className="block truncate text-[12px] text-label-secondary">
                        {meta}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
