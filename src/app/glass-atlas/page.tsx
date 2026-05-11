"use client";

import { ExternalLink } from "lucide-react";

const APP_URL = "https://glass-atlas-production.up.railway.app";

export default function GlassAtlas() {
  return (
    <div className="flex h-full flex-col bg-window text-label-primary">
      {/* Toolbar */}
      <div className="glass-chrome flex h-10 shrink-0 items-center gap-2 border-b border-glass-edge px-3">
        <span className="text-[12px] font-medium text-label-secondary truncate">
          {APP_URL}
        </span>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-label-secondary hover:bg-[var(--color-control-hover)]"
          aria-label="Open Glass Atlas in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* iframe content area */}
      <div className="relative min-h-0 flex-1">
        <iframe
          title="Glass Atlas"
          src={APP_URL}
          className="h-full w-full border-0 bg-window"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
        />

        {/* Fallback overlay — only visible when iframe fails to load */}
        <noscript>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-window">
            <p className="text-[13px] text-label-secondary">
              This project could not be loaded inside the window.
            </p>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-glass-edge bg-chrome px-4 py-2 text-[13px] font-medium text-label-primary hover:bg-[var(--color-control-hover)]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open Glass Atlas
            </a>
          </div>
        </noscript>
      </div>

      {/* Visible open-in-new-tab fallback footer for when embedding is blocked */}
      <div className="glass-chrome flex shrink-0 items-center justify-center gap-2 border-t border-glass-edge px-4 py-2">
        <p className="text-[11px] text-label-secondary">
          If the app does not load above, it may block iframe embedding.
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md border border-glass-edge bg-window px-3 py-1 text-[11px] font-medium text-label-primary hover:bg-[var(--color-control-hover)]"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Open in new tab
        </a>
      </div>
    </div>
  );
}
