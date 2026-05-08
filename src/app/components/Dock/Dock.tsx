"use client";

// ─── Dock ─────────────────────────────────────────────────────────────────────
// Uses .glass-dock from globals.css.
// Icon designs match the design handoff reference:
//   reference/design draft/design_handoff_macos_desktop_shell/desktop.jsx

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { APPS, type AppId } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";

// ─── Individual dock icon SVGs ─────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70%" height="70%" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0a0a18" />
      <path d="M14 32 L32 14 L50 32 V50 H38 V38 H26 V50 H14 Z" fill="#34C759" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70%" height="70%" aria-hidden="true">
      <defs>
        <linearGradient id="dockFolderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7CC2FF" />
          <stop offset="100%" stopColor="#3A8DDB" />
        </linearGradient>
      </defs>
      <path d="M4 18 H24 L30 24 H60 V52 Q60 56 56 56 H8 Q4 56 4 52 Z" fill="#2D6FB8" />
      <path d="M4 26 H60 V52 Q60 56 56 56 H8 Q4 56 4 52 Z" fill="url(#dockFolderGrad)" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70%" height="70%" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#FFEFB0" />
      <rect x="0" y="0" width="64" height="14" rx="14" fill="#FFD86B" />
      <rect x="0" y="7" width="64" height="7" fill="#FFD86B" />
      <g stroke="#C9A24B" strokeWidth="1.5">
        <line x1="10" y1="26" x2="54" y2="26" />
        <line x1="10" y1="34" x2="54" y2="34" />
        <line x1="10" y1="42" x2="44" y2="42" />
        <line x1="10" y1="50" x2="50" y2="50" />
      </g>
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70%" height="70%" aria-hidden="true">
      <defs>
        <linearGradient id="dockMailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BC1FF" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#dockMailGrad)" />
      <rect x="10" y="18" width="44" height="28" rx="3" fill="white" />
      <path d="M10 20 L32 36 L54 20" fill="none" stroke="#0A84FF" strokeWidth="2.5" />
    </svg>
  );
}

function CVIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70%" height="70%" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1c1c1e" />
      <circle cx="28" cy="28" r="14" fill="none" stroke="#FF3B30" strokeWidth="4" />
      <line x1="38" y1="38" x2="50" y2="50" stroke="#FF3B30" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function DockIconGlyph({ appId }: { appId: AppId }) {
  switch (appId) {
    case "home":
      return <HomeIcon />;
    case "projects":
      return <ProjectsIcon />;
    case "about":
      return <AboutIcon />;
    case "contact":
      return <ContactIcon />;
    case "cv":
      return <CVIcon />;
    default:
      return null;
  }
}

const DOCK_BASE_SIZE = 56;
const DOCK_MAX_SIZE = 86;
const DOCK_RADIUS = 100;
const DOCK_MAX_LIFT = -8;
const DOCK_SPRING = { stiffness: 600, damping: 35, duration: 0.22 };
const TOOLTIP_RADIUS = 30;

function getFalloff(mouseX: number, centerX: number) {
  const dist = Math.abs(mouseX - centerX);
  if (!Number.isFinite(mouseX) || dist >= DOCK_RADIUS) {
    return 0;
  }

  const f = 1 - dist / DOCK_RADIUS;
  return Math.cos((1 - f) * Math.PI / 2);
}

interface DockItemProps {
  app: (typeof APPS)[number];
  mouseX: MotionValue<number>;
  isOpen: boolean;
  onClick: (appId: AppId) => void;
}

function DockItem({ app, mouseX, isOpen, onClick }: DockItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const sizeTransform = useTransform(mouseX, (latest) => {
    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return DOCK_BASE_SIZE;

    const eased = getFalloff(latest, bounds.left + bounds.width / 2);
    return DOCK_BASE_SIZE + (DOCK_MAX_SIZE - DOCK_BASE_SIZE) * eased;
  });
  const liftTransform = useTransform(mouseX, (latest) => {
    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return 0;

    return DOCK_MAX_LIFT * getFalloff(latest, bounds.left + bounds.width / 2);
  });
  const tooltipOpacityTransform = useTransform<number, number>(
    mouseX,
    (latest) => {
      const bounds = itemRef.current?.getBoundingClientRect();
      if (!bounds) return 0;

      const dist = Math.abs(latest - (bounds.left + bounds.width / 2));
      return Number.isFinite(latest) && dist <= TOOLTIP_RADIUS ? 1 : 0;
    }
  );

  const size = useSpring(sizeTransform, DOCK_SPRING);
  const y = useSpring(liftTransform, DOCK_SPRING);
  const tooltipOpacity = useSpring(tooltipOpacityTransform, DOCK_SPRING);

  return (
    <div
      ref={itemRef}
      className="relative flex flex-col items-center"
      style={{ width: DOCK_BASE_SIZE }}
    >
      <motion.span
        className="glass-chrome pointer-events-none absolute bottom-[74px] max-w-[120px] truncate rounded-md border border-glass-edge px-2 py-1 text-[11px] text-label-primary shadow-lg"
        style={{ opacity: tooltipOpacity, y }}
        aria-hidden="true"
      >
        {app.label}
      </motion.span>
      <motion.button
        className="relative flex items-center justify-center rounded-[18px] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          width: size,
          height: size,
          y,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
        }}
        transition={DOCK_SPRING}
        aria-label={app.label}
        onClick={() => onClick(app.id)}
      >
        <DockIconGlyph appId={app.id} />
      </motion.button>
      <div
        className="mt-0.5 rounded-full bg-label-primary"
        style={{
          width: 4,
          height: 4,
          opacity: isOpen ? 0.9 : 0,
        }}
      />
    </div>
  );
}

// ─── Dock ──────────────────────────────────────────────────────────────────────

export default function Dock() {
  const { state, dispatch } = useWindowManager();
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  function handleAppClick(appId: AppId) {
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;
    dispatch({
      type: "open",
      payload: {
        id: app.id,
        route: app.route,
        defaultSize: app.defaultSize,
        defaultPosition: app.defaultPosition,
      },
    });
  }

  return (
    <div
      className="absolute bottom-3 left-0 right-0 flex justify-center z-40 pointer-events-none"
      aria-label="Dock"
    >
      <nav
        className="glass-dock pointer-events-auto flex items-end gap-2 px-3 pt-2 pb-2 rounded-[22px]"
        style={{
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2), 0 30px 80px rgba(0,0,0,0.5)",
        }}
        aria-label="App shortcuts"
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      >
        {APPS.map((app) => {
          const isOpen = state.openWindows.some(
            (window) => window.id === app.id && !window.minimized
          );

          return (
            <DockItem
              key={app.id}
              app={app}
              mouseX={mouseX}
              isOpen={isOpen}
              onClick={handleAppClick}
            />
          );
        })}
      </nav>
    </div>
  );
}
