"use client";

// ─── WindowRenderer ────────────────────────────────────────────────────────────
// Renders one AppWindow shell per open window entry in the window manager state.
// Sits above the wallpaper and below menu bar/dock in z-order.
// Uses react-rnd for drag and resize, dispatching state changes to the reducer.
//
// Geometry contract:
//   - Maximized windows bypass react-rnd and render as a fixed full-desktop div.
//   - Snapped windows use their geometry (set by snapLeft/snapRight actions)
//     inside react-rnd; dragging a snapped window clears the snap state via the
//     reducer's drag action.
//   - All geometry changes (drag, resize, maximize, snap, restore) go through
//     reducer actions — no local state for window bounds.

import React, { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { flushSync } from "react-dom";
import { Rnd } from "react-rnd";
import { useWindowManager } from "./WindowManagerProvider";
import { AppId } from "../appMetadata";
import { WindowChrome } from "../Window/WindowChrome";
import { SnapState } from "./windowReducer";
import { DOCK_HEIGHT, MENU_BAR_HEIGHT } from "./windowGeometry";
import HomePage from "../../page";
import ProjectsPage from "../../projects/page";
import AboutPage from "../../about/page";
import ContactPage from "../../contact/page";
import CvPage from "../../cv/page";
import GlassAtlasPage from "../../glass-atlas/page";
import TechyPage from "../../techy/page";
import SparsePage from "../../sparse/page";
import WeatherPage from "../../weather/page";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** z-index floor for app windows — above wallpaper (0) and shortcuts (10),
 *  below dock (z-40) and menu bar (z-50). */
const WINDOW_Z_BASE = 20;

type WindowExitMode = "close" | "minimize";

type WindowPresenceCustom = {
  id: AppId;
  exitModes: Partial<Record<AppId, WindowExitMode>>;
  iconProjection: WindowIconProjection | null;
  reduceMotion: boolean;
};

type ViewportRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WindowIconProjection = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  transformOrigin: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function queryAnimationTarget(id: AppId) {
  if (typeof document === "undefined") return null;

  return (
    document.querySelector<HTMLElement>(
      `[data-window-animation-target="${id}"][data-window-target-priority="dock"]`
    ) ??
    document.querySelector<HTMLElement>(
      `[data-window-animation-target="${id}"][data-window-target-priority="desktop"]`
    )
  );
}

function getIconProjection(
  id: AppId,
  windowRect: ViewportRect
): WindowIconProjection | null {
  const target = queryAnimationTarget(id);
  const targetRect = target?.getBoundingClientRect();

  if (!targetRect || windowRect.width <= 0 || windowRect.height <= 0) {
    return null;
  }

  const windowCenterX = windowRect.x + windowRect.width / 2;
  const windowCenterY = windowRect.y + windowRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  const deltaX = targetCenterX - windowCenterX;
  const deltaY = targetCenterY - windowCenterY;

  return {
    x: deltaX,
    y: deltaY,
    scaleX: clamp(targetRect.width / windowRect.width, 0.06, 0.18),
    scaleY: clamp(targetRect.height / windowRect.height, 0.05, 0.16),
    skewX: clamp(deltaX / 90, -10, 10),
    transformOrigin: deltaY >= 0 ? "50% 100%" : "50% 0%",
  };
}

const windowVariants: Variants = {
  initial: ({ iconProjection, reduceMotion }: WindowPresenceCustom) => {
    if (reduceMotion) {
      return { opacity: 0 };
    }

    if (iconProjection) {
      return {
        opacity: 0,
        x: iconProjection.x,
        y: iconProjection.y,
        scaleX: iconProjection.scaleX,
        scaleY: iconProjection.scaleY,
        skewX: iconProjection.skewX,
        transformOrigin: iconProjection.transformOrigin,
        filter: "blur(1px)",
      };
    }

    return { opacity: 0, scale: 0.95, y: 10 };
  },
  animate: ({ reduceMotion }: WindowPresenceCustom) =>
    reduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          filter: "blur(0px)",
        },
  exit: ({ id, exitModes, iconProjection, reduceMotion }: WindowPresenceCustom) => {
    if (reduceMotion) {
      return { opacity: 0, transition: windowExitTransition };
    }

    if (exitModes[id] === "minimize") {
      if (iconProjection) {
        return {
          opacity: [1, 0.98, 0],
          x: [0, iconProjection.x * 0.36, iconProjection.x],
          y: [0, iconProjection.y * 0.64, iconProjection.y],
          scaleX: [1, 0.68, iconProjection.scaleX],
          scaleY: [1, 0.88, iconProjection.scaleY],
          skewX: [0, iconProjection.skewX, 0],
          transformOrigin: iconProjection.transformOrigin,
          filter: ["blur(0px)", "blur(0px)", "blur(1px)"],
          transition: genieMinimizeTransition,
        };
      }

      return {
        opacity: 0,
        scale: 0.82,
        y: 72,
        transition: windowExitTransition,
      };
    }

    return {
      opacity: 0,
      scale: 0.95,
      y: 8,
      transition: windowExitTransition,
    };
  },
};

const windowTransition = {
  type: "spring",
  stiffness: 240,
  damping: 32,
  mass: 0.95,
} as const;

const windowExitTransition = {
  duration: 0.15,
  ease: "easeOut",
} as const;

const genieMinimizeTransition = {
  duration: 0.58,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  times: [0, 0.58, 1],
};

// ---------------------------------------------------------------------------
// AppWindow shell component
// ---------------------------------------------------------------------------

interface AppWindowProps {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isFocused: boolean;
  isMaximized: boolean;
  exitModes: Partial<Record<AppId, WindowExitMode>>;
  reduceMotion: boolean;
  contentKey: string;
  snapped: SnapState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onSnapLeft: () => void;
  onSnapRight: () => void;
  onDragStop: (x: number, y: number) => void;
  onResizeStop: (x: number, y: number, width: number, height: number) => void;
  children?: React.ReactNode;
}

function AppWindow({
  id,
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isFocused,
  isMaximized,
  exitModes,
  reduceMotion,
  contentKey,
  snapped,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onSnapLeft,
  onSnapRight,
  onDragStop,
  onResizeStop,
  children,
}: AppWindowProps) {
  const windowRect: ViewportRect =
    isMaximized && typeof window !== "undefined"
      ? {
          x: 0,
          y: MENU_BAR_HEIGHT,
          width: window.innerWidth,
          height: window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT,
        }
      : { x, y, width, height };
  const motionCustom: WindowPresenceCustom = {
    id,
    exitModes,
    iconProjection: getIconProjection(id, windowRect),
    reduceMotion,
  };

  const windowContent = (
    <motion.div
      className="window-shell glass"
      custom={motionCustom}
      variants={windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={windowTransition}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: isMaximized ? 0 : 12,
        overflow: "hidden",
        boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.14)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseDown={onFocus}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Window chrome — traffic lights + title */}
      <WindowChrome
        title={title}
        isFocused={isFocused}
        isMaximized={isMaximized}
        snapped={snapped}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onRestore={onRestore}
        onSnapLeft={onSnapLeft}
        onSnapRight={onSnapRight}
      />

      {/* Window content area */}
      <div
        className="text-label-primary"
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          fontSize: 14,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={contentKey}
            style={{ height: "100%" }}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  if (isMaximized) {
    // Maximized: bypass react-rnd; fill desktop area between menu bar and dock.
    return (
      <div
        style={{
          position: "fixed",
          top: MENU_BAR_HEIGHT,
          left: 0,
          right: 0,
          bottom: DOCK_HEIGHT,
          zIndex: WINDOW_Z_BASE + zIndex,
          pointerEvents: "all",
        }}
        onMouseDown={onFocus}
      >
        {windowContent}
      </div>
    );
  }

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      style={{ zIndex: WINDOW_Z_BASE + zIndex, pointerEvents: "all", willChange: "transform" }}
      minWidth={320}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="glass-chrome"
      onDragStart={() => { document.body.classList.add("is-dragging"); }}
      onDragStop={(_e, d) => {
        document.body.classList.remove("is-dragging");
        onDragStop(d.x, d.y);
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onResizeStop(
          pos.x,
          pos.y,
          ref.offsetWidth,
          ref.offsetHeight
        )
      }
      onMouseDown={onFocus}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      {windowContent}
    </Rnd>
  );
}

// ---------------------------------------------------------------------------
// WindowRenderer
// ---------------------------------------------------------------------------

const WINDOW_CONTENT: Record<AppId, React.ComponentType> = {
  home: HomePage,
  projects: ProjectsPage,
  about: AboutPage,
  contact: ContactPage,
  cv: CvPage,
  "glass-atlas": GlassAtlasPage,
  techy: TechyPage,
  sparse: SparsePage,
  weather: WeatherPage,
};

/** Maps AppId to window title strings. */
const WINDOW_TITLES: Record<AppId, string> = {
  home: "Home — Aden Guo",
  projects: "Projects — Aden Guo",
  about: "About — Aden Guo",
  contact: "Contact — Aden Guo",
  cv: "CV — Aden Guo",
  "glass-atlas": "Glass Atlas — Aden Guo",
  techy: "Techy — Aden Guo",
  sparse: "Sparse — Aden Guo",
  weather: "Weather & Wellness — Aden Guo",
};

export function WindowRenderer() {
  const { state, dispatch } = useWindowManager();
  const [exitModes, setExitModes] = useState<
    Partial<Record<AppId, WindowExitMode>>
  >({});
  const reduceMotion = useReducedMotion() ?? false;
  // Track visible window IDs via ref so onExitComplete always has the current set.
  const visibleIdsRef = useRef<Set<AppId>>(new Set());
  visibleIdsRef.current = new Set(
    state.openWindows.filter((w) => !w.minimized).map((w) => w.id)
  );

  const handleFocus = useCallback(
    (id: AppId) => {
      dispatch({ type: "focus", payload: { id } });
    },
    [dispatch]
  );

  const handleClose = useCallback(
    (id: AppId) => {
      flushSync(() => {
        setExitModes((current) => ({ ...current, [id]: "close" }));
      });
      dispatch({ type: "close", payload: { id } });
    },
    [dispatch]
  );

  const handleMinimize = useCallback(
    (id: AppId) => {
      flushSync(() => {
        setExitModes((current) => ({ ...current, [id]: "minimize" }));
      });
      dispatch({ type: "minimize", payload: { id } });
    },
    [dispatch]
  );

  const handleMaximize = useCallback(
    (id: AppId) => {
      dispatch({ type: "maximize", payload: { id } });
    },
    [dispatch]
  );

  const handleRestore = useCallback(
    (id: AppId) => {
      setExitModes((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      dispatch({ type: "restore", payload: { id } });
    },
    [dispatch]
  );

  /** Snap-left: fills the left half of the desktop area (below menu bar, above dock). */
  const handleSnapLeft = useCallback(
    (id: AppId) => {
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;
      dispatch({
        type: "snapLeft",
        payload: { id, desktopWidth, desktopHeight, desktopTop: MENU_BAR_HEIGHT },
      });
    },
    [dispatch]
  );

  /** Snap-right: fills the right half of the desktop area (below menu bar, above dock). */
  const handleSnapRight = useCallback(
    (id: AppId) => {
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;
      dispatch({
        type: "snapRight",
        payload: { id, desktopWidth, desktopHeight, desktopTop: MENU_BAR_HEIGHT },
      });
    },
    [dispatch]
  );

  const handleDragStop = useCallback(
    (id: AppId, x: number, y: number) => {
      dispatch({ type: "drag", payload: { id, x, y } });
    },
    [dispatch]
  );

  const handleResizeStop = useCallback(
    (id: AppId, x: number, y: number, width: number, height: number) => {
      dispatch({ type: "resize", payload: { id, x, y, width, height } });
    },
    [dispatch]
  );

  return (
    <AnimatePresence
      onExitComplete={() => {
        // Use ref so we read the current visible IDs rather than stale closure.
        const currentVisible = visibleIdsRef.current;
        setExitModes((current) =>
          Object.fromEntries(
            Object.entries(current).filter(([id]) => currentVisible.has(id as AppId))
          ) as Partial<Record<AppId, WindowExitMode>>
        );
      }}
    >
      {state.openWindows.filter((win) => !win.minimized).map((win) => {
        const zIndex = state.zIndexMap[win.id] ?? 0;
        const isFocused = state.focusedId === win.id;
        const title = WINDOW_TITLES[win.id] ?? win.id;

        const WindowContent = WINDOW_CONTENT[win.id];
        return (
          <AppWindow
            key={win.id}
            id={win.id}
            title={title}
            x={win.geometry.x}
            y={win.geometry.y}
            width={win.geometry.width}
            height={win.geometry.height}
            zIndex={zIndex}
            isFocused={isFocused}
            isMaximized={win.maximized}
            exitModes={exitModes}
            reduceMotion={reduceMotion}
            contentKey={win.id}
            snapped={win.snapped}
            onFocus={() => handleFocus(win.id)}
            onClose={() => handleClose(win.id)}
            onMinimize={() => handleMinimize(win.id)}
            onMaximize={() => handleMaximize(win.id)}
            onRestore={() => handleRestore(win.id)}
            onSnapLeft={() => handleSnapLeft(win.id)}
            onSnapRight={() => handleSnapRight(win.id)}
            onDragStop={(x, y) => handleDragStop(win.id, x, y)}
            onResizeStop={(x, y, w, h) =>
              handleResizeStop(win.id, x, y, w, h)
            }
          >
            <WindowContent />
          </AppWindow>
        );
      })}
    </AnimatePresence>
  );
}
