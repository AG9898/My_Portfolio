import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const PDF_URL = "/cv.pdf";

export default function CV() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-40 shrink-0 border-r border-glass-edge bg-chrome/70 p-3 md:block">
        <div className="mb-3 text-[11px] font-medium uppercase text-label-secondary">
          Preview
        </div>
        <div className="rounded-lg border border-glass-edge bg-window p-2 shadow-[0_8px_28px_rgba(0,0,0,0.2)]">
          <div className="aspect-[8.5/11] rounded border border-glass-edge bg-[#f5f5f7] p-2">
            <div className="h-2 w-16 rounded-sm bg-[#d1d1d6]" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded-sm bg-[#aeaeb2]" />
              <div className="h-1.5 rounded-sm bg-[#c7c7cc]" />
              <div className="h-1.5 w-3/4 rounded-sm bg-[#c7c7cc]" />
            </div>
            <div className="mt-4 h-10 rounded-sm border border-[#d1d1d6]" />
            <div className="mt-4 space-y-1.5">
              <div className="h-1.5 rounded-sm bg-[#c7c7cc]" />
              <div className="h-1.5 rounded-sm bg-[#c7c7cc]" />
              <div className="h-1.5 w-2/3 rounded-sm bg-[#c7c7cc]" />
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-[12px] text-label-secondary">
          1 page
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
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

        <section className="min-h-0 flex-1 overflow-auto bg-[#2c2c2e] p-3 sm:p-5">
          <div className="mx-auto h-full min-h-[520px] max-w-4xl overflow-hidden rounded-lg border border-glass-edge bg-[#1c1c1e] shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
            <iframe
              title="Aden Guo CV"
              src={`${PDF_URL}#toolbar=0&navpanes=0`}
              className="h-full min-h-[520px] w-full bg-white"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
