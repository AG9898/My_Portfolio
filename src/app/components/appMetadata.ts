// ─── Shared App Metadata ──────────────────────────────────────────────────────
// Single source of truth for all portfolio apps.
// Extended in V1_005A to include defaultSize, defaultPosition, and title.

export type AppId = "home" | "projects" | "about" | "contact" | "cv";

export interface AppMetadata {
  id: AppId;
  route: "/" | "/projects" | "/about" | "/contact" | "/cv";
  label: string;
  /** Icon identifier — used by Dock and DesktopShortcuts to select the SVG */
  icon: AppId;
}

export const APPS: AppMetadata[] = [
  {
    id: "home",
    route: "/",
    label: "Home",
    icon: "home",
  },
  {
    id: "projects",
    route: "/projects",
    label: "Projects",
    icon: "projects",
  },
  {
    id: "about",
    route: "/about",
    label: "About",
    icon: "about",
  },
  {
    id: "contact",
    route: "/contact",
    label: "Contact",
    icon: "contact",
  },
  {
    id: "cv",
    route: "/cv",
    label: "CV",
    icon: "cv",
  },
];
