# Repository Guidelines

## Project Overview

Static Astro 6 portfolio and blog for `arnavpanigrahi.com`, deployed to GitHub Pages. The homepage presents portfolio sections with GSAP/Lenis motion; blog posts are first-party Markdown content collection entries with RSS and sitemap output.

## Architecture & Data Flow

- `src/pages/index.astro` is the homepage composition root. It renders `src/designs/folio/*` sections inside `src/designs/folio/Layout.astro` and provides Person JSON-LD.
- Homepage content is centralized in `src/data/content.ts` (`profile`, `experiences`, `projects`, `skillCategories`) and imported directly by folio components. Prefer editing this file for portfolio copy/data rather than hard-coding content in sections.
- `Layout.astro` owns document-shell concerns: metadata, canonical/OG/Twitter tags, RSS discovery, JSON-LD injection, Google fonts, theme tokens, skip link, Oneko, production Cloudflare analytics, global reveal/parallax wiring, Lenis, and GSAP ScrollTrigger setup.
- Blog data flows from `src/content/posts/*.md` through the schema in `src/content.config.ts`, then into `getCollection('posts')` consumers: `src/pages/posts/index.astro`, `src/pages/posts/[...slug].astro`, `src/pages/rss.xml.ts`, and `src/pages/sitemap.xml.ts`.
- Draft filtering pattern: include drafts only in dev with `import.meta.env.DEV || !post.data.draft`; sort posts newest-first by `published.getTime()`.
- Public asset URLs in Astro should use `buildUrl()` from `src/utils/paths.ts` so `BASE_URL` is respected. Markdown post images commonly use root-relative `/posts/images/...` paths.
- Client behavior is progressive enhancement in local `.astro` scripts using `data-*` hooks and direct DOM APIs, not React/Vue islands.

## Key Directories

- `src/pages/` — file-based Astro routes: homepage, 404, posts index/detail, RSS and sitemap endpoints.
- `src/designs/folio/` — portfolio layout and homepage sections (`Hero`, `Nav`, `About`, `Experience`, `Capabilities`, `Work`, `Contact`, `Footer`). Keep folio-specific markup, styles, and scripts here.
- `src/data/` — typed static portfolio content source.
- `src/content/posts/` — flat Markdown blog posts loaded by Astro Content Collections.
- `src/components/ui/` — small reusable UI widgets; currently `Oneko.astro`.
- `src/utils/` — shared helpers such as `buildUrl()`.
- `src/styles/` — Tailwind import and minimal global CSS.
- `public/` — deployable static assets, including `CNAME`, `.nojekyll`, `robots.txt`, OG/hero/project assets, `oneko.gif`, and post images.
- `.github/workflows/` — GitHub Pages build/deploy workflow.

## Development Commands

Use pnpm only.

```bash
pnpm install --frozen-lockfile  # install exactly from pnpm-lock.yaml
pnpm dev                        # Astro dev server
pnpm check                      # Astro, TypeScript, and content diagnostics
pnpm build                      # static production build to dist/
pnpm preview                    # preview built output locally
pnpm audit                      # dependency vulnerability audit
pnpm verify                     # frozen install + check + build + audit
```

There is no `test`, `lint`, `format`, or `deploy` script in `package.json`. Treat README references to `pnpm deploy` as stale unless a script is added.

## Code Conventions & Common Patterns

- TypeScript extends `astro/tsconfigs/strict`; `verbatimModuleSyntax` and `noUncheckedIndexedAccess` are enabled. Use `import type` for type-only imports and guard indexed access.
- Prettier settings: `printWidth: 120`; `*.astro` uses `printWidth: 999`.
- Astro components generally follow: frontmatter imports/data constants, semantic markup, component-scoped `<style>`, then local browser `<script>` when needed.
- Component names are PascalCase; CSS classes are kebab-case and section-scoped (`hero-*`, `project-*`, `contact-*`).
- Prefer existing `.folio-theme` CSS custom properties from `Layout.astro` (`--c-accent`, `--c-body`, `--font-serif`, `--ease-expo`, etc.) over introducing unrelated tokens.
- Use `data-*` hooks for interactivity (`data-hero-video`, `data-nav`, `data-tilt`, `data-collapsible`, `data-copy-email`, `data-parallax`).
- Motion must degrade gracefully: respect `prefers-reduced-motion`, use static/no-JS fallbacks, and gate desktop-only GSAP/ScrollTrigger work with media queries or `matchMedia`.
- Accessibility patterns already in use: skip link, native buttons/anchors, `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-live`, `inert`, Escape handling, and keyboard-safe collapsibles/menus.
- SEO metadata belongs in `Layout.astro`; pages pass title/description/article fields/structured data as props. Escape JSON-LD before `set:html` as the layout does.
- Blog frontmatter must satisfy `src/content.config.ts`: `title`, `description`, `author`, `published`, `categories`; `updated` is optional ISO datetime; `draft: true` hides posts outside dev. Markdown bodies should start at `##`/`###`, not another `#`.

## Important Files

- `package.json` — scripts, dependencies, pnpm version pin (`pnpm@10.33.2`), ESM mode.
- `pnpm-lock.yaml` — canonical lockfile; do not add npm/yarn lockfiles.
- `pnpm-workspace.yaml` — dependency overrides (`esbuild`, `yaml`) and allowed built dependencies.
- `astro.config.mjs` — static output, production site URL, Tailwind Vite plugin, directory build format.
- `tsconfig.json` — strict TypeScript options and path aliases (`@/*`, `@components/*`, `@utils/*`, `@styles/*`).
- `.prettierrc` — formatting settings.
- `.github/workflows/deploy.yml` — GitHub Pages pipeline using Node 22, frozen pnpm install, `pnpm check`, `pnpm build`, artifact upload, and deploy on push/manual dispatch.
- `src/designs/folio/Layout.astro` — shared shell, tokens, metadata, global styles/scripts, analytics.
- `src/pages/index.astro` — homepage composition and Person JSON-LD.
- `src/data/content.ts` — canonical homepage content source.
- `src/content.config.ts` — Markdown post collection schema.
- `src/pages/posts/[...slug].astro` — static post rendering, article metadata, BlogPosting JSON-LD.
- `src/pages/rss.xml.ts` — RSS feed generation.
- `src/pages/sitemap.xml.ts` — hand-rolled sitemap with per-page `lastmod` from post frontmatter; `robots.txt` points at `/sitemap.xml`.
- `src/utils/paths.ts` — base-aware public URL helper.
- `public/CNAME`, `public/.nojekyll`, `public/robots.txt` — GitHub Pages/custom-domain deployment files.

## Runtime/Tooling Preferences

- CI target is Node 22. Local Node is not pinned elsewhere; match CI when possible.
- Package manager is pnpm 10.33.2. Do not introduce npm/yarn lockfiles.
- Project is ESM (`"type": "module"`). Use ESM syntax in configs/scripts.
- Framework target is Astro static output (`output: 'static'`) with `build.format: 'directory'` and `trailingSlash: 'ignore'`.
- Styling uses Tailwind CSS 4 through `@tailwindcss/vite`; Tailwind scans `src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`.
- Animation libraries are GSAP, ScrollTrigger, Lenis, and component-local browser scripts. Avoid global cleanup that kills triggers owned by other components.
- Deployment assumes `https://arnavpanigrahi.com`, `base: '/'`, `dist/` output, `public/CNAME`, and `public/.nojekyll`.

## Testing & QA

- No unit/E2E test framework or coverage tooling is configured.
- Primary validation before deployment:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm audit
```

- `pnpm check` validates Astro, TypeScript, and content collection frontmatter.
- `pnpm build` validates static routes, RSS, sitemap generation, and deployable output.
- CI currently runs frozen install, `pnpm check`, and `pnpm build`; it does not run audit, lint, or tests.
- For UI/animation changes, manually verify desktop and mobile homepage, reduced-motion behavior, keyboard navigation, mobile nav/collapsibles, copy-email fallback, and no unexpected hero video work on mobile static fallback.
- For content/blog changes, verify `/posts/`, one post detail route, draft filtering expectations, RSS output, and image paths under `public/posts/images/`.
