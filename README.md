# Portfolio Website

Personal portfolio site built with Astro, Tailwind CSS, and TypeScript.

## Tech Stack

- **Framework**: Astro 6 - static site generation
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript - type-safe development
- **Build Tool**: Vite - fast build tool and dev server
- **Deployment**: GitHub Pages - static hosting with custom domain

## Project Structure

```
src/
├── data/
│   └── content.ts           All site content: profile, projects, skills, experiences
├── designs/
│   └── folo/
│       ├── Layout.astro     Main layout with SEO metadata, fonts, CSS tokens, Oneko
│       ├── Nav.astro        Sticky navigation with mobile hamburger menu
│       ├── Hero.astro       Intro section with "Selected work" and "Get in touch"
│       ├── About.astro      Background section with circular portrait
│       ├── Experience.astro Work history section
│       ├── Capabilities.astro  Skill categories
│       ├── Work.astro       Selected projects
│       ├── Contact.astro    CTA and contact links
│       └── Footer.astro     Footer with social links
├── components/
│   └── ui/
│       └── Oneko.astro      Interactive cat mascot widget
├── pages/
│   ├── index.astro          Homepage composing all sections
│   └── 404.astro            Custom 404 with Three.js daruma model
├── styles/
│   └── global.css           Tailwind import, smooth scroll, scroll-margin-top
└── utils/
    └── paths.ts             buildUrl() for base-aware asset URLs
public/
├── js/
│   └── notfound-model.js    Three.js viewer for 404 page daruma model
├── daruma.glb               3D daruma model for 404 page
├── jelly.webp               Portrait image (also used as OG image)
├── oneko.gif                Cat mascot sprite sheet
├── CNAME                    Custom domain configuration
├── favicon.svg              Site icon
└── robots.txt               SEO robots configuration
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Development Server**:
   ```bash
   pnpm dev
   ```

3. **Build for Production**:
   ```bash
   pnpm build
   ```

4. **Run Checks**:
   ```bash
   pnpm check
   ```

5. **Preview Build**:
   ```bash
   pnpm preview
   ```

## Deployment

Configured for static deployment with a custom domain:
- `public/CNAME` file configures custom domain
- `astro.config.mjs` sets `output: 'static'`
- `.nojekyll` file disables Jekyll processing
- `dist/` is the generated output directory

### Deployment Workflow
```bash
pnpm deploy
```
This runs the build, commits changes, and pushes to GitHub.

## Asset Credits

- 404 page daruma model (`daruma.glb`): `daruma-texture` by `beauuuuuuuuu`
- Source: https://skfb.ly/p9AXv
- License: CC Attribution 4.0
- License URL: http://creativecommons.org/licenses/by/4.0/

## License

This project is open source and available under the [MIT License](LICENSE).
