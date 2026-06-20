# Portfolio Website

Personal portfolio and blog for `arnavpanigrahi.com`, built as a static Astro 6 site with Tailwind CSS 4 and TypeScript.

## Tech Stack

- **Framework**: Astro 6 static site generation
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite`
- **Language**: TypeScript
- **Build Tool**: Vite
- **Animation**: GSAP, ScrollTrigger, Lenis, and component-local browser scripts
- **Deployment**: GitHub Pages with a custom domain

## Project Structure

```
src/
├── content.config.ts         Astro Content Collections schema for posts
├── content/
│   └── posts/                Markdown blog posts
├── data/
│   └── content.ts            Portfolio content: profile, projects, skills, experiences
├── designs/
│   └── folio/
│       ├── Layout.astro      Shared shell, metadata, theme tokens, global motion setup
│       ├── Nav.astro         Primary navigation and mobile menu
│       ├── Hero.astro        Homepage hero with progressive-enhanced video scrub
│       ├── About.astro       Background/profile section
│       ├── Experience.astro  Work history section
│       ├── Capabilities.astro Skill categories
│       ├── Work.astro        Selected projects and collapsible details
│       ├── Contact.astro     Contact CTA and links
│       └── Footer.astro      Footer and back-to-top control
├── components/
│   └── ui/
│       └── Oneko.astro       Interactive cat mascot widget
├── pages/
│   ├── index.astro           Homepage composition
│   ├── 404.astro             Custom 404 page with video background
│   ├── rss.xml.ts            RSS feed endpoint
│   └── posts/
│       ├── index.astro       Blog index
│       └── [...slug].astro   Static blog post route
├── styles/
│   └── global.css            Tailwind import and global base CSS
└── utils/
    └── paths.ts              buildUrl() for base-aware public asset URLs

public/
├── posts/images/             Blog post images
├── og-image.png              Social preview image
├── hero-video-scrub.mp4      Homepage hero video asset
├── hero_404.webm             404 background video
├── hero-poster.jpg           Hero video poster
├── oneko.gif                 Cat mascot sprite sheet
├── CNAME                     Custom domain configuration
├── .nojekyll                 Disable Jekyll processing on GitHub Pages
├── favicon.svg               Site icon
└── robots.txt                SEO robots configuration
```

## Getting Started

Install dependencies from the lockfile:

```bash
pnpm install --frozen-lockfile
```

Start the development server:

```bash
pnpm dev
```

Run Astro, TypeScript, and content diagnostics:

```bash
pnpm check
```

Build the static production site:

```bash
pnpm build
```

Preview the built output locally:

```bash
pnpm preview
```

Run the full local verification sequence:

```bash
pnpm verify
```

## Deployment

The site is configured for static deployment to GitHub Pages:

- `astro.config.mjs` sets `output: 'static'`, `site: 'https://arnavpanigrahi.com'`, and directory-style builds.
- `public/CNAME` configures the custom domain.
- `public/.nojekyll` disables Jekyll processing.
- `dist/` is the generated output directory.
- `.github/workflows/deploy.yml` installs with `pnpm install --frozen-lockfile`, runs `pnpm build`, uploads `dist/`, and deploys on pushes to `main` or manual workflow dispatch.

There is no `pnpm deploy` script. Use the GitHub Actions workflow for deployment.

## Content Notes

- Portfolio content lives in `src/data/content.ts`.
- Blog posts live in `src/content/posts/*.md` and are validated by `src/content.config.ts`.
- Draft posts are visible in development and hidden from production routes/RSS.
- Public asset paths in Astro components should use `buildUrl()` from `src/utils/paths.ts`.

## License

No license file is currently committed.
