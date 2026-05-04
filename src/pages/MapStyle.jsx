import { useState, useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

const MAP_DISPLAY_APIS = [
  {
    name: 'Map Display API',
    type: 'REST API',
    description: 'Tile-based mapping service powering the map view with vector tiles, raster imagery, and style bundles.',
    url: 'https://docs.tomtom.com/map-display-api/documentation/tomtom-maps/product-information/introduction',
  },
  {
    name: 'Map Display for Compose',
    type: 'Android SDK',
    description: 'Integrate a fully interactive TomTom map into a Jetpack Compose layout with a single composable.',
    url: 'https://docs.tomtom.com/navigation/android/guides/map-display/map-display-for-compose/quickstart',
  },
  {
    name: 'TomTom Map Maker',
    type: 'Tool',
    description: 'Design and publish custom map styles — colours, typography, layer visibility — then load them directly into UX Library.',
    url: 'https://mapmaker.tomtom.com',
  },
  {
    name: 'Map Maker — Docs',
    type: 'Tool',
    description: 'Get started with Map Maker: style editor guide, layer reference, and publishing workflow.',
    url: 'https://docs.tomtom.com/map-maker/documentation/overview/introduction',
  },
];

const API_KEY = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const CENTER  = [-0.1276, 51.5074]; // London

/* ─── TomTom MapStyleConfig objects ──────────────────────────── */
const STYLE_CFG = {
  standardLight: { map: '2/basic_street-light',         trafficIncidents: '2/incidents_light', trafficFlow: '2/flow_relative-light', poi: '2/poi_light'       },
  standardDark:  { map: '2/basic_street-dark',          trafficIncidents: '2/incidents_dark',  trafficFlow: '2/flow_relative-dark',  poi: '2/poi_dark'        },
  drivingLight:  { map: '2/basic_street-light-driving', trafficIncidents: '2/incidents_light', trafficFlow: '2/flow_relative-light', poi: '2/poi_light'       },
  drivingDark:   { map: '2/basic_street-dark-driving',  trafficIncidents: '2/incidents_dark',  trafficFlow: '2/flow_relative-dark',  poi: '2/poi_dark'        },
  monoLight:     { map: '2/basic_mono-light',           trafficIncidents: '2/incidents_light', trafficFlow: '2/flow_relative-light', poi: '2/poi_mono-light'  },
  monoDark:      { map: '2/basic_mono-dark',            trafficIncidents: '2/incidents_dark',  trafficFlow: '2/flow_relative-dark',  poi: '2/poi_mono-dark'   },
  satellite:     { map: '2/basic_street-satellite',     trafficIncidents: '2/incidents_light', trafficFlow: '2/flow_relative-light', poi: '2/poi_satellite'   },
};

/* ─── Flat style options ──────────────────────────────────────── */
const STYLES = [
  {
    id: 'browse',     label: 'Browse',      styleKey: 'standardLight',
    sdkName: 'BROWSE',        nipOverlay: false, browseOverlay: true,
    desc: 'Balanced road hierarchy and clear labels — optimised for destination entry and free-driving states.',
  },
  {
    id: 'browseDark', label: 'Browse Dark', styleKey: 'standardDark',
    sdkName: 'BROWSE_NIGHT',  nipOverlay: false, browseOverlay: true,
    desc: 'Dark variant of Browse, designed for low-light conditions and AMOLED displays.',
  },
  {
    id: 'drive',      label: 'Drive',       styleKey: 'drivingLight',
    sdkName: 'NAVIGATE',      nipOverlay: true,  browseOverlay: false,
    desc: 'High-contrast route highlighting with a simplified background, optimised for active guidance.',
  },
  {
    id: 'driveDark',  label: 'Drive Dark',  styleKey: 'drivingDark',
    sdkName: 'NAVIGATE_NIGHT', nipOverlay: true,  browseOverlay: false,
    desc: 'Dark variant of Drive — reduced brightness for night driving while maintaining route contrast.',
  },
  {
    id: 'mono',       label: 'Mono',        styleKey: 'monoLight',
    sdkName: 'STILL',         nipOverlay: false, browseOverlay: false,
    desc: 'Minimal monochrome style for non-driving surfaces — cluster displays, rear-seat screens, ambient contexts.',
  },
  {
    id: 'satellite',  label: 'Satellite',   styleKey: 'satellite',
    sdkName: 'STILL_SATELLITE', nipOverlay: false, browseOverlay: false,
    desc: 'Satellite imagery base for scenic route planning or premium map experiences.',
  },
];

/* ─── LiveMap ─────────────────────────────────────────────────────
 *  A thin React wrapper around the TomTom Maps SDK.
 *  styleKey / pitch changes are applied via map.setStyle / easeTo.
 * ──────────────────────────────────────────────────────────────── */
function LiveMap({ styleKey, pitch = 0, zoom = 12.5 }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const prevStyleRef = useRef(styleKey);
  const prevPitchRef = useRef(pitch);
  const prevZoomRef  = useRef(zoom);

  /* init map once */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = tt.map({
      key: API_KEY,
      container: el,
      center: CENTER,
      zoom,
      pitch,
      style: STYLE_CFG[styleKey],
      scrollZoom:  false,
      dragRotate:  false,
      keyboard:    false,
      boxZoom:     false,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* style change */
  useEffect(() => {
    if (styleKey === prevStyleRef.current) return;
    prevStyleRef.current = styleKey;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => map.setStyle(STYLE_CFG[styleKey]);
    map.loaded() ? apply() : map.once('load', apply);
  }, [styleKey]);

  /* pitch change */
  useEffect(() => {
    if (pitch === prevPitchRef.current) return;
    prevPitchRef.current = pitch;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => map.easeTo({ pitch, duration: 400 });
    map.loaded() ? apply() : map.once('load', apply);
  }, [pitch]);

  /* zoom change */
  useEffect(() => {
    if (zoom === prevZoomRef.current) return;
    prevZoomRef.current = zoom;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => map.easeTo({ zoom, duration: 400 });
    map.loaded() ? apply() : map.once('load', apply);
  }, [zoom]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

/* ─── Tablet frame (landscape) ────────────────────────────────── */
function TabletFrame({ children, nipOverlay, browseOverlay }) {
  return (
    <div style={{
      position: 'relative', width: '100%',
      background: '#181818',
      borderRadius: 18,
      padding: '14px 16px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Camera — top bezel centre */}
      <div style={{
        position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)',
        width: 6, height: 6, borderRadius: '50%', background: '#2e2e2e',
        boxShadow: 'inset 0 0 0 1.5px #111',
      }} />
      {/* Volume buttons — left side */}
      {[28, 52, 72].map((top, i) => (
        <div key={i} style={{
          position: 'absolute', left: -2, top,
          width: 3, height: i === 0 ? 16 : 22,
          background: '#242424', borderRadius: '2px 0 0 2px',
        }} />
      ))}
      {/* Power button — right side */}
      <div style={{
        position: 'absolute', right: -2, top: 40,
        width: 3, height: 28, background: '#242424', borderRadius: '0 2px 2px 0',
      }} />

      {/* Screen */}
      <div style={{
        borderRadius: 8, overflow: 'hidden',
        height: 380, position: 'relative', background: '#000',
      }}>
        {children}

        {/* NIP strip — NAVIGATE mode */}
        {nipOverlay && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            background: 'rgba(18, 52, 36, 0.96)',
            backdropFilter: 'blur(4px)',
            padding: '14px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', color: 'white', flexShrink: 0,
            }}>↖</div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>Turn left onto Oak Street</div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>in 0.4 mi</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>ETA</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>2:34 PM</div>
            </div>
          </div>
        )}

        {/* Search bar — BROWSE mode */}
        {browseOverlay && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            width: '52%', minWidth: 280,
            background: 'white', borderRadius: 12,
            padding: '11px 18px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
            display: 'flex', alignItems: 'center', gap: 10,
            pointerEvents: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="#111" strokeWidth="1.5"/>
              <path d="M10 10l3 3" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Search destination…</span>
          </div>
        )}

        {/* Home gesture bar */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

/* ─── Style explorer ─────────────────────────────────────────── */
function StyleExplorer() {
  const [activeId, setActiveId] = useState('drive');
  const style = STYLES.find(s => s.id === activeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Flat option row */}
      <div style={{ display: 'flex', gap: 8 }}>
        {STYLES.map(s => (
          <button key={s.id} onClick={() => setActiveId(s.id)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 7, cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: activeId === s.id ? 600 : 400,
            background: activeId === s.id ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${activeId === s.id ? 'var(--red)' : 'var(--border)'}`,
            color: activeId === s.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Full-width tablet map */}
      <TabletFrame nipOverlay={style.nipOverlay} browseOverlay={style.browseOverlay}>
        <LiveMap styleKey={style.styleKey} />
      </TabletFrame>

      {/* Description */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 2 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', flexShrink: 0 }}>
          MapStyle.{style.sdkName}
        </span>
        <span style={{ fontSize: '0.84rem', color: 'var(--mid)', lineHeight: 1.6 }}>
          {style.desc}
        </span>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'mapView.'}<span className="hl-f">setMapStyle</span>{'(\n'}
          {'    '}<span className="hl-t">StyleDescriptor</span>{'.'}<span className="hl-n">{style.sdkName}</span>{'\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Tilt demo ──────────────────────────────────────────────── */
function TiltDemo() {
  const [pitch, setPitch] = useState(35);
  const [zoom,  setZoom]  = useState(12.5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Full-width tablet frame — matches StyleExplorer height */}
      <TabletFrame nipOverlay={true}>
        <LiveMap styleKey="drivingLight" pitch={pitch} zoom={zoom} />
      </TabletFrame>

      {/* Controls row */}
      <div className="grid-2-col">
        {/* Tilt angle */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>Tilt angle</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{pitch}°</span>
          </div>
          <input type="range" min="0" max="60" value={pitch}
            onChange={e => setPitch(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--red)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>0° top-down</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>60° max perspective</span>
          </div>
        </div>

        {/* Zoom level */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>Zoom level</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{zoom}</span>
          </div>
          <input type="range" min="10" max="18" step="0.5" value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--red)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>10 overview</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>18 street level</span>
          </div>
        </div>
      </div>

      <CodeBlock language="kotlin" code={`mapView.setTilt(${pitch}f)\nmapView.setZoom(${zoom}f)`} />
    </div>
  );
}

/* ─── Custom URI demo ────────────────────────────────────────── */
function StyleURIDemo() {
  const [source, setSource] = useState('asset');

  const snippets = {
    asset:   { label: 'APK assets',       path: 'asset:///styles/brand-style.zip' },
    file:    { label: 'Device storage',   path: 'file:///data/user/0/com.example/files/style.zip' },
    content: { label: 'Content provider', path: 'content://com.example.provider/styles/night.zip' },
  };
  const snip = snippets[source];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.entries(snippets).map(([k, v]) => (
          <button key={k} onClick={() => setSource(k)} style={{
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.76rem',
            fontWeight: source === k ? 600 : 400,
            background: source === k ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${source === k ? 'var(--red)' : 'var(--border)'}`,
            color: source === k ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>{v.label}</button>
        ))}
      </div>
      <CodeBlock tabs={['Kotlin']}>
        <pre>
          <span className="hl-k">val</span>{' uri = '}<span className="hl-t">StyleUri</span>{'('}<span className="hl-s">{`"${snip.path}"`}</span>{')\n'}
          <span className="hl-k">val</span>{' descriptor = '}<span className="hl-t">StyleDescriptor</span>{'(uri)\n\n'}
          {'mapView.'}<span className="hl-f">setMapStyle</span>{'(descriptor)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function MapStyle() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map styles</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Apply a custom visual style to the navigation map — define road colours, labels, icons, and layer order using MapLibre-compatible JSON.
      </div>

      <ApiLinks items={MAP_DISPLAY_APIS} title="APIs & Resources" />

      <div className="zone">
        <h2 className="sh" id="ms-overview">Overview</h2>
        <p className="body">
          Styles are applied to the map view via a <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>StyleDescriptor</code>,
          which wraps either a preloaded constant or a custom <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>StyleUri</code>.
          The map reloads all tile layers when a new style is applied, so style switches are best
          triggered between navigation states rather than mid-guidance.
        </p>
        <Callout type="info">
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>MapStyle.NAVIGATE</code> is
          the default applied when UX Library initialises. You only need to call{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>setMapStyle()</code> explicitly
          when switching away from or back to the default.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="ms-variants">Style variants</h2>
        <p className="body">
          Three preloaded styles are available, each targeting a different usage context.
          Select a style below to preview its live appearance and see the corresponding Kotlin call.
        </p>
        <StyleExplorer />
      </div>

      <div className="zone">
        <h2 className="sh" id="ms-uri">Style URIs</h2>
        <p className="body">
          A <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>StyleUri</code> points
          to a style bundle — a ZIP file containing the style JSON and all referenced assets
          (glyphs, sprites, tile sources). Three URI schemes are supported:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { scheme: 'asset://', desc: 'Style bundled inside the APK assets folder. No storage permissions required.' },
            { scheme: 'file://',  desc: 'Style on device storage. Requires appropriate read permissions.' },
            { scheme: 'content://', desc: 'Style exposed by an Android ContentProvider. Useful for shared/managed styles.' },
          ].map(({ scheme, desc }) => (
            <div key={scheme} style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--red)', display: 'block', marginBottom: 6 }}>{scheme}</code>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
        <p className="body">Select a source type to see the corresponding code:</p>
        <StyleURIDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ms-custom">Customising a style</h2>
        <p className="body">
          If the preloaded styles do not match your OEM brand requirements, UX Library supports
          fully custom styles. Custom styles must be authored with the{' '}
          <strong>TomTom Style Editor</strong> (a Maputnik-based tool) or any MapLibre-compatible
          style editor, then packaged as a ZIP file.
        </p>
        <Callout type="warn">
          Custom styles must include TomTom's required layer IDs — particularly the route, position
          indicator, and safe-area layers — or navigation overlays will not render correctly.
          Use the TomTom base style as your starting point and modify from there.
        </Callout>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-c">{'// Load a custom branded style from APK assets\n'}</span>
            <span className="hl-k">val</span>{' descriptor = '}<span className="hl-t">StyleDescriptor</span>{'(\n'}
            {'    uri = '}<span className="hl-t">StyleUri</span>{'('}<span className="hl-s">'"asset:///styles/oem-brand.zip"'</span>{')\n)\n\n'}
            {'mapView.'}<span className="hl-f">setMapStyle</span>{'(descriptor)'}
          </pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ms-tilt">Tilt and zoom</h2>
        <p className="body">
          Tilt angles the map into a 3D perspective — common during active guidance to give drivers
          a sense of the road ahead. Zoom controls the level of detail, from a city overview down to
          individual street level. Both are set independently and can be animated together.
          Adjust the sliders to preview the live effect and see the generated Kotlin output update below.
        </p>
        <TiltDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ms-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Apply preloaded Browse / Navigate / Still styles', 'P0', 'Default style on init: NAVIGATE'],
              ['Day / night variants per style group',             'P0', 'BROWSE, NAVIGATE each have day + night; STILL has light, dark, satellite'],
              ['Load custom style from asset:// URI',             'P0', 'ZIP bundle with TomTom base layers included'],
              ['Load custom style from file:// URI',             'P0', 'Requires READ_EXTERNAL_STORAGE on API < 29'],
              ['Set tilt angle with animation',                  'P0', '0–60° range; AnimationType and duration configurable'],
              ['Load style from content:// provider',            'P1', 'For shared/managed style distribution'],
              ['Hot-swap styles without map reload',             'P2', 'Discovery required; low-latency style switching for day/night'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
