/**
 * Capture interactive-section detail shots for the collage
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const OUT_DIR  = path.join(__dirname, '../docs/screenshots');
const W = 1440, H = 900, DPR = 2;

const wait = ms => new Promise(r => setTimeout(r, ms));

async function navTo(page, itemText, groupText) {
  if (groupText) {
    await page.evaluate(gt => {
      for (const el of document.querySelectorAll('.sidenav-label')) {
        if (el.querySelector('.sidenav-label-text')?.textContent?.trim() === gt) {
          el.click(); return;
        }
      }
    }, groupText);
    await wait(300);
  }
  await page.evaluate(it => {
    for (const el of document.querySelectorAll('.sidenav-item, .sidenav-top-link')) {
      const lbl = el.querySelector('.sidenav-item-label') ?? el;
      if (lbl.textContent.trim() === it) { el.click(); return; }
    }
  }, itemText);
  await wait(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(200);
}

async function scrollToHeading(page, texts) {
  await page.evaluate((txts) => {
    const all = [...document.querySelectorAll('h2, h3')];
    for (const t of txts) {
      const h = all.find(el => el.textContent.toLowerCase().includes(t.toLowerCase()));
      if (h) { h.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
    }
    // fallback: scroll a good bit down
    window.scrollBy(0, 600);
  }, texts);
  await wait(500);
}

async function shot(page, filename) {
  await page.screenshot({ path: path.join(OUT_DIR, filename), type: 'png' });
  console.log(`  ✓  ${filename}`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await wait(1500);

  // Ensure light + English
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('ux-theme', 'light');
  });

  // ── Cluster — scroll to config/cluster visual ────────────────────────────
  console.log('📸 Cluster — interactive section');
  await navTo(page, 'Displaying on Cluster', 'Vehicle Integration');
  await scrollToHeading(page, ['Configuration', 'config', 'Interactive']);
  await shot(page, '03b-cluster-demo.png');

  // ── Home Screen Layout — scroll to IVI screen zones demo ─────────────────
  console.log('📸 Home Screen Layout — screen zones');
  await navTo(page, 'Home Screen Layout', 'App Customisation');
  await scrollToHeading(page, ['Screen zones', 'Resize', 'screen zone']);
  await shot(page, '07b-home-screen-demo.png');

  // ── Navigation Controls — scroll to demo ─────────────────────────────────
  console.log('📸 Nav Controls — interactive demo');
  await navTo(page, 'Navigation Controls', 'App Customisation');
  await scrollToHeading(page, ['Position', 'button bar', 'demo', 'interactive']);
  await shot(page, '08b-nav-controls-demo.png');

  // ── ETA Panel — scroll to position demo ──────────────────────────────────
  console.log('📸 ETA Panel — position demo');
  await navTo(page, 'ETA Panel', 'App Customisation');
  await scrollToHeading(page, ['Position', 'anchor', 'demo']);
  await shot(page, '11b-eta-demo.png');

  // ── Use cases grid (already good from overview) ───────────────────────────
  console.log('📸 Overview use cases grid');
  await navTo(page, 'Overview');
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find(el => el.textContent.toLowerCase().includes('use case'));
    if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await wait(400);
  await shot(page, '13b-use-cases-grid.png');

  // ── EV Routing — trip with charging stops ─────────────────────────────────
  console.log('📸 EV Routing — trip timeline');
  await navTo(page, 'Long-Distance Routing', 'EV & Charging');
  await scrollToHeading(page, ['Berlin', 'trip', 'route', 'stop']);
  await shot(page, '17b-ev-routing-demo.png');

  await browser.close();
  console.log('\n✅  Detail shots done\n');
})();
