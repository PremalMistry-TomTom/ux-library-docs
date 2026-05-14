import { useState, useEffect, useRef, useCallback } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { IlloTrafficIncidents, IlloTrafficFlow, IlloTrafficFlowTile } from './IntroIllustrations';
import { makeThumb, L_TrafficIncidents, L_TrafficFlow, L_TrafficFlowTile } from '../illustrations/lightVariants';
import { IcoTrafficIncidents, IcoTrafficFlow, IcoTrafficFlowTile } from '../illustrations/iconVariants';

const ThumbTrafficIncidents    = makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents);
const ThumbTrafficFlow         = makeThumb(IlloTrafficFlow,      L_TrafficFlow,      IcoTrafficFlow);
const ThumbTrafficFlowTile     = makeThumb(IlloTrafficFlowTile,  L_TrafficFlowTile,  IcoTrafficFlowTile);
const ThumbTrafficIncidentTile = makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents);

/* ─────────────────────────────────────────────────────────────────────────────
 * TrafficExplorer — live API request builder.
 * Supports:
 *   • Incident Details v5  (GET /traffic/services/5/incidentDetails)
 *   • Flow Segment Data v4 (GET /traffic/services/4/flowSegmentData/{style}/{zoom}/json)
 * ───────────────────────────────────────────────────────────────────────────── */

const DEMO_KEY = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const LS_KEY   = 'tt-explorer-key';

const STYLE_VERSION = '22.2.1-*';
function mapStyleUrl(apiKey, isDark) {
  const v   = isDark ? 'dark' : 'light';
  const key = apiKey || DEMO_KEY;
  return (
    `https://api.tomtom.com/style/1/style/${STYLE_VERSION}` +
    `?key=${key}&map=2/basic_street-${v}` +
    `&traffic_incidents=2/incidents_${v}` +
    `&traffic_flow=2/flow_relative-${v}` +
    `&poi=2/poi_${v}`
  );
}

/* Category id → { label, color } */
const INCIDENT_CATEGORIES = {
  0:  { label: 'Unknown',             color: '#94a3b8' },
  1:  { label: 'Accident',            color: '#ef4444' },
  2:  { label: 'Fog',                 color: '#a78bfa' },
  3:  { label: 'Dangerous Conditions',color: '#f97316' },
  4:  { label: 'Rain',                color: '#60a5fa' },
  5:  { label: 'Ice',                 color: '#7dd3fc' },
  6:  { label: 'Jam',                 color: '#dc2626' },
  7:  { label: 'Lane Closed',         color: '#eab308' },
  8:  { label: 'Road Closed',         color: '#1e293b' },
  9:  { label: 'Road Works',          color: '#fb923c' },
  10: { label: 'Wind',                color: '#2dd4bf' },
  11: { label: 'Flooding',            color: '#3b82f6' },
  14: { label: 'Broken Down Vehicle', color: '#f59e0b' },
};

function catInfo(iconCategory) {
  const n = Number(iconCategory);
  return INCIDENT_CATEGORIES[n] || INCIDENT_CATEGORIES[0];
}

/* City presets for incidents bbox */
const CITY_PRESETS = [
  { label: 'Amsterdam',  lat: 52.37,  lon: 4.895 },
  { label: 'London',     lat: 51.507, lon: -0.128 },
  { label: 'Paris',      lat: 48.856, lon: 2.352  },
  { label: 'Berlin',     lat: 52.520, lon: 13.405 },
  { label: 'New York',   lat: 40.712, lon: -74.006 },
  { label: 'Los Angeles',lat: 34.052, lon: -118.244 },
];

/* Derive bbox string from center lat/lon + radius km */
function bboxFromCenter(lat, lon, radiusKm = 8) {
  const deg    = radiusKm / 111;
  const lonDeg = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  const minLon = (lon - lonDeg).toFixed(6);
  const minLat = (lat - deg).toFixed(6);
  const maxLon = (lon + lonDeg).toFixed(6);
  const maxLat = (lat + deg).toFixed(6);
  return `${minLon},${minLat},${maxLon},${maxLat}`;
}

/* Default fields for incidents */
const INCIDENTS_FIELDS =
  '{incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,from,to,length,delay,roadNumbers,timeValidity,probabilityOfOccurrence,numberOfReports}}}';

/* ─── Shared input styles ──────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 7,
  border: '1px solid var(--border)', background: 'var(--bg)',
  color: 'var(--black)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)',
  boxSizing: 'border-box', outline: 'none',
};
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };
const numStyle    = { ...inputStyle, width: 100 };

/* ─── SectionCard — bordered section with label header ──────────────────────── */
function SectionCard({ label, children }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: 20,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 14px 9px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '0.875rem', fontWeight: 600,
          fontFamily: 'var(--font-display)', color: 'var(--black)',
        }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── CompactParamRow — single-line param with name/type/desc + control ──────── */
function CompactParamRow({ name, type, required, desc, control, values, selectedValue, onSelect, default: dflt, multiline }) {
  const hasPills = values && values.length > 0;
  const twoRow   = multiline || (hasPills && values.length > 4);

  const nameEl = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, minWidth: 0 }}>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', whiteSpace: 'nowrap' }}>
        {name}
      </code>
      {type && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--muted)', fontWeight: 400, whiteSpace: 'nowrap' }}>{type}</span>}
      {required && <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: '#e2001a', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.2)', borderRadius: 3, padding: '1px 4px', whiteSpace: 'nowrap' }}>req</span>}
      {desc && <span title={desc} style={{ fontSize: '0.75rem', color: 'var(--muted)', cursor: 'help', opacity: 0.45, userSelect: 'none', flexShrink: 0 }}>ⓘ</span>}
    </div>
  );

  const pillsEl = hasPills && (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {values.map(v => {
        const isActive  = selectedValue === v;
        const isDefault = !selectedValue && v === dflt;
        return (
          <button key={v} onClick={() => onSelect(v)} style={{
            fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontWeight: 500, cursor: 'pointer',
            border: `1px solid ${isActive ? '#e2001a' : isDefault ? 'var(--mid)' : 'var(--border)'}`,
            background: isActive ? 'rgba(226,0,26,0.08)' : isDefault ? 'var(--bg)' : 'transparent',
            color: isActive ? '#e2001a' : isDefault ? 'var(--black)' : 'var(--mid)',
            transition: 'all 0.12s',
          }}>{v}</button>
        );
      })}
    </div>
  );

  if (twoRow) {
    return (
      <div style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 8 }}>{nameEl}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasPills ? pillsEl : control}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '6px 12px',
      padding: '9px 14px', borderBottom: '1px solid var(--border)', minHeight: 38,
    }}>
      {nameEl}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 4, flexShrink: 1, minWidth: 0, maxWidth: '100%' }}>
        {hasPills ? pillsEl : control}
      </div>
    </div>
  );
}

/* ─── JSON tree viewer ───────────────────────────────────────────────────────── */
const JC = {
  key: '#7dd3fc', idx: '#64748b', str: '#4ade80',
  num: '#fb923c', bool: '#a78bfa', null: '#94a3b8',
  punct: '#475569', preview: '#475569',
};
function JVal({ v }) {
  if (v === null)             return <span style={{ color: JC.null }}>null</span>;
  if (typeof v === 'boolean') return <span style={{ color: JC.bool }}>{String(v)}</span>;
  if (typeof v === 'number')  return <span style={{ color: JC.num }}>{v}</span>;
  if (typeof v === 'string')  return <span style={{ color: JC.str }}>"{v}"</span>;
  return null;
}
function jPreview(d) {
  if (Array.isArray(d)) {
    if (!d.length) return '[]';
    const s = d.slice(0, 2).map(v => (v && typeof v === 'object' ? '{ … }' : JSON.stringify(v))).join(', ');
    return `[ ${s}${d.length > 2 ? ', …' : ''} ]`;
  }
  const ks = Object.keys(d);
  if (!ks.length) return '{}';
  const s = ks.slice(0, 3).map(k => {
    const v = d[k];
    return `${k}: ${v && typeof v === 'object' ? '{ … }' : JSON.stringify(v)}`;
  }).join(', ');
  return `{ ${s}${ks.length > 3 ? ', …' : ''} }`;
}
function JNode({ d, k, depth }) {
  const isObj = d !== null && typeof d === 'object';
  const isArr = Array.isArray(d);
  const mono  = { fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', lineHeight: 1.75 };
  if (!isObj) {
    return (
      <div style={{ ...mono, paddingLeft: depth * 14 }}>
        {k !== undefined && <>
          <span style={{ color: typeof k === 'number' ? JC.idx : JC.key }}>{k}</span>
          <span style={{ color: JC.punct }}>: </span>
        </>}
        <JVal v={d} />
      </div>
    );
  }
  const keys = isArr ? [...d.keys()] : Object.keys(d);
  const ob   = isArr ? '[' : '{';
  const cb   = isArr ? ']' : '}';
  const big  = keys.length > 8;
  /* Open depth 0–1 always; depth 2 if not big; deeper stays closed */
  const [open, setOpen] = useState(depth < 2 || (depth === 2 && !big));
  /* For large arrays that auto-open (depth 0–1), cap rendered items at 5 */
  const PREVIEW_MAX = 5;
  const truncate     = open && big && isArr && depth < 2;
  const visibleKeys  = truncate ? keys.slice(0, PREVIEW_MAX) : keys;
  const hiddenCount  = truncate ? keys.length - PREVIEW_MAX : 0;
  if (!keys.length) return (
    <div style={{ ...mono, paddingLeft: depth * 14 }}>
      {k !== undefined && <>
        <span style={{ color: typeof k === 'number' ? JC.idx : JC.key }}>{k}</span>
        <span style={{ color: JC.punct }}>: </span>
      </>}
      <span style={{ color: JC.punct }}>{ob}{cb}</span>
    </div>
  );
  return (
    <div style={mono}>
      <div onClick={() => setOpen(v => !v)} style={{ paddingLeft: depth * 14, display: 'flex', alignItems: 'baseline', gap: 5, cursor: 'pointer', userSelect: 'none' }}>
        <span style={{ color: JC.punct, fontSize: '0.5rem', flexShrink: 0, width: 10, lineHeight: 1 }}>{open ? '▼' : '▶'}</span>
        {k !== undefined && <>
          <span style={{ color: typeof k === 'number' ? JC.idx : JC.key }}>{k}</span>
          <span style={{ color: JC.punct }}>:</span>
        </>}
        {open ? <span style={{ color: JC.punct }}>{ob}</span> : <span style={{ color: JC.preview }}>{jPreview(d)}</span>}
        {!open && isArr && <span style={{ color: JC.idx, fontSize: '0.5625rem' }}>{keys.length}</span>}
      </div>
      {open && <>
        {visibleKeys.map(ck => <JNode key={ck} d={isArr ? d[ck] : d[ck]} k={isArr ? ck : ck} depth={depth + 1} />)}
        {hiddenCount > 0 && (
          <div style={{ paddingLeft: (depth + 1) * 14, color: JC.preview, fontSize: '0.5625rem', fontStyle: 'italic' }}>
            … {hiddenCount} more items
          </div>
        )}
        <div style={{ paddingLeft: depth * 14, color: JC.punct }}>{cb}</div>
      </>}
    </div>
  );
}
function JsonOut({ data }) {
  return (
    <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <JNode d={data} depth={0} />
    </div>
  );
}

/* ─── Traffic Live URL renderer ──────────────────────────────────────────────── */
function TrafficLiveUrl({ endpoint, sharedCenter, incVals, flowVals, tileVals, apiKey }) {
  const mono  = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.9 };
  const badge = (
    <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, marginRight: 8, background: 'rgba(125,211,252,0.12)', color: '#7dd3fc', fontSize: '0.5625rem', fontWeight: 800, letterSpacing: '0.08em' }}>GET</span>
  );

  const QParams = ({ qp }) => (
    <div style={{ paddingLeft: 52, marginTop: 4 }}>
      {qp.map((p, i) => (
        <div key={p.k} style={{ marginBottom: 1 }}>
          <span style={{ color: '#374151' }}>{i === 0 ? '?' : '&'}</span>
          <span style={{ color: '#94a3b8' }}>{p.k}</span>
          <span style={{ color: '#374151' }}>=</span>
          <span style={{ color: p.muted ? '#4b5563' : '#7dd3fc', wordBreak: 'break-all' }}>{p.v}</span>
        </div>
      ))}
    </div>
  );

  if (endpoint === 'incident-details') {
    const { lat, lon } = (() => {
      const [a, b] = (sharedCenter || '51.507,-0.128').trim().split(',').map(Number);
      return { lat: a || 51.507, lon: b || -0.128 };
    })();
    const bbox = bboxFromCenter(lat, lon, Number(incVals.radiusKm) || 8);
    const catLabel = incVals.categoryFilter
      ? (INCIDENT_CATEGORIES[Number(incVals.categoryFilter)]?.label || incVals.categoryFilter)
      : null;
    const qp = [
      { k: 'key',               v: '***', muted: true },
      { k: 'bbox',              v: bbox },
      { k: 'fields',            v: '{incidents{type,geometry,…}}' },
      { k: 'language',          v: incVals.language || 'en-GB' },
      { k: 'timeValidityFilter',v: incVals.timeValidity || 'present' },
      ...(catLabel ? [{ k: 'categoryFilter', v: `${incVals.categoryFilter} /* ${catLabel} */` }] : []),
    ];
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52, color: '#64748b' }}>/traffic/services/5/incidentDetails</div>
        <QParams qp={qp} />
      </div>
    );
  }

  if (endpoint === 'flow-segment') {
    const { lat, lon } = parseLatLon(sharedCenter);
    const qp = [
      { k: 'key',   v: '***', muted: true },
      { k: 'point', v: `${lat},${lon}` },
      { k: 'unit',  v: flowVals.unit || 'KMPH' },
    ];
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>/traffic/services/4/flowSegmentData/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{flowVals.style || 'relative-delay'}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{flowVals.zoom || '10'}</span>
          <span style={{ color: '#64748b' }}>/json</span>
        </div>
        <QParams qp={qp} />
      </div>
    );
  }

  /* Raster tile endpoints (v1) */
  if (endpoint === 'raster-flow-tile' || endpoint === 'raster-incident-tile') {
    const { lat, lon } = parseLatLon(sharedCenter || '51.507,-0.128');
    const z            = Number(tileVals.zoom) || 12;
    const { x, y }     = latLonToTile(lat || 51.507, lon || -0.128, z);
    const tileStyle    = endpoint === 'raster-flow-tile' ? (tileVals.flowStyle || 'relative') : (tileVals.incidentStyle || 's3');
    const tileType     = endpoint === 'raster-flow-tile' ? 'flow' : 'incidents';
    const qp = [
      { k: 'key',      v: '***', muted: true },
      { k: 'tileSize', v: tileVals.tileSize || '512' },
    ];
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>/traffic/map/4/tile/{tileType}/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{tileStyle}</span>
          <span style={{ color: '#64748b' }}>/{z}/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{x}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{y}</span>
          <span style={{ color: '#64748b' }}>.png</span>
        </div>
        <QParams qp={qp} />
      </div>
    );
  }

  /* v2 Extended vector tile endpoints */
  if (endpoint === 'ext-flow-tile' || endpoint === 'ext-incident-tile') {
    const { lat, lon } = parseLatLon(sharedCenter || '51.507,-0.128');
    const z            = Number(tileVals.zoom) || 12;
    const { x, y }     = latLonToTile(lat || 51.507, lon || -0.128, z);
    const isFlow       = endpoint === 'ext-flow-tile';
    const tileStyle    = isFlow ? (tileVals.flowStyle || 'relative') : (tileVals.incidentStyle || 's3');
    const tileType     = isFlow ? 'flow' : 'incidents';
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>/traffic/map/4/tile/{tileType}/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{tileStyle}</span>
          <span style={{ color: '#64748b' }}>/{z}/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{x}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{y}</span>
          <span style={{ color: '#a78bfa', fontWeight: 600 }}>.pbf</span>
        </div>
        <div style={{ paddingLeft: 52, marginTop: 4 }}>
          <div><span style={{ color: '#374151' }}>?</span><span style={{ color: '#94a3b8' }}>key</span><span style={{ color: '#374151' }}>=</span><span style={{ color: '#4b5563' }}>***</span></div>
        </div>
        <div style={{ marginTop: 10, padding: '7px 10px', borderRadius: 6, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)' }}>
          <div style={{ fontSize: '0.625rem', color: '#a78bfa', fontWeight: 600, marginBottom: 3, letterSpacing: '0.04em' }}>INTEGRATION NOTE</div>
          <div style={{ fontSize: '0.6875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            PBF vector tile — render with <span style={{ color: '#a78bfa', fontWeight: 600 }}>MapLibre GL JS</span> using a Traffic Orbis style.json from the Map Assets endpoint.
          </div>
        </div>
      </div>
    );
  }
}

/* ─── SDK loader ───────────────────────────────────────────────────────────── */
const SDK_JS  = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps-web.min.js';
const SDK_CSS = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css';

function loadSdk() {
  return new Promise((resolve, reject) => {
    if (window.tt) { resolve(window.tt); return; }
    if (!document.querySelector(`link[href="${SDK_CSS}"]`)) {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = SDK_CSS;
      document.head.appendChild(link);
    }
    if (!document.querySelector(`script[src="${SDK_JS}"]`)) {
      const script = document.createElement('script'); script.src = SDK_JS;
      script.onload = () => resolve(window.tt); script.onerror = reject;
      document.head.appendChild(script);
    } else {
      const iv = setInterval(() => { if (window.tt) { clearInterval(iv); resolve(window.tt); } }, 50);
    }
  });
}

function parseLatLon(str) {
  const [lat, lon] = (str || '').trim().split(',').map(Number);
  return { lat: lat || 0, lon: lon || 0 };
}

function latLonToTile(lat, lon, zoom) {
  const z    = Math.floor(zoom);
  const x    = Math.floor((lon + 180) / 360 * Math.pow(2, z));
  const latR = (lat * Math.PI) / 180;
  const y    = Math.floor((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2 * Math.pow(2, z));
  return { x, y, z };
}

/* ─── Point marker (flow query point) ─────────────────────────────────────── */
function pointMarkerEl(color = '#e2001a') {
  const el = document.createElement('div');
  el.style.cssText =
    `width:14px;height:14px;border-radius:50%;background:${color};` +
    'border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);';
  return el;
}

/* ─── Tile Grid — 3×3 stitched traffic tiles ─────────────────────────────────
 * Mirrors MapDisplayExplorer's TileGrid pattern.
 * No SDK required — tiles are fetched directly via <img>.
 * ───────────────────────────────────────────────────────────────────────────── */
const OFFSETS = [-1, 0, 1];
function TileGrid({ center, zoom, tileStyle, tileSize, endpoint, apiKey }) {
  const { lat, lon } = parseLatLon(center || '52.37,4.895');
  const z            = Math.max(0, Math.min(22, Number(zoom) || 12));
  const { x, y }     = latLonToTile(lat || 52.37, lon || 4.895, z);
  const key          = apiKey || DEMO_KEY;

  const tileUrl = (tx, ty) => {
    if (endpoint === 'raster-flow-tile') {
      const s = tileStyle || 'relative';
      return `https://api.tomtom.com/traffic/map/4/tile/flow/${s}/${z}/${tx}/${ty}.png?key=${key}&tileSize=${tileSize || 512}`;
    }
    /* raster-incident-tile */
    const s = tileStyle || 's3';
    return `https://api.tomtom.com/traffic/map/4/tile/incidents/${s}/${z}/${tx}/${ty}.png?key=${key}&tileSize=${tileSize || 512}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, borderRadius: 12, overflow: 'hidden', background: '#0d1117' }}>
      {OFFSETS.flatMap(dy =>
        OFFSETS.map(dx => {
          const tx       = x + dx;
          const ty       = y + dy;
          const isCenter = dx === 0 && dy === 0;
          return (
            <div key={`${dx},${dy}`} style={{ position: 'relative', aspectRatio: '1 / 1', background: '#1a2030', overflow: 'hidden' }}>
              <img src={tileUrl(tx, ty)} alt="" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              {isCenter && (
                <div style={{
                  position: 'absolute', bottom: 4, left: 4,
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  fontSize: '0.4375rem', padding: '2px 5px', borderRadius: 3,
                  fontFamily: 'var(--font-mono)', pointerEvents: 'none',
                }}>{z}/{tx}/{ty}</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── Traffic Map ─────────────────────────────────────────────────────────────
 * Traffic incidents and flow are rendered via style URL layers.
 * applyTraffic() uses two strategies:
 *   1. TomTom SDK convenience methods (showTrafficFlow / showTrafficIncidents)
 *   2. MapLibre setLayoutProperty fallback — scans every style layer and
 *      matches by layer ID / source name keywords ('flow' vs 'incident').
 * ───────────────────────────────────────────────────────────────────────────── */
function TrafficMap({ endpoint, vals, apiKey, isDark = false, showFlow = true, showIncidents = true, result = null, onMapClick }) {
  const containerRef      = useRef(null);
  const mapRef            = useRef(null);
  const markersRef        = useRef([]);
  const resultMarkersRef  = useRef([]);
  const resultLayersRef   = useRef([]);
  const resultPopupRef    = useRef(null);
  const appliedStyleRef   = useRef(null);
  const showFlowRef       = useRef(showFlow);
  const showIncidentsRef  = useRef(showIncidents);
  const endpointRef       = useRef(endpoint);
  const onMapClickRef     = useRef(onMapClick);
  const [redrawToken, setRedrawToken] = useState(0);

  /* Keep refs current so callbacks always read the latest value */
  useEffect(() => { showFlowRef.current      = showFlow; },     [showFlow]);
  useEffect(() => { showIncidentsRef.current = showIncidents; },[showIncidents]);
  useEffect(() => { endpointRef.current      = endpoint; },     [endpoint]);
  useEffect(() => { onMapClickRef.current    = onMapClick; },   [onMapClick]);

  /* ── Toggle traffic layers — two-strategy approach ── */
  const applyTraffic = useCallback((map) => {
    if (!map) return;
    const fl = showFlowRef.current;
    const il = showIncidentsRef.current;

    /* Strategy 1: TomTom SDK helpers (may or may not exist in v6) */
    try { map.showTrafficFlow(fl); }      catch (_) {}
    try { map.showTrafficIncidents(il); } catch (_) {}

    /* Strategy 2: Scan all style layers and toggle by keyword */
    try {
      (map.getStyle()?.layers ?? []).forEach(layer => {
        const key = (layer.id + ' ' + (layer.source ?? '')).toLowerCase();
        if (key.includes('flow')) {
          try { map.setLayoutProperty(layer.id, 'visibility', fl ? 'visible' : 'none'); } catch (_) {}
        } else if (key.includes('incident')) {
          try { map.setLayoutProperty(layer.id, 'visibility', il ? 'visible' : 'none'); } catch (_) {}
        }
      });
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Init map ── */
  useEffect(() => {
    let map;
    loadSdk().then(tt => {
      if (!containerRef.current || mapRef.current) return;
      const initLat = endpoint === 'flow-segment'
        ? parseLatLon(vals.point).lat || 52.37
        : parseLatLon(vals.center).lat || 52.37;
      const initLon = endpoint === 'flow-segment'
        ? parseLatLon(vals.point).lon || 4.895
        : parseLatLon(vals.center).lon || 4.895;
      map = tt.map({
        key: apiKey,
        container: containerRef.current,
        center: [initLon, initLat],
        zoom: 12,
        dragRotate: false,
        style: mapStyleUrl(apiKey, isDark),
      });
      /* Wait for idle (tiles painted) before toggling layers */
      map.once('idle', () => { if (mapRef.current) applyTraffic(mapRef.current); });
      appliedStyleRef.current = isDark;
      mapRef.current = map;

      /* Map click → update point + zoom in flow-segment mode */
      map.on('click', (e) => {
        if (endpointRef.current !== 'flow-segment') return;
        const { lng, lat } = e.lngLat;
        const zoom = Math.round(map.getZoom());
        onMapClickRef.current?.(`${lat.toFixed(6)},${lng.toFixed(6)}`, zoom);
      });
    }).catch(() => {});
    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  /* ── Switch style on theme toggle ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedStyleRef.current === isDark) return;
    appliedStyleRef.current = isDark;
    try {
      map.setStyle(mapStyleUrl(apiKey, isDark));
      map.once('idle', () => {
        if (!mapRef.current) return;
        applyTraffic(mapRef.current);
        setRedrawToken(t => t + 1);
      });
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  /* ── Live endpoint-driven layer toggle ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      applyTraffic(map);
    } else {
      map.once('idle', () => { if (mapRef.current) applyTraffic(mapRef.current); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFlow, showIncidents, applyTraffic]);

  /* ── Crosshair cursor in flow-segment mode ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    try { map.getCanvas().style.cursor = endpoint === 'flow-segment' ? 'crosshair' : ''; } catch (_) {}
  }, [endpoint]);

  /* ── Result-driven map visualisation ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const clearResultOverlays = () => {
      resultMarkersRef.current.forEach(m => m.remove());
      resultMarkersRef.current = [];
      resultLayersRef.current.forEach(id => {
        try { map.removeLayer(id); } catch (_) {}
        try { map.removeSource(id); } catch (_) {}
      });
      resultLayersRef.current = [];
      if (resultPopupRef.current) { try { resultPopupRef.current.remove(); } catch (_) {} resultPopupRef.current = null; }
    };

    const drawResults = () => {
      clearResultOverlays();
      if (!result) return;

      /* Incident markers */
      if (endpoint === 'incident-details') {
        const incidents = result?.incidents || [];
        incidents.forEach(inc => {
          const geom   = inc?.geometry;
          const coords = geom?.coordinates;
          if (!coords || !window.tt) return;
          let lng, lat;
          if (geom.type === 'Point') {
            [lng, lat] = coords;
          } else if (geom.type === 'LineString' && coords.length > 0) {
            const mid = Math.floor(coords.length / 2);
            [lng, lat] = coords[mid];
          } else { return; }

          const props  = inc?.properties || {};
          const cat    = Number(props.iconCategory ?? 0);
          const { color, label: catLabel } = catInfo(cat);
          const delay  = props.delay != null ? `${props.delay}s delay` : null;
          const mag    = props.magnitudeOfDelay;
          const magLabels = { 0: 'Unknown', 1: 'Minor', 2: 'Moderate', 3: 'Major', 4: 'Undefined' };
          const road   = props.roadNumbers?.[0] || '';
          const from   = props.from || '';
          const to     = props.to || '';
          const length = props.length != null ? `${props.length}m` : null;

          /* Popup HTML */
          const rows = [
            from && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">From <span style="color:#e2e8f0">${from}</span></div>`,
            to   && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">To <span style="color:#e2e8f0">${to}</span></div>`,
            road && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Road <span style="color:#e2e8f0">${road}</span></div>`,
            delay  && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Delay <span style="color:#f97316">${delay}</span></div>`,
            length && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Length <span style="color:#e2e8f0">${length}</span></div>`,
            mag != null && `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:6px">Magnitude <span style="color:#e2e8f0">${magLabels[mag] || mag}</span></div>`,
          ].filter(Boolean).join('');

          /* Compact JSON section */
          const jsonStr = JSON.stringify(props, null, 2)
            .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

          const popupHtml = `
            <div style="font-family:var(--font-mono,monospace);min-width:200px;max-width:280px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
                <span style="font-weight:700;font-size:0.75rem;color:#f1f5f9">${catLabel}</span>
              </div>
              ${rows}
              <details style="margin-top:4px">
                <summary style="font-size:0.5625rem;color:#64748b;cursor:pointer;user-select:none;padding:2px 0">JSON properties</summary>
                <pre style="font-size:0.5rem;color:#7dd3fc;margin:4px 0 0;overflow:auto;max-height:160px;line-height:1.6;white-space:pre-wrap">${jsonStr}</pre>
              </details>
            </div>`;

          const popup = new window.tt.Popup({
            offset: 12,
            closeButton: true,
            closeOnClick: false,
            className: 'tt-incident-popup',
          }).setHTML(popupHtml);

          const el = document.createElement('div');
          el.style.cssText = `width:10px;height:10px;border-radius:50%;background:${color};` +
            'border:1.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.45);cursor:pointer;';

          const marker = new window.tt.Marker({ element: el, anchor: 'center' })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);
          resultMarkersRef.current.push(marker);
        });

        /* Auto-open a random marker near the viewport centre */
        const markers = resultMarkersRef.current;
        if (markers.length > 0) {
          setTimeout(() => {
            try {
              const bounds  = map.getBounds();
              const visible = markers.filter(m => bounds.contains(m.getLngLat()));
              const pool    = visible.length > 0 ? visible : markers;
              const pick    = pool[Math.floor(Math.random() * pool.length)];
              pick.togglePopup();
              map.panTo(pick.getLngLat(), { duration: 500 });
            } catch (_) {}
          }, 600);
        }
      }

      /* Flow segment line */
      if (endpoint === 'flow-segment') {
        const seg = result?.flowSegmentData;
        if (!seg?.coordinates?.coordinate) return;
        const coords = seg.coordinates.coordinate.map(c => [c.longitude, c.latitude]);
        if (coords.length < 2) return;
        const ratio = seg.freeFlowSpeed ? seg.currentSpeed / seg.freeFlowSpeed : 1;
        const color = ratio >= 0.75 ? '#22c55e' : ratio >= 0.45 ? '#f59e0b' : '#ef4444';
        const srcId = 'tt-flow-seg-src';
        const lyrId = 'tt-flow-seg-lyr';
        try {
          if (map.getSource(srcId)) { map.removeLayer(lyrId); map.removeSource(srcId); }
          map.addSource(srcId, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } });
          map.addLayer({ id: lyrId, type: 'line', source: srcId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': color, 'line-width': 5, 'line-opacity': 0.9 },
          });
          resultLayersRef.current.push(lyrId, srcId);

          /* Fit bounds to the segment */
          const lons = coords.map(c => c[0]);
          const lats = coords.map(c => c[1]);
          try {
            map.fitBounds(
              [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
              { padding: 80, maxZoom: 16, speed: 1.2 }
            );
          } catch (_) {}

          /* Popup at segment midpoint */
          if (window.tt) {
            const mid      = coords[Math.floor(coords.length / 2)];
            const popupLng = mid[0], popupLat = mid[1];
            const ratio    = seg.freeFlowSpeed ? seg.currentSpeed / seg.freeFlowSpeed : 1;
            const pct      = (ratio * 100).toFixed(0);
            const lineClr  = color; // already computed above
            const unit     = seg.currentSpeedUnit || 'km/h';
            const jsonStr  = JSON.stringify(seg, null, 2)
              .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            const popupHtml = `
              <div style="font-family:var(--font-mono,monospace);min-width:200px;max-width:280px">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                  <span style="display:inline-block;width:24px;height:4px;border-radius:2px;background:${lineClr};flex-shrink:0"></span>
                  <span style="font-weight:700;font-size:0.75rem;color:#f1f5f9">Flow Segment</span>
                </div>
                <div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Current speed <span style="color:${lineClr};font-weight:700">${seg.currentSpeed} ${unit}</span></div>
                <div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Free-flow <span style="color:#e2e8f0">${seg.freeFlowSpeed} ${unit}</span></div>
                <div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Flow ratio <span style="color:${lineClr};font-weight:700">${pct}%</span></div>
                ${seg.confidence != null ? `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:2px">Confidence <span style="color:#e2e8f0">${(seg.confidence*100).toFixed(0)}%</span></div>` : ''}
                ${seg.frc ? `<div style="color:#94a3b8;font-size:0.625rem;margin-bottom:6px">Road class <span style="color:#e2e8f0">${seg.frc}</span></div>` : ''}
                <details style="margin-top:4px">
                  <summary style="font-size:0.5625rem;color:#64748b;cursor:pointer;user-select:none;padding:2px 0">JSON response</summary>
                  <pre style="font-size:0.5rem;color:#7dd3fc;margin:4px 0 0;overflow:auto;max-height:160px;line-height:1.6;white-space:pre-wrap">${jsonStr}</pre>
                </details>
              </div>`;
            try {
              const popup = new window.tt.Popup({ offset: 12, closeButton: true, closeOnClick: false, className: 'tt-incident-popup' })
                .setHTML(popupHtml).setLngLat([popupLng, popupLat]).addTo(map);
              resultPopupRef.current = popup;
            } catch (_) {}
          }
        } catch (_) {}
      }
    };

    if (map.isStyleLoaded()) { drawResults(); }
    else { map.once('idle', drawResults); }

    return clearResultOverlays;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, endpoint, redrawToken]);

  /* ── Resize on container change ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { if (mapRef.current) mapRef.current.resize(); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Focus viewport on the current query location ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const focus = () => {
      /* Clear previous markers */
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      if (endpoint === 'incident-details') {
        const [a, b] = (vals.center || '52.37,4.895').trim().split(',').map(Number);
        const lat    = a || 52.37;
        const lon    = b || 4.895;
        try { map.flyTo({ center: [lon, lat], zoom: 12, speed: 1.2 }); } catch {}

      } else if (endpoint === 'flow-segment') {
        const { lat, lon } = parseLatLon(vals.point);
        if (lat && lon) {
          try { map.flyTo({ center: [lon, lat], zoom: 13, speed: 1.2 }); } catch {}
        }
      } else if (endpoint === 'raster-flow-tile' || endpoint === 'raster-incident-tile') {
        const { lat, lon } = parseLatLon(vals.tileCenter);
        if (lat && lon) {
          try { map.flyTo({ center: [lon, lat], zoom: Number(vals.tileZoom) || 12, speed: 1.2 }); } catch {}
        }
      }
    };

    if (map.isStyleLoaded()) {
      focus();
    } else {
      map.once('idle', focus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, vals.center, vals.point, vals.radiusKm, vals.tileCenter, vals.tileZoom, redrawToken]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <span style={{
        position: 'absolute', bottom: 6, left: 8, zIndex: 2,
        fontSize: '0.5rem', background: 'rgba(0,0,0,0.45)', color: '#fff',
        padding: '2px 5px', borderRadius: 3, pointerEvents: 'none',
        fontFamily: 'var(--font-mono)',
      }}>Maps Web SDK v6</span>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function TrafficExplorer({ onNavigate, isDark = false }) {
  const [apiKey,   setApiKey]   = useState(() => localStorage.getItem(LS_KEY) || DEMO_KEY);
  const [tab,      setTab]      = useState('v1');
  const [endpoint, setEndpoint] = useState('incident-details');
  const [status,   setStatus]   = useState('idle');
  const [result,   setResult]   = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [elapsed,  setElapsed]  = useState(null);
  const [copied,   setCopied]   = useState(false);
  const copyTimer  = useRef(null);

  /* Reset endpoint when tab changes */
  useEffect(() => {
    setEndpoint(tab === 'v1' ? 'incident-details' : 'ext-incident-tile');
    setResult(null);
    setStatus('idle');
  }, [tab]);

  /* Traffic layers derived from selected endpoint */
  const showFlow      = endpoint === 'flow-segment'       || endpoint === 'raster-flow-tile'    || endpoint === 'ext-flow-tile';
  const showIncidents = endpoint === 'incident-details'   || endpoint === 'raster-incident-tile' || endpoint === 'ext-incident-tile';

  /* ── Map resize ── */
  const [mapHeight, setMapHeight] = useState(360);
  const mapHeightRef = useRef(360);
  useEffect(() => { mapHeightRef.current = mapHeight; }, [mapHeight]);

  const startMapDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = mapHeightRef.current;
    const onMove = (ev) => {
      const maxH = Math.round(window.innerHeight * 0.92);
      const newH = Math.max(0, Math.min(maxH, startH + (ev.clientY - startY)));
      mapHeightRef.current = newH;
      setMapHeight(newH);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  /* ── Shared location — persists across all endpoint switches ── */
  const [sharedCenter, setSharedCenter] = useState('51.507,-0.128');

  /* ── Incidents params ── */
  const [incVals, setIncVals] = useState({
    radiusKm:       '8',
    categoryFilter: '',
    timeValidity:   'present',
    language:       'en-GB',
  });

  /* ── Flow Segment params ── */
  const [flowVals, setFlowVals] = useState({
    style: 'relative-delay',
    zoom:  '10',
    unit:  'KMPH',
  });

  /* ── Tile params (shared for raster-flow-tile + raster-incident-tile) ── */
  const [tileVals, setTileVals] = useState({
    zoom:         '12',
    tileSize:     '512',
    flowStyle:    'relative',
    incidentStyle:'s3',
  });

  /* ── Build URL ── */
  const buildUrl = useCallback(() => {
    const key = apiKey || DEMO_KEY;
    const { lat: cLat, lon: cLon } = (() => {
      const [a, b] = (sharedCenter || '51.507,-0.128').trim().split(',').map(Number);
      return { lat: a || 51.507, lon: b || -0.128 };
    })();

    if (endpoint === 'incident-details') {
      const bbox = bboxFromCenter(cLat, cLon, Number(incVals.radiusKm) || 8);
      let url = `https://api.tomtom.com/traffic/services/5/incidentDetails` +
        `?key=${key}` +
        `&bbox=${bbox}` +
        `&fields=${encodeURIComponent(INCIDENTS_FIELDS)}` +
        `&language=${incVals.language || 'en-GB'}` +
        `&timeValidityFilter=${incVals.timeValidity || 'present'}`;
      if (incVals.categoryFilter) url += `&categoryFilter=${incVals.categoryFilter}`;
      return url;
    }
    if (endpoint === 'flow-segment') {
      return (
        `https://api.tomtom.com/traffic/services/4/flowSegmentData` +
        `/${flowVals.style || 'relative-delay'}/${flowVals.zoom || '10'}/json` +
        `?key=${key}` +
        `&point=${cLat},${cLon}` +
        `&unit=${flowVals.unit || 'KMPH'}`
      );
    }
    /* Tile endpoints */
    const z        = Number(tileVals.zoom) || 12;
    const { x, y } = latLonToTile(cLat, cLon, z);
    if (endpoint === 'raster-flow-tile') {
      return `https://api.tomtom.com/traffic/map/4/tile/flow/${tileVals.flowStyle || 'relative'}/${z}/${x}/${y}.png?key=${key}&tileSize=${tileVals.tileSize || 512}`;
    }
    return `https://api.tomtom.com/traffic/map/4/tile/incidents/${tileVals.incidentStyle || 's3'}/${z}/${x}/${y}.png?key=${key}&tileSize=${tileVals.tileSize || 512}`;
  }, [endpoint, sharedCenter, incVals, flowVals, tileVals, apiKey]);

  const currentUrl = buildUrl();

  /* ── Run request ── */
  const handleRun = useCallback(async () => {
    const t0 = performance.now();
    setStatus('loading');
    setElapsed(null);
    setResult(null);
    setErrorMsg('');
    try {
      const res  = await fetch(currentUrl);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.detailedError?.message || json?.message || `HTTP ${res.status}`);
      setResult(json);
      setElapsed(Math.round(performance.now() - t0));
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setElapsed(null);
      setStatus('error');
    }
  }, [currentUrl]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`curl "${currentUrl}"`).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Summary strip ── */
  const summaryItems = (() => {
    if (!result || status !== 'success') return null;
    if (endpoint === 'incident-details') {
      const incidents = result?.incidents || [];
      const counts = {};
      incidents.forEach(inc => {
        const cat = Number(inc?.properties?.iconCategory ?? 0);
        counts[cat] = (counts[cat] || 0) + 1;
      });
      const topCats = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      return [
        { label: 'Incidents', value: incidents.length },
        ...topCats.map(([cat, n]) => ({ label: catInfo(cat).label, value: n })),
      ];
    }
    if (endpoint === 'flow-segment') {
      const seg = result?.flowSegmentData;
      if (!seg) return null;
      const ratio = seg.freeFlowSpeed ? ((seg.currentSpeed / seg.freeFlowSpeed) * 100).toFixed(0) : '—';
      return [
        { label: 'Current Speed', value: `${seg.currentSpeed} ${seg.currentSpeedUnit || 'km/h'}` },
        { label: 'Free Flow',     value: `${seg.freeFlowSpeed} ${seg.currentSpeedUnit || 'km/h'}` },
        { label: 'Flow %',        value: `${ratio}%` },
        { label: 'Confidence',    value: seg.confidence != null ? `${(seg.confidence * 100).toFixed(0)}%` : '—' },
      ];
    }
    return null;
  })();


  /* ── Api key persistence ── */
  useEffect(() => {
    if (apiKey && apiKey !== DEMO_KEY) localStorage.setItem(LS_KEY, apiKey);
  }, [apiKey]);

  /* ── Auto-run for flow segment + incident details ────────────────────────────
   * handleRunRef always points to the latest handleRun (latest currentUrl).
   * flowRunTick / incRunTick increment on endpoint switches (and map clicks for
   * flow). incident-details also fires once on initial mount.
   * ────────────────────────────────────────────────────────────────────────── */
  const handleRunRef = useRef(handleRun);
  useEffect(() => { handleRunRef.current = handleRun; }, [handleRun]);

  const [flowRunTick, setFlowRunTick] = useState(0);
  const [incRunTick,  setIncRunTick]  = useState(0);
  const prevEndpointRef = useRef(endpoint);
  useEffect(() => {
    if (endpoint === 'flow-segment' && prevEndpointRef.current !== 'flow-segment') {
      setFlowRunTick(t => t + 1);
    }
    if (endpoint === 'incident-details' && prevEndpointRef.current !== 'incident-details') {
      setIncRunTick(t => t + 1);
    }
    prevEndpointRef.current = endpoint;
  }, [endpoint]);

  useEffect(() => {
    if (flowRunTick === 0 || endpoint !== 'flow-segment') return;
    handleRunRef.current();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowRunTick]);

  useEffect(() => {
    if (incRunTick === 0 || endpoint !== 'incident-details') return;
    handleRunRef.current();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incRunTick]);

  /* Initial auto-fire — incident-details is the default endpoint */
  useEffect(() => {
    handleRunRef.current();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapClick = useCallback((newCenter, zoom) => {
    if (endpoint !== 'flow-segment') return;
    setSharedCenter(newCenter);
    if (zoom != null) setFlowVals(v => ({ ...v, zoom: String(zoom) }));
    setFlowRunTick(t => t + 1);
  }, [endpoint]);

  /* ── Endpoint card configs ── */
  const EP_CARDS_V1 = [
    {
      value: 'incident-details',
      label: 'Incident Details',
      thumb: ThumbTrafficIncidents,
      method: 'GET',
      desc: 'Retrieve traffic incidents inside a bounding box with category, location, and delay data.',
    },
    {
      value: 'flow-segment',
      label: 'Flow Segment Data',
      thumb: ThumbTrafficFlow,
      method: 'GET',
      desc: 'Get current and free-flow speeds for the road segment closest to a given coordinate.',
    },
    {
      value: 'raster-flow-tile',
      label: 'Raster Flow Tiles',
      thumb: ThumbTrafficFlowTile,
      method: 'GET',
      desc: 'PNG map tiles colour-coded by current traffic speed for overlay on raster maps.',
    },
    {
      value: 'raster-incident-tile',
      label: 'Raster Incident Tiles',
      thumb: ThumbTrafficIncidentTile,
      method: 'GET',
      desc: 'Raster tiles showing traffic incident pins and severity overlays for visual integration.',
    },
  ];

  const EP_CARDS_V2 = [
    {
      value: 'ext-incident-tile',
      label: 'Extended Incident Tiles',
      thumb: ThumbTrafficIncidentTile,
      method: 'GET',
      desc: 'Vector PBF incident tiles with richer geometry and extended properties for client-side styling.',
    },
    {
      value: 'ext-flow-tile',
      label: 'Extended Flow Tiles',
      thumb: ThumbTrafficFlowTile,
      method: 'GET',
      desc: 'Vector PBF flow tiles with per-segment speed data and additional flow attributes.',
    },
  ];

  const EP_CARDS = tab === 'v1' ? EP_CARDS_V1 : EP_CARDS_V2;

  return (
    <div className="page page--wide" style={{ '--map-h': `${mapHeight}px` }}>

      {/* ── Full-bleed sticky map ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 'var(--app-top-offset)', zIndex: 5,
        marginTop: -32, marginLeft: -40, marginRight: -40,
        marginBottom: 32,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      }}>
        <div style={{ height: mapHeight, overflow: 'hidden', position: 'relative' }}>
          <TrafficMap
            endpoint={endpoint}
            vals={{
              center:     sharedCenter,
              point:      sharedCenter,
              radiusKm:   incVals.radiusKm,
              tileCenter: sharedCenter,
              tileZoom:   tileVals.zoom,
            }}
            apiKey={apiKey}
            isDark={isDark}
            showFlow={showFlow}
            showIncidents={showIncidents}
            result={status === 'success' ? result : null}
            onMapClick={handleMapClick}
          />
          {/* v2 Orbis overlay */}
          {tab === 'v2' && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              paddingBottom: 20, pointerEvents: 'none',
              background: 'rgba(13,17,23,0.45)',
            }}>
              <div style={{
                background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.28)',
                borderRadius: 10, padding: '9px 20px', textAlign: 'center',
                backdropFilter: 'blur(6px)',
              }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em', marginBottom: 3 }}>
                  V2 PUBLIC PREVIEW — ORBIS ACCESS REQUIRED
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Extended Flow &amp; Incident Tiles are vector PBF — rendered via MapLibre GL JS with Orbis access.
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="map-resize-handle" onMouseDown={startMapDrag} title="Drag to resize map">
          <div className="map-resize-handle__grip" />
        </div>
      </div>

      {/* ── Two-column grid ───────────────────────────────────────────────────── */}
      <div className="api-ref-sections">
        <div className="api-ref-section api-ref-section--explorer" id="traffic-explorer" style={{ gridTemplateRows: 'auto' }}>

          {/* ── LEFT: page header + endpoint cards + params ─────────────────── */}
          <div
            className="api-ref-section-left"
            style={{ '--pg-sticky-top': 'calc(var(--app-top-offset) + var(--map-h, 360px) + 20px)' }}
          >
            {/* Page header lives inside the left column */}
            <div className="page-header page-header--with-tabs" style={{ marginBottom: tab !== 'v1' ? 12 : 24 }}>
              <h1>API Explorer</h1>
              <PageActions />
              <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
            </div>

            {/* ── v2 API key note ── */}
            {tab === 'v2' && (
              <div style={{
                marginBottom: 20, padding: '8px 12px', borderRadius: 8,
                background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '0.75rem', flexShrink: 0, marginTop: 1 }}>🔑</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>Orbis access required</span> — v2 endpoints are Public Preview.
                  The demo key only covers v1 Production. Enter a key with Orbis access to use these endpoints.
                </span>
              </div>
            )}

            {/* ── Grouped endpoint layout ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {(tab === 'v1' ? [
                { groupThumb: ThumbTrafficIncidents, groupLabel: 'Incidents', epIds: ['incident-details', 'raster-incident-tile'] },
                { groupThumb: ThumbTrafficFlow,      groupLabel: 'Flow',      epIds: ['flow-segment', 'raster-flow-tile'] },
              ] : [
                { groupThumb: ThumbTrafficIncidentTile, groupLabel: 'Incidents', epIds: ['ext-incident-tile'] },
                { groupThumb: ThumbTrafficFlowTile,     groupLabel: 'Flow',      epIds: ['ext-flow-tile'] },
              ]).map(({ groupThumb: GroupThumb, groupLabel, epIds }) => (
                <div key={groupLabel} style={{
                  display: 'flex',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: 'var(--s1)',
                }}>
                  {/* Left — category thumbnail */}
                  <div style={{
                    width: 80, flexShrink: 0,
                    borderRight: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                      <GroupThumb />
                    </div>
                  </div>
                  {/* Right — endpoint cells inside the container */}
                  {epIds.map((epId, i) => {
                    const ep = EP_CARDS.find(e => e.value === epId);
                    if (!ep) return null;
                    const active = endpoint === ep.value;
                    return (
                      <div
                        key={ep.value}
                        role="button"
                        tabIndex={0}
                        onClick={() => { setEndpoint(ep.value); setResult(null); setStatus('idle'); }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setEndpoint(ep.value); setResult(null); setStatus('idle');
                          }
                        }}
                        style={{
                          flex: 1, textAlign: 'left', cursor: 'pointer',
                          borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                          background: active ? 'rgba(226,0,26,0.03)' : 'transparent',
                          boxShadow: active ? 'inset 3px 0 0 #e2001a' : 'none',
                          transition: 'background 0.15s, box-shadow 0.15s',
                          outline: 'none',
                          padding: '8px 12px 10px',
                        }}
                      >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{
                              fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.07em',
                              fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 3,
                              background: 'rgba(125,211,252,0.10)', color: '#7dd3fc',
                            }}>{ep.method}</span>
                            {active && (
                              <span style={{
                                fontSize: '0.4375rem', fontWeight: 700, letterSpacing: '0.1em',
                                color: '#e2001a', textTransform: 'uppercase',
                              }}>● active</span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '0.8125rem', fontWeight: 700, marginBottom: 2,
                            color: active ? 'var(--black)' : 'var(--mid)',
                            fontFamily: 'var(--font-display)', lineHeight: 1.2,
                          }}>{ep.label}</div>
                          <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                            {ep.desc}
                          </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Shared location — always visible ── */}
            <SectionCard label="Location">
              <CompactParamRow name="center" type="string" required
                desc="Lat,lon used for all endpoints. Shared across endpoint switches so you can compare the same area."
                control={
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={sharedCenter}
                      onChange={e => setSharedCenter(e.target.value)} placeholder="51.507,-0.128" />
                    <select style={{ ...selectStyle, width: 'auto' }} value=""
                      onChange={e => { const p = CITY_PRESETS.find(c => c.label === e.target.value); if (p) setSharedCenter(`${p.lat},${p.lon}`); }}>
                      <option value="" disabled>City preset</option>
                      {CITY_PRESETS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>
                }
              />
            </SectionCard>

            {/* ── Incident Details params ── */}
            {endpoint === 'incident-details' && (
              <>
                <SectionCard label="Search area">
                  <CompactParamRow name="radius" type="number"
                    desc="Search radius in km around the center. Converted to a bounding box."
                    control={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input style={numStyle} type="number" min="1" max="50" value={incVals.radiusKm}
                          onChange={e => setIncVals(v => ({ ...v, radiusKm: e.target.value }))} />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>km</span>
                      </div>
                    }
                  />
                </SectionCard>

                <SectionCard label="Filters">
                  <CompactParamRow name="categoryFilter" type="string"
                    desc="Filter by incident category. Leave empty to return all categories."
                    multiline
                    control={
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {[{ id: '', label: 'All' }, ...Object.entries(INCIDENT_CATEGORIES).map(([id, { label }]) => ({ id, label }))].map(({ id, label }) => {
                          const isActive = incVals.categoryFilter === id;
                          return (
                            <button key={id || 'all'} onClick={() => setIncVals(v => ({ ...v, categoryFilter: id }))} style={{
                              fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4,
                              fontFamily: 'var(--font-mono)', fontWeight: 500, cursor: 'pointer',
                              border: `1px solid ${isActive ? '#e2001a' : 'var(--border)'}`,
                              background: isActive ? 'rgba(226,0,26,0.08)' : 'transparent',
                              color: isActive ? '#e2001a' : 'var(--mid)',
                              transition: 'all 0.12s',
                            }}>{label}</button>
                          );
                        })}
                      </div>
                    }
                  />
                  <CompactParamRow name="timeValidityFilter" type="string"
                    desc="Return present incidents, future planned events, or both."
                    values={['present', 'future', 'present,future']}
                    selectedValue={incVals.timeValidity}
                    onSelect={v => setIncVals(prev => ({ ...prev, timeValidity: v }))}
                  />
                  <CompactParamRow name="language" type="string"
                    desc="Language for incident description text (IETF language tag)."
                    control={
                      <select style={selectStyle} value={incVals.language}
                        onChange={e => setIncVals(v => ({ ...v, language: e.target.value }))}>
                        {['en-GB','en-US','de-DE','fr-FR','nl-NL','es-ES','it-IT','pt-PT','pl-PL'].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    }
                  />
                </SectionCard>
              </>
            )}

            {/* ── Flow Segment params ── */}
            {endpoint === 'flow-segment' && (
              <>
                <SectionCard label="Options">
                  <CompactParamRow name="style" type="string"
                    desc="Flow style. Determines how speed is expressed relative to free-flow speed."
                    values={['absolute','relative','relative0','relative0-dark','relative-delay','reduced-sensitivity']}
                    selectedValue={flowVals.style}
                    onSelect={v => setFlowVals(prev => ({ ...prev, style: v }))}
                    multiline
                  />
                  <CompactParamRow name="zoom" type="integer"
                    desc="Zoom level (1–22). Affects the road segment resolution returned."
                    control={
                      <input style={numStyle} type="number" min="1" max="22" value={flowVals.zoom}
                        onChange={e => setFlowVals(v => ({ ...v, zoom: e.target.value }))} />
                    }
                  />
                  <CompactParamRow name="unit" type="string"
                    desc="Speed unit in the response."
                    values={['KMPH', 'MPH']}
                    selectedValue={flowVals.unit}
                    onSelect={v => setFlowVals(prev => ({ ...prev, unit: v }))}
                  />
                </SectionCard>
              </>
            )}
            {/* ── Raster Flow Tile params ── */}
            {endpoint === 'raster-flow-tile' && (
              <>
                <SectionCard label="Zoom">
                  <CompactParamRow name="zoom" type="integer"
                    desc="Tile zoom level (0–22). Higher = more detail."
                    control={<input style={numStyle} type="number" min="0" max="22" value={tileVals.zoom} onChange={e => setTileVals(v => ({ ...v, zoom: e.target.value }))} />}
                  />
                </SectionCard>
                <SectionCard label="Style">
                  <CompactParamRow name="style" type="string"
                    desc="Flow colour style for the tile."
                    values={['absolute','relative','relative0','relative0-dark','relative-delay','reduced-sensitivity']}
                    selectedValue={tileVals.flowStyle}
                    onSelect={v => setTileVals(prev => ({ ...prev, flowStyle: v }))}
                    multiline
                  />
                  <CompactParamRow name="tileSize" type="integer"
                    desc="Tile pixel dimensions."
                    values={['256', '512']}
                    selectedValue={tileVals.tileSize}
                    onSelect={v => setTileVals(prev => ({ ...prev, tileSize: v }))}
                  />
                </SectionCard>
              </>
            )}

            {/* ── Raster Incident Tile params ── */}
            {endpoint === 'raster-incident-tile' && (
              <>
                <SectionCard label="Zoom">
                  <CompactParamRow name="zoom" type="integer"
                    desc="Tile zoom level (0–22)."
                    control={<input style={numStyle} type="number" min="0" max="22" value={tileVals.zoom} onChange={e => setTileVals(v => ({ ...v, zoom: e.target.value }))} />}
                  />
                </SectionCard>
                <SectionCard label="Style">
                  <CompactParamRow name="style" type="string"
                    desc="Incident tile style variant."
                    values={['s0','s1','s2','s3','night']}
                    selectedValue={tileVals.incidentStyle}
                    onSelect={v => setTileVals(prev => ({ ...prev, incidentStyle: v }))}
                  />
                  <CompactParamRow name="tileSize" type="integer"
                    desc="Tile pixel dimensions."
                    values={['256', '512']}
                    selectedValue={tileVals.tileSize}
                    onSelect={v => setTileVals(prev => ({ ...prev, tileSize: v }))}
                  />
                </SectionCard>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════════════
             * v2 PARAMS
             * ══════════════════════════════════════════════════════════════════ */}

            {/* ── v2 Extended Incident Tiles params ── */}
            {endpoint === 'ext-incident-tile' && (
              <>
                <SectionCard label="Tile">
                  <CompactParamRow name="zoom" type="integer"
                    desc="Tile zoom level (0–22). Higher zoom = more granular incident geometry."
                    control={<input style={numStyle} type="number" min="0" max="22" value={tileVals.zoom} onChange={e => setTileVals(v => ({ ...v, zoom: e.target.value }))} />}
                  />
                  <CompactParamRow name="style" type="string"
                    desc="Incident tile style variant."
                    values={['s0','s1','s2','s3','night']}
                    selectedValue={tileVals.incidentStyle}
                    onSelect={v => setTileVals(prev => ({ ...prev, incidentStyle: v }))}
                  />
                </SectionCard>
                <SectionCard label="Vector Format">
                  <div style={{ padding: '10px 14px 12px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Extended Incident Tiles return <span style={{ color: '#a78bfa', fontWeight: 600 }}>PBF (Protocol Buffer Format)</span> vector data.
                      Each tile contains incident geometry and properties for client-side rendering with custom styles.
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Compared to raster tiles, vector tiles support <span style={{ color: 'var(--black)', fontWeight: 600 }}>dynamic styling</span>,
                      interactive feature querying, and smooth zoom transitions in a MapLibre GL JS renderer.
                    </p>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── v2 Extended Flow Tiles params ── */}
            {endpoint === 'ext-flow-tile' && (
              <>
                <SectionCard label="Tile">
                  <CompactParamRow name="zoom" type="integer"
                    desc="Tile zoom level (0–22)."
                    control={<input style={numStyle} type="number" min="0" max="22" value={tileVals.zoom} onChange={e => setTileVals(v => ({ ...v, zoom: e.target.value }))} />}
                  />
                  <CompactParamRow name="style" type="string"
                    desc="Flow colour style. Determines how speed is expressed relative to free-flow speed."
                    values={['absolute','relative','relative0','relative-delay','reduced-sensitivity']}
                    selectedValue={tileVals.flowStyle}
                    onSelect={v => setTileVals(prev => ({ ...prev, flowStyle: v }))}
                    multiline
                  />
                </SectionCard>
                <SectionCard label="Vector Format">
                  <div style={{ padding: '10px 14px 12px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Extended Flow Tiles return <span style={{ color: '#a78bfa', fontWeight: 600 }}>PBF vector data</span> with
                      per-segment speed, free-flow speed, and road class attributes — enabling data-driven styling
                      of flow colour, line width, and opacity in a MapLibre GL JS renderer.
                    </p>
                  </div>
                </SectionCard>
              </>
            )}
          </div>

          {/* ── RIGHT: request panel + response ─────────────────────────────── */}
          <div className="api-ref-section-right">
            <div className="api-ref-section-code re-code">

              {/* ── CODE PANEL ── */}
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: '#0d1117' }}>

                {/* Panel header */}
                <div style={{
                  padding: '7px 14px', background: '#161b22',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.5625rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Request
                    </span>
                    <span style={{
                      fontSize: '0.5625rem', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                      padding: '1px 7px', borderRadius: 4,
                      background: tab === 'v2' ? 'rgba(167,139,250,0.12)' : ['incident-details','raster-incident-tile'].includes(endpoint) ? 'rgba(125,211,252,0.12)' : 'rgba(167,139,250,0.12)',
                      color:      tab === 'v2' ? '#a78bfa' : ['incident-details','raster-incident-tile'].includes(endpoint) ? '#7dd3fc' : '#a78bfa',
                      border: `1px solid ${tab === 'v2' ? 'rgba(167,139,250,0.2)' : ['incident-details','raster-incident-tile'].includes(endpoint) ? 'rgba(125,211,252,0.2)' : 'rgba(167,139,250,0.2)'}`,
                    }}>
                      {[...EP_CARDS_V1, ...EP_CARDS_V2].find(e => e.value === endpoint)?.label || endpoint}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={handleCopy} style={{
                      fontSize: '0.625rem', color: copied ? '#22c55e' : '#94a3b8',
                      background: 'transparent', border: '1px solid',
                      borderColor: copied ? '#22c55e44' : 'rgba(255,255,255,0.1)',
                      borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}>
                      {copied ? '✓ Copied' : 'Copy cURL'}
                    </button>
                  </div>
                </div>

                <TrafficLiveUrl endpoint={endpoint} sharedCenter={sharedCenter} incVals={incVals} flowVals={flowVals} tileVals={tileVals} apiKey={apiKey} />

                {/* Run bar */}
                <div style={{
                  padding: '8px 14px', background: '#0d1117',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {apiKey === DEMO_KEY ? '🔑 demo key' : '🔑 your key'}
                  </span>
                  {endpoint === 'raster-flow-tile' || endpoint === 'raster-incident-tile' ? (
                    <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                      Tiles update automatically ↑
                    </span>
                  ) : (
                    <button onClick={handleRun} disabled={status === 'loading'} style={{
                      padding: '6px 18px', borderRadius: 7, border: 'none',
                      background: status === 'loading' ? '#1e293b' : '#e2001a',
                      color: status === 'loading' ? '#475569' : '#fff',
                      fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s',
                    }}>
                      {status === 'loading' ? <><span style={{ fontSize: '0.5rem' }}>●</span> Running…</> : <><span>▶</span> Run</>}
                    </button>
                  )}
                </div>

                {/* Response */}
                {(status === 'success' || status === 'error') && (
                  <>
                    {status === 'success' && summaryItems && (
                      <div style={{
                        display: 'flex', gap: 16, flexWrap: 'wrap',
                        padding: '6px 18px', background: '#161b22',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
                      }}>
                        {summaryItems.map(({ label, value }) => (
                          <span key={label}>
                            <span style={{ color: '#4ade80', fontWeight: 700 }}>{value}</span>
                            {' '}
                            <span style={{ color: '#64748b' }}>{label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{
                      padding: '4px 14px', background: '#161b22',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.625rem',
                    }}>
                      <span style={{ fontWeight: 700, color: status === 'error' ? '#f87171' : '#4ade80' }}>
                        <span style={{ fontSize: '0.5rem' }}>●</span>{' '}
                        {status === 'error' ? 'Error' : 'Response'}
                      </span>
                      {elapsed !== null && <span style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>{elapsed}ms</span>}
                    </div>
                    {status === 'success' && result && <JsonOut data={result} />}
                    {status === 'error' && (
                      <div style={{ padding: '10px 16px', fontSize: '0.75rem', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                        {errorMsg}
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

