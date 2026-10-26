/* ─────────────────────────────────────────────────────────────────────────────
 * Diagram kit — theme-aware inline SVG for docs pages.
 *
 *   <Figure title caption status>  wrapper with caption and an optional status tag
 *   <SequenceDiagram lanes steps>  who calls whom, in order (flows, handshakes)
 *   <LayerDiagram layers>          what sits on what, and who owns it (architecture)
 *   <StepsDiagram steps>           a path or progression (adoption steps, lifecycle)
 *
 * Colours come only from CSS tokens, so diagrams follow light/dark mode.
 * Tones: 'tomtom' (our component), 'partner' (the integrator owns it),
 *        'person' (a human), 'external' (third party), 'tbd' (not defined yet).
 * ───────────────────────────────────────────────────────────────────────────── */

const FONT = 'var(--font-sans)';
const TONES = {
  tomtom:   { fill: 'var(--s0)', stroke: 'var(--brand)', text: 'var(--black)', dash: null },
  partner:  { fill: 'var(--s1)', stroke: 'var(--b-hi)', text: 'var(--black)', dash: null },
  person:   { fill: 'none', stroke: 'none', text: 'var(--black)', dash: null },
  external: { fill: 'var(--s1)', stroke: 'var(--b-med)', text: 'var(--mid)', dash: null },
  tbd:      { fill: 'none', stroke: 'var(--b-hi)', text: 'var(--muted)', dash: '4 4' },
};
const tone = t => TONES[t] || TONES.partner;

/* Greedy word wrap by character budget (SVG has no text wrapping). */
function wrap(text = '', max = 24) {
  const out = []; let line = '';
  for (const w of String(text).split(/\s+/)) {
    if (!w) continue;
    if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

function Lines({ x, y, lines, size = 12, weight = 400, fill = 'var(--mid)', anchor = 'middle', lh = 1.3 }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={fill}>
      {lines.map((l, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : size * lh}>{l}</tspan>)}
    </text>
  );
}

function Markers({ id }) {
  const head = (key, fill) => (
    <marker key={key} id={`${id}-${key}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill={fill} />
    </marker>
  );
  return <defs>{head('call', 'var(--black)')}{head('return', 'var(--mid)')}{head('tbd', 'var(--b-hi)')}{head('brand', 'var(--brand)')}</defs>;
}

let uid = 0;
const useId = (p) => `${p}-${++uid}`;

/* ── Figure ─────────────────────────────────────────────────────────────────── */
export function Figure({ title, caption, status, children, minWidth = 620 }) {
  const tag = status && (
    <span style={{
      font: '600 0.6875rem var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 5, marginLeft: 8, verticalAlign: '0.1em',
      background: status === 'Direction' ? 'var(--warn-bg)' : status === 'Proposal' ? 'var(--info-bg)' : 'var(--s1)',
      color: status === 'Direction' ? 'var(--warn-text)' : status === 'Proposal' ? 'var(--info-text)' : 'var(--mid)',
      border: '1px solid var(--border)',
    }}>{status}</span>
  );
  return (
    <figure className="doc-diagram" style={{ margin: '18px 0 22px', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--s0)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', padding: '18px 18px 8px' }}>
        <div style={{ minWidth }}>{children}</div>
      </div>
      {(title || caption) && (
        <figcaption style={{ padding: '10px 18px 14px', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>
          {title && <strong style={{ color: 'var(--black)' }}>{title}</strong>}{tag}
          {caption && <div style={{ marginTop: 2 }}>{caption}</div>}
        </figcaption>
      )}
    </figure>
  );
}

/* ── SequenceDiagram ────────────────────────────────────────────────────────
 * lanes: [{ id, label, sub?, tone? }]
 * steps: [{ from, to, label, kind?: 'call'|'return'|'self'|'note', status?: 'tbd'|'direction' }]
 *   'note' spans from..to with a tinted band (e.g. a time budget).
 * ─────────────────────────────────────────────────────────────────────────── */
export function SequenceDiagram({ lanes, steps, label, width = 880 }) {
  const id = useId('seq');
  const pad = 12, colW = (width - pad * 2) / lanes.length, headH = 54, top = headH + 26;
  const cx = lid => pad + colW * lanes.findIndex(l => l.id === lid) + colW / 2;
  const maxChars = Math.max(16, Math.round(colW / 6.6));
  let y = top;
  const rows = steps.map((s, i) => {
    const isSelf = s.kind === 'self' || s.from === s.to;
    const lines = wrap(s.label, isSelf ? Math.round(maxChars * 0.9) : Math.round(maxChars * Math.max(1, Math.abs(lanes.findIndex(l => l.id === s.to) - lanes.findIndex(l => l.id === s.from))) * 0.95));
    const h = s.kind === 'note' ? 18 + lines.length * 15 : 20 + lines.length * 15 + (isSelf ? 14 : 0);
    const row = { s, i, y, lines, isSelf, h };
    y += h + 10;
    return row;
  });
  const H = y + 6;
  let n = 0;
  return (
    <svg viewBox={`0 0 ${width} ${H}`} width="100%" role="img" aria-label={label} style={{ display: 'block' }}>
      <Markers id={id} />
      {lanes.map((l, i) => {
        const t = tone(l.tone), x = pad + colW * i + 8, w = colW - 16, c = x + w / 2;
        return (
          <g key={l.id}>
            <line x1={c} y1={headH} x2={c} y2={H - 4} stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 5" />
            <rect x={x} y={0} width={w} height={headH} rx={10} fill={t.fill} stroke={t.stroke} strokeWidth={l.tone === 'tomtom' ? 1.6 : 1.2} strokeDasharray={t.dash || undefined} />
            <Lines x={c} y={l.sub ? 22 : 31} lines={[l.label]} size={13} weight={700} fill={t.text} />
            {l.sub && <Lines x={c} y={39} lines={[l.sub]} size={11} fill="var(--muted)" />}
          </g>
        );
      })}
      {rows.map(({ s, i, y, lines, isSelf, h }) => {
        if (s.kind === 'note') {
          const a = cx(s.from), b = cx(s.to), x1 = Math.min(a, b) - colW / 2 + 14, x2 = Math.max(a, b) + colW / 2 - 14;
          return (
            <g key={i}>
              <rect x={x1} y={y} width={x2 - x1} height={h} rx={8} fill="var(--s1)" stroke="var(--border)" />
              <Lines x={(x1 + x2) / 2} y={y + 18} lines={lines} size={11.5} fill="var(--mid)" />
            </g>
          );
        }
        n += 1;
        const tbd = s.status === 'tbd', dir = s.status === 'direction';
        const ret = s.kind === 'return';
        const stroke = tbd ? 'var(--b-hi)' : ret ? 'var(--mid)' : 'var(--black)';
        const mk = `url(#${id}-${tbd ? 'tbd' : ret ? 'return' : 'call'})`;
        const dash = tbd ? '5 4' : ret ? '6 4' : dir ? '2 3' : undefined;
        const a = cx(s.from), b = cx(s.to);
        const badge = (bx, by) => (
          <g>
            <circle cx={bx} cy={by} r={9} fill={tbd ? 'var(--s1)' : 'var(--brand)'} stroke={tbd ? 'var(--b-hi)' : 'none'} />
            <text x={bx} y={by + 3.8} textAnchor="middle" fontFamily={FONT} fontSize="10.5" fontWeight="700" fill={tbd ? 'var(--muted)' : '#fff'}>{n}</text>
          </g>
        );
        if (isSelf) {
          const ly = y + lines.length * 15 + 8;
          return (
            <g key={i}>
              <path d={`M${a} ${ly} h28 v14 h-24`} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} markerEnd={mk} />
              {badge(a > width - colW ? a + 16 : a - 16, y + 4)}
              {a > width - colW ? <Lines x={a - 26} y={y + 8} lines={lines} size={12} anchor="end" fill={tbd ? 'var(--muted)' : 'var(--black)'} />
                : <Lines x={a + 2} y={y + 8} lines={lines} size={12} anchor="start" fill={tbd ? 'var(--muted)' : 'var(--black)'} />}
            </g>
          );
        }
        const ly = y + lines.length * 15 + 6, mid = (a + b) / 2;
        return (
          <g key={i}>
            <line x1={a + (b > a ? 20 : -20)} y1={ly} x2={b + (b > a ? -2 : 2)} y2={ly} stroke={stroke} strokeWidth="1.6" strokeDasharray={dash} markerEnd={mk} />
            {badge(a + (b > a ? 10 : -10), ly)}
            <Lines x={mid} y={y + 8} lines={lines} size={12} fill={tbd ? 'var(--muted)' : 'var(--black)'} />
          </g>
        );
      })}
    </svg>
  );
}

/* ── LayerDiagram ───────────────────────────────────────────────────────────
 * layers: [{ label, owner?, boxes: [{ label, sub?, tone? }], link?: 'arrow label', linkAt?: boxIndex,
 *            linkStatus?: 'tbd', linkDir?: 'down'|'up'|'both' }]
 * Top layer first. Arrows run between consecutive layers when `link` is set.
 * compact: layer labels sit above the boxes, so narrow figures (e.g. paths side by side) stay readable.
 * ─────────────────────────────────────────────────────────────────────────── */
export function LayerDiagram({ layers, label, width = 880, compact = false, labelWidth = 150 }) {
  const id = useId('lay');
  const left = compact ? 0 : labelWidth, gap = 12, rowGap = compact ? 52 : 44;
  let y = compact ? 22 : 0;
  const rows = layers.map(L => {
    const bw = (width - left - gap * (L.boxes.length - 1)) / L.boxes.length;
    const chars = Math.max(14, Math.round(bw / 7));
    const boxes = L.boxes.map(b => ({ ...b, lines: wrap(b.label, chars), subl: wrap(b.sub || '', Math.round(chars * 1.15)) }));
    const h = Math.max(56, 24 + Math.max(...boxes.map(b => b.lines.length * 16 + b.subl.length * 14)));
    const row = { L, boxes, bw, y, h };
    y += h + rowGap;
    return row;
  });
  const H = y - rowGap + 4;
  return (
    <svg viewBox={`0 0 ${width} ${H}`} width="100%" role="img" aria-label={label} style={{ display: 'block' }}>
      <Markers id={id} />
      {rows.map(({ L, boxes, bw, y, h }, ri) => (
        <g key={ri}>
          {(() => {
            const ll = compact ? [] : wrap(L.label, Math.round(left / 8));
            const block = ll.length * 16 + (L.owner ? 15 : 0);
            const ty = y + h / 2 - block / 2 + 12;
            return compact ? null : (
              <g>
                <Lines x={0} y={ty} lines={ll} size={12.5} weight={700} anchor="start" fill="var(--black)" />
                {L.owner && <Lines x={0} y={ty + ll.length * 16} lines={[L.owner]} size={11} anchor="start" fill="var(--muted)" />}
              </g>
            );
          })()}
          {compact && <Lines x={0} y={y - 8} lines={[L.owner ? `${L.label} · ${L.owner}` : L.label]} size={11.5} weight={700} anchor="start" fill="var(--mid)" />}
          {boxes.map((b, bi) => {
            const t = tone(b.tone), x = left + bi * (bw + gap);
            const textTop = y + h / 2 - ((b.lines.length * 16 + b.subl.length * 14) / 2) + 12;
            return (
              <g key={bi}>
                <rect x={x} y={y} width={bw} height={h} rx={12} fill={t.fill === 'none' ? 'var(--s0)' : t.fill} stroke={t.stroke === 'none' ? 'var(--border)' : t.stroke} strokeWidth={b.tone === 'tomtom' ? 1.6 : 1.2} strokeDasharray={t.dash || undefined} />
                <Lines x={x + bw / 2} y={textTop} lines={b.lines} size={13} weight={700} fill={t.text} />
                {b.subl.length > 0 && <Lines x={x + bw / 2} y={textTop + b.lines.length * 16 + 2} lines={b.subl} size={11} fill="var(--muted)" />}
              </g>
            );
          })}
          {L.link && ri < rows.length - 1 && (() => {
            const at = L.linkAt != null ? L.linkAt : null;
            const x = at == null ? left + (width - left) / 2 : left + at * (bw + gap) + bw / 2;
            const y1 = y + h + 4, y2 = y + h + (compact ? rowGap - 22 : rowGap - 4);
            const tbd = L.linkStatus === 'tbd', mk = `url(#${id}-${tbd ? 'tbd' : 'return'})`;
            return (
              <g>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke={tbd ? 'var(--b-hi)' : 'var(--mid)'} strokeWidth="1.5" strokeDasharray={tbd ? '5 4' : undefined}
                  markerEnd={L.linkDir === 'up' ? undefined : mk} markerStart={L.linkDir === 'down' ? undefined : mk} />
                <Lines x={x + 10} y={(y1 + y2) / 2 + 4} lines={[L.link]} size={11.5} anchor="start" fill={tbd ? 'var(--muted)' : 'var(--mid)'} />
              </g>
            );
          })()}
        </g>
      ))}
    </svg>
  );
}

/* ── StepsDiagram ───────────────────────────────────────────────────────────
 * steps: [{ label, sub?, status?: string, tone? }]  left to right, with arrows.
 * ─────────────────────────────────────────────────────────────────────────── */
export function StepsDiagram({ steps, label, width = 880, highlight }) {
  const id = useId('stp');
  const gap = 34, bw = (width - gap * (steps.length - 1)) / steps.length;
  const chars = Math.max(12, Math.round(bw / 7));
  const items = steps.map(s => ({ ...s, lines: wrap(s.label, chars), subl: wrap(s.sub || '', Math.round(chars * 1.15)) }));
  const h = Math.max(...items.map(s => 46 + s.lines.length * 16 + s.subl.length * 14));
  return (
    <svg viewBox={`0 0 ${width} ${h + 4}`} width="100%" role="img" aria-label={label} style={{ display: 'block' }}>
      <Markers id={id} />
      {items.map((s, i) => {
        const x = i * (bw + gap), hot = highlight === i, t = tone(s.tone || (hot ? 'tomtom' : 'partner'));
        return (
          <g key={i}>
            <rect x={x} y={2} width={bw} height={h} rx={12} fill={t.fill === 'none' ? 'var(--s0)' : t.fill} stroke={t.stroke} strokeWidth={hot ? 2 : 1.2} strokeDasharray={t.dash || undefined} />
            <text x={x + 14} y={24} fontFamily="var(--font-mono)" fontSize="11" fontWeight="500" fill={hot ? 'var(--brand)' : 'var(--muted)'}>{String(i + 1).padStart(2, '0')}</text>
            {s.status && <text x={x + bw - 12} y={24} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="var(--mid)">{s.status.toUpperCase()}</text>}
            <Lines x={x + 14} y={46} lines={s.lines} size={13} weight={700} anchor="start" fill={t.text} />
            {s.subl.length > 0 && <Lines x={x + 14} y={46 + s.lines.length * 16 + 2} lines={s.subl} size={11} anchor="start" fill="var(--muted)" />}
            {i < items.length - 1 && <line x1={x + bw + 4} y1={h / 2 + 2} x2={x + bw + gap - 4} y2={h / 2 + 2} stroke="var(--mid)" strokeWidth="1.5" markerEnd={`url(#${id}-return)`} />}
          </g>
        );
      })}
    </svg>
  );
}
