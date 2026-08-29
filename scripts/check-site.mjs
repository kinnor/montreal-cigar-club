#!/usr/bin/env node
/**
 * Static integrity check for web_root/ — run before every deploy.
 *   node scripts/check-site.mjs
 * Verifies: every local src/href/url() in index.html + styles.css resolves to a file,
 * IDs are unique, every getElementById() target in app.js exists, every data-en has a data-fr,
 * required meta tags exist, and no 1 MB+ images are shipped.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'web_root');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'css/styles.css'), 'utf8');
const js = readFileSync(join(root, 'js/app.js'), 'utf8');
const problems = [];

// 1. Local references resolve
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
for (const m of (html + css).matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) refs.add(m[1]);
for (const r of refs) {
  if (/^(https?:|#|mailto:|javascript:|data:|tel:)/.test(r) || r === '') continue;
  const p = join(root, r.replace(/^\//, '').split('?')[0]);
  if (!existsSync(p)) problems.push(`missing file: ${r}`);
}

// 2. Unique IDs & JS targets
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
for (const id of new Set(ids)) if (ids.filter(x => x === id).length > 1) problems.push(`duplicate id: ${id}`);
for (const m of js.matchAll(/getElementById\('([^']+)'\)/g)) if (!ids.includes(m[1])) problems.push(`app.js targets missing id: ${m[1]}`);

// 3. i18n pairs
const en = (html.match(/data-en=/g) || []).length, fr = (html.match(/data-fr=/g) || []).length;
if (en !== fr) problems.push(`data-en (${en}) != data-fr (${fr})`);

// 4. Required meta
for (const tag of ['og:title', 'og:image', 'twitter:card', 'name="viewport"', 'name="description"', 'rel="canonical"'])
  if (!html.includes(tag)) problems.push(`missing meta: ${tag}`);

// 5. Oversized images
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
for (const f of walk(join(root, 'assets'))) { const kb = statSync(f).size / 1024; if (kb > 400) problems.push(`large asset (${kb.toFixed(0)} KB): ${f}`); }

// 6. Encoding sanity (the UTF-16 round-trip bug)
if (html.includes('·<') || html.charCodeAt(0) === 0xfeff) problems.push('index.html has BOM or interleaved middle-dot corruption');

if (problems.length) { console.error('FAIL\n - ' + problems.join('\n - ')); process.exit(1); }
console.log(`OK — ${refs.size} refs, ${ids.length} ids, ${en} i18n pairs`);
