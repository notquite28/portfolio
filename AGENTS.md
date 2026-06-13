# Repository Guidelines

## Project Overview

Static Astro 6 portfolio and blog for `arnavpanigrahi.com`, deployed as a static site to GitHub Pages. The homepage is a portfolio landing page with GSAP/Lenis motion, data-driven sections, and first-party Markdown blog posts with RSS and sitemap output.

## Architecture & Data Flow

- `src/pages/index.astro` composes the homepage from `src/designs/folio/*` sections inside the shared folio `Layout.astro`.
- Homepage content comes from `src/data/content.ts` and is passed into components such as `Hero.astro`, `About.astro`, `Experience.astro`, `Capabilities.astro`, `Work.astro`, and `Contact.astro`.
- `src/designs/folio/Layout.astro` owns global shell concerns: metadata, canonical URLs, OG/Twitter tags, RSS discovery, JSON-LD injection, Google fonts, global design tokens, skip link, Oneko, production Cloudflare analytics, Lenis, GSAP ScrollTrigger reveal/parallax setup, and global CSS.
- Blog posts are Astro content collection entries from flat Markdown files in `src/content/posts/*.md`, validated by `src/content.config.ts`.
- Blog routes consume the same posts collection:
  - `src/pages/posts/index.astro` lists non-draft posts newest-first.
  - `src/pages/posts/[...slug].astro` statically renders each non-draft post, article metadata, and `BlogPosting` JSON-LD.
  - `src/pages/rss.xml.ts` emits the non-draft RSS feed.
- Public assets live in `public/`. In Astro components, build public URLs through `buildUrl()` from `src/utils/paths.ts`; Markdown commonly uses root-relative `/posts/images/...` image paths.
- Client behavior is local to Astro components and mostly targets `data-*` hooks (`data-hero-video`, `data-tilt`, `data-collapsible`, `data-copy-email`, `data-parallax`, `data-nav`).

## Key Directories

- `src/pages/` — Astro routes: homepage, 404, posts index/detail, RSS endpoint.
- `src/designs/folio/` — portfolio shell and homepage section components. Keep folio-specific UI here.
- `src/data/` — typed-ish portfolio content objects for profile, experience, skills, and projects.
- `src/content/posts/` — first-party Markdown blog posts; filename is the post route slug.
- `src/components/ui/` — small reusable UI components, currently including `Oneko.astro`.
- `src/utils/` — shared utilities such as `buildUrl()` for base-aware public asset paths.
- `src/styles/` — Tailwind import and global base CSS.
- `public/` — deployable static assets, including `CNAME`, `.nojekyll`, `robots.txt`, OG/hero assets, and post images.
- `.github/workflows/` — GitHub Pages build/deploy workflow.

## Development Commands

Use pnpm only.

```bash
pnpm install --frozen-lockfile  # install exactly from pnpm-lock.yaml
pnpm dev                        # local Astro dev server
pnpm check                      # Astro, TypeScript, and content diagnostics
pnpm build                      # static production build to dist/
pnpm preview                    # preview built output locally
pnpm audit                      # dependency vulnerability audit
pnpm verify                     # frozen install + check + build + audit
```

There is no `test`, `lint`, `format`, or `deploy` script. CI builds on PRs and deploys only on pushes to `main` or manual dispatch.

## Code Conventions & Common Patterns

- TypeScript is strict via `astro/tsconfigs/strict`; `verbatimModuleSyntax` and `noUncheckedIndexedAccess` are enabled.
- Use `import type` for type-only imports and guard indexed access instead of assuming lookups exist.
- Path aliases exist (`@/*`, `@components/*`, `@utils/*`, `@styles/*`), but existing source often uses relative imports. Follow local file style.
- Prettier config: `printWidth: 120`; `*.astro` uses `printWidth: 999`.
- Keep section-specific scripts and styles inside the relevant `.astro` component. Put only truly global tokens/rules in `Layout.astro` or `src/styles/global.css`.
- Use `.folio-theme` CSS custom properties from `Layout.astro` (`--c-accent`, `--c-body`, `--font-serif`, `--ease-expo`, etc.) instead of inventing unrelated colors, fonts, or easing.
- Use `buildUrl()` for public assets in Astro so `BASE_URL` is respected. Markdown post images can stay root-relative under `/posts/images/...`.
- Motion must degrade gracefully:
  - respect `prefers-reduced-motion`
  - gate hover/pointer-only effects with appropriate media queries
  - avoid initializing heavy video/GSAP behavior on mobile when a static fallback is intended
- Reveal animation conventions:
  - `.reveal` for single elements
  - `.reveal-group` and `.reveal-child` for staggered groups
  - Layout owns the shared GSAP ScrollTrigger reveal wiring
- Interactive components should use native controls where possible (`button`, `a`) and maintain `aria-expanded`, `aria-hidden`, `aria-controls`, and `inert` for collapsible/menu states.
- Blog content uses frontmatter title as the visible page `h1`; Markdown bodies should start at `##`/`###`, not another `#`.
- Blog frontmatter schema requires `title`, `description`, `author`, `published`, and `categories`; `updated` is optional ISO datetime; `draft: true` hides posts in production routes and RSS.

## Important Files

- `package.json` — scripts, dependencies, pnpm version pin (`pnpm@10.33.2`), ESM mode.
- `pnpm-workspace.yaml` — pnpm overrides (`esbuild`, `yaml`) and allowed built dependencies.
- `pnpm-lock.yaml` — canonical dependency lockfile; do not add npm/yarn lockfiles.
- `astro.config.mjs` — static output, production site URL, sitemap integration, Tailwind Vite plugin, directory build format.
- `tsconfig.json` — strict TypeScript options and aliases.
- `.prettierrc` — formatting settings.
- `.github/workflows/deploy.yml` — GitHub Pages CI/CD using Node 22 and pnpm.
- `src/designs/folio/Layout.astro` — shared page shell, metadata, tokens, global scripts, analytics.
- `src/pages/index.astro` — homepage composition and Person JSON-LD.
- `src/data/content.ts` — canonical homepage content source.
- `src/content.config.ts` — Markdown post collection schema.
- `src/pages/posts/[...slug].astro` — static post rendering, article metadata, post styles.
- `src/pages/rss.xml.ts` — RSS feed generation.
- `src/utils/paths.ts` — base-aware public URL helper.
- `public/CNAME`, `public/.nojekyll`, `public/robots.txt` — GitHub Pages/custom-domain deployment files.

## Runtime/Tooling Preferences

- Runtime target in CI: Node 22.
- Package manager: pnpm 10.33.2. Do not introduce npm/yarn lockfiles.
- Project module format: ESM (`"type": "module"`).
- Framework: Astro static output (`output: 'static'`) with `build.format: 'directory'` and `trailingSlash: 'ignore'`.
- Styling: Tailwind CSS 4 through `@tailwindcss/vite`; `src/styles/global.css` imports Tailwind.
- Animation libraries: GSAP + ScrollTrigger, Lenis, and component-local browser scripts. Avoid global animation cleanup that kills triggers owned by other components.
- Deployment target: GitHub Pages static artifact from `dist/`; keep `public/CNAME` and `public/.nojekyll` intact.
- Production URLs should stay on `https://arnavpanigrahi.com` unless the domain intentionally changes.

## Testing & QA

- No unit or E2E test framework is configured.
- Primary validation before deploy:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm audit
```

- Use `pnpm preview` for local built-site smoke tests when changing routes, metadata, assets, animation, or rendering behavior.
- `pnpm check` validates Astro, TypeScript, and content collection frontmatter.
- `pnpm build` validates static routes, RSS, sitemap generation, and deployable output.
- For UI/animation changes, manually verify:
  - desktop and mobile homepage
  - `/posts/` and at least one post detail route
  - reduced-motion behavior
  - keyboard navigation for nav menus and collapsibles
  - no unexpected video downloads on mobile static fallback
