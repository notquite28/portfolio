/**
 * SvelteKit live-mode adapter.
 *
 * SvelteKit must not be patched through src/app.html. That file is a document
 * template, not framework-owned component chrome. The adapter keeps SvelteKit
 * work limited to mounting a dev-only shadow host from +layout.svelte; the
 * actual live UI remains the shared plain-DOM browser chrome.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

export const SVELTE_LIVE_ROOT_COMPONENT = 'src/lib/impeccable/ImpeccableLiveRoot.svelte';
export const SVELTE_LAYOUT_MARKER_OPEN = '<!-- impeccable-live-svelte-start -->';
export const SVELTE_LAYOUT_MARKER_CLOSE = '<!-- impeccable-live-svelte-end -->';
export const SVELTE_ROOT_IMPORT = "import ImpeccableLiveRoot from '$lib/impeccable/ImpeccableLiveRoot.svelte';";
export const SVELTE_ROOT_COMPONENT_MARKER = '<!-- impeccable-live-root-owned -->';
export const SVELTE_ROOT_IMPORT_MARKER = '// impeccable-live-svelte-import';
const SVELTE_INSTANCE_SCRIPT_MARKER_OPEN = '<!-- impeccable-live-svelte-script-start -->';
const SVELTE_INSTANCE_SCRIPT_MARKER_CLOSE = '<!-- impeccable-live-svelte-script-end -->';

export function detectSvelteKitProject(cwd = process.cwd(), config = null) {
  const appHtml = findSvelteKitAppHtml(cwd, config);
  if (!appHtml) return null;
  const hasTemplateMarkers = fileIncludes(path.join(cwd, appHtml), '%sveltekit.body%')
    && fileIncludes(path.join(cwd, appHtml), '%sveltekit.head%');
  if (!hasTemplateMarkers) return null;

  const hasSvelteConfig = fs.existsSync(path.join(cwd, 'svelte.config.js'))
    || fs.existsSync(path.join(cwd, 'svelte.config.mjs'))
    || fs.existsSync(path.join(cwd, 'svelte.config.cjs'))
    || fs.existsSync(path.join(cwd, 'svelte.config.ts'));
  const hasKitPackage = packageHasSvelteKit(cwd);
  if (!hasSvelteConfig && !hasKitPackage) return null;

  return {
    appHtml,
    layoutFile: findSvelteKitLayout(cwd),
    rootComponent: SVELTE_LIVE_ROOT_COMPONENT,
    svelteMajor: detectInstalledSvelteMajor(cwd),
  };
}

export function applySvelteKitLiveAdapter({ cwd = process.cwd(), port, config = null } = {}) {
  if (!Number.isFinite(Number(port))) {
    throw new Error('SvelteKit live adapter requires a numeric port');
  }
  const detected = detectSvelteKitProject(cwd, config);
  if (!detected) return null;

  assertSvelteLiveRootOwnership(cwd);

  const layoutRel = detected.layoutFile;
  const layoutAbs = path.join(cwd, layoutRel);
  const layoutExisted = fs.existsSync(layoutAbs);
  const before = layoutExisted
    ? fs.readFileSync(layoutAbs, 'utf-8')
    : defaultSvelteLayout(detected.svelteMajor);
  const after = patchSvelteLayout(before);

  ensureSvelteLiveRootComponent(cwd, Number(port));
  fs.mkdirSync(path.dirname(layoutAbs), { recursive: true });
  fs.writeFileSync(layoutAbs, after, 'utf-8');

  return {
    file: layoutRel,
    adapter: 'sveltekit',
    inserted: after !== before || !layoutExisted,
    appHtmlUntouched: true,
    rootComponent: SVELTE_LIVE_ROOT_COMPONENT,
    svelteMajor: detected.svelteMajor,
  };
}

export function removeSvelteKitLiveAdapter({ cwd = process.cwd(), config = null } = {}) {
  const detected = detectSvelteKitProject(cwd, config);
  if (!detected) return null;

  const layoutAbs = path.join(cwd, detected.layoutFile);
  let removed = false;
  if (fs.existsSync(layoutAbs)) {
    const before = fs.readFileSync(layoutAbs, 'utf-8');
    const after = unpatchSvelteLayout(before);
    if (after !== before) {
      fs.writeFileSync(layoutAbs, after, 'utf-8');
      removed = true;
    }
  }

  const rootAbs = path.join(cwd, SVELTE_LIVE_ROOT_COMPONENT);
  if (fs.existsSync(rootAbs) && isOwnedSvelteLiveRoot(fs.readFileSync(rootAbs, 'utf-8'))) {
    fs.rmSync(rootAbs, { force: true });
    removed = true;
  }

  pruneEmptyDir(path.dirname(rootAbs), path.join(cwd, 'src'));

  return {
    file: detected.layoutFile,
    adapter: 'sveltekit',
    removed,
    appHtmlUntouched: true,
    rootComponent: SVELTE_LIVE_ROOT_COMPONENT,
  };
}

export function patchSvelteLayout(content) {
  let out = String(content || '');
  const instanceScript = findInstanceScript(out);
  if (!instanceScript?.content.includes(SVELTE_ROOT_IMPORT)) {
    const importLines = `${SVELTE_ROOT_IMPORT_MARKER}\n  ${SVELTE_ROOT_IMPORT}`;
    if (instanceScript) {
      const insertAt = instanceScript.openEnd;
      out = out.slice(0, insertAt) + `\n  ${importLines}` + out.slice(insertAt);
    } else {
      out = `${SVELTE_INSTANCE_SCRIPT_MARKER_OPEN}\n`
        + `<script>\n  ${importLines}\n</script>\n`
        + `${SVELTE_INSTANCE_SCRIPT_MARKER_CLOSE}\n\n`
        + out;
    }
  }

  if (!out.includes(SVELTE_LAYOUT_MARKER_OPEN)) {
    const block = `${SVELTE_LAYOUT_MARKER_OPEN}\n<ImpeccableLiveRoot />\n${SVELTE_LAYOUT_MARKER_CLOSE}\n`;
    const renderMatch = out.match(/\{@render\s+children(?:\?\.)?\(\)\s*\}/);
    const slotMatch = out.match(/<slot\s*\/?>/);
    const match = renderMatch || slotMatch;
    if (match) {
      out = out.slice(0, match.index) + block + out.slice(match.index);
    } else {
      out = out.replace(/\s*$/, '\n\n' + block);
    }
  }

  return out;
}

export function unpatchSvelteLayout(content) {
  let out = String(content || '');
  const blockRe = new RegExp(
    '([ \\t]*)' + escapeRegExp(SVELTE_LAYOUT_MARKER_OPEN)
    + '\\n<ImpeccableLiveRoot\\s*/>\\n'
    + escapeRegExp(SVELTE_LAYOUT_MARKER_CLOSE)
    + '\\n?',
    'g',
  );
  out = out.replace(blockRe, '$1');
  out = removeOwnedInstanceScript(out);

  const instanceScript = findInstanceScript(out);
  if (instanceScript) {
    const cleaned = removeOwnedRootImport(instanceScript.content);
    if (cleaned !== instanceScript.content) {
      out = out.slice(0, instanceScript.contentStart) + cleaned + out.slice(instanceScript.contentEnd);
    }
  }

  return out.replace(/\n{3,}/g, '\n\n');
}

export function ensureSvelteLiveRootComponent(cwd, port) {
  assertSvelteLiveRootOwnership(cwd);
  const file = path.join(cwd, SVELTE_LIVE_ROOT_COMPONENT);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buildSvelteLiveRootComponent(port), 'utf-8');
  return file;
}

export function buildSvelteLiveRootComponent(port) {
  return `${SVELTE_ROOT_COMPONENT_MARKER}
<script>
  import { onMount } from 'svelte';

  const LIVE_URL = 'http://localhost:${Number(port)}/live.js';
  const HOST_ID = 'impeccable-live-root';

  onMount(() => {
    let host = document.querySelector('impeccable-live-root#' + HOST_ID) || document.getElementById(HOST_ID);
    if (!host) {
      host = document.createElement('impeccable-live-root');
      host.id = HOST_ID;
      document.body.appendChild(host);
    }

    host.dataset.impeccableLiveAdapter = 'sveltekit';
    host.style.setProperty('all', 'initial', 'important');
    host.style.setProperty('display', 'block', 'important');
    host.style.setProperty('position', 'fixed', 'important');
    host.style.setProperty('top', '0', 'important');
    host.style.setProperty('left', '0', 'important');
    host.style.setProperty('width', '0', 'important');
    host.style.setProperty('height', '0', 'important');
    host.style.setProperty('overflow', 'visible', 'important');
    host.style.setProperty('z-index', '2147483000', 'important');
    host.style.setProperty('pointer-events', 'none', 'important');

    const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    if (!root.querySelector('style[data-impeccable-live-reset]')) {
      const reset = document.createElement('style');
      reset.dataset.impeccableLiveReset = 'true';
      reset.textContent = ':host, :host *, * { box-sizing: border-box; }';
      root.appendChild(reset);
    }

    window.__IMPECCABLE_LIVE_ADAPTER__ = 'sveltekit';
    window.__IMPECCABLE_LIVE_UI_ROOT__ = root;
    window.__IMPECCABLE_LIVE_CHROME_MOUNT__ = {
      adapter: 'sveltekit',
      version: 1,
      host,
      root,
    };

    const script = document.createElement('script');
    script.src = LIVE_URL;
    script.async = true;
    script.dataset.impeccableLiveScript = 'true';
    document.head.appendChild(script);

    return () => {
      script.remove();
      if (window.__IMPECCABLE_LIVE_UI_ROOT__ === root) delete window.__IMPECCABLE_LIVE_UI_ROOT__;
      if (window.__IMPECCABLE_LIVE_CHROME_MOUNT__?.root === root) delete window.__IMPECCABLE_LIVE_CHROME_MOUNT__;
      if (window.__IMPECCABLE_LIVE_ADAPTER__ === 'sveltekit') delete window.__IMPECCABLE_LIVE_ADAPTER__;
    };
  });
</script>
`;
}

function findSvelteKitAppHtml(cwd, config) {
  const files = Array.isArray(config?.files) ? config.files : ['src/app.html'];
  for (const rel of files) {
    if (rel.includes('*')) continue;
    const normalized = rel.split(path.sep).join('/');
    if (!normalized.endsWith('app.html')) continue;
    const abs = path.join(cwd, normalized);
    if (fs.existsSync(abs)) return normalized;
  }
  const fallback = 'src/app.html';
  return fs.existsSync(path.join(cwd, fallback)) ? fallback : null;
}

function findSvelteKitLayout(cwd) {
  const candidates = [
    'src/routes/+layout.svelte',
    'src/routes/(app)/+layout.svelte',
  ];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(cwd, rel))) return rel;
  }
  return 'src/routes/+layout.svelte';
}

export function detectInstalledSvelteMajor(cwd = process.cwd()) {
  const candidates = [path.join(cwd, 'node_modules', 'svelte', 'package.json')];
  try {
    const requireFromProject = createRequire(path.join(cwd, 'package.json'));
    candidates.push(requireFromProject.resolve('svelte/package.json'));
  } catch {
    // The direct project installation remains the source of truth when package
    // exports or an incomplete fixture prevents require resolution.
  }

  for (const file of candidates) {
    try {
      const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const match = String(pkg.version || '').match(/^(\d+)\./);
      if (match) return Number(match[1]);
    } catch {
      // Try the next project-local resolution candidate.
    }
  }
  return null;
}

function defaultSvelteLayout(svelteMajor) {
  if (!Number.isInteger(svelteMajor)) {
    throw new Error('Unable to detect the installed Svelte major for a missing root layout');
  }
  if (svelteMajor >= 5) {
    return `<script>\n  let { children } = $props();\n</script>\n\n{@render children?.()}\n`;
  }
  return `<slot />\n`;
}

function packageHasSvelteKit(cwd) {
  const file = path.join(cwd, 'package.json');
  if (!fs.existsSync(file)) return false;
  try {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
    };
    return Boolean(deps['@sveltejs/kit'] || deps['@sveltejs/vite-plugin-svelte'] || deps.svelte);
  } catch {
    return false;
  }
}

function fileIncludes(file, text) {
  try {
    return fs.readFileSync(file, 'utf-8').includes(text);
  } catch {
    return false;
  }
}

function assertSvelteLiveRootOwnership(cwd) {
  const file = path.join(cwd, SVELTE_LIVE_ROOT_COMPONENT);
  if (!fs.existsSync(file)) return;
  if (isOwnedSvelteLiveRoot(fs.readFileSync(file, 'utf-8'))) return;

  const error = new Error(
    `Refusing to overwrite user-owned Svelte component: ${SVELTE_LIVE_ROOT_COMPONENT}`,
  );
  error.code = 'IMPECCABLE_SVELTE_ROOT_COLLISION';
  throw error;
}

function isOwnedSvelteLiveRoot(content) {
  return String(content).trimStart().startsWith(SVELTE_ROOT_COMPONENT_MARKER);
}

function findInstanceScript(content) {
  const scriptRe = /<script\b([^>]*)>/gi;
  let match;
  while ((match = scriptRe.exec(content))) {
    if (isModuleScriptAttributes(match[1])) continue;
    const closeStart = content.indexOf('</script>', scriptRe.lastIndex);
    if (closeStart < 0) continue;
    return {
      openEnd: scriptRe.lastIndex,
      contentStart: scriptRe.lastIndex,
      contentEnd: closeStart,
      content: content.slice(scriptRe.lastIndex, closeStart),
    };
  }
  return null;
}

function isModuleScriptAttributes(attributes) {
  return /\bcontext\s*=\s*(["'])module\1/i.test(attributes)
    || /(?:^|\s)module(?=\s|=|$)/i.test(attributes);
}

function removeOwnedRootImport(content) {
  const ownedImportRe = new RegExp(
    '^[ \\t]*' + escapeRegExp(SVELTE_ROOT_IMPORT_MARKER) + '[ \\t]*\\r?\\n'
      + '[ \\t]*' + escapeRegExp(SVELTE_ROOT_IMPORT) + '[ \\t]*\\r?\\n?',
    'm',
  );
  return content.replace(ownedImportRe, '');
}

function removeOwnedInstanceScript(content) {
  const ownedScriptRe = new RegExp(
    escapeRegExp(SVELTE_INSTANCE_SCRIPT_MARKER_OPEN)
      + '\\s*<script\\b([^>]*)>([\\s\\S]*?)<\\/script>\\s*'
      + escapeRegExp(SVELTE_INSTANCE_SCRIPT_MARKER_CLOSE)
      + '\\s*',
    'gi',
  );
  return content.replace(ownedScriptRe, (whole, attributes, scriptContent) => {
    if (isModuleScriptAttributes(attributes)) return whole;
    const cleaned = removeOwnedRootImport(scriptContent);
    return cleaned.trim() ? `<script${attributes}>${cleaned}</script>\n` : '';
  });
}

function pruneEmptyDir(dir, stopDir) {
  let current = dir;
  while (current.startsWith(stopDir) && current !== stopDir) {
    try {
      if (fs.readdirSync(current).length > 0) return;
      fs.rmdirSync(current);
      current = path.dirname(current);
    } catch {
      return;
    }
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
