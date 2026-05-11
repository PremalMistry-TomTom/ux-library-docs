/**
 * refreshIllo.js — Vite dev plugin
 *
 * The ↻ Regenerate button flow:
 *
 *  1. Browser POSTs to /api/refresh-illo  → plugin writes a request JSON to
 *     .illo-queue/{id}.req.json and immediately returns { queued: id }
 *
 *  2. Browser polls GET /api/refresh-status/{id} (every 2 s, up to 120 s)
 *
 *  3. The Claude agent in the open conversation watches .illo-queue/, generates
 *     the improved component, writes it to the source file, then writes
 *     .illo-queue/{id}.done.json  →  Vite HMR reloads the card automatically
 *
 *  4. Polling detects the .done file → browser shows ✓ Updated
 *
 * No API key or npm install needed — Claude Code's existing auth handles it.
 */

import fs   from 'fs';
import path from 'path';
import os   from 'os';

export const QUEUE_DIR   = '.illo-queue';
export const FILE_MAP = {
  icon:     'src/illustrations/iconVariants.jsx',
  detailed: 'src/pages/IntroIllustrations.jsx',
  lofi:     'src/illustrations/lightVariants.jsx',
};

export const STYLE_GUIDES = {
  icon: `
STYLE: Icon (pure SVG, dark-field pictogram)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Signature: export function NAME() { ... }
• Hook: const { palette } = useIlloStyle();  // already imported in file
• Return: <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width:'100%', height:'100%' }}>
• Background: always fill the full frame with <rect width="200" height="130" fill={palette.dark} />
• Primary accent shapes: palette.accent (solid or ~0.8 opacity)
• Secondary / ghost shapes: palette.mid at 0.15–0.35 opacity
• NO text elements — purely geometric / iconic
• Bold, minimal, instantly readable at 50px
• Available palette keys: bg, panel, border, navy, mid, soft, accent, danger, warn, dark, white
• No imports needed — useIlloStyle is already imported at the top of the file
`,

  detailed: `
STYLE: Detailed (dark micro-UI mockup, div-based)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Signature: export function NAME() { ... }
• Hook: const M = useDarkStyle();  // private hook defined earlier in the SAME file — do NOT import it
• Return: a <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', ... }}>
• useDarkStyle() returns: { bg, card, line, text, dim, muted, green, blue, red, amber, purple, dark, white }
• Text labels: fontSize '0.5rem' is the standard size for micro-UI text
• Simulate a real dark-mode navigation UI: API response panels, data rows, mini maps, status bars
• Use M.card for surface backgrounds, M.line for borders, M.green for positive/accent states
• No imports needed — hooks and React are already available
`,

  lofi: `
STYLE: Lo-fi / Light (SVG wireframe, blueprint aesthetic)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Signature: export function NAME() { ... }
• Hook: const { palette: C } = useIlloStyle();  // already imported in file
• Return: <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
• Background: <rect width="200" height="130" fill={C.bg}/>
• Body shapes: C.navy (solid), C.mid or C.soft (muted at 0.4–0.7 opacity)
• Highlight / accent: C.accent
• Helper components available in scope (defined earlier in this file):
    DW({ x, y, w, h, op }) — diamond-grid background pattern
    LP({ x, y, w, h, color, rx }) — line-placeholder rectangle
    NA({ cx, cy, size, color }) — navigation arrow icon
• Represent the concept as an abstract, flat diagram — use placeholder rects for text, not actual text
• No imports needed
`,
};

/* ─── Vite plugin ─────────────────────────────────────────────────────────── */

export function refreshIlloPlugin() {
  let root = '';

  return {
    name: 'refresh-illo',

    configureServer(server) {
      root = server.config.root;
      const queueDir = path.resolve(root, QUEUE_DIR);
      if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir, { recursive: true });

      server.middlewares.use(async (req, res, next) => {

        /* ── POST /api/refresh-illo ──────────────────────────────────────── */
        if (req.url === '/api/refresh-illo' && req.method === 'POST') {
          let body;
          try {
            const raw = await new Promise((resolve, reject) => {
              let d = '';
              req.on('data', c => (d += c));
              req.on('end', () => resolve(d));
              req.on('error', reject);
            });
            body = JSON.parse(raw);
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
          }

          const { componentName, style, promptDesc, label } = body;
          if (!componentName || !FILE_MAP[style]) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing componentName or unknown style' }));
            return;
          }

          const id        = `${Date.now()}-${componentName}`;
          const reqFile   = path.join(queueDir, `${id}.req.json`);
          const filePath  = path.resolve(root, FILE_MAP[style]);
          const srcFile   = fs.readFileSync(filePath, 'utf-8');
          const currentCode = extractFunction(srcFile, componentName)
                           ?? '// (not found — generate from scratch)';

          fs.writeFileSync(reqFile, JSON.stringify({
            id, componentName, style, label,
            promptDesc: promptDesc ?? '',
            styleGuide: STYLE_GUIDES[style] ?? '',
            currentCode,
            filePath,
          }, null, 2));

          console.log(`[refresh-illo] ⏳ Queued ${componentName} → ${id}.req.json`);
          console.log(`[refresh-illo] 💡 The Claude agent in your conversation will pick this up automatically.`);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ queued: id }));
          return;
        }

        /* ── GET /api/refresh-status/:id ──────────────────────────────── */
        const statusMatch = req.url?.match(/^\/api\/refresh-status\/(.+)$/);
        if (statusMatch && req.method === 'GET') {
          const id       = statusMatch[1];
          const doneFile = path.join(queueDir, `${id}.done.json`);
          const errFile  = path.join(queueDir, `${id}.err.json`);

          if (fs.existsSync(doneFile)) {
            const data = JSON.parse(fs.readFileSync(doneFile, 'utf-8'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ done: true, ...data }));
            return;
          }
          if (fs.existsSync(errFile)) {
            const data = JSON.parse(fs.readFileSync(errFile, 'utf-8'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: data.error }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ pending: true }));
          return;
        }

        next();
      });
    },
  };
}

/* ─── Source extraction helpers (used by the agent processor too) ─────────── */

export function findFunctionBounds(src, name) {
  const markers = [
    `export function ${name}(`,
    `export function ${name} (`,
    `function ${name}(`,
    `function ${name} (`,
  ];
  let start = -1;
  for (const m of markers) {
    const idx = src.indexOf(m);
    if (idx !== -1 && (start === -1 || idx < start)) start = idx;
  }
  if (start === -1) return null;

  let i = start;
  while (i < src.length && src[i] !== '{') i++;
  if (i >= src.length) return null;

  let depth = 0;
  let inSingle = false, inDouble = false, inTemplate = false;

  while (i < src.length) {
    const c = src[i];
    const esc = i > 0 && src[i - 1] === '\\';
    if (inSingle)        { if (c === "'" && !esc) inSingle = false; }
    else if (inDouble)   { if (c === '"' && !esc) inDouble = false; }
    else if (inTemplate) { if (c === '`' && !esc) inTemplate = false; }
    else {
      if      (c === "'")  inSingle = true;
      else if (c === '"')  inDouble = true;
      else if (c === '`')  inTemplate = true;
      else if (c === '{')  depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) return { start, end: i + 1 };
      }
    }
    i++;
  }
  return null;
}

export function extractFunction(src, name) {
  const b = findFunctionBounds(src, name);
  return b ? src.slice(b.start, b.end) : null;
}

export function replaceFunction(src, name, newCode) {
  const b = findFunctionBounds(src, name);
  if (!b) return null;
  const wasExported = src.slice(b.start, b.end).startsWith('export ');
  const newIsExported = newCode.trimStart().startsWith('export ');
  let code = newCode.trim();
  if (wasExported && !newIsExported)  code = 'export ' + code;
  if (!wasExported && newIsExported)  code = code.replace(/^export\s+/, '');
  return src.slice(0, b.start) + code + src.slice(b.end);
}
