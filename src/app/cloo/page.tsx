"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import ClooWorkspaceSimulator from "./ClooWorkspaceSimulator"
import {
  CLOO_ARCHITECTURE,
  CLOO_BRAND_ASSETS,
  CLOO_FEATURES,
  CLOO_LINKS,
  CLOO_PROJECT,
  CLOO_STACK,
  CLOO_STATUS,
} from "./clooData"

const INFO_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "stack", label: "Tech Stack" },
  { id: "status", label: "Status" },
  { id: "github", label: "GitHub" },
] as const

const STATUS_ITEMS = [
  { label: "Runtime foundations", detail: CLOO_STATUS.runtime },
  { label: "Visual fidelity", detail: CLOO_STATUS.visualPass },
  { label: "Distribution", detail: CLOO_STATUS.distribution },
  { label: "Platform", detail: CLOO_STATUS.platform },
] as const

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ClooPage() {
  const reduceMotion = useReducedMotion() ?? false
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const infoPanelRef = useRef<HTMLElement>(null)
  const infoButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isInfoOpen) return

    const previousFocus = document.activeElement as HTMLElement | null
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        setIsInfoOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const focusable = Array.from(
        infoPanelRef.current?.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        ) ?? [],
      )
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !infoPanelRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener("keydown", handleKeyDown, true)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [isInfoOpen])

  function focusSection(sectionId: (typeof INFO_SECTIONS)[number]["id"]) {
    const heading = document.getElementById(`cloo-info-${sectionId}`)
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <main className="relative flex h-full min-h-[200px] flex-col overflow-hidden bg-cloo-frame text-cloo-text">
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-cloo-border bg-cloo-raised px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={CLOO_BRAND_ASSETS.command.src}
            alt={CLOO_BRAND_ASSETS.command.alt}
            width={26}
            height={26}
            unoptimized
            className="h-6 w-6 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-cloo-primary">
              {CLOO_PROJECT.name} · {CLOO_PROJECT.label}
            </p>
            <p className="truncate text-[10px] text-cloo-muted">
              {CLOO_PROJECT.status} · {CLOO_PROJECT.platform} · {CLOO_PROJECT.license}
            </p>
          </div>
        </div>
        <button
          ref={infoButtonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isInfoOpen}
          aria-controls="cloo-project-info"
          onClick={() => setIsInfoOpen(true)}
          className="shrink-0 rounded border border-cloo-accent bg-cloo-surface px-2.5 py-1.5 text-[11px] font-semibold text-cloo-primary hover:bg-cloo-frame focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent"
        >
          Project info
        </button>
      </header>

      <div
        className={`min-h-0 flex-1 ${isInfoOpen ? "pointer-events-none" : ""}`}
        aria-hidden={isInfoOpen}
      >
        <ClooWorkspaceSimulator />
      </div>

      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            className="absolute inset-0 z-20 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.14 }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close Project info"
              onClick={() => setIsInfoOpen(false)}
              className="absolute inset-0 cursor-default bg-cloo-frame/80"
            />
            <motion.section
              ref={infoPanelRef}
              id="cloo-project-info"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cloo-project-info-title"
              initial={reduceMotion ? false : { x: 28 }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: 28 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
              className="relative flex h-full w-[min(430px,100%)] flex-col border-l border-cloo-accent bg-cloo-surface"
            >
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-cloo-border bg-cloo-raised px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cloo-accent">
                    {CLOO_PROJECT.label} · {CLOO_PROJECT.status}
                  </p>
                  <h1
                    id="cloo-project-info-title"
                    className="truncate text-sm font-semibold text-cloo-primary"
                  >
                    {CLOO_PROJECT.name} Project info
                  </h1>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsInfoOpen(false)}
                  className="rounded border border-cloo-border bg-cloo-frame px-2.5 py-1.5 text-[11px] font-semibold text-cloo-primary hover:border-cloo-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent"
                >
                  Close
                </button>
              </header>

              <nav
                aria-label="Project info sections"
                className="flex shrink-0 gap-1 overflow-x-auto border-b border-cloo-border bg-cloo-raised px-3 py-2"
              >
                {INFO_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => focusSection(section.id)}
                    className="shrink-0 rounded border border-cloo-border bg-cloo-surface px-2 py-1 text-[10px] font-semibold text-cloo-text hover:border-cloo-accent hover:text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cloo-accent"
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-4 py-5 text-xs leading-relaxed selection:bg-cloo-accent/30 selection:text-cloo-primary">
                <section aria-labelledby="cloo-info-overview">
                  <h2
                    id="cloo-info-overview"
                    tabIndex={-1}
                    className="scroll-mt-4 text-sm font-semibold text-cloo-primary outline-none focus-visible:ring-2 focus-visible:ring-cloo-accent"
                  >
                    Overview
                  </h2>
                  <p className="mt-3 text-cloo-text">{CLOO_PROJECT.overview}</p>
                  <p className="mt-3 text-cloo-muted">{CLOO_PROJECT.audience}</p>
                  <h3 className="mt-5 font-semibold text-cloo-primary">Architecture</h3>
                  <dl className="mt-2 space-y-3">
                    {CLOO_ARCHITECTURE.map((layer) => (
                      <div key={layer.label}>
                        <dt className="font-semibold text-cloo-info">{layer.label}</dt>
                        <dd className="mt-0.5 text-cloo-text">{layer.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section aria-labelledby="cloo-info-features">
                  <h2
                    id="cloo-info-features"
                    tabIndex={-1}
                    className="scroll-mt-4 text-sm font-semibold text-cloo-primary outline-none focus-visible:ring-2 focus-visible:ring-cloo-accent"
                  >
                    Features
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {CLOO_FEATURES.map((feature) => (
                      <li key={feature.title} className="border-l-2 border-cloo-accent pl-3">
                        <h3 className="font-semibold text-cloo-primary">
                          &gt; {feature.title}
                        </h3>
                        <p className="mt-1 text-cloo-text">{feature.detail}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="cloo-info-stack">
                  <h2
                    id="cloo-info-stack"
                    tabIndex={-1}
                    className="scroll-mt-4 text-sm font-semibold text-cloo-primary outline-none focus-visible:ring-2 focus-visible:ring-cloo-accent"
                  >
                    Tech Stack
                  </h2>
                  <div className="mt-3 space-y-4">
                    {CLOO_STACK.map((group) => (
                      <section key={group.label} aria-label={group.label}>
                        <h3 className="font-semibold text-cloo-info">{group.label}</h3>
                        <ul className="mt-1 space-y-1 text-cloo-text">
                          {group.items.map((item) => (
                            <li key={item}>- {item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="cloo-info-status">
                  <h2
                    id="cloo-info-status"
                    tabIndex={-1}
                    className="scroll-mt-4 text-sm font-semibold text-cloo-primary outline-none focus-visible:ring-2 focus-visible:ring-cloo-accent"
                  >
                    Status
                  </h2>
                  <p className="mt-2 font-semibold text-cloo-warning">
                    ! {CLOO_PROJECT.status} · {CLOO_PROJECT.platform}
                  </p>
                  <dl className="mt-3 space-y-3">
                    {STATUS_ITEMS.map((item) => (
                      <div key={item.label}>
                        <dt className="font-semibold text-cloo-primary">{item.label}</dt>
                        <dd className="mt-0.5 text-cloo-text">{item.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section aria-labelledby="cloo-info-github">
                  <h2
                    id="cloo-info-github"
                    tabIndex={-1}
                    className="scroll-mt-4 text-sm font-semibold text-cloo-primary outline-none focus-visible:ring-2 focus-visible:ring-cloo-accent"
                  >
                    GitHub
                  </h2>
                  <p className="mt-2 text-cloo-text">
                    {CLOO_PROJECT.name} · {CLOO_PROJECT.license} · {CLOO_PROJECT.status}
                  </p>
                  <a
                    href={CLOO_LINKS.github.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded border border-cloo-accent bg-cloo-raised px-3 py-2 font-semibold text-cloo-info underline decoration-cloo-info/50 underline-offset-2 hover:text-cloo-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloo-accent"
                  >
                    {CLOO_LINKS.github.label}
                  </a>
                </section>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
