"use client";

// ─── Desktop Shortcuts Sidebar ────────────────────────────────────────────────
// Left-column sidebar of file-type shortcut icons, PostHog-style.
// Positioned 16px from left, 48px from top (clears menu bar).
// Each icon is 56×56px SVG; labels are 11px system font below.
//
// Interaction:
//   Single click → selected state (blue highlight + label pill)
//   Double click → open app window (wired in V1_007B; noop stub here)
//   Click empty desktop → deselects (handled in Desktop.tsx)
//
// Icon metaphors:
//   home      → txt document (generic file)
//   projects  → folder (two-tone blue)
//   about     → person silhouette
//   contact   → msg document (envelope outline)
//   cv        → pdf document
//
// Shared appMetadata (APPS) is the single source of truth for labels/routes.

import { useState } from "react";
import { APPS, type AppId } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";
import { getCenteredWindowPositionForViewport } from "../WindowManager/windowGeometry";

// ─── Icon labels — file-system metaphors matching macos-redesign.md ───────────
const ICON_LABELS: Record<AppId, string> = {
  home:           "Home",
  projects:       "projects/",
  about:          "about_me.txt",
  contact:        "contact.msg",
  cv:             "aden_guo_cv.pdf",
  "glass-atlas":  "glass_atlas/",
  techy:          "techy.app",
  sparse:         "sparse.app",
  weather:        "weather.dash",
  pigeoncoop:     "pigeoncoop.app",
};

// ─── File icon SVGs — 56×56, folded-corner document shape ────────────────────
// Document constants (re-used across txt/msg/pdf variants)
const DOC_W = 48;
const DOC_H = 60;
const FOLD = 14;
const DOC_PATH = `M0 0 H${DOC_W - FOLD} L${DOC_W} ${FOLD} V${DOC_H} H0 Z`;
const FOLD_PATH = `M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W} Z`;

function TxtIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-txt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-txt)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Content lines */}
      <g stroke="#C7C7CC" strokeWidth="1.2" strokeLinecap="round">
        <line x1="8" y1="22" x2={DOC_W - FOLD - 4} y2="22" />
        <line x1="8" y1="28" x2={DOC_W - 8} y2="28" />
        <line x1="8" y1="34" x2={DOC_W - 12} y2="34" />
        <line x1="8" y1="40" x2={DOC_W - 8} y2="40" />
      </g>
      {/* TXT badge */}
      <rect x="6" y={DOC_H - 18} width="20" height="10" rx="2" fill="#8E8E93" />
      <text
        x="16"
        y={DOC_H - 10}
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="white"
      >
        TXT
      </text>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <defs>
        <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7CC2FF" />
          <stop offset="100%" stopColor="#3A8DDB" />
        </linearGradient>
        <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5AA8E8" />
          <stop offset="100%" stopColor="#2D6FB8" />
        </linearGradient>
      </defs>
      {/* Folder back (tab + body) */}
      <path d="M4 14 H22 L26 18 H52 V46 Q52 50 48 50 H8 Q4 50 4 46 Z" fill="url(#folderBack)" />
      {/* Folder front face */}
      <path d="M4 22 H52 V46 Q52 50 48 50 H8 Q4 50 4 46 Z" fill="url(#folderGrad)" />
      {/* Top edge highlight */}
      <rect x="4" y="22" width="48" height="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-person" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-person)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Person silhouette */}
      <circle cx="24" cy="20" r="8" fill="#8E8E93" />
      <path d="M10 44 Q10 30 24 30 Q38 30 38 44 Z" fill="#8E8E93" />
    </svg>
  );
}

function MsgIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-msg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-msg)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Envelope outline */}
      <rect x="8" y="14" width="32" height="22" rx="3" fill="none" stroke="#0A84FF" strokeWidth="1.4" />
      <path d="M8 16 L24 28 L40 16" fill="none" stroke="#0A84FF" strokeWidth="1.4" />
      {/* MSG badge */}
      <rect x="6" y={DOC_H - 18} width="22" height="10" rx="2" fill="#0A84FF" />
      <text
        x="17"
        y={DOC_H - 10}
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="white"
      >
        MSG
      </text>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-pdf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-pdf)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Content lines */}
      <g stroke="#C7C7CC" strokeWidth="1.2" strokeLinecap="round">
        <line x1="8" y1="22" x2={DOC_W - FOLD - 4} y2="22" />
        <line x1="8" y1="28" x2={DOC_W - 8} y2="28" />
        <line x1="8" y1="34" x2={DOC_W - 12} y2="34" />
        <line x1="8" y1="40" x2={DOC_W - 8} y2="40" />
      </g>
      {/* PDF badge */}
      <rect x="6" y={DOC_H - 18} width="20" height="10" rx="2" fill="#FF453A" />
      <text
        x="16"
        y={DOC_H - 10}
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="white"
      >
        PDF
      </text>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-globe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-globe)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Globe */}
      <circle cx="24" cy="28" r="12" fill="none" stroke="#30B0C7" strokeWidth="1.4" />
      <ellipse cx="24" cy="28" rx="6" ry="12" fill="none" stroke="#30B0C7" strokeWidth="1" />
      <line x1="12" y1="28" x2="36" y2="28" stroke="#30B0C7" strokeWidth="1" />
      <line x1="14" y1="21" x2="34" y2="21" stroke="#30B0C7" strokeWidth="0.8" />
      <line x1="14" y1="35" x2="34" y2="35" stroke="#30B0C7" strokeWidth="0.8" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-graph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-graph)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Graph node network */}
      <circle cx="24" cy="24" r="4" fill="#5E5CE6" />
      <circle cx="12" cy="34" r="3" fill="#5E5CE6" />
      <circle cx="36" cy="34" r="3" fill="#5E5CE6" />
      <circle cx="18" cy="14" r="3" fill="#5E5CE6" />
      <line x1="24" y1="24" x2="12" y2="34" stroke="#5E5CE6" strokeWidth="1.2" />
      <line x1="24" y1="24" x2="36" y2="34" stroke="#5E5CE6" strokeWidth="1.2" />
      <line x1="24" y1="24" x2="18" y2="14" stroke="#5E5CE6" strokeWidth="1.2" />
      <line x1="12" y1="34" x2="36" y2="34" stroke="#5E5CE6" strokeWidth="0.8" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-grid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-grid)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Table / grid */}
      <rect x="8" y="14" width="32" height="28" fill="none" stroke="#34C759" strokeWidth="1.2" />
      <line x1="8" y1="21" x2="40" y2="21" stroke="#34C759" strokeWidth="1" />
      <line x1="8" y1="28" x2="40" y2="28" stroke="#34C759" strokeWidth="1" />
      <line x1="8" y1="35" x2="40" y2="35" stroke="#34C759" strokeWidth="1" />
      <line x1="19" y1="14" x2="19" y2="42" stroke="#34C759" strokeWidth="1" />
      <line x1="29" y1="14" x2="29" y2="42" stroke="#34C759" strokeWidth="1" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-cloud)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Cloud shape */}
      <path
        d="M10 36 Q10 28 18 28 Q18 20 26 20 Q34 20 36 28 Q42 28 40 36 Z"
        fill="#0A84FF"
        fillOpacity="0.7"
        stroke="#0A84FF"
        strokeWidth="1"
      />
    </svg>
  );
}

function PigeonIcon() {
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${DOC_W + 8} ${DOC_H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id="doc-pigeon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={DOC_PATH} fill="url(#doc-pigeon)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <path d={FOLD_PATH} fill="#C7C7CC" />
      <path
        d={`M${DOC_W - FOLD} 0 V${FOLD} H${DOC_W}`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      {/* Pigeon/bird silhouette in orange-amber */}
      {/* Body */}
      <ellipse cx="22" cy="32" rx="9" ry="7" fill="#FF9F0A" />
      {/* Head */}
      <circle cx="32" cy="25" r="5" fill="#FF9F0A" />
      {/* Beak */}
      <path d="M36 24 L40 25 L36 26 Z" fill="#FF9F0A" />
      {/* Tail */}
      <path d="M13 30 Q8 28 6 34 Q10 32 13 36 Z" fill="#FF9F0A" />
      {/* Wing detail */}
      <path d="M14 30 Q20 24 30 28" fill="none" stroke="#CC7700" strokeWidth="1.2" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="33" cy="24" r="1.2" fill="#1C1C1E" />
    </svg>
  );
}

// ─── Icon dispatcher ──────────────────────────────────────────────────────────

function ShortcutFileIcon({ appId }: { appId: AppId }) {
  switch (appId) {
    case "home":        return <TxtIcon />;
    case "projects":    return <FolderIcon />;
    case "about":       return <PersonIcon />;
    case "contact":     return <MsgIcon />;
    case "cv":          return <PdfIcon />;
    case "glass-atlas": return <GlobeIcon />;
    case "techy":       return <GraphIcon />;
    case "sparse":      return <GridIcon />;
    case "weather":     return <CloudIcon />;
    case "pigeoncoop":  return <PigeonIcon />;
    default:            return null;
  }
}

// ─── Single shortcut icon item ────────────────────────────────────────────────

interface DesktopShortcutItemProps {
  appId: AppId;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

function DesktopShortcutItem({
  appId,
  label,
  selected,
  onSelect,
  onOpen,
}: DesktopShortcutItemProps) {
  return (
    <button
      data-window-animation-target={appId}
      data-window-target-priority="desktop"
      className="flex flex-col items-center w-[88px] py-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        background: selected ? "rgba(10,132,255,0.28)" : "transparent",
        border: selected
          ? "1px solid rgba(10,132,255,0.55)"
          : "1px solid transparent",
      }}
      onClick={onSelect}
      onDoubleClick={onOpen}
      aria-label={label}
      aria-pressed={selected}
    >
      <ShortcutFileIcon appId={appId} />
      <span
        className={`mt-1.5 text-[11px] leading-tight px-1 rounded max-w-full truncate ${selected ? "text-white" : "text-label-primary"}`}
        style={{
          background: selected ? "rgba(10,132,255,0.95)" : "transparent",
          textShadow: selected ? "none" : "0 1px 2px rgba(0,0,0,0.7)",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ─── DesktopShortcuts — the full sidebar column ───────────────────────────────

export default function DesktopShortcuts() {
  const [selectedId, setSelectedId] = useState<AppId | null>(null);
  const { dispatch } = useWindowManager();

  function handleSelect(id: AppId) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleOpen(id: AppId) {
    const app = APPS.find((a) => a.id === id);
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

  return (
    <div
      className="absolute z-10 flex flex-col gap-3"
      style={{ left: 16, top: 48 }}
      aria-label="Desktop shortcuts"
      // Deselect when clicking empty area within the sidebar container
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {APPS.filter((app) => app.showInDock === false).map((app) => (
        <DesktopShortcutItem
          key={app.id}
          appId={app.id}
          label={ICON_LABELS[app.id]}
          selected={selectedId === app.id}
          onSelect={() => handleSelect(app.id)}
          onOpen={() => handleOpen(app.id)}
        />
      ))}
    </div>
  );
}
