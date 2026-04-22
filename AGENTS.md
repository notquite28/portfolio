# AGENTS.md
Guidance for coding agents working in `/home/quiet/Workspace/portfolio`.

## Project Snapshot
- Personal portfolio built with Astro 5, Tailwind CSS 4, and TypeScript.
- Static output; `astro.config.mjs` sets `output: 'static'`.
- Site URL is `https://arnavpanigrahi.com`.
- Main page is `src/pages/index.astro`.
- Shared layout is `src/components/layouts/BaseLayout.astro`.
- Global styles live in `src/styles/global.css`.

## Commands
### Install
```bash
pnpm install
```

### Development
```bash
pnpm dev
```
- Starts Astro dev server, usually at `http://localhost:4321`.

### Validation
```bash
pnpm check
pnpm build
```
- `pnpm check` runs `astro check`.
- `pnpm build` is the main pre-handoff verification step.
- Build output goes to `dist/`.

### Preview
```bash
pnpm preview
```

### Direct Astro CLI
```bash
pnpm astro ...
```

### Deploy
```bash
pnpm deploy
```
- Runs `pnpm build && git add . && git commit ... && git push`.
- Do not run unless the user explicitly asks for deployment.

## Lint / Test Status
- No lint script is configured in `package.json`.
- No dedicated test runner or `test` script is configured.
- No `*.test.*` or `*.spec.*` files are present.
- Preferred verification order:
  1. `pnpm check`
  2. `pnpm build`

### Running a single test
- Not supported right now because no test framework is installed.
- If tests are added later, update this file with the exact single-test command.

## Rule Files
- No `.cursor/rules/` files found.
- No `.cursorrules` file found.
- No `.github/copilot-instructions.md` file found.
- Treat this file as the primary agent guidance for the repo.

## Repository Layout
```text
src/components/layouts/   Base layout and shared document shell
src/components/sections/  Homepage sections such as Hero, About, Skills, Projects
src/components/ui/        Small reusable UI pieces like Icon and Oneko
src/pages/                Route files (`index.astro`, `404.astro`)
src/styles/               Global CSS, tokens, and shared component styles
src/utils/                Utilities such as `paths.ts`
public/                   Static assets served as-is
```

## Architecture Notes
- `src/pages/index.astro` composes the homepage from section components.
- `BaseLayout.astro` owns metadata, external stylesheets, global scripts, and the boid canvas.
- Most UI is server-rendered Astro; client-side JS is minimal.
- Project data currently lives directly inside section components, especially `Projects.astro`.
- Use helpers from `src/utils/paths.ts` when building asset URLs or base-aware links.

## Code Style
### General
- Keep changes small and aligned with the current structure.
- Prefer focused Astro components over large multi-purpose files.
- Preserve the current sleek visual language unless the user asks for a redesign.
- Prefer ASCII unless the file already uses Unicode intentionally.
- Follow KISS and UNIX-style thinking: simple pieces, minimal moving parts, clear behavior.

### Imports
- Keep imports at the top of Astro frontmatter.
- Existing code mostly uses relative imports; aliases are also available.
- Supported aliases from `tsconfig.json` are `@/*`, `@components/*`, `@utils/*`, and `@styles/*`.
- Import order:
  1. CSS imports (layout files only)
  2. External packages
  3. Internal components/modules
  4. Utilities
  5. Type-only imports with `import type`

### Astro Conventions
- Define a `Props` interface near the top when props exist.
- Destructure `Astro.props` immediately and provide inline defaults.
- Use semantic HTML such as `<main>`, `<section>`, `<nav>`, `<footer>`, `<button>`.
- Import global CSS only in `src/components/layouts/BaseLayout.astro`.
- Prefer native HTML features when they solve the problem cleanly, e.g. `details/summary`.

### TypeScript
- The project extends `astro/tsconfigs/strict`.
- `verbatimModuleSyntax` is enabled; use explicit `import type` when needed.
- `noUncheckedIndexedAccess` is enabled; treat indexed access as possibly `undefined`.
- Prefer explicit return types for exported utilities.
- Prefer narrow types and optional props over `any`.
- Avoid adding new runtime abstractions when a simple object or array is enough.

### Formatting
- Match surrounding formatting instead of reformatting unrelated code.
- Keep objects and arrays compact unless expansion improves readability.
- Avoid comments unless the logic is non-obvious.
- Keep line length reasonable, but prioritize consistency with nearby code.

### Naming
- Components: PascalCase, e.g. `Projects.astro`.
- Utilities: short lowercase names, e.g. `paths.ts`.
- Variables/functions: camelCase.
- Interfaces/types: PascalCase.
- Constants: SCREAMING_SNAKE_CASE only for true constants.
- Custom CSS classes: kebab-case.

### Styling
- Tailwind CSS 4 is the primary styling tool.
- Reuse tokens and shared classes in `src/styles/global.css` before adding new ones.
- Current reusable classes include `.panel`, `.panel-strong`, `.panel-muted`, `.section-title`, `.section-kicker`, `.contact-link`, and `.section-transition`.
- Keep responsive behavior solid on both mobile and desktop.
- Prefer restrained motion and clean hierarchy over decorative effects.

### Client Scripts and Error Handling
- Keep browser scripts minimal and defensive.
- Check DOM queries before attaching listeners or mutating elements.
- Prefer early returns over nested conditionals.
- Use optional chaining and nullish coalescing where appropriate.
- Prefer graceful degradation over runtime failures.
- Avoid introducing JS when CSS or semantic HTML can do the same job.

## Content and SEO
- Use `BaseLayout` for pages so metadata stays consistent.
- Pass `title`, `description`, and `image` props when page-level SEO matters.
- Use `buildUrl()` for absolute asset URLs.
- Keep project descriptions and claims accurate to real repos or documented work.
- Prefer concise copy; avoid inflated or generic portfolio language.

## Working Safely
- The worktree may contain unrelated user changes; do not revert them.
- `resume.tex` may exist in the workspace but is not part of the site unless requested.
- Do not commit deploy artifacts or push changes unless explicitly asked.
- For most code edits, run `pnpm check` or `pnpm build` before finishing.
- This repo uses `pnpm`; do not reintroduce `package-lock.json`.

## Common Tasks
### Add a homepage section
1. Create a component in `src/components/sections/`.
2. Follow the existing props/frontmatter pattern.
3. Import it into `src/pages/index.astro`.
4. Reuse existing theme classes before inventing new styling.

### Add a reusable UI component
1. Create it in `src/components/ui/`.
2. Keep props flexible and layout-agnostic.
3. Let parent sections control spacing and placement.

### Update portfolio content
1. Verify claims against code, docs, or linked repos.
2. Keep titles, stacks, and descriptions consistent across the site.
3. Prefer precise technical wording over marketing language.
