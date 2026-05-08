"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { APPS } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";
import { MenuDropdown, MenuEntry } from "./MenuDropdown";

// ─── Apple logo SVG ──────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="currentColor"
      aria-hidden="true"
      className="mr-3 -mt-px opacity-90"
    >
      <path d="M11.182 8.46c-.02-2.05 1.674-3.04 1.751-3.087-.953-1.39-2.435-1.582-2.964-1.604-1.262-.127-2.464.745-3.106.745-.642 0-1.633-.726-2.687-.706-1.382.02-2.659.804-3.37 2.04-1.437 2.49-.366 6.176 1.034 8.197.685.99 1.5 2.103 2.566 2.062 1.03-.04 1.42-.667 2.664-.667s1.594.667 2.687.645c1.11-.02 1.812-1.008 2.49-2 .785-1.146 1.108-2.257 1.127-2.314-.025-.012-2.16-.83-2.182-3.31zM9.18 2.51c.568-.69.952-1.65.847-2.61-.82.034-1.812.547-2.4 1.236-.527.61-.99 1.586-.866 2.527.913.072 1.85-.464 2.42-1.153z" />
    </svg>
  );
}

// ─── Control Centre icon (4 rounded rects SVG) ───────────────────────────────
function ControlCentreIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-label="Control Centre"
    >
      <rect x="3" y="6" width="8" height="4" rx="2" />
      <circle cx="9" cy="8" r="1" fill="currentColor" />
      <rect x="13" y="6" width="8" height="4" rx="2" />
      <circle cx="15" cy="8" r="1" fill="currentColor" />
      <rect x="3" y="14" width="8" height="4" rx="2" />
      <circle cx="5" cy="16" r="1" fill="currentColor" />
      <rect x="13" y="14" width="8" height="4" rx="2" />
      <circle cx="19" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

// ─── Battery visual (24×12px rect, 78% fill, decorative) ────────────────────
function BatteryIcon() {
  return (
    <div className="flex items-center gap-0.5" aria-label="Battery">
      <div className="relative w-6 h-3 border rounded-[3px] opacity-80">
        <div
          className="absolute inset-0.5 rounded-[1px] bg-current"
          style={{ width: "78%" }}
        />
      </div>
      <div className="w-0.5 h-1.5 rounded-r bg-current opacity-80" />
    </div>
  );
}

// ─── Wi-Fi glyph SVG ─────────────────────────────────────────────────────────
function WifiIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Wi-Fi"
    >
      <path d="M12 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
      <path d="M12 13.5c-1.5 0-2.9.5-4 1.4l1.4 1.5c.7-.6 1.6-.9 2.6-.9s1.9.3 2.6.9l1.4-1.5c-1.1-.9-2.5-1.4-4-1.4z" />
      <path d="M12 9c-2.7 0-5.1 1-7 2.7l1.4 1.5c1.5-1.4 3.5-2.2 5.6-2.2s4.1.8 5.6 2.2l1.4-1.5C17.1 10 14.7 9 12 9z" />
      <path d="M12 4.5C8 4.5 4.4 6 1.7 8.4l1.4 1.5C5.4 7.8 8.6 6.5 12 6.5s6.6 1.3 8.9 3.4l1.4-1.5C19.6 6 16 4.5 12 4.5z" />
    </svg>
  );
}

// ─── Apple menu items ─────────────────────────────────────────────────────────
const APPLE_MENU_ITEMS: MenuEntry[] = [
  { label: "About This Portfolio" },
  { separator: true },
  { label: "System Preferences…", disabled: true },
  { separator: true },
  { label: "Sleep", disabled: true },
  { label: "Restart…", disabled: true },
  { label: "Shut Down…", disabled: true },
];

// ─── Static (non-window-action) menu definitions ─────────────────────────────
// These menus are app-agnostic and do not require dispatch or focused state.
const STATIC_MENUS: { label: string; items: MenuEntry[] }[] = [
  {
    label: "File",
    items: [
      { label: "New Window", shortcut: "⌘N", disabled: true },
      { label: "Close Window", shortcut: "⌘W", disabled: true },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "⌘Z", disabled: true },
      { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
      { separator: true },
      { label: "Cut", shortcut: "⌘X", disabled: true },
      { label: "Copy", shortcut: "⌘C", disabled: true },
      { label: "Paste", shortcut: "⌘V", disabled: true },
      { label: "Select All", shortcut: "⌘A", disabled: true },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Zoom In", shortcut: "⌘+", disabled: true },
      { label: "Zoom Out", shortcut: "⌘−", disabled: true },
      { separator: true },
      { label: "Enter Full Screen", shortcut: "⌃⌘F", disabled: true },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Portfolio Help", disabled: true },
    ],
  },
];

// ─── MenuBar ─────────────────────────────────────────────────────────────────
export default function MenuBar() {
  // Hydration-safe clock: start null on server, fill on client
  const [now, setNow] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { state, dispatch } = useWindowManager();

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isLight = resolvedTheme === "light";

  const timeStr = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  const dateStr = now
    ? now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  // Derive focused app label from window manager state
  const focusedApp = state.focusedId
    ? APPS.find((app) => app.id === state.focusedId)
    : null;
  const focusedAppLabel = focusedApp?.label ?? "Finder";

  // Focused window entry — used to determine if a focused window is minimized/maximized.
  const focusedWindow = state.openWindows.find((w) => w.id === state.focusedId);

  // Window menu — built dynamically so actions can dispatch to the window manager.
  // Items are disabled when no focused window exists.
  const noFocus = !state.focusedId;
  const windowMenuItems: MenuEntry[] = [
    {
      label: "Minimize",
      shortcut: "⌘M",
      disabled: noFocus || focusedWindow?.minimized === true,
      onSelect: () => {
        if (state.focusedId) {
          dispatch({ type: "minimize", payload: { id: state.focusedId } });
        }
      },
    },
    {
      label: "Zoom",
      disabled: noFocus,
      onSelect: () => {
        if (state.focusedId) {
          dispatch({ type: "maximize", payload: { id: state.focusedId } });
        }
      },
    },
    { separator: true },
    {
      label: "Restore",
      disabled: noFocus || (!focusedWindow?.minimized && !focusedWindow?.maximized && focusedWindow?.snapped === "none"),
      onSelect: () => {
        if (state.focusedId) {
          dispatch({ type: "restore", payload: { id: state.focusedId } });
        }
      },
    },
    { separator: true },
    {
      label: "Close",
      shortcut: "⌘W",
      disabled: noFocus,
      onSelect: () => {
        if (state.focusedId) {
          dispatch({ type: "close", payload: { id: state.focusedId } });
        }
      },
    },
  ];

  // All menus: static menus plus the dynamic Window menu inserted before Help.
  const allMenus = [
    ...STATIC_MENUS.slice(0, 3), // File, Edit, View
    { label: "Window", items: windowMenuItems },
    ...STATIC_MENUS.slice(3),   // Help
  ];

  return (
    <header
      className="glass-menubar absolute top-0 left-0 right-0 h-7 flex items-center px-3 text-[13px] text-label-primary z-50 select-none"
      style={{ borderBottom: "1px solid var(--color-glass-edge)" }}
      aria-label="Menu Bar"
    >
      {/* ── Left side ── */}
      <nav className="flex items-center" aria-label="App menus">
        {/* Apple menu */}
        <MenuDropdown
          trigger={<AppleLogo />}
          items={APPLE_MENU_ITEMS}
          triggerClassName="mr-2"
        />

        {/* Focused app name — updates as window focus changes */}
        <MenuDropdown
          trigger={
            <span className="font-semibold text-label-primary">
              {focusedAppLabel}
            </span>
          }
          items={[
            { label: `About ${focusedAppLabel}` },
            { separator: true },
            { label: "Hide", shortcut: "⌘H", disabled: true },
            { label: "Hide Others", shortcut: "⌥⌘H", disabled: true },
            { separator: true },
            { label: "Quit", shortcut: "⌘Q", disabled: true },
          ]}
          triggerClassName="mr-2"
        />

        {/* App menus: File, Edit, View, Window (dynamic), Help */}
        {allMenus.map((menu) => (
          <MenuDropdown
            key={menu.label}
            trigger={menu.label}
            items={menu.items}
            triggerClassName="mr-1"
          />
        ))}
      </nav>

      {/* ── Right side ── */}
      <div
        className="ml-auto flex items-center gap-3 text-[12.5px] text-label-primary"
        style={{ color: "var(--color-label-tertiary)" }}
        aria-label="Status icons"
      >
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center rounded text-label-primary hover:bg-[var(--color-control-hover)]"
          style={{ color: "var(--color-label-tertiary)" }}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          disabled={!mounted}
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
          title={isLight ? "Dark mode" : "Light mode"}
        >
          {isLight ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <ControlCentreIcon />
        <BatteryIcon />
        <WifiIcon />
        {/* Date — shown once client-side clock is ready */}
        {dateStr && (
          <span className="ml-1">{dateStr}</span>
        )}
        {/* Live clock — tabular-nums for stable width */}
        {timeStr && (
          <span className="tabular-nums" aria-live="polite" aria-atomic="true">
            {timeStr}
          </span>
        )}
      </div>
    </header>
  );
}
