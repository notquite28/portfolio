# Portfolio Website

A modern, professional portfolio website built with Astro and Tailwind CSS, showcasing software development skills and projects.

## 🚀 Tech Stack

- **Framework**: Astro 5.6.1 - Static site generation with component islands
- **Styling**: Tailwind CSS 4.1.3 - Utility-first CSS framework
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
│   │   ├── Hero.astro - Landing section with tagline and CTA
│   │   ├── About.astro - Professional background and bio
│   │   ├── Skills.astro - Technical skills organized by category
│   │   ├── Projects.astro - Portfolio projects with descriptions
│   │   ├── CTA.astro - Call-to-action and resume link
│   │   └── Footer.astro - Footer with copyright and links
│   └── ui/
│       ├── SkillCard.astro - Reusable skill card component
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
├── sitemap.xml - SEO sitemap
├── favicon.svg - Site icon
└── images/ - Static assets (photos, gifs)
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

4. **Preview Build**:
   ```bash
   pnpm preview
   ```

## 🌐 Deployment

Configured for GitHub Pages with custom domain:
- `public/CNAME` file configures custom domain
- `astro.config.mjs` contains build settings for static output
- `.nojekyll` file disables Jekyll processing
- GitHub Pages automatically provides SSL certificates

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
