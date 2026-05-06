# Repository Guidelines

## Canonical Direction
- `docs/macos-redesign.md` is the canonical direction for this portfolio.
- The portfolio is being rebuilt as a macOS desktop OS experience: persistent wallpaper, menu bar, dock, desktop shortcuts, and draggable/resizable application windows.
- The old brutalist/Stitch layout, `docs/styleguide.md`, and any older `design-plan.md` guidance are reference-only and must not guide new work.
- Existing UI in `src/` is being scrapped and rebuilt from scratch. Do not preserve old components or styling unless explicitly requested.

## Project Structure & Module Organization
- `src/app/layout.tsx` should own the persistent desktop shell and keep it mounted across routes.
- `src/app/page.tsx` is the Home app content, with route apps under `src/app/projects/`, `src/app/about/`, `src/app/contact/`, and `src/app/cv/`.
- `src/app/components/` should be organized around the OS metaphor:
  - `Desktop/` for wallpaper and desktop icons.
  - `WindowManager/` for window state, reducer/actions, registry, and provider.
  - `MenuBar/` for the top menu and dropdowns.
  - `Dock/` for dock items, magnification, active indicators, and minimized windows.
  - `Window/` for title bars, traffic lights, resize/drag chrome, and app toolbars.
- `src/app/globals.css` should contain only resets, tokens, theme variables, and truly global motion rules.
- `public/` stores static assets served at the site root. Preserve `/public/cv.pdf` as the carried-forward CV asset.
- `docs/` contains planning references; follow `docs/macos-redesign.md` first.

## Canonical Stack
- Framework: Next.js 14 App Router.
- Language: TypeScript + React.
- Styling: Tailwind CSS, with minimal global CSS.
- Animation: `framer-motion`.
- Menu dropdowns: `@radix-ui/react-dropdown-menu`.
- Icons: `lucide-react`; do not add new Heroicons usage.
- Fonts: macOS system stack via CSS (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `sans-serif`); no Google Fonts import.
- Window dragging/resizing: `react-rnd`.
- Theme switching: `next-themes`, with dark mode as canonical and light mode as an inversion.
- Generative wallpaper: Canvas plus `simplex-noise`.

## macOS Desktop Behavior
- The desktop shell should never unmount during normal navigation.
- Routes map to app windows: `/` home, `/projects`, `/about`, `/contact`, and `/cv`.
- The window manager is the source of truth for open windows, focused route, z-index, geometry, minimized state, maximized state, and snapped state.
- Enforce one window per app/route by default. Opening an already-open app should focus and restore it instead of duplicating it.
- Desktop icons and dock items should open, focus, or restore windows and update the URL.
- Closing the focused window should focus the next highest z-index window, or return to `/` when none remain.
- Use macOS-style traffic lights: close, minimize, maximize/restore, with snap options available from the green control.
- Desktop icon placement is a left sidebar column. Dock is centered at the bottom. Menu bar is pinned to the top.
- Include a macOS-style boot screen as described in `docs/macos-redesign.md`; use an opt-in click to enter if audio is included.
- Mobile should use the recommended desktop-focused fallback: show a styled message and provide a way to switch to a simplified website mode later.

## Visual Design Guidance
- Dark mode is canonical: very dark animated wallpaper, frosted glass windows/menu/dock, macOS system blue accent, and native traffic-light colors.
- Light mode is provided by token overrides through `next-themes`.
- Use frosted glass treatments with `backdrop-filter` for the menu bar, dock, and window chrome.
- Use `framer-motion` for window open/close/minimize/restore, dock magnification, and page transitions inside windows.
- Do not recreate the old monochrome editorial/brutalist style.

## Build, Test, and Development Commands
- `npm run dev`: Start the local Next.js dev server with hot reload.
- `npm run build`: Create a production build.
- `npm run start`: Run the production server after a build.
- `npm run lint`: Run ESLint with Next.js rules.
- `npm run analyze` or `npm run bundle-analyzer`: Build with bundle analysis enabled.
- `npm run performance`: Build and run locally for performance checks.

## Coding Style & Naming Conventions
- Follow existing TypeScript and React patterns unless they conflict with `docs/macos-redesign.md`.
- Components use `PascalCase` filenames and exports; hooks use `useCamelCase`.
- Prefer Tailwind utility classes for component styling.
- Keep state transitions deterministic in reducer-style code for the window manager.
- Add abstractions only when they match the desktop shell/window model or remove real duplication.

## Testing Guidelines
- No test framework is configured right now.
- For documentation-only changes, verify file contents and symlinks directly.
- For UI implementation, run `npm run lint` and `npm run build`.
- Use Playwright or browser screenshots for desktop shell changes when practical, especially for layout, window interactions, and responsive fallback behavior.
- If tests are added, document the tooling and add a `npm run test` script.

## Commit & Pull Request Guidelines
- Commit messages in history use short, imperative sentences. Follow that pattern.
- PRs should include a clear summary, screenshots or a short clip for UI changes, and links to related issues or tasks.

## Configuration & Security Notes
- Environment variables should be added to `.env.local` and never committed.
- Keep dependencies aligned with `package.json` and `package-lock.json`.
- Do not commit generated build output such as `.next/`.
