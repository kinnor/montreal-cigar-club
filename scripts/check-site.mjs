#!/usr/bin/env node
/**
 * Static integrity check for web_root/ — run before every deploy:  node scripts/check-site.mjs
 * Verifies: local refs resolve (all HTML pages + CSS), IDs unique, app.js getElementById targets exist,
 * every data-i18n key exists in BOTH dictionaries (and no unused-key drift), required meta, asset sizes,
 * encoding sanity, and that the functions/ directory parses as ES modules.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', 'web_root');
const problems = [];
const pages = ['index.html', 'privacy.html', 'terms.html'].filter(p => existsSync(join(root, p)));
const html = Object.fromEntries(pages.map(p => [p, readFileSync(join(root, p), 'utf8')]));
const css = readFileSync(join(root, 'css/styles.css'), 'utf8');
const js = readFileSync(join(root, 'js/app.js'), 'utf8');
const i18nSrc = readFileSync(join(root, 'js/i18n.js'), 'utf8');

// 1. Local references resolve
for (const [page, h] of Object.entries(html)) {
  const refs = new Set();
  for (const m of h.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of (h + css).matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) refs.add(m[1]);
  for (const r of refs) {
    if (/^(https?:|#|mailto:|javascript:|data:|tel:)/.test(r) || r === '') continue;
    const clean = r.replace(/^\//, '').split(/[?#]/)[0];
    if (clean === '') continue;
    // Cloudflare Pages serves /privacy for privacy.html (clean URLs) — accept either form
    if (!existsSync(join(root, clean)) && !existsSync(join(root, clean + '.html'))) problems.push(`${page}: missing file ${r}`);
  }
}

// 2. Unique IDs & JS targets (index.html)
const ids = [...html['index.html'].matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
for (const id of new Set(ids)) if (ids.filter(x => x === id).length > 1) problems.push(`duplicate id: ${id}`);
for (const m of js.matchAll(/getElementById\('([^']+)'\)/g)) if (!ids.includes(m[1])) problems.push(`app.js targets missing id: ${m[1]}`);

// 3. i18n: every key used in HTML/JS exists in en AND fr
const ctx = { window: {} }; vm.runInNewContext(i18nSrc.split('(function ()')[0], ctx);
const dict = ctx.window.I18N;
const used = new Set();
for (const h of Object.values(html)) for (const m of h.matchAll(/data-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)) used.add(m[1]);
for (const m of js.matchAll(/L\('([^']+)'\)/g)) used.add(m[1]);
for (const m of js.matchAll(/'(form\.[a-z.]+)'/g)) used.add(m[1]);
for (const k of used) { if (!(k in dict.en)) problems.push(`i18n key missing in en: ${k}`); if (!(k in dict.fr)) problems.push(`i18n key missing in fr: ${k}`); }
for (const k of Object.keys(dict.en)) if (!(k in dict.fr)) problems.push(`fr dictionary lacks: ${k}`);
for (const k of Object.keys(dict.fr)) if (!(k in dict.en)) problems.push(`en dictionary lacks: ${k}`);

// 4. Required meta on index
for (const tag of ['og:title', 'og:image', 'twitter:card', 'name="viewport"', 'name="description"', 'rel="canonical"'])
  if (!html['index.html'].includes(tag)) problems.push(`missing meta: ${tag}`);

// 5. Oversized images
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
for (const f of walk(join(root, 'assets'))) { const kb = statSync(f).size / 1024; if (kb > 400) problems.push(`large asset (${kb.toFixed(0)} KB): ${f}`); }

// 6. Encoding sanity + no leftover alert() stubs
for (const [page, h] of Object.entries(html)) {
  if (h.includes('·<') || h.charCodeAt(0) === 0xfeff) problems.push(`${page}: BOM or interleaved middle-dot corruption`);
  if (h.includes('�')) problems.push(`${page}: contains U+FFFD replacement characters`);
  if (/onsubmit="[^"]*alert\(/.test(h)) problems.push(`${page}: alert() form stub still present`);
}

// 7. functions/ syntax
const fnDir = resolve(here, '..', 'functions');
if (existsSync(fnDir)) for (const f of walk(fnDir)) if (f.endsWith('.js')) {
  const r = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: readFileSync(f, 'utf8'), encoding: 'utf8' });
  if (r.status !== 0) problems.push(`functions syntax: ${f}: ${(r.stderr || '').split('\n').find(l => l.includes('Error')) || 'parse error'}`);
}

if (problems.length) { console.error('FAIL\n - ' + problems.join('\n - ')); process.exit(1); }
console.log(`OK — pages: ${pages.join(', ')} · ${ids.length} ids · ${used.size} i18n keys (en ${Object.keys(dict.en).length} / fr ${Object.keys(dict.fr).length})`);
