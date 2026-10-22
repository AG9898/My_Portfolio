export type Category = "frontend" | "agent-tools" | "client-work";

export type Project = {
  name: string;
  kind: string;
  status: string;
  path: string;
  description: string;
  stack: string[];
  category: Category;
  link: string | null;
  thumbnail?: {
    src: string;
    alt: string;
  };
};

export const PROJECTS: Project[] = [
  {
    name: "PigeonCoop",
    kind: "Desktop workflow tool",
    status: "Active development",
    path: "~/projects/PigeonCoop",
    description:
      "A local-first Tauri app for designing, running, monitoring, and replaying agent workflows through a game-inspired 2D interface.",
    stack: ["Rust", "Tauri", "React", "SQLite"],
    category: "agent-tools",
    link: "https://github.com/AG9898/PigeonCoop",
    thumbnail: {
      src: "/PigeonCoop/Pigeon-workspace.png",
      alt: "PigeonCoop workflow workspace",
    },
  },
  {
    name: "Cloo",
    kind: "Terminal multiplexer",
    status: "Pre-alpha · M9 visual alignment",
    path: "~/projects/cloo",
    description:
      "A public, MIT-licensed Rust client-server terminal multiplexer for concurrent coding-agent workspaces. Its daemon owns persistent PTYs, terminal grids, tabs, panes, and layout state while thin clients attach over a Unix socket; the functional pre-alpha runtime is undergoing its M9 visual-fidelity pass.",
    stack: ["Rust", "Tokio", "Linux PTYs", "alacritty_terminal"],
    category: "agent-tools",
    link: "https://github.com/AG9898/cloo",
  },
  {
    name: "Glass Atlas",
    kind: "Editorial knowledge site",
    status: "Deployed",
    path: "~/projects/Glass-Atlas",
    description:
      "A SvelteKit 2 (Svelte 5 runes) editorial knowledge site that makes a personal note library conversational. Visitors query published notes through a streaming RAG chat grounded exclusively in the author's content via hybrid pgvector + lexical retrieval, confidence-tiered fallbacks, and Gemini 2.0 Flash.",
    stack: ["SvelteKit", "TypeScript", "Drizzle + pgvector", "OpenRouter", "Bun", "Railway"],
    category: "frontend",
    link: "https://glassatlas.dev",
    thumbnail: {
      src: "/Glass-Atlas/Glass-Atlas RAG diagram.png",
      alt: "Glass Atlas retrieval-augmented generation diagram",
    },
  },
  {
    name: "Weather & Wellness",
    kind: "UBC research platform",
    status: "Deployed",
    path: "~/projects/Weather-and-Wellness-Dashboard",
    description:
      "A multi-instrument research platform for a UBC Psychology lab. RAs run validated psychological tasks (digit span, loneliness, depression, anxiety) with anonymous participants; a FastAPI backend auto-scores responses and runs weather-psychology mixed-effects models via statsmodels, with per-lab data isolation.",
    stack: ["Next.js", "FastAPI", "Supabase", "statsmodels", "Upstash Redis"],
    category: "client-work",
    link: "https://ubcpsych.com",
    thumbnail: {
      src: "/Weather-Wellness/WeatherCard.png",
      alt: "Weather and Wellness dashboard",
    },
  },
  {
    name: "buddy",
    kind: "Desktop AI coding companion",
    status: "Published · npm v1.0.1",
    path: "~/projects/buddy",
    description:
      "A floating Windows desktop pet that reacts to Codex CLI and Claude Code hook events. Install @ag9898/buddy globally to launch the Electron companion, wire hooks, and diagnose the local integration.",
    stack: ["TypeScript", "Electron", "Svelte", "Rust", "npm CLI"],
    category: "agent-tools",
    link: "https://www.npmjs.com/package/@ag9898/buddy",
    thumbnail: {
      src: "/buddy/spritesheet.webp",
      alt: "buddy pixel-art pet spritesheet",
    },
  },
];
