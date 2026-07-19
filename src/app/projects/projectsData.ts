export type Category = "frontend" | "agent-tools" | "client-work" | "tooling";

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
    name: "My Portfolio",
    kind: "Next.js portfolio",
    status: "Active redesign",
    path: "~/projects/My_Portfolio",
    description:
      "A browser-based macOS desktop portfolio with a persistent shell, dock, shortcuts, route-synced windows, and first-pass app content.",
    stack: ["Next.js", "TypeScript", "Tailwind", "framer-motion"],
    category: "frontend",
    link: "https://github.com/AG9898/My_Portfolio",
    thumbnail: {
      src: "/og-image.png",
      alt: "My Portfolio macOS desktop interface",
    },
  },
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
    name: "Zellaude-Plus",
    kind: "Claude API client",
    status: "Active development",
    path: "~/projects/Zellaude-Plus",
    description:
      "An extended Claude API wrapper and chat interface with prompt-caching utilities, streaming controls, and conversation management.",
    stack: ["TypeScript", "Node.js", "Anthropic SDK"],
    category: "agent-tools",
    link: "https://github.com/AG9898/Zellaude-Plus",
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
    link: "https://glass-atlas-production.up.railway.app",
    thumbnail: {
      src: "/Glass-Atlas/Glass-Atlas RAG diagram.png",
      alt: "Glass Atlas retrieval-augmented generation diagram",
    },
  },
  {
    name: "Techy",
    kind: "Knowledge graph",
    status: "Deployed",
    path: "~/projects/Techy",
    description:
      "A personal, single-user tech knowledge graph built around notes, wikilinks, D3 graph views, Auth.js, Drizzle, and Neon PostgreSQL.",
    stack: ["SvelteKit", "TypeScript", "Drizzle", "D3"],
    category: "frontend",
    link: "https://techy-psi.vercel.app",
    thumbnail: {
      src: "/techy/graph.png",
      alt: "Techy knowledge graph view",
    },
  },
  {
    name: "Bites",
    kind: "Private food-map PWA",
    status: "Private · single-owner",
    path: "~/projects/bites",
    description:
      "A single-owner, mobile-first SvelteKit PWA that turns shared TikTok food posts into verified saved places on a personal MapLibre map. Server-side parsing and Tesseract OCR extract candidate venues, Google Places verifies each match, and an explicit confirm/correct/discard gate keeps every pin honest. Both the deployment and the repository are private.",
    stack: ["SvelteKit", "TypeScript", "Drizzle + Neon", "MapLibre GL", "Google Places"],
    category: "frontend",
    link: null,
    thumbnail: {
      src: "/bites/bites-map.png",
      alt: "Bites saved-places map",
    },
  },
  {
    name: "Sparse",
    kind: "Minimal text editor",
    status: "Local product",
    path: "~/projects/Sparse",
    description:
      "A distraction-free writing environment with a single-file approach, markdown preview, and a calm typographic baseline — no cloud sync.",
    stack: ["Electron", "TypeScript", "CodeMirror"],
    category: "tooling",
    link: null,
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
  {
    name: "Interactive MapLibre",
    kind: "Mapping playground",
    status: "Prototype",
    path: "~/projects/Interactive_MapLibre",
    description:
      "A MapLibre GL JS prototype with custom vector tile styling, dynamic layer controls, and gesture-driven navigation experiments.",
    stack: ["MapLibre GL", "TypeScript", "Vite"],
    category: "frontend",
    link: "https://github.com/AG9898/Interactive_MapLibre",
  },
  {
    name: "movieboxd",
    kind: "Movie tracker",
    status: "Prototype",
    path: "~/projects/movieboxd",
    description:
      "A Letterboxd-inspired personal movie log with a clean card-grid UI, watchlist management, and TMDB API integration.",
    stack: ["React", "TypeScript", "TMDB API", "Supabase"],
    category: "frontend",
    link: "https://github.com/AG9898/movieboxd",
  },
];
