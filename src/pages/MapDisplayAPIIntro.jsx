import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_MapRasterTile, L_MapVectorTile, L_MapSatelliteTile, L_MapAssetsAPI, L_MapStaticImage,
} from '../illustrations/lightVariants';

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

function EndpointCard({ Illo, title, method = 'GET', path, desc }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, flexShrink: 0, overflow: 'hidden' }}>
        <Illo />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MethodBadge method={method} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        </div>
        {path && <code style={{ fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' }}>{path}</code>}
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Thumbs ─────────────────────────────────────────────────────────────────── */
function ThumbRasterTile() { return <L_MapRasterTile />; }
function ThumbVectorTile() { return <L_MapVectorTile />; }
function ThumbSatelliteTile() { return <L_MapSatelliteTile />; }
function ThumbMapAssets() { return <L_MapAssetsAPI />; }
function ThumbStaticImage() { return <L_MapStaticImage />; }

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapDisplayAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(ThumbRasterTile, L_MapRasterTile),
      title: 'Raster Tile',
      method: 'GET',
      path: '/map/1/tile/basic/main/{zoom}/{x}/{y}.png',
      desc: 'Serve pre-rendered PNG map tiles for standard slippy-map integrations and web applications.',
    },
    {
      Illo: makeThumb(ThumbVectorTile, L_MapVectorTile),
      title: 'Vector Tile',
      method: 'GET',
      path: '/map/1/tile/basic/main/{zoom}/{x}/{y}.pbf',
      desc: 'Deliver Mapbox Vector Tiles (MVT) for client-side styled, resolution-independent map rendering.',
    },
    {
      Illo: makeThumb(ThumbSatelliteTile, L_MapSatelliteTile),
      title: 'Satellite Tile',
      method: 'GET',
      path: '/map/1/tile/sat/main/{zoom}/{x}/{y}.jpg',
      desc: 'Retrieve satellite or aerial imagery tiles for high-detail visual context overlays.',
    },
    {
      Illo: makeThumb(ThumbMapAssets, L_MapAssetsAPI),
      title: 'Map Assets',
      method: 'GET',
      path: '/map/1/sprite/{spriteId}.json',
      desc: 'Download map style sprites, glyphs, and style JSON required to render vector tiles client-side.',
    },
    {
      Illo: makeThumb(ThumbStaticImage, L_MapStaticImage),
      title: 'Static Image',
      method: 'GET',
      path: '/map/1/staticimage',
      desc: 'Generate a single static map image at a defined bounding box, zoom, and size for reports or previews.',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Map Display API provides raster and vector map tiles, satellite imagery, and static
        map images for embedding TomTom maps in web, mobile, and server-rendered applications.
        Choose raster tiles for simplicity or vector tiles for full style customisation.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: palette.bg, marginBottom: 32 }}>
        <L_MapVectorTile />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} />
          ))}
        </div>
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--black)' }}>
          GET https://api.tomtom.com/map/1/tile/basic/main/{'{'}zoom{'}'}/{'{'}x{'}'}/{'{'}y{'}'}.png?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
