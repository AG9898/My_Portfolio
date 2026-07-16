/**
 * Bites showcase content layer.
 *
 * Typed, UI-free content constants for the Bites showcase window. The page
 * component (four-panel Overview / Features / Tech Stack / Links layout, matching
 * Techy and PigeonCoop) consumes these constants; this module renders nothing and
 * registers no window.
 *
 * Grounded strictly in the Bites source docs: README.md, docs/PRD.md,
 * docs/ARCHITECTURE.md, docs/STYLEGUIDE.md, and package.json.
 *
 * Access rule: both the Bites deployment and its repository are private. This
 * module intentionally contains NO deployed-site URL, repository URL, href, or
 * outbound link target. The only paths here are local `/bites/*` static asset
 * references (screenshots + workflow diagram) consumed by the image renderer.
 */

export type BitesSection = "overview" | "features" | "stack" | "links";

export interface BitesNavItem {
  id: BitesSection;
  label: string;
  sub: string;
}

/** Four-panel sidebar navigation, in fixed order. */
export const BITES_NAV: BitesNavItem[] = [
  { id: "overview", label: "Overview", sub: "Project detail" },
  { id: "features", label: "Features", sub: "Scope" },
  { id: "stack", label: "Tech Stack", sub: "Dependencies" },
  { id: "links", label: "Links", sub: "Access" },
];

/** Breadcrumb / window label prefix used across panels. */
export const BITES_LABEL = "bites.app";

export interface BitesStatusChip {
  /** Short chip text. */
  label: string;
  /**
   * Visual tone hint for the chip. "private" chips carry a lock affordance;
   * "info" chips are plain metadata. No tone implies a live/public URL — there
   * is none.
   */
  tone: "private" | "info";
}

/**
 * Status / meta chips for the Overview header. Bites has shipped no public
 * surface: both the app and the repo are private, so the chips describe what the
 * project is rather than linking anywhere.
 */
export const BITES_STATUS: BitesStatusChip[] = [
  { label: "Private deployment", tone: "private" },
  { label: "Private repository", tone: "private" },
  { label: "Mobile-first PWA", tone: "info" },
  { label: "Single-owner tool", tone: "info" },
];

/** Overview headline + descriptive paragraphs. */
export const BITES_OVERVIEW = {
  title: "Bites",
  tagline: "Turn shared TikTok food videos into places worth remembering.",
  paragraphs: [
    "Bites is a single-owner, mobile-first Progressive Web App that turns shared TikTok food posts into verified, saved places on a personal map. You paste (or share) a TikTok link; Bites parses the public post server-side, extracts the featured venues, verifies each against Google Places, and — after you confirm any uncertain matches — saves them as pins you can browse on a map and in a searchable list.",
    "The core domain insight from discovery is that one TikTok source (especially a photo/slideshow roundup) can represent several real places. Bites models a source post, the place candidates it produces, and the confirmed places you keep as three separate entities, so a single import can fan out into many pins while every saved place still traces back to its slide/frame evidence and source URL.",
    "It is deliberately a personal tool. An owner login gates every page and API before any data is visible, extraction is programmatic (no LLM or vision service), and the app is built to be installed on a phone home screen and used one-handed. Both the deployment and the repository are private, so this showcase documents the shipped architecture, screens, and import flow rather than linking to them.",
  ],
} as const;

export interface BitesImageDims {
  width: number;
  height: number;
}

/**
 * Intrinsic pixel dimensions for every `/bites/*` asset produced by V2_027,
 * keyed by asset path. Used to size the image renderer and lightbox without
 * layout shift.
 */
export const BITES_IMAGE_DIMS: Record<string, BitesImageDims> = {
  "/bites/bites-add-link.png": { width: 390, height: 844 },
  "/bites/bites-map.png": { width: 390, height: 844 },
  "/bites/bites-place-detail.png": { width: 390, height: 844 },
  "/bites/bites-places-list.png": { width: 418, height: 800 },
  "/bites/bites-workflow.svg": { width: 640, height: 2261 },
};

export interface BitesScreenshot {
  /** Local static asset path (not an outbound link). */
  src: string;
  /** Specific, accessible alt text describing the actual screen. */
  alt: string;
  /** Short caption for grid/gallery display. */
  caption: string;
  width: number;
  height: number;
}

/**
 * Screenshot metadata for the deployed Bites surfaces. Every image asset shipped
 * by V2_027 is referenced here (the workflow diagram is separate, in
 * BITES_WORKFLOW). Alt text is specific to each screen for screen-reader use.
 */
export const BITES_SCREENSHOTS: BitesScreenshot[] = [
  {
    src: "/bites/bites-map.png",
    alt: "Bites map screen on a phone: a warm-toned MapLibre map with color-coded category pins for saved places, a saved-place count and category filter chips above a bottom tab bar with a central Add-link button.",
    caption: "Saved places on the map",
    width: 390,
    height: 844,
  },
  {
    src: "/bites/bites-place-detail.png",
    alt: "Expanded Bites place sheet showing a venue's provider facts — rating with review count, category, and address — above a photo gallery, an hours row, and a persistent Directions action.",
    caption: "Expanded place detail sheet",
    width: 390,
    height: 844,
  },
  {
    src: "/bites/bites-places-list.png",
    alt: "Bites List view grouping saved places by category, each row showing the place name, a category color, and a rating, with a search field and category filter chips at the top.",
    caption: "Searchable saved-places list",
    width: 418,
    height: 800,
  },
  {
    src: "/bites/bites-add-link.png",
    alt: "Bites Add-link screen with a labeled TikTok URL field and a Find places button — the primary import entry point — inside the mobile PWA shell.",
    caption: "Add-link import entry point",
    width: 390,
    height: 844,
  },
];

/** Assets to surface in the Overview panel's screenshot grid. */
export const BITES_OVERVIEW_SCREENSHOTS: BitesScreenshot[] = [
  BITES_SCREENSHOTS[0],
  BITES_SCREENSHOTS[2],
];

export interface BitesFeature {
  title: string;
  detail: string;
  /** Optional supporting screenshots (local asset paths). */
  images?: string[];
}

/**
 * Detailed feature cards for the Features panel. Every entry is grounded in the
 * Bites docs — no placeholder or invented capability.
 */
export const BITES_FEATURES: BitesFeature[] = [
  {
    title: "Paste-or-share TikTok import with server-side parsing",
    detail:
      "The Add-link screen posts a TikTok URL to a same-origin import endpoint. The server normalizes the URL, resolves short links, extracts the creator and post ID, fetches the public page with a browser-like user agent, and parses the hydration JSON with an oEmbed fallback. It distinguishes standard videos from photo/slideshow posts and retries a `/photo/` post via `/video/{id}`, verifying the returned post ID matches before trusting it. Invalid, private, region-locked, and unsupported posts each map to a distinct, user-safe message.",
    images: ["/bites/bites-add-link.png"],
  },
  {
    title: "Uncertainty-first candidate review",
    detail:
      "Import never silently auto-saves a map result. Each source post produces one independently actionable stacked evidence card per venue, showing the extracted evidence, the proposed provider match when one exists, and a visible confidence badge. High-confidence unique matches may be preselected; ambiguous or low-confidence matches require explicit confirmation; and a card that is not a real place can be discarded. Confirm, Correct, and Discard each target their own candidate endpoint — a preselection alone can never save.",
  },
  {
    title: "Programmatic extraction (no LLM)",
    detail:
      "Extraction is entirely programmatic. Server-side Tesseract.js OCR reads immediately-supplied slide images, WebVTT video captions are parsed, and all text is normalized into timestamped, source-tagged evidence. It derives at most one candidate per non-cover venue slide or frame; captions and hashtags stay geographic context unless a caption is an explicit, repeated venue list. Recipe and commentary posts stay candidate-free while explicit creator roundups are preserved.",
  },
  {
    title: "Google Places verification and cached snapshots",
    detail:
      "A thin server-side places adapter verifies candidate names with an IDs-only Text Search, resolving stable place IDs, coordinates, and formatted addresses. A provider display name must substantively agree with the extracted venue name before it is shown or preselected. After an explicit save, one typed Place Details request fetches durable, capped card data — Maps link, rating, hours, up to three photos, and up to five attributed reviews — cached as a point-in-time snapshot. The provider key is server-only and the browser never calls Google.",
  },
  {
    title: "MapLibre map surface with category and status filters",
    detail:
      "The map renders saved places from same-origin `GET /api/places` using MapLibre GL JS over keyless OpenFreeMap vector tiles, styled with a quiet warm Bites palette. It owns custom category pins (dining, cafe, dessert, bar), a saved-place count, category filter chips, nearby-place clusters, and zoom controls. Selecting a pin opens the Bites-owned place sheet directly rather than a default MapLibre popup, and the visit-status filter combines with the category filter entirely client-side over the already-fetched data.",
    images: ["/bites/bites-map.png", "/bites/bites-place-detail.png"],
  },
  {
    title: "Searchable list sharing one data contract",
    detail:
      "The List view fetches the same `GET /api/places` DTO and parses it through the shared parser the map uses, so the two surfaces can never disagree about what a saved place is. A single text search matches place name, formatted address, and tags, and combines with category filter chips; results group under a per-category heading in fixed order. Each list card opens the same place sheet the map uses, and distinct loading, empty, no-results, and error states are all visible.",
    images: ["/bites/bites-places-list.png"],
  },
  {
    title: "Manual place entry without a TikTok post",
    detail:
      "A place can be added directly by name from the List view's Add-a-place tab: the server runs the same free IDs-only Text Search plus narrow previews, capped at five selectable listings, without filtering against the query text. The chosen listing is re-validated, given one rich Place Details request, and upserted as a confirmed place with no candidate and no source link. It then flows through the same saved-place DTO as any imported place, with no source attribution.",
  },
  {
    title: "Personal visit status",
    detail:
      "Every saved place carries the owner's own visit status — visited, planned, or no status yet — as personal state that is never derived from Google, TikTok evidence, or a candidate decision. It is set only from the place detail sheet and displayed on both the map pin and the list entry; the map also filters on it. The enum has no explicit \"none\" member, so \"not looked at yet\" is the default for every row and clearing a status is a plain null write. Status writes are optimistic and roll back on failure.",
  },
  {
    title: "Installable PWA with offline fallback and share target",
    detail:
      "Bites is installable to a phone home screen. `@vite-pwa/sveltekit` runs in injectManifest mode: the service worker precaches the built app shell plus a static offline page and intercepts only navigation requests network-first, never caching `/api/*`, so imports, verification, and the saved map are honestly online-only. The web manifest declares a GET share_target so the Android share sheet can hand a TikTok link to `/add-link`, which only prefills the input and still requires the normal explicit submit — never an auto-submit.",
  },
  {
    title: "Single-owner auth and server-only provider boundaries",
    detail:
      "Bites requires an owner login before any page or API data is available. The owner is seeded by migration with a one-way scrypt password hash; `/login` issues an opaque session token and stores only its SHA-256 digest, sent in an HTTP-only, SameSite=Lax cookie. `hooks.server.ts` is the sole security boundary — it redirects unauthenticated pages to `/login`, returns 401 for unauthenticated `/api/*` calls, rejects cross-origin mutations, rate-limits login attempts, and applies security headers. All TikTok, Google Places, and database access lives in server modules; nothing there is importable by client code.",
  },
];

export interface BitesStackGroup {
  label: string;
  items: string[];
}

/** Grouped technology stack, grounded in package.json and ARCHITECTURE.md. */
export const BITES_STACK_GROUPS: BitesStackGroup[] = [
  {
    label: "Framework & Language",
    items: [
      "SvelteKit 2",
      "Svelte 5 (runes)",
      "TypeScript (strict)",
      "Vite 8",
      "@sveltejs/adapter-node",
    ],
  },
  {
    label: "UI & Styling",
    items: [
      "Project-owned CSS + design tokens",
      "Melt UI (accessible primitives)",
      "Lucide Svelte icons",
      "Plus Jakarta Sans (@fontsource-variable)",
    ],
  },
  {
    label: "Map & Geo",
    items: ["MapLibre GL JS", "OpenFreeMap vector tiles (keyless)"],
  },
  {
    label: "Extraction Pipeline",
    items: [
      "Tesseract.js OCR (server-side)",
      "WebVTT caption parsing",
      "Programmatic candidate derivation (no LLM)",
    ],
  },
  {
    label: "Places Provider",
    items: [
      "Google Places API (New)",
      "IDs-only Text Search + typed Place Details",
      "Server-only API key + media proxy",
    ],
  },
  {
    label: "Database & ORM",
    items: [
      "Neon PostgreSQL (serverless)",
      "Drizzle ORM",
      "drizzle-kit (migrations)",
      "postgres.js pool (server-only)",
    ],
  },
  {
    label: "PWA & Offline",
    items: [
      "@vite-pwa/sveltekit (injectManifest)",
      "Custom service worker (network-first navigation)",
      "Static offline fallback page",
      "Web manifest GET share_target",
    ],
  },
  {
    label: "Hosting & Runtime",
    items: ["Railway (adapter-node)", "Node >= 22"],
  },
  {
    label: "Tooling",
    items: ["Vitest", "svelte-check", "ESLint", "Prettier", "typescript-eslint"],
  },
];

/**
 * Architecture rules / boundaries surfaced under the Tech Stack panel. Each is a
 * durable constraint from ARCHITECTURE.md or STYLEGUIDE.md.
 */
export const BITES_ARCHITECTURE_NOTES: string[] = [
  "One SvelteKit app: `+server.ts` endpoints are the backend — there is no separate backend service.",
  "All TikTok fetching and Google Places calls run server-side; client code calls only same-origin endpoints.",
  "The domain models a source post, a place candidate, and a confirmed place as three separate entities.",
  "A confirmed place does not require a source post, so `GET /api/places` left-joins the post link rather than requiring it.",
  "Signed TikTok media, caption, and image URLs are ephemeral — used at fetch time, never stored as durable links.",
  "`hooks.server.ts` is the single security boundary: owner-session resolution, page redirects, 401 API responses, exact-origin mutation checks, and security headers.",
  "The Google Places key never reaches client code; provider photos are streamed through a same-origin media proxy.",
  "The map and the list render one shared saved-place DTO through one parser, so they can never disagree about valid data.",
  "`visit_status` is personal owner state, never derived from Google or TikTok; SQL NULL means \"no status yet\".",
  "The cached provider snapshot is point-in-time and nullable — it excludes any open/closed state and is never treated as live provider data.",
  "Schema changes apply through generated Drizzle migrations only — never a direct ALTER TABLE.",
];

export interface BitesWorkflow {
  /** Rendered diagram asset (local path). */
  src: string;
  /** Editable mermaid source path, colocated with this module. */
  source: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Ordered high-level stages the diagram depicts. */
  stages: string[];
}

/**
 * Import-to-map workflow diagram metadata. The rendered SVG is shipped by
 * V2_027; the editable mermaid source is kept alongside this module.
 */
export const BITES_WORKFLOW: BitesWorkflow = {
  src: "/bites/bites-workflow.svg",
  source: "src/app/bites/bites-workflow.mmd",
  alt: "Bites import-to-map workflow diagram. Pasting a TikTok URL (POST /api/import) flows through a transient stage — URL normalization, public-page fetch and hydration parsing, Tesseract OCR and caption extraction, candidate derivation with evidence and confidence, and Google Places IDs-only verification — into an explicit user review gate that confirms, corrects, or discards each candidate. Confirmed matches take one typed Place Details fetch and an atomic Drizzle/Neon write of the confirmed place, source-post link, and candidate evidence; discards write nothing. The saved data is served by GET /api/places and rendered by both the MapLibre map and the searchable List from the same DTO.",
  caption:
    "URL import → TikTok parsing → OCR/evidence → Places verification → confirm/correct/discard → Place Details → Drizzle/Neon → GET /api/places → MapLibre/List",
  width: 640,
  height: 2261,
  stages: [
    "Paste or share a TikTok URL (POST /api/import)",
    "Normalize URL, resolve short link, extract creator + post ID",
    "Fetch public page and parse hydration JSON (oEmbed fallback)",
    "OCR slides and parse WebVTT captions into typed evidence",
    "Derive place candidates with evidence and confidence",
    "Verify against Google Places (IDs-only Text Search)",
    "Explicit user review: confirm / correct / discard",
    "Place Details fetch and atomic Drizzle/Neon write (or discard)",
    "Serve saved-place DTO via GET /api/places",
    "Render on the MapLibre map and the searchable List",
  ],
};

export interface BitesAccessNotice {
  title: string;
  body: string;
  /** Additional clarifying lines; still no URLs or link targets. */
  points: string[];
}

/**
 * Links-panel copy. Both the app and the repository are private, so this panel
 * states the access situation and offers NO deployed URL, repository URL, or any
 * outbound link.
 */
export const BITES_ACCESS: BitesAccessNotice = {
  title: "Access is private",
  body: "Both the Bites app and its source repository are private and single-owner. There is no public link to the live PWA or to the code — this showcase documents the shipped product, architecture, and import flow instead.",
  points: [
    "The deployment is gated behind owner authentication; an unauthenticated browser cannot view any page or call any API.",
    "The source repository is private and is not linked from this portfolio.",
    "Screenshots and the workflow diagram above use real deployed data captured for this showcase.",
  ],
};
