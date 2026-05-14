/**
 * README screenshot capture script
 * Usage: node scripts/take-screenshots.cjs
 */
const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '../docs/screenshots');
const VIEWPORT = { width: 1440, height: 900 };

async function wait(page, ms = 600) {
  await page.waitForTimeout(ms);
}

async function shot(page, name) {
  await wait(page, 500);
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`) });
  console.log(`  ✓  ${name}.png`);
}

// Navigate to a product via its Documentation button
// productName must match the card's heading text exactly (before badge text)
async function goToProduct(page, productName) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(page, 500);
  const found = await page.evaluate((name) => {
    const cards = Array.from(document.querySelectorAll('.dp2-product-card'));
    // Find card whose name element starts with the exact product name
    for (const card of cards) {
      const heading = card.querySelector('[class*="name"], [class*="title"], strong, h3, h4');
      const headingText = heading?.textContent?.trim() || card.childNodes[0]?.textContent?.trim() || '';
      // Also try first ~40 chars of card text (before badge/description)
      const cardStart = card.textContent.trim().slice(0, name.length + 10);
      if (cardStart.startsWith(name) || headingText === name) {
        const btn = card.querySelector('.dp2-product-doc-btn');
        if (btn) { btn.scrollIntoView({ block: 'center' }); btn.click(); return true; }
      }
    }
    return false;
  }, productName);
  if (!found) console.warn(`  ⚠ Product not found: "${productName}"`);
  await wait(page, 1000);
}

// Navigate to a sidenav item — expands collapsed groups, matches by startsWith
async function clickSidenav(page, label) {
  const found = await page.evaluate((text) => {
    // Expand collapsed groups first
    document.querySelectorAll('.sidenav-label[aria-expanded="false"]').forEach(g => g.click());
    // Match by startsWith so "Calculate RouteREF" matches "Calculate Route"
    const all = Array.from(document.querySelectorAll(
      '.sidenav-top-link, .sidenav-item-label'
    ));
    const match = all.find(el => el.textContent.trim().startsWith(text));
    if (match) { match.scrollIntoView({ block: 'nearest' }); match.click(); return true; }
    return false;
  }, label);
  if (!found) console.warn(`  ⚠ Sidenav item not found: "${label}"`);
  await wait(page, 800);
}

// Return to DocsPortal
async function goToPortal(page) {
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a, button'));
    const match = all.find(el => el.textContent.trim() === 'Products');
    if (match) match.click();
  });
  await wait(page, 1000); // wait for portal cards to render
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(page, 400);
}

// Toggle theme via .theme-toggle button in the topnav
async function toggleTheme(page) {
  await page.evaluate(() => {
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.click();
  });
  await wait(page, 600);
}

// Set theme explicitly
async function setTheme(page, mode) {
  await page.evaluate((m) => {
    localStorage.setItem('ux-theme', m);
    document.body.classList.toggle('dark', m === 'dark');
    // Also trigger the React state update via the toggle button if needed
    const current = document.querySelector('.theme-toggle')?.getAttribute('aria-label') || '';
    const isDarkNow = current.includes('light'); // "Switch to light mode" = currently dark
    const wantDark = m === 'dark';
    if (isDarkNow !== wantDark) {
      document.querySelector('.theme-toggle')?.click();
    }
  }, mode);
  await wait(page, 600);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  page.on('console', () => {});
  page.on('pageerror', () => {});

  // Bypass password gate + start in dark mode
  await context.addInitScript(() => {
    sessionStorage.setItem('tt-docs-auth', '1');
    localStorage.setItem('ux-theme', 'dark');
  });

  console.log('Opening', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await wait(page, 1500);

  // ── 1. DocsPortal — dark mode hero ───────────────────────────────────────
  console.log('\n[1] DocsPortal');
  await shot(page, 'readme-01-docsportal');
  await page.evaluate(() => window.scrollBy(0, 310));
  await shot(page, 'readme-02-docsportal-catalogue');
  await page.evaluate(() => window.scrollTo(0, 0));

  // ── 2. UX Library SDK pages ───────────────────────────────────────────────
  console.log('\n[2] UX Library');
  await goToProduct(page, 'Android UX Library');
  await shot(page, 'readme-03-ux-library-overview');

  await clickSidenav(page, 'Map Style');
  await wait(page, 2500); // map loads
  await shot(page, 'readme-04-map-style');

  await clickSidenav(page, 'Home Screen Layout');
  await wait(page, 800);
  await shot(page, 'readme-05-home-screen-layout');

  await clickSidenav(page, 'Displaying on Cluster');  // actual label
  await wait(page, 800);
  await shot(page, 'readme-06-cluster');

  // ── 3. NavSDK ─────────────────────────────────────────────────────────────
  console.log('\n[3] NavSDK');
  await goToPortal(page);
  await goToProduct(page, 'Maps & Navigation SDK');
  await shot(page, 'readme-07-navsdk-intro');

  // ── 4. Routing API ────────────────────────────────────────────────────────
  console.log('\n[4] Routing API');
  await goToPortal(page);
  await goToProduct(page, 'Routing API');
  await shot(page, 'readme-08-routing-intro');

  await clickSidenav(page, 'Calculate Route');  // matches "Calculate RouteREF"
  await wait(page, 800);
  await shot(page, 'readme-09-two-col-reference');

  await clickSidenav(page, 'Getting Started');
  await wait(page, 1200);
  await shot(page, 'readme-10-quickstart');

  await clickSidenav(page, 'API Explorer');
  await wait(page, 3500);
  await shot(page, 'readme-11-routing-explorer');

  // ── 5. Traffic API ────────────────────────────────────────────────────────
  console.log('\n[5] Traffic API');
  await goToPortal(page);
  await goToProduct(page, 'Traffic API');
  await shot(page, 'readme-12-traffic-intro');

  await wait(page, 500); // let sidenav settle
  await clickSidenav(page, 'API Explorer');
  await wait(page, 6000); // incidents auto-load + popup
  await shot(page, 'readme-13-traffic-explorer');

  // ── 6. Map Display API ────────────────────────────────────────────────────
  console.log('\n[6] Map Display API');
  await goToPortal(page);
  await goToProduct(page, 'Map Display API');
  await shot(page, 'readme-14-map-display-intro');

  await clickSidenav(page, 'API Explorer');
  await wait(page, 3000);
  await shot(page, 'readme-15-map-display-explorer');

  // ── 7. Light mode — show the contrast ────────────────────────────────────
  console.log('\n[7] Light mode');
  await toggleTheme(page); // switch to light
  await wait(page, 400);
  await goToPortal(page);
  await shot(page, 'readme-16-docsportal-light');

  await goToProduct(page, 'Routing API');
  await shot(page, 'readme-17-routing-intro-light');

  await toggleTheme(page); // restore dark

  // ── 8. Ask AI ─────────────────────────────────────────────────────────────
  console.log('\n[8] Ask AI');
  await goToPortal(page);
  await goToProduct(page, 'Routing API');
  await wait(page, 600);
  await page.evaluate(() => {
    const ai = document.querySelector('.page-action-btn--ai');
    if (ai) ai.click();
  });
  await wait(page, 1200);
  await shot(page, 'readme-18-ask-ai');

  await browser.close();
  console.log('\n✅  All screenshots saved to docs/screenshots/');
})();
