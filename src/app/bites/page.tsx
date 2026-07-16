"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock, Smartphone, User, GitFork, ShieldCheck, X } from "lucide-react";

import {
  BITES_NAV,
  BITES_LABEL,
  BITES_STATUS,
  BITES_OVERVIEW,
  BITES_SCREENSHOTS,
  BITES_FEATURES,
  BITES_STACK_GROUPS,
  BITES_ARCHITECTURE_NOTES,
  BITES_WORKFLOW,
  BITES_ACCESS,
  BITES_IMAGE_DIMS,
  type BitesSection,
} from "./bitesData";

type Lightbox = { src: string; alt: string; zoomed: boolean };

/** SVG assets bypass the image optimizer (dangerouslyAllowSVG is not enabled). */
const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

const dimsFor = (src: string) =>
  BITES_IMAGE_DIMS[src] ?? { width: 1200, height: 800 };

export default function Bites() {
  const [active, setActive] = useState<BitesSection>("overview");
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
          {BITES_LABEL}
        </div>
        <div className="space-y-1">
          {BITES_NAV.map((item) => (
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
                {BITES_LABEL} / Overview
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">
                {BITES_OVERVIEW.title}
              </h1>
              <p className="mt-2 text-[14px] text-label-secondary">
                {BITES_OVERVIEW.tagline}
              </p>

              {/* Status and meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {BITES_STATUS.map((chip) => (
                  <span
                    key={chip.label}
                    className={`flex items-center gap-1.5 rounded-full border border-glass-edge bg-chrome px-3 py-1 text-[11px] ${
                      chip.tone === "private"
                        ? "font-medium text-label-primary"
                        : "text-label-secondary"
                    }`}
                  >
                    {chip.tone === "private" ? (
                      <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-system-green" />
                    )}
                    {chip.label}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                {BITES_OVERVIEW.paragraphs.map((para, i) => (
                  <p key={i} className={i === 0 ? "" : "text-label-secondary"}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Screenshots — 2-column grid, all four surfaces */}
              <section className="mt-8">
                <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
                  Screenshots
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {BITES_SCREENSHOTS.map((shot) => (
                    <figure key={shot.src} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => openLightbox(shot.src, shot.alt)}
                        className="block w-full cursor-pointer overflow-hidden rounded-lg border border-glass-edge bg-chrome"
                        aria-label={`Enlarge screenshot: ${shot.caption}`}
                      >
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </button>
                      <figcaption className="mt-1.5 text-[12px] text-label-secondary">
                        {shot.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            </>
          )}

          {active === "features" && (
            <>
              <p className="text-[13px] text-label-secondary">
                {BITES_LABEL} / Features
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Features</h1>

              <ul className="mt-6 space-y-4">
                {BITES_FEATURES.map((feature) => (
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
                            {feature.images.map((src) => {
                              const dims = dimsFor(src);
                              return (
                                <button
                                  key={src}
                                  type="button"
                                  onClick={() => openLightbox(src, feature.title)}
                                  className="block cursor-pointer overflow-hidden rounded-md border border-glass-edge"
                                  aria-label={`Enlarge image for ${feature.title}`}
                                >
                                  <Image
                                    src={src}
                                    alt={feature.title}
                                    width={dims.width}
                                    height={dims.height}
                                    style={{ width: "100%", height: "auto" }}
                                  />
                                </button>
                              );
                            })}
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
                {BITES_LABEL} / Tech Stack
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Tech Stack</h1>

              <div className="mt-6 space-y-3">
                {BITES_STACK_GROUPS.map((group) => (
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
                  {BITES_ARCHITECTURE_NOTES.map((rule) => (
                    <li key={rule} className="flex gap-3 text-[13px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-label-secondary" />
                      <span className="text-label-secondary">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Import-to-map workflow diagram (lightbox-capable) */}
              <section className="mt-4 rounded-lg border border-glass-edge bg-chrome p-4">
                <h2 className="text-[11px] font-semibold uppercase text-label-secondary">
                  Import-to-map workflow
                </h2>
                <p className="mt-2 text-[13px] text-label-secondary">
                  {BITES_WORKFLOW.caption}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(BITES_WORKFLOW.src, BITES_WORKFLOW.alt)
                  }
                  className="mt-3 block max-h-[420px] w-full cursor-pointer overflow-y-auto overflow-x-hidden rounded-lg border border-glass-edge bg-window"
                  aria-label="Enlarge the Bites import-to-map workflow diagram"
                >
                  <Image
                    src={BITES_WORKFLOW.src}
                    alt={BITES_WORKFLOW.alt}
                    width={BITES_WORKFLOW.width}
                    height={BITES_WORKFLOW.height}
                    unoptimized={isSvg(BITES_WORKFLOW.src)}
                    style={{ width: "100%", height: "auto" }}
                  />
                </button>
              </section>
            </>
          )}

          {active === "links" && (
            <>
              <p className="text-[13px] text-label-secondary">
                {BITES_LABEL} / Links
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">Links</h1>

              {/* Private-access summary card — no anchors, URLs, or actions */}
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                <Lock
                  className="mt-0.5 h-5 w-5 shrink-0 text-label-secondary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{BITES_ACCESS.title}</p>
                  <p className="mt-1 text-[13px] text-label-secondary">
                    {BITES_ACCESS.body}
                  </p>
                </div>
              </div>

              {/* Private application + repository notice cards (static, no links) */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                  <Smartphone
                    className="mt-0.5 h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      Application — private
                    </p>
                    <p className="mt-0.5 text-[12px] text-label-secondary">
                      Owner-authenticated PWA. No public URL is available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-glass-edge bg-chrome p-4">
                  <GitFork
                    className="mt-0.5 h-5 w-5 shrink-0 text-label-secondary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      Repository — private
                    </p>
                    <p className="mt-0.5 text-[12px] text-label-secondary">
                      Source is private and not linked from this portfolio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clarifying access points */}
              <ul className="mt-4 space-y-2">
                {BITES_ACCESS.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[13px]">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-label-secondary"
                      aria-hidden="true"
                    />
                    <span className="text-label-secondary">{point}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-center gap-2 text-[12px] text-label-secondary">
                <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Single-owner project — access is available on request.
              </p>
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
            width={dimsFor(lightbox.src).width}
            height={dimsFor(lightbox.src).height}
            unoptimized={isSvg(lightbox.src)}
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
