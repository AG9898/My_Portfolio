"use client";

// ─── Context Menu ─────────────────────────────────────────────────────────────
// macOS-style right-click menu rendered at the cursor. Mirrors the glass styling
// used by the window snap dropdown in WindowChrome. Flips when near a viewport
// edge and dismisses on outside click, Escape, scroll, resize, or blur.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ContextMenuItem } from "./DesktopProvider";

const MENU_WIDTH = 200;

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Flip away from the right/bottom viewport edges once we can measure height.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const margin = 8;
    const nextX =
      x + width + margin > window.innerWidth ? x - width : x;
    const nextY =
      y + height + margin > window.innerHeight ? y - height : y;
    setPos({ x: Math.max(margin, nextX), y: Math.max(margin, nextY) });
  }, [x, y]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("mousedown", onPointerDown, true);
    window.addEventListener("contextmenu", onPointerDown, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("mousedown", onPointerDown, true);
      window.removeEventListener("contextmenu", onPointerDown, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Context menu"
      className="glass-chrome"
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        zIndex: 10000,
        minWidth: MENU_WIDTH,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: "4px 0",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        cursor: "default",
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, idx) =>
        item.type === "separator" ? (
          <div
            key={`sep-${idx}`}
            style={{
              height: 1,
              margin: "4px 8px",
              background: "rgba(255,255,255,0.12)",
            }}
          />
        ) : (
          <button
            key={item.label}
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onSelect();
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "6px 14px",
              background: "none",
              border: "none",
              textAlign: "left",
              color: item.disabled
                ? "rgba(255,255,255,0.30)"
                : "rgba(255,255,255,0.88)",
              fontSize: 13,
              cursor: item.disabled ? "default" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!item.disabled)
                e.currentTarget.style.background = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
