import { useState, useEffect, useRef, useCallback } from 'react';
import PageActions from '../components/ui/PageActions';
import { ParamRow } from '../components/ui/ApiRefTwoCol';
import VersionTabBar from '../components/ui/VersionTabBar';
import { IlloCalculateRoute, IlloReachableRange } from './IntroIllustrations';
import { makeThumb, L_CalculateRoute, L_ReachableRange } from '../illustrations/lightVariants';
import { IcoCalculateRoute, IcoReachableRange } from '../illustrations/iconVariants';
import { PRESETS as EV_PRESETS, ConsumptionCurve } from './EVBattery';

const ThumbCalculateRoute  = makeThumb(IlloCalculateRoute,  L_CalculateRoute,  IcoCalculateRoute);
const ThumbReachableRange  = makeThumb(IlloReachableRange,  L_ReachableRange,  IcoReachableRange);

/* ─────────────────────────────────────────────────────────────────────────────
 * RoutingExplorer — live API request builder.
 * Supports Calculate Route + Reachable Range across v1 and v2.
 * Uses ParamRow cards for all form fields (same component as API reference pages).
 * ───────────────────────────────────────────────────────────────────────────── */

const DEMO_KEY      = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const LS_KEY        = 'tt-explorer-key';
const MAX_WAYPOINTS = 5;

/* Base URL per version */
const BASE = {
  v1: 'https://api.tomtom.com/routing/1',
  v2: 'https://api.tomtom.com/maps/orbis/routing',
};

/* ─── Map style URLs ────────────────────────────────────────────────────────── *
 * TomTom Maps SDK v6 style API — "standardLight" / "standardDark" equivalents.
 * Version "22.2.1-*" is the hosted style version bundled in maps-web 6.25.1.
 * ─────────────────────────────────────────────────────────────────────────── */
const STYLE_VERSION = '22.2.1-*';
function mapStyleUrl(apiKey, isDark) {
  const v = isDark ? 'dark' : 'light';
  const key = apiKey || DEMO_KEY;
  return (
    `https://api.tomtom.com/style/1/style/${STYLE_VERSION}` +
    `?key=${key}&map=2/basic_street-${v}` +
    `&traffic_incidents=2/incidents_${v}` +
    `&traffic_flow=2/flow_relative-${v}` +
    `&poi=2/poi_${v}`
  );
}

const ENDPOINTS = [
  { value: 'calculate-route', label: 'Calculate Route' },
  { value: 'reachable-range', label: 'Reachable Range' },
];

/* Derive the display path shown in the section header */
function epPath(endpoint, version) {
  if (endpoint === 'calculate-route') {
    return version === 'v2'
      ? '/maps/orbis/routing/calculateRoute/{locations}/json'
      : '/routing/1/calculateRoute/{locations}/json';
  }
  return version === 'v2'
    ? '/maps/orbis/routing/calculateReachableRange/{origin}/json'
    : '/routing/1/calculateReachableRange/{origin}/json';
}

/* Vignette country codes (common European vignette systems) */
const VIGNETTE_COUNTRIES = ['AUT','BGR','BIH','CHE','CZE','HUN','MDA','MKD','ROU','SRB','SVK','SVN'];

/* ─── Shared input styles ────────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 7,
  border: '1px solid var(--border)', background: 'var(--bg)',
  color: 'var(--black)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)',
  boxSizing: 'border-box', outline: 'none',
};
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };
const numStyle    = { ...inputStyle, width: 120 };

/* ─── Small boolean toggle — used as a `control` prop on ParamRow ────────────── */
function ToggleControl({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 13px', borderRadius: 7, cursor: 'pointer',
        border: `1px solid ${value ? '#22c55e55' : 'var(--border)'}`,
        background: value ? 'rgba(34,197,94,0.07)' : 'var(--bg)',
        color: value ? '#22c55e' : 'var(--mid)',
        fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600,
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: value ? '#22c55e' : 'var(--border)',
        flexShrink: 0,
      }} />
      {value ? 'true' : 'false'}
    </button>
  );
}

/* ─── Multi-select pill control — used as a `control` prop on ParamRow ─────── */
function MultiSelect({ options, selected, onChange }) {
  const toggle = v =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {options.map(v => {
        const on = selected.includes(v);
        return (
          <button key={v} onClick={() => toggle(v)} style={{
            padding: '3px 10px', borderRadius: 4, cursor: 'pointer',
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
            border: `1px solid ${on ? '#e2001a' : 'var(--border)'}`,
            background: on ? 'rgba(226,0,26,0.08)' : 'transparent',
            color: on ? '#e2001a' : 'var(--mid)',
            transition: 'all 0.12s',
          }}>{v}</button>
        );
      })}
    </div>
  );
}

/* ─── Collapsible group header — groups sets of ParamRow cards ───────────────── */
/* ─── TomTom place search input ─────────────────────────────────────────────── */
function PlaceSearch({ value, onChange, placeholder, apiKey }) {
  const [query,       setQuery]       = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open,        setOpen]        = useState(false);
  const debRef    = useRef(null);
  const wrapRef   = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    const fn = e => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const search = async (q) => {
    if (q.length < 2 || /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(q.trim())) return;
    try {
      const res  = await window.fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(q)}.json?key=${apiKey}&typeahead=true&limit=6&language=en-GB`);
      const data = await res.json();
      setSuggestions(data.results || []);
      setOpen(true);
    } catch {}
  };

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q) { onChange(''); setSuggestions([]); return; }
    if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(q.trim())) { onChange(q.trim()); return; }
    onChange('');
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => search(q), 280);
  };

  const select = (r) => {
    const name = r.poi?.name || r.address?.freeformAddress || '';
    const latlng = `${r.position.lat},${r.position.lon}`;
    setQuery(name);
    setSuggestions([]);
    setOpen(false);
    onChange(latlng);
  };

  const clear = () => { setQuery(''); onChange(''); setSuggestions([]); setOpen(false); };

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ position: 'relative' }}>
        <input value={query} onChange={handleChange} placeholder={placeholder}
          style={{
            width: '100%', padding: '6px 26px 6px 30px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg)',
            color: 'var(--black)', fontSize: '0.8125rem', fontFamily: 'inherit',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        {/* search icon */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)', opacity: 0.5 }}>
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7.5 7.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {query && (
          <button onClick={clear} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1, padding: '2px' }}>×</button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30,
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
          overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        }}>
          {suggestions.map((r, i) => (
            <div key={i} onMouseDown={() => select(r)}
              style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--s1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--black)' }}>
                {r.poi?.name || r.address?.freeformAddress}
              </div>
              {r.poi?.name && <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 1 }}>{r.address?.freeformAddress}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Compact single-line param row (Explorer flat list) ────────────────────── */
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
      <div style={{ padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
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
      padding: '9px 0', borderBottom: '1px solid var(--border)', minHeight: 38,
    }}>
      {nameEl}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 4, flexShrink: 1, minWidth: 0, maxWidth: '100%' }}>
        {hasPills ? pillsEl : control}
      </div>
    </div>
  );
}

/* ─── Section card: label header + content in one bordered container ─────────── */
function SectionCard({ label, children }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px 9px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '0.875rem', fontWeight: 600,
          fontFamily: 'var(--font-display)', color: 'var(--black)',
        }}>{label}</span>
      </div>
      {/* Content */}
      {children}
    </div>
  );
}

function ParamGroup({ label, defaultOpen = true, stickyTop = 'var(--pg-sticky-top, var(--app-top-offset))', children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'sticky', top: stickyTop,
          zIndex: 4,
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
          gap: 12, padding: '16px 0 12px',
          background: 'var(--s0)', border: 'none', outline: 'none',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          marginBottom: open ? 20 : 8,
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--mid)', flexShrink: 0, width: 14, textAlign: 'center' }}>
          {open ? '−' : '+'}
        </span>
        <span style={{
          fontSize: '1.25rem', fontWeight: 700,
          color: 'var(--black)', fontFamily: 'var(--font-display)',
        }}>
          {label}
        </span>
      </button>
      {open && children}
    </div>
  );
}

/* ─── POST body builder ──────────────────────────────────────────────────────── */
function buildPostBody(vals) {
  const body = {};
  if (vals.supportingPoints.trim()) {
    const pts = vals.supportingPoints.trim().split('\n')
      .map(l => l.trim()).filter(Boolean)
      .map(l => { const [lat, lon] = l.split(',').map(Number); return { latitude: lat, longitude: lon }; });
    if (pts.length) body.supportingPoints = pts;
  }
  if (vals.allowVignette.length)  body.allowVignette  = vals.allowVignette;
  if (vals.avoidVignette.length)  body.avoidVignette  = vals.avoidVignette;
  if (vals.avoidAreas.trim()) {
    try { body.avoidAreas = JSON.parse(vals.avoidAreas); } catch {}
  }
  return body;
}

/* ─── Live URL renderer ──────────────────────────────────────────────────────── */
function LiveUrl({ vals, endpoint, version, method, waypoints = [] }) {
  const origin   = vals.origin.trim() || '…';
  const dest     = vals.destination.trim() || '…';
  const isRange  = endpoint === 'reachable-range';
  const validWps = waypoints.filter(w => w && w.trim());
  const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.9 };

  const qp = [];
  qp.push({ k: 'key', v: '***', muted: true });
  if (isRange) {
    if (vals.fuelBudgetInLiters)    qp.push({ k: 'fuelBudgetInLiters',   v: vals.fuelBudgetInLiters });
    if (vals.energyBudgetInkWh)     qp.push({ k: 'energyBudgetInkWh',    v: vals.energyBudgetInkWh });
    if (vals.timeBudgetInSec)       qp.push({ k: 'timeBudgetInSec',      v: vals.timeBudgetInSec });
  }
  if (vals.travelMode !== 'car')    qp.push({ k: 'travelMode',      v: vals.travelMode });
  if (vals.routeType  !== 'fastest')qp.push({ k: 'routeType',       v: vals.routeType });
  if (!vals.traffic)                qp.push({ k: 'traffic',         v: 'false' });
  if (!isRange && vals.maxAlternatives > 0) qp.push({ k: 'maxAlternatives', v: String(vals.maxAlternatives) });
  if (!isRange && vals.alternativeType)     qp.push({ k: 'alternativeType', v: vals.alternativeType });
  if (vals.departAt)                qp.push({ k: 'departAt',        v: vals.departAt });
  if (vals.arriveAt)                qp.push({ k: 'arriveAt',        v: vals.arriveAt });
  if (!isRange && vals.instructionsType)    qp.push({ k: 'instructionsType', v: vals.instructionsType });
  if (!isRange && vals.computeBestOrder)    qp.push({ k: 'computeBestOrder', v: 'true' });
  if (vals.routeRepresentation)     qp.push({ k: 'routeRepresentation', v: vals.routeRepresentation });
  if (vals.computeTravelTimeFor)    qp.push({ k: 'computeTravelTimeFor', v: vals.computeTravelTimeFor });
  if (vals.vehicleHeading)          qp.push({ k: 'vehicleHeading',   v: vals.vehicleHeading });
  if (vals.report)                  qp.push({ k: 'report',           v: vals.report });
  if (vals.vehicleEngineType)       qp.push({ k: 'vehicleEngineType', v: vals.vehicleEngineType });
  if (vals.vehicleMaxSpeed)         qp.push({ k: 'vehicleMaxSpeed',  v: vals.vehicleMaxSpeed });
  if (vals.vehicleWeight)           qp.push({ k: 'vehicleWeight',    v: vals.vehicleWeight });
  if (vals.vehicleAxleWeight)       qp.push({ k: 'vehicleAxleWeight', v: vals.vehicleAxleWeight });
  if (vals.vehicleNumberOfAxles)    qp.push({ k: 'vehicleNumberOfAxles', v: vals.vehicleNumberOfAxles });
  if (vals.vehicleLength)           qp.push({ k: 'vehicleLength',    v: vals.vehicleLength });
  if (vals.vehicleWidth)            qp.push({ k: 'vehicleWidth',     v: vals.vehicleWidth });
  if (vals.vehicleHeight)           qp.push({ k: 'vehicleHeight',    v: vals.vehicleHeight });
  if (vals.vehicleCommercial)       qp.push({ k: 'vehicleCommercial', v: 'true' });
  if (vals.vehicleAdrTunnelRestrictionCode) qp.push({ k: 'vehicleAdrTunnelRestrictionCode', v: vals.vehicleAdrTunnelRestrictionCode });
  if (vals.vehicleHasElectricTollCollectionTransponder) qp.push({ k: 'vehicleHasElectricTollCollectionTransponder', v: 'true' });
  const isEVLive = ['electric', 'pluginhybrid'].includes(vals.vehicleEngineType);
  if (isEVLive) {
    if (vals.constantSpeedConsumptionInkWhPerHundredkm) qp.push({ k: 'constantSpeedConsumptionInkWhPerHundredkm', v: vals.constantSpeedConsumptionInkWhPerHundredkm });
    if (vals.currentChargeInkWh)   qp.push({ k: 'currentChargeInkWh',  v: vals.currentChargeInkWh });
    if (vals.maxChargeInkWh)       qp.push({ k: 'maxChargeInkWh',      v: vals.maxChargeInkWh });
    if (vals.auxiliaryPowerInkW)   qp.push({ k: 'auxiliaryPowerInkW',  v: vals.auxiliaryPowerInkW });
    if (vals.consumptionInkWhPerkmAltitudeGain)  qp.push({ k: 'consumptionInkWhPerkmAltitudeGain', v: vals.consumptionInkWhPerkmAltitudeGain });
    if (vals.recuperationInkWhPerkmAltitudeLoss) qp.push({ k: 'recuperationInkWhPerkmAltitudeLoss', v: vals.recuperationInkWhPerkmAltitudeLoss });
  }
  const isCombustionLive = ['combustion', 'mildhybrid'].includes(vals.vehicleEngineType);
  if (isCombustionLive) {
    if (vals.constantSpeedConsumptionInLitersPerHundredkm) qp.push({ k: 'constantSpeedConsumptionInLitersPerHundredkm', v: vals.constantSpeedConsumptionInLitersPerHundredkm });
    if (vals.currentFuelInLiters)  qp.push({ k: 'currentFuelInLiters', v: vals.currentFuelInLiters });
    if (vals.auxiliaryPowerInLitersPerHour) qp.push({ k: 'auxiliaryPowerInLitersPerHour', v: vals.auxiliaryPowerInLitersPerHour });
    if (vals.fuelEnergyDensityInMJoulesPerLiter) qp.push({ k: 'fuelEnergyDensityInMJoulesPerLiter', v: vals.fuelEnergyDensityInMJoulesPerLiter });
    if (vals.accelerationEfficiency) qp.push({ k: 'accelerationEfficiency', v: vals.accelerationEfficiency });
    if (vals.decelerationEfficiency) qp.push({ k: 'decelerationEfficiency', v: vals.decelerationEfficiency });
    if (vals.uphillEfficiency)       qp.push({ k: 'uphillEfficiency',       v: vals.uphillEfficiency });
    if (vals.downhillEfficiency)     qp.push({ k: 'downhillEfficiency',     v: vals.downhillEfficiency });
  }
  if (vals.hilliness && vals.routeType === 'thrilling') qp.push({ k: 'hilliness', v: vals.hilliness });
  if (vals.windingness && vals.routeType === 'thrilling') qp.push({ k: 'windingness', v: vals.windingness });
  if (vals.language !== 'en-GB')    qp.push({ k: 'language',        v: vals.language });
  vals.avoid.forEach(a =>           qp.push({ k: 'avoid',           v: a }));
  if (!isRange) vals.sectionType.forEach(s => qp.push({ k: 'sectionType', v: s }));
  (vals.vehicleLoadType || []).forEach(v => qp.push({ k: 'vehicleLoadType', v }));

  const basePath = version === 'v2'
    ? (isRange ? `/maps/orbis/routing/calculateReachableRange/` : `/maps/orbis/routing/calculateRoute/`)
    : (isRange ? `/routing/1/calculateReachableRange/` : `/routing/1/calculateRoute/`);
  const isPost   = method === 'POST';
  const postBody = isPost ? buildPostBody(vals) : null;
  const hasBody  = isPost && postBody && Object.keys(postBody).length > 0;

  /* Build the path param including waypoints */
  const pathParam = isRange
    ? <span style={{ color: '#f87171', fontWeight: 600 }}>{origin}</span>
    : <>
        <span style={{ color: '#f87171', fontWeight: 600 }}>{origin}</span>
        {validWps.map((wp, i) => (
          <span key={i}>
            <span style={{ color: '#374151' }}>:</span>
            <span style={{ color: '#fb923c', fontWeight: 600 }}>{wp}</span>
          </span>
        ))}
        <span style={{ color: '#374151' }}>:</span>
        <span style={{ color: '#f87171', fontWeight: 600 }}>{dest}</span>
      </>;

  return (
    <div style={{ padding: '14px 18px', ...mono }}>
      <div style={{ marginBottom: 3 }}>
        <span style={{
          display: 'inline-block', padding: '2px 7px', borderRadius: 4, marginRight: 8,
          background: isPost ? 'rgba(34,197,94,0.12)' : 'rgba(125,211,252,0.12)',
          color: isPost ? '#4ade80' : '#7dd3fc',
          fontSize: '0.5625rem', fontWeight: 800, letterSpacing: '0.08em',
        }}>{method}</span>
        <span style={{ color: '#4b5563' }}>https://api.tomtom.com</span>
        <span style={{ color: '#64748b' }}>{basePath}</span>
      </div>
      <div style={{ paddingLeft: 52 }}>
        {pathParam}
        <span style={{ color: '#64748b' }}>/json</span>
      </div>
      <div style={{ paddingLeft: 52, marginTop: 4 }}>
        {qp.map((p, i) => {
          const longVal = String(p.v).length > 28;
          return (
            <div key={`${p.k}-${i}`} style={{ marginBottom: longVal ? 4 : 1 }}>
              <span style={{ color: '#374151' }}>{i === 0 ? '?' : '&'}</span>
              <span style={{ color: '#94a3b8' }}>{p.k}</span>
              <span style={{ color: '#374151' }}>=</span>
              {longVal
                ? <div style={{ paddingLeft: 12, color: p.muted ? '#4b5563' : '#7dd3fc', wordBreak: 'break-all', lineHeight: 1.7 }}>{p.v}</div>
                : <span style={{ color: p.muted ? '#4b5563' : '#7dd3fc' }}>{p.v}</span>
              }
            </div>
          );
        })}
      </div>

      {/* POST body preview */}
      {isPost && (
        <div style={{ marginTop: 10, paddingLeft: 52 }}>
          <div style={{ color: '#64748b', marginBottom: 4, fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Request body
          </div>
          <pre style={{
            margin: 0, padding: '8px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            fontSize: '0.6875rem', color: hasBody ? '#a5b4fc' : '#374151',
            lineHeight: 1.6, maxHeight: 120, overflowY: 'auto',
          }}>
            {hasBody ? JSON.stringify(postBody, null, 2) : '// No body params set yet'}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ─── JSON tree viewer ───────────────────────────────────────────────────────── */
const JC = {
  key:     '#7dd3fc',   /* object keys  — light blue  */
  idx:     '#64748b',   /* array indices — slate       */
  str:     '#4ade80',   /* string values — green       */
  num:     '#fb923c',   /* number values — orange      */
  bool:    '#a78bfa',   /* booleans      — purple      */
  null:    '#94a3b8',   /* null          — muted       */
  punct:   '#475569',   /* brackets / colons           */
  preview: '#475569',   /* collapsed summary           */
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

  /* Primitives */
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

  const keys   = isArr ? [...d.keys()] : Object.keys(d);
  const ob     = isArr ? '[' : '{';
  const cb     = isArr ? ']' : '}';
  const big    = keys.length > 8;
  const [open, setOpen] = useState(depth < 3 && !big);

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
      {/* Header row — clickable */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          paddingLeft: depth * 14, display: 'flex', alignItems: 'baseline',
          gap: 5, cursor: 'pointer', userSelect: 'none',
        }}
      >
        <span style={{ color: JC.punct, fontSize: '0.5rem', flexShrink: 0, width: 10, lineHeight: 1 }}>
          {open ? '▼' : '▶'}
        </span>
        {k !== undefined && <>
          <span style={{ color: typeof k === 'number' ? JC.idx : JC.key }}>{k}</span>
          <span style={{ color: JC.punct }}>:</span>
        </>}
        {open
          ? <span style={{ color: JC.punct }}>{ob}</span>
          : <span style={{ color: JC.preview }}>{jPreview(d)}</span>
        }
        {!open && isArr && <span style={{ color: JC.idx, fontSize: '0.5625rem' }}>{keys.length}</span>}
      </div>

      {/* Children */}
      {open && <>
        {keys.map(ck => (
          <JNode key={ck} d={isArr ? d[ck] : d[ck]} k={isArr ? ck : ck} depth={depth + 1} />
        ))}
        <div style={{ paddingLeft: depth * 14, color: JC.punct }}>{cb}</div>
      </>}
    </div>
  );
}

function JsonOut({ data }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <JNode d={data} depth={0} />
    </div>
  );
}

/* ─── URL + cURL builders ────────────────────────────────────────────────────── */
function buildFetchConfig(vals, key, endpoint, version, method, waypoints = []) {
  const origin   = vals.origin.trim() || '51.5074,-0.1278';
  const dest     = vals.destination.trim() || '53.4808,-2.2426';
  const isRange  = endpoint === 'reachable-range';
  const validWps = waypoints.filter(w => w && w.trim());
  const qp      = new URLSearchParams();
  qp.set('key', key || DEMO_KEY);

  if (isRange) {
    if (vals.fuelBudgetInLiters)     qp.set('fuelBudgetInLiters',    vals.fuelBudgetInLiters);
    if (vals.energyBudgetInkWh)      qp.set('energyBudgetInkWh',     vals.energyBudgetInkWh);
    if (vals.timeBudgetInSec)        qp.set('timeBudgetInSec',       vals.timeBudgetInSec);
  }
  if (vals.travelMode)               qp.set('travelMode',       vals.travelMode);
  if (vals.routeType)                qp.set('routeType',        vals.routeType);
  if (!vals.traffic)                 qp.set('traffic',          'false');
  if (!isRange && vals.maxAlternatives > 0)   qp.set('maxAlternatives',  String(vals.maxAlternatives));
  if (!isRange && vals.alternativeType)       qp.set('alternativeType',  vals.alternativeType);
  if (!isRange && vals.instructionsType)      qp.set('instructionsType', vals.instructionsType);
  if (!isRange && vals.computeBestOrder)      qp.set('computeBestOrder', 'true');
  if (!isRange) vals.sectionType.forEach(s => qp.append('sectionType',  s));
  if (vals.departAt)                 qp.set('departAt',         vals.departAt);
  if (vals.arriveAt)                 qp.set('arriveAt',         vals.arriveAt);
  if (vals.routeRepresentation)      qp.set('routeRepresentation', vals.routeRepresentation);
  if (vals.computeTravelTimeFor)     qp.set('computeTravelTimeFor', vals.computeTravelTimeFor);
  if (vals.vehicleHeading)           qp.set('vehicleHeading',   vals.vehicleHeading);
  if (vals.report)                   qp.set('report',           vals.report);
  if (vals.hilliness && vals.routeType === 'thrilling') qp.set('hilliness', vals.hilliness);
  if (vals.windingness && vals.routeType === 'thrilling') qp.set('windingness', vals.windingness);
  if (vals.vehicleEngineType)        qp.set('vehicleEngineType', vals.vehicleEngineType);
  if (vals.vehicleMaxSpeed)          qp.set('vehicleMaxSpeed',  vals.vehicleMaxSpeed);
  if (vals.vehicleWeight)            qp.set('vehicleWeight',    vals.vehicleWeight);
  if (vals.vehicleAxleWeight)        qp.set('vehicleAxleWeight', vals.vehicleAxleWeight);
  if (vals.vehicleNumberOfAxles)     qp.set('vehicleNumberOfAxles', vals.vehicleNumberOfAxles);
  if (vals.vehicleLength)            qp.set('vehicleLength',    vals.vehicleLength);
  if (vals.vehicleWidth)             qp.set('vehicleWidth',     vals.vehicleWidth);
  if (vals.vehicleHeight)            qp.set('vehicleHeight',    vals.vehicleHeight);
  if (vals.vehicleCommercial)        qp.set('vehicleCommercial', 'true');
  (vals.vehicleLoadType || []).forEach(v => qp.append('vehicleLoadType', v));
  if (vals.vehicleAdrTunnelRestrictionCode) qp.set('vehicleAdrTunnelRestrictionCode', vals.vehicleAdrTunnelRestrictionCode);
  if (vals.vehicleHasElectricTollCollectionTransponder) qp.set('vehicleHasElectricTollCollectionTransponder', 'true');
  if (vals.language && vals.language !== 'en-GB') qp.set('language', vals.language);
  vals.avoid.forEach(a => qp.append('avoid', a));

  const isCombustion = ['combustion', 'mildhybrid'].includes(vals.vehicleEngineType);
  if (isCombustion) {
    if (vals.constantSpeedConsumptionInLitersPerHundredkm) qp.set('constantSpeedConsumptionInLitersPerHundredkm', vals.constantSpeedConsumptionInLitersPerHundredkm);
    if (vals.currentFuelInLiters)        qp.set('currentFuelInLiters',    vals.currentFuelInLiters);
    if (vals.auxiliaryPowerInLitersPerHour) qp.set('auxiliaryPowerInLitersPerHour', vals.auxiliaryPowerInLitersPerHour);
    if (vals.fuelEnergyDensityInMJoulesPerLiter) qp.set('fuelEnergyDensityInMJoulesPerLiter', vals.fuelEnergyDensityInMJoulesPerLiter);
    if (vals.accelerationEfficiency)     qp.set('accelerationEfficiency', vals.accelerationEfficiency);
    if (vals.decelerationEfficiency)     qp.set('decelerationEfficiency', vals.decelerationEfficiency);
    if (vals.uphillEfficiency)           qp.set('uphillEfficiency',       vals.uphillEfficiency);
    if (vals.downhillEfficiency)         qp.set('downhillEfficiency',     vals.downhillEfficiency);
  }
  const isEV = ['electric', 'pluginhybrid'].includes(vals.vehicleEngineType);
  if (isEV) {
    if (vals.constantSpeedConsumptionInkWhPerHundredkm) qp.set('constantSpeedConsumptionInkWhPerHundredkm', vals.constantSpeedConsumptionInkWhPerHundredkm);
    if (vals.currentChargeInkWh)         qp.set('currentChargeInkWh',     vals.currentChargeInkWh);
    if (vals.maxChargeInkWh)             qp.set('maxChargeInkWh',         vals.maxChargeInkWh);
    if (vals.auxiliaryPowerInkW)         qp.set('auxiliaryPowerInkW',     vals.auxiliaryPowerInkW);
    if (vals.consumptionInkWhPerkmAltitudeGain) qp.set('consumptionInkWhPerkmAltitudeGain', vals.consumptionInkWhPerkmAltitudeGain);
    if (vals.recuperationInkWhPerkmAltitudeLoss) qp.set('recuperationInkWhPerkmAltitudeLoss', vals.recuperationInkWhPerkmAltitudeLoss);
  }

  const b       = BASE[version] ?? BASE.v1;
  const allLocs = isRange ? origin : [origin, ...validWps, dest].join(':');
  const base    = isRange
    ? `${b}/calculateReachableRange/${origin}/json`
    : `${b}/calculateRoute/${allLocs}/json`;
  const url = `${base}?${qp}`;

  if (method === 'POST') {
    const body = buildPostBody(vals);
    return { url, options: { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } };
  }
  return { url, options: {} };
}

function buildCurlStr(vals, displayKey, endpoint, version, method, waypoints = []) {
  const origin   = vals.origin.trim() || '51.5074,-0.1278';
  const dest     = vals.destination.trim() || '53.4808,-2.2426';
  const isRange  = endpoint === 'reachable-range';
  const isPost   = method === 'POST';
  const b        = BASE[version] ?? BASE.v1;
  const validWps = waypoints.filter(w => w && w.trim());
  const allLocs  = isRange ? origin : [origin, ...validWps, dest].join(':');
  const base     = isRange
    ? `${b}/calculateReachableRange/${origin}/json`
    : `${b}/calculateRoute/${allLocs}/json`;

  const lines = [isPost ? `curl -X POST "${base}` : `curl "${base}`];
  const add   = (k, v) => lines.push(`  ${lines.length === 1 ? '?' : '&'}${k}=${v}`);
  add('key', displayKey || 'YOUR_API_KEY');
  if (isRange) {
    if (vals.fuelBudgetInLiters)  add('fuelBudgetInLiters',  vals.fuelBudgetInLiters);
    if (vals.energyBudgetInkWh)   add('energyBudgetInkWh',   vals.energyBudgetInkWh);
    if (vals.timeBudgetInSec)     add('timeBudgetInSec',     vals.timeBudgetInSec);
  }
  if (vals.travelMode !== 'car')    add('travelMode',      vals.travelMode);
  if (vals.routeType !== 'fastest') add('routeType',       vals.routeType);
  if (!vals.traffic)                add('traffic',         'false');
  if (!isRange && vals.maxAlternatives > 0) add('maxAlternatives', String(vals.maxAlternatives));
  if (!isRange && vals.alternativeType)     add('alternativeType', vals.alternativeType);
  if (!isRange && vals.instructionsType)    add('instructionsType', vals.instructionsType);
  if (!isRange && vals.computeBestOrder)    add('computeBestOrder', 'true');
  if (!isRange) vals.sectionType.forEach(s => add('sectionType', s));
  if (vals.departAt)                add('departAt',        vals.departAt);
  if (vals.arriveAt)                add('arriveAt',        vals.arriveAt);
  if (vals.routeRepresentation)     add('routeRepresentation', vals.routeRepresentation);
  if (vals.computeTravelTimeFor)    add('computeTravelTimeFor', vals.computeTravelTimeFor);
  if (vals.vehicleHeading)          add('vehicleHeading',  vals.vehicleHeading);
  if (vals.report)                  add('report',          vals.report);
  if (vals.hilliness && vals.routeType === 'thrilling') add('hilliness', vals.hilliness);
  if (vals.windingness && vals.routeType === 'thrilling') add('windingness', vals.windingness);
  if (vals.vehicleEngineType)       add('vehicleEngineType', vals.vehicleEngineType);
  if (vals.vehicleMaxSpeed)         add('vehicleMaxSpeed', vals.vehicleMaxSpeed);
  if (vals.vehicleWeight)           add('vehicleWeight',   vals.vehicleWeight);
  if (vals.vehicleAxleWeight)       add('vehicleAxleWeight', vals.vehicleAxleWeight);
  if (vals.vehicleNumberOfAxles)    add('vehicleNumberOfAxles', vals.vehicleNumberOfAxles);
  if (vals.vehicleLength)           add('vehicleLength',   vals.vehicleLength);
  if (vals.vehicleWidth)            add('vehicleWidth',    vals.vehicleWidth);
  if (vals.vehicleHeight)           add('vehicleHeight',   vals.vehicleHeight);
  if (vals.vehicleCommercial)       add('vehicleCommercial', 'true');
  (vals.vehicleLoadType || []).forEach(v => add('vehicleLoadType', v));
  if (vals.vehicleAdrTunnelRestrictionCode) add('vehicleAdrTunnelRestrictionCode', vals.vehicleAdrTunnelRestrictionCode);
  if (vals.vehicleHasElectricTollCollectionTransponder) add('vehicleHasElectricTollCollectionTransponder', 'true');
  const isCurlEV = ['electric', 'pluginhybrid'].includes(vals.vehicleEngineType);
  if (isCurlEV) {
    if (vals.constantSpeedConsumptionInkWhPerHundredkm) add('constantSpeedConsumptionInkWhPerHundredkm', vals.constantSpeedConsumptionInkWhPerHundredkm);
    if (vals.currentChargeInkWh)   add('currentChargeInkWh',  vals.currentChargeInkWh);
    if (vals.maxChargeInkWh)       add('maxChargeInkWh',      vals.maxChargeInkWh);
    if (vals.auxiliaryPowerInkW)   add('auxiliaryPowerInkW',  vals.auxiliaryPowerInkW);
    if (vals.consumptionInkWhPerkmAltitudeGain)  add('consumptionInkWhPerkmAltitudeGain', vals.consumptionInkWhPerkmAltitudeGain);
    if (vals.recuperationInkWhPerkmAltitudeLoss) add('recuperationInkWhPerkmAltitudeLoss', vals.recuperationInkWhPerkmAltitudeLoss);
  }
  const isCurlCombustion = ['combustion', 'mildhybrid'].includes(vals.vehicleEngineType);
  if (isCurlCombustion) {
    if (vals.constantSpeedConsumptionInLitersPerHundredkm) add('constantSpeedConsumptionInLitersPerHundredkm', vals.constantSpeedConsumptionInLitersPerHundredkm);
    if (vals.currentFuelInLiters)  add('currentFuelInLiters', vals.currentFuelInLiters);
    if (vals.auxiliaryPowerInLitersPerHour) add('auxiliaryPowerInLitersPerHour', vals.auxiliaryPowerInLitersPerHour);
    if (vals.fuelEnergyDensityInMJoulesPerLiter) add('fuelEnergyDensityInMJoulesPerLiter', vals.fuelEnergyDensityInMJoulesPerLiter);
    if (vals.accelerationEfficiency) add('accelerationEfficiency', vals.accelerationEfficiency);
    if (vals.decelerationEfficiency) add('decelerationEfficiency', vals.decelerationEfficiency);
    if (vals.uphillEfficiency)       add('uphillEfficiency',       vals.uphillEfficiency);
    if (vals.downhillEfficiency)     add('downhillEfficiency',     vals.downhillEfficiency);
  }
  if (vals.language !== 'en-GB')    add('language',        vals.language);
  vals.avoid.forEach(a =>           add('avoid',           a));

  let curl = lines.join(' \\\n') + '"';
  if (isPost) {
    const body = buildPostBody(vals);
    curl += ` \\\n  -H "Content-Type: application/json"`;
    curl += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }
  return curl;
}

/* ─── TomTom Maps SDK — same CDN version as TryItDemos ──────────────────────── */
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

/* ─── Marker element — matches TryItDemos exactly ───────────────────────────── */
function markerEl(color, label) {
  const fs = label.length > 1 ? '9px' : '11px';
  const el = document.createElement('div');
  el.style.cssText = `width:30px;height:30px;border-radius:50%;background:${color};color:#fff;` +
    `display:flex;align-items:center;justify-content:center;font-size:${fs};font-weight:800;` +
    `font-family:system-ui,-apple-system,sans-serif;border:2.5px solid rgba(255,255,255,0.95);` +
    `box-shadow:0 2px 8px rgba(0,0,0,0.45);cursor:pointer;line-height:1;user-select:none;` +
    `position:relative;`;
  el.textContent = label;
  return el;
}

/* Attach a hover tooltip to a marker element */
function addMarkerTooltip(el, html) {
  const tip = document.createElement('div');
  tip.style.cssText = 'position:absolute;bottom:38px;left:50%;transform:translateX(-50%);' +
    'background:#0d1117;border:1px solid rgba(255,255,255,0.12);border-radius:8px;' +
    'padding:7px 11px;font-size:10px;font-family:system-ui,-apple-system,sans-serif;' +
    'color:#e2e8f0;white-space:nowrap;pointer-events:none;opacity:0;' +
    'transition:opacity 0.12s;z-index:100;line-height:1.55;min-width:120px;';
  tip.innerHTML = html;
  el.appendChild(tip);
  el.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
  el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
}

/* ─── Route line — blue matches TryItDemos (red reserved for traffic) ────────── */
function addRouteLine(map, coordinates, color = '#0066cc', width = 4, id = 'route') {
  map.addSource(id, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates } } });
  map.addLayer({ id: `${id}-casing`, type: 'line', source: id, paint: { 'line-color': '#fff', 'line-width': width + 3, 'line-opacity': 0.6 } });
  map.addLayer({ id, type: 'line', source: id, paint: { 'line-color': color, 'line-width': width, 'line-opacity': 0.9 } });
}

const ALT_COLORS = ['#94a3b8', '#7dd3fc', '#a78bfa', '#86efac'];
const MAX_ALTS   = 5;

function sdkFitBounds(map, tt, points, pad = 60, maxZoom = 13) {
  if (!points.length) return;
  const bounds = new tt.LngLatBounds();
  points.forEach(p => bounds.extend(p));
  map.fitBounds(bounds, { padding: pad, maxZoom });
}

/* ─── Live route map ──────────────────────────────────────────────────────────── */
function RouteMap({ result, endpoint, vals, apiKey, status, waypoints = [], isDark = false }) {
  const containerRef      = useRef(null);
  const mapRef            = useRef(null);
  const markersRef        = useRef([]);
  const popupRef          = useRef(null);
  const appliedStyleRef   = useRef(null);  /* tracks which isDark value the map was last styled with */
  const guidanceMarkersRef = useRef([]);   /* { marker, el }[] — shown/hidden on zoom */
  const trafficLayerIds   = useRef([]);    /* 'traffic-N' layer+source ids to clean up on redraw */
  const zoomCleanupRef    = useRef(null);  /* () => void — removes zoom event listener */
  const [redrawToken, setRedrawToken] = useState(0); /* bumped after style change to re-draw route */

  /* Init map once — with the correct light/dark style from the start */
  useEffect(() => {
    let map;
    loadSdk().then(tt => {
      if (!containerRef.current || mapRef.current) return;
      const { lat: oLat, lon: oLon } = parseLatLon(vals.origin);
      map = tt.map({
        key: apiKey,
        container: containerRef.current,
        center: [oLon || -0.1278, oLat || 51.5074],
        zoom: 5,
        dragRotate: false,
        style: mapStyleUrl(apiKey, isDark),
      });
      appliedStyleRef.current = isDark;
      mapRef.current = map;
    }).catch(() => {});
    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  /* Switch map style when portal theme toggles */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedStyleRef.current === isDark) return;
    appliedStyleRef.current = isDark;
    const newStyle = mapStyleUrl(apiKey, isDark);
    try {
      map.setStyle(newStyle);
      /* After the new style finishes loading, re-draw any existing route/range */
      map.once('styledata', () => {
        if (!mapRef.current) return;
        if (mapRef.current.isStyleLoaded()) {
          setRedrawToken(t => t + 1);
        } else {
          mapRef.current.once('idle', () => setRedrawToken(t => t + 1));
        }
      });
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  /* Resize canvas when the container's dimensions change (e.g. sidenav collapse) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Redraw when result arrives */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !result) return;

    let cancelled = false;

    loadSdk().then(tt => {
      if (cancelled || !mapRef.current) return;

      const update = () => {
        if (cancelled) return;

        /* Stop any in-progress animation */
        try { map.stop(); } catch {}

        /* Remove existing popup */
        if (popupRef.current) { try { popupRef.current.remove(); } catch {} }

        /* Clear all route layers — primary + up to MAX_ALTS alternatives */
        for (let i = MAX_ALTS - 1; i >= 0; i--) {
          const aid = `route-alt-${i}`;
          try { if (map.getLayer(`${aid}-casing`)) map.removeLayer(`${aid}-casing`); } catch {}
          try { if (map.getLayer(aid))             map.removeLayer(aid);             } catch {}
          try { if (map.getSource(aid))            map.removeSource(aid);            } catch {}
        }
        ['route-casing', 'route', 'range-fill', 'range-line'].forEach(id => {
          try { if (map.getLayer(id)) map.removeLayer(id); } catch {}
        });
        ['route', 'range'].forEach(id => {
          try { if (map.getSource(id)) map.removeSource(id); } catch {}
        });
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        /* Clear traffic overlays */
        trafficLayerIds.current.forEach(id => {
          try { if (map.getLayer(id)) map.removeLayer(id); } catch {}
          try { if (map.getSource(id)) map.removeSource(id); } catch {}
        });
        trafficLayerIds.current = [];

        /* Clear guidance markers */
        guidanceMarkersRef.current.forEach(({ marker }) => marker.remove());
        guidanceMarkersRef.current = [];

        /* Remove previous zoom listener */
        if (zoomCleanupRef.current) { zoomCleanupRef.current(); zoomCleanupRef.current = null; }

        const { lat: oLat, lon: oLon } = parseLatLon(vals.origin);

        /* ── Calculate Route ──────────────────────────────────────────────── */
        if (endpoint === 'calculate-route' && result?.routes?.length) {
          const routes = result.routes;

          /* Reusable popup */
          const popup = new tt.Popup({ closeButton: false, closeOnClick: false, offset: 14 });
          popupRef.current = popup;

          /* Helper: popup HTML for a route */
          const routePopupHtml = (route, label, color) => {
            const s = route.summary;
            const km    = (s.lengthInMeters / 1000).toFixed(1);
            const min   = Math.round(s.travelTimeInSeconds / 60);
            const delay = Math.round((s.trafficDelayInSeconds || 0) / 60);
            return `<div style="font-size:10px;font-family:system-ui;line-height:1.6;min-width:130px">` +
              `<div style="font-weight:700;color:${color};margin-bottom:3px">${label}</div>` +
              `<div style="color:#e2e8f0">${km} km · ${min} min` +
              `${delay > 0 ? ` · <span style="color:#f87171">+${delay} min delay</span>` : ''}</div>` +
              `</div>`;
          };

          /* Draw alternatives FIRST so primary sits on top */
          routes.slice(1).forEach((altRoute, i) => {
            const altPts = (altRoute.legs || []).flatMap(leg => leg.points || []);
            const altCoords = altPts.map(p => [p.longitude, p.latitude]);
            if (!altCoords.length) return;
            const altId    = `route-alt-${i}`;
            const altColor = ALT_COLORS[i % ALT_COLORS.length];
            addRouteLine(map, altCoords, altColor, 3, altId);

            /* Alt route hover */
            const primS  = routes[0].summary;
            const altMin = Math.round(altRoute.summary.travelTimeInSeconds / 60);
            const primMin = Math.round(primS.travelTimeInSeconds / 60);
            const diffMin = altMin - primMin;
            const diffKm  = ((altRoute.summary.lengthInMeters - primS.lengthInMeters) / 1000).toFixed(1);
            const diffLabel = (diffMin >= 0 ? '+' : '') + diffMin + ' min · ' + (Number(diffKm) >= 0 ? '+' : '') + diffKm + ' km vs recommended';
            map.on('mouseenter', altId, (e) => {
              map.getCanvas().style.cursor = 'pointer';
              map.setPaintProperty(altId, 'line-opacity', 0.9);
              popup.setLngLat(e.lngLat)
                .setHTML(routePopupHtml(altRoute, `Alternative ${i + 1}`, altColor) +
                  `<div style="font-size:9px;color:#94a3b8;margin-top:2px">${diffLabel}</div>`)
                .addTo(map);
            });
            map.on('mousemove', altId, (e) => popup.setLngLat(e.lngLat));
            map.on('mouseleave', altId, () => {
              map.getCanvas().style.cursor = '';
              map.setPaintProperty(altId, 'line-opacity', 0.55);
              popup.remove();
            });
            /* Start at muted opacity */
            map.setPaintProperty(altId, 'line-opacity', 0.55);
          });

          /* Helper: nearest point on route polyline to a raw lat/lon */
          const nearestOnRoute = (routeCoords, rawLon, rawLat) => {
            let best = null, bestD = Infinity;
            for (const [lon, lat] of routeCoords) {
              const d = (lon - rawLon) ** 2 + (lat - rawLat) ** 2;
              if (d < bestD) { bestD = d; best = [lon, lat]; }
            }
            return best || [rawLon, rawLat];
          };

          /* Draw primary route */
          const pts    = (routes[0].legs || []).flatMap(leg => leg.points || []);
          const coords = pts.map(p => [p.longitude, p.latitude]);
          if (coords.length) {
            addRouteLine(map, coords, '#0066cc', 4, 'route');

            /* Primary hover */
            map.on('mouseenter', 'route', (e) => {
              map.getCanvas().style.cursor = 'pointer';
              popup.setLngLat(e.lngLat)
                .setHTML(routePopupHtml(routes[0], 'Recommended', '#7dd3fc'))
                .addTo(map);
            });
            map.on('mousemove', 'route', (e) => popup.setLngLat(e.lngLat));
            map.on('mouseleave', 'route', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
            });

            /* Markers — snap each marker to the nearest point on the drawn polyline */
            const primLegs = routes[0].legs || [];

            /* Origin: nearest route point to raw origin input */
            const [oSnapLon, oSnapLat] = nearestOnRoute(coords, oLon, oLat);
            /* Destination: nearest route point to raw destination input */
            const { lat: dLat, lon: dLon } = parseLatLon(vals.destination);
            const [dSnapLon, dSnapLat] = nearestOnRoute(coords, dLon, dLat);

            const primS = routes[0].summary;
            const totalKm  = (primS.lengthInMeters / 1000).toFixed(1);
            const totalMin = Math.round(primS.travelTimeInSeconds / 60);

            const elA = markerEl('#15803d', 'A');
            addMarkerTooltip(elA,
              `<strong style="color:#4ade80">Origin</strong><br>` +
              `${vals.origin || oLat + ',' + oLon}<br>` +
              `Route: ${totalKm} km · ${totalMin} min`);
            const mA = new tt.Marker({ element: elA }).setLngLat([oSnapLon, oSnapLat]).addTo(map);

            const elB = markerEl('#e2001a', 'B');
            addMarkerTooltip(elB,
              `<strong style="color:#f87171">Destination</strong><br>${vals.destination || dLat + ',' + dLon}`);
            const mB = new tt.Marker({ element: elB }).setLngLat([dSnapLon, dSnapLat]).addTo(map);

            const validWpsMap = waypoints.filter(w => w && w.trim());
            const wpMarkers = validWpsMap.map((wp, i) => {
              /* Snap waypoint to nearest point on route. Use the leg midpoint as a search
                 hint to avoid snapping to the wrong part of the route (e.g. a hairpin). */
              const leg = primLegs[i];
              const legPts = (leg?.points || []).map(p => [p.longitude, p.latitude]);
              /* Search the leg-specific coords first; fall back to full route */
              const searchCoords = legPts.length > 0 ? legPts : coords;
              const { lat: rawLat, lon: rawLon } = parseLatLon(wp);
              const [snapLon, snapLat] = nearestOnRoute(searchCoords, rawLon, rawLat);
              const legKm  = leg ? (leg.summary?.lengthInMeters / 1000).toFixed(1) : '—';
              const legMin = leg ? Math.round(leg.summary?.travelTimeInSeconds / 60) : '—';
              const el = markerEl('#64748b', String(i + 1));
              addMarkerTooltip(el,
                `<strong style="color:#94a3b8">Stop ${i + 1}</strong><br>${wp}<br>` +
                `Leg: ${legKm} km · ${legMin} min`);
              return new tt.Marker({ element: el }).setLngLat([snapLon, snapLat]).addTo(map);
            });

            markersRef.current = [mA, ...wpMarkers, mB];
            sdkFitBounds(map, tt, [[oSnapLon, oSnapLat], [dSnapLon, dSnapLat], ...coords.filter((_, i) => i % 20 === 0)], 56, 12);

            /* ── Traffic section overlays ─────────────────────────────────── */
            const TRAFFIC_COLORS = { 1: '#fbbf24', 2: '#f97316', 3: '#ef4444', 4: '#991b1b' };
            const TRAFFIC_LABELS = { 1: 'Minor delay', 2: 'Moderate delay', 3: 'Major delay', 4: 'Road closed' };
            (routes[0].sections || [])
              .filter(s => s.sectionType === 'TRAFFIC' && (s.magnitudeOfDelay ?? 0) > 0)
              .forEach((section, i) => {
                const segPts = pts.slice(section.startPointIndex, section.endPointIndex + 1);
                if (segPts.length < 2) return;
                const segCoords = segPts.map(p => [p.longitude, p.latitude]);
                const color = TRAFFIC_COLORS[section.magnitudeOfDelay] || '#fbbf24';
                const tid = `traffic-${i}`;
                map.addSource(tid, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: segCoords } } });
                map.addLayer({ id: tid, type: 'line', source: tid, paint: { 'line-color': color, 'line-width': 5, 'line-opacity': 0.85 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
                trafficLayerIds.current.push(tid);

                const delayMin = section.delayInSeconds ? `+${Math.round(section.delayInSeconds / 60)} min` : null;
                const speed    = section.effectiveSpeedInKmh ? `${section.effectiveSpeedInKmh} km/h` : null;
                const cat      = section.simpleCategory?.replace(/_/g, ' ').toLowerCase() ?? null;
                map.on('mouseenter', tid, (e) => {
                  map.getCanvas().style.cursor = 'pointer';
                  popup.setLngLat(e.lngLat).setHTML(
                    `<div style="font-size:10px;font-family:system-ui;line-height:1.7;min-width:120px">` +
                    `<div style="font-weight:700;color:${color};margin-bottom:2px">${TRAFFIC_LABELS[section.magnitudeOfDelay] || 'Traffic'}</div>` +
                    (delayMin ? `<div style="color:#f87171">${delayMin} delay</div>` : '') +
                    (speed    ? `<div style="color:#94a3b8">Speed: ${speed}</div>` : '') +
                    (cat      ? `<div style="color:#64748b;font-size:9px;text-transform:capitalize">${cat}</div>` : '') +
                    `</div>`
                  ).addTo(map);
                });
                map.on('mousemove', tid, (e) => popup.setLngLat(e.lngLat));
                map.on('mouseleave', tid, () => { map.getCanvas().style.cursor = ''; popup.remove(); });
              });

            /* ── Guidance markers (appear at zoom ≥ 11) ──────────────────── */
            const GUIDANCE_MIN_ZOOM = 11;
            const MANEUVER_ARROW = {
              DEPART: '↑', ARRIVE: '⚑', TURN_RIGHT: '→', TURN_LEFT: '←',
              TURN_SHARP_RIGHT: '↱', TURN_SHARP_LEFT: '↰', BEAR_RIGHT: '↗', BEAR_LEFT: '↖',
              KEEP_RIGHT: '↪', KEEP_LEFT: '↩', ROUNDABOUT_RIGHT: '⟳', ROUNDABOUT_LEFT: '⟲',
              MOTORWAY_ENTER: '⬆', MOTORWAY_EXIT: '⬇', MOTORWAY_CHANGE: '⇄', FOLLOW: '↑',
            };
            (routes[0].guidance?.instructions ?? []).forEach(instr => {
              if (!instr.point) return;
              const arrow = MANEUVER_ARROW[instr.maneuver] || '·';
              const el = document.createElement('div');
              el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#1e293b;border:1.5px solid #475569;display:flex;align-items:center;justify-content:center;font-size:9px;color:#e2e8f0;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.5);transition:opacity 0.2s';
              el.textContent = arrow;
              const vis = map.getZoom() >= GUIDANCE_MIN_ZOOM;
              el.style.opacity = vis ? '1' : '0';
              el.style.pointerEvents = vis ? 'auto' : 'none';

              const street  = instr.street || '';
              const msg     = instr.combinedMessage || instr.message || '';
              const distKm  = instr.routeOffsetInMeters != null ? `${(instr.routeOffsetInMeters / 1000).toFixed(1)} km from start` : '';
              addMarkerTooltip(el,
                `<strong style="color:#7dd3fc">${(instr.maneuver || 'Step').replace(/_/g, ' ')}</strong>` +
                (street  ? `<br>${street}` : '') +
                (msg     ? `<br><span style="color:#cbd5e1">${msg}</span>` : '') +
                (distKm  ? `<br><span style="color:#64748b;font-size:9px">${distKm}</span>` : '')
              );
              const marker = new tt.Marker({ element: el })
                .setLngLat([instr.point.longitude, instr.point.latitude])
                .addTo(map);
              guidanceMarkersRef.current.push({ marker, el });
            });

            /* Toggle guidance marker visibility on zoom */
            const onZoom = () => {
              const vis = map.getZoom() >= GUIDANCE_MIN_ZOOM;
              guidanceMarkersRef.current.forEach(({ el }) => {
                el.style.opacity = vis ? '1' : '0';
                el.style.pointerEvents = vis ? 'auto' : 'none';
              });
            };
            map.on('zoom', onZoom);
            zoomCleanupRef.current = () => { try { map.off('zoom', onZoom); } catch {} };
          }

        /* ── Reachable Range ──────────────────────────────────────────────── */
        } else if (endpoint === 'reachable-range' && result?.reachableRange) {
          const { boundary, center } = result.reachableRange;
          if (boundary?.length && center) {
            const popup = new tt.Popup({ closeButton: false, closeOnClick: false, offset: 10 });
            popupRef.current = popup;

            const coords = boundary.map(p => [p.longitude, p.latitude]);
            coords.push(coords[0]);
            map.addSource('range', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] } } });
            map.addLayer({ id: 'range-fill', type: 'fill',   source: 'range', paint: { 'fill-color': '#0066cc', 'fill-opacity': 0.12 } });
            map.addLayer({ id: 'range-line', type: 'line',   source: 'range', paint: { 'line-color': '#0066cc', 'line-width': 2, 'line-opacity': 0.75 } });

            /* Isochrone hover */
            const budgetLabel = vals.timeBudgetInSec
              ? `${Math.round(Number(vals.timeBudgetInSec) / 60)} min isochrone`
              : vals.energyBudgetInkWh ? `${vals.energyBudgetInkWh} kWh range`
              : vals.fuelBudgetInLiters ? `${vals.fuelBudgetInLiters} L range` : 'Reachable range';

            map.on('mousemove', 'range-fill', (e) => {
              map.getCanvas().style.cursor = 'crosshair';
              popup.setLngLat(e.lngLat)
                .setHTML(`<div style="font-size:10px;font-family:system-ui;line-height:1.6">` +
                  `<div style="font-weight:700;color:#7dd3fc;margin-bottom:3px">${budgetLabel}</div>` +
                  `<div style="color:#e2e8f0">${boundary.length} boundary points</div>` +
                  `<div style="color:#94a3b8">Centre: ${center.latitude.toFixed(4)}, ${center.longitude.toFixed(4)}</div>` +
                  `</div>`)
                .addTo(map);
            });
            map.on('mouseleave', 'range-fill', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
            });

            /* Centre marker */
            const elC = markerEl('#0066cc', '◎');
            addMarkerTooltip(elC,
              `<strong style="color:#7dd3fc">Origin</strong><br>` +
              `${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)}`);
            const m = new tt.Marker({ element: elC }).setLngLat([center.longitude, center.latitude]).addTo(map);
            markersRef.current = [m];
            sdkFitBounds(map, tt, coords.filter((_, i) => i % 4 === 0), 40, 10);
          }
        }
      };
      if (map.loaded()) update(); else map.once('load', update);
    }).catch(() => {});

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, endpoint, vals.origin, redrawToken]);

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 360 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* Loading overlay */}
      {status === 'running' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            background: 'rgba(0,0,0,0.72)', color: '#fff',
            padding: '7px 16px', borderRadius: 8,
            fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.03em',
          }}>Calculating…</span>
        </div>
      )}
      {/* SDK watermark */}
      <span style={{
        position: 'absolute', bottom: 6, left: 8, zIndex: 2,
        fontSize: '0.5rem', background: 'rgba(0,0,0,0.45)', color: '#fff',
        padding: '2px 5px', borderRadius: 3, pointerEvents: 'none',
        fontFamily: 'var(--font-mono)',
      }}>Maps Web SDK v6</span>
    </div>
  );
}

/* ─── Route summary strip ────────────────────────────────────────────────────── */
function RouteSummary({ routes }) {
  if (!routes?.length) return null;
  const s   = routes[0].summary;
  const km  = (s.lengthInMeters / 1000).toFixed(1);
  const min = Math.round(s.travelTimeInSeconds / 60);
  const delay = s.trafficDelayInSeconds > 0
    ? `+${Math.round(s.trafficDelayInSeconds / 60)} min delay` : 'no delay';
  return (
    <div style={{
      display: 'flex', gap: 16, flexWrap: 'wrap',
      padding: '6px 18px', background: '#161b22',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
    }}>
      <span style={{ color: '#4ade80', fontWeight: 700 }}>● {routes.length} route{routes.length > 1 ? 's' : ''}</span>
      <span style={{ color: '#7dd3fc' }}>{km} km</span>
      <span style={{ color: '#7dd3fc' }}>{min} min</span>
      <span style={{ color: s.trafficDelayInSeconds > 60 ? '#fbbf24' : '#64748b' }}>{delay}</span>
    </div>
  );
}

function RangeSummary({ result }) {
  const pts = result?.reachableRange?.boundary?.length;
  if (!pts) return null;
  return (
    <div style={{
      display: 'flex', gap: 16,
      padding: '6px 18px', background: '#161b22',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
    }}>
      <span style={{ color: '#4ade80', fontWeight: 700 }}>● Reachable range</span>
      <span style={{ color: '#7dd3fc' }}>{pts} boundary points</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * Default state — per endpoint so switching always starts with valid params
 * ═════════════════════════════════════════════════════════════════════════════ */
const DEFAULT_VALS = {
  origin: '51.5074,-0.1278', destination: '53.4808,-2.2426',  /* London → Manchester */
  travelMode: 'car', routeType: 'fastest', traffic: true,
  maxAlternatives: 0, alternativeType: '', minDeviationDistance: '', minDeviationTime: '',
  instructionsType: 'text', language: 'en-GB', avoid: [], sectionType: ['traffic'], computeBestOrder: false,
  departAt: '', arriveAt: '',
  routeRepresentation: '', computeTravelTimeFor: '', vehicleHeading: '', report: '',
  includeTollPaymentTypes: false, hilliness: '', windingness: '',
  vehicleEngineType: '', vehicleMaxSpeed: '', vehicleWeight: '', vehicleAxleWeight: '',
  vehicleNumberOfAxles: '', vehicleLength: '', vehicleWidth: '', vehicleHeight: '',
  vehicleCommercial: false, vehicleLoadType: [], vehicleAdrTunnelRestrictionCode: '',
  vehicleHasElectricTollCollectionTransponder: false,
  constantSpeedConsumptionInLitersPerHundredkm: '', currentFuelInLiters: '',
  auxiliaryPowerInLitersPerHour: '', fuelEnergyDensityInMJoulesPerLiter: '',
  accelerationEfficiency: '', decelerationEfficiency: '', uphillEfficiency: '', downhillEfficiency: '',
  constantSpeedConsumptionInkWhPerHundredkm: '', currentChargeInkWh: '', maxChargeInkWh: '',
  auxiliaryPowerInkW: '', consumptionInkWhPerkmAltitudeGain: '', recuperationInkWhPerkmAltitudeLoss: '',
  fuelBudgetInLiters: '', energyBudgetInkWh: '', timeBudgetInSec: '',
  /* POST body */
  supportingPoints: '', allowVignette: [], avoidVignette: [], avoidAreas: '',
};

/* Sensible defaults per endpoint — reachable-range needs a budget param */
const ENDPOINT_DEFAULTS = {
  'calculate-route': DEFAULT_VALS,
  'reachable-range': {
    ...DEFAULT_VALS,
    origin: '51.5074,-0.1278',  /* London */
    destination: '',             /* not used for range */
    timeBudgetInSec: '3600',    /* 1-hour isochrone — required */
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
 * Page
 * ═════════════════════════════════════════════════════════════════════════════ */
export default function RoutingExplorer({ onNavigate, isDark = false }) {
  const [version,   setVersion]  = useState('v1');
  const [method,    setMethod]   = useState('GET');
  const [endpoint,  setEndpoint] = useState('calculate-route');
  const [vals,      setVals]     = useState(DEFAULT_VALS);
  const [waypoints, setWaypoints] = useState([]);
  const [evPreset,  setEvPreset]  = useState(null);
  const [apiKey,   setApiKey]   = useState(() => localStorage.getItem(LS_KEY) || DEMO_KEY);
  const [status,   setStatus]   = useState('idle');
  const [result,   setResult]   = useState(null);
  const [elapsed,  setElapsed]  = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [mapHeight,   setMapHeight]   = useState(360);
  const mapHeightRef = useRef(360);
  const copyTimer      = useRef(null);
  const isFirstRender  = useRef(true);   /* skip endpoint effect on initial mount */

  /* Map resize — drag handle at bottom of map */
  const MAP_MIN = 0;
  const startMapDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = mapHeightRef.current;
    const onMove = (ev) => {
      const maxH = Math.round(window.innerHeight * 0.92);
      const newH = Math.max(MAP_MIN, Math.min(maxH, startH + (ev.clientY - startY)));
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
  /* keep ref in sync with state (e.g. on reset) */
  useEffect(() => { mapHeightRef.current = mapHeight; }, [mapHeight]);

  useEffect(() => {
    apiKey ? localStorage.setItem(LS_KEY, apiKey) : localStorage.removeItem(LS_KEY);
  }, [apiKey]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  /* version or method change — just clear result */
  useEffect(() => { setResult(null); setStatus('idle'); }, [version, method]);

  /* endpoint change — reset to endpoint-appropriate defaults + auto-fire */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const defaults = ENDPOINT_DEFAULTS[endpoint] ?? DEFAULT_VALS;
    setVals(defaults);
    setWaypoints([]);
    setEvPreset(null);
    setResult(null); setStatus('idle');
    doRun(defaults, DEMO_KEY, endpoint, version, 'GET', []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const set         = (k, v) => setVals(prev => ({ ...prev, [k]: v }));
  const activeKey   = apiKey || DEMO_KEY;
  const isRange     = endpoint === 'reachable-range';
  const isCombustion = ['combustion', 'mildhybrid'].includes(vals.vehicleEngineType);
  const isEV         = ['electric', 'pluginhybrid'].includes(vals.vehicleEngineType);
  const isThrilling  = vals.routeType === 'thrilling';
  const epInfo       = ENDPOINTS.find(e => e.value === endpoint);

  /* Core fetch — callable with explicit params (used by auto-fire on mount) */
  const doRun = async (v, key, ep, ver, meth, wps = []) => {
    setStatus('running'); setResult(null); setElapsed(null);
    const t0 = performance.now();
    try {
      const { url, options } = buildFetchConfig(v, key, ep, ver, meth, wps);
      const res  = await fetch(url, options);
      const data = await res.json();
      setElapsed(Math.round(performance.now() - t0));
      setResult(data);
      setStatus(res.ok ? 'ok' : 'error');
    } catch (err) {
      setResult({ error: err.message });
      setStatus('error');
    }
  };

  const run = () => doRun(vals, activeKey, endpoint, version, method, waypoints);

  /* Auto-fire default route on first load */
  useEffect(() => {
    doRun(DEFAULT_VALS, DEMO_KEY, 'calculate-route', 'v1', 'GET');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(buildCurlStr(vals, apiKey || DEMO_KEY, endpoint, version, method, waypoints)).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Helpers for pill-driven selects ── */
  const sel = (key, v) => set(key, vals[key] === v ? DEFAULT_VALS[key] : v);

  /* ── Apply EV vehicle preset ── */
  const EV_PRESET_LABELS = { city: 'City EV', family: 'Family', performance: 'Performance', suv: 'SUV' };
  const applyEvPreset = (key) => {
    const p = EV_PRESETS[key];
    // [[speed km/h, Wh/km]] → "speed,kWh/100km:..." (kWh/100km = Wh/km ÷ 10)
    const curve = p.consumption.map(([s, wh]) => `${s},${(wh / 10).toFixed(2)}`).join(':');
    setEvPreset(key);
    setVals(prev => ({
      ...prev,
      vehicleEngineType: 'electric',
      constantSpeedConsumptionInkWhPerHundredkm: curve,
      maxChargeInkWh:    String(p.capacity),
      currentChargeInkWh: String(p.soe),
      auxiliaryPowerInkW: String((p.auxPower / 1000).toFixed(1)),
    }));
  };

  /* ─────────────────────────────────────────────────── */
  return (
    <div className="page page--wide" style={{ '--map-h': `${mapHeight}px` }}>

      {/* ── Hero map: full-bleed, sticky — breaks out of .page padding ───────── */}
      {/* marginTop:-32 marginLeft/Right:-40 cancel the page's 32px/40px padding */}
      {/* Shadow wrapper sits outside overflow:hidden so the shadow isn't clipped */}
      <div style={{
        position: 'sticky', top: 'var(--app-top-offset)', zIndex: 5,
        marginTop: -32, marginLeft: -40, marginRight: -40,
        marginBottom: 32,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      }}>
      <div style={{ height: mapHeight, overflow: 'hidden' }}>
        <RouteMap
          result={result}
          endpoint={endpoint}
          vals={vals}
          apiKey={activeKey}
          status={status}
          waypoints={waypoints}
          isDark={isDark}
        />
      </div>{/* overflow:hidden clip */}

      {/* ── Resize handle ── */}
      <div
        className="map-resize-handle"
        onMouseDown={startMapDrag}
        title="Drag to resize map"
      >
        <div className="map-resize-handle__grip" />
      </div>

      </div>{/* shadow wrapper */}

      {/* ── Two-column grid ──────────────────────────────────────────────────── */}
      <div className="api-ref-sections">
        <div className="api-ref-section api-ref-section--explorer" id="route-planning" style={{ gridTemplateRows: 'auto' }}>

          {/* ── LEFT: page header + param form ── */}
          {/* --pg-sticky-top overrides the ParamGroup sticky offset to sit below the hero map */}
          <div className="api-ref-section-left" style={{ '--pg-sticky-top': 'calc(var(--app-top-offset) + var(--map-h, 360px) + 20px)' }}>

            {/* Page header lives inside the left column so the right column (code panel) aligns with it */}
            <div className="page-header page-header--with-tabs" style={{ marginBottom: 24 }}>
              <h1>API Explorer</h1>
              <VersionTabBar versions={['v1', 'v2']} activeTab={version} onTabChange={setVersion} />
            </div>

            {/* ── ENDPOINT SELECTOR ── */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>

                {/* Calculate Route illustrated card */}
                {(() => {
                  const active = endpoint === 'calculate-route';
                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setEndpoint('calculate-route')}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEndpoint('calculate-route'); } }}
                      style={{
                        textAlign: 'left', borderRadius: 16, cursor: 'pointer',
                        border: `1.5px solid ${active ? '#e2001a' : 'var(--border)'}`,
                        background: active ? 'rgba(226,0,26,0.02)' : 'var(--s1)',
                        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                        outline: 'none', padding: 0, overflow: 'hidden',
                        boxShadow: active ? '0 0 0 3px rgba(226,0,26,0.08)' : 'none',
                      }}
                    >
                      {/* Illustration */}
                      <div style={{ height: 88, borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
                        <ThumbCalculateRoute />
                      </div>
                      {/* Card body */}
                      <div style={{ padding: '10px 14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                          {active ? (
                            <div
                              onClick={e => e.stopPropagation()}
                              style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}
                            >
                              {['GET', 'POST'].map(m => (
                                <button key={m} onClick={() => setMethod(m)} style={{
                                  padding: '1px 7px', border: 'none', cursor: 'pointer',
                                  fontSize: '0.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.07em',
                                  background: method === m
                                    ? (m === 'POST' ? 'rgba(34,197,94,0.15)' : 'rgba(125,211,252,0.15)')
                                    : 'transparent',
                                  color: method === m ? (m === 'POST' ? '#4ade80' : '#7dd3fc') : 'var(--muted)',
                                  transition: 'all 0.15s',
                                  borderRight: m === 'GET' ? '1px solid var(--border)' : 'none',
                                }}>{m}</button>
                              ))}
                            </div>
                          ) : (
                            <span style={{
                              fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.07em',
                              fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 3,
                              background: 'rgba(125,211,252,0.10)', color: '#7dd3fc',
                            }}>GET / POST</span>
                          )}
                          {active && <span style={{ fontSize: '0.4375rem', fontWeight: 700, letterSpacing: '0.1em', color: '#e2001a', textTransform: 'uppercase' }}>● active</span>}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 3, color: active ? 'var(--black)' : 'var(--mid)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                          Calculate Route
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                          Calculate one or more routes between waypoints with full vehicle profile, traffic, and guidance support.
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Reachable Range illustrated card */}
                {(() => {
                  const active = endpoint === 'reachable-range';
                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setEndpoint('reachable-range')}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEndpoint('reachable-range'); } }}
                      style={{
                        textAlign: 'left', borderRadius: 16, cursor: 'pointer',
                        border: `1.5px solid ${active ? '#e2001a' : 'var(--border)'}`,
                        background: active ? 'rgba(226,0,26,0.02)' : 'var(--s1)',
                        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                        outline: 'none', padding: 0, overflow: 'hidden',
                        boxShadow: active ? '0 0 0 3px rgba(226,0,26,0.08)' : 'none',
                      }}
                    >
                      {/* Illustration */}
                      <div style={{ height: 88, borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
                        <ThumbReachableRange />
                      </div>
                      {/* Card body */}
                      <div style={{ padding: '10px 14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                          <span style={{
                            fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.07em',
                            fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 3,
                            background: 'rgba(125,211,252,0.10)', color: '#7dd3fc',
                          }}>GET</span>
                          {active && <span style={{ fontSize: '0.4375rem', fontWeight: 700, letterSpacing: '0.1em', color: '#e2001a', textTransform: 'uppercase' }}>● active</span>}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 3, color: active ? 'var(--black)' : 'var(--mid)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                          Reachable Range
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                          Calculate the isochrone polygon reachable within a given time, distance, fuel, or energy budget from an origin point.
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* ── COMPACT FLAT PARAM LIST ── */}
            {(() => {
              const cIn  = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--black)', outline: 'none', width: 170 };
              const cNum = { ...cIn, width: 88 };
              const blkP = { padding: '0 14px' };
              return (
                <>
                  {/* ── Route Builder ── */}
                  <SectionCard label="Route">
                  {/* Visual stop list: origin → [waypoints] → destination */}
                  <div style={{ padding: '10px 14px 14px' }}>
                    {/* Origin */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      {/* Dot + connector column */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff', boxShadow: '0 0 0 1.5px #22c55e', flexShrink: 0 }} />
                        {!isRange && (
                          <div style={{ width: 2, flex: 1, minHeight: 10, background: 'var(--border)', margin: '2px 0' }} />
                        )}
                      </div>
                      <PlaceSearch
                        value={vals.origin}
                        onChange={v => set('origin', v)}
                        placeholder="Origin — search or lat,lon"
                        apiKey={activeKey}
                      />
                    </div>

                    {/* Waypoints (calculate-route only) */}
                    {!isRange && waypoints.map((wp, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border)', border: '2px solid var(--bg)', boxShadow: '0 0 0 1.5px var(--mid)', flexShrink: 0 }} />
                          <div style={{ width: 2, flex: 1, minHeight: 10, background: 'var(--border)', margin: '2px 0' }} />
                        </div>
                        <PlaceSearch
                          value={wp}
                          onChange={v => setWaypoints(prev => prev.map((w, j) => j === i ? v : w))}
                          placeholder={`Stop ${i + 1} — search or lat,lon`}
                          apiKey={activeKey}
                        />
                        <button
                          onClick={() => setWaypoints(prev => prev.filter((_, j) => j !== i))}
                          title="Remove stop"
                          style={{
                            flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                            border: '1px solid var(--border)', background: 'var(--bg)',
                            color: 'var(--muted)', cursor: 'pointer', fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            lineHeight: 1, padding: 0,
                          }}
                        >×</button>
                      </div>
                    ))}

                    {/* Add stop button (calculate-route, under max) */}
                    {!isRange && waypoints.length < MAX_WAYPOINTS && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                          <div style={{ width: 2, flex: 1, minHeight: 10, background: 'var(--border)', margin: '0 0 2px' }} />
                        </div>
                        <button
                          onClick={() => setWaypoints(prev => [...prev, ''])}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: 'transparent', border: '1px dashed var(--border)',
                            borderRadius: 7, padding: '4px 10px', cursor: 'pointer',
                            fontSize: '0.6875rem', color: 'var(--muted)',
                            fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--mid)'; e.currentTarget.style.color = 'var(--black)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
                        >
                          <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>+</span> Add stop
                          {waypoints.length > 0 && <span style={{ opacity: 0.5 }}>{waypoints.length}/{MAX_WAYPOINTS}</span>}
                        </button>
                      </div>
                    )}

                    {/* Destination (calculate-route only) */}
                    {!isRange && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2001a', border: '2px solid #fff', boxShadow: '0 0 0 1.5px #e2001a', flexShrink: 0 }} />
                        </div>
                        <PlaceSearch
                          value={vals.destination}
                          onChange={v => set('destination', v)}
                          placeholder="Destination — search or lat,lon"
                          apiKey={activeKey}
                        />
                      </div>
                    )}
                  </div>
                  {isRange && (
                    <div style={blkP}>
                      <CompactParamRow name="fuelBudgetInLiters" type="float" desc="Fuel budget in litres for combustion vehicles."
                        control={<input type="number" style={cNum} value={vals.fuelBudgetInLiters} onChange={e => set('fuelBudgetInLiters', e.target.value)} placeholder="e.g. 5.0" />}
                      />
                      <CompactParamRow name="energyBudgetInkWh" type="float" desc="Energy budget in kWh for electric vehicles."
                        control={<input type="number" style={cNum} value={vals.energyBudgetInkWh} onChange={e => set('energyBudgetInkWh', e.target.value)} placeholder="e.g. 43.0" />}
                      />
                      <CompactParamRow name="timeBudgetInSec" type="integer" desc="Time budget in seconds (max 14400)."
                        control={<input type="number" style={cNum} value={vals.timeBudgetInSec} onChange={e => set('timeBudgetInSec', e.target.value)} placeholder="e.g. 3600" min={0} max={14400} />}
                      />
                    </div>
                  )}
                  </SectionCard>

                  {/* ── Travel ── */}
                  <SectionCard label="Travel"><div style={blkP}>
                    <CompactParamRow name="travelMode" type="string" default="car" desc="Vehicle type determining permitted road access."
                      values={['car','truck','taxi','bus','van','motorcycle','bicycle','pedestrian']}
                      selectedValue={vals.travelMode} onSelect={v => sel('travelMode', v)}
                    />
                    <CompactParamRow name="routeType" type="string" default="fastest" desc="Optimisation objective for the route."
                      values={['fastest','shortest','eco','thrilling']}
                      selectedValue={vals.routeType} onSelect={v => sel('routeType', v)}
                    />
                    {isThrilling && (<>
                      <CompactParamRow name="hilliness" type="string" desc="Degree of hilliness for thrilling routes."
                        values={['low','normal','high']} selectedValue={vals.hilliness} onSelect={v => sel('hilliness', v)}
                      />
                      <CompactParamRow name="windingness" type="string" desc="Level of windingness for thrilling routes."
                        values={['low','normal','high']} selectedValue={vals.windingness} onSelect={v => sel('windingness', v)}
                      />
                    </>)}
                    <CompactParamRow name="traffic" type="boolean" desc="Use real-time and historic traffic data."
                      control={<ToggleControl value={vals.traffic} onChange={v => set('traffic', v)} />}
                    />
                  </div></SectionCard>

                  {/* ── Timing ── */}
                  <SectionCard label="Timing"><div style={blkP}>
                    <CompactParamRow name="departAt" type="string" desc="ISO 8601 departure time. Default: now. Cannot combine with arriveAt."
                      control={<input style={cIn} value={vals.departAt} onChange={e => set('departAt', e.target.value)} placeholder="2025-10-27T08:00:00" />}
                    />
                    <CompactParamRow name="arriveAt" type="string" desc="ISO 8601 arrival time. Cannot combine with departAt."
                      control={<input style={cIn} value={vals.arriveAt} onChange={e => set('arriveAt', e.target.value)} placeholder="2025-10-27T10:00:00" />}
                    />
                  </div></SectionCard>

                  {/* ── Alternatives (Calculate Route only) ── */}
                  {!isRange && (
                    <SectionCard label="Alternatives"><div style={blkP}>
                      <CompactParamRow name="maxAlternatives" type="integer" desc="Number of alternative routes to return (0–5)."
                        control={<input type="number" style={cNum} min={0} max={5} value={vals.maxAlternatives} onChange={e => set('maxAlternatives', Math.max(0, Math.min(5, Number(e.target.value))))} />}
                      />
                      <CompactParamRow name="alternativeType" type="string" desc="Controls how alternatives diverge from the best route."
                        values={['anyRoute','betterRoute']} selectedValue={vals.alternativeType} onSelect={v => sel('alternativeType', v)}
                      />
                      <CompactParamRow name="minDeviationDistance" type="integer" desc="Min distance in metres before an alternative may diverge."
                        control={<input type="number" style={cNum} min={0} value={vals.minDeviationDistance} onChange={e => set('minDeviationDistance', e.target.value)} placeholder="e.g. 500" />}
                      />
                      <CompactParamRow name="minDeviationTime" type="integer" desc="Min travel time in seconds before an alternative may diverge."
                        control={<input type="number" style={cNum} min={0} value={vals.minDeviationTime} onChange={e => set('minDeviationTime', e.target.value)} placeholder="e.g. 120" />}
                      />
                    </div></SectionCard>
                  )}

                  {/* ── Avoidances ── */}
                  <SectionCard label="Avoidances"><div style={blkP}>
                    <CompactParamRow name="avoid" type="string" multiline desc="Road or feature types to exclude. Repeatable."
                      control={<MultiSelect options={['motorways','tollRoads','ferries','unpavedRoads','tunnels','carTrains','borderCrossings','lowEmissionZones','carpools']} selected={vals.avoid} onChange={v => set('avoid', v)} />}
                    />
                  </div></SectionCard>

                  {/* ── Request body (POST only) ── */}
                  {method === 'POST' && (
                    <SectionCard label="Request body"><div style={blkP}>
                      <CompactParamRow name="supportingPoints" type="object[]" multiline desc="Waypoints the route is snapped to. One lat,lon per line."
                        control={<textarea style={{ ...cIn, width: '100%', height: 72, resize: 'vertical', lineHeight: 1.6 }} value={vals.supportingPoints} onChange={e => set('supportingPoints', e.target.value)} placeholder={'52.5009,13.4053\n52.5074,13.3884'} />}
                      />
                      <CompactParamRow name="allowVignette" type="string[]" multiline desc="Country codes (ISO α-3) where vignette costs are acceptable."
                        control={<MultiSelect options={VIGNETTE_COUNTRIES} selected={vals.allowVignette} onChange={v => set('allowVignette', v)} />}
                      />
                      <CompactParamRow name="avoidVignette" type="string[]" multiline desc="Country codes where vignette roads should be avoided."
                        control={<MultiSelect options={VIGNETTE_COUNTRIES} selected={vals.avoidVignette} onChange={v => set('avoidVignette', v)} />}
                      />
                      <CompactParamRow name="avoidAreas" type="object" multiline desc='Bounding boxes to avoid. JSON with a "rectangles" array.'
                        control={<textarea style={{ ...cIn, width: '100%', height: 90, resize: 'vertical', lineHeight: 1.6, fontSize: '0.7rem' }} value={vals.avoidAreas} onChange={e => set('avoidAreas', e.target.value)} placeholder={'{\n  "rectangles": [{ "southWestCorner": {...}, "northEastCorner": {...} }]\n}'} />}
                      />
                    </div></SectionCard>
                  )}

                  {/* ── Advanced ── */}
                  <SectionCard label="Advanced"><div style={blkP}>
                    {!isRange && (
                      <CompactParamRow name="computeBestOrder" type="boolean" desc="Re-order waypoints to find the optimal visiting sequence."
                        control={<ToggleControl value={vals.computeBestOrder} onChange={v => set('computeBestOrder', v)} />}
                      />
                    )}
                    <CompactParamRow name="routeRepresentation" type="string" desc="Representation of routes in the response."
                      values={['polyline','summaryOnly','none']} selectedValue={vals.routeRepresentation} onSelect={v => sel('routeRepresentation', v)}
                    />
                    <CompactParamRow name="computeTravelTimeFor" type="string" desc="Return travel times for all traffic types."
                      values={['none','all']} selectedValue={vals.computeTravelTimeFor} onSelect={v => sel('computeTravelTimeFor', v)}
                    />
                    <CompactParamRow name="vehicleHeading" type="integer" desc="Compass bearing of the vehicle in degrees (0–359)."
                      control={<input type="number" style={cNum} min={0} max={359} value={vals.vehicleHeading} onChange={e => set('vehicleHeading', e.target.value)} placeholder="e.g. 90" />}
                    />
                    <CompactParamRow name="report" type="string" desc="Reports the effective settings used in the current call."
                      values={['effectiveSettings']} selectedValue={vals.report} onSelect={v => sel('report', v)}
                    />
                  </div></SectionCard>

                  {/* ── Vehicle ── */}
                  <SectionCard label="Vehicle"><div style={blkP}>
                    <CompactParamRow name="vehicleEngineType" type="string" desc="Engine type. Combustion/EV reveals consumption params below."
                      values={['combustion','electric','mildhybrid','pluginhybrid']}
                      selectedValue={vals.vehicleEngineType} onSelect={v => sel('vehicleEngineType', v)}
                    />
                    <CompactParamRow name="vehicleMaxSpeed" type="integer" desc="Max speed in km/h (0–250)."
                      control={<input type="number" style={cNum} min={0} max={250} value={vals.vehicleMaxSpeed} onChange={e => set('vehicleMaxSpeed', e.target.value)} placeholder="e.g. 120" />}
                    />
                    <CompactParamRow name="vehicleWeight" type="integer" desc="Vehicle + cargo weight in kg."
                      control={<input type="number" style={cNum} min={0} value={vals.vehicleWeight} onChange={e => set('vehicleWeight', e.target.value)} placeholder="e.g. 1600" />}
                    />
                    <CompactParamRow name="vehicleAxleWeight" type="integer" desc="Weight per axle in kg (0–11500)."
                      control={<input type="number" style={cNum} min={0} max={11500} value={vals.vehicleAxleWeight} onChange={e => set('vehicleAxleWeight', e.target.value)} placeholder="e.g. 1000" />}
                    />
                    <CompactParamRow name="vehicleNumberOfAxles" type="integer" desc="Number of axles (2–255)."
                      control={<input type="number" style={cNum} min={2} max={255} value={vals.vehicleNumberOfAxles} onChange={e => set('vehicleNumberOfAxles', e.target.value)} placeholder="e.g. 2" />}
                    />
                    <CompactParamRow name="vehicleLength" type="float" desc="Vehicle length in metres (0–300)."
                      control={<input type="number" style={cNum} min={0} max={300} step={0.1} value={vals.vehicleLength} onChange={e => set('vehicleLength', e.target.value)} placeholder="e.g. 4.5" />}
                    />
                    <CompactParamRow name="vehicleWidth" type="float" desc="Vehicle width in metres (0–50)."
                      control={<input type="number" style={cNum} min={0} max={50} step={0.1} value={vals.vehicleWidth} onChange={e => set('vehicleWidth', e.target.value)} placeholder="e.g. 2.0" />}
                    />
                    <CompactParamRow name="vehicleHeight" type="float" desc="Vehicle height in metres (0–50)."
                      control={<input type="number" style={cNum} min={0} max={50} step={0.1} value={vals.vehicleHeight} onChange={e => set('vehicleHeight', e.target.value)} placeholder="e.g. 1.5" />}
                    />
                    <CompactParamRow name="vehicleCommercial" type="boolean" desc="Vehicle used for commercial purposes (affects road restrictions)."
                      control={<ToggleControl value={vals.vehicleCommercial} onChange={v => set('vehicleCommercial', v)} />}
                    />
                    <CompactParamRow name="vehicleLoadType" type="string (repeatable)" desc="Hazardous material classification for routing restrictions." multiline
                      control={<MultiSelect
                        options={['USHazmatClass1','USHazmatClass2','USHazmatClass3','USHazmatClass4','USHazmatClass5','USHazmatClass6','USHazmatClass7','USHazmatClass8','USHazmatClass9','otherHazmatExplosive','otherHazmatGeneral','otherHazmatHarmfulToWater']}
                        selected={vals.vehicleLoadType}
                        onChange={v => set('vehicleLoadType', v)}
                      />}
                    />
                    <CompactParamRow name="vehicleAdrTunnelRestrictionCode" type="string" desc="ADR tunnel restriction code for hazardous goods (B–E)."
                      values={['B','C','D','E']} selectedValue={vals.vehicleAdrTunnelRestrictionCode} onSelect={v => sel('vehicleAdrTunnelRestrictionCode', v)}
                    />
                    <CompactParamRow name="vehicleHasElectricTollCollectionTransponder" type="boolean" desc="Vehicle has an e-toll transponder."
                      control={<ToggleControl value={vals.vehicleHasElectricTollCollectionTransponder} onChange={v => set('vehicleHasElectricTollCollectionTransponder', v)} />}
                    />
                  </div></SectionCard>

                  {/* ── Combustion model ── */}
                  {isCombustion && (
                    <SectionCard label="Combustion model"><div style={blkP}>
                      <CompactParamRow name="constantSpeedConsumptionInLitersPerHundredkm" type="string" desc="Speed:consumption pairs in km/h and L/100km (e.g. 50,6.3:90,7.5)."
                        control={<input style={cIn} value={vals.constantSpeedConsumptionInLitersPerHundredkm} onChange={e => set('constantSpeedConsumptionInLitersPerHundredkm', e.target.value)} placeholder="50,6.3:90,7.5" />}
                      />
                      <CompactParamRow name="currentFuelInLiters" type="float" desc="Current fuel level in litres."
                        control={<input type="number" style={cNum} min={0} value={vals.currentFuelInLiters} onChange={e => set('currentFuelInLiters', e.target.value)} placeholder="e.g. 43.0" />}
                      />
                      <CompactParamRow name="auxiliaryPowerInLitersPerHour" type="float" desc="Fuel draw from auxiliary systems (L/hour)."
                        control={<input type="number" style={cNum} min={0} step={0.1} value={vals.auxiliaryPowerInLitersPerHour} onChange={e => set('auxiliaryPowerInLitersPerHour', e.target.value)} placeholder="e.g. 0.5" />}
                      />
                      <CompactParamRow name="fuelEnergyDensityInMJoulesPerLiter" type="float" desc="Fuel energy density in MJ/L (default: 34.2 petrol)."
                        control={<input type="number" style={cNum} min={0} step={0.1} value={vals.fuelEnergyDensityInMJoulesPerLiter} onChange={e => set('fuelEnergyDensityInMJoulesPerLiter', e.target.value)} placeholder="e.g. 34.2" />}
                      />
                      <CompactParamRow name="accelerationEfficiency" type="float" desc="Kinetic→fuel efficiency during acceleration (0–1)."
                        control={<input type="number" style={cNum} min={0} max={1} step={0.01} value={vals.accelerationEfficiency} onChange={e => set('accelerationEfficiency', e.target.value)} placeholder="e.g. 0.33" />}
                      />
                      <CompactParamRow name="decelerationEfficiency" type="float" desc="Kinetic→heat efficiency during braking (0–1)."
                        control={<input type="number" style={cNum} min={0} max={1} step={0.01} value={vals.decelerationEfficiency} onChange={e => set('decelerationEfficiency', e.target.value)} placeholder="e.g. 0.33" />}
                      />
                      <CompactParamRow name="uphillEfficiency" type="float" desc="Potential→fuel efficiency uphill (0–1)."
                        control={<input type="number" style={cNum} min={0} max={1} step={0.01} value={vals.uphillEfficiency} onChange={e => set('uphillEfficiency', e.target.value)} placeholder="e.g. 0.33" />}
                      />
                      <CompactParamRow name="downhillEfficiency" type="float" desc="Fuel→potential efficiency downhill (0–1)."
                        control={<input type="number" style={cNum} min={0} max={1} step={0.01} value={vals.downhillEfficiency} onChange={e => set('downhillEfficiency', e.target.value)} placeholder="e.g. 0.33" />}
                      />
                    </div></SectionCard>
                  )}

                  {/* ── EV model ── */}
                  {isEV && (
                    <SectionCard label="EV consumption model">
                      {/* ── Preset selector + sparkline ── */}
                      <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: evPreset ? 14 : 0 }}>
                          {Object.entries(EV_PRESETS).map(([key, p]) => {
                            const active = evPreset === key;
                            return (
                              <button key={key} onClick={() => applyEvPreset(key)} style={{
                                padding: '7px 4px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                border: `1.5px solid ${active ? p.color : 'var(--border)'}`,
                                background: active ? `${p.color}14` : 'transparent',
                                outline: 'none', transition: 'all 0.15s',
                              }}>
                                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: active ? p.color : 'var(--mid)', fontFamily: 'var(--font-mono)', marginBottom: 1 }}>
                                  {EV_PRESET_LABELS[key]}
                                </div>
                                <div style={{ fontSize: '0.5625rem', color: 'var(--muted)' }}>{p.capacity} kWh</div>
                              </button>
                            );
                          })}
                        </div>
                        {evPreset && (
                          <div style={{ marginTop: 2 }}>
                            <div style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
                              Consumption curve — {EV_PRESET_LABELS[evPreset]}
                            </div>
                            <ConsumptionCurve
                              points={EV_PRESETS[evPreset].consumption}
                              color={EV_PRESETS[evPreset].color}
                              width={432} height={72}
                              showLabel={false}
                            />
                          </div>
                        )}
                      </div>
                      {/* ── Raw params ── */}
                      <div style={blkP}>
                        <CompactParamRow name="constantSpeedConsumptionInkWhPerHundredkm" type="string" desc="Speed:consumption pairs in km/h and kWh/100km."
                          control={<input style={cIn} value={vals.constantSpeedConsumptionInkWhPerHundredkm} onChange={e => { setEvPreset(null); set('constantSpeedConsumptionInkWhPerHundredkm', e.target.value); }} placeholder="50,6.3:90,7.5" />}
                        />
                        <CompactParamRow name="currentChargeInkWh" type="float" desc="Current battery charge in kWh."
                          control={<input type="number" style={cNum} min={0} value={vals.currentChargeInkWh} onChange={e => set('currentChargeInkWh', e.target.value)} placeholder="e.g. 43.0" />}
                        />
                        <CompactParamRow name="maxChargeInkWh" type="float" desc="Maximum battery capacity in kWh."
                          control={<input type="number" style={cNum} min={0} value={vals.maxChargeInkWh} onChange={e => set('maxChargeInkWh', e.target.value)} placeholder="e.g. 85.0" />}
                        />
                        <CompactParamRow name="auxiliaryPowerInkW" type="float" desc="Auxiliary system power draw in kW."
                          control={<input type="number" style={cNum} min={0} step={0.1} value={vals.auxiliaryPowerInkW} onChange={e => set('auxiliaryPowerInkW', e.target.value)} placeholder="e.g. 1.7" />}
                        />
                        <CompactParamRow name="consumptionInkWhPerkmAltitudeGain" type="float" desc="Extra energy per km per metre of altitude gain."
                          control={<input type="number" style={cNum} min={0} step={0.000001} value={vals.consumptionInkWhPerkmAltitudeGain} onChange={e => set('consumptionInkWhPerkmAltitudeGain', e.target.value)} placeholder="0.000083" />}
                        />
                        <CompactParamRow name="recuperationInkWhPerkmAltitudeLoss" type="float" desc="Recuperated energy per km per metre of altitude loss."
                          control={<input type="number" style={cNum} min={0} step={0.000001} value={vals.recuperationInkWhPerkmAltitudeLoss} onChange={e => set('recuperationInkWhPerkmAltitudeLoss', e.target.value)} placeholder="0.000083" />}
                        />
                      </div>
                    </SectionCard>
                  )}

                  {/* ── Output (Calculate Route only) ── */}
                  {!isRange && (
                    <SectionCard label="Output"><div style={blkP}>
                      <CompactParamRow name="instructionsType" type="string" desc="Activates turn-by-turn guidance in the response."
                        values={['coded','text','tagged']} selectedValue={vals.instructionsType} onSelect={v => sel('instructionsType', v)}
                      />
                      <CompactParamRow name="sectionType" type="string" multiline desc="Section types to include in sections[]. Repeatable."
                        control={<MultiSelect options={['travelMode','traffic','toll','motorway','tunnel','ferry','speedLimit','lanes','roadShields']} selected={vals.sectionType} onChange={v => set('sectionType', v)} />}
                      />
                      <CompactParamRow name="language" type="string" default="en-GB" desc="Language tag for instruction text."
                        control={<input style={{ ...cIn, width: 120 }} value={vals.language} onChange={e => set('language', e.target.value)} placeholder="en-GB" />}
                      />
                    </div></SectionCard>
                  )}
                </>
              );
            })()}

          </div>

          {/* ── RIGHT: request panel — sticky offset handled by .re-code CSS class ── */}
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
                      background: endpoint === 'calculate-route' ? 'rgba(125,211,252,0.12)' : 'rgba(167,139,250,0.12)',
                      color: endpoint === 'calculate-route' ? '#7dd3fc' : '#a78bfa',
                      border: `1px solid ${endpoint === 'calculate-route' ? 'rgba(125,211,252,0.2)' : 'rgba(167,139,250,0.2)'}`,
                    }}>
                      {endpoint === 'calculate-route' ? 'Calculate Route' : 'Reachable Range'}
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

                <LiveUrl vals={vals} endpoint={endpoint} version={version} method={method} waypoints={waypoints} />

                {/* Run bar */}
                <div style={{
                  padding: '8px 14px', background: '#0d1117',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {apiKey === DEMO_KEY ? '🔑 demo key' : '🔑 your key'}
                  </span>
                  <button onClick={run} disabled={status === 'running'} style={{
                    padding: '6px 18px', borderRadius: 7, border: 'none',
                    background: status === 'running' ? '#1e293b' : '#e2001a',
                    color: status === 'running' ? '#475569' : '#fff',
                    fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em',
                    cursor: status === 'running' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s',
                  }}>
                    {status === 'running' ? <><span style={{ fontSize: '0.5rem' }}>●</span> Running…</> : <><span>▶</span> Run</>}
                  </button>
                </div>

                {/* Response */}
                {(status === 'ok' || status === 'error') && result && (
                  <>
                    {status === 'ok' && result.routes        && <RouteSummary routes={result.routes} />}
                    {status === 'ok' && result.reachableRange && <RangeSummary result={result} />}
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
                    <JsonOut data={result} />
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
