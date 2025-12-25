# Arnav Panigrahi - Portfolio

A modern, professional portfolio website built with Astro and Tailwind CSS, showcasing software development skills and AI/ML projects.

## ✨ Features

### Professional Content
- **Enhanced Hero Section**: Compelling tagline and clear call-to-action buttons
- **Professional About Section**: Quantified achievements and impact metrics
- **Experience Section**: Detailed work history with key accomplishments
- **Improved Projects**: Better descriptions, impact metrics, and professional presentation
- **Enhanced Skills**: Organized by category with relevant technologies
- **Call-to-Action**: Encourages visitor engagement

### Technical Optimizations
- **Performance**: CSS optimizations with `will-change` and `backface-visibility`
- **SEO**: Structured data, meta tags, and proper heading hierarchy
- **Accessibility**: Proper alt text, ARIA labels, and semantic HTML
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Animations**: Smooth transitions and hover effects

### Visual Enhancements
- **Glass Morphism**: Modern UI design with interactive glass effects
- **Boid Simulation**: Interactive background animation
- **Smooth Transitions**: Professional animations and micro-interactions
- **Dracula Theme**: Consistent color scheme throughout

## 🚀 Technologies

- **Framework**: Astro 5.6+
- **Styling**: Tailwind CSS 4.1+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Experience.astro
│   │   ├── Skills.astro
│   │   ├── Projects.astro
│   │   ├── CTA.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   └── ui/
│       ├── SkillCard.astro
│       └── Oneko.astro
├── pages/
│   ├── index.astro
│   └── 404.astro
├── styles/
│   └── global.css
└── utils/
    └── paths.ts
```

## 🎯 Key Improvements Made

### Content Enhancements
1. **Professional Messaging**: Updated with Master's degree and specific business impact metrics
2. **Quantified Achievements**: Added specific metrics ($20K annual savings, 60% efficiency improvement, 90% cost savings)
3. **Experience Section**: Detailed work history at AllCheer and Pinnacle Consulting with achievements
4. **Education Section**: New section showcasing Master of Science in Computer Science from UC Riverside
5. **Enhanced Projects**: Updated with multi-modal AI platform, enterprise ROI system, and utility mapping solutions
6. **Comprehensive Skills**: Organized by technical areas including AI/ML, cloud platforms, and software engineering practices
7. **Contact Information**: Added phone number and location for professional networking

### Technical Optimizations
1. **Performance**: Added CSS optimizations for smoother animations
2. **SEO**: Implemented comprehensive structured data and meta tags
3. **Accessibility**: Improved ARIA labels and semantic structure
4. **Code Quality**: Better TypeScript interfaces and component organization

### Visual Improvements
1. **Interactive Elements**: Enhanced hover effects and smooth transitions
2. **Professional Layout**: Better spacing, typography, and visual hierarchy
3. **Consistent Design**: Unified glass morphism theme throughout all sections

## 🆕 New Sections Added

- **Experience Section**: Professional work history with quantified achievements
- **Education Section**: Academic credentials and specialization
- **CTA Section**: Encourages visitor engagement
- **Enhanced Contact**: Professional contact information and social links

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

The portfolio is configured for GitHub Pages deployment with custom domain:
- **Custom Domain**: arnavpanigrahi.com
- **Base path**: `/` (root)
- **Static output**
- **Optimized build settings**

### Domain Setup
1. **GitHub Pages**: Repository settings → Pages → Custom domain → `arnavpanigrahi.com`
2. **DNS Configuration**: Point your domain to GitHub Pages servers
3. **SSL**: GitHub Pages automatically provides SSL certificates
4. **CNAME**: The `public/CNAME` file ensures domain persistence

## 📊 Performance Metrics

- **Lighthouse Score**: Optimized for performance, accessibility, and SEO
- **Core Web Vitals**: Optimized animations and transitions
- **Mobile Responsiveness**: Mobile-first design approach

## 🔧 Customization

### Adding New Sections
1. Create new component in `src/components/sections/`
2. Import and add to `src/pages/index.astro`
3. Update navigation if needed

### Modifying Content
- Update content in respective component files
- Modify data arrays for projects, skills, and experience
- Update meta tags in `BaseLayout.astro`

### Styling Changes
- Modify `src/styles/global.css` for global styles
- Use Tailwind classes for component-specific styling
- Update color scheme in CSS custom properties

## 🗒️ Updates

- Updated CTA resume icon to point to hosted PDF: [Resume](https://notquite28.github.io/resume/resumeml.pdf)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
