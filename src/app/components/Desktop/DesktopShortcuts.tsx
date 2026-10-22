"use client";

// ─── Desktop Shortcuts Sidebar ────────────────────────────────────────────────
// Left-column sidebar of file-type shortcut icons, PostHog-style.
// Positioned 16px from left, 48px from top (clears menu bar).
// Each icon fills a 56×56px slot; labels are 11px system font below.
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
//   project apps → the project's macOS-style app icon (public/app-icons/)
//
// Shared appMetadata (APPS) is the single source of truth for labels/routes.

import Image from "next/image";
import { APPS, type AppId } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";
import { getCenteredWindowPositionForViewport } from "../WindowManager/windowGeometry";
import { useDesktop } from "./DesktopProvider";

// ─── Icon labels — file-system metaphors matching macos-redesign.md ───────────
export const ICON_LABELS: Partial<Record<AppId, string>> = {
  home:           "Home",
  projects:       "projects/",
  about:          "about_me.txt",
  contact:        "contact.msg",
  cv:             "aden_guo_cv.pdf",
  "glass-atlas":  "glass_atlas/",
  weather:        "weather.dash",
  pigeoncoop:     "pigeoncoop.app",
  buddy:          "buddy.cli",
  bfr:            "bfr.game",
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

// ─── Project app icons ────────────────────────────────────────────────────────
// Project shortcuts are app aliases, so they show the same macOS-style app icon
// as the Projects Finder (public/app-icons/). The tile is drawn slightly inside
// the 56px slot so its visual weight matches the document icons.
const APP_ICON_SRC: Partial<Record<AppId, string>> = {
  "glass-atlas": "/app-icons/glass-atlas.webp",
  weather:       "/app-icons/weather-wellness.webp",
  pigeoncoop:    "/app-icons/pigeoncoop.webp",
  buddy:         "/app-icons/buddy.webp",
  bfr:           "/app-icons/bfr.webp",
};

function AppIcon({ appId }: { appId: AppId }) {
  const src = APP_ICON_SRC[appId];
  if (!src) return null;
  return (
    <span className="flex h-14 w-14 items-center justify-center" aria-hidden="true">
      <Image
        src={src}
        alt=""
        width={50}
        height={50}
        draggable={false}
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
      />
    </span>
  );
}

// ─── Icon dispatcher ──────────────────────────────────────────────────────────

export function ShortcutFileIcon({ appId }: { appId: AppId }) {
  switch (appId) {
    case "home":        return <TxtIcon />;
    case "projects":    return <FolderIcon />;
    case "about":       return <PersonIcon />;
    case "contact":     return <MsgIcon />;
    case "cv":          return <PdfIcon />;
    case "glass-atlas":
    case "weather":
    case "pigeoncoop":
    case "buddy":
    case "bfr":
      return <AppIcon appId={appId} />;
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
  onContextMenu: (e: React.MouseEvent) => void;
}

function DesktopShortcutItem({
  appId,
  label,
  selected,
  onSelect,
  onOpen,
  onContextMenu,
}: DesktopShortcutItemProps) {
  return (
    <button
      data-window-animation-target={appId}
      data-window-target-priority="desktop"
      data-desktop-icon
      data-app-id={appId}
      className="flex flex-col items-center w-[88px] py-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        background: selected ? "rgba(10,132,255,0.28)" : "transparent",
        border: selected
          ? "1px solid rgba(10,132,255,0.55)"
          : "1px solid transparent",
      }}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
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
  const { dispatch } = useWindowManager();
  const {
    isSelected,
    selectOnly,
    clearSelection,
    openMenu,
    openInfo,
  } = useDesktop();

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

  function handleContextMenu(e: React.MouseEvent, id: AppId) {
    e.preventDefault();
    e.stopPropagation();
    selectOnly(id);
    openMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { type: "item", label: "Open", onSelect: () => handleOpen(id) },
        { type: "separator" },
        { type: "item", label: "Get Info", onSelect: () => openInfo(id) },
      ],
    });
  }

  return (
    <div
      className="absolute z-10 flex flex-col gap-3"
      style={{ left: 16, top: 48 }}
      aria-label="Desktop shortcuts"
      // Deselect when clicking empty area within the sidebar container
      onClick={(e) => {
        if (e.target === e.currentTarget) clearSelection();
      }}
    >
      {APPS.filter((app) => app.showInDock === false).map((app) => (
        <DesktopShortcutItem
          key={app.id}
          appId={app.id}
          label={ICON_LABELS[app.id] ?? app.label}
          selected={isSelected(app.id)}
          onSelect={() => selectOnly(app.id)}
          onOpen={() => handleOpen(app.id)}
          onContextMenu={(e) => handleContextMenu(e, app.id)}
        />
      ))}
    </div>
  );
}
