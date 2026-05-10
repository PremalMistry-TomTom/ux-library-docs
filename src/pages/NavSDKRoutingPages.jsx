import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared map mock shell ──────────────────────────────────────────────── */
function MapShell({ height = 280, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Base road grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="400" height="280" fill="#0d1117"/>
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="#1a2535" strokeWidth="10"/>
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="#243040" strokeWidth="2"/>
        <path d="M160 0 L155 280" stroke="#1a2535" strokeWidth="8"/>
        <path d="M160 0 L155 280" stroke="#243040" strokeWidth="1.5"/>
        <path d="M280 0 L272 280" stroke="#1a2535" strokeWidth="8"/>
        <path d="M280 0 L272 280" stroke="#243040" strokeWidth="1.5"/>
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. ROUTING QUICKSTART
   ═══════════════════════════════════════════════════════════════════════════ */

const KT_ROUTING_QS = `val routingApi = RoutingApi(apiKey = "YOUR_API_KEY")

val options = ItineraryPlanningOptions(
    itinerary = Itinerary(
        origin = ItineraryPoint(
            place = Place(GeoPoint(52.3676, 4.9041))   // Amsterdam
        ),
        destination = ItineraryPoint(
            place = Place(GeoPoint(52.5200, 13.4050))  // Berlin
        )
    ),
    routePlanningOptions = RoutePlanningOptions(
        travelMode = TravelMode.CAR,
        departAt = DepartAt.Now
    )
)

routingApi.planRoute(options) { result ->
    result.onSuccess { routes ->
        val route = routes.first()
        tomTomNavigation.setRoute(route)
    }
    result.onFailure { error ->
        Log.e("Routing", "Route planning failed: \${error.message}")
    }
}`;

const SW_ROUTING_QS = `let routingApi = TomTomSDKRouteReplanning.RoutingApi(apiKey: "YOUR_API_KEY")

let options = RoutePlanningOptions(
    itinerary: Itinerary(
        origin: ItineraryPoint(place: Place(
            coordinate: CLLocationCoordinate2D(latitude: 52.3676, longitude: 4.9041)
        )),
        destination: ItineraryPoint(place: Place(
            coordinate: CLLocationCoordinate2D(latitude: 52.5200, longitude: 13.4050)
        ))
    ),
    routePlanningOptions: RoutingOptions(
        travelMode: .car,
        departAt: .now
    )
)

routingApi.planRoute(options) { result in
    switch result {
    case .success(let routes):
        let route = routes.first!
        tomTomNavigation.setRoute(route)
    case .failure(let error):
        print("Route planning failed: \\(error)")
    }
}`;

export function RoutingQuickstartDemo() {
  const [state, setState] = useState('idle'); // idle | calculating | done

  function calculate() {
    setState('calculating');
    setTimeout(() => setState('done'), 1400);
  }
  function reset() { setState('idle'); }

  return (
    <MapShell height={270}>
      {/* Origin dot */}
      <div style={{ position: 'absolute', top: '62%', left: '14%', width: 10, height: 10, borderRadius: '50%', background: '#3fb950', border: '2px solid #fff', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: '56%', left: '10%', background: 'rgba(15,26,40,0.9)', borderRadius: 6, padding: '3px 8px', fontSize: '0.625rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>Amsterdam</div>

      {/* Destination dot */}
      <div style={{ position: 'absolute', top: '30%', left: '78%', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', border: '2px solid #fff', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: '24%', left: '74%', background: 'rgba(15,26,40,0.9)', borderRadius: 6, padding: '3px 8px', fontSize: '0.625rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>Berlin</div>

      {/* Route line — shown when done */}
      {state === 'done' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" fill="none">
          <path d="M56 174 Q120 150 200 140 T312 84" stroke="rgba(226,0,26,0.25)" strokeWidth="12" strokeLinecap="round"/>
          <path d="M56 174 Q120 150 200 140 T312 84" stroke="#e2001a" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 0"/>
        </svg>
      )}

      {/* Calculating animation */}
      {state === 'calculating' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" fill="none">
          <path d="M56 174 Q120 150 200 140 T312 84" stroke="rgba(226,0,26,0.15)" strokeWidth="12" strokeLinecap="round"/>
          <path d="M56 174 Q120 150 200 140 T312 84" stroke="#e2001a" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="20 10" style={{ animation: 'dash 1s linear infinite' }}/>
        </svg>
      )}

      {/* Route info pill */}
      {state === 'done' && (
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,26,40,0.95)', borderRadius: 20, padding: '8px 20px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: 20, whiteSpace: 'nowrap' }}>
          {[['5h 52m', 'Travel time'], ['573 km', 'Distance'], ['14:44', 'Arrival']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
              <div style={{ fontSize: '0.625rem', color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        {state === 'idle' && (
          <button onClick={calculate} style={{ background: '#e2001a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
            Calculate Route
          </button>
        )}
        {state === 'calculating' && (
          <div style={{ background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}>
            Calculating…
          </div>
        )}
        {state === 'done' && (
          <button onClick={reset} style={{ background: 'rgba(15,26,40,0.9)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', cursor: 'pointer' }}>
            Reset
          </button>
        )}
      </div>

      <style>{`@keyframes dash { to { stroke-dashoffset: -30; } }`}</style>
    </MapShell>
  );
}

const ROUTING_QUICKSTART_APIS = [
  { name: 'Routing API',            type: 'REST API',    description: 'Calculate Route REST endpoint — the HTTP call this SDK quickstart abstracts into a typed Kotlin/Swift API.',   pageId: 'routing-api-intro',          productId: 'routing-api' },
  { name: 'Calculate Route',        type: 'REST API',    description: 'Full request/response reference for the route planning call made by RoutingApi under the hood.',               pageId: 'routing-calculate-route',    productId: 'routing-api' },
  { name: 'Route Planning',         type: 'Android SDK', description: 'Travel modes, avoidances, and timing options built on top of this RoutingApi initialisation.',                 pageId: 'navsdk-route-planning',      productId: 'navsdk' },
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'Turn-by-turn navigation that consumes the Route object returned by RoutingApi.',                               pageId: 'navsdk-nav-quickstart',      productId: 'navsdk' },
];

export function NavSDKRoutingQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing Quickstart</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Set up <code>RoutingApi</code>, build an <code>ItineraryPlanningOptions</code> object with origin and
        destination, and request your first route in a few lines of code.
      </p>
      <ApiLinks items={ROUTING_QUICKSTART_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="rqs-overview">Overview</h2>
        <p className="body">
          The TomTom NavSDK Routing API wraps a single planning call that handles traffic data,
          alternative scoring, and manoeuvre generation. On Android the entry point is
          <code> RoutingApi</code>; on iOS it is <code>TomTomSDKRouteReplanning.RoutingApi</code>.
          Both share the same conceptual model: build an itinerary, pass options, handle the async result.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="rqs-demo">Interactive demo</h2>
        <p className="body">Tap <strong>Calculate Route</strong> to simulate an A→B route calculation.</p>
        <RoutingQuickstartDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rqs-setup">RoutingApi setup</h2>
        <p className="body">
          Instantiate <code>RoutingApi</code> once (e.g. in your ViewModel or Application class) with your
          TomTom API key. The same instance handles all route requests for the session.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`val routingApi = RoutingApi(apiKey = "YOUR_API_KEY")`}
          {`let routingApi = TomTomSDKRouteReplanning.RoutingApi(apiKey: "YOUR_API_KEY")`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rqs-options">ItineraryPlanningOptions</h2>
        <p className="body">
          The options object carries origin, destination, optional waypoints, travel mode, departure
          time, and avoidance preferences. Only origin and destination are required for a basic route.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_ROUTING_QS}
          {SW_ROUTING_QS}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rqs-params">Key parameters</h2>
        <table className="prop-table">
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['origin', 'ItineraryPoint', 'Starting coordinate wrapped in a Place'],
              ['destination', 'ItineraryPoint', 'Ending coordinate wrapped in a Place'],
              ['travelMode', 'TravelMode', 'CAR, TRUCK, BICYCLE, PEDESTRIAN, TAXI'],
              ['departAt', 'DepartAt', 'Now or a specific DateTime for traffic prediction'],
              ['maxAlternatives', 'Int', 'Number of alternative routes to return (0–3)'],
            ].map(([p, t, d]) => (
              <tr key={p}><td style={{ fontWeight: 600 }}>{p}</td><td><code>{t}</code></td><td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. ROUTE PLANNING
   ═══════════════════════════════════════════════════════════════════════════ */

const TRAVEL_MODES = [
  { id: 'CAR',        label: 'Car',        icon: '🚗', time: '5h 52m', dist: '573 km' },
  { id: 'TRUCK',      label: 'Truck',      icon: '🚛', time: '7h 15m', dist: '590 km' },
  { id: 'BICYCLE',    label: 'Bicycle',    icon: '🚲', time: '28h 00m', dist: '498 km' },
  { id: 'PEDESTRIAN', label: 'Pedestrian', icon: '🚶', time: '4d 10h', dist: '490 km' },
];

const AVOIDS = [
  { id: 'motorways',   label: 'Motorways' },
  { id: 'ferries',     label: 'Ferries' },
  { id: 'tollRoads',   label: 'Toll roads' },
  { id: 'unpavedRoads',label: 'Unpaved roads' },
];

const KT_PLAN_ROUTE = (mode, avoids) => `val options = ItineraryPlanningOptions(
    itinerary = Itinerary(origin = ..., destination = ...),
    routePlanningOptions = RoutePlanningOptions(
        travelMode = TravelMode.${mode},
        avoidOptions = AvoidOptions(
            avoidTypes = listOf(${avoids.map(a => `AvoidType.${a.toUpperCase()}`).join(', ')})
        ),
        departAt = DepartAt.Now,
        considerTraffic = true
    )
)`;

const SW_PLAN_ROUTE = (mode, avoids) => `let options = RoutePlanningOptions(
    itinerary: Itinerary(origin: ..., destination: ...),
    routingOptions: RoutingOptions(
        travelMode: .${mode.toLowerCase()},
        avoidOptions: AvoidOptions(
            avoidTypes: [${avoids.map(a => `.${a}`).join(', ')}]
        ),
        departAt: .now,
        considerTraffic: true
    )
)`;

export function RoutePlanningDemo() {
  const [mode, setMode] = useState('CAR');
  const [avoids, setAvoids] = useState([]);
  const current = TRAVEL_MODES.find(m => m.id === mode);

  const toggleAvoid = id => setAvoids(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  return (
    <div>
      {/* Vehicle picker */}
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

      {/* Avoidance toggles */}
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

      {/* Map mock */}
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

      <div style={{ marginTop: 14 }}>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_PLAN_ROUTE(mode, avoids)}
          {SW_PLAN_ROUTE(mode, avoids)}
        </CodeBlock>
      </div>
    </div>
  );
}

const ROUTE_PLANNING_APIS = [
  { name: 'Calculate Route (v1)',   type: 'REST API',    description: 'Route planning REST endpoint — travel mode, avoidances, departure time parameters the SDK maps to.',          pageId: 'routing-calculate-route',   productId: 'routing-api' },
  { name: 'Calculate Route (v3)',   type: 'REST API',    description: 'Latest routing REST endpoint with improved EV consumption model and weather consideration support.',           pageId: 'routing-v3-calculate-route',productId: 'routing-api' },
  { name: 'Reachable Range',        type: 'REST API',    description: 'Calculates how far a vehicle can reach on a given fuel/charge budget — used in EV range display.',            pageId: 'routing-reachable-range',   productId: 'routing-api' },
  { name: 'Routing Quickstart',     type: 'Android SDK', description: 'RoutingApi SDK setup required before RoutePlanningOptions take effect.',                                       pageId: 'navsdk-routing-quickstart', productId: 'navsdk' },
  { name: 'Alternative Routes',     type: 'Android SDK', description: 'Request multiple scored alternatives alongside the primary planned route.',                                     pageId: 'navsdk-route-alternatives', productId: 'navsdk' },
];

export function NavSDKRoutePlanning({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Planning a Route</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure travel mode, avoidance options, traffic consideration, and departure or
        arrival time to plan routes tailored to any vehicle type or journey constraint.
      </p>
      <ApiLinks items={ROUTE_PLANNING_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="rp-demo">Interactive demo</h2>
        <p className="body">Switch vehicle type and toggle avoidance options to see how the route and code change.</p>
        <RoutePlanningDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-travelmode">Travel modes</h2>
        <p className="body">
          <code>TravelMode</code> controls road eligibility, speed profiles, and vehicle-specific
          restrictions applied during route calculation.
        </p>
        <table className="prop-table">
          <thead><tr><th>Mode</th><th>Android</th><th>iOS</th></tr></thead>
          <tbody>
            {[
              ['Car',        'TravelMode.CAR',        '.car'],
              ['Truck',      'TravelMode.TRUCK',      '.truck'],
              ['Bicycle',    'TravelMode.BICYCLE',    '.bicycle'],
              ['Pedestrian', 'TravelMode.PEDESTRIAN', '.pedestrian'],
              ['Taxi',       'TravelMode.TAXI',       '.taxi'],
            ].map(([m, a, i]) => (
              <tr key={m}><td style={{ fontWeight: 600 }}>{m}</td><td><code>{a}</code></td><td><code>{i}</code></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-avoids">Avoidance options</h2>
        <p className="body">
          <code>AvoidOptions</code> accepts a list of <code>AvoidType</code> values that exclude
          specific road categories from the calculated route geometry.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`val avoidOptions = AvoidOptions(
    avoidTypes = listOf(
        AvoidType.MOTORWAYS,
        AvoidType.TOLL_ROADS,
        AvoidType.FERRIES,
        AvoidType.UNPAVED_ROADS
    )
)`}
          {`let avoidOptions = AvoidOptions(
    avoidTypes: [.motorways, .tollRoads, .ferries, .unpavedRoads]
)`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-timing">Departure and arrival time</h2>
        <p className="body">
          Pass a future departure time to apply predictive traffic data, or use <code>ArriveBy</code>
          to back-calculate a departure time that meets a required arrival window.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`// Depart at a specific time
val options = RoutePlanningOptions(
    departAt = DepartAt.At(ZonedDateTime.now().plusHours(2))
)

// Arrive by a specific time
val options = RoutePlanningOptions(
    arriveAt = ArriveAt.At(ZonedDateTime.now().plusHours(3))
)`}
          {`// Depart at a specific time
let options = RoutingOptions(
    departAt: .at(Date().addingTimeInterval(7200))
)

// Arrive by a specific time
let options = RoutingOptions(
    arriveAt: .at(Date().addingTimeInterval(10800))
)`}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ROUTE ALTERNATIVES
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

export function RouteAlternativesDemo() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <MapShell height={260}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" fill="none">
          {ALT_ROUTES.map((r, i) => (
            <g key={r.id}>
              <path d={ROUTE_PATHS[i]} stroke={r.color} strokeWidth={selected === i ? 4 : 2.5}
                strokeLinecap="round" strokeDasharray={r.dash}
                opacity={selected === i ? 1 : 0.45}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.15s, opacity 0.15s' }}
                onClick={() => setSelected(i)}
              />
            </g>
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
              <div style={{ width: 16, height: 3, borderRadius: 2, background: r.color,
                backgroundImage: r.dash ? `repeating-linear-gradient(90deg, ${r.color} 0, ${r.color} 8px, transparent 8px, transparent 12px)` : 'none' }}/>
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

const KT_ALTERNATIVES = `val options = ItineraryPlanningOptions(
    itinerary = Itinerary(origin = ..., destination = ...),
    routePlanningOptions = RoutePlanningOptions(
        maxAlternatives = 2,           // returns up to 3 routes (main + 2 alternatives)
        travelMode = TravelMode.CAR,
        considerTraffic = true
    )
)

routingApi.planRoute(options) { result ->
    result.onSuccess { routes ->
        routes.forEachIndexed { index, route ->
            val summary = route.summary
            Log.d("Route \$index",
                "Time: \${summary.travelTime}, Dist: \${summary.lengthInMeters}m"
            )
        }
    }
}`;

const SW_ALTERNATIVES = `let options = RoutePlanningOptions(
    itinerary: Itinerary(origin: ..., destination: ...),
    routingOptions: RoutingOptions(
        maxAlternatives: 2,
        travelMode: .car,
        considerTraffic: true
    )
)

routingApi.planRoute(options) { result in
    switch result {
    case .success(let routes):
        routes.enumerated().forEach { (index, route) in
            let summary = route.summary
            print("Route \\(index): \\(summary.travelTime)s, \\(summary.lengthInMeters)m")
        }
    case .failure: break
    }
}`;

const ROUTE_ALTERNATIVES_APIS = [
  { name: 'Calculate Route',        type: 'REST API',    description: 'maxAlternatives parameter on the Calculate Route endpoint — the REST call the SDK wraps to return alternatives.',pageId: 'routing-calculate-route',  productId: 'routing-api' },
  { name: 'Calculate Route (v3)',   type: 'REST API',    description: 'v3 endpoint also supports alternatives with improved scoring for eco and fastest options.',                     pageId: 'routing-v3-calculate-route',productId: 'routing-api' },
  { name: 'Route Planning',         type: 'Android SDK', description: 'RoutePlanningOptions where maxAlternatives is configured alongside travel mode and avoidances.',               pageId: 'navsdk-route-planning',     productId: 'navsdk' },
  { name: 'Navigation Replanning',  type: 'Android SDK', description: 'Automatic rerouting that selects among alternatives when the driver deviates.',                                pageId: 'navsdk-nav-replanning',     productId: 'navsdk' },
];

export function NavSDKRouteAlternatives({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Alternative Routes</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Request up to three route alternatives in a single API call. Each alternative is
        independently scored by travel time, distance, and eco-efficiency.
      </p>
      <ApiLinks items={ROUTE_ALTERNATIVES_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="ra-demo">Interactive demo</h2>
        <p className="body">Click a route line or card to select it and compare alternatives.</p>
        <RouteAlternativesDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ra-code">Code</h2>
        <p className="body">
          Set <code>maxAlternatives</code> on <code>RoutePlanningOptions</code>. The SDK returns
          the main route plus up to that many alternatives in a single response array.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_ALTERNATIVES}
          {SW_ALTERNATIVES}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ra-scoring">Scoring criteria</h2>
        <table className="prop-table">
          <thead><tr><th>Criterion</th><th>Field</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Travel time',    'summary.travelTime',        'Seconds, traffic-adjusted'],
              ['Distance',       'summary.lengthInMeters',    'Total route length in metres'],
              ['Eco-efficiency', 'summary.fuelConsumption',   'Estimated fuel/kWh consumption'],
              ['Toll cost',      'summary.historicTrafficTravelTime', 'Available with toll data enabled'],
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
   4. ROUTE SECTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTION_TYPES = [
  { id: 'TRAFFIC',      label: 'Traffic delay', color: '#ef4444', x1: 50, x2: 120, y1: 180, y2: 160 },
  { id: 'TOLL',         label: 'Toll road',     color: '#f59e0b', x1: 120, x2: 200, y1: 160, y2: 140 },
  { id: 'MOTORWAY',     label: 'Motorway',      color: '#3b82f6', x1: 200, x2: 280, y1: 140, y2: 110 },
  { id: 'TUNNEL',       label: 'Tunnel',        color: '#8b5cf6', x1: 280, x2: 330, y1: 110, y2: 90 },
  { id: 'COUNTRY_CHANGE', label: 'Border crossing', color: '#10b981', x1: 330, x2: 360, y1: 90, y2: 80 },
];

export function RouteSectionsDemo() {
  const [active, setActive] = useState(null);
  const current = active !== null ? SECTION_TYPES[active] : null;

  return (
    <div>
      <MapShell height={240}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" fill="none">
          {/* Base route glow */}
          <path d="M50 180 Q130 150 200 140 T360 80" stroke="rgba(255,255,255,0.04)" strokeWidth="16" strokeLinecap="round"/>
          {/* Colored sections */}
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

        {/* Info bubble */}
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

      {/* Legend */}
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

const KT_SECTIONS = `routingApi.planRoute(options) { result ->
    result.onSuccess { routes ->
        val route = routes.first()

        // Access all typed sections
        route.sections.forEach { section ->
            when (section.sectionType) {
                SectionType.TRAFFIC -> {
                    val trafficDelay = section.delayInSeconds
                    Log.d("Section", "Traffic delay: \${trafficDelay}s")
                }
                SectionType.TOLL -> {
                    Log.d("Section", "Toll section: \${section.startPointIndex} → \${section.endPointIndex}")
                }
                SectionType.COUNTRY_CHANGE -> {
                    Log.d("Section", "Border crossing: \${section.countryCode}")
                }
                else -> { /* MOTORWAY, FERRY, TUNNEL, TRAVEL_MODE */ }
            }
        }
    }
}`;

const SW_SECTIONS = `routingApi.planRoute(options) { result in
    switch result {
    case .success(let routes):
        let route = routes.first!

        // Access all typed sections
        route.sections.forEach { section in
            switch section.sectionType {
            case .traffic:
                let delay = section.delayInSeconds
                print("Traffic delay: \\(delay)s")
            case .toll:
                print("Toll: \\(section.startPointIndex) → \\(section.endPointIndex)")
            case .countryChange:
                print("Border crossing: \\(section.countryCode ?? "")")
            default:
                break
            }
        }
    case .failure: break
    }
}`;

const ROUTE_SECTIONS_APIS = [
  { name: 'Routing Instructions',   type: 'REST API',    description: 'Guidance instructions endpoint — turn types, exit numbers, street names per section.',                         pageId: 'routing-instructions',      productId: 'routing-api' },
  { name: 'Guidance (v3)',          type: 'REST API',    description: 'v3 guidance REST endpoint with structured manoeuvre, lane, and road shield data per section.',                  pageId: 'routing-v3-guidance',       productId: 'routing-api' },
  { name: 'Lane Guidance',          type: 'REST API',    description: 'Lane-level section data — which lanes to take at a junction — delivered as section attributes.',                pageId: 'routing-lane-guidance',     productId: 'routing-api' },
  { name: 'Turn-by-Turn Navigation',type: 'Android SDK', description: 'Navigation engine that uses section data for restriction warnings and toll notifications.',                     pageId: 'navsdk-nav-turn-by-turn',   productId: 'navsdk' },
];

export function NavSDKRouteSections({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Route Sections</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Break a route into typed segments — traffic delays, toll roads, motorways, tunnels, ferries,
        and border crossings — for detailed cost breakdowns and restriction warnings.
      </p>
      <ApiLinks items={ROUTE_SECTIONS_APIS} onNavigate={onNavigate} />

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
              ['TRAFFIC',       'Congestion or incident delay',          'delayInSeconds, magnitudeOfDelay'],
              ['TOLL',          'Road with toll charges',                'startPointIndex, endPointIndex'],
              ['MOTORWAY',      'Motorway/freeway segment',              'startPointIndex, endPointIndex'],
              ['FERRY',         'Ferry crossing',                        'startPointIndex, endPointIndex'],
              ['TUNNEL',        'Tunnel segment',                        'startPointIndex, endPointIndex'],
              ['COUNTRY_CHANGE','Border crossing between countries',      'countryCode'],
              ['TRAVEL_MODE',   'Mode change (e.g. walk to car park)',   'travelMode'],
            ].map(([t, d, f]) => (
              <tr key={t}><td><code style={{ fontSize: '0.75rem' }}>{t}</code></td><td style={{ fontSize: '0.875rem' }}>{d}</td><td><code style={{ fontSize: '0.75rem' }}>{f}</code></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="rs-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_SECTIONS}
          {SW_SECTIONS}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rs-use-cases">Use cases</h2>
        <p className="body">Common patterns for consuming section data:</p>
        <ul style={{ paddingLeft: 20, color: 'var(--mid)', fontSize: '0.875rem', lineHeight: 2 }}>
          <li>Summing all <code>TOLL</code> sections to estimate total toll cost before the journey</li>
          <li>Highlighting traffic-delay segments on a map with severity-based colours</li>
          <li>Showing a border-crossing warning notification ahead of <code>COUNTRY_CHANGE</code></li>
          <li>Displaying ferry-boarding time estimates from <code>FERRY</code> section duration</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. ROUTE IMPORT / EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

const KT_EXPORT = `// Export to JSON
val routeJson: String = RouteSerializer.toJson(route)
// Persist to storage, send to backend, etc.
saveToPrefs("last_route", routeJson)

// Export to GeoJSON
val geoJson: String = RouteSerializer.toGeoJson(route)

// Import from JSON
val restoredRoute: Route = RouteSerializer.fromJson(routeJson)
tomTomNavigation.setRoute(restoredRoute)`;

const SW_EXPORT = `// Export to JSON
let routeData = try RouteSerializer.toJSON(route)
UserDefaults.standard.set(routeData, forKey: "last_route")

// Import from JSON
if let data = UserDefaults.standard.data(forKey: "last_route") {
    let restoredRoute = try RouteSerializer.fromJSON(data)
    tomTomNavigation.setRoute(restoredRoute)
}`;

const KT_GPX = `// Import GPX track
val gpxString = assets.open("track.gpx").bufferedReader().readText()
val gpxRoute: Route = GpxImporter.import(gpxString)
tomTomNavigation.setRoute(gpxRoute)`;

const SW_GPX = `// iOS: GPX import has limited support.
// Use the JSON export/import path for reliable round-trips.
// Direct GPX import may not preserve all NavSDK routing metadata.`;

const KT_WAYPOINTS = `// Add a waypoint to an existing route
val updatedOptions = options.copy(
    itinerary = options.itinerary.copy(
        waypoints = listOf(
            ItineraryPoint(place = Place(GeoPoint(51.9225, 4.4792))) // Rotterdam
        )
    )
)
routingApi.planRoute(updatedOptions) { /* handle */ }`;

const SW_WAYPOINTS = `// Add a waypoint
var updatedItinerary = options.itinerary
updatedItinerary.waypoints = [
    ItineraryPoint(place: Place(coordinate: CLLocationCoordinate2D(
        latitude: 51.9225, longitude: 4.4792  // Rotterdam
    )))
]
let updatedOptions = RoutePlanningOptions(
    itinerary: updatedItinerary,
    routingOptions: options.routingOptions
)
routingApi.planRoute(updatedOptions) { /* handle */ }`;

export function ImportExportDemo() {
  const [tab, setTab] = useState('export'); // export | import | waypoints
  const [waypointAdded, setWaypointAdded] = useState(false);

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['export', 'Export Route'], ['import', 'Import GPX'], ['waypoints', 'Add Waypoint']].map(([t, l]) => (
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
          {/* Main route */}
          <path d="M50 170 Q130 145 200 130 T360 70" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M50 170 Q130 145 200 130 T360 70" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Waypoint detour */}
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
            <div style={{ color: '#64748b', marginBottom: 3 }}>track.gpx</div>
            <div style={{ color: '#f59e0b' }}>{`<trk><trkseg>...</trkseg></trk>`}</div>
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

const ROUTE_IMPORT_EXPORT_APIS = [
  { name: 'Calculate Route',        type: 'REST API',    description: 'Route response JSON schema that the SDK serialises — the same structure is used for export/import.',           pageId: 'routing-calculate-route',   productId: 'routing-api' },
  { name: 'Route Planning',         type: 'Android SDK', description: 'Route object that is serialised — waypoints and options are preserved in the exported format.',                pageId: 'navsdk-route-planning',     productId: 'navsdk' },
  { name: 'Alternative Routes',     type: 'Android SDK', description: 'Alternatives are also serialisable — useful for persisting route comparison sessions.',                         pageId: 'navsdk-route-alternatives', productId: 'navsdk' },
];

export function NavSDKRouteImportExport({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Import, Export &amp; Modify</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Serialise routes to JSON or GeoJSON for persistence and sharing, import GPX tracks, and
        modify active routes by inserting or removing waypoints on the fly.
      </p>
      <ApiLinks items={ROUTE_IMPORT_EXPORT_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="ie-demo">Interactive demo</h2>
        <ImportExportDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ie-export">Export and import</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_EXPORT}
          {SW_EXPORT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ie-gpx">GPX import</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_GPX}
          {SW_GPX}
        </CodeBlock>
        <Callout type="warn">
          iOS has <strong>limited GPX import support</strong>. Not all NavSDK routing metadata
          (manoeuvre data, sections, ETA) is preserved when importing a raw GPX track.
          Use the JSON round-trip path for full fidelity on iOS.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="ie-waypoints">Modifying waypoints</h2>
        <p className="body">
          To add or remove waypoints, update the <code>Itinerary</code> waypoints list and re-call
          <code> planRoute</code>. The SDK does not support in-place mutation of a planned route object.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_WAYPOINTS}
          {SW_WAYPOINTS}
        </CodeBlock>
      </div>
    </div>
  );
}
