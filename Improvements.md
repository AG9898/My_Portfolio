# Portfolio Improvements Backlog

Source: a 2026-07-17 review of the running site from two viewpoints — a recruiter (30–60
seconds, often on a phone) and a senior software engineering manager (evaluating judgment and
craft). The site was exercised end-to-end in a browser at 1440×900 and 390×844: boot screen,
lock screen, Home, Projects, CV, PigeonCoop showcase, and the mobile fallback.

This file is the working backlog for that review. Agents picking up P0/P1/P2 items should read
the **Context** section for the finding behind each task, then the task's own details. Update
the checkbox and strike through or annotate items as they land. Verify code changes with
`npm run lint`, and `npm run build` for anything touching routing/metadata/structure
(see `docs/TESTING.md`).

---

## Review summary

**Strengths (do not regress these):**

- The desktop shell is the strongest artifact: reducer-backed window manager, route-synced
  windows, reduced-motion awareness, marquee selection, context menus, Get Info. It is real
  evidence of frontend systems thinking.
- Project showcases (PigeonCoop, Bites, Glass Atlas) contain genuine, well-written technical
  depth — no placeholder content.
- The CV window renders `src/data/resume.json` as clean HTML with an ATS-safe PDF export
  pipeline (`docs/CV.md`).
- Real deployed artifacts exist and are linked (Glass Atlas, Techy, ubcpsych.com).

**Core problem:** the portfolio optimizes for the visitor who gives it five minutes, while most
visitors give it thirty seconds — and the mobile majority currently gets almost nothing. A few
credibility cracks (contact mismatches, keyword-heavy skills, decorative dead controls) stand
out *because* the rest is polished.

---

## Context: detailed findings

### Recruiter viewpoint

1. **Mobile is a dead end.** At phone widths, `MobileFallback.tsx` renders only a card:
   "The desktop portfolio opens on tablet and larger screens" + an *Open CV* button + a theme
   toggle. Most LinkedIn/email link taps are mobile, so for that majority the portfolio is a CV
   download page. No pitch, no projects, no contact paths.
2. **Content is behind two gates.** Boot splash → lock screen → required "Click to enter" click
   (`StartupSequence.tsx`, skipped within a session via `sessionStorage`). Charming, but ~5–8
   seconds plus one click before the visitor's first content; the initial black boot frame can
   read as a broken page to someone rushed.
3. **Contact details contradict each other.** `src/app/contact/page.tsx` uses
   `aden219898@gmail.com`; `src/data/resume.json` (and therefore the rendered CV and PDF) uses
   `aden.guowe@gmail.com`. The Contact window's LinkedIn card is a **search-results link**
   ("Search Aden Guo") while the resume has the direct profile URL
   (`https://linkedin.com/in/aden-guo-b39743362`). A search link looks unfinished and can
   surface other people.
4. **Three different identities.** Home: "software engineer — full-stack web apps, AI/LLM tools,
   spatial/GIS systems." About: "frontend-focused developer." CV label: "Software Engineer ·
   Geomatics Engineering Graduate." A recruiter routing candidates to reqs gets no single answer.
5. **Link sharing looks bad.** `src/app/layout.tsx` metadata description is "A macOS-inspired
   portfolio redesign for Aden Guo" ("redesign" is internal-speak) and there is no
   OpenGraph/Twitter image, so pasted links unfurl with nothing.

### Senior SE manager viewpoint

6. **The GitHub repo has no README.** The Projects card links to
   `github.com/AG9898/My_Portfolio`; a manager will click through and see no README at all,
   while the repo's actual documentation (`docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, the
   workboard system) is unusually good and completely invisible.
7. **Decorative dead controls contradict stated values.** The About page claims interfaces
   "easy to scan and hard to misuse" and "controls reveal state," yet: the Projects search box
   is a static `<span>`, the Projects list-view toggle does nothing, the Home toolbar's
   B/I/U/font controls are decorative (`aria-hidden`, `tabIndex={-1}`), and the Contact
   window's Mailboxes sidebar is inert. A manager who tries the search box experiences the
   contradiction directly.
8. **The skills list strains credibility.** `resume.json` lists ~60 technologies (Go, Ruby,
   Rust, C++, PyTorch, OpenCV, Ruby on Rails, "Distributed & event-driven systems", …) against
   one professional role (GIS Technologist, Dec 2025–present). Reviewers discount the whole
   list when it outruns the evidence. The portfolio itself evidences roughly:
   TypeScript/React/Next.js/SvelteKit, Python/FastAPI, Rust/Tauri, Postgres/pgvector/Drizzle,
   AI/LLM tooling, and the GIS stack.
9. **About is all philosophy, no history.** Four sections of process principles, zero concrete
   narrative. The genuinely differentiating story — Geomatics engineer who taught himself
   full-stack and AI engineering and ships production apps (ubcpsych.com is a deployed client
   system) — is told nowhere.
10. **Catalog inconsistencies.** `buddy.cli` is a desktop shortcut but missing from the
    Projects Finder (`src/app/projects/page.tsx` `PROJECTS` — currently 10 items). All project
    cards share one identical generic blue icon even though real screenshots exist under
    `public/` for several projects.
11. **No discoverable live URL for the portfolio itself.** No README, no `vercel.json`, and the
    "My Portfolio" Projects card links only to GitHub. If the site is deployed, the URL is not
    surfaced anywhere in the repo; if it is not deployed, that outranks everything else here.

---

## P0 — credibility fixes (est. an afternoon total)

### P0.1 — Fix contact email + LinkedIn link ✅ smallest, do first
- [x] In `src/app/contact/page.tsx`: confirm with the user which email is canonical
      (`resume.json` uses `aden.guowe@gmail.com`; the Contact window uses
      `aden219898@gmail.com`) and make both surfaces agree. Do **not** guess — ask if the user
      hasn't already said. *(User confirmed 2026-07-17: `aden.guowe@gmail.com` is canonical.)*
- [x] Replace the LinkedIn search URL in `CONTACT_PATHS` with the direct profile URL from
      `resume.json`: `https://linkedin.com/in/aden-guo-b39743362`. Change the card's value text
      from "Search Aden Guo" to something like `linkedin.com/in/aden-guo…`.

### P0.2 — Real mobile experience
- [ ] Replace the single-card `src/app/components/Desktop/MobileFallback.tsx` with a simple
      stacked, scrollable page (no windows, no dock): name + one-line pitch, 3–4 featured
      project cards (name, one-liner, stack chips, external link where one exists), contact
      buttons (email, GitHub, LinkedIn), and the Open CV button it already has.
- [ ] Reuse existing content — import from the Projects `PROJECTS` data (consider extracting it
      to a shared module rather than duplicating; see also P1.4) and keep styling on the
      existing token system (`docs/styling.md`).
- [ ] Keep it lightweight: this is a fallback, not a second portfolio. No new dependencies.

### P0.3 — Never block first content (startup sequence)
- [ ] In `src/app/components/Desktop/StartupSequence.tsx`: keep the boot + lock theater but
      make it non-blocking. Auto-advance the lock screen after ~1.5s of inactivity (respecting
      `prefers-reduced-motion` — reduced motion should skip straight through), and keep
      click/keypress as an immediate skip.
- [ ] Ensure the very first boot frame isn't a plain black screen for seconds — the logo/progress
      should appear immediately so the page never reads as broken.
- [ ] Preserve the existing `sessionStorage` skip for same-session revisits.

### P0.4 — README.md for the repo
- [ ] Write a root `README.md`: hero screenshot of the desktop (capture one into
      `public/` or a `docs/media/` folder), one-paragraph pitch of the macOS-desktop concept,
      quick-start commands, and a short "how it works" section linking into
      `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/macos-redesign.md`, and the workboard
      system. The docs already exist — the README's job is to surface them.
- [ ] Note: `CLAUDE.md`/`AGENTS.md` is the agent guide, not a substitute for a
      visitor-facing README.

### P0.5 — Metadata + OpenGraph
- [ ] In `src/app/layout.tsx`: replace the description with visitor-facing copy, e.g.
      "A macOS desktop in the browser — the portfolio of Aden Guo, software engineer building
      full-stack web apps, AI/LLM tools, and spatial systems." Drop the word "redesign".
- [ ] Add an OpenGraph + Twitter card image (a clean screenshot of the desktop with a window
      open) via Next Metadata (`openGraph.images`, `twitter.card = "summary_large_image"`).
      Static file under `public/` is fine; `opengraph-image.tsx` also acceptable.
- [ ] Run `npm run build` after metadata changes.

---

## P1 — story coherence (est. a day total)

### P1.1 — One positioning line everywhere
- [ ] Reconcile the three identity statements (finding #4). Recommended canonical line: the
      Home version — "software engineer who builds full-stack web apps, AI/LLM tools, and
      spatial/GIS systems" — because it is true, differentiated, and matches the project
      evidence. Apply it to: About (`src/app/about/page.tsx`, which currently opens with
      "frontend-focused developer"), the mobile fallback (P0.2), and the metadata description
      (P0.5). The CV label in `resume.json` may keep the "· Geomatics Engineering Graduate"
      suffix — that is résumé-appropriate.
- [ ] **Declined — do not do:** adding a `basics.summary` section to `resume.json` / the CV.
      The user explicitly rejected a CV summary section (2026-07-17). Do not re-propose it;
      the CV continues to open with Technical Skills per `docs/CV.md` section order.

### P1.2 — Prune the skills matrix to what is evidenced
- [ ] In `src/data/resume.json` `skills`: cut to technologies demonstrated by the portfolio,
      work history, or coursework. Candidates for removal or demotion: Ruby, Ruby on Rails,
      C++, PyTorch, OpenCV, scikit-learn, Go + go-app (WebAssembly), "Distributed &
      event-driven systems", AWS S3 (unless actually used — Glass Atlas uses S3-compatible
      storage, so consider phrasing it that way). Aim for the list a senior reviewer would
      fully believe, not the longest defensible list.
- [ ] Keep the GIS & Survey group intact — it is backed by the current role.
- [ ] After editing, regenerate the PDF: `npm run export:cv` (use `publish:resume` only if the
      Waunder sync should also run — see `AGENTS.md` Discoveries). Verify with
      `pdftotext -layout public/cv.pdf -`.
- [ ] Mirror the same pruning in the Home window `STACK_GROUPS` (`src/app/page.tsx`) so the two
      surfaces agree.

### P1.3 — Concrete About section (the arc)
- [ ] Add one section to `src/app/about/page.tsx` telling the concrete story: Geomatics
      Engineering at U of C → self-taught full-stack + AI engineering → GIS Technologist at
      Canada West Land (enterprise GIS, ETL pipelines, agentic AI workflows) → shipped client
      work (UBC research platform at ubcpsych.com). Keep the existing philosophy sections but
      let this be the first or second entry — a manager wants the history before the values.
- [ ] Source facts from `src/data/resume.json` work/education entries; do not invent claims.

### P1.4 — Projects catalog consistency + real thumbnails
- [ ] Add **buddy** to `PROJECTS` in `src/app/projects/page.tsx` (it has a desktop shortcut and
      a full showcase page at `/buddy` but is absent from the Finder). Category: likely
      `agent-tools`. GitHub: `github.com/AG9898/buddy`. Status: pre-release / in development.
- [ ] Replace the identical generic blue icon on every project card with per-project visuals.
      Real assets already exist under `public/` (e.g. `public/bites/`, `public/PigeonCoop/`,
      `public/buddy/`); a small square thumbnail or distinct icon per card is enough. Missing
      assets can fall back to the current generic icon.
- [ ] Consider extracting `PROJECTS` into a shared data module (like `src/app/bites/bitesData.ts`
      does for Bites) so the mobile fallback (P0.2) imports the same source of truth.

---

## P2 — turn chrome into proof

### P2.1 — Wire the Projects search and list view
- [ ] Make the search box in `src/app/projects/page.tsx` a real input filtering `PROJECTS` by
      name/kind/description/stack, and implement the list-view toggle as an actual dense list
      layout. Small effort, on-theme, and converts a reviewer's "gotcha" moment (dead control)
      into a delight moment.
- [ ] While there: remove or wire other conspicuous dead chrome where cheap. The Home toolbar
      (B/I/U) and Contact mailboxes are acceptable as set dressing, but anything that *looks*
      like a functional affordance (search, view toggles) should work.

### P2.2 — Surface the live URL
- [ ] Determine whether the portfolio is deployed. If yes: put the live URL in the README
      (P0.4), the GitHub repo description, the "My Portfolio" Projects card (`link` currently
      points only at GitHub), and `resume.json` profiles. If no: deploying publicly is the real
      top priority — a portfolio without a URL a recruiter can open does not exist for hiring
      purposes. Deployment requires explicit user authorization per `AGENTS.md` (do not deploy
      unilaterally).

---

## Explicitly declined (do not re-propose)

- **CV summary section** (`basics.summary` in `resume.json`): rejected by the user on
  2026-07-17 — in their experience a summary does not help the CV. The identity-coherence work
  in P1.1 applies to the site surfaces only, not the CV document.
