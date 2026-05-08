import type { ReactNode } from "react";

const HOME_NOTES = [
  {
    title: "Start Here",
    meta: "Portfolio desktop",
    active: true,
  },
  {
    title: "Current Stack",
    meta: "Next.js, TypeScript",
    active: false,
  },
  {
    title: "What To Open",
    meta: "Projects, About, CV",
    active: false,
  },
];

const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind",
  "framer-motion",
  "react-rnd",
  "next-themes",
];

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

export default function Home() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-48 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 sm:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          Notes
        </div>
        <div className="space-y-1">
          {HOME_NOTES.map((note) => (
            <div
              key={note.title}
              className={`rounded-lg px-3 py-2 ${
                note.active
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <div className="truncate text-[13px] font-medium">
                {note.title}
              </div>
              <div
                className={`truncate text-[11px] ${
                  note.active ? "text-label-primary" : "text-label-secondary"
                }`}
              >
                {note.meta}
              </div>
            </div>
          ))}
        </div>
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

        <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
          <p className="text-[13px] text-label-secondary">
            ~/home/aden - last edited today
          </p>
          <h1 className="mt-1 text-[22px] font-semibold">
            hi, I&apos;m Aden Guo.
          </h1>

          <div className="mt-6 space-y-4 text-label-primary">
            <p>
              I build frontend interfaces that feel deliberate: fast feedback,
              clear information hierarchy, motion that explains state changes,
              and copy that sounds like a person wrote it.
            </p>
            <p>
              This portfolio is a desktop. Open projects/ to scan the work,
              about_me.txt for the longer note, contact.msg to get in touch, or
              aden_guo_cv.pdf to view the carried-forward CV asset.
            </p>
            <p className="text-label-secondary">
              The shell is built in Next.js with a persistent App Router layout,
              a reducer-backed window manager, draggable and resizable windows,
              dock restore behavior, route sync, and reduced-motion aware
              transitions.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-full border border-glass-edge bg-chrome px-2.5 py-1 text-[11px] text-label-secondary"
              >
                {item}
              </span>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
