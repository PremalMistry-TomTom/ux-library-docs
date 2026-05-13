/* ─────────────────────────────────────────────────────────────────────────────
 * NavIASandbox — Routing API navigation IA prototype
 * Compare three nav structure options with live preview + annotation.
 * Lives in Plumbing Portal — use before committing to the Routing API refactor.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'; // still used by PagePatternMockup and NavCPreview

/* ── Version colour system ─────────────────────────────────────────────────── */
const V = {
  v1: { color: '#22c55e', name: 'Version 1', badge: 'Production',      badgeColor: '#166534', badgeBg: '#dcfce7' },
  v2: { color: '#a78bfa', name: 'Version 2', badge: 'Public Preview',  badgeColor: '#5b21b6', badgeBg: '#ede9fe' },
  v3: { color: '#fb923c', name: 'Version 3', badge: 'Private Preview', badgeColor: '#7c2d12', badgeBg: '#fed7aa' },
};

/* ── Endpoint matrix ───────────────────────────────────────────────────────── */
const ENDPOINTS = [
  { name: 'Calculate Route',        id: 'cr',  v: ['v1','v2','v3'] },
  { name: 'Reachable Range',        id: 'rr',  v: ['v1','v2','v3'] },
  { name: 'Batch Routing',          id: 'br',  v: ['v1'] },
  { name: 'Guidance Instructions',  id: 'gi',  v: ['v1','v2','v3'] },
  { name: 'Lane Guidance',          id: 'lg',  v: ['v1','v2','v3'] },
  { name: 'Road Shield Notes',      id: 'rs',  v: ['v1'] },
  { name: 'Compute Toll Amounts',   id: 'ct',  v: ['v2','v3'] },
  { name: 'Weather Consideration',  id: 'wc',  v: ['v3'] },
  { name: 'Dynamic Data Freshness', id: 'df',  v: ['v2'] },
];

const TOTAL_V_ENTRIES = ENDPOINTS.reduce((n, e) => n + e.v.length, 0); // 20

/* ── Option definitions ────────────────────────────────────────────────────── */
const OPTIONS = [
  {
    id: 'a',
    label: 'Option A',
    sub: 'Version-first',
    desc: 'Current structure. Each API version is a nav section; endpoints are duplicated under every version that supports them.',
    pros: [
      'Version context is always visible in the nav',
      'Familiar to users of the existing portal',
      'Simple to maintain — each section is independent',
    ],
    cons: [
      '"Calculate Route" appears 3× in the nav',
      'Developers must pick a version before understanding the concept',
      `${TOTAL_V_ENTRIES} endpoint nav entries — grows with every new version`,
    ],
    endpointLabel: `${TOTAL_V_ENTRIES} endpoint entries`,
    pagePattern: 'Three separate pages per endpoint (one per version)',
  },
  {
    id: 'b',
    label: 'Option B',
    sub: 'Concept-first + dots',
    recommended: true,
    desc: 'One nav entry per endpoint concept. Coloured dots show which versions support it — using the same colour system as the intro version comparison table.',
    pros: [
      `${ENDPOINTS.length} endpoint entries — zero duplication`,
      'Task-oriented: find the concept, then see version differences inline',
      'Dots visually tie back to the intro version table',
      'Nav stays compact as more versions ship',
    ],
    cons: [
      'Endpoint pages need version tabs or inline diff sections',
      'Slightly more complex page-level layout to author',
    ],
    endpointLabel: `${ENDPOINTS.length} endpoint entries`,
    pagePattern: 'Single page per endpoint with version tabs (v1 | v2 | v3)',
  },
  {
    id: 'c',
    label: 'Option C',
    sub: 'Version filter',
    desc: 'Concept-first list with a version switcher at the top of the nav panel. Filters the nav to show only endpoints available in the selected version.',
    pros: [
      '"I am a v2 developer" — hide everything that doesn\'t apply',
      'Reduces nav noise for focused, single-version developers',
      'Common pattern in OpenAPI spec explorers',
    ],
    cons: [
      'Hidden entries cause confusion ("where did Batch Routing go?")',
      'Filter state must persist or it becomes friction on every page change',
      'Default "All" view still lacks per-entry version context',
    ],
    endpointLabel: `${ENDPOINTS.length} entries (filtered)`,
    pagePattern: 'Single page per endpoint with version tabs — same as Option B',
  },
];

/* ── Mini sidenav primitives ───────────────────────────────────────────────── */
function NavChrome({ title, children }) {
  return (
    <div style={{
      width: 210, flexShrink: 0,
      borderRadius: 12, border: '1px solid var(--border)',
      overflow: 'hidden',
      background: 'var(--surface)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        height: 28, background: 'var(--s2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 10px', gap: 5,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.575rem', color: 'var(--muted)', fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 460, paddingBottom: 10 }}>
        {children}
      </div>
    </div>
  );
}

function NSectionLabel({ label, vKey }) {
  return (
    <div style={{ padding: '10px 12px 3px', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}
      </span>
      {vKey && (
        <span style={{
          fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3,
          color: V[vKey].badgeColor, background: V[vKey].badgeBg, letterSpacing: '0.04em',
        }}>
          {V[vKey].badge}
        </span>
      )}
    </div>
  );
}

function NGroupItem({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', fontSize: '0.7rem', color: 'var(--mid)', fontWeight: 500,
    }}>
      <span style={{ fontSize: '0.55rem', color: 'var(--muted)', transform: 'rotate(-90deg)', display: 'inline-block' }}>▾</span>
      {label}
    </div>
  );
}

function NItem({ label, active, dots, showRef }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '5px 12px 5px 14px',
      background: active ? 'var(--bg)' : 'transparent',
      borderLeft: active ? '2px solid #e2001a' : '2px solid transparent',
      fontSize: '0.7rem', lineHeight: 1.3,
      color: active ? 'var(--text)' : 'var(--mid)',
      fontWeight: active ? 600 : 400,
    }}>
      <span style={{ flex: 1 }}>{label}</span>
      {dots && dots.map(vKey => (
        <span key={vKey}
          title={V[vKey].name}
          style={{ width: 6, height: 6, borderRadius: '50%', background: V[vKey].color, flexShrink: 0 }} />
      ))}
      {showRef && (
        <span style={{
          fontSize: '0.5rem', padding: '1px 4px', borderRadius: 3,
          background: 'var(--s2)', color: 'var(--muted)', fontWeight: 600, marginLeft: 1,
        }}>
          REF
        </span>
      )}
    </div>
  );
}

/* ── Three nav previews ────────────────────────────────────────────────────── */
function NavAPreview() {
  return (
    <NavChrome title="Routing API — Option A">
      <NItem label="Introduction" active />
      <NItem label="Quick Start" />
      {['v1','v2','v3'].map(vKey => (
        <div key={vKey}>
          <NSectionLabel label={V[vKey].name} vKey={vKey} />
          {ENDPOINTS.filter(e => e.v.includes(vKey)).map(e => (
            <NItem key={`${vKey}-${e.id}`} label={e.name} showRef />
          ))}
        </div>
      ))}
      <NSectionLabel label="Guides" />
      <NGroupItem label="EV Routing" />
      <NGroupItem label="How-to" />
      <NSectionLabel label="Map Platforms" />
      <NGroupItem label="Platforms & Migration" />
      <NSectionLabel label="Reference" />
      <NGroupItem label="Full Reference" />
    </NavChrome>
  );
}

/* Matches ROUTING_API_NAV_B exactly */
const ENDPOINTS_B = [
  { name: 'Calculate Route',           id: 'cr',  v: ['v1','v2','v3'] },
  { name: 'Reachable Range',           id: 'rr',  v: ['v1','v2','v3'] },
  { name: 'Batch Routing',             id: 'br',  v: ['v1'] },
  { name: 'Turn-by-Turn Instructions', id: 'ti',  v: ['v1'] },
  { name: 'Guidance Instructions',     id: 'gi',  v: ['v2','v3'] },
  { name: 'Lane Guidance',             id: 'lg',  v: ['v1','v2','v3'] },
  { name: 'Road Shield Notes',         id: 'rs',  v: ['v1'] },
  { name: 'Compute Toll Amounts',      id: 'ct',  v: ['v2','v3'] },
  { name: 'Dynamic Data Freshness',    id: 'df',  v: ['v2'] },
  { name: 'Weather Consideration',     id: 'wc',  v: ['v3'] },
];

function NavBPreview() {
  return (
    <NavChrome title="Routing API — Option B">
      <NItem label="Introduction" active />
      <NItem label="Quick Start" />
      <NSectionLabel label="Endpoints" />
      {ENDPOINTS_B.map(e => (
        <NItem key={e.id} label={e.name} dots={e.v} showRef />
      ))}
      <NSectionLabel label="Guides" />
      <NGroupItem label="EV Routing" />
      <NGroupItem label="How-to" />
      <NSectionLabel label="Map Platforms" />
      <NGroupItem label="Platforms & Migration" />
      <NSectionLabel label="Reference" />
      <NGroupItem label="Full Reference" />
    </NavChrome>
  );
}

/* Matches ROUTING_API_NAV_C exactly — same endpoints as B, with version filter */
function NavCPreview() {
  const [vf, setVf] = useState('all');
  const filtered = vf === 'all' ? ENDPOINTS_B : ENDPOINTS_B.filter(e => e.v.includes(vf));
  return (
    <NavChrome title="Routing API — Option C">
      <NItem label="Introduction" active />
      <NItem label="Quick Start" />
      {/* Version filter — same control as live Sidenav */}
      <div style={{ padding: '6px 10px 7px', borderBottom: '1px solid var(--border)', background: 'var(--s2)' }}>
        <div style={{ display: 'flex', borderRadius: 6, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {['all','v1','v2','v3'].map((v, i) => {
            const isActive = vf === v;
            const vd = V[v];
            return (
              <button key={v} onClick={() => setVf(v)} style={{
                flex: 1, padding: '4px 0',
                border: 'none',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                fontSize: '0.6rem', fontWeight: 700,
                background: isActive ? (v === 'all' ? 'var(--text)' : `${vd.color}22`) : 'transparent',
                color:      isActive ? (v === 'all' ? 'var(--bg)'   : vd.color)         : 'var(--muted)',
                transition: 'all 0.1s',
              }}>
                {v === 'all' ? 'All' : v.toUpperCase()}
              </button>
            );
          })}
        </div>
        {vf !== 'all' && (
          <div style={{ fontSize: '0.55rem', color: V[vf].badgeColor, marginTop: 4, fontWeight: 600 }}>
            {filtered.length} of {ENDPOINTS_B.length} endpoints
          </div>
        )}
      </div>
      <NSectionLabel label="Endpoints" />
      {filtered.map(e => (
        <NItem key={e.id} label={e.name} showRef />
      ))}
      <NSectionLabel label="Guides" />
      <NGroupItem label="EV Routing" />
      <NGroupItem label="How-to" />
      <NSectionLabel label="Map Platforms" />
      <NGroupItem label="Platforms & Migration" />
      <NSectionLabel label="Reference" />
      <NGroupItem label="Full Reference" />
    </NavChrome>
  );
}

/* ── Mini TOC — shared across all three page patterns ──────────────────────── */
function MiniTOC({ items }) {
  return (
    <div style={{
      width: 120, flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      padding: '10px 0 10px 10px',
    }}>
      <div style={{
        fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8,
      }}>
        On this page
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 0 3px 8px',
            borderLeft: `1px solid ${item.active ? '#e2001a' : 'var(--border)'}`,
            fontSize: '0.6rem', color: item.active ? '#e2001a' : 'var(--muted)',
            fontWeight: item.active ? 600 : 400,
            lineHeight: 1.4,
          }}>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.method && (
              <span style={{
                fontSize: '0.475rem', fontWeight: 700, padding: '1px 4px', borderRadius: 2,
                background: item.method === 'GET'  ? 'rgba(63,185,80,0.15)'  : 'rgba(88,166,255,0.15)',
                color:      item.method === 'GET'  ? '#3fb950'               : '#58a6ff',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}>
                {item.method}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TOC items per version ─────────────────────────────────────────────────── */
const TOC_ITEMS = {
  v1: [
    { label: 'Overview',    active: true },
    { label: 'Parameters',  method: 'GET'  },
    { label: 'POST body',   method: 'POST' },
    { label: 'Response'    },
    { label: 'Error codes' },
  ],
  v2: [
    { label: 'Overview',    active: true },
    { label: 'Parameters',  method: 'GET'  },
    { label: 'POST body',   method: 'POST' },
    { label: 'Response'    },
    { label: 'Error codes' },
  ],
  v3: [
    { label: 'Overview',    active: true },
    { label: 'Request',     method: 'POST' },
    { label: 'Attributes'  },
    { label: 'Response'    },
    { label: 'Error codes' },
  ],
};

/* ── Page pattern mockup ───────────────────────────────────────────────────── */
function PagePatternMockup({ optId }) {
  const tabs = ['v1', 'v2', 'v3'];
  const [activeTab, setActiveTab] = useState('v1');

  if (optId === 'a') {
    return (
      <div style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex' }}>
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ padding: '10px 14px', background: 'var(--s2)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text)' }}>Calculate Route</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: '0.55rem', padding: '2px 6px', borderRadius: 3, background: V.v1.badgeBg, color: V.v1.badgeColor, fontWeight: 700 }}>v1 Production</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/routing/1/calculateRoute</span>
            </div>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              Separate pages per version. The v2 and v3 versions of this endpoint are separate nav entries with their own pages.
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {['v1 · Calculate Route', 'v2 · Calculate Route', 'v3 · Calculate Route'].map((t, i) => (
                <div key={i} style={{
                  padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)',
                  fontSize: '0.6rem', color: i === 0 ? V.v1.color : 'var(--muted)',
                  fontWeight: i === 0 ? 700 : 400,
                  background: i === 0 ? `${V.v1.color}12` : 'transparent',
                }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
        {/* TOC */}
        <MiniTOC items={TOC_ITEMS.v1} />
      </div>
    );
  }

  // Options B and C share the same page pattern — single page with version tabs
  return (
    <div style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex' }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ padding: '10px 14px', background: 'var(--s2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text)' }}>Calculate Route</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 2 }}>One page — version tabs below</div>
          </div>
          {/* Version dots on the page header */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {tabs.map(vKey => (
              <span key={vKey} style={{ width: 7, height: 7, borderRadius: '50%', background: V[vKey].color }} title={V[vKey].name} />
            ))}
          </div>
        </div>
        {/* Version tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {tabs.map(vKey => {
            const isActive = activeTab === vKey;
            return (
              <button key={vKey} onClick={() => setActiveTab(vKey)} style={{
                padding: '7px 14px', border: 'none', cursor: 'pointer',
                borderBottom: isActive ? `2px solid ${V[vKey].color}` : '2px solid transparent',
                background: 'transparent',
                fontSize: '0.7rem', fontWeight: isActive ? 700 : 400,
                color: isActive ? V[vKey].color : 'var(--muted)',
                transition: 'all 0.1s',
              }}>
                {vKey.toUpperCase()} · {V[vKey].badge}
              </button>
            );
          })}
        </div>
        <div style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 6 }}>
            {activeTab === 'v1' && '/routing/1/calculateRoute/{routePoints}/json'}
            {activeTab === 'v2' && '/routing/2/calculateRoute/{routePoints}/json'}
            {activeTab === 'v3' && '/maps/orbis/routing/v3/routes'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--mid)', lineHeight: 1.5 }}>
            {activeTab === 'v3'
              ? 'v3 uses POST only. Waypoints go in the request body as a legs array. Response fields are selected via the Attributes header.'
              : 'Supports GET and POST. Route waypoints can be passed as path parameters or in the POST body.'}
          </div>
        </div>
      </div>
      {/* TOC — adapts to active version tab */}
      <MiniTOC items={TOC_ITEMS[activeTab]} />
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────────────────────── */
export default function NavIASandbox({ navMode = 'a', onNavModeChange }) {
  const opt = navMode;
  const setOpt = (mode) => onNavModeChange?.(mode);
  const option = OPTIONS.find(o => o.id === opt);

  return (
    <div className="page">

      {/* ── Page header ── */}
      <div className="page-header">
        <h1>Nav IA Sandbox</h1>
      </div>

      {/* ── Live connection banner ── */}
      <div style={{
        margin: '0 0 24px',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid var(--success-border)',
        background: 'var(--success-bg)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0, boxShadow: '0 0 0 3px var(--success-border)' }} />
        <span style={{ fontSize: '0.8125rem', color: 'var(--success-text)', fontWeight: 600 }}>
          Live — controls the Routing API sidenav.
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--success-text)' }}>
          Select an option below and navigate to <strong>Routing API</strong> to see it take effect immediately.
        </span>
      </div>

      <p className="quick-answer">
        Toggle between three navigation structures for the Routing API. Your choice updates the live sidenav and is remembered across sessions.
      </p>

      {/* ── Version legend ── */}
      <div className="zone">
        <h2 className="sh">Version colour system</h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 14, lineHeight: 1.6 }}>
          All three options use this colour system — the same one established on the Routing API intro page version comparison table.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(V).map(([key, v]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 20,
              border: `1px solid ${v.color}35`,
              background: `${v.color}0d`,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)' }}>{v.name}</span>
              <span style={{
                fontSize: '0.6875rem', padding: '2px 7px', borderRadius: 3,
                color: v.badgeColor, background: v.badgeBg, fontWeight: 700,
              }}>
                {v.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Option toggle + preview ── */}
      <div className="zone">
        <h2 className="sh">Nav structure options</h2>

        {/* Toggle — paddingTop gives clearance for the RECOMMENDED badge overflow */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', paddingTop: 14 }}>
          {OPTIONS.map(o => {
            const isActive = opt === o.id;
            return (
              <button key={o.id} onClick={() => setOpt(o.id)} style={{
                position: 'relative',
                padding: '12px 18px', borderRadius: 12,
                border: `2px solid ${isActive ? 'var(--brand)' : 'var(--border)'}`,
                background: isActive ? 'var(--danger-bg)' : 'var(--surface)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                minWidth: 140,
              }}>
                {o.recommended && (
                  <span style={{
                    position: 'absolute', top: -10, right: 8,
                    fontSize: '0.55rem', fontWeight: 700, padding: '2px 7px',
                    borderRadius: 10, background: 'var(--success-text)', color: '#fff', letterSpacing: '0.05em',
                  }}>
                    RECOMMENDED
                  </span>
                )}
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: isActive ? 'var(--brand)' : 'var(--muted)', marginBottom: 3, letterSpacing: '0.04em' }}>
                  {o.label}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', lineHeight: 1.2 }}>
                  {o.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview + annotation */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Nav preview */}
          <div style={{ flexShrink: 0 }}>
            {opt === 'a' && <NavAPreview />}
            {opt === 'b' && <NavBPreview />}
            {opt === 'c' && <NavCPreview />}
            <div style={{
              marginTop: 8, fontSize: '0.6875rem', color: 'var(--muted)',
              textAlign: 'center', fontWeight: 600,
            }}>
              {option.endpointLabel}
            </div>
          </div>

          {/* Annotation */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 20, lineHeight: 1.65 }}>
              {option.desc}
            </p>

            {/* Pros / cons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--success-text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Works well
                </div>
                {option.pros.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 9 }}>
                    <span style={{ color: '#22c55e', flexShrink: 0, fontSize: '0.8125rem', lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Watch out for
                </div>
                {option.cons.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 9 }}>
                    <span style={{ color: '#ef4444', flexShrink: 0, fontSize: '0.8125rem', lineHeight: 1.4 }}>✗</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoint page pattern */}
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              On endpoint pages
            </div>
            <PagePatternMockup key={opt} optId={opt} />
          </div>
        </div>
      </div>

      {/* ── Endpoint coverage matrix ── */}
      <div className="zone">
        <h2 className="sh">Endpoint coverage</h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Which endpoints exist per version. Each row maps to one nav entry in Option B/C, or three separate entries in Option A.
        </p>
        <div style={{ borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px',
            padding: '8px 16px', background: 'var(--s2)',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)' }}>Endpoint</div>
            {['v1','v2','v3'].map(vKey => (
              <div key={vKey} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, color: V[vKey].badgeColor, background: V[vKey].badgeBg }}>
                  {vKey.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          {/* Rows */}
          {ENDPOINTS.map((e, i) => (
            <div key={e.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px',
              padding: '9px 16px', alignItems: 'center',
              borderBottom: i < ENDPOINTS.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'var(--s1)',
            }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)', fontWeight: 500 }}>{e.name}</span>
              {['v1','v2','v3'].map(vKey => (
                <div key={vKey} style={{ textAlign: 'center' }}>
                  {e.v.includes(vKey)
                    ? <span style={{ color: V[vKey].color, fontSize: '0.875rem' }}>✓</span>
                    : <span style={{ color: 'var(--border)', fontSize: '0.875rem' }}>—</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Side-by-side comparison ── */}
      <div className="zone">
        <h2 className="sh">Side-by-side comparison</h2>
        <div style={{ borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr',
            background: 'var(--s2)', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ padding: '10px 14px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)' }} />
            {OPTIONS.map(o => (
              <div key={o.id} style={{
                padding: '10px 14px', borderLeft: '1px solid var(--border)',
                background: opt === o.id ? 'var(--danger-bg)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: opt === o.id ? 'var(--brand)' : 'var(--muted)' }}>{o.label}</span>
                  {o.recommended && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'var(--success-bg)', color: 'var(--success-text)' }}>★</span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--black)', marginTop: 1 }}>{o.sub}</div>
              </div>
            ))}
          </div>

          {[
            { label: 'Nav entries', vals: [`${TOTAL_V_ENTRIES} endpoint entries`, `${ENDPOINTS.length} endpoint entries`, `${ENDPOINTS.length} entries (filtered)`] },
            { label: 'Version context', vals: ['Section headers', 'Colour-coded dots', 'Filter toggle'] },
            { label: 'Duplicates', vals: ['Yes — each endpoint repeated per version', 'No', 'No'] },
            { label: 'Endpoint pages', vals: ['Separate page per version', 'Unified page, version tabs', 'Unified page, version tabs'] },
            { label: 'Scales with new versions', vals: ['Nav grows linearly', 'Adds one dot, no new entry', 'Adds one entry when "All"'] },
            { label: 'Best for', vals: ['Teams familiar with portal today', 'Task-focused developers', 'Single-version integrators'] },
          ].map((row, ri) => (
            <div key={ri} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr',
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{ padding: '9px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--mid)', background: 'var(--s1)' }}>
                {row.label}
              </div>
              {row.vals.map((v, ci) => (
                <div key={ci} style={{
                  padding: '9px 14px', fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.45,
                  borderLeft: '1px solid var(--border)',
                  background: opt === OPTIONS[ci].id ? 'var(--danger-bg)' : 'transparent',
                }}>
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
