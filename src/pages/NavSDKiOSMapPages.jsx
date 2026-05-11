import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared map mock background ─────────────────────────────────────────── */
export function MapBg({ style = 'day', showTrafficFlow = false, showTrafficIncidents = false }) {
  const bgColor       = style === 'night' ? '#0d1117'                    : style === 'satellite' ? '#1a2f1a'                    : '#D4E8F8';
  const roadColor     = style === 'night' ? 'rgba(255,255,255,0.15)'     : style === 'satellite' ? 'rgba(255,255,255,0.3)'      : 'rgba(120,155,200,0.55)';
  const mainRoadColor = style === 'night' ? 'rgba(255,255,255,0.25)'     : style === 'satellite' ? 'rgba(255,220,100,0.5)'      : 'rgba(70,110,170,0.85)';
  const labelColor    = style === 'night' ? 'rgba(255,255,255,0.4)'      : style === 'satellite' ? 'rgba(255,255,255,0.6)'      : 'rgba(27,61,110,0.9)';

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" fill="none">
      {/* background */}
      <rect width="300" height="200" fill={bgColor} />

      {/* grid streets */}
      {[30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke={roadColor} strokeWidth="0.8" />
      ))}
      {[40, 80, 120, 160].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke={roadColor} strokeWidth="0.8" />
      ))}

      {/* main road */}
      <path d="M0 100 Q75 90 150 100 T300 95" stroke={mainRoadColor} strokeWidth="4" strokeLinecap="round" />

      {/* traffic flow overlay */}
      {showTrafficFlow && (
        <>
          <path d="M0 100 Q40 94 70 97" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M70 97 Q100 100 120 99" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M120 99 Q150 98 180 100" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M180 100 Q220 98 260 96 T300 95" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
        </>
      )}

      {/* traffic incident markers */}
      {showTrafficIncidents && (
        <>
          <polygon points="130,92 136,104 124,104" fill="#ef4444" opacity="0.9" />
          <text x="130" y="102" textAnchor="middle" fill="white" style={{ fontSize: 7, fontWeight: 700 }}>!</text>
          <rect x="178" y="88" width="10" height="8" rx="1" fill="#f59e0b" opacity="0.9" />
          <text x="183" y="95" textAnchor="middle" fill="white" style={{ fontSize: 5, fontWeight: 700 }}>SLOW</text>
        </>
      )}

      {/* label */}
      <text x="150" y="82" textAnchor="middle" fill={labelColor} style={{ fontSize: 7 }}>Main St</text>
    </svg>
  );
}

/* ─── Toggle switch helper ────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, secondary }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      borderRadius: 7, cursor: 'pointer',
      background: value ? 'var(--surface)' : 'var(--bg)',
      border: '1px solid var(--border)', opacity: value ? 1 : 0.55,
      transition: 'all 0.12s',
    }}>
      <div style={{ width: 32, height: 18, borderRadius: 9, background: value ? 'var(--red)' : 'var(--border)', transition: 'background 0.15s', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
        {secondary && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{secondary}</div>}
      </div>
    </div>
  );
}

/* ─── Radio group helper ─────────────────────────────────────────────────── */
function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{
          padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
          fontWeight: value === opt.id ? 600 : 400,
          background: value === opt.id ? '#fff5f5' : 'var(--bg)',
          border: `1px solid ${value === opt.id ? 'var(--red)' : 'var(--border)'}`,
          color: value === opt.id ? 'var(--red)' : 'var(--mid)',
          transition: 'all 0.1s',
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

/* ─── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. MAP DISPLAY — SWIFTUI
   ═══════════════════════════════════════════════════════════════════════════ */
const MAP_SWIFTUI_APIS = [
  { name: 'Map Display API',        type: 'REST API',  description: 'Vector and raster tile endpoints that back the map tiles rendered by TomTomMapView.',                         pageId: 'map-display-api-intro',  productId: 'map-display-api' },
  { name: 'Map Styles (iOS)',       type: 'iOS SDK',   description: 'Apply built-in day/night or custom style URLs using map.loadStyle(...).',                                     pageId: 'navsdk-ios-map-styles',  productId: 'navsdk-ios' },
  { name: 'Camera & Animations',   type: 'iOS SDK',   description: 'Control map viewpoint — location, zoom, tilt, bearing — and animate camera transitions via CameraUpdate.',    pageId: 'navsdk-ios-map-camera',  productId: 'navsdk-ios' },
  { name: 'Markers (iOS)',          type: 'iOS SDK',   description: 'Add PointAnnotation markers with custom images and tap handlers.',                                             pageId: 'navsdk-ios-map-markers', productId: 'navsdk-ios' },
];

export function NavSDKiOSMapSwiftUI({ onNavigate }) {
  const [layer, setLayer] = useState('base');
  const mapStyle = layer === 'night' ? 'night' : 'day';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display for SwiftUI</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Embed a TomTom map into a SwiftUI view using <code>TomTomMapView</code> with a <code>@StateObject</code> map model. The view handles the full map lifecycle within SwiftUI's declarative hierarchy.
      </p>

      <ApiLinks items={MAP_SWIFTUI_APIS} onNavigate={onNavigate} />

      <Callout type="info">
        <strong>iOS SwiftUI only.</strong> This page covers native SwiftUI integration. For UIKit-based apps, see <strong>Map Display for UIKit</strong>. Android developers use <code>TomTomMapComposable</code> instead.
      </Callout>

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="swiftui-demo">Interactive demo</h2>
        <p className="body">Toggle between map style options to see how the map appearance changes at runtime.</p>

        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Map style</SectionLabel>
          <RadioGroup
            options={[
              { id: 'base', label: 'Base (day)' },
              { id: 'night', label: 'Night' },
            ]}
            value={layer}
            onChange={setLayer}
          />
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <MapBg style={mapStyle} />
          {/* SwiftUI label */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px',
            fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)',
          }}>
            TomTomMapView · SwiftUI
          </div>
          {/* Location puck */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' SwiftUI\n'}
              <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
              <span className="hl-k">struct</span>{' '}<span className="hl-t">MapScreen</span>{': '}<span className="hl-t">View</span>{' {\n'}
              {'    @'}<span className="hl-t">StateObject</span>{' '}<span className="hl-k">private var</span>{' mapModel = '}<span className="hl-t">MapModel</span>{'()\n\n'}
              {'    '}<span className="hl-k">var</span>{' body: some '}<span className="hl-t">View</span>{' {\n'}
              {'        '}<span className="hl-t">TomTomMapView</span>{'(mapModel: mapModel)\n'}
              {'            .'}<span className="hl-f">onMapReady</span>{' { map '}<span className="hl-k">in</span>{'\n'}
              {'                map.'}<span className="hl-f">setZoom</span>{'(12, animated: '}<span className="hl-k">false</span>{')\n'}
              {'                map.'}<span className="hl-f">centerOn</span>{'(coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(\n'}
              {'                    latitude: 52.3766, longitude: 4.9041\n'}
              {'                ))\n'}
              {'            }\n'}
              {'            .'}<span className="hl-f">ignoresSafeArea</span>{'()\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* Lifecycle */}
      <div className="zone">
        <h2 className="sh" id="swiftui-lifecycle">Lifecycle handling</h2>
        <p className="body">
          <code>@StateObject</code> ensures <code>MapModel</code> is created once per view lifetime and survives re-renders. The map surface is initialised when the view appears and released when it leaves the hierarchy automatically.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">MapModel</span>{': '}<span className="hl-t">ObservableObject</span>{' {\n'}
            {'    '}<span className="hl-k">@Published var</span>{' map: '}<span className="hl-t">TomTomMap</span>{'? = nil\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">onMapReady</span>{'(_ map: '}<span className="hl-t">TomTomMap</span>{') {\n'}
            {'        self.map = map\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
      </div>

      {/* onMapReady */}
      <div className="zone">
        <h2 className="sh" id="swiftui-ready">onMapReady callback</h2>
        <p className="body">
          The <code>.onMapReady</code> modifier fires once when the map tiles and style are fully loaded. Use it to configure camera, add layers, or store a reference to the <code>TomTomMap</code> instance.
        </p>
        <Callout type="warn">
          Do not interact with the map before <code>onMapReady</code> fires. Camera calls or annotation additions before this point are silently dropped.
        </Callout>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. MAP DISPLAY — UIKIT
   ═══════════════════════════════════════════════════════════════════════════ */
const MAP_UIKIT_APIS = [
  { name: 'Map Display API',        type: 'REST API',  description: 'Vector and raster tile endpoints that back the map tiles rendered by TomTomMapView.',                         pageId: 'map-display-api-intro',  productId: 'map-display-api' },
  { name: 'Map Display for SwiftUI',type: 'iOS SDK',   description: 'SwiftUI-first integration using TomTomMapView with @StateObject — preferred for new SwiftUI apps.',           pageId: 'navsdk-ios-map-swiftui', productId: 'navsdk-ios' },
  { name: 'Camera & Animations',   type: 'iOS SDK',   description: 'Control map viewpoint — location, zoom, tilt, bearing — and animate camera transitions via CameraUpdate.',    pageId: 'navsdk-ios-map-camera',  productId: 'navsdk-ios' },
];

export function NavSDKiOSMapUIKit({ onNavigate }) {
  const [attached, setAttached] = useState(true);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display for UIKit</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Integrate <code>TomTomMapView</code> into a <code>UIViewController</code> using Auto Layout constraints. Provides the same map capabilities as the SwiftUI variant for UIKit-based apps.
      </p>

      <ApiLinks items={MAP_UIKIT_APIS} onNavigate={onNavigate} />

      <Callout type="warn">
        <strong>iOS UIKit only.</strong> This page covers <code>TomTomMapView</code> in a <code>UIViewController</code>. For SwiftUI apps, see <strong>Map Display for SwiftUI</strong>. Android developers use <code>TomTomMapFragment</code> instead.
      </Callout>

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="uikit-demo">View controller preview</h2>
        <p className="body">Toggle below to simulate <code>viewDidLoad</code> — the point where the map view is added as a subview.</p>

        <div style={{ marginBottom: 12 }}>
          <Toggle value={attached} onChange={setAttached} label="View loaded" secondary="viewDidLoad() called — map added as subview" />
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '2px dashed var(--border)', background: 'var(--bg)' }}>
          {attached ? (
            <>
              <MapBg style="day" />
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(0,0,0,0.55)', borderRadius: 5, padding: '3px 8px',
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)',
              }}>
                TomTomMapView · UIKit
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.875rem' }}>
              UIViewController — no map subview attached
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' UIKit\n'}
              <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
              <span className="hl-k">class</span>{' '}<span className="hl-t">MapViewController</span>{': '}<span className="hl-t">UIViewController</span>{' {\n'}
              {'    '}<span className="hl-k">private let</span>{' mapView = '}<span className="hl-t">TomTomMapView</span>{'()\n\n'}
              {'    '}<span className="hl-k">override func</span>{' '}<span className="hl-f">viewDidLoad</span>{'() {\n'}
              {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">viewDidLoad</span>{'()\n'}
              {'        mapView.translatesAutoresizingMaskIntoConstraints = '}<span className="hl-k">false</span>{'\n'}
              {'        view.'}<span className="hl-f">addSubview</span>{'(mapView)\n'}
              {'        '}<span className="hl-t">NSLayoutConstraint</span>{'.'}<span className="hl-f">activate</span>{'([\n'}
              {'            mapView.'}<span className="hl-f">topAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.topAnchor),\n'}
              {'            mapView.'}<span className="hl-f">leadingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.leadingAnchor),\n'}
              {'            mapView.'}<span className="hl-f">trailingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.trailingAnchor),\n'}
              {'            mapView.'}<span className="hl-f">bottomAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.bottomAnchor),\n'}
              {'        ])\n'}
              {'        mapView.'}<span className="hl-f">onMapReady</span>{' { [weak self] map '}<span className="hl-k">in</span>{'\n'}
              {'            self?.'}<span className="hl-f">configureMap</span>{'(map)\n'}
              {'        }\n'}
              {'    }\n\n'}
              {'    '}<span className="hl-k">private func</span>{' '}<span className="hl-f">configureMap</span>{'(_ map: '}<span className="hl-t">TomTomMap</span>{') {\n'}
              {'        map.'}<span className="hl-f">setZoom</span>{'(12, animated: '}<span className="hl-k">false</span>{')\n'}
              {'        map.'}<span className="hl-f">centerOn</span>{'(coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.3766, longitude: 4.9041))\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* Auto Layout */}
      <div className="zone">
        <h2 className="sh" id="uikit-autolayout">Auto Layout setup</h2>
        <p className="body">
          Always set <code>translatesAutoresizingMaskIntoConstraints = false</code> before activating constraints. Pin all four edges to fill the view controller's root view — or use <code>safeAreaLayoutGuide</code> anchors to respect notches and home indicators.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-c">{'// Pin to safe area instead of full edges:\n'}</span>
            <span className="hl-t">NSLayoutConstraint</span>{'.'}<span className="hl-f">activate</span>{'([\n'}
            {'    mapView.'}<span className="hl-f">topAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.safeAreaLayoutGuide.topAnchor),\n'}
            {'    mapView.'}<span className="hl-f">leadingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.leadingAnchor),\n'}
            {'    mapView.'}<span className="hl-f">trailingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.trailingAnchor),\n'}
            {'    mapView.'}<span className="hl-f">bottomAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.bottomAnchor),\n'}
            {'])'}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. MAP STYLES
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_MAP_STYLES = [
  { id: 'browse',       label: 'Browse',        descriptor: '.tomTomBasicMain',         style: 'day',       desc: 'Full-colour day style — roads, POIs, and labels.' },
  { id: 'browse-night', label: 'Browse Night',  descriptor: '.tomTomBasicNight',        style: 'night',     desc: 'Dark map style optimised for night-time driving.' },
  { id: 'drive',        label: 'Drive',         descriptor: '.tomTomDrivingMain',       style: 'day',       desc: 'Simplified day style for active turn-by-turn navigation.' },
  { id: 'drive-night',  label: 'Drive Night',   descriptor: '.tomTomDrivingNight',      style: 'night',     desc: 'Dark driving style with high-contrast lanes and junctions.' },
  { id: 'mono',         label: 'Mono',          descriptor: '.tomTomMonochrome',        style: 'satellite', desc: 'Monochrome style for branded or accessibility contexts.' },
  { id: 'custom',       label: 'Custom URL',    descriptor: 'URL(string: "...")',       style: 'satellite', desc: 'Any hosted TomTom style URL for OEM brand styles.' },
];

const IOS_MAP_STYLES_APIS = [
  { name: 'Map Display API',         type: 'REST API',  description: 'Vector tile endpoint that serves the layer data styled by the loaded style — supports custom style JSON.',    pageId: 'map-display-api-intro',  productId: 'map-display-api' },
  { name: 'Map Display for SwiftUI', type: 'iOS SDK',   description: 'SwiftUI map where styles are applied — start here if using SwiftUI.',                                        pageId: 'navsdk-ios-map-swiftui', productId: 'navsdk-ios' },
  { name: 'TomTom Map Maker',        type: 'Tool',      description: 'Design and publish custom map styles — colours, typography, layer visibility — then load by URL.',             url: 'https://mapmaker.tomtom.com' },
];

export function NavSDKiOSMapStyles({ onNavigate }) {
  const [activeStyle, setActiveStyle] = useState('browse');
  const current = IOS_MAP_STYLES.find(s => s.id === activeStyle) ?? IOS_MAP_STYLES[0];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Styles</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Switch between built-in Browse, Drive, Mono, and Custom styles using <code>map.loadStyle(...)</code>. Controls road colours, label visibility, POI icons, and landmark layers.
      </p>

      <ApiLinks items={IOS_MAP_STYLES_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="ios-ms-demo">Interactive demo</h2>
        <p className="body">Select a style preset to see how the map appearance changes at runtime.</p>

        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Style preset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 6 }}>
            {IOS_MAP_STYLES.map(s => (
              <button key={s.id} onClick={() => setActiveStyle(s.id)} style={{
                padding: '10px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                fontWeight: activeStyle === s.id ? 600 : 400,
                background: activeStyle === s.id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${activeStyle === s.id ? 'var(--red)' : 'var(--border)'}`,
                color: activeStyle === s.id ? 'var(--red)' : 'var(--mid)',
                fontSize: '0.8125rem', transition: 'background 0.1s, border-color 0.1s, color 0.1s',
              }}>{s.label}</button>
            ))}
          </div>
          {current?.desc && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: 8, marginBottom: 0 }}>{current.desc}</p>
          )}
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <MapBg style={current.style} />
          {activeStyle === 'custom' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,80,60,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', color: '#4ade80', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '6px 12px', borderRadius: 6 }}>Custom style URL applied</span>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px',
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)',
          }}>{current.descriptor}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-c">{'// Apply built-in style\n'}</span>
              {'map.'}<span className="hl-f">loadStyle</span>{'('}<span className="hl-n">{current?.descriptor ?? '.tomTomBasicMain'}</span>{')\n\n'}
              <span className="hl-c">{'// Custom style URL\n'}</span>
              <span className="hl-k">let</span>{' url = URL(string: '}<span className="hl-s">{'"https://api.tomtom.com/maps/orbis/styles/v1/tomtom/basic_main/style.json?key=\\(apiKey)"'}</span>{')!\n'}
              {'map.'}<span className="hl-f">loadStyle</span>{'(styleURL: url)\n\n'}
              <span className="hl-c">{'// Listen for style load completion\n'}</span>
              {'map.'}<span className="hl-f">addStyleObserver</span>{' { event '}<span className="hl-k">in</span>{'\n'}
              {'    '}<span className="hl-c">{'// Re-apply custom layers here\n'}</span>
              {'}'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* Built-in styles reference */}
      <div className="zone">
        <h2 className="sh" id="ios-ms-builtins">Built-in style constants</h2>
        <table className="prop-table">
          <thead><tr><th>Constant</th><th>Appearance</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['.tomTomBasicMain',    'Browse (Day)',   'Full-colour day style with roads, POIs, and labels.'],
              ['.tomTomBasicNight',   'Browse (Night)', 'Dark map style optimised for night-time driving.'],
              ['.tomTomDrivingMain',  'Drive (Day)',    'Simplified day style for active turn-by-turn navigation.'],
              ['.tomTomDrivingNight', 'Drive (Night)',  'Dark driving style with high-contrast lanes and junctions.'],
              ['.tomTomMonochrome',   'Mono',           'Monochrome style for branded or accessibility contexts.'],
              ['Custom URL',         'Any',            'Pass any TomTom style URL for OEM brand styles.'],
            ].map(([c, a, d]) => (
              <tr key={c}>
                <td><code>{c}</code></td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{a}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Style URI schemes */}
      <div className="zone">
        <h2 className="sh" id="ios-ms-uri">Loading local styles</h2>
        <p className="body">Load a style JSON bundled in your app bundle or stored on device using file URLs:</p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-c">{'// Load from app bundle\n'}</span>
            <span className="hl-k">if let</span>{' bundleURL = Bundle.main.'}<span className="hl-f">url</span>{'(forResource: '}<span className="hl-s">"brand_style"</span>{', withExtension: '}<span className="hl-s">"json"</span>{') {\n'}
            {'    map.'}<span className="hl-f">loadStyle</span>{'(styleURL: bundleURL)\n}\n\n'}
            <span className="hl-c">{'// Load from documents directory\n'}</span>
            <span className="hl-k">let</span>{' docsURL = FileManager.default.'}<span className="hl-f">urls</span>{'(for: .documentDirectory, in: .userDomainMask).first!\n'}
            <span className="hl-k">let</span>{' styleFile = docsURL.'}<span className="hl-f">appendingPathComponent</span>{'('}<span className="hl-s">"custom_style.json"</span>{')\n'}
            {'map.'}<span className="hl-f">loadStyle</span>{'(styleURL: styleFile)'}
          </pre>
        </CodeBlock>
      </div>

      {/* Style observer */}
      <div className="zone">
        <h2 className="sh" id="ios-ms-observer">Style change observer</h2>
        <p className="body">Register an observer to be notified whenever a new style finishes loading. Useful for re-applying layer customisations that are reset on each style load.</p>
        <Callout type="info">
          Layers and annotations added before a style change may need to be re-added after the style loads. Use the style observer to re-apply custom layers reliably.
        </Callout>
      </div>

      {/* Requirements */}
      <div className="zone">
        <h2 className="sh" id="ios-ms-requirements">Feature requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Feature</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Browse / Browse Night styles', 'P0', 'Included in core iOS NavSDK map module.'],
              ['Drive / Drive Night styles',   'P0', 'Auto-applied by NavigationSession during active navigation.'],
              ['Mono style',                   'P1', 'Useful for CarPlay displays or accessibility contexts.'],
              ['Custom HTTPS style URL',        'P0', 'Requires valid TomTom Maps API key. Author styles in TomTom Map Maker.'],
              ['Bundle-local style',            'P1', 'Bundle style JSON in the app target — useful for offline-first deployments.'],
              ['Style change observer',         'P1', 'Re-apply custom layers after style swap via addStyleObserver.'],
            ].map(([f, p, n]) => (
              <tr key={f}>
                <td style={{ fontWeight: 500 }}>{f}</td>
                <td><span style={{ background: p === 'P0' ? '#fee2e2' : p === 'P1' ? '#fef3c7' : '#f0fdf4', color: p === 'P0' ? '#991b1b' : p === 'P1' ? '#92400e' : '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>{p}</span></td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CAMERA & ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_CAMERA_PRESETS = [
  { id: 'overview', label: 'Overview', zoom: 8,  tilt: 0,  bearing: 0,   desc: 'Zoom 8, flat' },
  { id: 'street',   label: 'Street',   zoom: 15, tilt: 45, bearing: 30,  desc: 'Zoom 15, 45° tilt' },
  { id: 'driving',  label: 'Driving',  zoom: 17, tilt: 60, bearing: 135, desc: 'Zoom 17, 60° tilt' },
  { id: 'aerial',   label: 'Aerial',   zoom: 12, tilt: 25, bearing: 45,  desc: 'Zoom 12, 25° tilt' },
];

const IOS_CAMERA_APIS = [
  { name: 'Map Display for SwiftUI', type: 'iOS SDK', description: 'SwiftUI map where camera updates are applied — start here for SwiftUI apps.',                               pageId: 'navsdk-ios-map-swiftui', productId: 'navsdk-ios' },
  { name: 'Map Display for UIKit',   type: 'iOS SDK', description: 'UIKit map with the same CameraUpdate interface for UIViewController-based apps.',                          pageId: 'navsdk-ios-map-uikit',   productId: 'navsdk-ios' },
];

export function NavSDKiOSMapCamera({ onNavigate }) {
  const [preset, setPreset] = useState('overview');
  const [animated, setAnimated] = useState(true);
  const current = IOS_CAMERA_PRESETS.find(p => p.id === preset);

  const tiltFactor = current.tilt / 70;
  const perspectiveScale = 1 - tiltFactor * 0.25;
  const verticalShift = tiltFactor * 20;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Camera &amp; Animations</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Control the map camera position, zoom, tilt, and bearing programmatically using <code>CameraUpdate</code>. Use <code>map.apply(cameraUpdate:)</code> for animated transitions or instant moves.
      </p>

      <ApiLinks items={IOS_CAMERA_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="ios-cam-demo">Interactive demo</h2>
        <p className="body">Select a camera preset and toggle between animated and instant transitions.</p>

        <div style={{ marginBottom: 8 }}>
          <SectionLabel>Camera preset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {IOS_CAMERA_PRESETS.map(p => (
              <button key={p.id} onClick={() => setPreset(p.id)} style={{
                padding: '8px 6px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                fontWeight: preset === p.id ? 600 : 400, fontSize: '0.8125rem',
                background: preset === p.id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${preset === p.id ? 'var(--red)' : 'var(--border)'}`,
                color: preset === p.id ? 'var(--red)' : 'var(--mid)',
                transition: 'all 0.1s',
              }}>
                <div>{p.label}</div>
                <div style={{ fontSize: '0.6875rem', opacity: 0.6, marginTop: 2 }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Toggle
            value={animated}
            onChange={setAnimated}
            label="Animated transition"
            secondary={animated ? 'animation: .linear(duration: 0.5)' : 'no animation'}
          />
        </div>

        {/* Map with perspective effect */}
        <div style={{
          width: '100%', height: 260, borderRadius: 16, overflow: 'hidden',
          position: 'relative', border: '1px solid var(--border)',
          perspective: '600px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `rotateX(${tiltFactor * 25}deg) scale(${perspectiveScale}) translateY(${verticalShift}px)`,
            transformOrigin: 'bottom center',
            transition: animated ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}>
            <MapBg style="day" />
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)' }}>
            zoom: {current.zoom} · tilt: {current.tilt}° · bearing: {current.bearing}°
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-c">{'// Animate to location\n'}</span>
              <span className="hl-k">let</span>{' update = '}<span className="hl-t">CameraUpdate</span>{'.centerOn(\n'}
              {'    coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.3766, longitude: 4.9041),\n'}
              {'    zoom: '}<span className="hl-n">{current.zoom}</span>{',\n'}
              {'    tilt: '}<span className="hl-n">{current.tilt}</span>{',\n'}
              {'    bearing: '}<span className="hl-n">{current.bearing}</span>{',\n'}
              {'    animation: '}<span className="hl-n">{animated ? '.linear(duration: 0.5)' : '.none'}</span>{'\n'}
              {')\n'}
              {'map.'}<span className="hl-f">apply</span>{'(cameraUpdate: update)\n\n'}
              <span className="hl-c">{'// Fit bounds\n'}</span>
              <span className="hl-k">let</span>{' bounds = '}<span className="hl-t">BoundingBox</span>{'(\n'}
              {'    min: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.3, longitude: 4.8),\n'}
              {'    max: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.4, longitude: 5.0)\n'}
              {')\n'}
              {'map.'}<span className="hl-f">apply</span>{'(cameraUpdate: .'}<span className="hl-f">fitBounds</span>{'(bounds, padding: '}<span className="hl-t">UIEdgeInsets</span>{'(top: 40, left: 20, bottom: 40, right: 20)))'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* CameraUpdate reference */}
      <div className="zone">
        <h2 className="sh" id="ios-cam-params">CameraUpdate parameters</h2>
        <table className="prop-table">
          <thead><tr><th>Parameter</th><th>Range</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['coordinate', 'CLLocationCoordinate2D', 'Geographic centre of the camera view.'],
              ['zoom', '1 – 22', 'Zoom level. 1 = world, 15 = streets, 22 = buildings.'],
              ['tilt', '0° – 70°', 'Camera tilt. 0 = top-down, 70 = near-horizon perspective.'],
              ['bearing', '0° – 360°', 'Map rotation. 0 = north-up, 90 = east-up.'],
              ['animation', 'CameraAnimation', '.linear(duration:), .ease(duration:), or .none for instant.'],
            ].map(([p, r, d]) => (
              <tr key={p}>
                <td><code>{p}</code></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--mid)' }}>{r}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. MARKERS (ANNOTATIONS)
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_DEMO_MARKERS = [
  { id: 1, x: 80,  y: 80,  label: 'Café',    color: '#e2001a' },
  { id: 2, x: 160, y: 110, label: 'Hotel',   color: '#e2001a' },
  { id: 3, x: 230, y: 70,  label: 'Parking', color: '#3b82f6' },
  { id: 4, x: 120, y: 150, label: 'Museum',  color: '#8b5cf6' },
];

function AnnotationPin({ x, y, label, color, selected, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {selected && <circle cx={x} cy={y - 14} r="10" fill={color} opacity="0.2" />}
      <path
        d={`M${x},${y} C${x - 8},${y - 8} ${x - 8},${y - 20} ${x},${y - 20} C${x + 8},${y - 20} ${x + 8},${y - 8} ${x},${y}`}
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
      <circle cx={x} cy={y - 14} r="3.5" fill="white" />
      {selected && (
        <rect x={x - 24} y={y - 38} width={48} height={16} rx="4" fill="rgba(0,0,0,0.75)" />
      )}
      {selected && (
        <text x={x} y={y - 27} textAnchor="middle" fill="white" style={{ fontSize: 8, fontWeight: 600 }}>{label}</text>
      )}
    </g>
  );
}

const IOS_MARKERS_APIS = [
  { name: 'Search API',              type: 'REST API',  description: 'Fuzzy and POI search results are the primary source of coordinates placed as map annotations.',                pageId: 'search-api-intro',       productId: 'search-api' },
  { name: 'Map Display for SwiftUI', type: 'iOS SDK',   description: 'SwiftUI map that hosts the annotation manager — annotations are added via the TomTomMap API.',               pageId: 'navsdk-ios-map-swiftui', productId: 'navsdk-ios' },
];

export function NavSDKiOSMapMarkers({ onNavigate }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Markers &amp; Annotations</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Add <code>PointAnnotation</code> markers anchored to geographic coordinates. Supports custom images, tap handlers via <code>AnnotationManagerDelegate</code>, and dynamic add/remove.
      </p>

      <ApiLinks items={IOS_MARKERS_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="ios-mk-demo">Interactive demo</h2>
        <p className="body">Tap annotations to select them and see the tap handler pattern.</p>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            <rect width="300" height="200" fill="#1e2d40" />
            {[30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            ))}
            {[40, 80, 120, 160].map(y => (
              <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            ))}
            <path d="M0 100 Q75 90 150 100 T300 95" stroke="#c8a96e" strokeWidth="4" strokeLinecap="round" />
            {IOS_DEMO_MARKERS.map(m => (
              <AnnotationPin
                key={m.id} x={m.x} y={m.y} label={m.label} color={m.color}
                selected={selectedMarker === m.id}
                onClick={() => setSelectedMarker(prev => prev === m.id ? null : m.id)}
              />
            ))}
          </svg>
          {selectedMarker && (
            <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(15,26,40,0.92)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
              Selected: <strong style={{ color: 'white' }}>{IOS_DEMO_MARKERS.find(m => m.id === selectedMarker)?.label}</strong> — handled by <code style={{ color: '#e2001a' }}>annotationManager(_:didTapAnnotation:)</code>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-c">{'// Add a point annotation\n'}</span>
              <span className="hl-k">let</span>{' annotation = '}<span className="hl-t">PointAnnotation</span>{'(coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.3766, longitude: 4.9041))\n'}
              {'annotation.image = '}<span className="hl-t">UIImage</span>{'(named: '}<span className="hl-s">'"custom-pin"'</span>{')\n'}
              {'annotation.userInfo = ['}<span className="hl-s">'"id"'</span>{': '}<span className="hl-s">'"poi-1"'</span>{']\n'}
              {'map.annotationManager.'}<span className="hl-f">addAnnotation</span>{'(annotation)\n\n'}
              <span className="hl-c">{'// Handle taps\n'}</span>
              {'map.annotationManager.delegate = self\n\n'}
              <span className="hl-k">extension</span>{' '}<span className="hl-t">MapViewController</span>{': '}<span className="hl-t">AnnotationManagerDelegate</span>{' {\n'}
              {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">annotationManager</span>{'(_ manager: '}<span className="hl-t">AnnotationManager</span>{', didTapAnnotation annotation: '}<span className="hl-t">PointAnnotation</span>{') {\n'}
              {'        print('}<span className="hl-s">{'"Tapped: \\(annotation.userInfo)"'}</span>{')\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* PointAnnotation reference */}
      <div className="zone">
        <h2 className="sh" id="ios-mk-options">PointAnnotation properties</h2>
        <table className="prop-table">
          <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['coordinate', 'CLLocationCoordinate2D', 'Geographic anchor position.'],
              ['image', 'UIImage?', 'Custom icon bitmap. Falls back to default red pin when nil.'],
              ['userInfo', '[String: Any]?', 'Arbitrary data attached to the annotation for identification in tap handlers.'],
              ['anchor', 'AnnotationAnchor', 'Image anchor point relative to coordinate (default: .bottom).'],
            ].map(([o, t, d]) => (
              <tr key={o}>
                <td><code>{o}</code></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--mid)' }}>{t}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remove annotations */}
      <div className="zone">
        <h2 className="sh" id="ios-mk-remove">Removing annotations</h2>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-c">{'// Remove a specific annotation\n'}</span>
            {'map.annotationManager.'}<span className="hl-f">removeAnnotation</span>{'(annotation)\n\n'}
            <span className="hl-c">{'// Remove all annotations\n'}</span>
            {'map.annotationManager.'}<span className="hl-f">removeAllAnnotations</span>{'()'}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. TRAFFIC
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_FLOW_STYLES = [
  { id: 'relativeDelay', label: 'Relative delay', desc: 'Colour based on minutes of delay' },
  { id: 'relative',      label: 'Relative',       desc: 'Colour relative to free-flow speed' },
  { id: 'absolute',      label: 'Absolute',       desc: 'Colour based on absolute speed' },
];

const IOS_TRAFFIC_APIS = [
  { name: 'Traffic API — Flow',      type: 'REST API',  description: 'Live traffic flow data — speed, jam factor, freeflow — that the SDK fetches to colour the traffic overlay.', pageId: 'traffic-api-intro',       productId: 'traffic-api' },
  { name: 'Map Display API',         type: 'REST API',  description: 'Flow tile endpoint served as a map tile layer overlay alongside the base vector tiles.',                      pageId: 'map-display-api-intro',   productId: 'map-display-api' },
  { name: 'Map Display for SwiftUI', type: 'iOS SDK',   description: 'SwiftUI map where traffic layers are toggled via map.trafficDisplay.',                                        pageId: 'navsdk-ios-map-swiftui',  productId: 'navsdk-ios' },
];

const IOS_INCIDENT_CATEGORIES = [
  { id: 'accident',  label: 'Accident',  icon: '⚠️', desc: 'Collision or vehicle incident causing delays.' },
  { id: 'roadWorks', label: 'Road Works', icon: '🚧', desc: 'Planned or unplanned roadworks and lane restrictions.' },
  { id: 'closure',   label: 'Closure',   icon: '🚫', desc: 'Full or partial road closure — typically long duration.' },
  { id: 'hazard',    label: 'Hazard',    icon: '⚡', desc: 'Obstacles, debris, or other hazards on the roadway.' },
  { id: 'weather',   label: 'Weather',   icon: '🌧', desc: 'Weather-related conditions affecting road safety or speed.' },
];

export function NavSDKiOSMapTraffic({ onNavigate }) {
  const [showFlow, setShowFlow] = useState(true);
  const [showIncidents, setShowIncidents] = useState(false);
  const [flowStyle, setFlowStyle] = useState('relativeDelay');
  const [activeIncidents, setActiveIncidents] = useState(new Set(['accident', 'roadWorks', 'closure', 'hazard', 'weather']));

  const toggleIncident = (type) => {
    setActiveIncidents(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Overlay real-time traffic flow and incident data on the map using <code>map.trafficDisplay</code>. Traffic tiles update automatically and can be toggled independently from the base map style.
      </p>

      <ApiLinks items={IOS_TRAFFIC_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-demo">Interactive demo</h2>
        <p className="body">Toggle traffic flow and incidents independently. Switch flow style to change how traffic speed is visualised.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <Toggle value={showFlow} onChange={setShowFlow} label="Traffic flow" secondary="Coloured road segments" />
          <Toggle value={showIncidents} onChange={setShowIncidents} label="Incidents" secondary="Accident & delay markers" />
        </div>

        {showFlow && (
          <div style={{ marginBottom: 12 }}>
            <SectionLabel>Flow style</SectionLabel>
            <RadioGroup options={IOS_FLOW_STYLES} value={flowStyle} onChange={setFlowStyle} />
          </div>
        )}

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <MapBg style="day" showTrafficFlow={showFlow} showTrafficIncidents={showIncidents} />
          {showFlow && (
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, flexDirection: 'column', background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '8px 10px' }}>
              {[['#22c55e', 'Free'], ['#f59e0b', 'Slow'], ['#ef4444', 'Jammed']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 4, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Swift']}>
            <pre>
              {showFlow || showIncidents ? (
                <>
                  <span className="hl-c">{'// Show traffic flow layer\n'}</span>
                  {'map.trafficDisplay.'}<span className="hl-f">show</span>{'('}<span className="hl-t">TrafficDisplayOptions</span>{'(\n'}
                  {showFlow && (
                    <>
                      {'    flow: .'}<span className="hl-f">init</span>{'(style: .'}<span className="hl-n">{flowStyle}</span>{'),\n'}
                    </>
                  )}
                  {showIncidents && (
                    <>
                      {'    incidents: .'}<span className="hl-f">init</span>{'(categories: [.'}<span className="hl-n">accident</span>{', .'}<span className="hl-n">roadWorks</span>{', .'}<span className="hl-n">closure</span>{'])\n'}
                    </>
                  )}
                  {'))\n'}
                </>
              ) : (
                <>
                  <span className="hl-c">{'// Hide traffic\n'}</span>
                  {'map.trafficDisplay.'}<span className="hl-f">hide</span>{'()'}
                </>
              )}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* TrafficDisplayOptions reference */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-options">TrafficDisplayOptions reference</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['flow', 'FlowDisplayOptions?', 'Traffic flow overlay config. Set style to .relativeDelay, .relative, or .absolute.'],
              ['incidents', 'IncidentDisplayOptions?', 'Incident overlay config. Pass category array to filter shown incident types.'],
            ].map(([o, t, d]) => (
              <tr key={o}>
                <td><code>{o}</code></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--mid)' }}>{t}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incident category filter */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-incidents">Incident category filter</h2>
        <p className="body">Filter which incident categories are rendered on the map. Pass a category array to <code>IncidentDisplayOptions</code> — by default all categories are shown.</p>

        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Active categories</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {IOS_INCIDENT_CATEGORIES.map(({ id, label, icon }) => {
              const on = activeIncidents.has(id);
              return (
                <button key={id} onClick={() => toggleIncident(id)} style={{
                  padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
                  fontWeight: on ? 600 : 400,
                  background: on ? '#fff5f5' : 'var(--bg)',
                  border: `1px solid ${on ? 'var(--red)' : 'var(--border)'}`,
                  color: on ? 'var(--red)' : 'var(--mid)',
                  transition: 'all 0.1s',
                }}>{icon} {label}</button>
              );
            })}
          </div>
        </div>

        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-c">{'// Filter to selected incident categories\n'}</span>
            {'map.trafficDisplay.'}<span className="hl-f">show</span>{'('}<span className="hl-t">TrafficDisplayOptions</span>{'(\n'}
            {'    incidents: .'}<span className="hl-f">init</span>{'(categories: [\n'}
            {Array.from(activeIncidents).map((type, i, arr) => (
              <span key={type}>{'        .'}<span className="hl-n">{type}</span>{i < arr.length - 1 ? ',\n' : '\n'}</span>
            ))}
            {'    ])\n'}{'))'}
          </pre>
        </CodeBlock>

        <table className="prop-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Category</th><th>Description</th></tr></thead>
          <tbody>
            {IOS_INCIDENT_CATEGORIES.map(({ id, desc }) => (
              <tr key={id}>
                <td><code>.{id}</code></td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refresh intervals */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-refresh">Refresh intervals</h2>
        <p className="body">
          Override default refresh intervals via <code>TrafficConfiguration</code> when constructing <code>MapOptions</code>. Lower intervals keep traffic fresher but consume more bandwidth.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">let</span>{' trafficConfig = '}<span className="hl-t">TrafficConfiguration</span>{'(\n'}
            {'    flowRefreshInterval: '}<span className="hl-n">{'30'}</span>{','}<span className="hl-c">{'   // seconds — default 30 s\n'}</span>
            {'    incidentRefreshInterval: '}<span className="hl-n">{'60'}</span>{','}<span className="hl-c">{'   // seconds — default 60 s\n'}</span>
            {')\n\n'}
            <span className="hl-k">let</span>{' options = '}<span className="hl-t">MapOptions</span>{'(trafficConfiguration: trafficConfig)\n'}
            <span className="hl-t">TomTomMapView</span>{'(mapOptions: options)'}
          </pre>
        </CodeBlock>
        <table className="prop-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Interval</th><th>Default</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['30 s',  '✓ flow',      'Minimum recommended for live traffic flow accuracy.'],
              ['1 min', '✓ incidents', 'Default incident refresh — incidents change less frequently.'],
              ['2 min', '—',           'Suitable for background or battery-saving contexts.'],
              ['5 min', '—',           'Low-frequency refresh for pre-trip planning views.'],
            ].map(([i, d, n]) => (
              <tr key={i}>
                <td><code>{i}</code></td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{d}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom traffic provider */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-provider">Custom traffic provider</h2>
        <p className="body">
          Replace the default TomTom traffic data source with a custom provider — useful for OEM platforms with proprietary traffic feeds or for testing with simulated data.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">MyTrafficProvider</span>{': '}<span className="hl-t">TrafficDataProvider</span>{' {\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">flowTile</span>{'(z: '}<span className="hl-t">Int</span>{', x: '}<span className="hl-t">Int</span>{', y: '}<span className="hl-t">Int</span>{')\n'}
            {'        -> '}<span className="hl-t">AnyPublisher</span>{'<'}<span className="hl-t">TileData</span>{', '}<span className="hl-t">Error</span>{'> {\n'}
            {'        myTrafficFeed.'}<span className="hl-f">flowTile</span>{'(z: z, x: x, y: y)\n'}
            {'    }\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">incidents</span>{'(bbox: '}<span className="hl-t">BoundingBox</span>{')\n'}
            {'        -> '}<span className="hl-t">AnyPublisher</span>{'<['}<span className="hl-t">TrafficIncident</span>{'>, '}<span className="hl-t">Error</span>{'> {\n'}
            {'        myTrafficFeed.'}<span className="hl-f">incidents</span>{'(bbox: bbox)\n'}
            {'    }\n}\n\n'}
            <span className="hl-k">let</span>{' options = '}<span className="hl-t">MapOptions</span>{'(trafficDataProvider: '}<span className="hl-t">MyTrafficProvider</span>{'())'}
          </pre>
        </CodeBlock>
        <Callout type="info">
          When using a custom provider, ensure your tile format matches the SDK's expected MVT schema. Contact your TomTom integration engineer for the tile contract specification.
        </Callout>
      </div>

      {/* Real-time updates */}
      <div className="zone">
        <h2 className="sh" id="ios-tr-realtime">Real-time updates</h2>
        <p className="body">
          Traffic tiles are fetched and refreshed automatically by the SDK. No polling is required from application code.
        </p>
        <Callout type="info">
          Traffic data requires an active network connection. In offline mode, traffic overlays are automatically hidden. See the <strong>Offline</strong> section for map caching options.
        </Callout>
      </div>
    </div>
  );
}
