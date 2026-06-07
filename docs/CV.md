# CV Subsystem

How the portfolio's CV/résumé is authored, rendered on-site, exported to PDF, and verified. The CV opens as the `/cv` app window and is downloadable as `public/cv.pdf`.

---

## Overview

```text
src/data/resume.json            ← single source of truth (JSON Resume v1)
        │
        ├──► ResumeRenderer.tsx        on-site React/Tailwind render (/cv window)
        │
        └──► /cv/print route.ts        standalone parser-safe HTML
                     │
                     └──► scripts/export-cv.js (Puppeteer)
                                  └──► public/cv.pdf   ← downloaded artifact
```

One JSON file feeds two renderers. The on-site renderer is the interactive
window view; the `/cv/print` route is the ATS-safe HTML that Puppeteer turns
into the PDF. Both share date/URL formatting via
`src/app/components/CV/resumeFormat.ts` and **render their sections in the same
order** (see [Canonical layout](#canonical-layout)).

---

## Source of truth — `src/data/resume.json`

[JSON Resume v1](https://jsonresume.org/schema/) schema. Agent- and
human-editable; everything on the CV derives from it. Sections consumed:

| Key | Renders as | Notes |
|---|---|---|
| `basics` | Header — name, contact line, profile links | `location`, `phone`, `email`, `profiles[]`. Optional `summary` → "Professional Summary". |
| `skills[]` | Technical Skills | `{ name, keywords[] }` → `Name: kw, kw, …`. |
| `work[]` | Professional Experience | `{ name, position, location?, startDate, endDate?, summary?, highlights[]? }`. `highlights` preferred; falls back to `summary`. |
| `education[]` | Education | `{ institution, location?, studyType, area, startDate?, endDate?, courses[]? }`. `courses` → "Relevant Skills". |
| `projects[]` | Projects | `{ name, url?, description?, highlights[]? }`. |

Dates are `YYYY` or `YYYY-MM` strings. `formatDate` renders `YYYY-MM` as
`Mon YYYY`; a missing `endDate` on `work` renders as `… - Present`.

**To edit the CV, change `resume.json` — never hand-edit the renderers or the
PDF.** After editing, re-export the PDF (see below).

---

## Rendering

### `src/app/components/CV/ResumeRenderer.tsx`
`"use client"` React component, Tailwind-styled, shown inside the `/cv` window.
Includes `print:` utility variants and section anchor ids (`#contact`,
`#skills`, `#experience`, `#education`, `#projects`) used by the window's
section-nav sidebar.

### `src/app/cv/print/route.ts`
A `force-static` route handler (`GET /cv/print`) that returns a **standalone
HTML document** — its own `<head>`, inline `@page`/print CSS, no desktop shell.
This is the only parser-safe surface: it renders selectable text rather than a
rasterized window capture. The root `<main>` carries
`data-cv-print-ready="true"`, the readiness flag Puppeteer waits on.

### Shared helpers — `src/app/components/CV/resumeFormat.ts`
`formatDate`, `formatDateRange`, `displayUrl` live here and are imported by
both renderers, so date and URL formatting can't silently diverge. Plain TS (no
React), which is why the route handler can import it.

### Canonical layout
The **`/cv/print` layout is the canonical order**, and `ResumeRenderer` mirrors
it:

```text
Professional Summary → Technical Skills → Professional Experience → Education → Projects
```

The window's `SECTION_NAV` (in `src/app/cv/page.tsx`) is ordered to match.
Section **ordering is the one thing the shared helpers don't enforce** — if you
reorder sections, change both renderers and the nav together.

---

## Routes & checks

| Route | Type | Purpose |
|---|---|---|
| `/cv` | client page (`src/app/cv/page.tsx`) | The app window: toolbar (open/download → `/cv.pdf`), section-nav sidebar, and `ResumeRenderer`. |
| `/cv/print` | static route handler | Standalone parser-safe HTML; export source. Carries `data-cv-print-ready`. |

There is no longer a `/cv?print=1` mode — it was removed in favour of the route
handler (the persistent desktop shell prevented `?print=1` from rendering clean
standalone content). The open/download buttons serve the pre-generated
`public/cv.pdf`.

---

## Export — `npm run export:cv`

`scripts/export-cv.js` (Puppeteer):

1. Requires the dev server running (`npm run dev`). Defaults to
   `http://localhost:3000`; override with `CV_EXPORT_ORIGIN` if Next picks
   another port:
   ```bash
   CV_EXPORT_ORIGIN=http://localhost:3001 npm run export:cv
   ```
2. Loads `/cv/print`, waits for `[data-cv-print-ready='true']`, emulates print
   media.
3. Writes A4 PDF with `printBackground`, `preferCSSPageSize`, 8 mm margins to
   `public/cv.pdf`.

The PDF is **not** regenerated automatically on `resume.json` edits — run the
script manually.

---

## Verification

| Check | Command | Pass condition |
|---|---|---|
| Lint | `npm run lint` | No errors. |
| Build | `npm run build` | `/cv` and `/cv/print` compile. |
| ATS-safe PDF | `pdftotext -layout public/cv.pdf -` | Selectable text out, sections in canonical order. **Empty output = not ATS-safe** (rasterized capture). |
| Visual parity | open `/cv` | On-site section order matches the PDF; nav buttons scroll correctly. |

### Editing workflow
1. Edit `src/data/resume.json`.
2. `npm run dev` → check `/cv` renders correctly.
3. `npm run export:cv` → regenerate `public/cv.pdf`.
4. `pdftotext -layout public/cv.pdf -` → confirm selectable text and order.

---

## Assets

- **`public/cv.pdf`** — the canonical, in-use exported CV. This is what the
  download/open buttons serve and what `export:cv` regenerates. Keep it.
- `public/CV_AG.pdf`, `public/CV_AG.md` — legacy/unused source material, not
  wired into the app. Do not treat as current.

---

## Gotchas

- **Two renderers must stay in sync.** Shared helpers cover date/URL formatting;
  **section order and structure are manual** — change `ResumeRenderer.tsx`,
  `route.ts`, and `SECTION_NAV` together.
- **Export needs a running origin.** No dev server → `ERR_CONNECTION_REFUSED`.
- **Only `/cv/print` is parser-safe.** Never export from the window view or a
  shell route; verify every export with `pdftotext`.
