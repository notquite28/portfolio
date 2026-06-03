# Repository Guidelines

## Project Overview

Static Astro 6 portfolio and blog for `arnavpanigrahi.com`, deployed to GitHub Pages. The homepage is data-driven, blog posts are first-party Markdown content, and the build emits static files to `dist/` with sitemap and RSS output.

## Architecture & Data Flow

- `src/pages/index.astro` is the homepage entry point. It imports section components from `src/designs/folio/` and content from `src/data/content.ts`.
- `src/designs/folio/Layout.astro` owns the shared shell: metadata, canonical URLs, Open Graph/Twitter tags, RSS discovery, JSON-LD injection, fonts, global CSS tokens, Lenis/GSAP setup, cursor glow, Oneko, and production-only analytics.
- Homepage section data flows from `src/data/content.ts` into folio components such as `Hero.astro`, `About.astro`, `Experience.astro`, `Capabilities.astro`, `Work.astro`, and `Contact.astro`.
- Blog content lives in `src/content/posts/*.md`; `src/content.config.ts` validates frontmatter with an Astro content collection.
- Blog routes consume the same posts collection:
  - `src/pages/posts/index.astro` lists posts newest-first.
  - `src/pages/posts/[...slug].astro` statically renders each post and article metadata/JSON-LD.
  - `src/pages/rss.xml.ts` builds the RSS feed.
- Static assets live under `public/`. In Astro code, use `buildUrl()` from `src/utils/paths.ts` for public asset URLs so `BASE_URL` is respected. Markdown post images commonly use root-relative `/posts/images/...` paths.
- Interactive behavior is client-side and component-local: GSAP, ScrollTrigger, Lenis, SplitType, IntersectionObserver, clipboard APIs, and feature/reduced-motion guards.

## Key Directories

- `src/pages/` — Astro routes: homepage, 404 page, blog pages, RSS endpoint.
- `src/designs/folio/` — portfolio page shell and section components; keep homepage sections here, not under `src/components/sections/`.
- `src/data/` — typed-ish content objects for homepage profile, projects, skills, and experience.
- `src/content/posts/` — Markdown blog posts validated by `src/content.config.ts`.
- `src/components/ui/` — small reusable UI components, currently including `Oneko.astro`.
- `src/utils/` — shared utilities such as `buildUrl()`.
- `src/styles/` — global Tailwind import and global base rules.
- `public/` — deployable static assets, including `CNAME`, `.nojekyll`, `robots.txt`, OG/hero assets, post images, and browser-only 404 scripts/models.
- `.github/workflows/` — GitHub Pages build/deploy workflow.

## Development Commands

Use pnpm; do not introduce npm/yarn lockfiles.

```bash
pnpm install   # install dependencies
pnpm dev       # start Astro dev server
pnpm check     # Astro and TypeScript/content checks
pnpm build     # static build to dist/, including sitemap/RSS routes
pnpm preview   # preview built output locally
```

Notes:

- There is no `test` or `lint` script in `package.json`.
- CI currently runs `pnpm install` and `pnpm build`; run `pnpm check` locally after code/content edits because CI does not.
- `pnpm deploy` builds, commits, and pushes. Do not run it unless explicitly requested.

## Code Conventions & Common Patterns

- TypeScript is strict via `astro/tsconfigs/strict`; `tsconfig.json` also enables `verbatimModuleSyntax` and `noUncheckedIndexedAccess`.
- Use `import type` for type-only imports.
- Guard indexed access instead of assuming array/object lookups exist.
- Path aliases are available: `@/*`, `@components/*`, `@utils/*`, and `@styles/*`. Existing code often uses relative imports; follow local file conventions.
- Formatting uses `.prettierrc`: `printWidth: 120`, with `*.astro` set to `printWidth: 999`.
- Use CSS custom properties from `.folio-theme` in `Layout.astro` (`--c-accent`, `--font-serif`, `--ease-expo`, etc.) instead of inventing unrelated colors, easing, or font tokens.
- Keep section-specific CSS and scripts inside the relevant `.astro` component. Put truly global CSS in `src/designs/folio/Layout.astro` or `src/styles/global.css`.
- Animations must respect `prefers-reduced-motion`; existing components use media queries and runtime guards.
- `Nav.astro` is fixed-position. Global `[id] { scroll-margin-top: 5rem; }` in `src/styles/global.css` keeps anchor targets visible.
- Homepage nav links should be root-relative anchors such as `/#work` so they work from post pages.
- Blog post frontmatter must include `title`, `description`, `author`, `published`, and `categories`; `updated` is optional but must be an ISO datetime string when present.
- Posts are first-party content on this site; do not add Medium-style `source` or `guid` metadata.
- The 404 model script (`public/js/notfound-model.js`) is browser-only JavaScript outside `tsconfig.json`; keep feature detection and cleanup patterns when changing it.

## Important Files

- `package.json` — scripts, dependencies, pnpm version pin (`pnpm@10.33.2`), ESM mode.
- `pnpm-lock.yaml` — dependency lockfile; preserve it and do not add `package-lock.json`.
- `astro.config.mjs` — static output, `site: 'https://arnavpanigrahi.com'`, sitemap integration, Tailwind Vite plugin, directory build format.
- `tsconfig.json` — strict TypeScript options and aliases.
- `.prettierrc` — formatting rules.
- `.github/workflows/deploy.yml` — GitHub Pages deployment with Node 22 and pnpm.
- `src/designs/folio/Layout.astro` — shared layout, metadata, global tokens, scripts, and analytics.
- `src/pages/index.astro` — homepage composition and Person JSON-LD.
- `src/data/content.ts` — canonical homepage content source.
- `src/content.config.ts` — blog collection schema.
- `src/pages/posts/[...slug].astro` — post rendering, static paths, article metadata, post-specific styles.
- `src/pages/rss.xml.ts` — RSS feed generation.
- `src/utils/paths.ts` — base-aware public URL helper.
- `public/CNAME` and `public/robots.txt` — production domain and crawler/sitemap config.

## Runtime/Tooling Preferences

- Required runtime in CI is Node 22; Astro dependencies require modern Node 22.x behavior.
- Package manager is pnpm 10.33.2 as pinned in `package.json`.
- Project is ESM (`"type": "module"`).
- Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`; `src/styles/global.css` imports Tailwind.
- GitHub Pages deploy expects static output in `dist/`, a root `public/CNAME`, and `public/.nojekyll`.
- Keep absolute production URLs on `https://arnavpanigrahi.com`.
- Do not edit `resume.tex` unless specifically asked; it is not part of the Astro site.

## Testing & QA

- No unit/e2e test framework is configured.
- After code or content changes, run:

```bash
pnpm check
pnpm build
```

- Use `pnpm preview` for a local built-site smoke test when route, metadata, asset, or rendering behavior changes.
- `pnpm check` validates Astro/TypeScript and content collection frontmatter.
- `pnpm build` validates static routes, RSS/sitemap generation, and deployable output.
- For animation or responsive UI changes, verify reduced-motion behavior and relevant viewport states in a browser in addition to the build commands.
