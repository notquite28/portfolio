# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

This is a personal portfolio website built with **Astro 5** and **Tailwind CSS 4**. It's a statically generated site deployed to GitHub Pages with a custom domain.

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (localhost:4321)
pnpm build            # Build for production (outputs to ./dist)
pnpm preview          # Preview production build locally
pnpm deploy           # Build, commit, and push
```

**Note:** This project does not have configured lint, typecheck, or test commands. Astro's built-in type checking runs during build.

## Project Structure

```
src/components/     # layouts/, sections/, ui/
src/pages/          # Route pages (index.astro, 404.astro)
src/styles/         # Global CSS (global.css)
src/utils/          # Utility functions (paths.ts)
public/             # Static assets (images, favicon, js)
```

## Code Style Guidelines

### TypeScript

- **Strict mode:** Project extends `astro/tsconfigs/strict`
- **Module syntax:** Uses `verbatimModuleSyntax: true` - explicit type imports required
- **Array access:** `noUncheckedIndexedAccess: true` - always handle undefined

```typescript
// Correct - explicit type import
import type { SomeType } from 'module';
import { someValue } from 'module';

// Handle potentially undefined array access
const item = array[0];
if (item) {
  // use item
}
```

### Astro Components

**Frontmatter pattern:**
```astro
---
import Component from '../path';
import { utility } from '../../utils/paths';

interface Props {
  title: string;
  optional?: string;
}

const { title, optional = 'default' } = Astro.props;
---

<section class="...">
  <!-- Template -->
</section>
```

**Key conventions:**
- Define `Props` interface at the top of frontmatter
- Destructure props with defaults immediately after interface
- Use relative imports (../../path)
- Import global CSS only in BaseLayout

### Path Aliases

Configured in tsconfig.json:
```typescript
import Component from '@components/ui/Component.astro';
import { buildUrl } from '@utils/paths';
import '@styles/global.css';
```

### Styling (Tailwind CSS 4)

- Uses **Dracula color palette** defined in `@theme` block in global.css
- Custom glass effects: `.glass`, `.glass-liquid`, `.glass-container`
- Custom buttons: `.btn-fancy` with `.btn-wrap` wrapper
- Animation: `.section-transition` for fade-up entrance
- Text utilities: `.text-gradient`, `.text-accent`, `.text-comment`
- Key colors: `--color-brand-500` (purple), `--color-accent-500` (pink), `--color-surface` (dark bg)

### Import Organization

1. CSS imports (only in layouts)
2. External library imports
3. Internal component imports (use aliases)
4. Utility imports
5. Type imports (with `type` keyword)

### Component Patterns

**Section components** (`src/components/sections/`):
- Accept props with sensible defaults
- Use semantic HTML (`<section>`, `<main>`, etc.)
- Include `section-transition` class for animations

**UI components** (`src/components/ui/`):
- Highly reusable, minimal assumptions about context
- Accept className prop for customization

### Error Handling

- For static site, prefer graceful degradation over errors
- Use optional chaining and nullish coalescing
- Check for DOM elements before manipulating

```typescript
const element = document.getElementById('id');
if (!element) return;
// proceed with element
```

### Naming Conventions

- **Files:** PascalCase for components (`SkillCard.astro`)
- **Functions:** camelCase (`getBaseUrl`, `buildUrl`)
- **Interfaces:** PascalCase (`Props`, `Skill`)
- **CSS classes:** kebab-case (`glass-container`, `btn-fancy`)
- **Constants:** SCREAMING_SNAKE_CASE for true constants

### Scripts in Astro

Client-side scripts use `<script>` tags within components. TypeScript is supported.

For scripts needing server variables, use `define:vars`:
```astro
<script define:vars={{ baseUrl }}>
  console.log(baseUrl);
</script>
```

### SEO Considerations

- All pages should use BaseLayout for consistent meta tags
- Pass `title`, `description`, and `image` props to BaseLayout
- Structured data (JSON-LD) goes in individual pages
- Use `buildUrl()` for absolute URLs in meta tags

## Deployment

- Automatic deployment via GitHub Actions on push to `main`
- Uses pnpm with Node 20
- Outputs static files to `./dist`
- Custom domain configured via `public/CNAME`

## Common Tasks

**Add a new section:**
1. Create `src/components/sections/NewSection.astro`
2. Follow Props pattern with defaults
3. Import and add to `src/pages/index.astro`

**Add a new UI component:**
1. Create `src/components/ui/NewComponent.astro`
2. Make props flexible with optional values
3. Use existing Tailwind/utilities where possible

**Modify styles:**
1. Check global.css for existing utilities first
2. Add theme colors to `@theme` block
3. Create reusable CSS classes for patterns

**Add new static assets:**
1. Place in `public/` directory
2. Reference with `buildUrl('filename.ext')` for correct paths
