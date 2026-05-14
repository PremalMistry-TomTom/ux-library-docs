import { useState, useEffect, useRef, useCallback } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { IlloMapRasterTile, IlloMapStaticImage } from './IntroIllustrations';
import { makeThumb, L_MapRasterTile, L_MapStaticImage } from '../illustrations/lightVariants';
import { IcoMapRasterTile, IcoMapStaticImage } from '../illustrations/iconVariants';

const ThumbRasterTile  = makeThumb(IlloMapRasterTile,   L_MapRasterTile,   IcoMapRasterTile);
const ThumbStaticImage = makeThumb(IlloMapStaticImage,  L_MapStaticImage,  IcoMapStaticImage);

/* ─────────────────────────────────────────────────────────────────────────────
 * MapDisplayExplorer — live API request builder.
 * Supports:
 *   • Raster Map Tile  (GET /map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.{format})
 *   • Static Image     (GET /map/1/staticimage)
 *
 * No TomTom Maps SDK needed — results are image URLs rendered directly via <img>.
 * ───────────────────────────────────────────────────────────────────────────── */

const DEMO_KEY = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const LS_KEY   = 'tt-explorer-key';

/* ── Lat/Lon → Tile X/Y ──────────────────────────────────────────────────── */
function latLonToTile(lat, lon, zoom) {
  const n      = Math.pow(2, zoom);
  const x      = Math.floor((lon + 180) / 360 * n);
  const latRad = (lat * Math.PI) / 180;
  const y      = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) };
}

/* ── Build a raster tile URL ─────────────────────────────────────────────── */
function tileUrl(key, layer, style, zoom, x, y, format, tileSize) {
  const base   = `https://api.tomtom.com/map/1/tile/${layer}/${style}/${zoom}/${x}/${y}.${format}`;
  const params = new URLSearchParams({ key });
  if (tileSize !== '256') params.set('tileSize', tileSize);
  return `${base}?${params}`;
}

/* ── Build a static image URL ────────────────────────────────────────────── */
function staticUrl(key, lon, lat, zoom, width, height, format, layer, style) {
  /* NOTE: Static Image API takes center as "longitude,latitude" */
  const params = new URLSearchParams({
    key,
    center: `${lon},${lat}`,
    zoom:   String(zoom),
    width:  String(width),
    height: String(height),
    format,
    layer,
    style,
    view: 'Unified',
  });
  return `https://api.tomtom.com/map/1/staticimage?${params}`;
}

/* ── City presets ────────────────────────────────────────────────────────── */
const CITY_PRESETS = [
  { label: 'Amsterdam', lat: 52.370,  lon: 4.895  },
  { label: 'London',    lat: 51.507,  lon: -0.128 },
  { label: 'Paris',     lat: 48.856,  lon: 2.352  },
  { label: 'New York',  lat: 40.712,  lon: -74.006 },
  { label: 'Tokyo',     lat: 35.689,  lon: 139.692 },
  { label: 'Sydney',    lat: -33.869, lon: 151.209 },
];

/* ── Input styles ────────────────────────────────────────────────────────── */
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

/* ─── Map Display Live URL renderer ─────────────────────────────────────────── */
function MapLiveUrl({ endpoint, rasterVals, staticVals, cx, cy, sLon, sLat }) {
  const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.9 };
  const badge = (
    <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, marginRight: 8, background: 'rgba(125,211,252,0.12)', color: '#7dd3fc', fontSize: '0.5625rem', fontWeight: 800, letterSpacing: '0.08em' }}>GET</span>
  );

  if (endpoint === 'raster-tile') {
    const qp = [
      { k: 'key', v: '***', muted: true },
      ...(rasterVals.tileSize !== '256' ? [{ k: 'tileSize', v: rasterVals.tileSize }] : []),
    ];
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>/map/1/tile/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{rasterVals.layer}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{rasterVals.style}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{rasterVals.zoom}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{cx}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{cy}</span>
          <span style={{ color: '#64748b' }}>.{rasterVals.format}</span>
        </div>
        <div style={{ paddingLeft: 52, marginTop: 4 }}>
          {qp.map((p, i) => (
            <div key={p.k} style={{ marginBottom: 1 }}>
              <span style={{ color: '#374151' }}>{i === 0 ? '?' : '&'}</span>
              <span style={{ color: '#94a3b8' }}>{p.k}</span>
              <span style={{ color: '#374151' }}>=</span>
              <span style={{ color: p.muted ? '#4b5563' : '#7dd3fc' }}>{p.v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Static Image */
  const qp = [
    { k: 'key',    v: '***', muted: true },
    { k: 'center', v: `${sLon},${sLat}` },
    { k: 'zoom',   v: staticVals.zoom },
    { k: 'width',  v: staticVals.width },
    { k: 'height', v: staticVals.height },
    { k: 'format', v: staticVals.format },
    { k: 'layer',  v: staticVals.layer },
    { k: 'style',  v: staticVals.style },
    { k: 'view',   v: 'Unified' },
  ];
  return (
    <div style={{ padding: '14px 18px', ...mono }}>
      <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
      <div style={{ paddingLeft: 52, color: '#64748b' }}>/map/1/staticimage</div>
      <div style={{ paddingLeft: 52, marginTop: 4 }}>
        {qp.map((p, i) => (
          <div key={p.k} style={{ marginBottom: 1 }}>
            <span style={{ color: '#374151' }}>{i === 0 ? '?' : '&'}</span>
            <span style={{ color: '#94a3b8' }}>{p.k}</span>
            <span style={{ color: '#374151' }}>=</span>
            <span style={{ color: p.muted ? '#4b5563' : '#7dd3fc' }}>{p.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tile Grid viewer ────────────────────────────────────────────────────── *
 * Shows a 3×3 grid of raster tiles around the center coordinate.
 * Each cell is a plain <img> loading directly from the TomTom API.
 * ─────────────────────────────────────────────────────────────────────────── */
function TileGrid({ rasterVals, apiKey }) {
  const { x: cx, y: cy } = latLonToTile(
    parseLatLon(rasterVals.center).lat,
    parseLatLon(rasterVals.center).lon,
    parseInt(rasterVals.zoom, 10) || 12
  );
  const zoom   = parseInt(rasterVals.zoom, 10) || 12;
  const layer  = rasterVals.layer  || 'basic';
  const style  = rasterVals.style  || 'main';
  const format = rasterVals.format || 'png';
  const size   = parseInt(rasterVals.tileSize, 10) || 256;

  /* 3×3 grid: (cx-1..cx+1) × (cy-1..cy+1) */
  const n     = Math.pow(2, zoom);
  const tiles = [];
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const tx = ((cx + col) % n + n) % n;
      const ty = ((cy + row) % n + n) % n;
      tiles.push({ tx, ty, isCenter: col === 0 && row === 0 });
    }
  }

  /* Display cell size: cap at 200px so the grid fits comfortably */
  const cellPx = Math.min(size, 200);
  const gridPx = cellPx * 3;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(3, ${cellPx}px)`,
        gridTemplateRows:    `repeat(3, ${cellPx}px)`,
        width: gridPx, height: gridPx,
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        {tiles.map(({ tx, ty, isCenter }) => {
          const src = tileUrl(apiKey || DEMO_KEY, layer, style, zoom, tx, ty, format, String(size));
          return (
            <div key={`${tx}-${ty}`} style={{ position: 'relative', width: cellPx, height: cellPx }}>
              <img
                src={src}
                width={cellPx}
                height={cellPx}
                alt={`Tile ${zoom}/${tx}/${ty}`}
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {isCenter && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50% 50% 50% 0',
                    background: '#e2001a', transform: 'rotate(-45deg)',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }} />
                </div>
              )}
              {isCenter && (
                <div style={{
                  position: 'absolute', bottom: 4, left: 0, right: 0,
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <span style={{
                    display: 'inline-block', background: 'rgba(0,0,0,0.65)',
                    color: '#fff', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)',
                    padding: '1px 5px', borderRadius: 4,
                  }}>{zoom}/{tx}/{ty}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseLatLon(str) {
  const [lat, lon] = (str || '').trim().split(',').map(Number);
  return { lat: lat || 0, lon: lon || 0 };
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function MapDisplayExplorer({ onNavigate, isDark = false }) {
  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem(LS_KEY) || DEMO_KEY);
  const [endpoint,  setEndpoint]  = useState('raster-tile');
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  /* ── Preview resize (hero strip) ── */
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

  /* ── Raster Tile params ── */
  const [rasterVals, setRasterVals] = useState({
    center:   '52.37,4.895',
    zoom:     '12',
    layer:    'basic',
    style:    'main',
    format:   'png',
    tileSize: '256',
  });

  /* ── Static Image params ── */
  const [staticVals, setStaticVals] = useState({
    center: '52.37,4.895',
    zoom:   '11',
    width:  '800',
    height: '500',
    layer:  'basic',
    style:  'main',
    format: 'jpg',
  });

  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  /* ── Reset image state when endpoint or params change ── */
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [endpoint, staticVals, rasterVals]);

  /* ── API key persistence ── */
  useEffect(() => {
    if (apiKey && apiKey !== DEMO_KEY) localStorage.setItem(LS_KEY, apiKey);
  }, [apiKey]);

  /* ── Build URLs ── */
  const { lat: rLat, lon: rLon } = parseLatLon(rasterVals.center);
  const rZoom  = parseInt(rasterVals.zoom, 10) || 12;
  const { x: cx, y: cy } = latLonToTile(rLat, rLon, rZoom);
  const centerTileUrl = tileUrl(
    apiKey, rasterVals.layer, rasterVals.style, rZoom, cx, cy,
    rasterVals.format, rasterVals.tileSize
  );

  const { lat: sLat, lon: sLon } = parseLatLon(staticVals.center);
  const staticImgUrl = staticUrl(
    apiKey, sLon, sLat,
    parseInt(staticVals.zoom, 10) || 11,
    parseInt(staticVals.width, 10) || 800,
    parseInt(staticVals.height, 10) || 500,
    staticVals.format, staticVals.layer, staticVals.style
  );

  const currentUrl = endpoint === 'raster-tile' ? centerTileUrl : staticImgUrl;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`curl "${currentUrl}"`).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Endpoint card configs ── */
  const EP_CARDS = [
    {
      value: 'raster-tile',
      label: 'Raster Map Tile',
      thumb: ThumbRasterTile,
      method: 'GET',
      desc: 'Fetch PNG/JPG map tiles by zoom level and tile coordinates. Preview shows a 3×3 tile grid.',
    },
    {
      value: 'static-image',
      label: 'Static Image',
      thumb: ThumbStaticImage,
      method: 'GET',
      desc: 'Generate a parameterised static map image by center coordinate, zoom, and dimensions.',
    },
  ];

  return (
    <div className="page page--wide" style={{ '--map-h': `${mapHeight}px` }}>

      {/* ── Full-bleed sticky preview strip ────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 'var(--app-top-offset)', zIndex: 5,
        marginTop: -32, marginLeft: -40, marginRight: -40,
        marginBottom: 32,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        background: '#1a1a2a',
      }}>
        <div style={{
          height: mapHeight, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDark ? '#0d1117' : '#1e2535',
          position: 'relative',
        }}>

          {endpoint === 'raster-tile' ? (
            /* ── 3×3 Tile Grid ── */
            <TileGrid rasterVals={rasterVals} apiKey={apiKey} />
          ) : (
            /* ── Static image — fills the hero ── */
            <>
              {imgError ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.3 }}>🖼</div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
                    Image failed to load — check your API key and parameters.
                  </p>
                </div>
              ) : (
                <img
                  key={staticImgUrl}
                  src={staticImgUrl}
                  alt="Static map"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  style={{
                    display: 'block', width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s',
                  }}
                />
              )}
              {!imgLoaded && !imgError && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.6)',
                    padding: '7px 16px', borderRadius: 8,
                    fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
                  }}>Loading…</div>
                </div>
              )}
            </>
          )}

          {/* Tile info overlay (raster mode) */}
          {endpoint === 'raster-tile' && (
            <div style={{
              position: 'absolute', bottom: 10, right: 12,
              display: 'flex', gap: 8, alignItems: 'center',
              pointerEvents: 'none',
            }}>
              {[
                { label: 'z', value: rasterVals.zoom },
                { label: 'x', value: cx },
                { label: 'y', value: cy },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(0,0,0,0.65)', borderRadius: 5,
                  padding: '2px 7px', display: 'flex', gap: 4, alignItems: 'baseline',
                }}>
                  <span style={{ fontSize: '0.5625rem', color: '#7dd3fc', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resize handle */}
        <div className="map-resize-handle" onMouseDown={startMapDrag} title="Drag to resize preview">
          <div className="map-resize-handle__grip" />
        </div>
      </div>

      {/* ── Two-column grid ───────────────────────────────────────────────────── */}
      <div className="api-ref-sections">
        <div className="api-ref-section api-ref-section--explorer" id="map-display-explorer" style={{ gridTemplateRows: 'auto' }}>

          {/* ── LEFT: page header + endpoint cards + params ─────────────────── */}
          <div
            className="api-ref-section-left"
            style={{ '--pg-sticky-top': 'calc(var(--app-top-offset) + var(--map-h, 360px) + 20px)' }}
          >
            {/* Page header lives inside the left column */}
            <div className="page-header page-header--with-tabs" style={{ marginBottom: 24 }}>
              <h1>API Explorer</h1>
              <PageActions />
              <VersionTabBar versions={['v1']} activeTab="v1" onTabChange={() => {}} />
            </div>

            {/* ── Endpoint selector cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {EP_CARDS.map(ep => {
                const active = endpoint === ep.value;
                return (
                  <div
                    key={ep.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => setEndpoint(ep.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); setEndpoint(ep.value);
                      }
                    }}
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
                      <ep.thumb />
                    </div>
                    {/* Card body */}
                    <div style={{ padding: '10px 14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
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
                        fontSize: '0.875rem', fontWeight: 700, marginBottom: 3,
                        color: active ? 'var(--black)' : 'var(--mid)',
                        fontFamily: 'var(--font-display)', lineHeight: 1.2,
                      }}>{ep.label}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                        {ep.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── API Key ── */}
            <SectionCard label="API Key">
              <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', flex: 1 }}
                    value={apiKey} onChange={e => setApiKey(e.target.value)}
                    placeholder="Your TomTom API key" spellCheck={false} />
                  {apiKey !== DEMO_KEY && (
                    <button onClick={() => { setApiKey(DEMO_KEY); localStorage.removeItem(LS_KEY); }}
                      style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--mid)', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Demo key
                    </button>
                  )}
                </div>
                {apiKey === DEMO_KEY && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.6875rem', color: 'var(--mid)' }}>
                    Using demo key — replace with your own for production use.
                  </p>
                )}
              </div>
            </SectionCard>

            {/* ── Raster Tile params ── */}
            {endpoint === 'raster-tile' && (
              <>
                <SectionCard label="Location">
                  <CompactParamRow name="center" type="string" required
                    desc="Center of the tile view (lat,lon). Tile X/Y coordinates are derived automatically from your zoom level."
                    control={
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={rasterVals.center}
                          onChange={e => setRasterVals(v => ({ ...v, center: e.target.value }))} placeholder="52.37,4.895" />
                        <select style={{ ...selectStyle, width: 'auto' }}
                          onChange={e => { const p = CITY_PRESETS.find(c => c.label === e.target.value); if (p) setRasterVals(v => ({ ...v, center: `${p.lat},${p.lon}` })); }} defaultValue="">
                          <option value="" disabled>City preset</option>
                          {CITY_PRESETS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </select>
                      </div>
                    }
                  />
                  <CompactParamRow name="zoom" type="integer" required
                    desc="Zoom level (0–22). Higher zoom = more detail. Tile coordinates change automatically."
                    control={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input style={numStyle} type="number" min="0" max="22" value={rasterVals.zoom}
                          onChange={e => setRasterVals(v => ({ ...v, zoom: e.target.value }))} />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>
                          → tile {cx}/{cy}
                        </span>
                      </div>
                    }
                  />
                </SectionCard>

                <SectionCard label="Style">
                  <CompactParamRow name="layer" type="string" required
                    desc="Tile layer. basic = full map data; hybrid = roads + labels only; labels = labels overlay."
                    values={['basic', 'hybrid', 'labels']}
                    selectedValue={rasterVals.layer}
                    onSelect={v => setRasterVals(prev => ({ ...prev, layer: v }))}
                  />
                  <CompactParamRow name="style" type="string" required
                    desc="Colour scheme. main = standard colours; night = dark, low-glare style."
                    values={['main', 'night']}
                    selectedValue={rasterVals.style}
                    onSelect={v => setRasterVals(prev => ({ ...prev, style: v }))}
                  />
                  <CompactParamRow name="format" type="string" required
                    desc="Image format. labels and hybrid overlay tiles must use png (transparency required)."
                    values={['png', 'jpg']}
                    selectedValue={rasterVals.format}
                    onSelect={v => setRasterVals(prev => ({ ...prev, format: v }))}
                  />
                  <CompactParamRow name="tileSize" type="integer"
                    desc="Tile resolution in pixels. 256 px suits most displays; 512 px is for high-DPI screens."
                    values={['256', '512']}
                    selectedValue={rasterVals.tileSize}
                    onSelect={v => setRasterVals(prev => ({ ...prev, tileSize: v }))}
                  />
                </SectionCard>
              </>
            )}

            {/* ── Static Image params ── */}
            {endpoint === 'static-image' && (
              <>
                <SectionCard label="Location">
                  <CompactParamRow name="center" type="string" required
                    desc="Center of the map image (lat,lon). The API receives this as longitude,latitude."
                    control={
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={staticVals.center}
                          onChange={e => setStaticVals(v => ({ ...v, center: e.target.value }))} placeholder="52.37,4.895" />
                        <select style={{ ...selectStyle, width: 'auto' }}
                          onChange={e => { const p = CITY_PRESETS.find(c => c.label === e.target.value); if (p) setStaticVals(v => ({ ...v, center: `${p.lat},${p.lon}` })); }} defaultValue="">
                          <option value="" disabled>City preset</option>
                          {CITY_PRESETS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </select>
                      </div>
                    }
                  />
                  <CompactParamRow name="zoom" type="integer" required
                    desc="Zoom level (0–22)."
                    control={
                      <input style={numStyle} type="number" min="0" max="22" value={staticVals.zoom}
                        onChange={e => setStaticVals(v => ({ ...v, zoom: e.target.value }))} />
                    }
                  />
                </SectionCard>

                <SectionCard label="Dimensions">
                  <CompactParamRow name="width" type="integer" required
                    desc="Width of the output image in pixels (1–8192)."
                    control={
                      <input style={numStyle} type="number" min="1" max="8192" value={staticVals.width}
                        onChange={e => setStaticVals(v => ({ ...v, width: e.target.value }))} />
                    }
                  />
                  <CompactParamRow name="height" type="integer" required
                    desc="Height of the output image in pixels (1–8192)."
                    control={
                      <input style={numStyle} type="number" min="1" max="8192" value={staticVals.height}
                        onChange={e => setStaticVals(v => ({ ...v, height: e.target.value }))} />
                    }
                  />
                  <CompactParamRow name="format" type="string"
                    desc="Output image format."
                    values={['jpg', 'png']}
                    selectedValue={staticVals.format}
                    onSelect={v => setStaticVals(prev => ({ ...prev, format: v }))}
                  />
                </SectionCard>

                <SectionCard label="Style">
                  <CompactParamRow name="layer" type="string" required
                    desc="Map layer."
                    values={['basic', 'hybrid', 'labels']}
                    selectedValue={staticVals.layer}
                    onSelect={v => setStaticVals(prev => ({ ...prev, layer: v }))}
                  />
                  <CompactParamRow name="style" type="string" required
                    desc="Colour scheme. main = standard; night = dark."
                    values={['main', 'night']}
                    selectedValue={staticVals.style}
                    onSelect={v => setStaticVals(prev => ({ ...prev, style: v }))}
                  />
                </SectionCard>
              </>
            )}
          </div>

          {/* ── RIGHT: request panel + result info ──────────────────────────── */}
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
                      background: endpoint === 'raster-tile' ? 'rgba(125,211,252,0.12)' : 'rgba(167,139,250,0.12)',
                      color: endpoint === 'raster-tile' ? '#7dd3fc' : '#a78bfa',
                      border: `1px solid ${endpoint === 'raster-tile' ? 'rgba(125,211,252,0.2)' : 'rgba(167,139,250,0.2)'}`,
                    }}>
                      {endpoint === 'raster-tile' ? 'Raster Map Tile' : 'Static Image'}
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

                <MapLiveUrl
                  endpoint={endpoint}
                  rasterVals={rasterVals} staticVals={staticVals}
                  cx={cx} cy={cy} sLon={sLon} sLat={sLat}
                />

                {/* Footer note */}
                <div style={{
                  padding: '8px 14px', background: '#0d1117',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {endpoint === 'raster-tile'
                      ? '↑ Preview updates automatically as params change'
                      : '↑ Static image reloads automatically on param change'}
                  </span>
                </div>
              </div>

              {/* ── Raster: stats strip ── */}
              {endpoint === 'raster-tile' && (
                <div style={{
                  display: 'flex', gap: 16, flexWrap: 'wrap',
                  padding: '6px 18px', background: '#161b22',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
                  marginTop: 8, borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  {[
                    { label: 'Zoom',   value: rasterVals.zoom },
                    { label: 'X',      value: cx },
                    { label: 'Y',      value: cy },
                    { label: 'Layer',  value: rasterVals.layer },
                    { label: 'Style',  value: rasterVals.style },
                    { label: 'Format', value: rasterVals.format.toUpperCase() },
                  ].map(({ label, value }) => (
                    <span key={label}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>{value}</span>
                      {' '}
                      <span style={{ color: '#64748b' }}>{label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* ── Static: image stats (shown after load) ── */}
              {endpoint === 'static-image' && imgLoaded && (
                <div style={{
                  display: 'flex', gap: 16, flexWrap: 'wrap',
                  padding: '6px 18px', background: '#161b22',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.6875rem', fontFamily: 'var(--font-mono)',
                  marginTop: 8, borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  {[
                    { label: 'Width',  value: `${staticVals.width} px` },
                    { label: 'Height', value: `${staticVals.height} px` },
                    { label: 'Zoom',   value: staticVals.zoom },
                    { label: 'Format', value: staticVals.format.toUpperCase() },
                  ].map(({ label, value }) => (
                    <span key={label}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>{value}</span>
                      {' '}
                      <span style={{ color: '#64748b' }}>{label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* ── Center tile URL (raster) ── */}
              {endpoint === 'raster-tile' && (
                <div style={{
                  background: '#0d1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem', marginTop: 8,
                }}>
                  <div style={{
                    fontSize: '0.5625rem', fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
                  }}>Center Tile URL</div>
                  <code style={{
                    fontSize: '0.625rem', color: '#86efac', fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6, wordBreak: 'break-all', display: 'block',
                  }}>
                    {centerTileUrl.replace(`key=${apiKey || DEMO_KEY}`, 'key=···')}
                  </code>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

