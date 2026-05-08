"use client";

// ─── WindowRenderer ────────────────────────────────────────────────────────────
// Renders one AppWindow shell per open window entry in the window manager state.
// Sits above the wallpaper and below menu bar/dock in z-order.
// Uses react-rnd for drag and resize, dispatching state changes to the reducer.

import React, { useCallback } from "react";
import { Rnd } from "react-rnd";
import { useWindowManager } from "./WindowManagerProvider";
import { AppId } from "../appMetadata";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** z-index floor for app windows — above wallpaper (0) and shortcuts (10),
 *  below dock (z-40) and menu bar (z-50). */
const WINDOW_Z_BASE = 20;

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
  isMinimized: boolean;
  isMaximized: boolean;
  onFocus: () => void;
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
  isMinimized,
  isMaximized,
  onFocus,
  onDragStop,
  onResizeStop,
}: AppWindowProps) {
  if (isMinimized) return null;

  const rndStyle: React.CSSProperties = isMaximized
    ? {
        position: "fixed",
        inset: "28px 0 80px 0",
        width: "100%",
        height: "calc(100vh - 28px - 80px)",
        zIndex: WINDOW_Z_BASE + zIndex,
        pointerEvents: "all",
      }
    : { zIndex: WINDOW_Z_BASE + zIndex, pointerEvents: "all" };

  const windowContent = (
    <div
      className="window-shell"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 10,
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
      aria-label={title}
    >
      {/* Title bar placeholder — chrome will be added in V1_006B */}
      <div
        className="glass-chrome"
        style={{
          height: 38,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          cursor: "move",
          userSelect: "none",
        }}
        aria-label={`${title} title bar`}
      >
        {/* Traffic light placeholder circles */}
        <div style={{ display: "flex", gap: 8, marginRight: 12 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--traffic-red)",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--traffic-yellow)",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--traffic-green)",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
        </div>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            color: isFocused
              ? "var(--text-label-primary)"
              : "var(--text-label-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
      </div>

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
        <div style={{ padding: 16, color: "var(--text-label-secondary)" }}>
          {id} — content placeholder (wired in V1_007A+)
        </div>
      </div>
    </div>
  );

  if (isMaximized) {
    // When maximized, bypass react-rnd and render a fixed full-desktop div.
    return (
      <div style={rndStyle} onMouseDown={onFocus}>
        {windowContent}
      </div>
    );
  }

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      style={rndStyle}
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

export function WindowRenderer() {
  const { state, dispatch } = useWindowManager();

  const handleFocus = useCallback(
    (id: AppId) => {
      dispatch({ type: "focus", payload: { id } });
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
    <>
      {state.openWindows.map((win) => {
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
            isMinimized={win.minimized}
            isMaximized={win.maximized}
            onFocus={() => handleFocus(win.id)}
            onDragStop={(x, y) => handleDragStop(win.id, x, y)}
            onResizeStop={(x, y, w, h) =>
              handleResizeStop(win.id, x, y, w, h)
            }
          />
        );
      })}
    </>
  );
}
