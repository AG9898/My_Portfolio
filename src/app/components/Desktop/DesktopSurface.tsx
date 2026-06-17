"use client";

// ─── Desktop Surface ──────────────────────────────────────────────────────────
// Transparent full-bleed layer that catches interactions on the *empty* desktop:
//   - Click-hold drag → marquee (rubber-band) selection of desktop icons
//   - Right-click → desktop context menu (wallpaper, quick-launch, theme)
//
// It sits at z-index 5: above the wallpaper (0) but below shortcuts (10) and
// windows (20+), so icon/window/dock/menu clicks are never intercepted. Only
// events whose target is the surface itself (truly empty space) are handled.

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { APPS, type AppId } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";
import { getCenteredWindowPositionForViewport } from "../WindowManager/windowGeometry";
import {
  useWallpaper,
  type WallpaperType,
} from "./WallpaperProvider";
import { useDesktop } from "./DesktopProvider";

const WALLPAPER_CYCLE: WallpaperType[] = [
  "flow-field",
  "tahoe-dawn",
  "spooky-smoke",
  "gradient-dots",
];

const DRAG_THRESHOLD = 4;

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function rectsIntersect(a: Rect, b: DOMRect): boolean {
  return !(
    a.left + a.width < b.left ||
    a.left > b.right ||
    a.top + a.height < b.top ||
    a.top > b.bottom
  );
}

export default function DesktopSurface() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [marquee, setMarquee] = useState<Rect | null>(null);

  const { dispatch } = useWindowManager();
  const { setSelection, clearSelection, openMenu, closeMenu, closeInfo } =
    useDesktop();
  const { wallpaper, setWallpaper } = useWallpaper();
  const { theme, setTheme } = useTheme();

  const updateMarqueeSelection = useCallback(
    (rect: Rect) => {
      const hits: AppId[] = [];
      document.querySelectorAll<HTMLElement>("[data-desktop-icon]").forEach(
        (el) => {
          const id = el.dataset.appId as AppId | undefined;
          if (id && rectsIntersect(rect, el.getBoundingClientRect())) {
            hits.push(id);
          }
        }
      );
      setSelection(hits);
    },
    [setSelection]
  );

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.moved = true;

      const rect: Rect = {
        left: Math.min(drag.x, e.clientX),
        top: Math.min(drag.y, e.clientY),
        width: Math.abs(dx),
        height: Math.abs(dy),
      };
      setMarquee(rect);
      updateMarqueeSelection(rect);
    }

    function onUp() {
      const drag = dragRef.current;
      dragRef.current = null;
      setMarquee(null);
      // A plain click on empty desktop clears the selection.
      if (drag && !drag.moved) clearSelection();
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [clearSelection, updateMarqueeSelection]);

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    closeMenu();
    closeInfo();
    dragRef.current = { x: e.clientX, y: e.clientY, moved: false };
  }

  function openApp(id: AppId) {
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

  function handleContextMenu(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    clearSelection();
    const nextWallpaper =
      WALLPAPER_CYCLE[
        (WALLPAPER_CYCLE.indexOf(wallpaper) + 1) % WALLPAPER_CYCLE.length
      ];
    const isDark = theme !== "light";
    openMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          type: "item",
          label: "Change Wallpaper",
          onSelect: () => setWallpaper(nextWallpaper),
        },
        {
          type: "item",
          label: isDark ? "Use Light Appearance" : "Use Dark Appearance",
          onSelect: () => setTheme(isDark ? "light" : "dark"),
        },
        { type: "separator" },
        {
          type: "item",
          label: "Open Projects",
          onSelect: () => openApp("projects"),
        },
        { type: "item", label: "Open About", onSelect: () => openApp("about") },
        { type: "item", label: "Open CV", onSelect: () => openApp("cv") },
      ],
    });
  }

  return (
    <div
      ref={surfaceRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {marquee && (
        <div
          style={{
            position: "fixed",
            left: marquee.left,
            top: marquee.top,
            width: marquee.width,
            height: marquee.height,
            background: "rgba(10,132,255,0.18)",
            border: "1px solid rgba(10,132,255,0.6)",
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
