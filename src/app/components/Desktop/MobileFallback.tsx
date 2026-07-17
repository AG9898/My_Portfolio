"use client";

import { ExternalLink, FileText, GitBranch, Mail, Moon, Sun, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Wallpaper from "./Wallpaper";
import { PROJECTS } from "@/app/projects/projectsData";

const FEATURED_PROJECT_NAMES = [
  "Glass Atlas",
  "Weather & Wellness",
  "PigeonCoop",
  "Techy",
];

const FEATURED_PROJECTS = FEATURED_PROJECT_NAMES.flatMap((name) => {
  const project = PROJECTS.find((p) => p.name === name);
  return project ? [project] : [];
});

const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:aden.guowe@gmail.com?subject=Portfolio%20conversation",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/AG9898",
    icon: GitBranch,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/aden-guo-b39743362",
    icon: Users,
  },
];

export default function MobileFallback() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      data-mobile-fallback="true"
      className="fixed inset-0 isolate overflow-y-auto bg-desktop text-label-primary md:hidden"
      aria-label="Mobile portfolio"
    >
      <div className="fixed inset-0" aria-hidden="true">
        <Wallpaper />
        <div className="absolute inset-0 bg-desktop opacity-45" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-col gap-4 px-5 pb-10 pt-8">
        <header
          className="glass rounded-xl border border-glass-edge px-5 py-6"
          style={{
            boxShadow:
              "0 22px 70px rgba(0,0,0,0.35), inset 0 1px 0 var(--color-glass-edge)",
          }}
        >
          <h1 className="text-[24px] font-semibold leading-tight">Aden Guo</h1>
          <p className="mt-2 text-[15px] leading-6 text-label-secondary">
            Software engineer who builds full-stack web apps, AI/LLM tools, and
            spatial/GIS systems.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {CONTACT_LINKS.map((contact) => {
              const Icon = contact.icon;
              const isExternal = contact.href.startsWith("http");

              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-glass-edge text-[12px] font-medium text-label-primary"
                  style={{ background: "var(--color-control-hover)" }}
                >
                  <Icon size={14} aria-hidden="true" />
                  {contact.label}
                </a>
              );
            })}
          </div>

          <a
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 text-[13px] font-medium text-white"
            href="/cv.pdf"
          >
            <FileText size={15} aria-hidden="true" />
            Open CV
          </a>
        </header>

        <section aria-label="Featured projects" className="flex flex-col gap-3">
          <h2 className="px-1 text-[11px] font-medium uppercase tracking-wide text-label-secondary">
            Featured projects
          </h2>

          {FEATURED_PROJECTS.map((project) => (
            <article
              key={project.name}
              className="glass rounded-xl border border-glass-edge px-4 py-4"
              style={{
                boxShadow:
                  "0 14px 44px rgba(0,0,0,0.28), inset 0 1px 0 var(--color-glass-edge)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold">
                    {project.name}
                  </h3>
                  <p className="truncate text-[12px] text-label-secondary">
                    {project.kind} · {project.status}
                  </p>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} in a new tab`}
                    className="mt-0.5 shrink-0 text-label-secondary"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>

              <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-label-primary">
                {project.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-glass-edge px-2 py-0.5 text-[11px] text-label-secondary"
                    style={{ background: "var(--color-control-hover)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <p className="px-1 text-center text-[12px] leading-5 text-label-secondary">
          The full portfolio is a macOS-style desktop — open this site on a
          tablet or larger screen to explore it.
        </p>

        <button
          type="button"
          className="mx-auto flex h-9 items-center justify-center gap-2 rounded-lg border border-glass-edge px-3 text-[13px] text-label-primary"
          style={{ background: "var(--color-control-hover)" }}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          disabled={!mounted}
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? <Moon size={15} /> : <Sun size={15} />}
          {isLight ? "Dark" : "Light"}
        </button>
      </div>
    </section>
  );
}
