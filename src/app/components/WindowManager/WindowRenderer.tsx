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

import React, { useCallback, useState } from "react";
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** z-index floor for app windows — above wallpaper (0) and shortcuts (10),
 *  below dock (z-40) and menu bar (z-50). */
const WINDOW_Z_BASE = 20;

/**
 * Desktop safe area heights (px).
 * Menu bar: 28px top; Dock: 80px bottom.
 * Maximized windows fill the area between them.
 */
const MENU_BAR_HEIGHT = 28;
const DOCK_HEIGHT = 80;

type WindowExitMode = "close" | "minimize";

type WindowPresenceCustom = {
  id: AppId;
  exitModes: Partial<Record<AppId, WindowExitMode>>;
  reduceMotion: boolean;
};

const windowVariants: Variants = {
  initial: ({ reduceMotion }: WindowPresenceCustom) =>
    reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.95, y: 10 },
  animate: ({ reduceMotion }: WindowPresenceCustom) =>
    reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
  exit: ({ id, exitModes, reduceMotion }: WindowPresenceCustom) => {
    if (reduceMotion) {
      return { opacity: 0, transition: windowExitTransition };
    }

    if (exitModes[id] === "minimize") {
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
  stiffness: 400,
  damping: 30,
} as const;

const windowExitTransition = {
  duration: 0.15,
  ease: "easeOut",
} as const;

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
  const motionCustom: WindowPresenceCustom = {
    id,
    exitModes,
    reduceMotion,
  };

  const windowContent = (
    <motion.div
      className="window-shell"
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
        background: "rgba(30,30,32,0.82)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
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
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          color: "var(--text-label-primary)",
          fontSize: 14,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={contentKey}
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
      style={{ zIndex: WINDOW_Z_BASE + zIndex, pointerEvents: "all" }}
      minWidth={320}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="glass-chrome"
      onDragStop={(_e, d) => onDragStop(d.x, d.y)}
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

/** Maps AppId to window title strings. */
const WINDOW_TITLES: Record<AppId, string> = {
  home: "Home — Aden Guo",
  projects: "Projects — Aden Guo",
  about: "About — Aden Guo",
  contact: "Contact — Aden Guo",
  cv: "CV — Aden Guo",
};

interface WindowRendererProps {
  children: React.ReactNode;
}

export function WindowRenderer({ children }: WindowRendererProps) {
  const { state, dispatch } = useWindowManager();
  const [exitModes, setExitModes] = useState<
    Partial<Record<AppId, WindowExitMode>>
  >({});
  const reduceMotion = useReducedMotion() ?? false;

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
        setExitModes((current) => {
          const visibleIds = new Set(
            state.openWindows
              .filter((win) => !win.minimized)
              .map((win) => win.id)
          );
          return Object.fromEntries(
            Object.entries(current).filter(([id]) => visibleIds.has(id as AppId))
          ) as Partial<Record<AppId, WindowExitMode>>;
        });
      }}
    >
      {state.openWindows.filter((win) => !win.minimized).map((win) => {
        const zIndex = state.zIndexMap[win.id] ?? 0;
        const isFocused = state.focusedId === win.id;
        const title = WINDOW_TITLES[win.id] ?? win.id;

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
            contentKey={`${win.id}:${isFocused ? "active" : "inactive"}`}
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
            {isFocused ? children : null}
          </AppWindow>
        );
      })}
    </AnimatePresence>
  );
}
