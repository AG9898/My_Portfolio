// ─── Get Info content ─────────────────────────────────────────────────────────
// Playful, macOS-inspector-style metadata for each desktop icon. The "comment"
// field is the Spotlight Comments box in the panel — home of the easter eggs.
// Only the desktop-shortcut apps (showInDock === false) are reachable here.

import type { AppId } from "../appMetadata";

export interface DesktopInfo {
  /** File-style display name (matches the icon label). */
  name: string;
  kind: string;
  size: string;
  /** Parenthetical byte count under the size, macOS-style. */
  bytes: string;
  where: string;
  created: string;
  modified: string;
  version: string;
  /** Spotlight Comments — the easter egg line. */
  comment: string;
}

export const DESKTOP_INFO: Partial<Record<AppId, DesktopInfo>> = {
  "glass-atlas": {
    name: "glass_atlas",
    kind: "Source-Grounded RAG Site",
    size: "12.4 MB on disk",
    bytes: "12,981,124 bytes",
    where: "/Desktop/Projects",
    created: "Sunday, 9 March 2025 at 11:42 PM",
    modified: "Today at 2:14 AM",
    version: "SvelteKit 2 · Svelte 5 runes",
    comment:
      "Always cites its sources. Unlike your group-project teammate. Hold ⌥ and it still won't hallucinate.",
  },
  weather: {
    name: "weather.dash",
    kind: "Research Platform Dashboard",
    size: "15.9 MB on disk",
    bytes: "16,672,300 bytes",
    where: "/Desktop/Projects",
    created: "Monday, 2 December 2024 at 4:20 PM",
    modified: "Today at 1:37 AM",
    version: "Multi-tenant · UBC + Yonsei Psychology",
    comment:
      "100% chance of insights, scattered dashboards by afternoon. Bring an umbrella for the p-values.",
  },
  pigeoncoop: {
    name: "pigeoncoop.app",
    kind: "Local-First Agent Workflow IDE",
    size: "21.3 MB on disk",
    bytes: "22,334,512 bytes",
    where: "/Desktop",
    created: "Thursday, 15 May 2025 at 7:07 PM",
    modified: "Today at 3:03 AM",
    version: "Rust · Tauri",
    comment:
      "Herds AI agents like pigeons. They mostly cooperate. Coo. (No agents were harmed; one got distracted.)",
  },
  buddy: {
    name: "buddy.cli",
    kind: "Desktop Pet Command-Line Tool",
    size: "3.4 MB on disk",
    bytes: "3,567,890 bytes",
    where: "/Desktop",
    created: "Friday, 25 April 2025 at 10:10 PM",
    modified: "Today at 12:44 AM",
    version: "Electron · Ragdoll build",
    comment:
      "Will judge your commits. Affectionately. Currently napping on the status bar. Do not pet during PreToolUse.",
  },
};
