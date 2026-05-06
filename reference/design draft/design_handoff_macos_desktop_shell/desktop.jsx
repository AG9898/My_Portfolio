/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// macOS Tahoe — Liquid Glass desktop mockup
// Tokens from /docs/styling.md + /docs/macos-redesign.md
// ============================================================

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "wallpaper": "tahoe-dawn",
  "theme": "dark",
  "showBoot": false,
  "windowState": "open",
  "iconStyle": "tahoe"
}/*EDITMODE-END*/;

// ---- Wallpapers (CSS-only, OS-feeling gradients) ----
const WALLPAPERS = {
  "tahoe-dawn": {
    label: "Tahoe Dawn",
    bg: `radial-gradient(120% 90% at 80% 10%, #ff8a3c 0%, #ff5b8a 22%, #a15bff 48%, #2b3bd6 72%, #0a0a18 100%)`,
  },
  "tahoe-night": {
    label: "Tahoe Night",
    bg: `radial-gradient(110% 80% at 30% 20%, #1a3a8a 0%, #5b2bd6 30%, #8a2bd6 55%, #1a1340 80%, #05050f 100%)`,
  },
  "sequoia": {
    label: "Sequoia",
    bg: `radial-gradient(130% 100% at 50% 0%, #0b3d2e 0%, #0a2436 35%, #0a0e1a 70%, #050608 100%)`,
  },
  "sonoma": {
    label: "Sonoma",
    bg: `radial-gradient(120% 90% at 50% 50%, #2e1a4a 0%, #4a1e6a 30%, #6a1e8a 55%, #1a0a2a 80%, #07050f 100%)`,
  },
};

// ---- Glass utility (one place, mirrors .glass-* in globals.css) ----
const glass = (variant = "panel") => {
  const base = {
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
  };
  if (variant === "menubar") {
    return { ...base, background: "rgba(20,20,22,0.45)", borderBottom: "1px solid rgba(255,255,255,0.08)" };
  }
  if (variant === "dock") {
    return {
      ...base,
      background: "rgba(255,255,255,0.14)",
      border: "1px solid rgba(255,255,255,0.22)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2), 0 30px 80px rgba(0,0,0,0.5)",
    };
  }
  if (variant === "chrome") {
    return { ...base, background: "rgba(44,44,46,0.72)" };
  }
  // window panel
  return {
    ...base,
    background: "rgba(28,28,30,0.78)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
  };
};

// ============================================================
// MENU BAR
// ============================================================
function MenuBar({ appName }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const menus = ["File", "Edit", "View", "Window", "Help"];
  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 flex items-center px-3 text-[13px] text-white/90 z-50 select-none"
      style={glass("menubar")}
    >
      {/* Apple logo */}
      <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" className="mr-3 -mt-px opacity-90">
        <path d="M11.182 8.46c-.02-2.05 1.674-3.04 1.751-3.087-.953-1.39-2.435-1.582-2.964-1.604-1.262-.127-2.464.745-3.106.745-.642 0-1.633-.726-2.687-.706-1.382.02-2.659.804-3.37 2.04-1.437 2.49-.366 6.176 1.034 8.197.685.99 1.5 2.103 2.566 2.062 1.03-.04 1.42-.667 2.664-.667s1.594.667 2.687.645c1.11-.02 1.812-1.008 2.49-2 .785-1.146 1.108-2.257 1.127-2.314-.025-.012-2.16-.83-2.182-3.31zM9.18 2.51c.568-.69.952-1.65.847-2.61-.82.034-1.812.547-2.4 1.236-.527.61-.99 1.586-.866 2.527.913.072 1.85-.464 2.42-1.153z" />
      </svg>
      <span className="font-semibold mr-4">{appName}</span>
      {menus.map((m) => (
        <span key={m} className="mr-3.5 cursor-default hover:bg-white/10 px-1.5 py-0.5 rounded">
          {m}
        </span>
      ))}
      <div className="ml-auto flex items-center gap-3 text-white/85">
        {/* control center */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="6" width="8" height="4" rx="2" />
          <circle cx="9" cy="8" r="1" fill="currentColor" />
          <rect x="13" y="6" width="8" height="4" rx="2" />
          <circle cx="15" cy="8" r="1" fill="currentColor" />
          <rect x="3" y="14" width="8" height="4" rx="2" />
          <circle cx="5" cy="16" r="1" fill="currentColor" />
          <rect x="13" y="14" width="8" height="4" rx="2" />
          <circle cx="19" cy="16" r="1" fill="currentColor" />
        </svg>
        {/* battery */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-6 h-3 border border-white/70 rounded-[3px]">
            <div className="absolute inset-0.5 bg-white/85 rounded-[1px]" style={{ width: "78%" }} />
          </div>
          <div className="w-0.5 h-1.5 bg-white/70 rounded-r" />
        </div>
        {/* wifi */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          <path d="M12 13.5c-1.5 0-2.9.5-4 1.4l1.4 1.5c.7-.6 1.6-.9 2.6-.9s1.9.3 2.6.9l1.4-1.5c-1.1-.9-2.5-1.4-4-1.4z" />
          <path d="M12 9c-2.7 0-5.1 1-7 2.7l1.4 1.5c1.5-1.4 3.5-2.2 5.6-2.2s4.1.8 5.6 2.2l1.4-1.5C17.1 10 14.7 9 12 9z" />
          <path d="M12 4.5C8 4.5 4.4 6 1.7 8.4l1.4 1.5C5.4 7.8 8.6 6.5 12 6.5s6.6 1.3 8.9 3.4l1.4-1.5C19.6 6 16 4.5 12 4.5z" />
        </svg>
        <span className="ml-1 text-[12.5px] text-white/80">{date}</span>
        <span className="text-[12.5px] tabular-nums">{time}</span>
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP SIDEBAR ICONS (left column, PostHog style)
// ============================================================
function DesktopIcon({ kind, label, selected, onSelect, onOpen, style }) {
  return (
    <button
      onClick={onSelect}
      onDoubleClick={onOpen}
      className="group flex flex-col items-center w-[88px] py-1.5 rounded-md focus:outline-none"
      style={{
        background: selected ? "rgba(10,132,255,0.28)" : "transparent",
        border: selected ? "1px solid rgba(10,132,255,0.55)" : "1px solid transparent",
        ...style,
      }}
    >
      <FileIcon kind={kind} />
      <span
        className="mt-1.5 text-[11px] leading-tight text-white px-1 rounded"
        style={{
          background: selected ? "rgba(10,132,255,0.95)" : "transparent",
          textShadow: selected ? "none" : "0 1px 2px rgba(0,0,0,0.7)",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function FileIcon({ kind }) {
  // 56x56 file metaphors with folded corner
  const W = 48, H = 60;
  const fold = 14;
  const docPath = `M0 0 H${W - fold} L${W} ${fold} V${H} H0 Z`;
  const foldPath = `M${W - fold} 0 V${fold} H${W} Z`;

  if (kind === "folder") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <defs>
          <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7CC2FF" />
            <stop offset="100%" stopColor="#3A8DDB" />
          </linearGradient>
          <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AA8E8" />
            <stop offset="100%" stopColor="#2D6FB8" />
          </linearGradient>
        </defs>
        <path d="M4 14 H22 L26 18 H52 V46 Q52 50 48 50 H8 Q4 50 4 46 Z" fill="url(#folderBack)" />
        <path d="M4 22 H52 V46 Q52 50 48 50 H8 Q4 50 4 46 Z" fill="url(#folderGrad)" />
        <rect x="4" y="22" width="48" height="2" fill="rgba(255,255,255,0.35)" />
      </svg>
    );
  }
  return (
    <svg width="56" height="56" viewBox={`-4 0 ${W + 8} ${H + 4}`}>
      <defs>
        <linearGradient id={`doc-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E2E6" />
        </linearGradient>
      </defs>
      <path d={docPath} fill={`url(#doc-${kind})`} stroke="rgba(0,0,0,0.15)" />
      <path d={foldPath} fill="#C7C7CC" />
      <path d={`M${W - fold} 0 V${fold} H${W}`} fill="none" stroke="rgba(0,0,0,0.18)" />
      {/* Type badge */}
      {kind === "txt" && (
        <g>
          <rect x="6" y={H - 18} width="20" height="10" rx="2" fill="#8E8E93" />
          <text x="16" y={H - 10} textAnchor="middle" fontSize="7" fontWeight="700" fill="white">TXT</text>
        </g>
      )}
      {kind === "msg" && (
        <g>
          <rect x="6" y={H - 18} width="22" height="10" rx="2" fill="#0A84FF" />
          <text x="17" y={H - 10} textAnchor="middle" fontSize="7" fontWeight="700" fill="white">MSG</text>
        </g>
      )}
      {kind === "pdf" && (
        <g>
          <rect x="6" y={H - 18} width="20" height="10" rx="2" fill="#FF453A" />
          <text x="16" y={H - 10} textAnchor="middle" fontSize="7" fontWeight="700" fill="white">PDF</text>
        </g>
      )}
      {/* Lines to suggest content */}
      {kind !== "msg" && (
        <g stroke="#C7C7CC" strokeWidth="1.2" strokeLinecap="round">
          <line x1="8" y1="14" x2={W - fold - 4} y2="14" />
          <line x1="8" y1="20" x2={W - 8} y2="20" />
          <line x1="8" y1="26" x2={W - 12} y2="26" />
          <line x1="8" y1="32" x2={W - 8} y2="32" />
        </g>
      )}
      {kind === "msg" && (
        <g>
          <rect x="8" y="12" width="32" height="22" rx="3" fill="none" stroke="#0A84FF" strokeWidth="1.4" />
          <path d="M8 14 L24 26 L40 14" fill="none" stroke="#0A84FF" strokeWidth="1.4" />
        </g>
      )}
    </svg>
  );
}

function DesktopSidebar({ selected, setSelected, openApp }) {
  const items = [
    { id: "about", kind: "txt", label: "about_me.txt", route: "/about" },
    { id: "projects", kind: "folder", label: "projects", route: "/projects" },
    { id: "contact", kind: "msg", label: "contact.msg", route: "/contact" },
    { id: "cv", kind: "pdf", label: "aden_guo_cv.pdf", route: "/cv" },
  ];
  return (
    <div className="absolute left-4 top-12 flex flex-col gap-3 z-10">
      {items.map((it) => (
        <DesktopIcon
          key={it.id}
          kind={it.kind}
          label={it.label}
          selected={selected === it.id}
          onSelect={() => setSelected(it.id)}
          onOpen={() => openApp(it.id)}
        />
      ))}
    </div>
  );
}

// ============================================================
// DOCK — magnification on hover
// ============================================================
const DOCK_APPS = [
  { id: "finder", label: "Finder", color: "#1E88E5", icon: "finder", running: true },
  { id: "home", label: "Home", color: "#34C759", icon: "home", running: true },
  { id: "about", label: "About", color: "#FF9500", icon: "notes", running: false },
  { id: "projects", label: "Projects", color: "#5856D6", icon: "folder", running: true },
  { id: "contact", label: "Contact", color: "#0A84FF", icon: "mail", running: false },
  { id: "cv", label: "CV", color: "#FF3B30", icon: "preview", running: false },
  { id: "sep", label: "", icon: "sep", running: false },
  { id: "trash", label: "Trash", icon: "trash", running: false },
];

function DockIconGlyph({ icon }) {
  const s = { width: "70%", height: "70%" };
  if (icon === "finder") return (
    <svg viewBox="0 0 64 64" style={s}>
      <defs>
        <linearGradient id="finderG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7BC1FF" /><stop offset="1" stopColor="#1E88E5" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#finderG)" />
      <path d="M22 18 V30" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 18 V30" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 40 Q32 50 42 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
  if (icon === "home") return (
    <svg viewBox="0 0 64 64" style={s}>
      <rect width="64" height="64" rx="14" fill="#0a0a18" />
      <path d="M14 32 L32 14 L50 32 V50 H38 V38 H26 V50 H14 Z" fill="#34C759" />
    </svg>
  );
  if (icon === "notes") return (
    <svg viewBox="0 0 64 64" style={s}>
      <rect width="64" height="64" rx="14" fill="#FFEFB0" />
      <rect x="0" y="0" width="64" height="14" fill="#FFD86B" />
      <g stroke="#C9A24B" strokeWidth="1.5">
        <line x1="10" y1="26" x2="54" y2="26" />
        <line x1="10" y1="34" x2="54" y2="34" />
        <line x1="10" y1="42" x2="44" y2="42" />
        <line x1="10" y1="50" x2="50" y2="50" />
      </g>
    </svg>
  );
  if (icon === "folder") return (
    <svg viewBox="0 0 64 64" style={s}>
      <defs>
        <linearGradient id="dfG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CC2FF" /><stop offset="1" stopColor="#3A8DDB" />
        </linearGradient>
      </defs>
      <path d="M4 18 H24 L30 24 H60 V52 Q60 56 56 56 H8 Q4 56 4 52 Z" fill="#2D6FB8" />
      <path d="M4 26 H60 V52 Q60 56 56 56 H8 Q4 56 4 52 Z" fill="url(#dfG)" />
    </svg>
  );
  if (icon === "mail") return (
    <svg viewBox="0 0 64 64" style={s}>
      <defs>
        <linearGradient id="mailG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7BC1FF" /><stop offset="1" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#mailG)" />
      <rect x="10" y="18" width="44" height="28" rx="3" fill="white" />
      <path d="M10 20 L32 36 L54 20" fill="none" stroke="#0A84FF" strokeWidth="2.5" />
    </svg>
  );
  if (icon === "preview") return (
    <svg viewBox="0 0 64 64" style={s}>
      <rect width="64" height="64" rx="14" fill="#1c1c1e" />
      <circle cx="28" cy="28" r="14" fill="none" stroke="#FF3B30" strokeWidth="4" />
      <line x1="38" y1="38" x2="50" y2="50" stroke="#FF3B30" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
  if (icon === "trash") return (
    <svg viewBox="0 0 64 64" style={s}>
      <rect width="64" height="64" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" />
      <path d="M20 22 H44 V48 Q44 52 40 52 H24 Q20 52 20 48 Z" fill="none" stroke="white" strokeWidth="2.4" />
      <path d="M16 22 H48" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 18 Q26 14 32 14 Q38 14 38 18" fill="none" stroke="white" strokeWidth="2.4" />
    </svg>
  );
  return null;
}

function Dock({ openApp, openWindows }) {
  const [mouseX, setMouseX] = useState(null);
  const dockRef = useRef(null);
  const [iconPositions, setIconPositions] = useState([]);

  // Get center x of each icon for distance calc
  const itemRefs = useRef([]);
  useEffect(() => {
    const update = () => {
      setIconPositions(
        itemRefs.current.map((el) => {
          if (!el) return 0;
          const r = el.getBoundingClientRect();
          return r.left + r.width / 2;
        })
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const baseSize = 56;
  const maxSize = 86;
  const range = 100; // px of influence

  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center z-40 pointer-events-none">
      <div
        ref={dockRef}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
        className="pointer-events-auto flex items-end gap-2 px-3 pt-2 pb-2 rounded-[22px]"
        style={glass("dock")}
      >
        {DOCK_APPS.map((app, i) => {
          if (app.icon === "sep") {
            return <div key="sep" className="w-px h-12 mx-1 bg-white/20" />;
          }
          let size = baseSize;
          let lift = 0;
          if (mouseX != null && iconPositions[i]) {
            const dist = Math.abs(mouseX - iconPositions[i]);
            if (dist < range) {
              const f = 1 - dist / range;
              const eased = Math.cos((1 - f) * Math.PI / 2); // smooth
              size = baseSize + (maxSize - baseSize) * eased;
              lift = -8 * eased;
            }
          }
          const isOpen = openWindows.includes(app.id) || app.running;
          const [hovered, setHovered] = [false, () => {}]; // tooltip via title
          return (
            <div key={app.id} className="relative flex flex-col items-center" style={{ width: size, transform: `translateY(${lift}px)`, transition: mouseX == null ? "transform 220ms ease, width 220ms ease" : "none" }}>
              {/* tooltip */}
              {mouseX != null && Math.abs((mouseX || 0) - (iconPositions[i] || 0)) < 30 && (
                <div className="absolute -top-9 px-2.5 py-1 rounded-md text-[12px] text-white whitespace-nowrap" style={glass("chrome")}>
                  {app.label}
                </div>
              )}
              <button
                ref={(el) => (itemRefs.current[i] = el)}
                onClick={() => openApp(app.id)}
                title={app.label}
                className="relative rounded-[18px] active:scale-95 transition-transform"
                style={{
                  width: size,
                  height: size,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
                }}
              >
                <DockIconGlyph icon={app.icon} />
              </button>
              {/* running indicator */}
              <div
                className="rounded-full mt-0.5"
                style={{
                  width: 4,
                  height: 4,
                  background: isOpen ? "rgba(255,255,255,0.85)" : "transparent",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// WINDOW — Liquid Glass panel with traffic lights + toolbar
// ============================================================
function TrafficLights({ onClose, onMin, onMax }) {
  const [hover, setHover] = useState(false);
  const lights = [
    { c: "#FF5F57", action: onClose, glyph: "×" },
    { c: "#FEBC2E", action: onMin, glyph: "−" },
    { c: "#28C840", action: onMax, glyph: "+" },
  ];
  return (
    <div className="flex items-center gap-2" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {lights.map((l, i) => (
        <button
          key={i}
          onClick={l.action}
          className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold leading-none"
          style={{
            background: l.c,
            color: hover ? "rgba(0,0,0,0.55)" : "transparent",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.25)",
          }}
        >
          {l.glyph}
        </button>
      ))}
    </div>
  );
}

function HomeWindow({ onClose, animState }) {
  // animation: 'opening' | 'open' | 'closing'
  const [phase, setPhase] = useState(animState || "opening");
  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("open"), 320);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const scale = phase === "opening" ? 0.94 : 1;
  const opacity = phase === "opening" ? 0 : 1;

  return (
    <div
      className="absolute rounded-[12px] overflow-hidden flex flex-col"
      style={{
        ...glass("panel"),
        width: 760,
        height: 520,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 280ms ease-out",
      }}
    >
      {/* Title bar (chrome) */}
      <div
        className="h-10 flex items-center px-3 select-none"
        style={glass("chrome")}
      >
        <TrafficLights onClose={onClose} onMin={() => {}} onMax={() => {}} />
        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium text-white/90">
          home — TextEdit
        </div>
      </div>
      {/* Toolbar (TextEdit-style, decorative) */}
      <div className="h-10 px-3 flex items-center gap-1 border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <ToolbarBtn label="B" bold />
        <ToolbarBtn label="I" italic />
        <ToolbarBtn label="U" underline />
        <div className="w-px h-5 bg-white/10 mx-2" />
        <ToolbarBtn label="¶" />
        <ToolbarBtn label="⇤" />
        <ToolbarBtn label="≡" />
        <ToolbarBtn label="⇥" />
        <div className="w-px h-5 bg-white/10 mx-2" />
        <select className="bg-white/5 border border-white/10 rounded text-[12px] text-white/80 px-1.5 py-0.5">
          <option>SF Pro</option>
        </select>
        <select className="bg-white/5 border border-white/10 rounded text-[12px] text-white/80 px-1.5 py-0.5">
          <option>15</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-12 py-10 text-[15px] leading-[1.6] text-white/90">
        <div className="text-[22px] font-semibold mb-1 text-white">hi, I'm Aden Guo.</div>
        <div className="text-[13px] text-white/55 mb-6 tabular-nums">~/home/aden — last edited today</div>
        <p className="mb-4">
          I'm a frontend engineer who likes building tools that feel like they have weight and texture — interfaces that respond to the cursor, animations that feel mechanical instead of bouncy, and copy that doesn't sound like every other product page.
        </p>
        <p className="mb-4">
          This site is a desktop. Open <span className="text-system-blue underline-offset-2 underline decoration-dotted cursor-pointer">projects/</span> to see what I've been working on, double-click <span className="text-system-blue underline-offset-2 underline decoration-dotted cursor-pointer">about_me.txt</span> for the long version, or drag <span className="text-system-blue underline-offset-2 underline decoration-dotted cursor-pointer">aden_guo_cv.pdf</span> into Preview.
        </p>
        <p className="text-white/65">
          Windows snap, the dock magnifies, and the menu bar updates with whatever app is in front. Built in Next.js with framer-motion and a small reducer doing all the window-manager work.
        </p>

        <div className="mt-8 flex gap-2 flex-wrap">
          {["Next.js", "TypeScript", "Tailwind", "framer-motion", "react-rnd", "next-themes"].map(t => (
            <span key={t} className="text-[11px] px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/75">{t}</span>
          ))}
        </div>
      </div>

      {/* Resize handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" style={{
        background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)"
      }} />
    </div>
  );
}

function ToolbarBtn({ label, bold, italic, underline }) {
  return (
    <button className="w-7 h-7 rounded text-[12px] text-white/85 hover:bg-white/10 flex items-center justify-center"
      style={{
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : "none",
      }}
    >{label}</button>
  );
}

// ============================================================
// WALLPAPER — animated subtle particle/flow field via CSS
// ============================================================
function Wallpaper({ wallpaper }) {
  const w = WALLPAPERS[wallpaper] || WALLPAPERS["tahoe-dawn"];
  return (
    <div className="absolute inset-0" style={{ background: w.bg }}>
      {/* Soft moving blobs to suggest the simplex-noise wallpaper */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{
        background: "radial-gradient(50% 60% at 20% 80%, rgba(255,200,120,0.25), transparent 60%)",
        animation: "drift1 24s ease-in-out infinite alternate",
      }} />
      <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{
        background: "radial-gradient(40% 50% at 80% 30%, rgba(120,140,255,0.30), transparent 60%)",
        animation: "drift2 32s ease-in-out infinite alternate",
      }} />
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")",
      }} />
    </div>
  );
}

// ============================================================
// BOOT SCREEN
// ============================================================
function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 2400;
    let raf;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 400);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#000", opacity: progress < 0.85 ? 1 : 1 - (progress - 0.85) / 0.15 }}>
      <svg width="64" height="76" viewBox="0 0 14 16" fill="white">
        <path d="M11.182 8.46c-.02-2.05 1.674-3.04 1.751-3.087-.953-1.39-2.435-1.582-2.964-1.604-1.262-.127-2.464.745-3.106.745-.642 0-1.633-.726-2.687-.706-1.382.02-2.659.804-3.37 2.04-1.437 2.49-.366 6.176 1.034 8.197.685.99 1.5 2.103 2.566 2.062 1.03-.04 1.42-.667 2.664-.667s1.594.667 2.687.645c1.11-.02 1.812-1.008 2.49-2 .785-1.146 1.108-2.257 1.127-2.314-.025-.012-2.16-.83-2.182-3.31zM9.18 2.51c.568-.69.952-1.65.847-2.61-.82.034-1.812.547-2.4 1.236-.527.61-.99 1.586-.866 2.527.913.072 1.85-.464 2.42-1.153z" />
      </svg>
      <div className="mt-12 w-44 h-1 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-white/85" style={{ width: `${progress * 100}%`, transition: "width 60ms linear" }} />
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
function App() {
  const [tweaks, setTweaks] = window.useTweaks(TWEAKS_DEFAULTS);
  const [selected, setSelected] = useState("about");
  const [openWindows, setOpenWindows] = useState(["home"]);
  const [booting, setBooting] = useState(tweaks.showBoot);
  const [windowAnim, setWindowAnim] = useState("opening"); // for replay

  useEffect(() => {
    if (tweaks.showBoot) setBooting(true);
  }, [tweaks.showBoot]);

  const openApp = (id) => {
    if (id === "trash") return;
    if (!openWindows.includes(id) && id === "home") {
      setOpenWindows([...openWindows, id]);
    }
    // replay open animation
    setWindowAnim("closing");
    setTimeout(() => {
      if (!openWindows.includes("home")) setOpenWindows(["home"]);
      setWindowAnim("opening");
    }, 50);
  };

  const closeWindow = () => {
    setOpenWindows(openWindows.filter((w) => w !== "home"));
  };

  const replayOpen = () => {
    setOpenWindows([]);
    setTimeout(() => {
      setOpenWindows(["home"]);
      setWindowAnim("opening");
    }, 200);
  };

  const isLight = tweaks.theme === "light";

  return (
    <div
      className="relative w-screen h-screen overflow-hidden text-white"
      data-screen-label="Desktop"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
        filter: isLight ? "invert(0.9) hue-rotate(180deg)" : "none",
      }}
    >
      <Wallpaper wallpaper={tweaks.wallpaper} />
      <MenuBar appName={openWindows.length ? "TextEdit" : "Finder"} />
      <DesktopSidebar selected={selected} setSelected={setSelected} openApp={openApp} />

      {openWindows.includes("home") && (
        <HomeWindow onClose={closeWindow} animState={windowAnim} key={windowAnim + openWindows.length} />
      )}

      <Dock openApp={openApp} openWindows={openWindows} />

      {/* Replay sample animation button (small, bottom-left) */}
      <button
        onClick={replayOpen}
        className="absolute bottom-3 left-3 z-50 text-[12px] px-3 py-1.5 rounded-full text-white/90 hover:bg-white/10"
        style={glass("chrome")}
      >
        ↻ Replay window open
      </button>

      {booting && <BootScreen onDone={() => { setBooting(false); setTweaks({ showBoot: false }); }} />}

      <TweaksUI tweaks={tweaks} setTweaks={setTweaks} replayOpen={replayOpen} />

      <style>{`
        @keyframes drift1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px,-30px) scale(1.1); } }
        @keyframes drift2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-50px,40px) scale(1.15); } }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
      `}</style>
    </div>
  );
}

function TweaksUI({ tweaks, setTweaks, replayOpen }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Wallpaper">
        <TweakRadio
          value={tweaks.wallpaper}
          onChange={(v) => setTweaks({ wallpaper: v })}
          options={[
            { value: "tahoe-dawn", label: "Tahoe Dawn" },
            { value: "tahoe-night", label: "Tahoe Night" },
            { value: "sequoia", label: "Sequoia" },
            { value: "sonoma", label: "Sonoma" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Sample">
        <TweakButton onClick={replayOpen}>Replay window open</TweakButton>
        <TweakToggle
          label="Show boot screen"
          value={tweaks.showBoot}
          onChange={(v) => setTweaks({ showBoot: v })}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
