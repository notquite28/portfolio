# Portfolio Website

Personal portfolio site built with Astro, Tailwind CSS, and TypeScript.

## 🚀 Tech Stack

- **Framework**: Astro 5 - static site generation
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript - Type-safe development
- **Build Tool**: Vite - Fast build tool and dev server
- **Deployment**: GitHub Pages - Static hosting with custom domain

## 📁 Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   └── BaseLayout.astro - Main layout wrapper with SEO metadata
│   ├── sections/
│   │   ├── Hero.astro - Intro and key highlights
│   │   ├── About.astro - Short personal summary
│   │   ├── Skills.astro - Capability groups
│   │   ├── Projects.astro - Selected work
│   │   ├── CTA.astro - Contact links
│   │   ├── Nav.astro - Scroll-aware navigation
│   │   └── Footer.astro - Footer content
│   └── ui/
│       ├── Icon.astro - Small inline SVG icon helper
│       └── Oneko.astro - Interactive cat mascot component
├── pages/
│   ├── index.astro - Main page with SEO structured data
│   └── 404.astro - Custom 404 page
├── styles/
│   └── global.css - Global CSS with custom properties and animations
└── utils/
    └── paths.ts - Path utilities
public/
├── CNAME - Custom domain configuration
├── .nojekyll - Disables Jekyll processing
├── robots.txt - SEO robots configuration
├── favicon.svg - Site icon
├── js/boid-simulation.js - Background animation
└── media assets - Images, gif, and 404 videos
```

## 🚀 Getting Started

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

## 🌐 Deployment

Configured for static deployment with a custom domain:
- `public/CNAME` file configures custom domain
- `astro.config.mjs` contains build settings for static output
- `.nojekyll` file disables Jekyll processing
- `dist/` is the generated output directory

### Deployment Workflow
```bash
pnpm deploy
```
This runs the build, commits changes, and pushes to GitHub.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
