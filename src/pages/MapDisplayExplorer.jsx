import { useState, useEffect, useRef, useCallback } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';
import {
  IlloMapRasterTile, IlloMapStaticImage,
  IlloMapVectorTile,  IlloMapAssetsAPI,
} from './IntroIllustrations';
import { makeThumb, L_MapRasterTile, L_MapStaticImage, L_MapVectorTile, L_MapAssetsAPI } from '../illustrations/lightVariants';
import { IcoMapRasterTile, IcoMapStaticImage, IcoMapVectorTile, IcoMapDisplay } from '../illustrations/iconVariants';

const ThumbRasterTile  = makeThumb(IlloMapRasterTile,  L_MapRasterTile,  IcoMapRasterTile);
const ThumbStaticImage = makeThumb(IlloMapStaticImage, L_MapStaticImage, IcoMapStaticImage);
const ThumbVectorTile  = makeThumb(IlloMapVectorTile,  L_MapVectorTile,  IcoMapVectorTile);
const ThumbAssetsAPI   = makeThumb(IlloMapAssetsAPI,   L_MapAssetsAPI,   IcoMapDisplay);

/* ─────────────────────────────────────────────────────────────────────────────
 * MapDisplayExplorer — live API request builder.
 *
 * v1  (TomTom Maps / Production):
 *   • Raster Map Tile  GET /map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.{format}
 *   • Static Image     GET /map/1/staticimage
 *
 * v2  (Orbis / Public Preview):
 *   • Vector Tile      GET /map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.pbf
 *   • Map Assets       GET /maps/orbis/assets/styles/{assetVersion}/…
 *
 * Raster + Static: no SDK needed — results are image URLs loaded as <img>.
 * Vector Tile   : PBF binary — preview shows URL + coordinate strip.
 * Map Assets    : sprite PNG loaded directly as <img>.
 * ───────────────────────────────────────────────────────────────────────────── */

const DEMO_KEY     = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const LS_KEY       = 'tt-explorer-key';
const ASSET_BASE   = 'https://api.tomtom.com/maps/orbis/assets/styles';
const VECTOR_BASE  = 'https://api.tomtom.com/map/1/tile';

/* ── Lat/Lon → Tile X/Y ──────────────────────────────────────────────────── */
function latLonToTile(lat, lon, zoom) {
  const n      = Math.pow(2, zoom);
  const x      = Math.floor((lon + 180) / 360 * n);
  const latRad = (lat * Math.PI) / 180;
  const y      = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) };
}

function parseLatLon(str) {
  const [lat, lon] = (str || '').trim().split(',').map(Number);
  return { lat: lat || 0, lon: lon || 0 };
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

/* ── Build a vector tile URL ─────────────────────────────────────────────── */
function vectorTileUrl(key, layer, style, zoom, x, y) {
  return `${VECTOR_BASE}/${layer}/${style}/${zoom}/${x}/${y}.pbf?key=${key}`;
}

/* ── Build Map Assets URLs ───────────────────────────────────────────────── */
function assetsStyleUrl(key, assetVersion) {
  return `${ASSET_BASE}/${assetVersion}/style.json?key=${key}`;
}
function assetsSpriteUrl(key, assetVersion, scale = '@2x') {
  return `${ASSET_BASE}/${assetVersion}/sprite${scale}.png?key=${key}`;
}
function assetsSpriteJsonUrl(key, assetVersion, scale = '@2x') {
  return `${ASSET_BASE}/${assetVersion}/sprite${scale}.json?key=${key}`;
}
function assetsGlyphUrl(key, assetVersion, fontStack = 'Noto+Sans+Regular', range = '0-255') {
  return `${ASSET_BASE}/${assetVersion}/fonts/${fontStack}/${range}.pbf?key=${key}`;
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
function MapLiveUrl({ endpoint, rasterVals, staticVals, vectorVals, assetsVals, apiKey, cx, cy, vx, vy, sLon, sLat }) {
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

  if (endpoint === 'static-image') {
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

  if (endpoint === 'vector-tile') {
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>/map/1/tile/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{vectorVals.layer}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{vectorVals.style}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{vectorVals.zoom}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{vx}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{vy}</span>
          <span style={{ color: '#64748b' }}>.pbf</span>
        </div>
        <div style={{ paddingLeft: 52, marginTop: 4 }}>
          <div><span style={{ color: '#374151' }}>?</span><span style={{ color: '#94a3b8' }}>key</span><span style={{ color: '#374151' }}>=</span><span style={{ color: '#4b5563' }}>***</span></div>
        </div>
        <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: 6, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)' }}>
          <div style={{ fontSize: '0.625rem', color: '#a78bfa', fontWeight: 600, marginBottom: 3, letterSpacing: '0.04em' }}>INTEGRATION NOTE</div>
          <div style={{ fontSize: '0.6875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            PBF tiles are binary vector data. Pass this URL pattern as a tile source in MapLibre GL JS with a style.json from the Map Assets endpoint.
          </div>
        </div>
      </div>
    );
  }

  if (endpoint === '3d-landmarks' || endpoint === 'extended-tiles') {
    const pathPrefix = endpoint === '3d-landmarks'
      ? '/maps/orbis/maps/assets/3d-landmarks'
      : '/maps/orbis/maps/extended-tiles';
    const zoom = vectorVals?.zoom || 12;
    return (
      <div style={{ padding: '14px 18px', ...mono }}>
        <div style={{ marginBottom: 3 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
        <div style={{ paddingLeft: 52 }}>
          <span style={{ color: '#64748b' }}>{pathPrefix}/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{zoom}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{vx}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>{vy}</span>
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>.pbf</span>
        </div>
        <div style={{ paddingLeft: 52, marginTop: 4 }}>
          <div><span style={{ color: '#374151' }}>?</span><span style={{ color: '#94a3b8' }}>key</span><span style={{ color: '#374151' }}>=</span><span style={{ color: '#4b5563' }}>***</span></div>
        </div>
        <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: 6, background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.18)' }}>
          <div style={{ fontSize: '0.625rem', color: '#fb923c', fontWeight: 600, marginBottom: 3, letterSpacing: '0.04em' }}>PRIVATE PREVIEW</div>
          <div style={{ fontSize: '0.6875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            PBF tiles are binary vector data. Pass this URL pattern as a tile source in MapLibre GL JS with an Orbis v3 style.json.
          </div>
        </div>
      </div>
    );
  }

  /* assets-sprites — show the full dependency chain */
  const av = assetsVals.assetVersion || '22.2.1-*';
  const pathBase = `/maps/orbis/assets/styles/${av}`;
  const assetEndpoints = [
    { label: 'Style JSON',    path: `${pathBase}/style.json`,            color: '#4ade80', note: 'MapLibre style descriptor — references tiles, sprites, glyphs' },
    { label: 'Sprite PNG',    path: `${pathBase}/sprite@2x.png`,         color: '#7dd3fc', note: 'Icon atlas — loaded by MapLibre from style.json' },
    { label: 'Sprite Index',  path: `${pathBase}/sprite@2x.json`,        color: '#7dd3fc', note: 'Icon coordinate offsets within the sprite PNG' },
    { label: 'Glyph PBF',     path: `${pathBase}/fonts/{fontStack}/0-255.pbf`, color: '#fb923c', note: 'Font SDF tiles for label rendering' },
  ];
  return (
    <div style={{ padding: '14px 18px', ...mono }}>
      <div style={{ marginBottom: 10 }}>{badge}<span style={{ color: '#4b5563' }}>https://api.tomtom.com</span></div>
      {assetEndpoints.map((ae, i) => (
        <div key={ae.label} style={{ marginBottom: i < assetEndpoints.length - 1 ? 10 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: '0.5rem', fontWeight: 700, color: ae.color, letterSpacing: '0.06em', minWidth: 72 }}>{ae.label}</span>
          </div>
          <div style={{ paddingLeft: 8 }}>
            <span style={{ color: '#64748b' }}>{ae.path.replace(av, '')}</span>
            {ae.path.includes(av) && (
              <><span style={{ color: '#94a3b8', fontSize: '0.625rem' }}></span><span style={{ color: '#fb923c', fontWeight: 600 }}>{av}</span><span style={{ color: '#64748b' }}>{ae.path.slice(ae.path.indexOf(av) + av.length)}</span></>
            )}
          </div>
          <div style={{ paddingLeft: 8, marginTop: 2 }}>
            <span style={{ color: '#374151' }}>?</span>
            <span style={{ color: '#94a3b8' }}>key</span>
            <span style={{ color: '#374151' }}>=</span>
            <span style={{ color: '#4b5563' }}>***</span>
          </div>
          <div style={{ fontSize: '0.625rem', color: '#475569', paddingLeft: 8, marginTop: 2 }}>{ae.note}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Tile Grid viewer ────────────────────────────────────────────────────── */
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

  const n     = Math.pow(2, zoom);
  const tiles = [];
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const tx = ((cx + col) % n + n) % n;
      const ty = ((cy + row) % n + n) % n;
      tiles.push({ tx, ty, isCenter: col === 0 && row === 0 });
    }
  }

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
                    border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
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

/* ─── Vector Tile Info Strip — coordinate display for PBF endpoint ─────────── */
function VectorTileStrip({ vectorVals, vx, vy }) {
  const zoom = parseInt(vectorVals.zoom, 10) || 12;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: '100%', padding: '2rem',
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    }}>
      {/* Tile coordinate display */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24,
      }}>
        {[{ label: 'zoom', value: zoom }, { label: 'x', value: vx }, { label: 'y', value: vy }].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: 10, padding: '14px 20px',
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#a78bfa', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: '0.5625rem', color: '#4b5563', marginTop: 5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      {/* Path */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#475569',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '8px 16px', marginBottom: 16, textAlign: 'center',
      }}>
        <span style={{ color: '#64748b' }}>/map/1/tile/</span>
        <span style={{ color: '#f87171' }}>{vectorVals.layer}</span>
        <span style={{ color: '#64748b' }}>/</span>
        <span style={{ color: '#f87171' }}>{vectorVals.style}</span>
        <span style={{ color: '#64748b' }}>/{zoom}/{vx}/{vy}</span>
        <span style={{ color: '#94a3b8', fontWeight: 700 }}>.pbf</span>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <div style={{ fontSize: '0.6875rem', color: '#374151', lineHeight: 1.6 }}>
          PBF (Protocol Buffer Format) binary vector tile — render with{' '}
          <span style={{ color: '#a78bfa', fontWeight: 600 }}>MapLibre GL JS</span>
          {' '}using a{' '}
          <span style={{ color: '#4ade80', fontWeight: 600 }}>style.json</span>
          {' '}from the Map Assets endpoint.
        </div>
      </div>
    </div>
  );
}

/* ─── Sprite Preview — loads the sprite PNG from Map Assets API ─────────────── */
function SpritePreview({ apiKey, assetsVals }) {
  const [loaded, setLoaded]   = useState(false);
  const [errored, setErrored] = useState(false);
  const url = assetsSpriteUrl(apiKey || DEMO_KEY, assetsVals.assetVersion || '22.2.1-*');

  useEffect(() => { setLoaded(false); setErrored(false); }, [url]);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1117 0%, #0a1628 100%)',
      padding: '1.5rem',
    }}>
      {errored ? (
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: '2rem', marginBottom: 10, opacity: 0.3 }}>🗺</div>
          <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            Sprite failed to load
          </p>
          <div style={{
            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: 8, padding: '10px 14px', textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em', marginBottom: 5 }}>
              V2 PUBLIC PREVIEW — ORBIS ACCESS REQUIRED
            </div>
            <p style={{ margin: 0, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              The demo key only covers v1 Production endpoints. Orbis (v2) endpoints require a key with{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>Orbis access</span> enabled.
              Enter your own key above to preview the sprite sheet.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            background: '#161b22', borderRadius: 12, padding: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: '100%', overflow: 'hidden',
          }}>
            <img
              key={url}
              src={url}
              alt="Map sprite sheet"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              style={{
                display: 'block', maxWidth: '100%', maxHeight: '200px',
                objectFit: 'contain',
                opacity: loaded ? 1 : 0, transition: 'opacity 0.3s',
                imageRendering: 'pixelated',
              }}
            />
          </div>
          {!loaded && !errored && (
            <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              Loading sprite sheet…
            </div>
          )}
          {loaded && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#7dd3fc', background: 'rgba(125,211,252,0.1)', border: '1px solid rgba(125,211,252,0.2)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                sprite@2x.png
              </span>
              <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                {assetsVals.assetVersion || '22.2.1-*'}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── V3 Tile Strip — coordinate display for Private Preview PBF endpoints ─── */
function V3TileStrip({ endpoint, vectorVals, vx, vy }) {
  const zoom   = parseInt(vectorVals.zoom, 10) || 12;
  const is3D   = endpoint === '3d-landmarks';
  const accentColor = '#fb923c';
  const pathPrefix  = is3D
    ? '/maps/orbis/maps/assets/3d-landmarks'
    : '/maps/orbis/maps/extended-tiles';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: '100%', padding: '2rem',
      background: 'linear-gradient(135deg, #0d1117 0%, #1a1108 100%)',
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[{ label: 'zoom', value: zoom }, { label: 'x', value: vx }, { label: 'y', value: vy }].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.2)',
            borderRadius: 10, padding: '14px 20px',
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: accentColor, lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: '0.5625rem', color: '#4b5563', marginTop: 5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#475569',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '8px 16px', marginBottom: 16, textAlign: 'center',
      }}>
        <span style={{ color: '#64748b' }}>{pathPrefix}/</span>
        <span style={{ color: '#fb923c' }}>{zoom}/{vx}/{vy}</span>
        <span style={{ color: '#94a3b8', fontWeight: 700 }}>.pbf</span>
      </div>
      <div style={{
        display: 'inline-flex', gap: 6, alignItems: 'center',
        padding: '5px 12px', borderRadius: 8,
        background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)',
        marginBottom: 14,
      }}>
        <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          V3 PRIVATE PREVIEW
        </span>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 340, fontSize: '0.6875rem', color: '#374151', lineHeight: 1.6 }}>
        {is3D
          ? <>Binary vector tile containing <span style={{ color: '#fb923c', fontWeight: 600 }}>3D building geometry</span> and landmark footprints — render with MapLibre GL JS.</>
          : <>Extended vector tile with <span style={{ color: '#fb923c', fontWeight: 600 }}>building heights, lane geometry, and POI attributes</span> — render with MapLibre GL JS.</>
        }
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function MapDisplayExplorer({ onNavigate, isDark = false }) {
  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem(LS_KEY) || DEMO_KEY);
  const [tab,       setTab]       = useState('v1');
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

  /* ── Reset endpoint when tab changes ── */
  useEffect(() => {
    if (tab === 'v1') setEndpoint('raster-tile');
    else if (tab === 'v2') setEndpoint('vector-tile');
    else setEndpoint('3d-landmarks');
  }, [tab]);

  /* ── v1 Raster Tile params ── */
  const [rasterVals, setRasterVals] = useState({
    center:   '52.37,4.895',
    zoom:     '12',
    layer:    'basic',
    style:    'main',
    format:   'png',
    tileSize: '256',
  });

  /* ── v1 Static Image params ── */
  const [staticVals, setStaticVals] = useState({
    center: '52.37,4.895',
    zoom:   '11',
    width:  '800',
    height: '500',
    layer:  'basic',
    style:  'main',
    format: 'jpg',
  });

  /* ── v2 Vector Tile params ── */
  const [vectorVals, setVectorVals] = useState({
    center: '52.37,4.895',
    zoom:   '12',
    layer:  'basic',
    style:  'main',
  });

  /* ── v2 Map Assets params ── */
  const [assetsVals, setAssetsVals] = useState({
    assetVersion: '22.2.1-*',
    scale: '@2x',
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

  /* ── Derived tile coordinates — v1 Raster ── */
  const { lat: rLat, lon: rLon } = parseLatLon(rasterVals.center);
  const rZoom = parseInt(rasterVals.zoom, 10) || 12;
  const { x: cx, y: cy } = latLonToTile(rLat, rLon, rZoom);
  const centerTileUrl = tileUrl(apiKey, rasterVals.layer, rasterVals.style, rZoom, cx, cy, rasterVals.format, rasterVals.tileSize);

  /* ── Derived tile coordinates — v2 Vector ── */
  const { lat: vLat, lon: vLon } = parseLatLon(vectorVals.center);
  const vZoom = parseInt(vectorVals.zoom, 10) || 12;
  const { x: vx, y: vy } = latLonToTile(vLat, vLon, vZoom);

  /* ── Static Image URL ── */
  const { lat: sLat, lon: sLon } = parseLatLon(staticVals.center);
  const staticImgUrl = staticUrl(
    apiKey, sLon, sLat,
    parseInt(staticVals.zoom, 10) || 11,
    parseInt(staticVals.width, 10) || 800,
    parseInt(staticVals.height, 10) || 500,
    staticVals.format, staticVals.layer, staticVals.style
  );

  /* ── Current cURL URL ── */
  const currentCurlUrl = (() => {
    if (endpoint === 'raster-tile')   return centerTileUrl;
    if (endpoint === 'static-image')  return staticImgUrl;
    if (endpoint === 'vector-tile')   return vectorTileUrl(apiKey, vectorVals.layer, vectorVals.style, vZoom, vx, vy);
    if (endpoint === 'assets-sprites') return assetsSpriteUrl(apiKey, assetsVals.assetVersion || '22.2.1-*');
    if (endpoint === '3d-landmarks')  return `https://api.tomtom.com/maps/orbis/maps/assets/3d-landmarks/${vZoom}/${vx}/${vy}.pbf?key=${apiKey || DEMO_KEY}`;
    if (endpoint === 'extended-tiles') return `https://api.tomtom.com/maps/orbis/maps/extended-tiles/${vZoom}/${vx}/${vy}.pbf?key=${apiKey || DEMO_KEY}`;
    return '';
  })();

  const handleCopy = () => {
    navigator.clipboard?.writeText(`curl "${currentCurlUrl}"`).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Endpoint card configs ── */
  const EP_CARDS_V1 = [
    {
      value: 'raster-tile',
      label: 'Raster Map Tile',
      thumb: ThumbRasterTile,
      method: 'GET',
      version: 'v1',
      desc: 'Fetch PNG/JPG map tiles by zoom level and tile coordinates. Preview shows a 3×3 tile grid.',
    },
    {
      value: 'static-image',
      label: 'Static Image',
      thumb: ThumbStaticImage,
      method: 'GET',
      version: 'v1',
      desc: 'Generate a parameterised static map image by center coordinate, zoom, and dimensions.',
    },
  ];

  const EP_CARDS_V2 = [
    {
      value: 'vector-tile',
      label: 'Vector Tile',
      thumb: ThumbVectorTile,
      method: 'GET',
      version: 'v2',
      desc: 'Fetch binary PBF vector tiles. Render client-side with MapLibre GL JS using a Map Assets style.',
    },
    {
      value: 'assets-sprites',
      label: 'Map Assets',
      thumb: ThumbAssetsAPI,
      method: 'GET',
      version: 'v2',
      desc: 'Retrieve versioned map assets — style.json, sprite sheets, and glyph PBFs for vector map rendering.',
    },
  ];

  const EP_CARDS_V3 = [
    {
      value: '3d-landmarks',
      label: '3D Landmarks',
      thumb: ThumbVectorTile,
      method: 'GET',
      version: 'v3',
      desc: 'Vector PBF tiles containing 3D building footprints and landmark geometry for client-side 3D rendering.',
    },
    {
      value: 'extended-tiles',
      label: 'Extended Tiles',
      thumb: ThumbAssetsAPI,
      method: 'GET',
      version: 'v3',
      desc: 'Extended vector PBF tiles with additional attribute data — building heights, lane geometry, and POI metadata.',
    },
  ];

  const EP_CARDS = tab === 'v1' ? EP_CARDS_V1 : tab === 'v2' ? EP_CARDS_V2 : EP_CARDS_V3;

  /* ── Code panel label ── */
  const endpointLabel = {
    'raster-tile':    'Raster Map Tile',
    'static-image':   'Static Image',
    'vector-tile':    'Vector Tile',
    'assets-sprites': 'Map Assets',
    '3d-landmarks':   '3D Landmarks',
    'extended-tiles': 'Extended Tiles',
  }[endpoint] || endpoint;

  const endpointColor = tab === 'v3'
    ? { bg: 'rgba(251,146,60,0.12)',  text: '#fb923c', border: 'rgba(251,146,60,0.2)'  }
    : tab === 'v2'
    ? { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', border: 'rgba(167,139,250,0.2)' }
    : { bg: 'rgba(125,211,252,0.12)', text: '#7dd3fc', border: 'rgba(125,211,252,0.2)' };

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

          {/* ── v1: Raster Tile Grid ── */}
          {endpoint === 'raster-tile' && (
            <TileGrid rasterVals={rasterVals} apiKey={apiKey} />
          )}

          {/* ── v1: Static Image ── */}
          {endpoint === 'static-image' && (
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

          {/* ── v2: Vector Tile coordinate strip ── */}
          {endpoint === 'vector-tile' && (
            <VectorTileStrip vectorVals={vectorVals} vx={vx} vy={vy} />
          )}

          {/* ── v2: Map Assets sprite preview ── */}
          {endpoint === 'assets-sprites' && (
            <SpritePreview apiKey={apiKey} assetsVals={assetsVals} />
          )}

          {/* ── v3: 3D Landmarks / Extended Tiles — PBF coordinate strip ── */}
          {(endpoint === '3d-landmarks' || endpoint === 'extended-tiles') && (
            <V3TileStrip endpoint={endpoint} vectorVals={vectorVals} vx={vx} vy={vy} />
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
            <div className="page-header page-header--with-tabs" style={{ marginBottom: tab !== 'v1' ? 12 : 24 }}>
              <h1>API Explorer</h1>
              <PageActions />
              <VersionTabBar
                versions={['v1', 'v2', 'v3']}
                activeTab={tab}
                onTabChange={setTab}
              />
            </div>

            {tab === 'v2' && (
              <PrivatePreviewBanner
                variant="public" compact
                message="v2 endpoints are Public Preview. The demo key only covers v1 Production. Enter a key with Orbis access to use these endpoints."
              />
            )}
            {tab === 'v3' && (
              <PrivatePreviewBanner
                variant="private" compact
                title="Private Preview — access required"
                message="3D Landmarks and Extended Tiles are not publicly available. Contact TomTom to request access. The demo key does not cover v3 endpoints."
              />
            )}

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
                {apiKey === DEMO_KEY && tab === 'v1' && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.6875rem', color: 'var(--mid)' }}>
                    Using demo key — replace with your own for production use.
                  </p>
                )}
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════════
             * v1 PARAMS
             * ══════════════════════════════════════════════════════════════════ */}

            {/* ── v1 Raster Tile params ── */}
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

            {/* ── v1 Static Image params ── */}
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

            {/* ══════════════════════════════════════════════════════════════════
             * v2 PARAMS
             * ══════════════════════════════════════════════════════════════════ */}

            {/* ── v2 Vector Tile params ── */}
            {endpoint === 'vector-tile' && (
              <>
                <SectionCard label="Location">
                  <CompactParamRow name="center" type="string" required
                    desc="Center coordinate (lat,lon) — used to derive tile X/Y. Change this to preview a different tile."
                    control={
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={vectorVals.center}
                          onChange={e => setVectorVals(v => ({ ...v, center: e.target.value }))} placeholder="52.37,4.895" />
                        <select style={{ ...selectStyle, width: 'auto' }}
                          onChange={e => { const p = CITY_PRESETS.find(c => c.label === e.target.value); if (p) setVectorVals(v => ({ ...v, center: `${p.lat},${p.lon}` })); }} defaultValue="">
                          <option value="" disabled>City preset</option>
                          {CITY_PRESETS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </select>
                      </div>
                    }
                  />
                  <CompactParamRow name="zoom" type="integer" required
                    desc="Zoom level (0–22). Tile X/Y coordinates update automatically."
                    control={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input style={numStyle} type="number" min="0" max="22" value={vectorVals.zoom}
                          onChange={e => setVectorVals(v => ({ ...v, zoom: e.target.value }))} />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>
                          → tile {vx}/{vy}
                        </span>
                      </div>
                    }
                  />
                </SectionCard>

                <SectionCard label="Tile Content">
                  <CompactParamRow name="layer" type="string" required
                    desc="Data layer. basic = full street data including POIs; hybrid = roads + labels only for overlay."
                    values={['basic', 'hybrid', 'labels']}
                    selectedValue={vectorVals.layer}
                    onSelect={v => setVectorVals(prev => ({ ...prev, layer: v }))}
                  />
                  <CompactParamRow name="style" type="string" required
                    desc="Tile variant. main = standard data; night = night-mode data optimisation."
                    values={['main', 'night']}
                    selectedValue={vectorVals.style}
                    onSelect={v => setVectorVals(prev => ({ ...prev, style: v }))}
                  />
                </SectionCard>

                <SectionCard label="Rendering">
                  <div style={{ padding: '10px 14px 12px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Vector PBF tiles are binary data — they require a GL renderer to display. The typical integration:
                    </p>
                    <ol style={{ margin: '10px 0 0', paddingLeft: 16, fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.8 }}>
                      <li>Fetch <code style={{ color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>style.json</code> from Map Assets</li>
                      <li>Pass as the <code style={{ color: '#7dd3fc', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>style</code> option to MapLibre GL JS</li>
                      <li>MapLibre resolves tiles, sprites, and glyphs from URLs embedded in the style</li>
                    </ol>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════════════
             * v3 PARAMS
             * ══════════════════════════════════════════════════════════════════ */}

            {/* ── v3 3D Landmarks / Extended Tiles params ── */}
            {(endpoint === '3d-landmarks' || endpoint === 'extended-tiles') && (
              <>
                <SectionCard label="Location">
                  <CompactParamRow name="center" type="string" required
                    desc="Center coordinate (lat,lon) — used to derive tile X/Y. Change to preview a different tile."
                    control={
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={vectorVals.center}
                          onChange={e => setVectorVals(v => ({ ...v, center: e.target.value }))} placeholder="52.37,4.895" />
                        <select style={{ ...selectStyle, width: 'auto' }}
                          onChange={e => { const p = CITY_PRESETS.find(c => c.label === e.target.value); if (p) setVectorVals(v => ({ ...v, center: `${p.lat},${p.lon}` })); }} defaultValue="">
                          <option value="" disabled>City preset</option>
                          {CITY_PRESETS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </select>
                      </div>
                    }
                  />
                  <CompactParamRow name="zoom" type="integer" required
                    desc="Zoom level (0–22). Tile X/Y coordinates update automatically."
                    control={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input style={numStyle} type="number" min="0" max="22" value={vectorVals.zoom}
                          onChange={e => setVectorVals(v => ({ ...v, zoom: e.target.value }))} />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>
                          → tile {vx}/{vy}
                        </span>
                      </div>
                    }
                  />
                </SectionCard>

                <SectionCard label={endpoint === '3d-landmarks' ? '3D Rendering' : 'Extended Data'}>
                  <div style={{ padding: '10px 14px 12px' }}>
                    <div style={{
                      display: 'inline-flex', gap: 6, alignItems: 'center', marginBottom: 10,
                      padding: '3px 10px', borderRadius: 6,
                      background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.18)',
                    }}>
                      <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fb923c', letterSpacing: '0.08em' }}>
                        PRIVATE PREVIEW
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {endpoint === '3d-landmarks'
                        ? 'These PBF tiles contain 3D building footprints and extruded geometry. They require extrusion support in your renderer.'
                        : 'Extended tiles carry extra attribute data beyond standard vector tiles — building heights, detailed lane geometry, and enriched POI metadata.'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Pass the tile URL pattern as a source in <span style={{ color: '#a78bfa', fontWeight: 600 }}>MapLibre GL JS</span> with a style.json that references v3 Orbis assets.
                    </p>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── v2 Map Assets params ── */}
            {endpoint === 'assets-sprites' && (
              <>
                <SectionCard label="Asset Version">
                  <CompactParamRow name="assetVersion" type="string" required
                    desc="Versioned release tag for the map asset set. Use 22.2.1-* for the latest minor of the 22.2.1 line. Pin to a specific build (e.g. 22.2.1-0) for production stability."
                    control={
                      <input style={{ ...inputStyle, flex: 1, minWidth: 160 }}
                        value={assetsVals.assetVersion}
                        onChange={e => setAssetsVals(v => ({ ...v, assetVersion: e.target.value }))}
                        placeholder="22.2.1-*"
                        spellCheck={false}
                      />
                    }
                    multiline
                  />
                  <CompactParamRow name="scale" type="string"
                    desc="Sprite resolution. @2x is the standard high-DPI sprite. @1x is half-resolution."
                    values={['@2x', '@1x']}
                    selectedValue={assetsVals.scale}
                    onSelect={v => setAssetsVals(prev => ({ ...prev, scale: v }))}
                  />
                </SectionCard>

                <SectionCard label="Asset Endpoints">
                  {[
                    {
                      name: 'style.json',
                      method: 'GET',
                      path: `/maps/orbis/assets/styles/{assetVersion}/style.json`,
                      desc: 'MapLibre GL JS style descriptor. Contains all tile source URLs, layer definitions, sprite references, and glyph URLs.',
                      color: '#4ade80',
                    },
                    {
                      name: 'sprite{scale}.png',
                      method: 'GET',
                      path: `/maps/orbis/assets/styles/{assetVersion}/sprite{scale}.png`,
                      desc: 'Icon atlas PNG. All map symbols packed into a single image. The preview above loads this directly.',
                      color: '#7dd3fc',
                    },
                    {
                      name: 'sprite{scale}.json',
                      method: 'GET',
                      path: `/maps/orbis/assets/styles/{assetVersion}/sprite{scale}.json`,
                      desc: 'Sprite index JSON. Maps each icon name to its pixel offset and dimensions within the PNG atlas.',
                      color: '#7dd3fc',
                    },
                    {
                      name: 'fonts/{fontStack}/{range}.pbf',
                      method: 'GET',
                      path: `/maps/orbis/assets/styles/{assetVersion}/fonts/{fontStack}/{range}.pbf`,
                      desc: 'SDF glyph PBF tile for label rendering. fontStack is URL-encoded (e.g. Noto+Sans+Regular). range is a unicode block (e.g. 0-255).',
                      color: '#fb923c',
                    },
                  ].map(ae => (
                    <div key={ae.name} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                        <span style={{
                          fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.07em',
                          fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 3,
                          background: 'rgba(125,211,252,0.10)', color: '#7dd3fc',
                        }}>{ae.method}</span>
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: ae.color }}>{ae.name}</code>
                      </div>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--muted)', display: 'block', marginBottom: 4, wordBreak: 'break-all' }}>
                        {ae.path.replace('{assetVersion}', assetsVals.assetVersion || '22.2.1-*').replace('{scale}', assetsVals.scale || '@2x')}
                      </code>
                      <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.5 }}>{ae.desc}</p>
                    </div>
                  ))}
                </SectionCard>

                <SectionCard label="Integration Pattern">
                  <div style={{ padding: '10px 14px 12px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      The recommended pattern for Orbis vector map rendering:
                    </p>
                    {[
                      { step: '1', label: 'Fetch style.json', detail: 'Your API key is embedded in the tile source URLs inside the style.', color: '#4ade80' },
                      { step: '2', label: 'Pass to MapLibre', detail: 'new maplibregl.Map({ style: styleJsonUrl, … })', color: '#a78bfa' },
                      { step: '3', label: 'MapLibre resolves assets', detail: 'Sprites and glyphs are fetched automatically from URLs in the style.', color: '#7dd3fc' },
                    ].map(s => (
                      <div key={s.step} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                        <div style={{
                          flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                          background: s.color + '20', border: `1px solid ${s.color}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.5625rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)',
                        }}>{s.step}</div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--black)', marginBottom: 2 }}>{s.label}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.4 }}>{s.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      background: endpointColor.bg, color: endpointColor.text,
                      border: `1px solid ${endpointColor.border}`,
                    }}>
                      {endpointLabel}
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
                  rasterVals={rasterVals}
                  staticVals={staticVals}
                  vectorVals={vectorVals}
                  assetsVals={assetsVals}
                  apiKey={apiKey}
                  cx={cx} cy={cy}
                  vx={vx} vy={vy}
                  sLon={sLon} sLat={sLat}
                />

                {/* Footer note */}
                <div style={{
                  padding: '8px 14px', background: '#0d1117',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.625rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {endpoint === 'raster-tile'     && '↑ Preview updates automatically as params change'}
                    {endpoint === 'static-image'    && '↑ Static image reloads automatically on param change'}
                    {endpoint === 'vector-tile'     && '↑ Tile coordinates update automatically on location change'}
                    {endpoint === 'assets-sprites'  && '↑ Sprite preview loads live from the Map Assets API'}
                    {endpoint === '3d-landmarks'    && '↑ Private Preview — tile coordinates derived from your location input'}
                    {endpoint === 'extended-tiles'  && '↑ Private Preview — tile coordinates derived from your location input'}
                  </span>
                </div>
              </div>

              {/* ── v1 Raster: stats strip ── */}
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

              {/* ── v1 Static: image stats (shown after load) ── */}
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

              {/* ── v1 Raster: center tile URL ── */}
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

              {/* ── v2 Vector Tile: derived URLs block ── */}
              {endpoint === 'vector-tile' && (
                <div style={{
                  background: '#0d1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem', marginTop: 8,
                }}>
                  <div style={{
                    fontSize: '0.5625rem', fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
                  }}>Derived Tile URL</div>
                  <code style={{
                    fontSize: '0.625rem', color: '#86efac', fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6, wordBreak: 'break-all', display: 'block', marginBottom: 12,
                  }}>
                    {vectorTileUrl(apiKey, vectorVals.layer, vectorVals.style, vZoom, vx, vy).replace(`key=${apiKey || DEMO_KEY}`, 'key=···')}
                  </code>
                  <div style={{
                    padding: '8px 10px', borderRadius: 6,
                    background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)',
                    fontSize: '0.625rem', color: '#94a3b8', lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#a78bfa', fontWeight: 600 }}>Tip:</span> Switch to the{' '}
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>Map Assets</span> endpoint to get the style.json URL
                    that references these tiles. Pass that URL to MapLibre GL JS as the map style.
                  </div>
                </div>
              )}

              {/* ── v3: derived tile URL ── */}
              {(endpoint === '3d-landmarks' || endpoint === 'extended-tiles') && (
                <div style={{
                  background: '#0d1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem', marginTop: 8,
                }}>
                  <div style={{
                    fontSize: '0.5625rem', fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
                  }}>Derived Tile URL</div>
                  <code style={{
                    fontSize: '0.625rem', color: '#86efac', fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6, wordBreak: 'break-all', display: 'block', marginBottom: 12,
                  }}>
                    {currentCurlUrl.replace(`key=${apiKey || DEMO_KEY}`, 'key=···')}
                  </code>
                  <div style={{
                    padding: '8px 10px', borderRadius: 6,
                    background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)',
                    fontSize: '0.625rem', color: '#94a3b8', lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#fb923c', fontWeight: 600 }}>Private Preview:</span> Access to v3 endpoints requires explicit enablement on your API key. Contact TomTom to request access.
                  </div>
                </div>
              )}

              {/* ── v2 Map Assets: full URL set ── */}
              {endpoint === 'assets-sprites' && (
                <div style={{
                  background: '#0d1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem', marginTop: 8,
                }}>
                  <div style={{
                    fontSize: '0.5625rem', fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
                  }}>All Asset URLs</div>
                  {[
                    { label: 'Style JSON', url: assetsStyleUrl(apiKey, assetsVals.assetVersion || '22.2.1-*'), color: '#4ade80' },
                    { label: 'Sprite PNG', url: assetsSpriteUrl(apiKey, assetsVals.assetVersion || '22.2.1-*', assetsVals.scale || '@2x'), color: '#7dd3fc' },
                    { label: 'Sprite JSON', url: assetsSpriteJsonUrl(apiKey, assetsVals.assetVersion || '22.2.1-*', assetsVals.scale || '@2x'), color: '#7dd3fc' },
                    { label: 'Glyphs', url: assetsGlyphUrl(apiKey, assetsVals.assetVersion || '22.2.1-*'), color: '#fb923c' },
                  ].map(({ label, url, color }) => (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: '0.5rem', fontWeight: 700, color, letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                      <code style={{
                        fontSize: '0.5625rem', color: '#86efac', fontFamily: 'var(--font-mono)',
                        lineHeight: 1.5, wordBreak: 'break-all', display: 'block',
                      }}>
                        {url.replace(`key=${apiKey || DEMO_KEY}`, 'key=···')}
                      </code>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
