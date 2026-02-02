# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains the Next.js App Router pages and layout (`page.tsx`, `layout.tsx`).
- `src/app/components/` holds reusable UI components.
- `src/app/globals.css` defines global styles, tokens, and motion rules.
- `public/` stores static assets served at the site root.
- `assets/` contains design references and HTML mockups used during development.
- `docs/` contains the style guide and redesign plan.
- `PERFORMANCE.md` documents performance practices and audit tips.

## Current Portfolio State
- The UI in `src/app/page.tsx` follows the Stitch brutalist layout and `docs/styleguide.md`.
- Remaining follow-ups are content wiring (real social links, email, “View All Projects”) and any image swaps.

## Build, Test, and Development Commands
- `npm run dev`: Start the local Next.js dev server with hot reload.
- `npm run build`: Create a production build.
- `npm run start`: Run the production server after a build.
- `npm run lint`: Run ESLint with Next.js rules.
- `npm run analyze` or `npm run bundle-analyzer`: Build with bundle analysis enabled.
- `npm run performance`: Build and run locally for performance checks.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 14 App Router).
- Indentation and formatting should follow existing files; no Prettier config is present, so keep changes consistent with surrounding code.
- Components use `PascalCase` filenames and exports; hooks use `useCamelCase`.
- Prefer Tailwind utility classes for styling; keep global CSS minimal and scoped.

## Testing Guidelines
- No test framework is configured in this repository right now.
- If you add tests, document the tooling and add a `npm run test` script.
- Suggested naming: `*.test.tsx` or `*.spec.tsx`, colocated or in a `__tests__/` folder.

## Commit & Pull Request Guidelines
- Commit messages in history use short, imperative sentences (e.g., "Update About Me and Skills text color" or "Fix ESLint errors"). Follow that pattern.
- PRs should include: a clear summary, screenshots or a short clip for UI changes, and links to any related issues or tasks.

## Configuration & Security Notes
- Environment variables should be added to `.env.local` and never committed.
- Keep dependencies aligned with `package.json` and `package-lock.json` changes.
