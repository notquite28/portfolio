# Repository Guidelines

## Project Overview

Static Astro 6 portfolio and Markdown blog for `arnavpanigrahi.com`, deployed to GitHub Pages. The homepage renders typed portfolio data with GSAP and Lenis progressive enhancement. The build also generates article pages, RSS, sitemap, canonical and social metadata, and JSON-LD. There is no backend, API layer, client store, or component-framework island.

## Architecture & Data Flow

- `src/pages/index.astro` composes `Nav`, `Hero`, `About`, `Experience`, `Capabilities`, `Work`, `Contact`, and `Footer` inside `src/designs/folio/Layout.astro`.
- Homepage records live in `src/data/content.ts`. Section components import them directly; do not duplicate portfolio copy. Project order matters because `Work.astro` promotes `projects.slice(0, 4)`.
- Blog data flows from flat `src/content/posts/*.md` files through the schema in `src/content.config.ts`, then through `getCollection('posts')` to:
  - `src/pages/posts/[...slug].astro` for static article pages;
  - `src/pages/posts/index.astro` for the listing;
  - `src/pages/rss.xml.ts` for RSS;
  - `src/pages/sitemap.xml.ts` for sitemap entries.
- A post filename becomes `post.id` and its public slug. Renaming a Markdown file changes article, RSS, and sitemap URLs.
- Every blog consumer uses `import.meta.env.DEV || !post.data.draft`. Public lists and feeds sort newest-first with `published.getTime()`.
- `published` drives the visible date, RSS `pubDate`, article metadata, and `BlogPosting.datePublished`. Optional `updated` drives the visible update date, `dateModified`, and sitemap `lastmod`; otherwise those values fall back to `published`.
- RSS deliberately keeps the original publication date and omits bodies, modification dates, and images. `/posts/` sitemap `lastmod` uses the greatest post modification date.
- `src/designs/folio/Layout.astro` owns the document shell, metadata, JSON-LD injection, theme tokens, fonts, analytics, Lenis, GSAP, and global reveal/parallax behavior. It is shared by the homepage, posts, and 404.
- Browser behavior is progressive enhancement in colocated `.astro` scripts using direct DOM APIs, local closure state, classes, ARIA attributes, and `data-*` hooks. Dependencies are direct imports; there is no dependency-injection container.

## Key Directories

- `src/pages/`: file-based routes, including homepage, 404, blog, RSS, and sitemap.
- `src/designs/folio/`: folio layout and sections. Keep related markup, scoped CSS, and browser scripts together.
- `src/content/posts/`: flat Markdown article sources; nested Markdown files are not loaded.
- `src/data/`: typed homepage content.
- `src/components/ui/`: small shared UI components, currently `Oneko.astro`.
- `src/utils/`: shared helpers such as base-aware `buildUrl()`.
- `src/styles/`: Tailwind entry point and minimal global CSS.
- `public/`: copied assets, project media, post images, crawler files, `CNAME`, and `.nojekyll`.
- `.github/workflows/`: GitHub Pages build and deployment.

## Development Commands

Use pnpm only.

```bash
pnpm install --frozen-lockfile  # install the canonical lockfile
pnpm dev                        # start the Astro development server
pnpm check                      # Astro, TypeScript, and content diagnostics
pnpm build                      # generate the static site in dist/
pnpm preview                    # serve the production build locally
pnpm audit                      # dependency vulnerability audit
pnpm verify                     # frozen install, check, build, and audit
```

There is no `test`, `lint`, `format`, or `deploy` script. Deployment runs through GitHub Actions.

## Code Conventions & Common Patterns

- TypeScript extends `astro/tsconfigs/strict` with `verbatimModuleSyntax` and `noUncheckedIndexedAccess`. Use `import type` for type-only imports and guard indexed access.
- Prettier policy is `printWidth: 120`; `*.astro` overrides it to `999`. No repository formatter command is configured.
- Astro components normally use frontmatter for build-time data, semantic markup, a scoped `<style>`, then a local `<script>` for optional client behavior.
- Component names are PascalCase. CSS classes are kebab-case and section-scoped, such as `hero-*`, `project-*`, and `contact-*`.
- Reuse `.folio-theme` custom properties from `Layout.astro`. Post Markdown styles use `:global(...)` beneath `.post-body`.
- Treat `data-*` selectors as script contracts. Existing hooks include `data-nav`, `data-hero-video`, `data-tilt`, `data-collapsible`, `data-copy-email`, and `data-parallax`.
- Keep section IDs `about`, `experience`, `skills`, `work`, and `contact` aligned with `Nav.astro`.
- Preserve accessibility patterns: native controls, skip link, `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-live`, `inert`, Escape handling, and focus restoration.
- Motion must respect `prefers-reduced-motion`. Gate hover and desktop-only effects with media queries, retain static or no-JS fallbacks, and clean up only resources owned by the component.
- Client async work has explicit fallbacks: `Hero.astro` falls back to a poster/static hero on timeout or media failure; `Contact.astro` falls back from clipboard writes to `mailto:`.
- Preserve GSAP transform ownership. `Work.astro` tilt controls only rotation, while reveal/parallax effects control position and opacity.
- Use `buildUrl()` from `src/utils/paths.ts` for public assets referenced by Astro code. Convert to `new URL(..., Astro.site)` only for absolute metadata URLs. Markdown body images follow their existing root-relative `/posts/images/...` paths.
- `Work.astro` image metadata is keyed by exact project title. Update that map when renaming a featured project.
- Escape `<` in JSON-LD before `set:html` exactly as `Layout.astro` does.
- Post schema requires `title` of 1 to 70 characters, `description` of 50 to 160 characters, nonempty `author`, and `published`. `draft` defaults to `false`; `categories` defaults to `[]`; optional `updated` must be an ISO datetime; optional `image` must be nonempty.
- Post bodies conventionally start at `##` or `###` because the route supplies the page heading. Preserve exact existing media paths; image directories do not consistently match post filenames.

## Important Files

- `package.json`: scripts, ESM mode, dependency ranges, and exact `pnpm@11.11.0` pin.
- `pnpm-lock.yaml`: canonical dependency resolution; do not add npm, Yarn, or Bun lockfiles.
- `pnpm-workspace.yaml`: `esbuild` and `yaml` overrides plus the install-time build allowlist.
- `astro.config.mjs`: static output, production site/base, Tailwind Vite integration, and directory build format.
- `tsconfig.json`, `.prettierrc`, `tailwind.config.js`: strict typing, formatting policy, aliases, and Tailwind source scan.
- `.github/workflows/deploy.yml`: Node 22 GitHub Pages pipeline with frozen install, check, build, artifact upload, and deploy.
- `src/designs/folio/Layout.astro`: metadata, JSON-LD, global styles, and shared browser behavior.
- `src/pages/index.astro`, `src/data/content.ts`: homepage composition and canonical portfolio data.
- `src/content.config.ts`: authoritative post schema and defaults.
- `src/pages/posts/[...slug].astro`: post rendering, dates, BlogPosting JSON-LD, and article metadata.
- `src/pages/rss.xml.ts`, `src/pages/sitemap.xml.ts`: generated discovery endpoints.
- `src/utils/paths.ts`: base-aware public URL helper.
- `public/robots.txt`, `public/CNAME`, `public/.nojekyll`: crawler and GitHub Pages deployment files.

## Runtime/Tooling Preferences

- Use Node 22.12 or newer within Node 22. CI tracks Node 22, while the locked Astro 6 packages require at least 22.12.
- Use the exact pnpm 11.11.0 pin from `package.json`. Preserve `pnpm-lock.yaml`; never introduce another package manager's lockfile.
- The project is ESM (`"type": "module"`). Use ESM syntax in configs and scripts.
- Astro output is static with `build.format: 'directory'`, `base: '/'`, and `trailingSlash: 'ignore'`.
- Tailwind CSS 4 runs through `@tailwindcss/vite`; source scanning is limited to configured `src/**/*` extensions.
- Preserve the `pnpm-workspace.yaml` overrides and native build allowlist for `@tailwindcss/oxide`, `esbuild`, and `sharp`.
- Deployment assumes `https://arnavpanigrahi.com`, `dist/`, `public/CNAME`, and `public/.nojekyll`.

## Testing & QA

- No unit, integration, E2E, visual-regression, or coverage framework is configured. CI runs a frozen install, `pnpm check`, and `pnpm build`; local `pnpm verify` also runs the dependency audit.
- `pnpm build` proves route and asset generation, not browser behavior. For UI changes, run `pnpm preview` and inspect desktop and mobile widths.
- For UI or motion changes, check reduced motion, keyboard navigation, mobile nav and collapsibles, copy-email fallback, desktop hero scrubbing, mobile static hero, console errors, and failed asset requests.
- For blog/content changes, inspect `/posts/`, one article, draft filtering, public image paths, `/rss.xml`, and `/sitemap.xml`.
- For SEO, RSS, or sitemap changes, inspect generated output:
  - canonical and `og:url` use the same absolute article URL;
  - `og:image`, `twitter:image`, and `BlogPosting.image` use the absolute frontmatter image or `og-image.png`;
  - visible dates match `article:*_time` and `BlogPosting.datePublished/dateModified`;
  - categories appear as repeated `article:tag` values and JSON-LD keywords;
  - article and `/posts/` sitemap `lastmod` values follow the modification rules above;
  - RSS retains the original `pubDate`, stable permalink/GUID, description, categories, and author;
  - homepage emits Person JSON-LD and `src/pages/404.astro` emits `noindex, follow`.
