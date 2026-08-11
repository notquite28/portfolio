# Repository Guidelines

## Project Overview

Static Astro 6 portfolio and Markdown blog for `arnavpanigrahi.com`, deployed to GitHub Pages. The homepage combines typed portfolio data with GSAP/Lenis motion. The blog generates static article pages, RSS, sitemap, canonical/social metadata, and JSON-LD.

## Architecture & Data Flow

- `src/pages/index.astro` composes `Nav`, `Hero`, `About`, `Experience`, `Capabilities`, `Work`, `Contact`, and `Footer` inside `src/designs/folio/Layout.astro`. Homepage copy and records come from `src/data/content.ts`; do not duplicate them in section components.
- Blog data flows from `src/content/posts/*.md` through the schema in `src/content.config.ts`, then through `getCollection('posts')` to:
  - `src/pages/posts/[...slug].astro` for static article pages;
  - `src/pages/posts/index.astro` for the listing;
  - `src/pages/rss.xml.ts` for RSS;
  - `src/pages/sitemap.xml.ts` for sitemap entries.
- Use the shared publication predicate everywhere: `import.meta.env.DEV || !post.data.draft`. Sort public lists and feeds newest-first with `published.getTime()`.
- `src/designs/folio/Layout.astro` owns the document shell: canonical, Open Graph, Twitter, RSS discovery, optional article timestamps/tags, JSON-LD injection, fonts, theme tokens, skip link, Oneko, production analytics, Lenis, GSAP, and global reveal/parallax behavior.
- Article frontmatter drives metadata:
  - `published` becomes the visible publication date, RSS `pubDate`, article metadata, and `BlogPosting.datePublished`;
  - optional `updated` becomes the visible updated date, article modified metadata, `BlogPosting.dateModified`, and sitemap `lastmod`; otherwise modified dates fall back to `published`;
  - optional `image` selects a base-aware article image for OG, Twitter, and `BlogPosting.image`; otherwise pages use `public/og-image.png`.
- RSS intentionally keeps the original publication date and does not contain article bodies, modification dates, or article images. Sitemap article dates use `updated ?? published`; `/posts/` uses the greatest modified date across all posts.
- Client behavior is progressive enhancement in colocated `.astro` scripts with direct DOM APIs and `data-*` hooks. There are no React/Vue islands.

## Key Directories

- `src/pages/` — file-based routes, including homepage, 404, blog, RSS, and sitemap.
- `src/designs/folio/` — shared layout and portfolio sections. Keep folio markup, scoped styles, and browser scripts here.
- `src/content/posts/` — flat Markdown article sources.
- `src/data/` — typed portfolio content.
- `src/components/ui/` — small shared UI components; currently `Oneko.astro`.
- `src/utils/` — shared helpers such as base-aware `buildUrl()`.
- `src/styles/` — Tailwind import and minimal global CSS.
- `public/` — copied static assets, including social/project media, dated post images, `robots.txt`, `CNAME`, and `.nojekyll`.
- `.github/workflows/` — GitHub Pages build and deployment.

## Development Commands

Use pnpm only.

```bash
pnpm install --frozen-lockfile  # install the canonical lockfile
pnpm dev                        # local Astro server
pnpm check                      # Astro, TypeScript, and content diagnostics
pnpm build                      # static build to dist/
pnpm preview                    # preview the production build
pnpm audit                      # dependency vulnerability audit
pnpm verify                     # frozen install + check + build + audit
```

There is no `test`, `lint`, `format`, or `deploy` script. Deployment runs through GitHub Actions.

## Code Conventions & Common Patterns

- TypeScript extends `astro/tsconfigs/strict` with `verbatimModuleSyntax` and `noUncheckedIndexedAccess`. Use `import type` for type-only imports and guard indexed access.
- Prettier policy is `printWidth: 120`; `*.astro` overrides it to `999`. No repository formatter command is configured.
- Astro files generally use frontmatter imports/data, semantic markup, component-scoped `<style>`, then a local `<script>` for progressive enhancement.
- Component names are PascalCase. CSS classes are kebab-case and section-scoped (`hero-*`, `project-*`, `contact-*`).
- Prefer existing `.folio-theme` custom properties from `Layout.astro` over new unrelated tokens.
- Use existing `data-*` interaction hooks (`data-nav`, `data-tilt`, `data-collapsible`, `data-copy-email`, `data-parallax`, `data-hero-video`).
- Preserve accessibility patterns: native controls, skip link, `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-live`, `inert`, Escape handling, and focus restoration.
- Motion must respect `prefers-reduced-motion`. Gate hover/desktop-only work with media queries, retain static/no-JS fallbacks, and clean up only resources owned by the component.
- Use `buildUrl()` from `src/utils/paths.ts` for public assets referenced by Astro code. Convert to an absolute `new URL(..., Astro.site)` only for canonical/social/structured metadata. Markdown post-body images commonly use `/posts/images/<dated-slug>/...`.
- Escape JSON-LD before `set:html` exactly as `Layout.astro` does.
- Blog frontmatter requires `title`, 50–160-character `description`, `author`, `published`, and `categories`. `updated` must be an ISO datetime; `image` is an optional non-empty public asset path; `draft: true` hides the post in production. Markdown bodies start at `##`/`###`, not another `#`.

## Important Files

- `package.json` — scripts, ESM mode, and exact `pnpm@11.11.0` pin.
- `pnpm-lock.yaml` — canonical lockfile; do not add npm/yarn lockfiles.
- `pnpm-workspace.yaml` — `esbuild`/`yaml` overrides and install-time build allowlist.
- `astro.config.mjs` — static output, production site/base, Tailwind Vite plugin, and directory build format.
- `tsconfig.json`, `.prettierrc`, `tailwind.config.js` — strict typing, formatting policy, and Tailwind source scan.
- `.github/workflows/deploy.yml` — Node 22 GitHub Pages pipeline with frozen install, check, build, artifact upload, and deploy.
- `src/designs/folio/Layout.astro` — shared metadata, JSON-LD, global styles, and global browser behavior.
- `src/pages/index.astro`, `src/data/content.ts` — homepage composition and canonical portfolio data.
- `src/content.config.ts` — post schema and defaults.
- `src/pages/posts/[...slug].astro` — article rendering, visible dates, BlogPosting JSON-LD, and article metadata.
- `src/pages/rss.xml.ts`, `src/pages/sitemap.xml.ts` — generated discovery endpoints.
- `src/utils/paths.ts` — base-aware public URL helper.
- `public/robots.txt`, `public/CNAME`, `public/.nojekyll` — crawler and GitHub Pages deployment files.

## Runtime/Tooling Preferences

- Use Node 22.12 or newer within the Node 22 line to match CI and locked dependency requirements.
- Use the exact pnpm 11.11.0 pin from `package.json`. Preserve `pnpm-lock.yaml`; never introduce npm or Yarn lockfiles.
- The project is ESM (`"type": "module"`). Use ESM syntax in configs and scripts.
- Astro output is static with `build.format: 'directory'`, `base: '/'`, and `trailingSlash: 'ignore'`.
- Tailwind CSS 4 runs through `@tailwindcss/vite`; source scanning is limited to configured `src/**/*` extensions.
- Preserve the `pnpm-workspace.yaml` overrides and built-dependency allowlist.
- Deployment assumes `https://arnavpanigrahi.com`, `dist/`, `public/CNAME`, and `public/.nojekyll`.

## Testing & QA

- No unit, integration, E2E, or coverage framework is configured. CI runs frozen install, `pnpm check`, and `pnpm build`; local `pnpm verify` also runs the dependency audit.
- For UI or motion changes, inspect desktop and mobile, reduced-motion behavior, keyboard navigation, mobile nav/collapsibles, copy-email fallback, and the mobile static hero fallback.
- For blog/content changes, build and inspect `/posts/`, one article, draft filtering, public image paths, `/rss.xml`, and `/sitemap.xml`.
- For SEO/RSS/sitemap changes, verify the generated production output:
  - canonical and `og:url` are the same absolute article URL;
  - `og:image`, `twitter:image`, and `BlogPosting.image` use the absolute frontmatter image or the absolute `og-image.png` fallback;
  - visible published/updated dates match `article:*_time` and `BlogPosting.datePublished/dateModified`;
  - categories appear as repeated `article:tag` values and JSON-LD keywords;
  - article and `/posts/` sitemap `lastmod` values reflect the content modification rules above;
  - RSS retains the original `pubDate`, stable permalink/GUID, description, categories, and author;
  - homepage uses Person JSON-LD and `src/pages/404.astro` emits `noindex, follow`.
- `pnpm build` proves route generation, not browser behavior. Use `pnpm preview` and inspect the rendered page at mobile and desktop widths for UI-affecting changes.
