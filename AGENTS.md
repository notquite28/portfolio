# AGENTS.md

## Project Snapshot

- Personal portfolio built with Astro 6, Tailwind CSS 4, and TypeScript.
- Static output; `astro.config.mjs` sets `output: 'static'`.
- Site URL is `https://arnavpanigrahi.com`.
- Requires Node >= 22.12.0 (Astro 6 requirement).
- CI uses Node 22 via `.github/workflows/deploy.yml`.
- Package manager is pinned: `pnpm@10.33.2`.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server at http://localhost:4321
pnpm check            # astro check (type checking)
pnpm build            # Production build -> dist/
pnpm preview          # Preview production build
```

- **No lint script, no test framework, no tests.** Verification is `pnpm check` then `pnpm build`.
- `pnpm deploy` builds, commits, and pushes. Do not run unless explicitly asked.

## Repository Layout

```text
src/data/content.ts        All site content: profile, projects, skills, experiences
src/designs/folio/         All page-level components (Layout, Nav, Hero, About, Experience, Capabilities, Work, Contact, Footer)
src/components/ui/         Small reusable UI pieces (Oneko)
src/pages/                 Route files (index.astro, 404.astro)
src/styles/global.css      Tailwind import + scroll behavior + scroll-margin-top
src/utils/paths.ts         buildUrl() for base-aware asset URLs
public/                    Static assets (daruma.glb, jelly.webp, oneko.gif, js/)
public/js/notfound-model.js  Three.js viewer for the 404 page 3D model
```

## Architecture

- `src/pages/index.astro` composes the homepage from `src/designs/folio/` section components.
- `Layout.astro` owns metadata, fonts, global CSS, design tokens (CSS custom properties), the reveal-on-scroll observer, and the Oneko widget.
- All content lives in `src/data/content.ts` -- profile, projects, experiences, skill categories. Section components import from there and render.
- The 404 page uses a Three.js model viewer (`public/js/notfound-model.js`) loaded as an inline module script; the model file is referenced via `data-model-url` attribute.
- The sticky `Nav.astro` uses `position: fixed`. Global `[id] { scroll-margin-top: 5rem; }` prevents anchor targets from hiding behind it.

## Code Style

- Components live in `src/designs/folio/`, not `src/components/sections/`.
- Keep imports at the top of Astro frontmatter. Existing code uses relative imports.
- Supported aliases: `@/*`, `@components/*`, `@utils/*`, `@styles/*`.
- `verbatimModuleSyntax` and `noUncheckedIndexedAccess` are enabled; use `import type` and guard indexed access.
- No comments unless logic is non-obvious.
- Use semantic HTML. Global CSS only in `Layout.astro`.
- Design tokens are CSS custom properties defined in `Layout.astro` under `.folio-theme` (e.g., `--c-accent`, `--font-serif`, `--ease-expo`). Use these variables; do not hardcode colors or fonts.
- Kickers/eyebrows use `var(--c-accent)` color across all sections.

## Working Safely

- This repo uses `pnpm`; do not reintroduce `package-lock.json`.
- Do not commit or push unless explicitly asked.
- Run `pnpm check` then `pnpm build` after code edits.
- `resume.tex` may exist but is not part of the site unless requested.
- When adding homepage sections: create in `src/designs/folio/`, import in `index.astro`.
- The `.nav-mobile` must be force-hidden at `min-width: 768px` with `!important` to prevent leak on resize.

## Config Quirks

- `astro.config.mjs` sets non-default `build.format: 'file'` and `trailingSlash: 'ignore'`.
- `package.json` has a `pnpm.overrides` entry for `@astrojs/internal-helpers`.
- `tsconfig.json` only includes `src/**/*`; scripts in `public/js/` are not type-checked.
- Asset URLs should use `buildUrl()` from `src/utils/paths.ts` to respect `BASE_URL`.

## Animation Stack

- `gsap` + `ScrollTrigger` handles scroll-driven animations (reveal, parallax).
- `lenis` provides smooth scrolling, wired into the GSAP ticker (`gsap.ticker.add`).
- `split-type` is available for text-splitting animations.
- `Layout.astro` initializes Lenis, GSAP ScrollTrigger, and a cursor-glow effect. All animations respect `prefers-reduced-motion`.
