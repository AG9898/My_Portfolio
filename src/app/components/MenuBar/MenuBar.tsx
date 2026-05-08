"use client";

import { useEffect, useState } from "react";

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
      <div className="relative w-6 h-3 border border-white/70 rounded-[3px]">
        <div
          className="absolute inset-0.5 bg-white/85 rounded-[1px]"
          style={{ width: "78%" }}
        />
      </div>
      <div className="w-0.5 h-1.5 bg-white/70 rounded-r" />
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

// ─── Menu Bar app menus (left side) ──────────────────────────────────────────
const APP_MENUS = ["File", "Edit", "View", "Window", "Help"];

// ─── MenuBar ─────────────────────────────────────────────────────────────────
export default function MenuBar() {
  // Hydration-safe clock: start null on server, fill on client
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <header
      className="glass-menubar absolute top-0 left-0 right-0 h-7 flex items-center px-3 text-[13px] text-label-primary z-50 select-none"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      aria-label="Menu Bar"
    >
      {/* ── Left side ── */}
      <nav className="flex items-center" aria-label="App menus">
        <AppleLogo />
        {/* App name placeholder — replaced with focused-app name in V1_008A */}
        <span className="font-semibold mr-4 text-label-primary" aria-current="page">
          Finder
        </span>
        {APP_MENUS.map((menu) => (
          <button
            key={menu}
            className="mr-3.5 cursor-default hover:bg-white/10 px-1.5 py-0.5 rounded text-[13px] text-label-primary"
            aria-haspopup="menu"
            aria-label={menu}
          >
            {menu}
          </button>
        ))}
      </nav>

      {/* ── Right side ── */}
      <div
        className="ml-auto flex items-center gap-3 text-[12.5px] text-white/85"
        aria-label="Status icons"
      >
        <ControlCentreIcon />
        <BatteryIcon />
        <WifiIcon />
        {/* Date — shown once client-side clock is ready */}
        {dateStr && (
          <span className="ml-1 text-white/80">{dateStr}</span>
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
