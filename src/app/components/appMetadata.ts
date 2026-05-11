// ─── Shared App Metadata ──────────────────────────────────────────────────────
// Single source of truth for all portfolio apps.
// Pure metadata — no state, no hooks, no window geometry beyond defaults.

export type AppId =
  | "home"
  | "projects"
  | "about"
  | "contact"
  | "cv"
  | "glass-atlas"
  | "techy"
  | "sparse"
  | "weather";

export interface AppSize {
  width: number;
  height: number;
}

export interface AppPosition {
  x: number;
  y: number;
}

export interface AppMetadata {
  id: AppId;
  route: "/" | "/projects" | "/about" | "/contact" | "/cv" | "/glass-atlas" | "/techy" | "/sparse" | "/weather";
  /** Short label used in dock, desktop shortcuts, and window list */
  label: string;
  /** Full title shown in the window title bar */
  title: string;
  /** Icon identifier — used by Dock and DesktopShortcuts to select the SVG */
  icon: AppId;
  /** Default window dimensions when the app is first opened */
  defaultSize: AppSize;
  /** Default window position (top-left corner) when first opened */
  defaultPosition: AppPosition;
  /**
   * When explicitly false, this app is excluded from the Dock and shown only
   * in DesktopShortcuts. When omitted or true, the app appears in both.
   */
  showInDock?: boolean;
}

export const APPS: AppMetadata[] = [
  {
    id: "home",
    route: "/",
    label: "Home",
    title: "Home — Aden Guo",
    icon: "home",
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 120, y: 60 },
  },
  {
    id: "projects",
    route: "/projects",
    label: "Projects",
    title: "Projects — Aden Guo",
    icon: "projects",
    defaultSize: { width: 820, height: 560 },
    defaultPosition: { x: 160, y: 80 },
  },
  {
    id: "about",
    route: "/about",
    label: "About",
    title: "About — Aden Guo",
    icon: "about",
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 200, y: 70 },
  },
  {
    id: "contact",
    route: "/contact",
    label: "Contact",
    title: "Contact — Aden Guo",
    icon: "contact",
    defaultSize: { width: 680, height: 480 },
    defaultPosition: { x: 240, y: 90 },
  },
  {
    id: "cv",
    route: "/cv",
    label: "CV",
    title: "CV — Aden Guo",
    icon: "cv",
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 180, y: 50 },
  },
  {
    id: "glass-atlas",
    route: "/glass-atlas",
    label: "Glass Atlas",
    title: "Glass Atlas — Aden Guo",
    icon: "glass-atlas",
    defaultSize: { width: 900, height: 580 },
    defaultPosition: { x: 160, y: 70 },
    showInDock: false,
  },
  {
    id: "techy",
    route: "/techy",
    label: "Techy",
    title: "Techy — Aden Guo",
    icon: "techy",
    defaultSize: { width: 900, height: 620 },
    defaultPosition: { x: 160, y: 70 },
    showInDock: false,
  },
  {
    id: "sparse",
    route: "/sparse",
    label: "Sparse",
    title: "Sparse — Aden Guo",
    icon: "sparse",
    defaultSize: { width: 820, height: 580 },
    defaultPosition: { x: 180, y: 80 },
    showInDock: false,
  },
  {
    id: "weather",
    route: "/weather",
    label: "Weather & Wellness",
    title: "Weather & Wellness — Aden Guo",
    icon: "weather",
    defaultSize: { width: 820, height: 580 },
    defaultPosition: { x: 200, y: 90 },
    showInDock: false,
  },
];
