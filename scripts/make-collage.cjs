/**
 * Hero collage generator for Slack sharing
 * node scripts/make-collage.cjs
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SHOTS = path.join(__dirname, '../docs/screenshots');
const OUT   = path.join(__dirname, '../docs/ux-library-hero.png');

// Canvas dimensions
const W = 3000;
const H = 1800;

const PAD   = 24;   // outer padding
const GAP   = 16;   // gap between panels
const HDR   = 90;   // header bar height
const FTR   = 56;   // footer bar height

// Usable grid area
const GW = W - PAD * 2;                    // 2952
const GH = H - PAD * 2 - HDR - FTR - GAP; // 1590

// Row heights
const R1H = Math.round(GH * 0.56);   // ~890
const R2H = GH - R1H - GAP;          // ~684

// Row 1: 2 panels — Overview (40%) + AI Panel (60%)
const R1_P1W = Math.round(GW * 0.40);
const R1_P2W = GW - R1_P1W - GAP;

// Row 2: 4 equal panels
const R2_PW = Math.round((GW - GAP * 3) / 4);

// ── Crop helpers ──────────────────────────────────────────────────────────────
// Screenshots are captured at 2x DPR so raw pixels are 2× the CSS viewport

async function crop(filename, targetW, targetH, cropOpts) {
  const img = sharp(path.join(SHOTS, filename));
  const meta = await img.metadata();

  const { left = 0, top = 0, width = meta.width, height = meta.height } = cropOpts || {};
  return img
    .extract({ left, top, width, height })
    .resize(targetW, targetH, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
}

// ── Corner-rounded panel ──────────────────────────────────────────────────────
async function roundedPanel(buf, w, h, radius = 14) {
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}">
       <rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="white"/>
     </svg>`
  );
  return sharp(buf)
    .resize(w, h, { fit: 'fill' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// ── Build header SVG ──────────────────────────────────────────────────────────
function headerSVG(w, h) {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#0D0D0D"/>
          <stop offset="100%" stop-color="#1A1A1A"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>

      <!-- TomTom wordmark in red -->
      <text x="30" y="${h * 0.62}" font-family="Arial,sans-serif" font-weight="700"
            font-size="28" fill="#E2001A" letter-spacing="1">tomtom</text>

      <!-- Title -->
      <text x="142" y="${h * 0.62}" font-family="Arial,sans-serif" font-weight="400"
            font-size="28" fill="#FFFFFF">  ·  UX Library Docs</text>

      <!-- Tagline right-aligned -->
      <text x="${w - 30}" y="${h * 0.62}" text-anchor="end"
            font-family="Arial,sans-serif" font-weight="400"
            font-size="20" fill="#888888">
        Interactive SDK documentation · AI-assisted · Localised · OEM-ready
      </text>
    </svg>
  `);
}

// ── Build footer SVG ──────────────────────────────────────────────────────────
function footerSVG(w, h) {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="#0D0D0D"/>
      <text x="${w / 2}" y="${h * 0.65}" text-anchor="middle"
            font-family="Arial,sans-serif" font-size="17" fill="#555555">
        github.com/PremalMistry-TomTom/ux-library-docs  ·  Built with React + Vite · TomTom Maps Web SDK · react-i18next
      </text>
    </svg>
  `);
}

// ── Label overlay ─────────────────────────────────────────────────────────────
function labelSVG(w, h, label) {
  const lw = label.length * 8.5 + 24;
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="${h - 44}" width="${lw}" height="26" rx="5"
            fill="#000000" fill-opacity="0.62"/>
      <text x="30" y="${h - 25}" font-family="Arial,sans-serif" font-size="14"
            font-weight="600" fill="#FFFFFF">${label}</text>
    </svg>
  `);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Building collage…');

  // Row 1, Panel 1 — Overview (crop to content, skip global nav chrome)
  const p1 = await roundedPanel(
    await crop('01-overview.png', R1_P1W, R1H, {
      left: 240, top: 80, width: 2400, height: 1700,
    }),
    R1_P1W, R1H
  );

  // Row 1, Panel 2 — Ask AI on Charging Search
  const p2 = await roundedPanel(
    await crop('22-ask-ai-charging-search.png', R1_P2W, R1H, {
      left: 0, top: 0, width: 2880, height: 1800,
    }),
    R1_P2W, R1H
  );

  // Row 2, Panel 1 — Cluster builder (interactive config section)
  const p3 = await roundedPanel(
    await crop('03b-cluster-demo.png', R2_PW, R2H, {
      left: 240, top: 60, width: 2400, height: 1700,
    }),
    R2_PW, R2H
  );

  // Row 2, Panel 2 — Home Screen Layout (IVI screen zones + resize sliders)
  const p4 = await roundedPanel(
    await crop('07b-home-screen-demo.png', R2_PW, R2H, {
      left: 240, top: 40, width: 2400, height: 1700,
    }),
    R2_PW, R2H
  );

  // Row 2, Panel 3 — EV Long-Distance Routing (Berlin → Amsterdam)
  const p5 = await roundedPanel(
    await crop('17b-ev-routing-demo.png', R2_PW, R2H, {
      left: 240, top: 40, width: 2400, height: 1700,
    }),
    R2_PW, R2H
  );

  // Row 2, Panel 4 — Chinese localisation (车辆与电池)
  const p6 = await roundedPanel(
    await crop('21b-chinese-ev.png', R2_PW, R2H, {
      left: 240, top: 40, width: 2400, height: 1700,
    }),
    R2_PW, R2H
  );

  // ── Labels ────────────────────────────────────────────────────────────────
  const l1 = labelSVG(R1_P1W, R1H, 'Overview');
  const l2 = labelSVG(R1_P2W, R1H, 'Ask AI  —  Charging Search');
  const l3 = labelSVG(R2_PW, R2H, 'Cluster Builder');
  const l4 = labelSVG(R2_PW, R2H, 'Home Screen Layout');
  const l5 = labelSVG(R2_PW, R2H, 'EV Long-Distance Routing');
  const l6 = labelSVG(R2_PW, R2H, '中文  Localisation');

  // ── Header & footer ───────────────────────────────────────────────────────
  const hdr = headerSVG(W, HDR);
  const ftr = footerSVG(W, FTR);

  // ── Positions ─────────────────────────────────────────────────────────────
  const R1Y = PAD + HDR + GAP;
  const R2Y = R1Y + R1H + GAP;
  const R2P2X = PAD + R2_PW + GAP;
  const R2P3X = PAD + (R2_PW + GAP) * 2;
  const R2P4X = PAD + (R2_PW + GAP) * 3;

  // ── Composite ─────────────────────────────────────────────────────────────
  await sharp({
    create: { width: W, height: H, channels: 4, background: '#0D0D0D' },
  })
  .composite([
    // header
    { input: await sharp(hdr).png().toBuffer(), left: 0,    top: 0 },

    // row 1
    { input: p1, left: PAD,          top: R1Y },
    { input: p2, left: PAD + R1_P1W + GAP, top: R1Y },

    // row 1 labels
    { input: await sharp(l1).png().toBuffer(), left: PAD,          top: R1Y },
    { input: await sharp(l2).png().toBuffer(), left: PAD + R1_P1W + GAP, top: R1Y },

    // row 2
    { input: p3, left: PAD,     top: R2Y },
    { input: p4, left: R2P2X,   top: R2Y },
    { input: p5, left: R2P3X,   top: R2Y },
    { input: p6, left: R2P4X,   top: R2Y },

    // row 2 labels
    { input: await sharp(l3).png().toBuffer(), left: PAD,     top: R2Y },
    { input: await sharp(l4).png().toBuffer(), left: R2P2X,   top: R2Y },
    { input: await sharp(l5).png().toBuffer(), left: R2P3X,   top: R2Y },
    { input: await sharp(l6).png().toBuffer(), left: R2P4X,   top: R2Y },

    // footer
    { input: await sharp(ftr).png().toBuffer(), left: 0, top: H - FTR },
  ])
  .png({ compressionLevel: 8 })
  .toFile(OUT);

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log(`✅  Saved → docs/ux-library-hero.png  (${kb} KB)`);
})();
