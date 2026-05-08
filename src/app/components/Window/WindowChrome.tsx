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
//   - Green (#28C840) → maximize when open; restore when maximized or snapped
//
// Snap via right-click on green button:
//   - Context menu offers: Snap Left, Snap Right, Maximize, Restore
//
// Styling:
//   - Title bar height: 40px (styling.md)
//   - Traffic light diameter: 12px, gap: 8px (styling.md)
//   - Uses .glass-chrome material class (globals.css) — never reconstruct inline.
//   - Window title: text-[13px] font-medium, centered, truncated.

import React, { useState, useRef, useEffect } from "react";
import { X, Minus, Plus, Minimize2, Maximize2, PanelLeft, PanelRight } from "lucide-react";
import { SnapState } from "../WindowManager/windowReducer";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface WindowChromeProps {
  /** App window title shown centered in the title bar. */
  title: string;
  /** Whether the owning window is currently focused. Dims the title when false. */
  isFocused: boolean;
  /** Whether the window is currently maximized. */
  isMaximized: boolean;
  /** Current snap state of the window. */
  snapped: SnapState;
  /** Called when the close button is clicked. */
  onClose: () => void;
  /** Called when the minimize button is clicked. */
  onMinimize: () => void;
  /** Called when the green button is clicked and window is not maximized/snapped. */
  onMaximize: () => void;
  /** Called when the green button is clicked and window is maximized or snapped. */
  onRestore: () => void;
  /** Called when snap-left is selected from the context menu. */
  onSnapLeft: () => void;
  /** Called when snap-right is selected from the context menu. */
  onSnapRight: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WindowChrome({
  title,
  isFocused,
  isMaximized,
  snapped,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onSnapLeft,
  onSnapRight,
}: WindowChromeProps) {
  const [groupHovered, setGroupHovered] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  const isConstrained = isMaximized || snapped !== "none";

  // Close context menu on outside click or Escape; arrow-key navigation within menu.
  useEffect(() => {
    if (!contextOpen) return;

    // Focus first enabled menu item when menu opens.
    firstMenuItemRef.current?.focus();

    function handleOutside(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setContextOpen(false);
        return;
      }
      // Arrow navigation within the menu.
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && contextRef.current) {
        e.preventDefault();
        const items = Array.from(
          contextRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
        );
        const current = document.activeElement as HTMLButtonElement;
        const idx = items.indexOf(current);
        if (e.key === "ArrowDown") {
          const next = items[(idx + 1) % items.length];
          next?.focus();
        } else {
          const prev = items[(idx - 1 + items.length) % items.length];
          prev?.focus();
        }
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [contextOpen]);

  function handleGreenClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isConstrained) {
      onRestore();
    } else {
      onMaximize();
    }
  }

  function handleGreenContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setContextOpen((prev) => !prev);
  }

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
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70"
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
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70"
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

        {/* Maximize / restore (green) with context menu for snap */}
        <div style={{ position: "relative" }} ref={contextRef}>
          <button
            onClick={handleGreenClick}
            onContextMenu={handleGreenContextMenu}
            aria-label={isConstrained ? "Restore window" : "Maximize window"}
            aria-haspopup="menu"
            aria-expanded={contextOpen}
            title="Click to maximize/restore • Right-click for snap options"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70"
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
              isConstrained ? (
                <Minimize2
                  size={7}
                  strokeWidth={2.5}
                  color="rgba(0,0,0,0.55)"
                  aria-hidden="true"
                />
              ) : (
                <Plus
                  size={8}
                  strokeWidth={2.5}
                  color="rgba(0,0,0,0.55)"
                  aria-hidden="true"
                />
              )
            )}
          </button>

          {/* Snap / restore context menu */}
          {contextOpen && (
            <div
              role="menu"
              aria-label="Window snap options"
              style={{
                position: "absolute",
                top: 18,
                left: 0,
                zIndex: 9999,
                background: "rgba(44,44,46,0.96)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "4px 0",
                minWidth: 160,
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                cursor: "default",
                userSelect: "none",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {[
                {
                  label: "Snap Left",
                  icon: <PanelLeft size={12} aria-hidden="true" />,
                  action: () => { onSnapLeft(); setContextOpen(false); },
                  disabled: snapped === "left",
                },
                {
                  label: "Snap Right",
                  icon: <PanelRight size={12} aria-hidden="true" />,
                  action: () => { onSnapRight(); setContextOpen(false); },
                  disabled: snapped === "right",
                },
                {
                  label: "Maximize",
                  icon: <Maximize2 size={12} aria-hidden="true" />,
                  action: () => { onMaximize(); setContextOpen(false); },
                  disabled: isMaximized,
                },
                {
                  label: "Restore",
                  icon: <Minimize2 size={12} aria-hidden="true" />,
                  action: () => { onRestore(); setContextOpen(false); },
                  disabled: !isConstrained,
                },
              ].map(({ label, icon, action, disabled }, idx) => (
                <button
                  key={label}
                  role="menuitem"
                  ref={idx === 0 ? firstMenuItemRef : undefined}
                  onClick={action}
                  disabled={disabled}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "6px 14px",
                    background: "none",
                    border: "none",
                    color: disabled ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.85)",
                    fontSize: 13,
                    cursor: disabled ? "default" : "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "none";
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
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
