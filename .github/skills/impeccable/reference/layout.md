Space is the most underused design tool. Find the layout's actual problem (monotone spacing, weak hierarchy, identical card grids) and fix the structure, not the surface.

---

## Register

Brand: asymmetric compositions, fluid spacing with `clamp()`, intentional grid-breaking for emphasis. Rhythm through contrast: tight groupings paired with generous separations.

Product: predictable grids, consistent densities, familiar navigation patterns. Responsive behavior is structural (collapse sidebar, responsive table), not fluid typography. Consistency IS an affordance.

## Route by platform before any assessment or command (required)

Resolve the target established by Setup before spawning agents, running scans, or inspecting styling:

- **Web**: continue to [Web: Two isolated assessments](#web-two-isolated-assessments-required). The detector and supplemental CSS/Tailwind searches are mandatory on this route.
- **iOS**: read [ios.md](ios.md), then run only the iOS checks in [Native source assessment](#native-source-assessment-ios--android--adaptive).
- **Android**: read [android.md](android.md), then run only the Android checks in the native assessment.
- **Adaptive native** (a shared React Native, Expo, Flutter, or other native codebase shipping to both platforms): read both platform references, inspect the shared implementation and each platform branch, and apply both sets of checks.

Repository contents do not override the selected target. A native target stays native even when the repository also contains a website, CSS, or Tailwind configuration. On every native route, **do not** spawn the mechanical pre-scan agent, invoke `detect.mjs`, grep for CSS/Tailwind values, or enter any of the web-only sections below. Finish after the native assessment and its source verification.

## Native source assessment (`ios` / `android` / `adaptive`)

Start from the active screen and navigation entry points and follow reachable callsites; a matching API name by itself is not proof. Cite the file and symbol or declaration for every result.

**iOS source checks**

1. Trace the root and nested navigation. When the app has 2–5 top-level sections, confirm they use the platform tab container; confirm hierarchy uses a navigation stack/controller, self-contained tasks use sheets, top-level titles are large and detail titles inline, and no custom overlay disables or intercepts the left-edge back gesture.
2. Trace each screen's safe-area behavior through scroll, sheet, and keyboard states. In SwiftUI, inspect uses of `NavigationStack`, `TabView`, `safeAreaInset`, and `ignoresSafeArea`; in UIKit, inspect `UINavigationController`, `UITabBarController`, `safeAreaLayoutGuide`, `additionalSafeAreaInsets`, and `interactivePopGestureRecognizer`. In React Native/Expo or Flutter, inspect the equivalent safe-area provider/view or `SafeArea`, native stack/tab navigator, and platform-specific insets. Decorative backgrounds may extend edge-to-edge; controls and readable content may not sit under the notch, Dynamic Island, rounded corners, or home indicator.
3. Measure every reachable tap target from its frame, padding, `contentShape`, `hitSlop`, or framework minimum-size constraint. Require at least 44×44 pt and breathing room between adjacent targets; do not infer compliance from the visible icon size.

**Android source checks**

1. Trace navigation at compact and expanded widths. When the app has 3–5 top-level destinations, confirm compact layouts use a Material navigation bar and expanded layouts switch to a navigation rail or drawer; confirm screen context uses a top app bar and a FAB—when present—is the single primary action.
2. Trace edge-to-edge inset consumption for status/navigation bars, display cutouts, and the IME. In Compose, inspect `Scaffold` content padding and `WindowInsets`/inset padding modifiers; in Views, inspect `WindowCompat`/`ViewCompat` inset handling and Material containers. In React Native/Expo or Flutter, inspect the equivalent safe-area/window-inset handling and keyboard avoidance. Content may draw edge-to-edge only when interactive and readable content remains unobscured.
3. Follow system Back handling from every reachable screen and modal. Confirm the Back button and predictive Back gesture retain their navigation semantics; flag handlers that swallow Back without a state transition.
4. Measure every reachable touch target from its modifier, minimum-size constraint, padding, or `hitSlop`. Require at least 48×48 dp with at least 8 dp between adjacent targets.

**Additional adaptive source checks**

1. Find the actual size decision: iOS size classes/available width, Android window size classes, React Native `useWindowDimensions`, or Flutter `LayoutBuilder`/`MediaQuery`. Require capability- or width-based adaptation, not device-name checks.
2. Follow both compact and expanded branches. Confirm Android changes navigation bar → rail/drawer rather than merely stretching the phone layout, while iOS retains its system navigation, safe areas, and edge-swipe behavior at every supported size.
3. Follow platform branches separately. Shared layout primitives must not erase the iOS 44 pt and Android 48 dp/8 dp target rules, substitute one platform's navigation model for the other, or bypass either platform's inset and Back guarantees.

Verify the native route by answering every applicable item above with a file, symbol, and concrete value or control flow. Exercise the changed screen in the platform preview/simulator when available, but use only native project tooling; do not run the web detector or CSS/Tailwind scans as a substitute.

---

## Web: Two isolated assessments (required)

This section and every section that follows it are for the web route only.

Spawn two parallel sub-agents whenever a sub-agent/Task tool is exposed: one for the layout assessment, one for the mechanical pre-scan. If the harness needs explicit user permission for sub-agents, stop and ask before proceeding. Isolation is the point: detector output anchors visual judgment toward what the scan can see, so neither sub-agent gets the other's output. Each assessment runs in its own sub-agent; running either one in this context when a sub-agent tool exists is not permitted, even when it is faster; the fallback below is only for sessions with no sub-agent tool. Give each a self-contained prompt (target files, register, documented spacing scale when present, and its instructions below); do not assume it can read this file.

**Sub-agent A (layout assessment)**: give it the full [Assess Current Layout](#assess-current-layout) checklist below, verbatim, in its prompt. It works through every item and returns per-item findings citing file, selector, or value.

**Sub-agent B (mechanical pre-scan)**: run the bundled detector scoped to layout:

```bash
node .github/skills/impeccable/scripts/detect.mjs --json --scope layout [target files or dirs]
```

A missing `node` on PATH is not permission to skip: hunt for a runtime (`command -v node`, nvm or Homebrew paths, the harness's own bundled node) and run it by full path. If none exists, halt the scan and report that Node must be installed (the parent relays this to the user); do **not** substitute grep for the detector or proceed unscanned. The detector abstains on arbitrary Tailwind spacing (`gap-[13px]`, `p-[7px]`) and ad-hoc `z-index` stacks, so when the project documents a spacing scale, also grep `gap-\[`, `p[trblxy]?-\[`, `m[trblxy]?-\[`, `z-\[` and judge those hits against it. Return the findings JSON plus the grep verdicts.

**If no sub-agent tool is exposed (or the user declined)**: run both yourself, assessment first, pre-scan second, so the deterministic findings can't anchor the visual judgment. Keep that order even when the scan feels quicker to start with.

**Synthesize** once both are done: merge into a single findings list, noting where they agree and what each caught alone. Fix every finding, or list it as a deliberate exception for the user to accept. A clean scan is a floor, not a verdict: a monotone grid with uniform spacing passes every detector rule, which is exactly what the assessment exists to catch. State in your final summary which path ran (parallel sub-agents or single-context fallback).

---

## Assess Current Layout

This checklist is sub-agent A's brief (on the fallback path, work through it yourself before the pre-scan). Analyze what's weak about the current spatial design:

1. **Spacing**:
   - Is spacing consistent or arbitrary? (Random padding/margin values)
   - Is all spacing the same? (Equal padding everywhere = no rhythm)
   - Are related elements grouped tightly, with generous space between groups?

2. **Visual hierarchy**:
   - Apply the squint test: blur your (metaphorical) eyes. Can you still identify the most important element, second most important, and clear groupings?
   - Is hierarchy achieved effectively? (Space and weight alone can be enough; is the current approach working?)
   - Does whitespace guide the eye to what matters?

3. **Grid & structure**:
   - Is there a clear underlying structure, or does the layout feel random?
   - Are identical card grids used everywhere? (Icon + heading + text, repeated endlessly)

4. **Rhythm & variety**:
   - Does the layout have visual rhythm? (Alternating tight/generous spacing)
   - Is every section structured the same way? (Monotonous repetition)
   - Are there intentional moments of surprise or emphasis?

5. **Density**:
   - Is the layout too cramped? (Not enough breathing room)
   - Is the layout too sparse? (Excessive whitespace without purpose)
   - Does density match the content type? (Data-dense UIs need tighter spacing; marketing pages need more air)

**CRITICAL**: Layout problems are often the root cause of interfaces feeling "off" even when colors and fonts are fine. Space is a design material; use it with intention.

## Plan Layout Improvements

Create a systematic plan:

- **Spacing system**: Use a consistent scale (a framework's built-in scale like Tailwind's, rem-based tokens, or a custom system). The specific values matter less than consistency.
- **Hierarchy strategy**: How will space communicate importance?
- **Layout approach**: What structure fits the content? Flex for 1D, Grid for 2D, named areas for complex page layouts.
- **Rhythm**: Where should spacing be tight vs generous?

## Improve Layout Systematically

### Establish a Spacing System

- Use a consistent spacing scale (framework scales like Tailwind, rem-based tokens, or a custom scale all work). What matters is that values come from a defined set, not arbitrary numbers.
- Prefer a 4pt base scale (4, 8, 12, 16, 24, 32, 48, 64, 96px) over 8pt; 8pt is too coarse and you'll frequently need 12px between 8 and 16.
- Name tokens semantically if using custom properties: `--space-xs` through `--space-xl`, not `--spacing-8`
- Use `gap` for sibling spacing instead of margins; eliminates margin collapse hacks
- Apply `clamp()` for fluid spacing that breathes on larger screens

### Create Visual Rhythm

- **Tight grouping** for related elements (8-12px between siblings)
- **Generous separation** between distinct sections (48-96px)
- **Varied spacing** within sections (not every row needs the same gap)
- **Asymmetric compositions**: a deliberate choice when the content invites it (not a default to chase).

### Choose the Right Layout Tool

- **Use Flexbox for 1D layouts**: Rows of items, nav bars, button groups, card contents, most component internals.
- **Use Grid for 2D layouts**: Page-level structure, dashboards, data-dense interfaces, anything where rows AND columns need coordinated control.
- Use named grid areas (`grid-template-areas`) for complex page layouts; redefine at breakpoints.
- Use **container queries** for components, viewport queries for page layouts. A card in a narrow sidebar can stay compact while the same card in a main content area expands automatically:

```css
.card-container { container-type: inline-size; }
.card { display: grid; gap: var(--space-md); }
@container (min-width: 400px) {
  .card { grid-template-columns: 120px 1fr; }
}
```

### Break Card Grid Monotony

- Don't default to card grids for everything; spacing and alignment create visual grouping naturally
- Use cards only when content is truly distinct and actionable. Never nest cards inside cards
- Vary card sizes, span columns, or mix cards with non-card content to break repetition

### Strengthen Visual Hierarchy

- Use the fewest dimensions needed for clear hierarchy. Space alone can be enough; generous whitespace around an element draws the eye. Some of the most polished designs achieve rhythm with just space and weight. Add color or size contrast only when simpler means aren't sufficient.
- The best hierarchy combines 2–3 dimensions at once. A heading that's larger, bolder, AND has more space above it reads as primary without trying:

| Tool | Strong Hierarchy | Weak Hierarchy |
|------|------------------|----------------|
| **Size** | 3:1 ratio or more | <2:1 ratio |
| **Weight** | Bold vs Regular | Medium vs Regular |
| **Color** | High contrast | Similar tones |
| **Position** | Top/left (primary) | Bottom/right |
| **Space** | Surrounded by white space | Crowded |

- Be aware of reading flow: in LTR languages, the eye naturally scans top-left to bottom-right, but primary action placement depends on context (e.g., bottom-right in dialogs, top in navigation).
- Create clear content groupings through proximity and separation.

### Manage Depth & Elevation

- Build a consistent shadow scale (sm → md → lg → xl); shadows should be subtle
- Use elevation to reinforce hierarchy, not as decoration

### Optical Adjustments

- If an icon looks visually off-center despite being geometrically centered, nudge it. But only if you're confident it actually looks wrong. Don't adjust speculatively.
- Text at `margin-left: 0` looks slightly indented because of letterform whitespace; a negative margin (`-0.05em`) optically aligns it. Geometrically centered glyphs often look off-center (play icons need to shift right, arrows shift toward their direction).
- Touch targets must be 44×44px minimum even when the visual element is smaller. Expand the hit area with padding or a pseudo-element:

```css
.icon-button { width: 24px; height: 24px; position: relative; }
.icon-button::before {
  content: ''; position: absolute; inset: -10px;
}
```

**NEVER**:
- Use arbitrary spacing values outside your scale
- Make all spacing equal (variety creates hierarchy)
- Wrap everything in cards (not everything needs a container)
- Nest cards inside cards (use spacing and dividers for hierarchy within)
- Use identical card grids everywhere (icon + heading + text, repeated)
- Default to the hero metric layout (big number, small label, stats, gradient) as a template. If showing real user data, a prominent metric can work, but it should display actual data, not decorative numbers.

## Verify Layout Improvements

- **Squint test**: Can you identify primary, secondary, and groupings with blurred vision?
- **Rhythm**: Does the page have a satisfying beat of tight and generous spacing?
- **Hierarchy**: Is the most important content obvious within 2 seconds?
- **Breathing room**: Does the layout feel comfortable, not cramped or wasteful?
- **Consistency**: Is the spacing system applied uniformly?
- **Responsiveness**: Does the layout adapt gracefully across screen sizes?

Answer each item above by citing the file, selector, or value that satisfies it; never a bare yes. Then re-run the pre-scan and fix until the count of unresolved items and unaccepted findings is zero.

When the rhythm and hierarchy land, hand off to `/impeccable polish` for the final pass.

## Live-mode signature params

Each variant MUST declare a `density` param. Drive all spacing tokens in the variant's scoped CSS through `calc(var(--p-density, 1) * <base>)`: paddings, gaps, column widths. Users slide from airy to packed and see layout re-breathe with no regeneration.

```json
{"id":"density","kind":"range","min":0.6,"max":1.4,"step":0.05,"default":1,"label":"Density"}
```

For variants whose topology genuinely changes (stacked vs. side-by-side, grid vs. bento), use a `steps` param whose scoped CSS branches via `:scope[data-p-structure="X"]`. One structure param + one density param is a powerful combo; resist adding a third.

```json
{"id":"structure","kind":"steps","default":"grid","label":"Structure","options":[
  {"value":"stacked","label":"Stacked"},
  {"value":"grid","label":"Grid"},
  {"value":"bento","label":"Bento"}
]}
```

See `reference/live.md` for the full params contract.
