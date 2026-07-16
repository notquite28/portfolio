Typography carries most of the information on the page. Replace generic defaults (Inter, Roboto, system fallback at flat scale) with type that reflects the brand and scales with intentional contrast.

---

## Register

Web brand: run the font selection procedure in [brand.md](brand.md). Fluid `clamp()` scale, ≥1.25 ratio between steps.

Web product: system fonts and familiar sans stacks are legitimate here. One well-tuned family typically carries the whole UI. Fixed `rem` scale, 1.125–1.2 ratio between more closely-spaced steps.


## Platform routing (required)

Resolve `## Platform` from **PRODUCT.md** before either assessment. If it is missing, stop and route through Setup's `/impeccable init` platform capture; absence is unknown, never implicit `web`.

- **Web** (including mobile web): follow the web assessment, detector, CSS/Tailwind searches, implementation guidance, live-mode params, and web reference below exactly as written.
- **iOS / Android / adaptive**: read [ios.md](ios.md), [android.md](android.md), or both for `adaptive` if Setup has not already loaded them. Follow the native assessment and source pre-scan below. Do **not** run `detect.mjs`, look for HTML/CSS/Tailwind, require Node, apply `rem`/`clamp()`/web-font rules, or use live mode. Platform text roles and user text scaling override the web size and font-stack guidance in this file.

For a monorepo, route by the target surface named by the user, not by the mere presence of web and native code elsewhere in the repository.
---

## Two isolated assessments (required)

Spawn two parallel sub-agents whenever a sub-agent/Task tool is exposed: one for the typography assessment, one for the platform-appropriate mechanical pre-scan. If the harness needs explicit user permission for sub-agents, stop and ask before proceeding. Isolation is the point: search output anchors visual judgment toward what the scan can see, so neither sub-agent gets the other's output. Each assessment runs in its own sub-agent; running either one in this context when a sub-agent tool exists is not permitted, even when it is faster; the fallback below is only for sessions with no sub-agent tool. Give each a self-contained prompt (target files, register, platform, **DESIGN.md** content when present, and its instructions below); do not assume it can read this file.

**Sub-agent A (typography assessment)**: give it the full applicable web or native branch from [Assess Current Typography](#assess-current-typography), verbatim, in its prompt. It works through every item and returns per-item findings citing file, selector, component/view, text role, or value.

**Sub-agent B (mechanical pre-scan)**: choose exactly one branch:

**Web only** — run the bundled detector scoped to type:

```bash
node .github/skills/impeccable/scripts/detect.mjs --json --scope type [target files or dirs]
```

A missing `node` on PATH is not permission to skip: hunt for a runtime (`command -v node`, nvm or Homebrew paths, the harness's own bundled node) and run it by full path. If none exists, halt the scan and report that Node must be installed (the parent relays this to the user); do **not** substitute grep for the detector or proceed unscanned. The scan checks literal font sizes against the **DESIGN.md** ramp but abstains on `em`, `%`, `clamp()`, and line-heights, so also search the web sources for `font-size\s*:`, `fontSize`, `text-\[`, and `leading-\[` and judge those CSS/Tailwind hits against the spec. Return the findings JSON plus the search verdicts.

**iOS / Android / adaptive** — do not run the detector and do not search HTML, CSS, or Tailwind. Search only the target app's native source and return cited hits plus a verdict for every applicable check:

- **iOS**: find hard-coded point-size APIs and fixed custom-font sizes; verify each text instance maps to a semantic Dynamic Type text style or uses a scaling API such as `UIFontMetrics` / `@ScaledMetric`; find opt-outs, restrictive Dynamic Type ranges, truncation, fixed-height text containers, and UIKit labels that fail to enable content-size-category adjustment. A numeric size is a finding only when it bypasses scaling or duplicates a role, not merely because a framework produces a resolved point size.
- **Android**: find `px` text sizes and screen-local `fontSize`, `lineHeight`, `letterSpacing`, `TextStyle`, XML `textSize`, or imperative `setTextSize` values; verify text maps to the Material 3 Display / Headline / Title / Body / Label scale through theme roles and uses scalable `sp`, not fixed pixels. Flag disabled system font scaling, clipped fixed-height containers, and one-off role definitions; do not flag an `sp` value merely for being numeric when it is the centralized theme role definition.
- **Adaptive / cross-platform**: run both platform verdicts against the code paths rendered on each OS. In React Native or Flutter, additionally find disabled scaling (`allowFontScaling={false}`, restrictive `maxFontSizeMultiplier`, `TextScaler.noScaling`, or equivalents), raw per-screen font sizes that bypass the shared semantic type theme, and text containers that cannot grow. Verify the app adapts typeface/roles where its platform design language differs; one Material-everywhere design is judged by Android roles but still must honor iOS Dynamic Type accessibility behavior.

**If no sub-agent tool is exposed (or the user declined)**: run both yourself, assessment first, pre-scan second, so the deterministic findings can't anchor the visual judgment. Keep that order even when the scan feels quicker to start with.

**Synthesize** once both are done: merge into a single findings list, noting where they agree and what each caught alone. Fix every finding, or list it as a deliberate exception for the user to accept. A clean pre-scan is a floor, not a verdict: on web, a generic font stack at a flat scale can pass every detector rule; on native, mechanically correct scaling can still produce weak hierarchy. State in your final summary which path ran (parallel sub-agents or single-context fallback).

---

## Assess Current Typography

### Web typography assessment

For web targets, analyze what's weak or generic about the current type:

1. **Font choices**:
   - Are we using invisible defaults? (Inter, Roboto, Arial, Open Sans, system defaults)
   - Does the font match the brand personality? (A playful brand shouldn't use a corporate typeface)
   - Are there too many font families? (More than 2-3 is almost always a mess)

2. **Hierarchy**:
   - Can you tell headings from body from captions at a glance?
   - Are font sizes too close together? (14px, 15px, 16px = muddy hierarchy)
   - Are weight contrasts strong enough? (Medium vs Regular is barely visible)

3. **Sizing & scale**:
   - Is there a consistent type scale, or are sizes arbitrary?
   - Does body text meet minimum readability? (16px+)
   - Is the sizing strategy appropriate for the context? (Fixed `rem` scales for app UIs; fluid `clamp()` for marketing/content page headings)

4. **Readability**:
   - Are line lengths comfortable? (45-75 characters ideal)
   - Is line-height appropriate for the font and context?
   - Is there enough contrast between text and background?

5. **Consistency**:
   - Are the same elements styled the same way throughout?
   - Are font weights used consistently? (Not bold in one section, semibold in another for the same role)
   - Is letter-spacing intentional or default everywhere?

**CRITICAL**: The goal isn't to make text "fancier." It's to make it clearer, more readable, and more intentional. Good typography is invisible; bad typography is distracting.

### Native typography assessment (required for iOS / Android / adaptive)

For native targets, analyze the same goals through the applicable platform conventions:

1. **Semantic roles**: every text instance maps to an iOS text style or Material 3 type role (or to a documented cross-platform token that resolves to those roles). Same-role text is consistent across screens; hierarchy comes from role, weight, color, and spacing rather than arbitrary local sizes.
2. **User scaling**: iOS text responds to every supported Dynamic Type category; Android text responds to the system font-scale setting through `sp`; cross-platform frameworks leave scaling enabled and do not cap it without a documented, tested reason.
3. **Legibility**: iOS respects the 11 pt floor with 17 pt Body as the baseline; Android follows the Material type scale. Brand/display faces stay out of dense body, label, and control text unless they remain clearly legible. Text contrast remains sufficient in light, dark, increased-contrast, and platform color variants.
4. **Layout resilience**: verify long localized copy and the largest accessibility sizes on representative phone and tablet widths. Text wraps or the container grows; it does not clip, overlap, shrink-to-fit into illegibility, or hide behind a fixed-height control. Scrollable content remains reachable.
5. **Platform fit**: iOS uses San Francisco for core UI unless a justified brand layer preserves system behavior; Android uses Roboto or a themed Material type scale. For `adaptive`, judge the rendered result on each OS and report platform-specific failures separately.

Evidence must cite the native source symbol and the role/scaling path it uses. Simulator or preview inspection at default size alone is not proof of scaling.

## Plan Typography Improvements

**Web**: consult the [Reference Material](#reference-material) section below for detailed guidance on scales, pairing, and loading strategies, then create the systematic plan below.

**iOS / Android / adaptive**: build the plan from the native assessment above and the Typography section of the applicable platform reference. Skip the web-specific plan and implementation sections below; preserve semantic roles, scaling, and layout growth rather than translating their `rem`, `clamp()`, font-loading, or `ch` prescriptions.

Create a systematic plan:

- **Font selection**: Do fonts need replacing? What fits the brand/context?
- **Type scale**: Establish a modular scale (e.g., 1.25 ratio) with clear hierarchy
- **Weight strategy**: Which weights serve which roles? (Regular for body, Semibold for labels, Bold for headings, or whatever fits)
- **Spacing**: Line-heights, letter-spacing, and margins between typographic elements

## Improve Typography Systematically

**Web only.** Native platforms use the native plan and platform reference described above.

### Font Selection

If fonts need replacing:
- Choose fonts that reflect the brand personality
- Pair with genuine contrast (serif + sans, geometric + humanist), or use a single family in multiple weights
- Ensure web font loading doesn't cause layout shift (`font-display: swap`, metric-matched fallbacks)

### Establish Hierarchy

Build a clear type scale:
- **5 sizes cover most needs**: caption, secondary, body, subheading, heading
- **Use a consistent ratio** between levels (1.25, 1.333, or 1.5)
- **Combine dimensions**: Size + weight + color + space for strong hierarchy. Don't rely on size alone
- **App UIs**: Use a fixed `rem`-based type scale, optionally adjusted at 1-2 breakpoints. Fluid sizing undermines the spatial predictability that dense, container-based layouts need
- **Marketing / content pages**: Use fluid sizing via `clamp(min, preferred, max)` for headings and display text. Keep body text fixed

### Fix Readability

- Set `max-width` on text containers using `ch` units (`max-width: 65ch`)
- Adjust line-height per context: tighter for headings (1.1-1.2), looser for body (1.5-1.7)
- Increase line-height slightly for light-on-dark text
- Ensure body text is at least 16px / 1rem

### Refine Details

- Use `tabular-nums` for data tables and numbers that should align
- Apply proper `letter-spacing`: slightly open for small caps and uppercase, default or tight for large display text
- Use semantic token names (`--text-body`, `--text-heading`), not value names (`--font-16`)
- Set `font-kerning: normal` and consider OpenType features where appropriate

### Weight Consistency

- Define clear roles for each weight and stick to them
- Don't use more than 3-4 weights (Regular, Medium, Semibold, Bold is plenty)
- Load only the weights you actually use (each weight adds to page load)

**NEVER**:
- Use more than 2-3 font families
- Pick sizes arbitrarily; commit to a scale
- Set body text below 16px
- Use decorative/display fonts for body text
- Disable browser zoom (`user-scalable=no`)
- Use `px` for font sizes; use `rem` to respect user settings
- Default to Inter/Roboto/Open Sans when personality matters
- Pair fonts that are similar but not identical (two geometric sans-serifs)

## Verify Typography Improvements

**Web**:

- **Hierarchy**: Can you identify heading vs body vs caption instantly?
- **Readability**: Is body text comfortable to read in long passages?
- **Consistency**: Are same-role elements styled identically throughout?
- **Personality**: Does the typography reflect the brand?
- **Performance**: Are web fonts loading efficiently without layout shift?
- **Accessibility**: Does text meet WCAG contrast ratios? Is it zoomable to 200%?

Answer each item above by citing the file, selector, or value that satisfies it; never a bare yes. Then re-run the web pre-scan and fix until the count of unresolved items and unaccepted findings is zero.

**iOS / Android / adaptive**:

- Re-run the applicable native source pre-scan and resolve or explicitly accept every finding.
- Exercise the largest supported accessibility text setting: iOS Dynamic Type (including accessibility categories) and/or Android maximum supported font scale. Verify representative dense, form, navigation, and long-content screens, not just a typography sample.
- Verify long localized text at compact phone width and one larger or split-window width. No clipping, overlap, illegible shrink-to-fit, or unreachable text is acceptable.
- Cite the source role/scaling path and the exercised screen/state for hierarchy, readability, consistency, personality, and accessibility. For `adaptive`, provide separate iOS and Android evidence.

Fix until the count of unresolved items and unaccepted findings is zero.

When the type carries the hierarchy on its own, hand off to `/impeccable polish` for the final pass.

## Live-mode signature params

**Web only.** Native platforms skip live mode.

Each variant MUST declare a `scale` param controlling the hierarchy ratio. Express all font sizes in the variant's scoped CSS through `calc(var(--p-scale, 1) * <base>)` or, better, scale the type ramp via `clamp(min, calc(var(--p-scale, 1) * Npx), max)`. Users slide from subdued to commanding.

```json
{"id":"scale","kind":"range","min":0.85,"max":1.3,"step":0.05,"default":1,"label":"Scale"}
```

Where the variant riffs on a specific pairing, expose the pairing choice as a `steps` param (e.g. "serif display + sans body" vs. "mono display + sans body" vs. "all-sans"). Each branch routes through `:scope[data-p-pairing="X"]` selectors in scoped CSS.

See `reference/live.md` for the full params contract.

---

## Reference Material

The sections below were previously `typography.md` and live inline now so the web typeset flow has its deep typography reference in one place. `bolder.md` also references this section. Native targets use only generally applicable typography principles from this material; whenever it specifies browser units, CSS, web fonts, zoom, or fluid viewport type, the native platform reference and the native checks above take precedence.

### Typography

#### Classic Typography Principles

##### Vertical Rhythm

Your line-height should be the base unit for ALL vertical spacing. If body text has `line-height: 1.5` on `16px` type (= 24px), spacing values should be multiples of 24px. This creates subconscious harmony; text and space share a mathematical foundation.

##### Modular Scale & Hierarchy

The common mistake: too many font sizes that are too close together (14px, 15px, 16px, 18px...). This creates muddy hierarchy.

**Use fewer sizes with more contrast.** A 5-size system covers most needs:

| Role | Typical Ratio | Use Case |
|------|---------------|----------|
| xs | 0.75rem | Captions, legal |
| sm | 0.875rem | Secondary UI, metadata |
| base | 1rem | Body text |
| lg | 1.25-1.5rem | Subheadings, lead text |
| xl+ | 2-4rem | Headlines, hero text |

Popular ratios: 1.25 (major third), 1.333 (perfect fourth), 1.5 (perfect fifth). Pick one and commit.

##### Readability & Measure

Use `ch` units for character-based measure (`max-width: 65ch`). Line-height scales inversely with line length: narrow columns need tighter leading, wide columns need more.

**Non-obvious**: Light text on dark backgrounds needs compensation on three axes, not just one. Bump line-height by 0.05–0.1, add a touch of letter-spacing (0.01–0.02em), and optionally step the body weight up one notch (regular → medium). The perceived weight drops across all three; fix all three.

**Paragraph rhythm**: Pick either space between paragraphs OR first-line indentation. Never both. Digital usually wants space; editorial/long-form can justify indent-only.

#### Font Selection & Pairing

The tactical selection procedure and the reflex-reject list live in [reference/brand.md](brand.md) under **Font selection procedure** and **Reflex-reject list** (loaded for brand-register tasks). The rest of this section covers the adjacent knowledge: anti-reflex corrections, system font use, and pairing rules.

##### Anti-reflexes worth defending against

- A technical/utilitarian brief does NOT need a serif "for warmth." Most tech tools should look like tech tools.
- An editorial/premium brief does NOT need the same expressive serif everyone is using right now. Premium can be Swiss-modern, can be neo-grotesque, can be a literal monospace, can be a quiet humanist sans.
- A children's product does NOT need a rounded display font. Kids' books use real type.
- A "modern" brief does NOT need a geometric sans. The most modern thing you can do is not use the font everyone else is using.

**System fonts are underrated**: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui` looks native, loads instantly, and is highly readable. Consider this for apps where performance > personality.

##### Pairing Principles

**The non-obvious truth**: You often don't need a second font. One well-chosen font family in multiple weights creates cleaner hierarchy than two competing typefaces. Only add a second font when you need genuine contrast (e.g., display headlines + body serif).

When pairing, contrast on multiple axes:
- Serif + Sans (structure contrast)
- Geometric + Humanist (personality contrast)
- Condensed display + Wide body (proportion contrast)

##### Web Font Loading

The layout shift problem: fonts load late, text reflows, and users see content jump. Here's the fix:

```css
/* 1. Use font-display: swap for visibility */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}

/* 2. Match fallback metrics to minimize shift */
@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;        /* Scale to match x-height */
  ascent-override: 90%;     /* Match ascender height */
  descent-override: 20%;    /* Match descender depth */
  line-gap-override: 10%;   /* Match line spacing */
}

body {
  font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}
```

Tools like [Fontaine](https://github.com/unjs/fontaine) calculate these overrides automatically.

**`swap` vs `optional`**: `swap` shows fallback text immediately and FOUT-swaps when the web font arrives. `optional` uses the fallback if the web font misses a small load budget (~100ms) and avoids the shift entirely. Pick `optional` when zero layout shift matters more than seeing the branded font on slow networks.

**Preload the critical weight only**: typically the regular-weight body font used above the fold. Preloading every weight costs more bandwidth than it saves.

**Variable fonts for 3+ weights or styles**: a single variable font file is usually smaller than three static weight files, gives fractional weight control, and pairs well with `font-optical-sizing: auto`. For 1–2 weights, static is fine.

#### Modern Web Typography

##### Fluid Type

Fluid typography via `clamp(min, preferred, max)` scales text smoothly with the viewport. The middle value (e.g., `5vw + 1rem`) controls scaling rate (higher vw = faster scaling). Add a rem offset so it doesn't collapse to 0 on small screens.

**Use fluid type for**: Headings and display text on marketing/content pages where text dominates the layout and needs to breathe across viewport sizes.

**Use fixed `rem` scales for**: App UIs, dashboards, and data-dense interfaces. No major app design system (Material, Polaris, Primer, Carbon) uses fluid type in product UI; fixed scales with optional breakpoint adjustments give the spatial predictability that container-based layouts need. Body text should also be fixed even on marketing pages, since the size difference across viewports is too small to warrant it.

**Bound your clamp()**: keep `max-size ≤ ~2.5 × min-size`. Wider ratios break the browser's zoom and reflow behaviour and make large viewports feel like the page is shouting.

**Scale container width and font-size together** so effective character measure stays in the 45–75ch band at every viewport. A heading that widens faster than its container drifts out of the comfortable measure at the top end.

##### OpenType Features

Most developers don't know these exist. Use them for polish:

```css
/* Proper fractions */
.recipe-amount { font-variant-numeric: diagonal-fractions; }

/* Small caps for abbreviations */
abbr { font-variant-caps: all-small-caps; }

/* Disable ligatures in code */
code { font-variant-ligatures: none; }

/* Enable kerning (usually on by default, but be explicit) */
body { font-kerning: normal; }
```

Check what features your font supports at [Wakamai Fondue](https://wakamaifondue.com/).

##### Rendering polish

```css
/* Variable fonts: pick the right optical-size master automatically */
body { font-optical-sizing: auto; }
```

**ALL-CAPS tracking**: capitals sit too close at default spacing. Add 5–12% letter-spacing (`letter-spacing: 0.05em` to `0.12em`) to short all-caps labels, eyebrows, and small headings. Real small caps (via `font-variant-caps`) need the same treatment, slightly gentler.

#### Typography System Architecture

Name tokens semantically (`--text-body`, `--text-heading`), not by value (`--font-size-16`). Include font stacks, size scale, weights, line-heights, and letter-spacing in your token system.

#### Accessibility Considerations

Beyond contrast ratios (which are well-documented), consider:

- **Never disable zoom**: `user-scalable=no` breaks accessibility. If your layout breaks at 200% zoom, fix the layout.
- **Use rem/em for font sizes**: This respects user browser settings. Never `px` for body text.
- **Minimum 16px body text**: Smaller than this strains eyes and fails WCAG on mobile.
- **Adequate touch targets**: Text links need padding or line-height that creates 44px+ tap targets.

---

**Avoid**: More than 2-3 font families per project. Skipping fallback font definitions. Ignoring font loading performance (FOUT/FOIT). Using decorative fonts for body text.
