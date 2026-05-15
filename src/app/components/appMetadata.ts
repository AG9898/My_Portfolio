// ─── Shared App Metadata ──────────────────────────────────────────────────────
// Single source of truth for all portfolio apps.
// Pure metadata — no state, no hooks, no runtime window geometry beyond defaults.

export type AppId =
  | "home"
  | "projects"
  | "about"
  | "contact"
  | "cv"
  | "glass-atlas"
  | "techy"
  | "sparse"
  | "weather"
  | "pigeoncoop";

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
  route: "/" | "/projects" | "/about" | "/contact" | "/cv" | "/glass-atlas" | "/techy" | "/sparse" | "/weather" | "/pigeoncoop";
  /** Short label used in dock, desktop shortcuts, and window list */
  label: string;
  /** Full title shown in the window title bar */
  title: string;
  /** Icon identifier — used by Dock and DesktopShortcuts to select the SVG */
  icon: AppId;
  /** Default window dimensions when the app is first opened */
  defaultSize: AppSize;
  /** Fallback top-left position; runtime open paths center windows in the viewport */
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
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 120, y: 60 },
  },
  {
    id: "projects",
    route: "/projects",
    label: "Projects",
    title: "Projects — Aden Guo",
    icon: "projects",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 160, y: 80 },
  },
  {
    id: "about",
    route: "/about",
    label: "About",
    title: "About — Aden Guo",
    icon: "about",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 200, y: 70 },
  },
  {
    id: "contact",
    route: "/contact",
    label: "Contact",
    title: "Contact — Aden Guo",
    icon: "contact",
    defaultSize: { width: 960, height: 620 },
    defaultPosition: { x: 240, y: 90 },
  },
  {
    id: "cv",
    route: "/cv",
    label: "CV",
    title: "CV — Aden Guo",
    icon: "cv",
    defaultSize: { width: 1040, height: 700 },
    defaultPosition: { x: 180, y: 50 },
  },
  {
    id: "glass-atlas",
    route: "/glass-atlas",
    label: "Glass Atlas",
    title: "Glass Atlas — Aden Guo",
    icon: "glass-atlas",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 160, y: 70 },
    showInDock: false,
  },
  {
    id: "techy",
    route: "/techy",
    label: "Techy",
    title: "Techy — Aden Guo",
    icon: "techy",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 160, y: 70 },
    showInDock: false,
  },
  {
    id: "sparse",
    route: "/sparse",
    label: "Sparse",
    title: "Sparse — Aden Guo",
    icon: "sparse",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 180, y: 80 },
    showInDock: false,
  },
  {
    id: "weather",
    route: "/weather",
    label: "Weather & Wellness",
    title: "Weather & Wellness — Aden Guo",
    icon: "weather",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 200, y: 90 },
    showInDock: false,
  },
  {
    id: "pigeoncoop",
    route: "/pigeoncoop",
    label: "PigeonCoop",
    title: "PigeonCoop — Aden Guo",
    icon: "pigeoncoop",
    defaultSize: { width: 1040, height: 680 },
    defaultPosition: { x: 200, y: 90 },
    showInDock: false,
  },
];
