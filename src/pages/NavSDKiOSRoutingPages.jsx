import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Shared map shell ───────────────────────────────────────────────────── */
function MapShell({ height = 280, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="400" height="280" fill="#0d1117"/>
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.09)" strokeWidth="2"/>
        <path d="M160 0 L155 280" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
        <path d="M160 0 L155 280" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
        <path d="M280 0 L272 280" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
        <path d="M280 0 L272 280" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. ROUTE PLANNING
   ═══════════════════════════════════════════════════════════════════════════ */

const TRAVEL_MODES = [
  { id: 'car',        label: 'Car',        icon: '🚗', time: '5h 52m', dist: '573 km' },
  { id: 'truck',      label: 'Truck',      icon: '🚛', time: '7h 15m', dist: '590 km' },
  { id: 'bicycle',    label: 'Bicycle',    icon: '🚲', time: '28h 00m', dist: '498 km' },
  { id: 'pedestrian', label: 'Pedestrian', icon: '🚶', time: '4d 10h', dist: '490 km' },
];

const AVOIDS = [
  { id: 'motorways',    label: 'Motorways' },
  { id: 'ferries',      label: 'Ferries' },
  { id: 'tollRoads',    label: 'Toll roads' },
  { id: 'unpavedRoads', label: 'Unpaved roads' },
];

function RoutePlanningDemo() {
  const [mode, setMode] = useState('car');
  const [avoids, setAvoids] = useState([]);
  const current = TRAVEL_MODES.find(m => m.id === mode);

  const toggleAvoid = id => setAvoids(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
        {TRAVEL_MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '8px 4px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
            background: mode === m.id ? '#fff5f5' : 'var(--bg)',
            border: `1.5px solid ${mode === m.id ? '#e2001a' : 'var(--border)'}`,
            color: mode === m.id ? '#e2001a' : 'var(--mid)',
            fontSize: '0.75rem', fontWeight: mode === m.id ? 700 : 400,
          }}>
            <div style={{ fontSize: '1.25rem', marginBottom: 2 }}>{m.icon}</div>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 16 }}>
        {AVOIDS.map(a => {
          const on = avoids.includes(a.id);
          return (
            <div key={a.id} onClick={() => toggleAvoid(a.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
              borderRadius: 8, cursor: 'pointer',
              background: on ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${on ? '#e2001a' : 'var(--border)'}`,
            }}>
              <div style={{ width: 28, height: 16, borderRadius: 8, background: on ? '#e2001a' : 'var(--border)', position: 'relative', flexShrink: 0, transition: 'background 0.15s' }}>
                <div style={{ position: 'absolute', top: 2, left: on ? 12 : 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }}/>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Avoid {a.label}</span>
            </div>
          );
        })}
      </div>

      <MapShell height={230}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 230" fill="none">
          <path d="M50 165 Q120 130 200 115 T360 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M50 165 Q120 130 200 115 T360 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
          {avoids.includes('motorways') && (
            <path d="M50 165 Q100 175 160 170 Q220 165 260 155 T360 75" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.7"/>
          )}
        </svg>
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(15,26,40,0.9)', borderRadius: 10, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{current.icon} {current.label}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{current.time} · {current.dist}</div>
        </div>
        <div style={{ position: 'absolute', top: '72%', left: '12%', width: 8, height: 8, borderRadius: '50%', background: '#3fb950', border: '2px solid #fff' }}/>
        <div style={{ position: 'absolute', top: '32%', left: '88%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', border: '2px solid #fff' }}/>
      </MapShell>
    </div>
  );
}

const SW_ROUTE_PLANNING = `import TomTomSDKRouting

let routeCalculator = OnlineRouteCalculator()
let itinerary = Itinerary(
    origin: Waypoint(coordinate: CLLocationCoordinate2D(
        latitude: 52.3766, longitude: 4.9041)),      // Amsterdam
    destination: Waypoint(coordinate: CLLocationCoordinate2D(
        latitude: 52.3546, longitude: 4.8303))       // Schiphol
)
let options = RoutePlanningOptions(
    routeType: .fastest,
    travelMode: .car,
    traffic: true,
    avoidOptions: AvoidOptions(avoidTypes: [.tollRoads])
)

routeCalculator.calculateRoutes(itinerary: itinerary,
                                options: options) { result in
    switch result {
    case .success(let routes):
        self.displayRoutes(routes)
    case .failure(let error):
        print("Route error: \\(error)")
    }
}`;

export function NavSDKiOSRoutePlanning({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Planning a Route</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Use <code>OnlineRouteCalculator</code> with an <code>Itinerary</code> and
        <code> RoutePlanningOptions</code> to calculate a route tailored to any travel mode,
        avoidance preference, or departure time.
      </p>

      <div className="zone">
        <h2 className="sh" id="rp-demo">Interactive demo</h2>
        <p className="body">Switch vehicle type and toggle avoidance options to see how the route changes.</p>
        <RoutePlanningDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_ROUTE_PLANNING}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-travelmode">Travel modes</h2>
        <table className="prop-table">
          <thead><tr><th>Mode</th><th>Swift enum</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Car',        '.car',        'Default; private passenger vehicle'],
              ['Truck',      '.truck',      'Applies truck restrictions and dimensions'],
              ['Bicycle',    '.bicycle',    'Uses dedicated cycle paths where available'],
              ['Pedestrian', '.pedestrian', 'Walkable paths, avoids motorways'],
              ['Taxi',       '.taxi',       'Permit taxi-only lanes'],
            ].map(([m, e, n]) => (
              <tr key={m}><td style={{ fontWeight: 600 }}>{m}</td><td><code>{e}</code></td><td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{n}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-timing">Departure and arrival time</h2>
        <CodeBlock tabs={['Swift']}>
          {`// Depart at a future time
let options = RoutePlanningOptions(
    departAt: Date().addingTimeInterval(7200),  // 2 h from now
    travelMode: .car,
    traffic: true
)

// Arrive by a specific time
let options = RoutePlanningOptions(
    arriveAt: Date().addingTimeInterval(10800),
    travelMode: .car
)`}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. ROUTE ALTERNATIVES
   ═══════════════════════════════════════════════════════════════════════════ */

const ALT_ROUTES = [
  { id: 0, label: 'Fastest',     color: '#e2001a', time: '5h 52m', dist: '573 km', tag: 'Recommended', dash: '' },
  { id: 1, label: 'Eco',         color: '#3b82f6', time: '6h 10m', dist: '558 km', tag: '–12% fuel',   dash: '8 4' },
  { id: 2, label: 'Avoid Tolls', color: '#8b949e', time: '6h 38m', dist: '601 km', tag: 'No tolls',    dash: '4 6' },
];

const ROUTE_PATHS = [
  'M50 180 Q130 145 200 130 T360 80',
  'M50 180 Q110 160 175 155 Q240 150 310 110 T360 80',
  'M50 180 Q80 195 140 190 Q210 185 270 160 T360 80',
];

function RouteAlternativesDemo() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <MapShell height={260}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" fill="none">
          {ALT_ROUTES.map((r, i) => (
            <path key={r.id} d={ROUTE_PATHS[i]} stroke={r.color} strokeWidth={selected === i ? 4 : 2.5}
              strokeLinecap="round" strokeDasharray={r.dash}
              opacity={selected === i ? 1 : 0.45}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.15s, opacity 0.15s' }}
              onClick={() => setSelected(i)}
            />
          ))}
          <circle cx="50" cy="180" r="6" fill="#3fb950" stroke="#fff" strokeWidth="2"/>
          <circle cx="360" cy="80" r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"/>
        </svg>
      </MapShell>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
        {ALT_ROUTES.map(r => (
          <div key={r.id} onClick={() => setSelected(r.id)} style={{
            borderRadius: 10, padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s',
            background: selected === r.id ? '#fff5f5' : 'var(--bg)',
            border: `1.5px solid ${selected === r.id ? r.color : 'var(--border)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 16, height: 3, borderRadius: 2, background: r.color }}/>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{r.label}</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)' }}>{r.time}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{r.dist}</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, color: r.color, marginTop: 3 }}>{r.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SW_ALTERNATIVES = `let options = RoutePlanningOptions(
    routeType: .fastest,
    travelMode: .car,
    traffic: true,
    alternativeRoutes: AlternativeRouteOptions(maxAlternatives: 2)
)

routeCalculator.calculateRoutes(itinerary: itinerary,
                                options: options) { result in
    switch result {
    case .success(let routes):
        routes.enumerated().forEach { (index, route) in
            let summary = route.summary
            print("Route \\(index): \\(summary.travelTime)s, \\(summary.lengthInMeters)m")
        }
    case .failure(let error):
        print("Error: \\(error)")
    }
}`;

export function NavSDKiOSRouteAlternatives({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Alternative Routes</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Request up to three route alternatives in a single call by setting
        <code> AlternativeRouteOptions(maxAlternatives:)</code> on your planning options.
        Each alternative is independently scored for travel time, distance, and eco-efficiency.
      </p>

      <div className="zone">
        <h2 className="sh" id="ra-demo">Interactive demo</h2>
        <p className="body">Click a route line or card to select and compare alternatives.</p>
        <RouteAlternativesDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ra-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_ALTERNATIVES}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ra-scoring">Scoring criteria</h2>
        <table className="prop-table">
          <thead><tr><th>Criterion</th><th>Field</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Travel time',    'summary.travelTime',       'Seconds, traffic-adjusted'],
              ['Distance',       'summary.lengthInMeters',   'Total route length in metres'],
              ['Eco-efficiency', 'summary.fuelConsumption',  'Estimated fuel or kWh consumption'],
            ].map(([c, f, n]) => (
              <tr key={c}><td style={{ fontWeight: 600 }}>{c}</td><td><code>{f}</code></td><td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{n}</td></tr>
            ))}
          </tbody>
        </table>
        <Callout type="info">
          The first route in the response array is always the primary recommended route.
          Additional routes are ordered by travel time by default.
        </Callout>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ROUTE SECTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTION_TYPES = [
  { id: 'traffic',       label: 'Traffic delay',     color: '#ef4444', x1: 50, x2: 120, y1: 180, y2: 160 },
  { id: 'toll',          label: 'Toll road',          color: '#f59e0b', x1: 120, x2: 200, y1: 160, y2: 140 },
  { id: 'motorway',      label: 'Motorway',           color: '#3b82f6', x1: 200, x2: 280, y1: 140, y2: 110 },
  { id: 'tunnel',        label: 'Tunnel',             color: '#8b5cf6', x1: 280, x2: 330, y1: 110, y2: 90 },
  { id: 'countryChange', label: 'Border crossing',   color: '#10b981', x1: 330, x2: 360, y1: 90, y2: 80 },
];

function RouteSectionsDemo() {
  const [active, setActive] = useState(null);
  const current = active !== null ? SECTION_TYPES[active] : null;

  return (
    <div>
      <MapShell height={240}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" fill="none">
          <path d="M50 180 Q130 150 200 140 T360 80" stroke="rgba(255,255,255,0.04)" strokeWidth="16" strokeLinecap="round"/>
          {SECTION_TYPES.map((s, i) => (
            <line key={s.id}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={s.color} strokeWidth={active === i ? 7 : 4} strokeLinecap="round"
              opacity={active === null || active === i ? 1 : 0.35}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.15s, opacity 0.15s' }}
              onClick={() => setActive(active === i ? null : i)}
            />
          ))}
          <circle cx="50" cy="180" r="5" fill="#3fb950" stroke="#fff" strokeWidth="2"/>
          <circle cx="360" cy="80" r="5" fill="#e2001a" stroke="#fff" strokeWidth="2"/>
        </svg>

        {current && (
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(15,26,40,0.95)', borderRadius: 10, padding: '8px 16px',
            border: `1px solid ${current.color}60`, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: current.color, flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>{current.label}</div>
              <div style={{ fontSize: '0.625rem', color: '#64748b' }}>SectionType.{current.id}</div>
            </div>
          </div>
        )}
        {!current && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
            Tap a segment to inspect
          </div>
        )}
      </MapShell>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {SECTION_TYPES.map((s, i) => (
          <div key={s.id} onClick={() => setActive(active === i ? null : i)} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
            background: active === i ? `${s.color}18` : 'var(--bg)',
            border: `1px solid ${active === i ? s.color : 'var(--border)'}`,
            fontSize: '0.75rem', fontWeight: active === i ? 700 : 400,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}/>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const SW_SECTIONS = `routeCalculator.calculateRoutes(itinerary: itinerary,
                                options: options) { result in
    switch result {
    case .success(let routes):
        let route = routes.first!

        route.sections.forEach { section in
            switch section.sectionType {
            case .traffic:
                let delay = section.delayInSeconds
                print("Traffic delay: \\(delay)s")
            case .toll:
                print("Toll: \\(section.startPointIndex) → \\(section.endPointIndex)")
            case .countryChange:
                print("Border crossing: \\(section.countryCode ?? "")")
            case .motorway, .tunnel, .ferry, .travelMode:
                break
            }
        }
    case .failure(let error):
        print("Error: \\(error)")
    }
}`;

export function NavSDKiOSRouteSections({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Route Sections</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Access typed route segments — traffic delays, toll roads, motorways, tunnels, and border
        crossings — from the <code>sections</code> array on the calculated route.
      </p>

      <div className="zone">
        <h2 className="sh" id="rs-demo">Interactive demo</h2>
        <p className="body">Tap a coloured segment to inspect its section type.</p>
        <RouteSectionsDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rs-types">Section types</h2>
        <table className="prop-table">
          <thead><tr><th>SectionType</th><th>Description</th><th>Key fields</th></tr></thead>
          <tbody>
            {[
              ['.traffic',       'Congestion or incident delay',          'delayInSeconds, magnitudeOfDelay'],
              ['.toll',          'Road with toll charges',                 'startPointIndex, endPointIndex'],
              ['.motorway',      'Motorway/freeway segment',               'startPointIndex, endPointIndex'],
              ['.ferry',         'Ferry crossing',                         'startPointIndex, endPointIndex'],
              ['.tunnel',        'Tunnel segment',                         'startPointIndex, endPointIndex'],
              ['.countryChange', 'Border crossing between countries',      'countryCode'],
              ['.travelMode',    'Mode change (e.g. walk to car park)',    'travelMode'],
            ].map(([t, d, f]) => (
              <tr key={t}><td><code style={{ fontSize: '0.75rem' }}>{t}</code></td><td style={{ fontSize: '0.875rem' }}>{d}</td><td><code style={{ fontSize: '0.75rem' }}>{f}</code></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="rs-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_SECTIONS}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rs-use-cases">Use cases</h2>
        <ul style={{ paddingLeft: 20, color: 'var(--mid)', fontSize: '0.875rem', lineHeight: 2 }}>
          <li>Summing all <code>.toll</code> sections to estimate total toll cost before the journey</li>
          <li>Highlighting traffic-delay segments on a map with severity-based colours</li>
          <li>Showing a border-crossing warning notification ahead of <code>.countryChange</code></li>
          <li>Displaying ferry-boarding time estimates from <code>.ferry</code> section duration</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. ROUTE IMPORT / EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

function ImportExportDemo() {
  const [tab, setTab] = useState('export');
  const [waypointAdded, setWaypointAdded] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['export', 'Export Route'], ['import', 'Import Route'], ['waypoints', 'Add Waypoint']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem',
            fontWeight: tab === t ? 700 : 400,
            background: tab === t ? '#fff5f5' : 'var(--bg)',
            border: `1.5px solid ${tab === t ? '#e2001a' : 'var(--border)'}`,
            color: tab === t ? '#e2001a' : 'var(--mid)',
          }}>{l}</button>
        ))}
      </div>

      <MapShell height={220}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220" fill="none">
          <path d="M50 170 Q130 145 200 130 T360 70" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M50 170 Q130 145 200 130 T360 70" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
          {waypointAdded && tab === 'waypoints' && (
            <>
              <path d="M130 147 Q150 185 195 180 Q230 175 250 155" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" opacity="0.8"/>
              <circle cx="195" cy="180" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
              <text x="200" y="176" fill="#e2e8f0" fontSize="9" fontWeight="bold">Rotterdam</text>
            </>
          )}
        </svg>

        {tab === 'export' && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.625rem', color: '#e2e8f0', fontFamily: 'monospace', maxWidth: 180 }}>
            <div style={{ color: '#64748b', marginBottom: 3 }}>route.json</div>
            <div style={{ color: '#3fb950' }}>{`{ "version": "2", "legs": [...] }`}</div>
          </div>
        )}

        {tab === 'import' && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.625rem', color: '#e2e8f0', fontFamily: 'monospace', maxWidth: 180 }}>
            <div style={{ color: '#64748b', marginBottom: 3 }}>saved_route.json</div>
            <div style={{ color: '#f59e0b' }}>Restoring route…</div>
          </div>
        )}

        {tab === 'waypoints' && (
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <button onClick={() => setWaypointAdded(w => !w)} style={{
              background: waypointAdded ? 'rgba(59,130,246,0.15)' : '#e2001a',
              color: waypointAdded ? '#3b82f6' : '#fff',
              border: `1px solid ${waypointAdded ? '#3b82f6' : 'transparent'}`,
              borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
            }}>
              {waypointAdded ? 'Remove waypoint' : '+ Add Rotterdam'}
            </button>
          </div>
        )}
      </MapShell>
    </div>
  );
}

const SW_EXPORT = `// Export to JSON
let routeData = try RouteSerializer.toJSON(route)
UserDefaults.standard.set(routeData, forKey: "last_route")

// Export to GeoJSON
let geoJsonData = try RouteSerializer.toGeoJSON(route)

// Import from JSON
if let data = UserDefaults.standard.data(forKey: "last_route") {
    let restoredRoute = try RouteSerializer.fromJSON(data)
    navigationController.updateRoute(restoredRoute)
}`;

const SW_WAYPOINTS = `// Add a waypoint by rebuilding the Itinerary
var waypoints = currentItinerary.waypoints ?? []
waypoints.append(Waypoint(coordinate: CLLocationCoordinate2D(
    latitude: 51.9225, longitude: 4.4792  // Rotterdam
)))

let updatedItinerary = Itinerary(
    origin: currentItinerary.origin,
    destination: currentItinerary.destination,
    waypoints: waypoints
)

// Recalculate with the updated itinerary
routeCalculator.calculateRoutes(itinerary: updatedItinerary,
                                options: options) { result in
    // handle result
}`;

export function NavSDKiOSRouteImportExport({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Import, Export &amp; Modify</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Serialise routes to JSON for persistence and sharing, and modify active itineraries
        by inserting or removing waypoints before recalculating.
      </p>

      <div className="zone">
        <h2 className="sh" id="ie-demo">Interactive demo</h2>
        <ImportExportDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ie-export">Export and import</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_EXPORT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ie-waypoints">Modifying waypoints</h2>
        <p className="body">
          To add or remove waypoints, rebuild the <code>Itinerary</code> with the updated
          waypoints list and re-call <code>calculateRoutes</code>. The route object is immutable
          once calculated.
        </p>
        <CodeBlock tabs={['Swift']}>
          {SW_WAYPOINTS}
        </CodeBlock>
      </div>

      <Callout type="info">
        iOS does not support GPX import with full NavSDK metadata. Use the JSON round-trip
        (<code>RouteSerializer</code>) for reliable persistence of all route attributes.
      </Callout>
    </div>
  );
}
