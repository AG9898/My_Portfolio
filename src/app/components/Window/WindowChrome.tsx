"use client";

// ─── WindowChrome ──────────────────────────────────────────────────────────────
// Window title bar with traffic light controls.
//
// Canonical macOS behavior:
//   - Hovering the traffic light GROUP CONTAINER reveals all three glyphs
//     simultaneously (×, −, +) — not per-button hover.
//   - Glyph color: rgba(0,0,0,0.55) at 8px bold weight.
//   - Red   (#FF5F57) → close
//   - Yellow(#FEBC2E) → minimize
//   - Green (#28C840) → maximize / restore
//
// Styling:
//   - Title bar height: 40px (styling.md)
//   - Traffic light diameter: 12px, gap: 8px (styling.md)
//   - Uses .glass-chrome material class (globals.css) — never reconstruct inline.
//   - Window title: text-[13px] font-medium, centered, truncated.

import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface WindowChromeProps {
  /** App window title shown centered in the title bar. */
  title: string;
  /** Whether the owning window is currently focused. Dims the title when false. */
  isFocused: boolean;
  /** Called when the close button is clicked. */
  onClose: () => void;
  /** Called when the minimize button is clicked. */
  onMinimize: () => void;
  /** Called when the maximize/restore button is clicked. */
  onMaximize: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WindowChrome({
  title,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
}: WindowChromeProps) {
  const [groupHovered, setGroupHovered] = useState(false);

  return (
    <div
      className="glass-chrome"
      style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 12,
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        cursor: "move",
        userSelect: "none",
        position: "relative",
      }}
      aria-label={`${title} title bar`}
    >
      {/* Traffic light group ─────────────────────────────────────────────── */}
      <div
        style={{ display: "flex", gap: 8, zIndex: 1 }}
        onMouseEnter={() => setGroupHovered(true)}
        onMouseLeave={() => setGroupHovered(false)}
        aria-label="Window controls"
      >
        {/* Close (red) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close window"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FF5F57",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {groupHovered && (
            <X
              size={8}
              strokeWidth={2.5}
              color="rgba(0,0,0,0.55)"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Minimize (yellow) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          aria-label="Minimize window"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FEBC2E",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {groupHovered && (
            <Minus
              size={8}
              strokeWidth={2.5}
              color="rgba(0,0,0,0.55)"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Maximize / restore (green) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          aria-label="Maximize window"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#28C840",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {groupHovered && (
            <Plus
              size={8}
              strokeWidth={2.5}
              color="rgba(0,0,0,0.55)"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* Centered window title ───────────────────────────────────────────── */}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 500,
          color: isFocused
            ? "var(--color-label-primary)"
            : "var(--color-label-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          // Keep title centered without being obscured by traffic lights.
          padding: "0 80px",
          pointerEvents: "none",
        }}
      >
        {title}
      </span>
    </div>
  );
}
