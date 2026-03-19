# AGENTS.md
Guidance for coding agents working in `/home/quiet/Workspace/portfolio`.

## Project Snapshot
- Personal portfolio built with Astro 5, Tailwind CSS 4, and TypeScript.
- Static output; `astro.config.mjs` sets `output: 'static'`.
- Main page: `src/pages/index.astro`.
- Shared layout: `src/components/layouts/BaseLayout.astro`.
- Global styles: `src/styles/global.css`.
- Static assets: `public/`.

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
pnpm astro check
pnpm build
```
- Use `pnpm astro check` for fast type-aware validation.
- Use `pnpm build` as the main pre-handoff verification step.
- Build output goes to `dist/`.

### Preview
```bash
pnpm preview
```
### Deploy
```bash
pnpm deploy
```
- Runs `pnpm build && git add . && git commit ... && git push`.
- Do not run unless the user explicitly requests deployment.

## Lint / Test Status
- No lint script is configured in `package.json`.
- No dedicated test runner or `test` script is configured.
- No `*.test.*` or `*.spec.*` files are present.
- Preferred verification order:
  1. `pnpm astro check`
  2. `pnpm build`

### Running a single test
- Not currently supported because no test framework is installed.
- If a test runner is added later, update this file with the exact single-test command.

## Rule Files
- No `.cursor/rules/` files found.
- No `.cursorrules` file found.
- No `.github/copilot-instructions.md` file found.
- Treat this file as the main agent guidance for the repo.

## Repository Layout
```text
src/components/layouts/   Base layout and document shell
src/components/sections/  Homepage sections
src/components/ui/        Reusable UI pieces
src/pages/                Route files (`index.astro`, `404.astro`)
src/styles/               Global CSS and theme tokens
src/utils/                Utilities such as `paths.ts`
public/                   Static assets served as-is
```

## Architecture Notes
- `src/pages/index.astro` composes the homepage from section components.
- `BaseLayout.astro` owns metadata, global CSS import, external stylesheets, and page-level scripts.
- Most UI is server-rendered Astro; client-side JS is light and defensive.
- Use helpers from `src/utils/paths.ts` when building site-relative or asset URLs.

## Code Style
### General
- Keep changes small and aligned with existing patterns.
- Prefer focused Astro components over large multi-purpose files.
- Preserve the established visual language unless asked to redesign.
- Prefer ASCII unless the file already uses Unicode intentionally.

### Imports
- Keep imports at the top of Astro frontmatter.
- Existing code mostly uses relative imports; aliases are also available.
- Supported aliases from `tsconfig.json`: `@/*`, `@components/*`, `@utils/*`, `@styles/*`.
- Import order:
  1. CSS imports (layout files only)
  2. External packages
  3. Internal components/modules
  4. Utilities
  5. Type-only imports with `import type`

### Astro Conventions
- Define a `Props` interface near the top when props exist.
- Destructure `Astro.props` immediately and provide inline defaults.
- Use semantic HTML: `<main>`, `<section>`, `<nav>`, `<footer>`, `<button>`.
- Import global CSS only in `src/components/layouts/BaseLayout.astro`.

### TypeScript
- The project extends `astro/tsconfigs/strict`.
- `verbatimModuleSyntax` is enabled; use explicit `import type` when needed.
- `noUncheckedIndexedAccess` is enabled; treat indexed access as possibly `undefined`.
- Prefer explicit return types for exported utilities.
- Prefer narrow types and optional props over `any`.

### Formatting
- Match surrounding formatting instead of reformatting unrelated code.
- Keep objects and arrays compact unless expansion improves readability.
- Avoid comments unless the logic is non-obvious.
- Keep line length reasonable, but consistency with nearby code matters more.

### Naming
- Components: PascalCase, e.g. `SkillCard.astro`.
- Utilities: short lowercase names, e.g. `paths.ts`.
- Variables/functions: camelCase.
- Interfaces/types: PascalCase.
- Constants: SCREAMING_SNAKE_CASE only for true constants.
- Custom CSS classes: kebab-case.

### Styling
- Tailwind CSS 4 is the primary styling tool.
- Reuse tokens and utilities from `src/styles/global.css` before adding new ones.
- Existing reusable classes include `.glass`, `.glass-liquid`, `.glass-container`, `.section-transition`, `.text-gradient`, `.text-accent`, and `.text-comment`.
- Preserve responsive behavior on mobile and desktop.

### Client Scripts and Error Handling
- Keep browser scripts minimal and defensive.
- Check DOM queries before attaching listeners or mutating elements.
- Prefer early returns over nested conditionals.
- Use optional chaining and nullish coalescing where appropriate.
- Prefer graceful degradation over runtime failures.

## Content and SEO
- Use `BaseLayout` for pages so metadata remains consistent.
- Pass `title`, `description`, and `image` props when page-level SEO matters.
- Use `buildUrl()` for absolute asset URLs.
- Keep project descriptions and claims accurate to the actual repo or documented implementation.

## Working Safely
- The worktree may contain unrelated user changes; do not revert them.
- `resume.tex` may exist in the workspace but is not part of the site unless requested.
- Do not commit deploy artifacts or push changes unless explicitly asked.
- For most code edits, run `pnpm astro check` or `pnpm build` before finishing when practical.

## Common Tasks
### Add a homepage section
1. Create a component in `src/components/sections/`.
2. Follow the existing props/frontmatter pattern.
3. Import it into `src/pages/index.astro`.
4. Reuse existing theme classes first.
### Add a reusable UI component
1. Create it in `src/components/ui/`.
2. Keep props flexible and layout-agnostic.
3. Let parent sections control spacing and placement.
### Update portfolio content
1. Verify claims against code, docs, or linked repos.
2. Keep titles, stacks, and descriptions consistent across the site.
3. Prefer precise technical wording over marketing language.
