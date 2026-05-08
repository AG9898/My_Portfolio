"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Moon, Mountain, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { APPS } from "../appMetadata";
import { useWindowManager } from "../WindowManager/WindowManagerProvider";
import { useWallpaper } from "../Desktop/WallpaperProvider";
import { MenuDropdown, MenuEntry } from "./MenuDropdown";

// ─── Strawberry logo ─────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <Image
      src="/strawberry-logo.png"
      alt=""
      aria-hidden="true"
      width={22}
      height={22}
      className="mr-3 -mt-px opacity-90"
      style={{ mixBlendMode: "screen" }}
    />
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
      aria-hidden="true"
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

function ColorMenuControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mx-1 flex min-w-[190px] items-center justify-between rounded-[4px] px-3 py-[5px] text-[13px] text-label-primary">
      <span className="pr-4">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="h-5 w-8 cursor-default rounded border border-glass-edge bg-transparent p-0"
        aria-label={label}
      />
    </label>
  );
}

// ─── Battery visual (24×12px rect, 78% fill, decorative) ────────────────────
function BatteryIcon() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
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
      aria-hidden="true"
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
  const {
    wallpaper,
    setWallpaper,
    tahoeDawnSettings,
    setTahoeDawnSettings,
    flowFieldSettings,
    setFlowFieldSettings,
    spookySmokeSettings,
    setSpookySmokeSettings,
    gradientDotsSettings,
    setGradientDotsSettings,
  } = useWallpaper();

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

  const wallpaperMenuItems: MenuEntry[] = [
    {
      label: "Flow Field",
      checked: wallpaper === "flow-field",
      onSelect: () => setWallpaper("flow-field"),
    },
    {
      label: "Tahoe Dawn",
      checked: wallpaper === "tahoe-dawn",
      onSelect: () => setWallpaper("tahoe-dawn"),
    },
    {
      label: "Spooky Smoke",
      checked: wallpaper === "spooky-smoke",
      onSelect: () => setWallpaper("spooky-smoke"),
    },
    {
      label: "Cyber Grid",
      checked: wallpaper === "gradient-dots",
      onSelect: () => setWallpaper("gradient-dots"),
    },
  ];

  if (wallpaper === "flow-field") {
    wallpaperMenuItems.push(
      { separator: true },
      {
        custom: (
          <ColorMenuControl
            label="Background"
            value={flowFieldSettings.backgroundColor}
            onChange={(backgroundColor) =>
              setFlowFieldSettings({ ...flowFieldSettings, backgroundColor })
            }
          />
        ),
      },
      {
        custom: (
          <ColorMenuControl
            label="Lines"
            value={flowFieldSettings.lineColor}
            onChange={(lineColor) =>
              setFlowFieldSettings({ ...flowFieldSettings, lineColor })
            }
          />
        ),
      },
    );
  }

  if (wallpaper === "tahoe-dawn") {
    wallpaperMenuItems.push(
      { separator: true },
      {
        custom: (
          <ColorMenuControl
            label="Background"
            value={tahoeDawnSettings.backgroundColor}
            onChange={(backgroundColor) =>
              setTahoeDawnSettings({ ...tahoeDawnSettings, backgroundColor })
            }
          />
        ),
      },
      {
        custom: (
          <ColorMenuControl
            label="Dawn"
            value={tahoeDawnSettings.dawnColor}
            onChange={(dawnColor) =>
              setTahoeDawnSettings({ ...tahoeDawnSettings, dawnColor })
            }
          />
        ),
      },
      {
        custom: (
          <ColorMenuControl
            label="Glow"
            value={tahoeDawnSettings.glowColor}
            onChange={(glowColor) =>
              setTahoeDawnSettings({ ...tahoeDawnSettings, glowColor })
            }
          />
        ),
      },
    );
  }

  if (wallpaper === "spooky-smoke") {
    wallpaperMenuItems.push(
      { separator: true },
      {
        custom: (
          <ColorMenuControl
            label="Smoke"
            value={spookySmokeSettings.smokeColor}
            onChange={(smokeColor) => setSpookySmokeSettings({ smokeColor })}
          />
        ),
      },
    );
  }

  if (wallpaper === "gradient-dots") {
    wallpaperMenuItems.push(
      { separator: true },
      {
        custom: (
          <ColorMenuControl
            label="Background"
            value={gradientDotsSettings.backgroundColor}
            onChange={(backgroundColor) =>
              setGradientDotsSettings({ ...gradientDotsSettings, backgroundColor })
            }
          />
        ),
      },
      {
        custom: (
          <ColorMenuControl
            label="Grid"
            value={gradientDotsSettings.dotColor}
            onChange={(dotColor) =>
              setGradientDotsSettings({ ...gradientDotsSettings, dotColor })
            }
          />
        ),
      },
      {
        custom: (
          <ColorMenuControl
            label="Ripple"
            value={gradientDotsSettings.rippleColor}
            onChange={(rippleColor) =>
              setGradientDotsSettings({ ...gradientDotsSettings, rippleColor })
            }
          />
        ),
      },
    );
  }

  return (
    <header
      className="glass-menubar absolute top-0 left-0 right-0 h-7 flex items-center px-3 text-[13px] text-label-primary z-50 select-none"
      style={{ borderBottom: "1px solid var(--color-glass-edge)" }}
      aria-label="Menu Bar"
    >
      {/* ── Left side ── */}
      <nav className="flex min-w-0 flex-1 items-center overflow-hidden" aria-label="App menus">
        {/* Apple menu */}
        <MenuDropdown
          trigger={<AppleLogo />}
          items={APPLE_MENU_ITEMS}
          triggerClassName="mr-2"
        />

        {/* Focused app name — updates as window focus changes */}
        <MenuDropdown
          trigger={
            <span className="max-w-[120px] truncate font-semibold text-label-primary">
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
        className="ml-3 flex shrink-0 items-center gap-3 text-[12.5px] text-label-primary"
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

        {/* Wallpaper picker */}
        <MenuDropdown
          trigger={<Mountain size={14} aria-hidden="true" />}
          triggerClassName="flex items-center justify-center !px-1 !py-0 h-5 w-5"
          items={wallpaperMenuItems}
        />

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
