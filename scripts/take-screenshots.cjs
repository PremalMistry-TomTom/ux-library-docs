/**
 * README screenshot capture script
 * Run: node scripts/take-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '../docs/screenshots');
const W = 1440;
const H = 900;
const DPR = 2;

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function shot(page, filename) {
  const outPath = path.join(OUT_DIR, filename);
  await page.screenshot({ path: outPath, type: 'png' });
  console.log(`  ✓  ${filename}`);
}

// Navigate by clicking the sidenav group header then the item
// groupText: visible group label (e.g. 'EV & Charging'), itemText: visible item label (e.g. 'Charging Search')
// For top-level items pass only itemText with no groupText
async function navTo(page, itemText, groupText = null) {
  if (groupText) {
    // Expand the group first
    await page.evaluate((gt) => {
      const labels = document.querySelectorAll('.sidenav-label');
      for (const el of labels) {
        if (el.querySelector('.sidenav-label-text')?.textContent?.trim() === gt) {
          el.click();
          return true;
        }
      }
      return false;
    }, groupText);
    await wait(300);
  }

  // Click the item
  const clicked = await page.evaluate((it) => {
    // Try sidenav items
    const items = document.querySelectorAll('.sidenav-item, .sidenav-top-link');
    for (const el of items) {
      const label = el.querySelector('.sidenav-item-label') ?? el;
      if (label.textContent.trim() === it) { el.click(); return true; }
    }
    return false;
  }, itemText);

  if (!clicked) {
    console.warn(`  ⚠  Could not find nav item: "${itemText}"`);
  }

  await wait(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
}

async function setTheme(page, dark) {
  await page.evaluate((d) => {
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    localStorage.setItem('ux-theme', d ? 'dark' : 'light');
    // Also update React state via the toggle button if needed
  }, dark);
  await wait(300);
}

async function setLanguage(page, lang) {
  const current = await page.evaluate(() => {
    return document.querySelector('.lang-toggle')?.textContent?.trim() ?? '';
  });
  // If EN is shown, we're in Chinese; if 中文 is shown, we're in English
  const isZh = await page.evaluate(() => {
    const btn = document.querySelector('.lang-toggle');
    return btn ? btn.textContent.includes('EN') : false;
  });
  if ((lang === 'zh' && !isZh) || (lang === 'en' && isZh)) {
    await page.click('.lang-toggle');
    await wait(600);
  }
}

async function openAIPanel(page) {
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Ask about this page')
    );
    if (btn) btn.click();
  });
  await wait(800);
}

async function closeAIPanel(page) {
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.ai-panel-icon-btn[title="Close"]');
    if (closeBtn) closeBtn.click();
    document.documentElement.classList.remove('ai-panel-open');
  });
  await wait(500);
}

async function injectConversation(page, messages) {
  await page.evaluate((msgs) => {
    const container = document.querySelector('.ai-panel-messages');
    if (!container) return;
    container.innerHTML = '';
    const sparkle = `<svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    for (const msg of msgs) {
      const div = document.createElement('div');
      div.className = `ai-msg ai-msg--${msg.role}`;
      if (msg.role === 'ai') {
        div.innerHTML = `<span class="ai-msg-avatar">${sparkle}</span><span class="ai-msg-text">${msg.text}</span>`;
      } else {
        div.innerHTML = `<span class="ai-msg-text">${msg.text}</span>`;
      }
      container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
  }, messages);
  await wait(300);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await wait(1500);
    await setTheme(page, false);
    // Ensure English
    await setLanguage(page, 'en');

    // ── 01  Overview — top hero ───────────────────────────────────────────
    console.log('📸 01 Overview');
    await navTo(page, 'Overview');
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(500);
    await shot(page, '01-overview.png');

    // ── 13  Overview — Key use cases ──────────────────────────────────────
    console.log('📸 13 Overview — use cases');
    await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h2')];
      const h = headings.find(el => el.textContent.toLowerCase().includes('use case') || el.textContent.toLowerCase().includes('key'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo(0, 500);
    });
    await wait(400);
    await shot(page, '13-overview-use-cases.png');

    // ── 14  Overview — Explore by domain ──────────────────────────────────
    console.log('📸 14 Overview — domains');
    await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h2')];
      const h = headings.find(el => el.textContent.toLowerCase().includes('domain') || el.textContent.toLowerCase().includes('explore'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo(0, 1500);
    });
    await wait(400);
    await shot(page, '14-overview-domains.png');

    // ── 02  Map Style ─────────────────────────────────────────────────────
    console.log('📸 02 Map Style');
    await navTo(page, 'Map Style', 'Map Customisation');
    await wait(1500); // let TomTom map render
    await shot(page, '02-map-style.png');

    // ── 06  Dark mode — Map Style ─────────────────────────────────────────
    console.log('📸 06 Dark mode');
    await setTheme(page, true);
    await wait(1200);
    await shot(page, '06-dark-map.png');
    await setTheme(page, false);
    await wait(400);

    // ── 03  Cluster ───────────────────────────────────────────────────────
    console.log('📸 03 Cluster');
    await navTo(page, 'Displaying on Cluster', 'Vehicle Integration');
    await shot(page, '03-cluster.png');

    // ── 04  TAIA Architecture ─────────────────────────────────────────────
    console.log('📸 04 TAIA Architecture');
    await navTo(page, 'Overview', 'TomTom AI Assistant');
    await shot(page, '04-taia-arch.png');

    // ── 05  ADAS Integration ──────────────────────────────────────────────
    console.log('📸 05 ADAS');
    await navTo(page, 'ADAS Integration', 'Vehicle Integration');
    await shot(page, '05-adas.png');

    // ── 07  Home Screen Layout ────────────────────────────────────────────
    console.log('📸 07 Home Screen Layout');
    await navTo(page, 'Home Screen Layout', 'App Customisation');
    await shot(page, '07-home-screen-layout.png');

    // ── 08  Navigation Controls ───────────────────────────────────────────
    console.log('📸 08 Navigation Controls');
    await navTo(page, 'Navigation Controls', 'App Customisation');
    await shot(page, '08-nav-controls.png');

    // ── 09  Horizon Panel ─────────────────────────────────────────────────
    console.log('📸 09 Horizon Panel');
    await navTo(page, 'Horizon Panel', 'App Customisation');
    await shot(page, '09-horizon-panel.png');

    // ── 10  Instruction Panel ─────────────────────────────────────────────
    console.log('📸 10 Instruction Panel');
    await navTo(page, 'Next Instruction Panel', 'App Customisation');
    await shot(page, '10-instruction-panel.png');

    // ── 11  ETA Panel ─────────────────────────────────────────────────────
    console.log('📸 11 ETA Panel');
    await navTo(page, 'ETA Panel', 'App Customisation');
    await shot(page, '11-eta-panel.png');

    // ── 15  EV Overview ───────────────────────────────────────────────────
    console.log('📸 15 EV Overview');
    await navTo(page, 'Overview', 'EV & Charging');
    await shot(page, '15-ev-landing.png');

    // ── 17  EV Long-Distance Routing ──────────────────────────────────────
    console.log('📸 17 EV Routing');
    await navTo(page, 'Long-Distance Routing', 'EV & Charging');
    await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h2, h3')];
      const h = headings.find(el => el.textContent.includes('Berlin') || el.textContent.toLowerCase().includes('trip'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await wait(400);
    await shot(page, '17-ev-routing-trip.png');

    // ── 20  Ask AI — panel open (Colour page) ─────────────────────────────
    console.log('📸 20 Ask AI panel');
    await navTo(page, 'Colour', 'Design System');
    await wait(300);
    await openAIPanel(page);
    await shot(page, '20-ask-ai-panel.png');
    await closeAIPanel(page);

    // ── 22  Ask AI — Charging Search with EMSP conversation ───────────────
    console.log('📸 22 Ask AI — EV Charging Search');
    await navTo(page, 'Charging Search', 'EV & Charging');
    await wait(400);
    await openAIPanel(page);
    await wait(400);
    await injectConversation(page, [
      { role: 'ai',   text: 'I can see this page — "The EV Search API surfaces compatible charging stations nearby, along the route, or near the destination...". Ask me anything about it.' },
      { role: 'user', text: 'How can I surface only my preferred EMSP network partners in the charging search results?' },
      { role: 'ai',   text: 'Use the <code>preferredNetworks</code> array inside <code>EVSearchOptions</code> to pin your EMSP partners to the top of results. Combine it with <code>connectorTypes</code> and <code>minPowerKW</code> to filter by connector standard and minimum charging speed:\n\nval options = EVSearchOptions(\n  preferredNetworks = listOf("IONITY", "Fastned"),\n  connectorTypes = listOf(ConnectorType.CCS2),\n  minPowerKW = 50.0\n)\n\nStations in <code>preferredNetworks</code> rank above others even if nearby alternatives have higher availability.' },
    ]);
    await shot(page, '22-ask-ai-charging-search.png');
    await closeAIPanel(page);

    // ── 21  Chinese — Overview ────────────────────────────────────────────
    console.log('📸 21 Chinese — Overview');
    await navTo(page, 'Overview');
    await wait(300);
    await setLanguage(page, 'zh');
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(600);
    await shot(page, '21-chinese-overview.png');

    // ── 21b Chinese — Vehicle & Battery ───────────────────────────────────
    console.log('📸 21b Chinese — Vehicle & Battery');
    await navTo(page, 'Vehicle & Battery', 'EV & Charging');
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(600);
    await shot(page, '21b-chinese-ev.png');

    // Switch back to English
    await setLanguage(page, 'en');

    console.log('\n✅  All screenshots saved to docs/screenshots/\n');

  } finally {
    await browser.close();
  }
})();
