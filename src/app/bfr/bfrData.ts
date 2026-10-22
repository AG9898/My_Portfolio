// ─── BFR showcase content ─────────────────────────────────────────────────────
// Typed, UI-free source for the /bfr window. Metrics are a snapshot taken on
// 2026-10-22 from Supabase auth/PostgREST counts, the Discord invite API, and
// Vercel billing usage. No game art is used anywhere in the showcase: neither
// the original Brave Frontier assets nor BFR's own generated art.

export type BfrSection = "overview" | "scaling" | "stack" | "links";

export const BFR_NAV: { id: BfrSection; label: string; sub: string }[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "scaling", label: "Scaling", sub: "Launch week" },
  { id: "stack", label: "Tech Stack", sub: "Architecture" },
  { id: "links", label: "Links", sub: "Play & community" },
];

export const BFR_SNAPSHOT_DATE = "22 October 2026";

export const BFR_DISCLAIMER =
  "BFR is an unofficial, non-commercial fan revival of Brave Frontier. It is not affiliated with Alim Co., Ltd. or gumi Inc., who own Brave Frontier and its characters, art, music, and trademarks. The engineering shown here is mine; the game it revives is theirs.";

export const BFR_STATS: { value: string; label: string; detail: string }[] = [
  {
    value: "10,830",
    label: "player accounts",
    detail: "in the first 10 days after the 13 Oct launch",
  },
  {
    value: "7,784",
    label: "weekly active players",
    detail: "signed in during the last 7 days",
  },
  {
    value: "1.6M",
    label: "requests per day",
    detail: "CDN requests on Vercel, launch week average",
  },
  {
    value: "1,370",
    label: "Discord members",
    detail: "community server I run alongside the game",
  },
];

export const BFR_OVERVIEW: string[] = [
  "BFR (Brave Frontier: Reborn) brings back Brave Frontier, a mobile RPG that was shut down, as a free game that runs in the browser. I built it solo in about a month: first commit on 23 September 2026, public launch on 13 October. Players sign in with Google or Discord, summon units, build squads, and fight turn-based battles through story areas, trials, and farming dungeons, with leveling, fusion, evolution, and daily login rewards.",
  "It grew faster than it was designed for. About 400 players arrived on launch day and roughly 1,000 new accounts a day followed, so most of the interesting work happened live: finding what broke under real load and reworking the architecture without taking the game down for long.",
  "I also run the game's Discord server, which handles announcements, maintenance windows, and bug reports. In-game broadcasts, gifts, and known-issue banners are driven from scripts so I can talk to every player at once.",
];

export const BFR_GAMEPLAY_VOLUME: { value: string; label: string }[] = [
  { value: "916k", label: "summons rolled" },
  { value: "947k", label: "units owned" },
  { value: "~1M", label: "battle rewards verified server-side" },
  { value: "323k", label: "quest progress records" },
];

export const BFR_BUILD_FACTS: { value: string; label: string }[] = [
  { value: "1,010", label: "commits in one month" },
  { value: "~175k", label: "lines of TypeScript" },
  { value: "96", label: "Postgres migrations" },
  { value: "~400", label: "test files (Vitest + pgTAP)" },
];

// Daily Vercel function invocations for the bfr project (billing usage export).
// The static-menu migration (RESOLVED-178) shipped during 15 Oct.
export const BFR_INVOCATIONS: { day: string; value: number; phase: "before" | "after" }[] = [
  { day: "14 Oct", value: 2_661_561, phase: "before" },
  { day: "15 Oct", value: 2_129_861, phase: "before" },
  { day: "16 Oct", value: 272_056, phase: "after" },
  { day: "17 Oct", value: 294_380, phase: "after" },
  { day: "18 Oct", value: 313_588, phase: "after" },
  { day: "19 Oct", value: 315_837, phase: "after" },
  { day: "20 Oct", value: 345_280, phase: "after" },
];

export const BFR_SCALING_HEADLINE =
  "Server work cut by about 88% while traffic stayed flat";

export const BFR_SCALING_SUMMARY =
  "Two days after launch, every menu screen was still rendered on a server for each request, about 2.7 million function calls a day. In one day I rebuilt the menus as static pages served from the CDN, with the player's data loaded in the browser. Only four routes still run server code: battle verification, battle continue, the sign-in callback, and sign-out. Function calls fell to about 300,000 a day and Vercel compute time dropped from about 17 hours to about 3 hours a day, while CDN requests held at about 1.6 million a day.";

export const BFR_SCALING_STEPS: { title: string; detail: string }[] = [
  {
    title: "Survived the launch-day database outage",
    detail:
      "About 400 players on launch day drove roughly 38,000 database requests an hour, which used up the free Supabase tier's disk throughput and took the database down for about four hours. I moved it to a paid compute tier, then went after the request volume itself. Within days it was serving peaks of about 84,000 requests and 1,365 finished battles an hour.",
  },
  {
    title: "Static menus, CDN delivery",
    detail:
      "Menus became static client screens that read the player's state from one cached store. Game content ships as content-hashed JSON, and build output is served from a Cloudflare Workers CDN. A retention manifest keeps the last few builds available, so open tabs keep working through a deploy. A build-time check fails the deploy if any other route starts running server code.",
  },
  {
    title: "Fewer database calls per screen",
    detail:
      "Menu loads were combined into single RPCs, cutting database requests per screen by 45–80%. The roster and daily-clear counts now load once per page: the roster lookup alone had run 1.83 million times, about ten per battle.",
  },
  {
    title: "Database write load",
    detail:
      "Reward grants had written about 46 GB of write-ahead log over roughly a million calls. Switching log tables to time-ordered UUIDv7 keys, plus a pg_cron job that prunes logs and old battle sessions in batches of 5,000 every five minutes, keeps the growing tables cheap to write.",
  },
  {
    title: "Release safety",
    detail:
      "A prerendered version endpoint, built per deploy, lets open games detect a new build and show a refresh banner. That banner becomes required when game content changes. Production deploys wait on CI: lint, typecheck, four parallel test shards, content validation, then migrations pushed to the hosted database.",
  },
];

export const BFR_STACK_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Web App",
    items: ["Next.js 16 (App Router)", "React 19", "Tailwind CSS 4", "Phaser 3 (battle scene)", "TypeScript"],
  },
  {
    label: "Game Engine & Data",
    items: [
      "Pure TypeScript battle engine",
      "Seeded deterministic RNG",
      "zod-validated game content",
      "pnpm monorepo",
    ],
  },
  {
    label: "Backend",
    items: [
      "Supabase Postgres",
      "Row Level Security",
      "security definer RPCs",
      "Supabase Auth (Google + Discord OAuth)",
      "pg_cron",
    ],
  },
  {
    label: "Hosting & Delivery",
    items: ["Vercel (Fluid Compute)", "Cloudflare Workers static assets", "Content-hashed JSON"],
  },
  {
    label: "Quality & Delivery",
    items: ["Vitest (sharded)", "pgTAP database tests", "Biome", "GitHub Actions", "Vercel Deployment Checks"],
  },
];

export const BFR_ARCHITECTURE_NOTES: string[] = [
  "The battle engine has no DOM, network, clock, or Math.random: every roll comes from a seeded generator and every outcome is emitted as an event log. Phaser only animates those events, so the same engine runs in the browser and on the server.",
  "Anti-cheat by replay: starting a battle stores the seed and a squad snapshot; finishing posts only the player's input log, which the server replays before a service-role-only database function grants rewards. A battle can only be claimed once.",
  "Players can read only their own rows, and every write goes through a database function. No RPC accepts a user id, and summons and drops are rolled inside Postgres.",
  "One active session per player, enforced with the browser Web Locks API plus a server-side refusal, so the same account cannot be played in two tabs at once.",
];

export type BfrNode = { title: string; detail: string };

export const BFR_ARCHITECTURE: { lane: string; nodes: BfrNode[] }[] = [
  {
    lane: "Browser",
    nodes: [
      { title: "Static client screens", detail: "Menus, roster, summon, quests" },
      { title: "Phaser battle scene", detail: "Animates the engine's event log" },
    ],
  },
  {
    lane: "Edge",
    nodes: [
      { title: "Cloudflare Workers CDN", detail: "Build output, hashed content JSON" },
      { title: "Vercel", detail: "4 function routes, prerendered version endpoint" },
    ],
  },
  {
    lane: "Data",
    nodes: [
      { title: "Supabase Postgres", detail: "RLS reads, security definer writes" },
      { title: "Server replay", detail: "Verifies battles before rewards" },
    ],
  },
];

export const BFR_LINKS = {
  site: { href: "https://rebornbf.com", label: "rebornbf.com" },
  discord: { href: "https://discord.gg/Fz8byyzGf5", label: "discord.gg/Fz8byyzGf5" },
};
