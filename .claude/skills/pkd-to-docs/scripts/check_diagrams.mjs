// Diagram QA: opens each page in the running dev server, in light and dark mode, and reports
// text that is clipped by the drawing's edge or overlaps other text. Saves one PNG per figure.
//
// Usage (from the repo root, dev server on :5173):
//   node .claude/skills/pkd-to-docs/scripts/check_diagrams.mjs "<Portal card name>" <page-id> [<page-id> …] [--out /tmp/diagram-shots]
// Exit code 1 if any issue is found.
import { chromium } from 'playwright';
import fs from 'fs';

const args = process.argv.slice(2);
const oi = args.indexOf('--out');
const out = oi >= 0 ? args.splice(oi, 2)[1] : '/tmp/diagram-shots';
const [card, ...pages] = args;
if (!card || !pages.length) { console.error('usage: check_diagrams.mjs "<card name>" <page-id>…'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

let problems = 0;
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
  await ctx.addInitScript(t => { sessionStorage.setItem('tt-docs-auth', '1'); localStorage.setItem('ux-theme', t); }, theme);
  const p = await ctx.newPage();
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.getByText(card, { exact: true }).first().click();
  await p.waitForTimeout(600);
  const doc = p.getByText('Documentation', { exact: true });
  if (await doc.count()) { await doc.first().click().catch(() => {}); await p.waitForTimeout(600); }
  for (const id of pages) {
    await p.evaluate(d => window.dispatchEvent(new CustomEvent('ux-navigate', { detail: d })), id);
    await p.waitForTimeout(700);
    const report = await p.evaluate(() => [...document.querySelectorAll('figure.doc-diagram svg')].map(svg => {
      const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')].map(t => { const b = t.getBBox(); return { s: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height }; });
      const issues = [];
      for (const t of texts) if (t.x < -1 || t.y < -1 || t.x + t.w > vb.width + 1 || t.y + t.h > vb.height + 1) issues.push('clipped: ' + t.s);
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i], b = texts[j];
        if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1) issues.push(`overlap: "${a.s}" / "${b.s}"`);
      }
      return { label: (svg.getAttribute('aria-label') || '(no label)').slice(0, 50), issues };
    }));
    for (const r of report) {
      problems += r.issues.length;
      console.log(`${theme.padEnd(5)} ${id} · ${r.label} · ${r.issues.length ? r.issues.join('; ') : 'ok'}`);
    }
    const figs = await p.$$('figure.doc-diagram');
    for (let i = 0; i < figs.length; i++) await figs[i].screenshot({ path: `${out}/${theme}-${id}-${i + 1}.png` });
  }
  if (errs.length) { problems += errs.length; console.log(theme, 'console errors:', errs.slice(0, 3).join(' | ')); }
  await ctx.close();
}
await browser.close();
console.log(problems ? `${problems} issue(s). Screenshots in ${out}` : `OK. Screenshots in ${out} — still look at them: arrows over text are not detected.`);
process.exit(problems ? 1 : 0);
