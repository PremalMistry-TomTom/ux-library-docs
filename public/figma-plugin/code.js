/**
 * UX Library — Illustration Scaffold Plugin
 *
 * Creates all 50 illustration placeholder components with:
 *  • Named semantic layers (every fill bound to a theme token variable)
 *  • "Theme Tokens" variable collection with 4 modes:
 *      Blueprint Light · Blueprint Dark · Day · Night
 *  • README frame with token table, layer guide, and theme-swap instructions
 *
 * HOW TO RUN:
 *  1. In Figma desktop: Plugins → Development → New Plugin
 *  2. Set the manifest plugin type to "default", click "Link existing plugin"
 *     and select this folder, OR just paste this file into a blank plugin project.
 *  3. Run the plugin — it adds everything to the current page.
 */

(async () => {

/* ═══════════════════════════════════════════════════════════════════════════
   PART 1 — THEME TOKENS (palette sourced from IlloStyleContext.jsx)
   ═══════════════════════════════════════════════════════════════════════════ */

const PALETTE = {
  blueprintLight: {
    bg:     '#F0F7FF',
    navy:   '#0B2D5C',
    mid:    '#2878CC',
    soft:   '#6EA8D8',
    panel:  '#DCE9FA',
    pill2:  '#4A7EC0',
    border: '#5C8EC8',
    grid:   '#C8DDEE',
    white:  '#FFFFFF',
    dark:   '#0B2D5C',
    accent: '#0EA5E9',
    warn:   '#3B82F6',
    danger: '#6366F1',
  },
  blueprintDark: {
    bg:     '#071420',
    navy:   '#C2DFFF',
    mid:    '#4B9EE8',
    soft:   '#2B5882',
    panel:  '#0D1E32',
    pill2:  '#3A7DC0',
    border: '#1A3A5C',
    grid:   '#091628',
    white:  '#D6EAFF',
    dark:   '#0D1E32',
    accent: '#58C4FF',
    warn:   '#6B9FD8',
    danger: '#8BB8F0',
  },
  day: {
    bg:     '#EAF4FF',
    navy:   '#1B3D6E',
    mid:    '#5B8AC5',
    soft:   '#A8C8E8',
    panel:  '#C8DCF5',
    pill2:  '#6BA3CF',
    border: '#5B8AC5',
    grid:   '#B8D5F0',
    white:  '#FFFFFF',
    dark:   '#1B3D6E',
    accent: '#22c55e',
    warn:   '#fbbf24',
    danger: '#e2001a',
  },
  night: {
    bg:     '#0D1B35',
    navy:   '#C8DEFF',
    mid:    '#7BA8D4',
    soft:   '#3D5A8A',
    panel:  '#1A2D55',
    pill2:  '#4A6A9E',
    border: '#3D6094',
    grid:   '#152240',
    white:  '#E8F0FF',
    dark:   '#1A2D55',
    accent: '#22c55e',
    warn:   '#fbbf24',
    danger: '#e2001a',
  },
};

/** Parse #rrggbb → Figma { r, g, b } (0–1 range) */
function hex(h) {
  return {
    r: parseInt(h.slice(1, 3), 16) / 255,
    g: parseInt(h.slice(3, 5), 16) / 255,
    b: parseInt(h.slice(5, 7), 16) / 255,
  };
}

/* ── Create variable collection with 4 modes ── */
const col = figma.variables.createVariableCollection('Theme Tokens');
const modeKeys   = ['blueprintLight', 'blueprintDark', 'day', 'night'];
const modeLabels = ['Blueprint Light', 'Blueprint Dark', 'Day',  'Night'];

// Rename the auto-created first mode, then add the rest
col.renameMode(col.modes[0].modeId, modeLabels[0]);
const modeIds = { [modeKeys[0]]: col.modes[0].modeId };
for (let i = 1; i < modeKeys.length; i++) {
  modeIds[modeKeys[i]] = col.addMode(modeLabels[i]);
}

// Create one COLOR variable per token key
const tokenKeys = Object.keys(PALETTE.blueprintLight);
const vars = {};
for (const key of tokenKeys) {
  const v = figma.variables.createVariable(key, col, 'COLOR');
  for (const mk of modeKeys) {
    v.setValueForMode(modeIds[mk], hex(PALETTE[mk][key] ?? PALETTE.blueprintLight[key]));
  }
  vars[key] = v;
}

/** Returns a SOLID paint bound to the named token variable */
function vp(key) {
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    vars[key],
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PART 2 — PRIMITIVE HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function R(parent, name, x, y, w, h, fillKey, rx = 0, opacity = 1) {
  const r = figma.createRectangle();
  r.name = name;
  r.x = x; r.y = y;
  r.resize(Math.max(w, 1), Math.max(h, 1));
  r.cornerRadius = rx;
  if (fillKey) r.fills = [vp(fillKey)];
  else         r.fills = [];
  if (opacity < 1) r.opacity = opacity;
  parent.appendChild(r);
  return r;
}

function E(parent, name, x, y, d, fillKey, opacity = 1) {
  const e = figma.createEllipse();
  e.name = name;
  e.x = x; e.y = y;
  e.resize(d, d);
  if (fillKey) e.fills = [vp(fillKey)];
  if (opacity < 1) e.opacity = opacity;
  parent.appendChild(e);
  return e;
}

/** Text-placeholder bar (a labelled rect that stands in for a text node) */
function TB(parent, name, x, y, w, h = 6, fillKey = 'navy', rx = 3) {
  return R(parent, name, x, y, w, h, fillKey, rx);
}

/** Frame (opaque or transparent background) */
function F(parent, name, x, y, w, h, fillKey, rx = 0, opacity = 1) {
  const f = figma.createFrame();
  f.name = name;
  f.x = x; f.y = y;
  f.resize(Math.max(w, 1), Math.max(h, 1));
  f.cornerRadius = rx;
  f.clipsContent = true;
  if (fillKey) f.fills = [vp(fillKey)];
  else         f.fills = [];
  if (opacity < 1) f.opacity = opacity;
  parent.appendChild(f);
  return f;
}

/** Create a Figma Component node (200×130, no fill) */
function C(name) {
  const c = figma.createComponent();
  c.name = name;
  c.resize(200, 130);
  c.fills = [];
  return c;
}


/* ═══════════════════════════════════════════════════════════════════════════
   PART 3 — SHARED LAYER BUILDERS
   Each function accepts a component/frame and adds semantic layers to it.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Standard map illustration base: bg + grid surface + route + info card + badge */
function buildMap(c) {
  R(c, '/bg',          0,   0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  22, 200, 108, 'grid',   6);
  R(c, '/route-line', 14,  64, 110,   3, 'mid',    2);
  E(c, '/waypoint-a', 10,  58,  10, 'accent');
  E(c, '/waypoint-b',120,  58,  10, 'navy');

  const card = F(c, '/info-card', 132, 28, 62, 68, 'panel', 8);
  TB(card, '/card-title',   6,  9, 50, 6, 'navy');
  TB(card, '/card-value',   6, 21, 38, 8, 'mid');
  TB(card, '/card-label',   6, 35, 44, 5, 'soft');
  TB(card, '/card-sub',     6, 46, 30, 5, 'soft');

  const badge = F(c, '/badge', 6, 5, 48, 14, 'navy', 7);
  TB(badge, '/badge-text', 6, 4, 36, 6, 'white');
}

/** Row-list illustration: header + 3 data rows */
function buildList(c) {
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);

  const hdr = F(c, '/header', 0, 0, 200, 28, 'panel', 0);
  TB(hdr, '/header-title', 10, 11, 80, 7, 'navy');
  R(hdr, '/header-badge', 150,  8, 44, 12, 'mid', 6);

  for (let i = 0; i < 3; i++) {
    const row = F(c, `/row-${i + 1}`, 0, 28 + i * 30, 200, 28, null);
    R(row, '/divider', 10, 0, 180, 1, 'border', 0, 0.3);
    E(row, '/dot',  10,  9, 10, i === 0 ? 'accent' : 'soft');
    TB(row, '/row-label', 26, 11, 70, 6, 'navy');
    TB(row, '/row-value', 154, 11, 38, 6, 'mid');
  }
  R(c, '/status-badge', 150, 112, 44, 14, 'navy', 7);
}

/** Bar chart illustration: panel + N labelled progress bars */
function buildBars(c, count = 3) {
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  const panel = F(c, '/panel', 8, 8, 184, 114, 'panel', 8);
  TB(panel, '/panel-title', 10, 10, 90, 7, 'navy');
  R(panel, '/live-badge',  136,  7, 40, 12, 'accent', 6);

  const fillWidths  = [55, 72, 38, 65];
  const fillTokens  = ['mid', 'accent', 'warn', 'soft'];

  for (let i = 0; i < count; i++) {
    const y = 28 + i * 21;
    TB(panel, `/bar-${i + 1}-label`, 10, y + 4, 60, 5, 'soft');
    R(panel, `/bar-${i + 1}-track`, 74, y + 2,  86, 8, 'grid', 4);
    R(panel, `/bar-${i + 1}-fill`,  74, y + 2, fillWidths[i] ?? 50, 8, fillTokens[i] ?? 'mid', 4);
    TB(panel, `/bar-${i + 1}-pct`, 164, y + 4, 18, 5, 'navy');
  }
}

/** Split-panel (toll / cost breakdown) */
function buildSplit(c) {
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/map-panel', 0, 0, 110, 130, 'grid', 0);

  const gate = F(c, '/toll-gate', 16, 38, 72, 54, 'panel', 6);
  R(gate, '/gate-bar', 0, 0, 72, 9, 'mid', 0);
  TB(gate, '/gate-label', 6, 16, 56, 6, 'navy');
  TB(gate, '/gate-sub',   6, 28, 40, 5, 'soft');
  TB(gate, '/gate-cost',  6, 40, 34, 7, 'mid');

  const cost = F(c, '/cost-panel', 114, 8, 80, 114, 'panel', 8);
  TB(cost, '/cost-title',   6, 10, 62, 6, 'navy');
  TB(cost, '/item-1-label', 6, 28, 44, 5, 'soft');
  TB(cost, '/item-1-value',54, 28, 24, 5, 'mid');
  TB(cost, '/item-2-label', 6, 46, 44, 5, 'soft');
  TB(cost, '/item-2-value',54, 46, 24, 5, 'mid');
  TB(cost, '/total-divider',6, 60, 68, 1, 'border');
  TB(cost, '/total-label',  6, 68, 44, 5, 'navy');
  TB(cost, '/total-value', 54, 68, 24, 6, 'accent');
  R(cost, '/ev-badge',     6, 84, 32, 14, 'accent', 7);
  TB(cost, '/ev-text',    10, 88, 24, 6, 'white');
}

/** Weather overlay illustration */
function buildWeather(c, withChargingStops = false) {
  R(c, '/bg',              0,   0, 200, 130, 'bg',    12);
  R(c, '/map-surface',     0,   0, 200, 130, 'grid',   0);
  R(c, '/weather-overlay', 0,   0, 200,  58, 'soft',   0, 0.28);
  R(c, '/cloud-1',        28,  12,  52,  20, 'white', 10, 0.65);
  R(c, '/cloud-2',        90,   6,  62,  22, 'white', 11, 0.55);
  R(c, '/route-line',     14,  78, 152,   3, 'mid',    2);

  // Rain lines (group frame, transparent bg)
  const rain = F(c, '/rain-group', 18, 32, 130, 34, null);
  for (let i = 0; i < 6; i++) {
    const ln = figma.createRectangle();
    ln.name = `/rain-line-${i + 1}`;
    ln.x = i * 22; ln.y = 0; ln.resize(1, 28);
    ln.fills = [vp('mid')]; ln.opacity = 0.45; ln.rotation = -10;
    rain.appendChild(ln);
  }

  if (withChargingStops) {
    E(c, '/charge-stop-1', 25, 73, 10, 'accent');
    E(c, '/charge-stop-2', 75, 73, 10, 'accent');
    E(c, '/charge-stop-3',125, 73, 10, 'accent');
  }

  R(c, '/impact-badge',  138, 100, 56, 22, 'navy', 8);
  TB(c, '/impact-value', 146, 106, 40, 7, 'warn');
  TB(c, '/impact-label', 146, 116, 34, 5, 'soft');
}


/* ═══════════════════════════════════════════════════════════════════════════
   PART 4 — ILLUSTRATION FACTORIES  (one function per illustration)
   Naming: "Section/Illustration Name" → becomes Figma component path
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Overview (15) ─────────────────────────────────────────────────── */

function mkEV() {
  const c = C('Overview/EV Charging');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  TB(c, '/section-title', 10,  9, 80, 8, 'navy');
  TB(c, '/section-sub',   10, 22, 55, 6, 'accent');
  R(c, '/pill-active',   10, 36, 42, 14, 'mid', 7);
  TB(c, '/pill-text',    16, 40, 30, 6, 'white');
  R(c, '/pill-2',        56, 36, 38, 14, 'panel', 7);
  R(c, '/pill-3',        98, 36, 44, 14, 'panel', 7);
  for (let i = 0; i < 3; i++) {
    const y = 60 + i * 23;
    E(c, `/station-dot-${i+1}`,  10, y + 2, 12, 'accent');
    TB(c, `/station-name-${i+1}`,28, y + 2, 70, 6, 'navy');
    TB(c, `/station-kw-${i+1}`,  28, y + 12, 90, 5, 'soft');
    TB(c, `/station-avail-${i+1}`,162, y + 5, 28, 6, 'accent');
  }
  return c;
}

function mkSearchResult() {
  const c = C('Overview/Search Result');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/search-bar',  0, 0, 200, 22, 'panel', 0);
  TB(c, '/search-placeholder', 26, 8, 100, 6, 'soft');
  R(c, '/online-strip', 0, 22, 200, 14, 'accent', 0, 0.18);
  TB(c, '/online-text',16, 26, 80, 6, 'accent');
  for (let i = 0; i < 3; i++) {
    const y = 44 + i * 28;
    R(c, `/result-icon-${i+1}`, 10, y, 18, 18, 'panel', 4);
    TB(c, `/result-name-${i+1}`, 34, y + 2, 80, 7, 'navy');
    TB(c, `/result-dist-${i+1}`, 34, y + 13, 40, 5, 'soft');
  }
  return c;
}

function mkNavControls() {
  const c = C('Overview/Nav Controls');
  R(c, '/bg',          0,  0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',  0);
  R(c, '/route-line', 30, 62, 140,   3, 'mid',   2);
  R(c, '/sidebar',     0,  0,  30, 130, 'dark',  0, 0.85);
  const btns = ['accent', 'panel', 'panel', 'panel'];
  btns.forEach((tok, i) => E(c, `/ctrl-btn-${i+1}`, 5, 14 + i * 26, 20, tok));
  return c;
}

function mkAIVoice() {
  const c = C('Overview/AI Voice (TAIA)');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/wave-surface', 10, 20, 180, 62, 'panel', 8);
  const heights = [14, 28, 44, 54, 40, 26, 50, 42, 20, 34, 54, 24];
  heights.forEach((h, i) => {
    R(c, `/wave-bar-${i+1}`, 18 + i * 14, 51 - h / 2, 8, h, i < 6 ? 'mid' : 'soft', 4, 0.8);
  });
  E(c, '/listening-dot', 88, 90, 24, 'accent');
  TB(c, '/ai-label', 58, 118, 84, 6, 'soft');
  return c;
}

function mkRoute() {
  const c = C('Overview/EV Route with Stops');
  buildMap(c);
  return c;
}

function mkColourSystem() {
  const c = C('Overview/Colour System');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  const swatches = ['navy', 'mid', 'soft', 'panel', 'accent', 'warn', 'danger'];
  swatches.forEach((tok, i) => {
    const col2 = i % 4, row = Math.floor(i / 4);
    R(c, `/swatch-${tok}`, 10 + col2 * 46, 10 + row * 48, 40, 42, tok, 6);
  });
  TB(c, '/system-label', 10, 102, 100, 6, 'navy');
  TB(c, '/system-sub',   10, 114,  70, 5, 'soft');
  return c;
}

function mkHorizonPanel() {
  const c = C('Overview/Horizon Panel');
  R(c, '/bg',           0,  0, 200, 130, 'bg',    12);
  R(c, '/sky',          0,  0, 200,  68, 'grid',   0);
  R(c, '/ground',       0, 68, 200,  62, 'dark',   0);
  const hdr = F(c, '/horizon-card', 10, 8, 180, 52, 'panel', 8, 0.9);
  TB(hdr, '/horizon-title', 8, 8, 60, 6, 'navy');
  const evts = ['warn', 'mid', 'soft'];
  evts.forEach((tok, i) => {
    R(hdr, `/event-${i+1}`,      8 + i * 58,  20, 52, 24, tok, 4, 0.7);
    TB(hdr, `/event-${i+1}-lbl`,14 + i * 58,  26, 38, 5, 'white');
  });
  TB(c, '/horizon-reading', 18, 82, 80, 6, 'navy');
  return c;
}

function mkCluster() {
  const c = C('Overview/Instrument Cluster');
  R(c, '/bg',            0,   0, 200, 130, 'bg',    12);
  R(c, '/cluster-frame', 5,   5, 190, 120, 'dark',  12);
  E(c, '/speed-dial',   15,  14,  70, 'panel');
  TB(c, '/speed-value',  30, 38, 40, 12, 'navy');
  TB(c, '/speed-unit',   38, 54, 24,  5, 'soft');
  R(c, '/mini-map',     92,  14, 78,  70, 'grid',   6);
  R(c, '/map-route',   100,  42, 52,   3, 'mid',    2);
  R(c, '/status-bar',   14,  94, 172,  20, 'panel',  4);
  TB(c, '/eta-label',   22, 100, 40,  5, 'soft');
  TB(c, '/eta-value',   66, 100, 32,  5, 'navy');
  TB(c, '/range-label',108, 100, 52,  5, 'accent');
  return c;
}

function mkMapStyle() {
  const c = C('Overview/Day Night Map Style');
  R(c, '/bg',          0,   0, 200, 130, 'bg',    12);
  R(c, '/day-map',     0,   0, 100, 130, 'panel',  0);
  TB(c, '/day-label', 10,  10, 40,   6, 'navy');
  R(c, '/day-route',  18,  62, 62,   3, 'mid',    2);
  R(c, '/night-map', 100,   0, 100, 130, 'dark',   0);
  TB(c, '/night-label',110, 10, 40,  6, 'white');
  R(c, '/night-route',118, 62, 62,   3, 'accent',  2);
  R(c, '/divider',    99,   0,  2, 130, 'border',  0);
  return c;
}

function mkHomeScreen() {
  const c = C('Overview/Home Screen Layout');
  R(c, '/bg',           0,  0, 200, 130, 'bg',    12);
  R(c, '/status-bar',   0,  0, 200,  16, 'panel',  0);
  TB(c, '/status-time', 10,  5, 30,   6, 'navy');
  R(c, '/search-field', 10, 22, 180,  20, 'panel', 10);
  TB(c, '/search-text', 20, 29, 80,   6, 'soft');
  const pills = ['accent', 'mid', 'soft', 'pill2'];
  pills.forEach((tok, i) => R(c, `/quick-pill-${i+1}`, 10 + i * 46, 50, 40, 18, tok, 9));
  R(c, '/map-preview',  10, 76, 180,  46, 'grid',   8);
  R(c, '/map-route',    20, 96, 100,   3, 'mid',    2);
  return c;
}

function mkETAPanel() {
  const c = C('Overview/ETA Panel');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/nip-card', 8, 8, 184, 60, 'navy', 10);
  R(c, '/turn-arrow', 18, 16, 40, 40, 'mid', 6, 0.8);
  TB(c, '/street-name', 68, 22, 100, 8, 'white');
  TB(c, '/distance',    68, 36,  60, 7, 'soft');
  R(c, '/eta-row', 8, 76, 184, 46, 'panel', 8);
  TB(c, '/eta-time',  18, 86, 50, 8, 'navy');
  TB(c, '/eta-label', 18, 100, 36, 5, 'soft');
  R(c, '/bat-track',  90, 86, 90, 8, 'grid',   4);
  R(c, '/bat-fill',   90, 86, 60, 8, 'accent', 4);
  TB(c, '/range-text', 90, 100, 40, 5, 'mid');
  return c;
}

function mkThemingTokens() {
  const c = C('Overview/Design Token Override');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  const pairs = [['navy', 'navy'], ['accent', 'accent'], ['panel', 'panel'], ['border', 'border']];
  pairs.forEach(([label, tok], i) => {
    const y = 10 + i * 28;
    TB(c, `/token-name-${i+1}`,     10, y + 5, 70, 6, 'soft');
    R(c,  `/token-before-${i+1}`,   86, y, 20, 16, tok, 4);
    R(c,  `/token-arrow-${i+1}`,   110, y + 5, 14, 6, 'mid', 3);
    R(c,  `/token-after-${i+1}`,   128, y, 20, 16, i === 1 ? 'accent' : 'mid', 4);
  });
  TB(c, '/theme-label', 10, 124, 60, 5, 'soft');
  return c;
}

function mkChargingSearch() {
  const c = C('Overview/Charging Station Search');
  buildList(c);
  return c;
}

function mkConversationPersonality() {
  const c = C('Overview/Conversation Personality');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/bubble-1-bg', 10, 10, 120, 30, 'panel', 12, 0.9);
  TB(c, '/bubble-1-text', 18, 18, 100, 6, 'navy');
  TB(c, '/bubble-1-sub',  18, 28,  70, 5, 'soft');
  R(c, '/bubble-2-bg', 68, 50, 122, 30, 'mid', 12, 0.9);
  TB(c, '/bubble-2-text', 76, 58, 100, 6, 'white');
  TB(c, '/bubble-2-sub',  76, 68,  60, 5, 'white');
  R(c, '/personality-card', 10, 90, 180, 32, 'panel', 8);
  TB(c, '/personality-label', 18, 96, 60, 6, 'accent');
  TB(c, '/personality-value', 18, 108, 80, 5, 'navy');
  return c;
}

function mkADASLayers(c) {
  R(c, '/bg',           0,   0, 200, 130, 'bg',    12);
  R(c, '/road-surface', 0,   0, 200, 130, 'dark',   0);
  for (let i = 0; i < 3; i++) R(c, `/lane-line-${i+1}`, 58 + i * 40, 0, 2, 130, 'soft', 1, 0.28);
  R(c, '/active-lane',  60,  0,  38, 130, 'accent', 0, 0.14);
  R(c, '/vehicle',      72, 80,  22,  34, 'mid',    4);
  R(c, '/guidance-arr', 75, 20,  12,  28, 'accent', 4, 0.8);
  TB(c, '/lane-label',  62,  6,  32,   6, 'white');
}

function mkADAS() {
  const c = C('Overview/ADAS Lane Guidance');
  mkADASLayers(c);
  return c;
}


/* ── Maps & Navigation SDK (7) ─────────────────────────────────────── */

function mkMapDisplay() {
  const c = C('NavSDK/Map Display');
  buildMap(c);
  return c;
}

function mkSDKSearch() {
  const c = C('NavSDK/Search');
  buildList(c);
  return c;
}

function mkRouteOptions() {
  const c = C('NavSDK/Route Options');
  R(c, '/bg',          0,   0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,   0, 200, 130, 'grid',  0);
  // 3 route alternatives
  R(c, '/route-fastest', 10, 46, 140, 3, 'accent', 2);
  R(c, '/route-eco',     10, 56, 140, 2, 'mid',    1, 0.7);
  R(c, '/route-short',   10, 64, 140, 2, 'soft',   1, 0.5);
  R(c, '/options-panel',  0, 90, 200, 40, 'panel', 0);
  const tabs = ['mid', 'dark', 'dark'];
  tabs.forEach((tok, i) => {
    R(c, `/tab-${i+1}`,        8 + i * 62, 95, 58, 28, tok, 8);
    TB(c, `/tab-label-${i+1}`, 14 + i * 62, 106, 46, 6, i === 0 ? 'white' : 'soft');
  });
  return c;
}

function mkNavGuidance() {
  const c = C('NavSDK/Navigation NIP');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/nip-bg',    8, 8, 184, 72, 'navy', 10);
  R(c, '/turn-arrow',16, 16, 50, 56, 'mid', 8);
  TB(c, '/street-name', 74, 24, 104, 9, 'white');
  TB(c, '/dist-label',  74, 40,  64, 7, 'soft');
  TB(c, '/lane-hints',  74, 54,  80, 7, 'soft');
  R(c, '/eta-strip', 8, 88, 184, 34, 'panel', 8);
  TB(c, '/eta-time', 18, 96, 50, 7, 'navy');
  TB(c, '/arrival',  18, 108, 70, 6, 'soft');
  return c;
}

function mkOfflineMaps() {
  const c = C('NavSDK/Offline Maps');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/region-card', 8, 8, 184, 52, 'panel', 10);
  TB(c, '/region-title', 16, 16, 80, 7, 'navy');
  TB(c, '/region-sub',   16, 28, 60, 5, 'soft');
  R(c, '/dl-track', 16, 40, 152, 8, 'grid', 4);
  R(c, '/dl-fill',  16, 40,  92, 8, 'mid',  4);
  for (let i = 0; i < 3; i++) {
    const y = 70 + i * 20;
    TB(c, `/dl-name-${i+1}`,   16, y,     80, 6, 'navy');
    TB(c, `/dl-size-${i+1}`,  130, y,     40, 6, 'soft');
    R(c,  `/dl-status-${i+1}`,178, y - 2, 12, 12, i === 0 ? 'accent' : 'mid', 6);
  }
  return c;
}

function mkCarPlay() {
  const c = C('NavSDK/CarPlay');
  R(c, '/bg',             0,  0, 200, 130, 'bg',    12);
  R(c, '/screen-frame',   8,  8, 184, 114, 'dark',  10);
  R(c, '/screen-status',  8,  8, 184,  18, 'panel',  0);
  TB(c, '/status-time',  16, 13, 30,   6, 'soft');
  R(c, '/map-area',       8, 26, 120,  96, 'grid',   0);
  R(c, '/cp-route',      18, 60,  90,   3, 'mid',    2);
  R(c, '/cp-sidebar',   128, 26,  64,  96, 'dark',   0);
  for (let i = 0; i < 4; i++) {
    E(c, `/cp-icon-${i+1}`, 130 + (i % 2) * 30, 34 + Math.floor(i/2) * 30, 22, i === 0 ? 'mid' : 'panel');
  }
  return c;
}

function mkVirtualHorizon() {
  const c = C('NavSDK/Virtual Horizon');
  buildWeather(c, false);
  return c;
}


/* ── Routing API (12) ──────────────────────────────────────────────── */

function mkCalculateRoute() {
  const c = C('Routing API/Calculate Route');
  buildMap(c);
  return c;
}

function mkReachableRange() {
  const c = C('Routing API/Reachable Range');
  R(c, '/bg',          0,  0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',  0);
  // Isochrone (ellipse)
  const iso = figma.createEllipse();
  iso.name = '/isochrone-fill'; iso.x = 48; iso.y = 18; iso.resize(104, 84);
  iso.fills = [vp('mid')]; iso.opacity = 0.22;
  c.appendChild(iso);
  const isoBorder = figma.createEllipse();
  isoBorder.name = '/isochrone-border'; isoBorder.x = 48; isoBorder.y = 18; isoBorder.resize(104, 84);
  isoBorder.fills = []; isoBorder.strokes = [vp('mid')]; isoBorder.strokeWeight = 2;
  c.appendChild(isoBorder);
  E(c, '/origin-point', 95, 56, 10, 'navy');
  R(c, '/range-card', 132, 10, 62, 52, 'panel', 8);
  TB(c, '/range-title',140, 18, 46, 5, 'navy');
  TB(c, '/range-value',140, 28, 36, 8, 'mid');
  TB(c, '/range-unit', 140, 42, 40, 5, 'soft');
  return c;
}

function mkEVRouting() {
  const c = C('Routing API/EV Route');
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/route-line', 14, 65, 162,   3, 'mid',    2);
  [28, 72, 118].forEach((x, i) => E(c, `/charge-stop-${i+1}`, x, 60, 10, 'accent'));
  R(c, '/battery-card', 132,  8, 62, 48, 'panel', 8);
  TB(c, '/soc-label',   140, 14, 46,  5, 'soft');
  R(c, '/soc-track',    140, 24, 46,  8, 'grid',  4);
  R(c, '/soc-fill',     140, 24, 32,  8, 'accent',4);
  TB(c, '/soc-pct',     140, 36, 28,  5, 'accent');
  return c;
}

function mkBatchRouting() {
  const c = C('Routing API/Batch Routing');
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/route-1',    10, 46, 112,  2, 'mid',    1, 0.9);
  R(c, '/route-2',    10, 54, 112,  2, 'soft',   1, 0.65);
  R(c, '/route-3',    10, 62, 112,  2, 'accent', 1, 0.55);
  const panel = F(c, '/batch-panel', 128, 8, 66, 114, 'panel', 8);
  TB(panel, '/batch-title', 6, 12, 52, 6, 'navy');
  for (let i = 0; i < 3; i++) {
    TB(panel, `/route-label-${i+1}`,  6, 28 + i * 28, 42, 5, 'soft');
    TB(panel, `/route-time-${i+1}`,   6, 38 + i * 28, 32, 6, 'mid');
  }
  return c;
}

function mkMatrixRouting() {
  const c = C('Routing API/Matrix Routing');
  R(c, '/bg',          0,  0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,  0, 128, 130, 'grid',  0);
  for (let i = 0; i < 3; i++) {
    E(c, `/origin-${i+1}`,  14, 28 + i * 32, 8, 'mid');
    E(c, `/dest-${i+1}`,   106, 28 + i * 32, 8, 'navy');
    R(c, `/mx-line-${i+1}`, 23, 32 + i * 32, 82, 1, 'soft', 0, 0.45);
  }
  const tbl = F(c, '/matrix-table', 136, 8, 58, 114, 'panel', 6);
  TB(tbl, '/tbl-title', 5, 10, 46, 5, 'navy');
  for (let r = 0; r < 3; r++) {
    for (let col = 0; col < 3; col++) {
      R(tbl, `/cell-${r}-${col}`, 5 + col * 17, 24 + r * 28, 14, 20, r === col ? 'accent' : 'grid', 2, r === col ? 0.5 : 0.3);
    }
  }
  return c;
}

function mkWaypointOpt() {
  const c = C('Routing API/Waypoint Optimization');
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/route-opt',  14, 66, 152,  3, 'accent',  2);
  R(c, '/route-pre',  14, 56, 152,  2, 'soft',    1, 0.35);
  [18, 54, 94, 134, 162].forEach((x, i) => E(c, `/wp-${i+1}`, x, 61, 9, i === 0 || i === 4 ? 'navy' : 'mid'));
  R(c, '/opt-panel', 132,  8, 62, 48, 'panel', 8);
  TB(c, '/opt-title',  140, 14, 46,  5, 'navy');
  TB(c, '/savings-lbl',140, 24, 34,  5, 'soft');
  TB(c, '/savings-val',140, 34, 28,  6, 'accent');
  return c;
}

function mkTurnInstructions() {
  const c = C('Routing API/Turn Instructions');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  for (let i = 0; i < 4; i++) {
    const y = 8 + i * 28;
    R(c, `/instr-icon-${i+1}`,  8, y + 3, 20, 20, 'panel', 4);
    TB(c, `/instr-txt-${i+1}`, 34, y + 6, 98,  7, 'navy');
    TB(c, `/instr-d-${i+1}`,   34, y + 17, 60,  5, 'soft');
    if (i < 3) R(c, `/instr-div-${i+1}`, 34, y + 26, 160, 1, 'border', 0, 0.28);
  }
  R(c, '/map-mini',  142, 8, 52, 114, 'grid', 6);
  R(c, '/mn-route',  150, 40, 34,  60, 'mid',  2, 0.55);
  return c;
}

function mkRoadShields() {
  const c = C('Routing API/Road Shields');
  R(c, '/bg',          0,  0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',  0);
  R(c, '/route-line', 18, 65, 164,   3, 'mid',   2);
  const shColors = ['navy', 'danger', 'mid', 'accent'];
  [28, 68, 108, 148].forEach((x, i) => {
    R(c, `/shield-${i+1}`,      x, 44, 26, 16, shColors[i], 3);
    TB(c, `/shield-text-${i+1}`,x + 4, 48, 18, 6, 'white');
  });
  R(c, '/legend-card', 8, 90, 184, 34, 'panel', 8);
  TB(c, '/legend-title', 16, 96,  50, 5, 'navy');
  TB(c, '/legend-items', 16, 107, 160, 5, 'soft');
  return c;
}

function mkLaneGuidance() {
  const c = C('Routing API/Lane Guidance');
  mkADASLayers(c);  // reuse same lane diagram
  return c;
}

function mkRoutingComputeToll() {
  const c = C('Routing API/Compute Toll Amounts');
  buildSplit(c);
  return c;
}

function mkRoutingWeather() {
  const c = C('Routing API/Weather Consideration');
  buildWeather(c, false);
  return c;
}

function mkRoutingDataFreshness() {
  const c = C('Routing API/Dynamic Data Freshness');
  buildBars(c, 3);
  return c;
}


/* ── Long-Distance EV Routing — LDEVR (8) ─────────────────────────── */

function mkLDEVRRoute() {
  const c = C('LDEVR/Calculate EV Route');
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/ev-route',    8, 65, 162,   3, 'accent',  2);
  [22, 60, 100, 148].forEach((x, i) => E(c, `/ev-stop-${i+1}`, x, 60, 10, i === 0 || i === 3 ? 'navy' : 'accent'));
  const panel = F(c, '/ldevr-panel', 130, 8, 64, 92, 'panel', 8);
  TB(panel, '/route-title',  8, 12, 50, 6, 'navy');
  TB(panel, '/total-range',  8, 26, 44, 7, 'accent');
  TB(panel, '/stops-label',  8, 40, 50, 5, 'soft');
  R(panel,  '/soc-track',    8, 52, 48, 7, 'grid',  4);
  R(panel,  '/soc-fill',     8, 52, 36, 7, 'accent',4);
  return c;
}

function mkLDEVRBatch() {
  const c = C('LDEVR/Batch EV Route');
  buildList(c);
  return c;
}

function mkVehicleBrand() {
  const c = C('LDEVR/Vehicle Brand Lookup');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/search-header', 0, 0, 200, 26, 'panel', 0);
  TB(c, '/search-label', 10, 10, 60, 6, 'navy');
  const dots = ['mid', 'accent', 'soft', 'mid', 'soft'];
  for (let i = 0; i < 5; i++) {
    const y = 32 + i * 18;
    if (i === 1) R(c, '/selected-row', 0, y - 2, 200, 20, 'mid', 0, 0.12);
    E(c, `/brand-dot-${i+1}`,  10, y + 2, 12, dots[i]);
    TB(c, `/brand-name-${i+1}`, 28, y + 4, 70, 6, 'navy');
    TB(c, `/variant-id-${i+1}`,132, y + 4, 56, 6, 'soft');
  }
  return c;
}

function mkOemEmsp() {
  const c = C('LDEVR/OEM EMSP Support');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/header', 0, 0, 200, 24, 'panel', 0);
  TB(c, '/header-title', 10, 9, 70, 6, 'navy');
  for (let i = 0; i < 4; i++) {
    const y = 30 + i * 24;
    R(c, `/emsp-row-bg-${i+1}`, 0, y, 200, 22, 'panel', 0, i % 2 === 0 ? 0.45 : 0.25);
    TB(c, `/emsp-name-${i+1}`,  10, y + 8, 62, 6, 'navy');
    R(c, `/oem-badge-${i+1}`,  118, y + 5, 36, 12, 'mid', 6);
    TB(c, `/oem-text-${i+1}`,  122, y + 8, 28, 6, 'white');
    R(c, `/emsp-tick-${i+1}`,  162, y + 6, 30, 10, 'accent', 5);
  }
  return c;
}

function mkLDEVRComputeToll() {
  const c = C('LDEVR/Compute Toll Amounts');
  buildSplit(c);
  return c;
}

function mkChargingParks() {
  const c = C('LDEVR/Charging Parks Hours');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/park-card', 6, 6, 188, 50, 'panel', 8);
  TB(c, '/park-name',   14, 12, 80, 7, 'navy');
  TB(c, '/park-avail',  14, 24, 60, 6, 'accent');
  R(c, '/avail-bg',    150, 12, 38, 28, 'mid', 8, 0.45);
  TB(c, '/avail-num',  155, 16, 28, 16, 'navy');
  const barWidths = [120, 82, 60];
  for (let i = 0; i < 3; i++) {
    const y = 64 + i * 22;
    TB(c, `/day-label-${i+1}`,  14, y, 40, 6, 'soft');
    R(c, `/hours-track-${i+1}`, 60, y - 2, 124, 12, 'grid', 4);
    R(c, `/hours-fill-${i+1}`,  60, y - 2, barWidths[i], 12, 'mid', 4, 0.7);
  }
  return c;
}

function mkLDEVRWeather() {
  const c = C('LDEVR/Weather Consideration');
  buildWeather(c, true);
  return c;
}

function mkLDEVRDataFreshness() {
  const c = C('LDEVR/Dynamic Data Freshness');
  buildBars(c, 4);
  return c;
}


/* ── ANA — Autonomous Navigation App (8) ──────────────────────────── */

function mkANADriverExp() {
  const c = C('ANA/Driver Experience');
  R(c, '/bg',            0,  0, 200, 130, 'bg',    12);
  R(c, '/screen-frame',  5,  5, 190, 120, 'dark',  10);
  R(c, '/map-area',      5,  5, 140, 120, 'grid',   0);
  R(c, '/route',        18, 66, 110,   3, 'mid',    2);
  R(c, '/hud-nip',      10, 10, 126,  42, 'navy',   8, 0.85);
  R(c, '/turn-ind',     16, 16,  32,  28, 'mid',    6);
  TB(c, '/street-lbl',  54, 20,  76,  6, 'white');
  TB(c, '/dist-lbl',    54, 32,  50,  5, 'soft');
  R(c, '/side-panel',  149,  5,  46, 120, 'panel',  0);
  TB(c, '/eta-val',    155, 14,  34,  8, 'navy');
  TB(c, '/eta-unit',   155, 27,  24,  5, 'soft');
  R(c, '/soc-track',   155, 40,  34,  7, 'grid',   4);
  R(c, '/soc-fill',    155, 40,  24,  7, 'accent', 4);
  return c;
}

function mkANATraffic() {
  const c = C('ANA/Live Traffic Rerouting');
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/route-orig', 10, 50, 120,   4, 'danger', 2, 0.68);
  R(c, '/route-new',  10, 70, 100,   3, 'accent', 2);
  R(c, '/incident',   28, 18,  92,  26, 'danger', 8, 0.82);
  TB(c, '/incident-lbl', 36, 24, 72, 6, 'white');
  TB(c, '/incident-sub', 36, 34, 52, 5, 'white');
  R(c, '/reroute-toast', 60, 96, 120, 28, 'panel', 8);
  TB(c, '/reroute-txt',  70, 103,  90, 6, 'navy');
  TB(c, '/time-saved',   70, 115,  60, 5, 'accent');
  return c;
}

function mkANAMap() {
  const c = C('ANA/Premium Map Display');
  R(c, '/bg',          0,  0, 200, 130, 'bg',   12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',  0);
  R(c, '/building-1', 38, 18, 30,  42, 'soft',  4, 0.55);
  R(c, '/building-2', 78,  8, 26,  52, 'mid',   4, 0.45);
  R(c, '/building-3',115, 28, 22,  32, 'soft',  4, 0.38);
  R(c, '/route-line', 10, 80, 162,  3, 'accent', 2);
  R(c, '/style-toggle',150, 8, 44, 22, 'panel', 11);
  TB(c, '/style-label',156, 13, 30,  5, 'soft');
  TB(c, '/style-mode', 156, 21, 24,  5, 'navy');
  return c;
}

function mkANAEVSearch() {
  const c = C('ANA/EV Charging Search');
  buildList(c);
  return c;
}

function mkANALDRoute() {
  const c = C('ANA/Long-Distance EV Route');
  // Same layer structure as LDEVR/Calculate EV Route
  R(c, '/bg',          0,  0, 200, 130, 'bg',    12);
  R(c, '/map-surface', 0,  0, 200, 130, 'grid',   0);
  R(c, '/ev-route',    8, 65, 162,   3, 'accent',  2);
  [22, 60, 100, 148].forEach((x, i) => E(c, `/ev-stop-${i+1}`, x, 60, 10, i === 0 || i === 3 ? 'navy' : 'accent'));
  const panel = F(c, '/ldevr-panel', 130, 8, 64, 92, 'panel', 8);
  TB(panel, '/route-title', 8, 12, 50, 6, 'navy');
  TB(panel, '/total-range', 8, 26, 44, 7, 'accent');
  TB(panel, '/stops-label', 8, 40, 50, 5, 'soft');
  R(panel,  '/soc-track',   8, 52, 48,  7, 'grid',  4);
  R(panel,  '/soc-fill',    8, 52, 36,  7, 'accent',4);
  return c;
}

function mkVIL() {
  const c = C('ANA/Vehicle Integration Layer');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/vehicle-block',  10, 30, 58, 70, 'panel', 8);
  TB(c, '/vehicle-label', 18, 40, 42, 6, 'navy');
  TB(c, '/vehicle-sub',   18, 52, 36, 5, 'soft');
  R(c, '/arrow-right',    72, 58, 30, 10, 'mid',  5);
  R(c, '/arrow-left',     72, 74, 30, 10, 'soft', 5, 0.55);
  R(c, '/ana-block',     106, 20, 84, 92, 'navy', 8);
  TB(c, '/ana-label',    114, 30, 62, 7, 'white');
  TB(c, '/channel-1',    114, 48, 62, 5, 'soft');
  TB(c, '/channel-2',    114, 60, 50, 5, 'soft');
  TB(c, '/channel-3',    114, 72, 62, 5, 'soft');
  R(c, '/vil-badge',      10,  8, 42, 16, 'accent', 8);
  TB(c, '/vil-text',      16, 12, 30,  6, 'white');
  return c;
}

function mkCIL() {
  const c = C('ANA/Control Integration Layer');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/app-block',     10, 10, 68, 52, 'panel', 8);
  TB(c, '/app-label',    18, 20, 52, 6, 'navy');
  TB(c, '/app-api',      18, 32, 40, 5, 'soft');
  R(c, '/ctrl-arrow',    82, 30, 28, 10, 'danger', 5);
  TB(c, '/ctrl-lbl',     82, 44, 28,  5, 'soft');
  R(c, '/vehicle-block',114, 10, 72, 52, 'dark',  8);
  TB(c, '/vehicle-lbl', 122, 20, 56,  6, 'white');
  TB(c, '/vehicle-cmd', 122, 32, 44,  5, 'soft');
  R(c, '/cil-badge',     10, 74, 40, 16, 'danger', 8, 0.8);
  TB(c, '/cil-text',     16, 78, 28,  6, 'white');
  TB(c, '/desc-1',       10, 100, 180, 5, 'soft');
  TB(c, '/desc-2',       10, 112, 140, 5, 'soft');
  return c;
}

function mkANATheming() {
  const c = C('ANA/OEM Theme Tokens');
  R(c, '/bg', 0, 0, 200, 130, 'bg', 12);
  R(c, '/oem-a', 8, 8, 88, 114, 'panel', 8);
  TB(c, '/oem-a-label', 16, 16, 60, 6, 'navy');
  ['navy', 'mid', 'accent'].forEach((tok, i) => {
    R(c, `/oem-a-swatch-${i+1}`, 16, 30 + i * 28, 40, 22, tok, 4);
    TB(c, `/oem-a-token-${i+1}`, 62, 36 + i * 28, 26, 5, 'soft');
  });
  R(c, '/arrow-swap', 98, 55, 6, 20, 'mid', 3);
  R(c, '/oem-b', 106, 8, 86, 114, 'dark', 8);
  TB(c, '/oem-b-label', 114, 16, 60, 6, 'white');
  ['soft', 'accent', 'warn'].forEach((tok, i) => {
    R(c, `/oem-b-swatch-${i+1}`, 114, 30 + i * 28, 40, 22, tok, 4);
    TB(c, `/oem-b-token-${i+1}`, 158, 36 + i * 28, 26, 5, 'soft');
  });
  return c;
}


/* ═══════════════════════════════════════════════════════════════════════════
   PART 5 — LAYOUT: place all components on the canvas in labelled sections
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  {
    title: 'Overview (15)',
    color: '#E2E8F0',
    items: [
      mkEV, mkSearchResult, mkNavControls, mkAIVoice, mkRoute,
      mkColourSystem, mkHorizonPanel, mkCluster, mkMapStyle, mkHomeScreen,
      mkETAPanel, mkThemingTokens, mkChargingSearch, mkConversationPersonality, mkADAS,
    ],
  },
  {
    title: 'Maps & Navigation SDK (7)',
    color: '#BAE6FD',
    items: [mkMapDisplay, mkSDKSearch, mkRouteOptions, mkNavGuidance, mkOfflineMaps, mkCarPlay, mkVirtualHorizon],
  },
  {
    title: 'Routing API (12)',
    color: '#BBF7D0',
    items: [
      mkCalculateRoute, mkReachableRange, mkEVRouting, mkBatchRouting,
      mkMatrixRouting, mkWaypointOpt, mkTurnInstructions, mkRoadShields,
      mkLaneGuidance, mkRoutingComputeToll, mkRoutingWeather, mkRoutingDataFreshness,
    ],
  },
  {
    title: 'Long-Distance EV Routing — LDEVR (8)',
    color: '#A7F3D0',
    items: [mkLDEVRRoute, mkLDEVRBatch, mkVehicleBrand, mkOemEmsp, mkLDEVRComputeToll, mkChargingParks, mkLDEVRWeather, mkLDEVRDataFreshness],
  },
  {
    title: 'ANA — Autonomous Navigation App (8)',
    color: '#E9D5FF',
    items: [mkANADriverExp, mkANATraffic, mkANAMap, mkANAEVSearch, mkANALDRoute, mkVIL, mkCIL, mkANATheming],
  },
];

const COLS = 5;
const CW = 200, CH = 130, GAP = 24, SECTION_GAP = 60;
let currentY = 80;  // leave room for a title label at top

// Load font once (section labels)
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

figma.currentPage.name = '📐 Components';

// Top title
{
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: 'Bold' };
  t.fontSize = 22;
  t.characters = 'UX Library — Illustration Assets';
  t.fills = [{ type: 'SOLID', color: hex('#0B2D5C') }];
  t.x = 0; t.y = 16;
  figma.currentPage.appendChild(t);
}

for (const section of SECTIONS) {
  // Section label frame (coloured strip)
  const labelH = 36;
  const totalCols = Math.min(section.items.length, COLS);
  const totalW = totalCols * (CW + GAP) - GAP;
  const labelFrame = figma.createFrame();
  labelFrame.name = `[Section] ${section.title}`;
  labelFrame.x = 0; labelFrame.y = currentY;
  labelFrame.resize(Math.max(totalW, 400), labelH);
  labelFrame.fills = [{ type: 'SOLID', color: hex(section.color) }];
  labelFrame.cornerRadius = 8;
  figma.currentPage.appendChild(labelFrame);

  const lbl = figma.createText();
  lbl.fontName = { family: 'Inter', style: 'Bold' };
  lbl.fontSize = 14;
  lbl.characters = section.title;
  lbl.fills = [{ type: 'SOLID', color: hex('#0B2D5C') }];
  lbl.x = 12; lbl.y = 10;
  labelFrame.appendChild(lbl);

  currentY += labelH + 12;

  // Place components in grid
  section.items.forEach((factory, idx) => {
    const component = factory();
    component.x = (idx % COLS) * (CW + GAP);
    component.y = currentY + Math.floor(idx / COLS) * (CH + GAP);
    figma.currentPage.appendChild(component);
  });

  const rows = Math.ceil(section.items.length / COLS);
  currentY += rows * (CH + GAP) + SECTION_GAP;
}


/* ═══════════════════════════════════════════════════════════════════════════
   PART 6 — README PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const readmePage = figma.createPage();
readmePage.name = '📖 README';

const RM_W = 900, RM_H = 1800;
const rm = figma.createFrame();
rm.name = 'README';
rm.x = 0; rm.y = 0;
rm.resize(RM_W, RM_H);
rm.fills = [{ type: 'SOLID', color: hex('#071420') }];
rm.cornerRadius = 20;
readmePage.appendChild(rm);

async function txt(parent, str, x, y, size, style, fillHex) {
  const t = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style });
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.characters = str;
  t.fills = [{ type: 'SOLID', color: hex(fillHex) }];
  t.x = x; t.y = y;
  parent.appendChild(t);
  return t;
}

await txt(rm, 'UX Library — Illustration Assets', 40, 40, 28, 'Bold', '#C2DFFF');
await txt(rm, 'Figma component scaffold · 50 illustrations · 5 product sections · 4 theme modes', 40, 80, 14, 'Regular', '#4B9EE8');

// ── Component size ──
await txt(rm, '📐  Component Size', 40, 130, 18, 'Bold', '#C2DFFF');
await txt(rm, 'Every component is 200 × 130 px.', 40, 158, 13, 'Regular', '#6B9FD8');
await txt(rm, 'This matches the SVG viewBox="0 0 200 130" used in the React app.\nDo not resize the artboard — scale the content inside instead.', 40, 176, 13, 'Regular', '#6B9FD8');

// ── Variable collection ──
await txt(rm, '🎨  Theme Tokens — Variable Collection', 40, 240, 18, 'Bold', '#C2DFFF');
await txt(rm, 'Every fill in every component is bound to a variable from the "Theme Tokens" collection.\nSwitch the Mode selection in the Variables panel to change all component colours at once.', 40, 268, 13, 'Regular', '#6B9FD8');
await txt(rm, 'How to switch themes:', 40, 310, 13, 'Bold', '#58C4FF');
await txt(rm, '1.  Select all components  (⌘ A)\n2.  Right-click → Edit Variable Mode → Theme Tokens\n3.  Choose: Blueprint Light  |  Blueprint Dark  |  Day  |  Night', 40, 330, 13, 'Regular', '#6B9FD8');

// ── Token table header ──
await txt(rm, '🗂️  Token Reference', 40, 410, 18, 'Bold', '#C2DFFF');

const TABLE_COLS = ['Token', 'Blueprint Light', 'Blueprint Dark', 'Day', 'Night'];
const TABLE_X    = [40,       150,               320,              490,   610];
const TABLE_W    = [100,      160,               160,              110,   110];

// header row
for (let c2 = 0; c2 < TABLE_COLS.length; c2++) {
  await txt(rm, TABLE_COLS[c2], TABLE_X[c2], 444, 12, 'Bold', '#C2DFFF');
}
// divider
const hdiv = figma.createRectangle();
hdiv.x = 40; hdiv.y = 460; hdiv.resize(700, 1);
hdiv.fills = [{ type: 'SOLID', color: hex('#1A3A5C') }];
rm.appendChild(hdiv);

const tableRows = tokenKeys.map(k => [
  k,
  PALETTE.blueprintLight[k],
  PALETTE.blueprintDark[k],
  PALETTE.day[k],
  PALETTE.night[k],
]);

for (let r = 0; r < tableRows.length; r++) {
  const y = 470 + r * 26;
  const row = tableRows[r];
  await txt(rm, row[0], TABLE_X[0], y, 12, 'Bold', '#58C4FF');
  for (let c3 = 1; c3 < row.length; c3++) {
    const colorVal = row[c3];
    // colour swatch
    const sw = figma.createRectangle();
    sw.x = TABLE_X[c3] - 18; sw.y = y + 1; sw.resize(12, 12);
    sw.fills = [{ type: 'SOLID', color: hex(colorVal) }]; sw.cornerRadius = 3;
    rm.appendChild(sw);
    await txt(rm, colorVal, TABLE_X[c3], y, 12, 'Regular', '#6B9FD8');
  }
}

// ── Layer naming guide ──
const LG_Y = 470 + tableRows.length * 26 + 40;
await txt(rm, '🏷️  Layer Naming Convention', 40, LG_Y, 18, 'Bold', '#C2DFFF');
await txt(rm, 'All layers follow the /prefix-description pattern.\nReplace placeholder bars (/xxx-label, /xxx-text) with real typography in handoff.', 40, LG_Y + 28, 13, 'Regular', '#6B9FD8');

const LAYER_GUIDE = [
  ['/bg',               'bg',     'Full-bleed background — binds to bg token'],
  ['/map-surface',      'grid',   'Map / scene backdrop — binds to grid token'],
  ['/route-line',       'mid',    'Primary route path — binds to mid token'],
  ['/route-opt',        'accent', 'Optimised / EV route — binds to accent'],
  ['/route-orig',       'danger', 'Congested / original route — binds to danger'],
  ['/info-card',        'panel',  'Summary data card frame — binds to panel'],
  ['/badge',            'navy',   'Version or status badge — binds to navy'],
  ['/live-badge',       'accent', 'Live / real-time indicator — binds to accent'],
  ['/ev-badge',         'accent', 'EV-specific badge — binds to accent'],
  ['/bar-N-fill',       'mid',    'Progress bar fill — token varies per bar'],
  ['/bar-N-track',      'grid',   'Progress bar background track — grid token'],
  ['/weather-overlay',  'soft',   'Semi-transparent weather mask — soft token'],
  ['/impact-value',     'warn',   'Weather/range impact value — warn token'],
  ['/incident',         'danger', 'Traffic incident overlay — danger token'],
  ['/xxx-label/text',   'soft',   'Secondary text placeholder — soft token'],
  ['/xxx-value',        'mid',    'Data value placeholder — mid token'],
  ['/xxx-title',        'navy',   'Section/card title bar — navy token'],
];

for (let i = 0; i < LAYER_GUIDE.length; i++) {
  const y = LG_Y + 70 + i * 24;
  const [layer, token, desc] = LAYER_GUIDE[i];
  await txt(rm, layer,  40,  y, 12, 'Bold',    '#58C4FF');
  await txt(rm, token, 200,  y, 12, 'Regular', '#4B9EE8');
  await txt(rm, desc,  270,  y, 12, 'Regular', '#6B9FD8');
}

// ── Handoff notes ──
const HN_Y = LG_Y + 70 + LAYER_GUIDE.length * 24 + 40;
await txt(rm, '🛠️  Handoff Notes', 40, HN_Y, 18, 'Bold', '#C2DFFF');

const NOTES = [
  '• Placeholder bars (named /xxx-label, /xxx-title, /xxx-text) → replace with Auto Layout text nodes using the same token colour.',
  '• Shape layers (circles, rects named /route-line, /cloud-1) → replace with final vector paths; keep the same layer name so variable bindings survive.',
  '• Keep all layer names intact — engineers use them to map tokens back to SVG elements in the React codebase.',
  '• Do NOT rename the "Theme Tokens" variable collection; the plugin and codebase both reference it by this exact name.',
  '• Each component ships at 200×130 px — scale artwork inside the frame, never scale the frame itself.',
  '• Export: select all components → File → Export → SVG per component.',
];

for (let i = 0; i < NOTES.length; i++) {
  await txt(rm, NOTES[i], 40, HN_Y + 34 + i * 28, 13, 'Regular', '#6B9FD8');
}

// ── Sections summary ──
const SS_Y = HN_Y + 34 + NOTES.length * 28 + 40;
await txt(rm, '📦  Sections', 40, SS_Y, 18, 'Bold', '#C2DFFF');
const SUMMARY = [
  ['Overview',                            '15',  'UX Library capability cards (EV, Search, NavControls, ADAS …)'],
  ['Maps & Navigation SDK',               ' 7',  'NavSDK endpoint thumbnails (MapDisplay, Search, Routing, CarPlay …)'],
  ['Routing API',                         '12',  'Routing endpoint thumbs (CalculateRoute → DataFreshness)'],
  ['Long-Distance EV Routing (LDEVR)',    ' 8',  'LDEVR endpoint thumbs (EVRoute, VehicleBrand, ChargingParks …)'],
  ['ANA — Autonomous Navigation App',    ' 8',  'ANA hero illustrations (DriverExp, Traffic, VIL, CIL, Theming …)'],
];
for (let i = 0; i < SUMMARY.length; i++) {
  const y = SS_Y + 34 + i * 26;
  await txt(rm, SUMMARY[i][0], 40,  y, 13, 'Bold',    '#58C4FF');
  await txt(rm, SUMMARY[i][1], 290, y, 13, 'Bold',    '#C2DFFF');
  await txt(rm, SUMMARY[i][2], 320, y, 13, 'Regular', '#6B9FD8');
}

await txt(rm, `Total: 50 components  ·  Variable collection: "Theme Tokens"  ·  4 modes  ·  ${tokenKeys.length} tokens each`,
  40, SS_Y + 34 + SUMMARY.length * 26 + 24, 13, 'Regular', '#4B9EE8');

await txt(rm, `Generated by: UX Library Illustration Scaffold Plugin\nSource: ux-library/src/illustrations/lightVariants.jsx + IlloStyleContext.jsx`,
  40, SS_Y + 34 + SUMMARY.length * 26 + 60, 12, 'Regular', '#1A3A5C');


/* ═══════════════════════════════════════════════════════════════════════════
   DONE — scroll canvas to fit all components
   ═══════════════════════════════════════════════════════════════════════════ */

figma.currentPage = figma.root.children.find(p => p.name === '📐 Components') ?? figma.currentPage;
figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);

const total = SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
figma.notify(
  `✅  Done! Created ${total} components across ${SECTIONS.length} sections. ` +
  `Variable collection "Theme Tokens" has ${modeKeys.length} modes × ${tokenKeys.length} tokens. ` +
  `See the "📖 README" page for usage instructions.`,
  { timeout: 8000 },
);

})();
