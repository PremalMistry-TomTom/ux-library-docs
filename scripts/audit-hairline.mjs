#!/usr/bin/env node
/* Audits every illustration slot in the docs against the hairline library.
 *
 *   node scripts/audit-hairline.mjs
 *
 * Reads:  src/pages/*.jsx, src/components/**  (every makeThumb(Dark, Light, Icon) call,
 *         plus image thumbnails and direct Illo/Ico uses that bypass makeThumb)
 *         src/illustrations/hairline.jsx      (the Icon → figure map)
 *         public/hairline/figures/index.json, public/hairline-local/figures/index.json
 * Writes: src/data/hairline-audit.json        (read by Plumbing › Hairline library)
 *
 * Re-run after adding a figure or a mapping; the Plumbing page shows the result. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => relative(root, p);

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(f)) out.push(p);
  }
  return out;
}

/* ── The map: Ico name → slug, from hairline.jsx (planned slugs included) ── */
const hl = readFileSync(join(root, 'src/illustrations/hairline.jsx'), 'utf8');
const MAP = Object.fromEntries([...hl.matchAll(/\[(Ico\w+),\s*'([^']+)'\]/g)].map(m => [m[1], m[2]]));

/* ── The library: every figure, upstream and local ── */
const lib = [
  ...JSON.parse(readFileSync(join(root, 'public/hairline/figures/index.json'), 'utf8')).map(f => ({ ...f, source: 'upstream' })),
  ...JSON.parse(readFileSync(join(root, 'public/hairline-local/figures/index.json'), 'utf8')).map(f => ({ ...f, source: 'local' })),
];

const AVAILABLE = new Set(lib.map(f => f.slug));
const live = (slug) => (slug && AVAILABLE.has(slug) ? slug : null);

/* ── The slots ── */
const SKIP = /IntroIllustrations|UIComponentGallery|IconStyleSandbox|ScreenshotAssets|StyleSamples/;
const files = walk(join(root, 'src/pages')).concat(walk(join(root, 'src/components'))).filter(f => !SKIP.test(f));

const slots = [];      // one per makeThumb call
const bypass = [];     // illustrated cards that do not go through makeThumb

const labelNear = (lines, i) => {
  // the card's label: on the call's line, or within two lines either side
  for (const d of [0, -1, 1, -2, 2, -3, 3]) {
    const l = lines[i + d] ?? '';
    const m = l.match(/\b(?:title|label|name|part)\s*:\s*['"`]([^'"`]+)['"`]/) || l.match(/\blabelKey\s*:\s*['"]([^'"]+)['"]/) || l.match(/\bid\s*:\s*['"]([^'"]+)['"]/);
    if (m) return m[1];
  }
  return null;
};

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const page = rel(f).replace(/^src\/(pages|components)\//, '').replace(/\.jsx?$/, '');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/makeThumb\(\s*([\w$]+)\s*,\s*([\w$]+)\s*(?:,\s*([\w$]+))?\s*(?:,\s*'([^']+)')?\s*\)/g)) {
      if (m[1] === 'Dark') continue; // the factory's own definition
      const icon = m[3] || null, card = m[4] || null;
      // what renders now: the card's own figure if drawn, else its Icon's figure if drawn
      const slug = live(card) || live(icon && MAP[icon]) || null;
      // a figure asked for but not drawn yet
      const planned = (card && !live(card)) ? card : (!slug && icon && MAP[icon] && !live(MAP[icon])) ? MAP[icon] : null;
      slots.push({ page, line: i + 1, label: labelNear(lines, i), icon, light: m[2], slug, planned });
    }
    // images used as card thumbnails
    for (const m of line.matchAll(/(?:src|image|img|thumb|photo)\s*[:=]\s*\{?\s*[`'"]([^`'"]*\.(?:png|jpe?g|webp|gif))[`'"]/gi)) {
      bypass.push({ page, line: i + 1, kind: 'image', what: m[1].replace(/^.*\//, ''), label: labelNear(lines, i) });
    }
    // Illo / Ico components rendered directly, not via makeThumb
    for (const m of line.matchAll(/<((?:Illo|Ico|L_|Thumb)[A-Z]\w*)\s*\/>/g)) {
      bypass.push({ page, line: i + 1, kind: 'component', what: m[1], label: labelNear(lines, i) });
    }
  });
}

/* ── Duplicates: one figure on two or more cards of the same page ── */
const dupes = [];
const byPage = {};
for (const s of slots) if (s.slug) (byPage[s.page] ??= {}, (byPage[s.page][s.slug] ??= new Set()).add(s.label || s.icon));
for (const [page, m] of Object.entries(byPage))
  for (const [slug, labels] of Object.entries(m)) if (labels.size > 1) dupes.push({ page, slug, cards: [...labels] });

/* ── Repeats that remain once every planned figure is drawn ── */
const dupesWhenDrawn = [];
const byPage2 = {};
for (const s of slots) { const f = s.planned || s.slug; if (f) (byPage2[s.page] ??= {}, (byPage2[s.page][f] ??= new Set()).add(s.label || s.icon)); }
for (const [page, m] of Object.entries(byPage2))
  for (const [slug, labels] of Object.entries(m)) if (labels.size > 1) dupesWhenDrawn.push({ page, slug, cards: [...labels] });

/* ── Gaps, grouped by Icon ── */
const gapsByIcon = {};
for (const s of slots) if (!s.slug) {
  const key = s.icon || `(no Icon) ${s.light}`;
  const g = (gapsByIcon[key] ??= { icon: s.icon, light: s.light, uses: 0, pages: new Set(), labels: new Set() });
  g.uses++; g.pages.add(s.page); if (s.label) g.labels.add(s.label);
}
const gaps = Object.values(gapsByIcon)
  .map(g => ({ ...g, pages: [...g.pages].sort(), labels: [...g.labels].slice(0, 6) }))
  .sort((a, b) => b.uses - a.uses);

/* ── Usage per figure ── */
const usage = {};
for (const s of slots) if (s.slug) {
  const u = (usage[s.slug] ??= { uses: 0, pages: new Set(), icons: new Set() });
  u.uses++; u.pages.add(s.page); u.icons.add(s.icon);
}
const figures = lib.map(f => ({
  ...f,
  uses: usage[f.slug]?.uses ?? 0,
  pages: [...(usage[f.slug]?.pages ?? [])].sort(),
  icons: [...(usage[f.slug]?.icons ?? [])].sort(),
}));

/* ── Planned figures: asked for by a card or an Icon, not drawn yet ── */
const plannedBy = {};
for (const s of slots) if (s.planned) {
  const p = (plannedBy[s.planned] ??= { slug: s.planned, cards: 0, pages: new Set(), labels: new Set() });
  p.cards++; p.pages.add(s.page); if (s.label) p.labels.add(s.label);
}
const planned = Object.values(plannedBy).map(p => ({ ...p, pages: [...p.pages].sort(), labels: [...p.labels].slice(0, 6) }))
  .sort((a, b) => b.cards - a.cards);

const covered = slots.filter(s => s.slug).length;
const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    slots: slots.length, covered, gapSlots: slots.length - covered,
    pages: new Set(slots.map(s => s.page)).size,
    figures: lib.length, upstream: lib.filter(f => f.source === 'upstream').length, local: lib.filter(f => f.source === 'local').length,
    unusedFigures: figures.filter(f => !f.uses).length,
    gapIcons: gaps.length, duplicates: dupes.length, bypass: bypass.length,
    planned: planned.length, plannedCards: slots.filter(s => s.planned).length, duplicatesWhenDrawn: dupesWhenDrawn.length,
  },
  figures, gaps, dupes, dupesWhenDrawn, bypass, planned,
  pages: Object.entries(slots.reduce((a, s) => ((a[s.page] ??= { slots: 0, covered: 0 }), a[s.page].slots++, s.slug && a[s.page].covered++, a), {}))
    .map(([page, v]) => ({ page, ...v })).sort((a, b) => (a.covered / a.slots) - (b.covered / b.slots)),
};
writeFileSync(join(root, 'src/data/hairline-audit.json'), JSON.stringify(out, null, 2) + '\n');
const t = out.totals;
console.log(`${t.slots} illustration slots on ${t.pages} pages: ${t.covered} hairline, ${t.gapSlots} still Icon (${t.gapIcons} distinct Icons).`);
console.log(`${t.planned} planned figures waiting to be drawn, for ${t.plannedCards} cards.`);
console.log(`${t.figures} figures (${t.upstream} upstream, ${t.local} local), ${t.unusedFigures} unused. ${t.duplicates} same-page repeats. ${t.bypass} slots bypass makeThumb.`);
console.log('wrote src/data/hairline-audit.json');
