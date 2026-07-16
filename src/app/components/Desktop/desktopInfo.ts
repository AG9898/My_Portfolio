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
  techy: {
    name: "techy.app",
    kind: "Knowledge Graph Application",
    size: "8.7 MB on disk",
    bytes: "9,126,440 bytes",
    where: "/Desktop",
    created: "Friday, 17 January 2025 at 9:03 AM",
    modified: "Yesterday at 11:58 PM",
    version: "D3 + force-directed physics",
    comment:
      "A second brain. The first one was busy. Drag a node and watch the other thoughts panic.",
  },
  sparse: {
    name: "sparse.app",
    kind: "Time & Expense Tracker",
    size: "6.1 MB on disk",
    bytes: "6,402,118 bytes",
    where: "/Desktop",
    created: "Tuesday, 4 February 2025 at 8:30 AM",
    modified: "Today at 9:01 AM",
    version: "Timesheets · Approvals · Reports",
    comment:
      "Tracks every minute — yes, including the one you spent reading this. That'll be 0.02 billable hours.",
  },
  weather: {
    name: "weather.dash",
    kind: "Research Platform Dashboard",
    size: "15.9 MB on disk",
    bytes: "16,672,300 bytes",
    where: "/Desktop/Projects",
    created: "Monday, 2 December 2024 at 4:20 PM",
    modified: "Today at 1:37 AM",
    version: "Multi-tenant · UBC Psychology",
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
  bites: {
    name: "bites.app",
    kind: "Private Food-Map PWA",
    size: "9.8 MB on disk",
    bytes: "10,276,864 bytes",
    where: "/Desktop",
    created: "Wednesday, 18 June 2025 at 8:15 PM",
    modified: "Today at 1:19 AM",
    version: "SvelteKit 2 · Single-owner",
    comment:
      "Turns your doom-scrolling into a dinner reservation. One TikTok in, several real pins out. Login required — it's a party of one.",
  },
};
