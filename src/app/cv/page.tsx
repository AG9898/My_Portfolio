"use client";

import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import ResumeRenderer from "@/app/components/CV/ResumeRenderer";

const PDF_URL = "/cv.pdf";
const SECTION_NAV = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
] as const;

export default function CV() {
  const isPrintMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("print") === "1";

  useEffect(() => {
    if (!isPrintMode) return;

    document.body.classList.add("cv-print-mode");
    return () => {
      document.body.classList.remove("cv-print-mode");
    };
  }, [isPrintMode]);

  if (isPrintMode) {
    return (
      <section
        data-cv-print-view="true"
        data-cv-print-ready="true"
        className="bg-white p-4 sm:p-6"
      >
        <ResumeRenderer />
      </section>
    );
  }

  const scrollToSection = (id: (typeof SECTION_NAV)[number]["id"]) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-full min-h-0 bg-window text-label-primary">
      <aside className="hidden w-40 shrink-0 border-r border-glass-edge bg-chrome/70 p-3 md:block">
        <div className="mb-3 text-[11px] font-medium uppercase text-label-secondary">
          Sections
        </div>
        <div className="rounded-lg border border-glass-edge bg-window p-2 shadow-[0_8px_28px_rgba(0,0,0,0.2)]">
          <nav aria-label="CV sections" className="space-y-1">
            {SECTION_NAV.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="w-full rounded-md px-2 py-1.5 text-left text-[12px] text-label-secondary transition hover:bg-[var(--color-control-hover)] hover:text-label-primary focus-visible:ring-2 focus-visible:ring-accent"
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="glass-chrome flex h-10 shrink-0 items-center gap-1 border-b border-glass-edge px-3">
          <div className="flex h-7 items-center rounded-md border border-glass-edge bg-window">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-label-secondary hover:bg-[var(--color-control-hover)]"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="h-4 w-px bg-glass-edge" />
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-label-secondary hover:bg-[var(--color-control-hover)]"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="ml-2 flex h-7 items-center rounded-md border border-glass-edge bg-window">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-label-secondary hover:bg-[var(--color-control-hover)]"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="h-4 w-px bg-glass-edge" />
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-label-secondary hover:bg-[var(--color-control-hover)]"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="ml-auto hidden h-7 w-full max-w-44 items-center gap-2 rounded-md border border-glass-edge bg-window px-2 text-[12px] text-label-secondary sm:flex">
            <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Aden Guo CV</span>
          </div>

          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md text-label-secondary hover:bg-[var(--color-control-hover)]"
            aria-label="Open CV in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={PDF_URL}
            download
            className="flex h-7 w-7 items-center justify-center rounded-md text-label-secondary hover:bg-[var(--color-control-hover)]"
            aria-label="Download CV"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <section className="min-h-0 flex-1 overflow-auto bg-chrome p-3 sm:p-5">
          <ResumeRenderer />
        </section>
      </main>
    </div>
  );
}
