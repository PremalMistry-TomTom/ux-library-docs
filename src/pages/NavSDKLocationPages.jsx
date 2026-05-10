import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared map background ─────────────────────────────────────────────────── */
function MapBg({ children, height = 280 }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={280} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[40, 80, 120, 160, 200, 240].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Road outlines */}
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.10)" strokeWidth="4" fill="none" />
        <path d="M160 0 Q170 80 180 140 Q190 200 200 280" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
        <path d="M160 0 Q170 80 180 140 Q190 200 200 280" stroke="rgba(255,255,255,0.09)" strokeWidth="3" fill="none" />
      </svg>
      {children}
    </div>
  );
}

/* ─── 1. NavSDKLocationQuickstart ────────────────────────────────────────────── */

function LocationPulsingDot() {
  const [tick, setTick] = useState(0);
  const [pos, setPos] = useState({ x: 200, y: 140 });
  const posRef = useRef({ x: 200, y: 140 });
  const pathRef = useRef([
    { x: 200, y: 140 }, { x: 220, y: 130 }, { x: 250, y: 125 },
    { x: 270, y: 135 }, { x: 290, y: 130 }, { x: 310, y: 128 },
  ]);
  const idxRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % pathRef.current.length;
      const next = pathRef.current[idxRef.current];
      posRef.current = next;
      setPos({ ...next });
      setTick(t => t + 1);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <MapBg>
      {/* Accuracy ring */}
      <div style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 52, height: 52,
        borderRadius: '50%',
        background: 'rgba(226,0,26,0.12)',
        border: '1px solid rgba(226,0,26,0.3)',
        transform: 'translate(-50%,-50%)',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Pulsing ring */}
      <div key={tick} style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 28, height: 28,
        borderRadius: '50%',
        border: '2px solid rgba(226,0,26,0.6)',
        transform: 'translate(-50%,-50%)',
        animation: 'locPulse 0.9s ease-out',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 12, height: 12,
        borderRadius: '50%',
        background: '#e2001a',
        border: '2px solid white',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 8px rgba(226,0,26,0.5)',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Coords badge */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'monospace',
        fontSize: '0.75rem', color: '#94a3b8',
      }}>
        <span style={{ color: '#e2001a' }}>lat</span> {(52.3676 + idxRef.current * 0.0002).toFixed(6)}
        {'  '}
        <span style={{ color: '#e2001a' }}>lon</span> {(4.9041 + idxRef.current * 0.0003).toFixed(6)}
      </div>
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '5px 10px',
        border: '1px solid rgba(255,255,255,0.12)',
        fontSize: '0.75rem', color: '#94a3b8',
      }}>
        <span style={{ color: '#4ade80' }}>●</span> GPS active
      </div>
      <style>{`@keyframes locPulse { 0%{opacity:0.9;transform:translate(-50%,-50%) scale(0.5)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2.2)} }`}</style>
    </MapBg>
  );
}

const LOCATION_KOTLIN = `// 1. Add to AndroidManifest.xml:
// <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
// <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

val locationEngine = AndroidLocationEngine(context)

locationEngine.addOnLocationUpdateListener { location ->
    val lat = location.latitude
    val lon = location.longitude
    val accuracy = location.accuracy   // metres
    map.moveCamera(lat, lon)
}

locationEngine.enable()`;

const LOCATION_SWIFT = `// 1. Add to Info.plist:
// NSLocationWhenInUseUsageDescription
// NSLocationAlwaysAndWhenInUseUsageDescription  ← background

import TomTomSDKLocationProvider
import CoreLocation

let locationProvider = TomTomLocationProvider()
let clManager = CLLocationManager()
clManager.requestWhenInUseAuthorization()

locationProvider.addDelegate(self)
locationProvider.start()

// Delegate
func locationProvider(_ provider: TomTomLocationProvider,
                      didUpdate location: TomTomSDKCommon.CLLocation) {
    let lat = location.coordinate.latitude
    let lon = location.coordinate.longitude
    mapView.center(on: location.coordinate)
}`;

const LOCATION_APIS = [
  { name: 'Displaying Your First Map',  type: 'Android SDK', description: 'Show the user location dot on the map — requires LocationProvider configured here.',                   pageId: 'navsdk-first-map',       productId: 'navsdk' },
  { name: 'Map Display for Compose',    type: 'Android SDK', description: 'Composable map that renders the location indicator using the configured LocationProvider.',              pageId: 'navsdk-map-compose',     productId: 'navsdk' },
  { name: 'Map-Matched Location',       type: 'Android SDK', description: 'MapMatchedLocationProvider snaps position to the road network for improved navigation accuracy.',        pageId: 'navsdk-adv-map-matched', productId: 'navsdk' },
  { name: 'Simulation Location',        type: 'Android SDK', description: 'Simulate GPS movement along a route to test navigation without physical travel.',                         pageId: 'navsdk-adv-simulation',  productId: 'navsdk' },
];
export function NavSDKLocationQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Location Provider</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Set up the LocationEngine (Android) or TomTomLocationProvider (iOS) to stream real-time
        device position into your navigation application.
      </p>

      <ApiLinks items={LOCATION_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="location-overview">Overview</h2>
        <p className="body">
          The <strong>LocationEngine</strong> interface abstracts the underlying platform location
          source — fused provider on Android, CoreLocation on iOS — and feeds a continuous stream
          of <code>GeoLocation</code> objects into the Navigation SDK. Every navigation component
          (routing, lane guidance, ETA) consumes this stream automatically once enabled.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-permissions">Permissions setup</h2>
        <p className="body">
          Both platforms require explicit permission declarations. Android distinguishes
          foreground (<code>ACCESS_FINE_LOCATION</code>) from background
          (<code>ACCESS_BACKGROUND_LOCATION</code>); iOS uses a combined
          <code>WhenInUse</code> / <code>AlwaysAndWhenInUse</code> model through
          CoreLocation's authorization dialog.
        </p>
        <Callout type="info">
          Background location on Android (API 29+) requires a separate runtime permission prompt
          after foreground permission is already granted. iOS triggers a single system dialog that
          includes a "While Using" vs "Always" choice.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-demo">Live position demo</h2>
        <p className="body">
          The dot below simulates a device moving along a road segment with a pulsing accuracy
          ring. Coordinates update every 900 ms, matching a typical GPS cadence.
        </p>
        <LocationPulsingDot />
      </div>

      <div className="zone">
        <h2 className="sh" id="location-code">Implementation</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {LOCATION_KOTLIN}
          {LOCATION_SWIFT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-background">Background location</h2>
        <p className="body">
          Turn-by-turn guidance requires location updates when the screen is off or the app
          is backgrounded. The permission models differ significantly between platforms.
        </p>
        <table className="prop-table">
          <thead><tr><th>Platform</th><th>Permission</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Android', 'ACCESS_BACKGROUND_LOCATION', 'Must be requested as a separate step after foreground permission. Show rationale dialog before requesting.'],
              ['iOS', 'NSLocationAlwaysAndWhenInUseUsageDescription', 'User chooses level in the system prompt. App may be down-graded to WhenInUse by the user at any time.'],
            ].map(([platform, perm, note]) => (
              <tr key={platform}>
                <td style={{ fontWeight: 500 }}>{platform}</td>
                <td><code>{perm}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 2. NavSDKSearchQuickstart ──────────────────────────────────────────────── */

const MOCK_RESULTS = [
  { icon: '🏢', name: 'TomTom HQ', addr: 'Haarlemmerweg 187, Amsterdam' },
  { icon: '🍕', name: 'La Piazza Ristorante', addr: 'Damrak 5, Amsterdam' },
  { icon: '🏨', name: 'Hotel V Nesplein', addr: 'Nes 49, Amsterdam' },
];

function SearchDemoWidget() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowResults(e.target.value.length > 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search places, addresses, POIs..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px 10px 36px',
            borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--fg)',
            fontSize: '0.875rem', outline: 'none',
          }}
        />
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
      </div>
      {showResults && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {MOCK_RESULTS.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              borderBottom: i < MOCK_RESULTS.length - 1 ? '1px solid var(--border)' : 'none',
              background: 'var(--bg)',
            }}>
              <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.addr}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#e2001a', fontWeight: 600 }}>→</div>
            </div>
          ))}
        </div>
      )}
      {!showResults && (
        <div style={{
          padding: '20px', textAlign: 'center',
          color: 'var(--muted)', fontSize: '0.875rem',
          border: '1px dashed var(--border)', borderRadius: 10,
        }}>
          Type 2+ characters to see results
        </div>
      )}
    </div>
  );
}

const SEARCH_INIT_KOTLIN = `// Android — init with API key
val searchApi = OnlineSearch.create(
    context = applicationContext,
    apiKey = "YOUR_API_KEY"
)

// Basic fuzzy search
val options = FuzzySearchOptions(
    query = "coffee Amsterdam",
    limit = 5,
    language = Locale.ENGLISH
)

searchApi.search(options) { result ->
    result.onSuccess { response ->
        response.results.forEach { place ->
            Log.d("Search", "\${place.poi?.name} @ \${place.position}")
        }
    }
}`;

const SEARCH_INIT_SWIFT = `// iOS — init with API key
import TomTomSDKSearch

let searchAPI = TomTomSDKSearch.create(
    apiKey: "YOUR_API_KEY"
)

// Basic fuzzy search
let query = SearchQuery(
    term: "coffee Amsterdam",
    options: .init(limit: 5, language: .english)
)

searchAPI.search(query: query) { result in
    switch result {
    case .success(let response):
        response.results.forEach { place in
            print("\(place.poi?.name ?? "") @ \(place.position)")
        }
    case .failure(let error):
        print("Search error: \(error)")
    }
}`;

const SEARCH_QUICKSTART_APIS = [
  { name: 'Find a Location',        type: 'Android SDK', description: 'Fuzzy search for POIs, addresses, and geography — the primary search operation built on this quickstart.',   pageId: 'navsdk-search-find',        productId: 'navsdk' },
  { name: 'Location Quickstart',    type: 'Android SDK', description: 'Configure the LocationProvider that powers position-biased search results.',                                   pageId: 'navsdk-location-quickstart', productId: 'navsdk' },
  { name: 'Search Engine (UX)',     type: 'Android SDK', description: 'UX Library search engine component that consumes results from this SDK initialisation.',                        pageId: 'search-engine',              productId: 'ux-library' },
];

export function NavSDKSearchQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search Quickstart</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Initialize the TomTom Search API on Android or iOS and run your first fuzzy search
        query in minutes — both platforms use the same underlying REST endpoint.
      </p>
      <ApiLinks items={SEARCH_QUICKSTART_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="search-overview">Overview</h2>
        <p className="body">
          The TomTom Search SDK wraps the Search API v6 endpoint, handling auth, retries, and
          response parsing. <strong>OnlineSearch.create()</strong> (Android) and
          <strong> TomTomSDKSearch.create()</strong> (iOS) produce a <code>SearchApi</code> instance
          that is reusable across the app lifecycle.
        </p>
        <Callout type="info">
          Both platforms support the same set of search operations: fuzzy search, reverse geocoding,
          EV station search, and POI categories. Feature parity is maintained across SDK releases.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="search-demo">Interactive demo</h2>
        <p className="body">
          Type a query below to see the result card format your app will receive from the SDK.
        </p>
        <SearchDemoWidget />
      </div>

      <div className="zone">
        <h2 className="sh" id="search-code">Initialization and first search</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {SEARCH_INIT_KOTLIN}
          {SEARCH_INIT_SWIFT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="search-result-shape">Result shape</h2>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['id', 'String', 'Stable TomTom place identifier'],
              ['type', 'PlaceType', 'POI, Geography, Street, CrossStreet, Address'],
              ['position', 'GeoCoordinate', 'WGS-84 lat/lon centroid'],
              ['address', 'Address', 'Structured address with freeFormAddress'],
              ['poi', 'Poi?', 'Name, categories, phone, URL — present for POI results'],
              ['score', 'Double', 'Relevance score (higher is better)'],
            ].map(([field, type, desc]) => (
              <tr key={field}>
                <td><code>{field}</code></td>
                <td style={{ color: '#e2001a', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 3. NavSDKSearchFind ────────────────────────────────────────────────────── */

const TYPING_SEQUENCE = ['A', 'Am', 'Ams', 'Amst', 'Amste', 'Amsterd', 'Amsterdam'];
const FUZZY_RESULTS = [
  { name: 'Amsterdam', type: 'City', country: 'Netherlands', score: 9.82, lat: 52.3676, lon: 4.9041 },
  { name: 'Amsterdam Airport Schiphol', type: 'Airport', country: 'Netherlands', score: 8.61, lat: 52.3086, lon: 4.7639 },
  { name: 'Amsterdam Noord', type: 'District', country: 'Netherlands', score: 7.44, lat: 52.3974, lon: 4.9199 },
];

function FuzzySearchDemo() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    let t;
    if (typeIdx < TYPING_SEQUENCE.length - 1) {
      t = setTimeout(() => setTypeIdx(i => i + 1), 200);
    } else {
      t = setTimeout(() => setShowResults(true), 400);
    }
    return () => clearTimeout(t);
  }, [typeIdx]);

  const restart = () => {
    setTypeIdx(0);
    setShowResults(false);
    setSelectedResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '10px 14px 10px 36px',
          borderRadius: 10, border: '1px solid var(--border)',
          background: 'var(--bg)', color: 'var(--fg)',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>{TYPING_SEQUENCE[typeIdx]}<span style={{ opacity: 0.5 }}>|</span></span>
          <button onClick={restart} style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>↺ replay</button>
        </div>
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
      </div>

      {showResults && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {FUZZY_RESULTS.map((r, i) => (
            <div
              key={i}
              onClick={() => setSelectedResult(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderBottom: i < FUZZY_RESULTS.length - 1 ? '1px solid var(--border)' : 'none',
                background: selectedResult?.name === r.name ? '#fff5f5' : 'var(--bg)',
                cursor: 'pointer', transition: 'background 0.1s',
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#e2001a', flexShrink: 0,
                opacity: 0.6 + (FUZZY_RESULTS.length - i) * 0.13,
              }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{r.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 8 }}>{r.type}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'right' }}>
                <div style={{ color: '#e2001a', fontWeight: 600 }}>{r.score}</div>
                <div>score</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResult && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: '#fff5f5', border: '1px solid #fecaca',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#e2001a', fontWeight: 700, marginBottom: 6 }}>Selected result</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              ['name', selectedResult.name],
              ['type', selectedResult.type],
              ['lat', selectedResult.lat],
              ['lon', selectedResult.lon],
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)' }}>{k}: </span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const FUZZY_KOTLIN = `val options = FuzzySearchOptions(
    query       = "Amsterdam",
    limit       = 10,
    language    = Locale.ENGLISH,
    countrySet  = setOf("NL", "BE"),   // restrict to countries
    idxSet      = setOf(               // index types to search
        SearchIndexType.Poi,
        SearchIndexType.Addr,
        SearchIndexType.Geo
    )
)

searchApi.search(options) { result ->
    result.onSuccess { response ->
        val top = response.results.first()
        // top.id, top.type, top.position, top.address, top.poi, top.score
    }
}`;

const FUZZY_SWIFT = `let options = SearchOptions(
    limit: 10,
    language: .english,
    countryCodes: ["NL", "BE"],
    indexSet: [.poi, .address, .geography]
)

let query = SearchQuery(
    term: "Amsterdam",
    options: options
)

searchAPI.search(query: query) { result in
    guard case .success(let response) = result else { return }
    let top = response.results.first!
    // top.id, top.type, top.position, top.address, top.poi, top.score
}`;

const SEARCH_FIND_APIS = [
  { name: 'Search Quickstart',      type: 'Android SDK', description: 'SDK initialisation and OnlineSearch.create() needed before fuzzy search is available.',                        pageId: 'navsdk-search-quickstart', productId: 'navsdk' },
  { name: 'Reverse Geocoding',      type: 'Android SDK', description: 'Convert a tapped coordinate back into a structured address using the same SearchApi instance.',                pageId: 'navsdk-search-reverse',    productId: 'navsdk' },
  { name: 'Bring Your Own Data',    type: 'Android SDK', description: 'Blend custom POI records into fuzzy search results via SearchIndexDataProvider.',                               pageId: 'navsdk-search-byod',       productId: 'navsdk' },
  { name: 'Search Engine (UX)',     type: 'Android SDK', description: 'UX Library component that wraps fuzzy search results in an interactive list UI.',                               pageId: 'search-engine',            productId: 'ux-library' },
  { name: 'Map Markers',            type: 'Android SDK', description: 'Pin fuzzy search results on the map using ImageMarker or ClusterLayer.',                                        pageId: 'navsdk-map-markers',       productId: 'navsdk' },
];

export function NavSDKSearchFind({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Find a Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Fuzzy search matches free-text queries against POIs, addresses, and geography —
        returning ranked results with coordinates, structured address, and place metadata.
      </p>
      <ApiLinks items={SEARCH_FIND_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="fuzzy-options">FuzzySearchOptions</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['query', 'String', 'Free-text search term'],
              ['limit', 'Int', 'Max number of results (1–100, default 10)'],
              ['language', 'Locale', 'BCP-47 language for result text (e.g. en-GB)'],
              ['countrySet', 'Set<String>', 'Restrict to ISO 3166-1 alpha-2 country codes'],
              ['idxSet', 'Set<SearchIndexType>', 'Limit to specific index types: Poi, Addr, Geo, Xstr, MunicipalitySubdivision'],
              ['position', 'GeoCoordinate?', 'Bias results toward this location'],
              ['radius', 'Int?', 'Bias radius in metres around position'],
            ].map(([opt, type, desc]) => (
              <tr key={opt}>
                <td><code>{opt}</code></td>
                <td style={{ color: '#e2001a', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="fuzzy-demo">Typing animation demo</h2>
        <p className="body">
          Watch the search animate character-by-character, then click a result to see the
          decoded result object.
        </p>
        <FuzzySearchDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="fuzzy-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {FUZZY_KOTLIN}
          {FUZZY_SWIFT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="fuzzy-scoring">Score and ranking</h2>
        <p className="body">
          Each result carries a floating-point <code>score</code>. Higher is more relevant.
          The engine weights exact string matches, geographic proximity (when
          <code> position</code> is supplied), popularity, and completeness of the match.
          Results are always returned pre-sorted by score descending — no client-side sorting
          is needed.
        </p>
      </div>
    </div>
  );
}

/* ─── 4. NavSDKSearchEv ──────────────────────────────────────────────────────── */

const EV_STATIONS = [
  { x: 130, y: 100, name: 'Shell Recharge', power: 150, connector: 'CCS', available: true },
  { x: 240, y: 130, name: 'Allego Hub', power: 50, connector: 'Type2', available: true },
  { x: 190, y: 170, name: 'FastNed', power: 300, connector: 'CCS', available: false },
  { x: 90,  y: 155, name: 'EVBox', power: 22, connector: 'Type2', available: true },
  { x: 310, y: 105, name: 'Ionity', power: 350, connector: 'CCS', available: true },
];

const CONNECTORS = ['All', 'CCS', 'Type2', 'CHAdeMO'];

function EvMapDemo() {
  const [filterConnector, setFilterConnector] = useState('All');
  const [filterMinKW, setFilterMinKW] = useState(0);
  const [selectedStation, setSelectedStation] = useState(null);

  const visible = EV_STATIONS.filter(s =>
    (filterConnector === 'All' || s.connector === filterConnector) &&
    s.power >= filterMinKW
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Filter controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {CONNECTORS.map(c => (
            <button key={c} onClick={() => setFilterConnector(c)} style={{
              padding: '5px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer',
              fontWeight: filterConnector === c ? 700 : 400,
              background: filterConnector === c ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${filterConnector === c ? '#e2001a' : 'var(--border)'}`,
              color: filterConnector === c ? '#e2001a' : 'var(--mid)',
            }}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Min kW:</span>
          {[0, 22, 50, 100].map(kw => (
            <button key={kw} onClick={() => setFilterMinKW(kw)} style={{
              padding: '5px 8px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer',
              fontWeight: filterMinKW === kw ? 700 : 400,
              background: filterMinKW === kw ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${filterMinKW === kw ? '#e2001a' : 'var(--border)'}`,
              color: filterMinKW === kw ? '#e2001a' : 'var(--mid)',
            }}>{kw === 0 ? 'Any' : `${kw}+`}</button>
          ))}
        </div>
      </div>

      {/* Map */}
      <MapBg height={240}>
        {EV_STATIONS.map((s, i) => {
          const isVisible = visible.includes(s);
          const isSelected = selectedStation?.name === s.name;
          return (
            <div
              key={i}
              onClick={() => isVisible && setSelectedStation(s)}
              style={{
                position: 'absolute', left: s.x, top: s.y,
                transform: 'translate(-50%,-50%)',
                width: 28, height: 28, borderRadius: '50%',
                background: isVisible
                  ? (s.available ? '#22c55e' : '#f59e0b')
                  : 'rgba(255,255,255,0.1)',
                border: `2px solid ${isSelected ? 'white' : 'rgba(0,0,0,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', cursor: isVisible ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none',
                opacity: isVisible ? 1 : 0.2,
              }}
            >⚡</div>
          );
        })}
        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '6px 10px',
          border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.7rem', color: '#94a3b8',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <div><span style={{ color: '#22c55e' }}>⚡</span> Available</div>
          <div><span style={{ color: '#f59e0b' }}>⚡</span> Occupied</div>
          <div style={{ opacity: 0.4 }}>⚡ Filtered out</div>
        </div>
      </MapBg>

      {/* Detail card */}
      {selectedStation && (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fff5f5', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '0.75rem', color: '#e2001a', fontWeight: 700, marginBottom: 6 }}>{selectedStation.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: '0.75rem' }}>
            {[
              ['connector', selectedStation.connector],
              ['power', `${selectedStation.power} kW`],
              ['available', selectedStation.available ? 'Yes' : 'Occupied'],
            ].map(([k, v]) => (
              <div key={k}><span style={{ color: 'var(--muted)' }}>{k}: </span><span style={{ fontWeight: 600 }}>{v}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const EV_KOTLIN = `val options = EVChargingStationsSearchOptions(
    position      = GeoCoordinate(52.3676, 4.9041),
    radius        = 5000,        // metres
    connectorType = listOf(
        ConnectorType.IEC62196Type2,   // Type 2
        ConnectorType.IEC62196Type2CCS // CCS
    ),
    minPowerKW    = 50.0,
    availabilitySource = AvailabilitySource.Real,  // live availability
    limit         = 20
)

searchApi.searchEVChargingStations(options) { result ->
    result.onSuccess { response ->
        response.results.forEach { station ->
            val name      = station.poi?.name
            val position  = station.position
            val connectors = station.chargingPark?.connectors
            val available  = station.chargingPark?.availability
        }
    }
}`;

const EV_SWIFT = `let options = EVChargingStationSearchOptions(
    position: .init(latitude: 52.3676, longitude: 4.9041),
    radius: 5000,
    connectorTypes: [.iec62196Type2, .iec62196Type2CCS],
    minPowerKW: 50.0,
    availabilitySource: .realTime,
    limit: 20
)

searchAPI.searchEVChargingStations(options: options) { result in
    guard case .success(let response) = result else { return }
    response.results.forEach { station in
        let name      = station.poi?.name
        let position  = station.position
        let connectors = station.chargingPark?.connectors
        let available  = station.chargingPark?.availability
    }
}`;

const SEARCH_EV_APIS = [
  { name: 'Find a Location',        type: 'Android SDK', description: 'Fuzzy search fundmentals — the same SearchApi instance powers EV station search.',                             pageId: 'navsdk-search-find',        productId: 'navsdk' },
  { name: 'EV Charging Search (UX)',type: 'Android SDK', description: 'UX Library charging search page that renders station cards from this SDK call.',                               pageId: 'ev-charging-search',        productId: 'ux-library' },
  { name: 'EV Battery & Range (UX)',type: 'Android SDK', description: 'Battery state and range estimate that determines which stations are reachable.',                               pageId: 'ev-battery',                productId: 'ux-library' },
  { name: 'Route Planning',         type: 'Android SDK', description: 'Plan a route with an EV charging stop inserted at the station found by this search.',                          pageId: 'navsdk-route-planning',     productId: 'navsdk' },
];

export function NavSDKSearchEv({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Station Search</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Find nearby EV charging stations with real-time availability, filtered by connector
        type and minimum charge power.
      </p>
      <ApiLinks items={SEARCH_EV_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="ev-options">EVChargingStationsSearchOptions</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['position', 'GeoCoordinate', 'Search center point'],
              ['radius', 'Int', 'Search radius in metres'],
              ['connectorType', 'List<ConnectorType>', 'Filter by connector standard(s)'],
              ['minPowerKW', 'Double', 'Minimum charge power in kilowatts'],
              ['availabilitySource', 'AvailabilitySource', 'Real (live data), Static, or All'],
              ['limit', 'Int', 'Max results (default 10)'],
            ].map(([opt, type, desc]) => (
              <tr key={opt}>
                <td><code>{opt}</code></td>
                <td style={{ color: '#e2001a', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="ev-connectors">Connector types</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            ['Type2 (IEC 62196-2)', 'AC up to 22 kW, dominant in Europe'],
            ['CCS (IEC 62196-3)', 'DC fast charging up to 350 kW'],
            ['CHAdeMO', 'DC fast charging, Nissan/Mitsubishi legacy'],
            ['GB/T', 'Chinese national standard, AC+DC'],
            ['Tesla', 'Proprietary — adapter availability varies'],
          ].map(([name, desc]) => (
            <div key={name} style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'var(--bg)', border: '1px solid var(--border)',
              fontSize: '0.8rem',
            }}>
              <span style={{ fontWeight: 600 }}>{name}</span>
              <span style={{ color: 'var(--muted)', marginLeft: 6 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ev-demo">Map demo</h2>
        <p className="body">
          Filter the stations by connector type or minimum power level. Click a pin to see
          its detail card.
        </p>
        <EvMapDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="ev-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {EV_KOTLIN}
          {EV_SWIFT}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ─── 5. NavSDKSearchReverse ─────────────────────────────────────────────────── */

const REVERSE_TAPS = [
  { x: 130, y: 105, addr: 'Haarlemmerweg 187', city: 'Amsterdam', postal: '1051 KX', country: 'NL' },
  { x: 260, y: 148, addr: 'Damrak 5',           city: 'Amsterdam', postal: '1012 LG', country: 'NL' },
  { x: 85,  y: 160, addr: 'Nes 49',             city: 'Amsterdam', postal: '1012 KD', country: 'NL' },
];

function ReverseGeoDemo() {
  const [activePin, setActivePin] = useState(null);
  const [card, setCard] = useState(null);

  const handleTap = (tap) => {
    setActivePin(tap);
    setCard(null);
    setTimeout(() => setCard(tap), 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MapBg height={230}>
        {/* Click zones */}
        {REVERSE_TAPS.map((t, i) => (
          <div
            key={i}
            onClick={() => handleTap(t)}
            style={{
              position: 'absolute', left: t.x, top: t.y,
              transform: 'translate(-50%,-50%)',
              width: 32, height: 32, borderRadius: '50%',
              background: activePin === t ? 'rgba(226,0,26,0.2)' : 'rgba(255,255,255,0.06)',
              border: `1px dashed ${activePin === t ? '#e2001a' : 'rgba(255,255,255,0.2)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
            }}
          >tap</div>
        ))}
        {activePin && (
          <div style={{
            position: 'absolute', left: activePin.x, top: activePin.y,
            transform: 'translate(-50%, -100%) translateY(-8px)',
            background: 'rgba(13,17,23,0.95)', borderRadius: 8, padding: '6px 10px',
            border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.7rem', color: '#94a3b8',
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.2s ease',
          }}>
            {activePin.addr}
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)',
        }}>Tap any circle to reverse geocode</div>
        <style>{`@keyframes fadeIn { from{opacity:0;transform:translate(-50%,-100%) translateY(0)} to{opacity:1;transform:translate(-50%,-100%) translateY(-8px)} }`}</style>
      </MapBg>

      {card ? (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fff5f5', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '0.75rem', color: '#e2001a', fontWeight: 700, marginBottom: 8 }}>Address result</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.8rem' }}>
            {[
              ['address', card.addr],
              ['municipality', card.city],
              ['postalCode', card.postal],
              ['countryCode', card.country],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{k}</div>
                <div style={{ fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', border: '1px dashed var(--border)', borderRadius: 10 }}>
          Tap a point on the map above
        </div>
      )}
    </div>
  );
}

const REVERSE_KOTLIN = `val options = ReverseGeocoderOptions(
    position = GeoCoordinate(52.3676, 4.9041),
    radius   = 100,              // metres, default 10 000
    language = Locale.ENGLISH
)

searchApi.reverseGeocode(options) { result ->
    result.onSuccess { response ->
        val addr = response.addresses.firstOrNull()
        val freeForm    = addr?.address?.freeFormAddress
        val municipality = addr?.address?.municipality
        val countryCode = addr?.address?.countryCode
        val postalCode  = addr?.address?.postalCode
    }
}`;

const REVERSE_SWIFT = `let options = ReverseGeocodingOptions(
    position: .init(latitude: 52.3676, longitude: 4.9041),
    radius: 100,
    language: .english
)

let query = ReverseGeocodingQuery(options: options)

searchAPI.reverseGeocode(query: query) { result in
    guard case .success(let response) = result else { return }
    if let addr = response.addresses.first {
        let freeForm    = addr.address.freeFormAddress
        let city        = addr.address.municipality
        let countryCode = addr.address.countryCode
        let postalCode  = addr.address.postalCode
    }
}`;

const SEARCH_REVERSE_APIS = [
  { name: 'Find a Location',        type: 'Android SDK', description: 'Fuzzy search using the same SearchApi instance — reverse geocoding and text search share one initialisation.',  pageId: 'navsdk-search-find',         productId: 'navsdk' },
  { name: 'Location Quickstart',    type: 'Android SDK', description: 'LocationProvider that supplies the vehicle\'s GeoCoordinate for reverse geocoding pin positions.',              pageId: 'navsdk-location-quickstart', productId: 'navsdk' },
  { name: 'Search Quickstart',      type: 'Android SDK', description: 'SDK initialisation with OnlineSearch.create() — required before reverse geocoding is available.',              pageId: 'navsdk-search-quickstart',   productId: 'navsdk' },
];

export function NavSDKSearchReverse({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Reverse Geocoding</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Convert a latitude/longitude coordinate into a structured address — useful for
        "drop a pin" workflows, logging trip waypoints, or labeling a user's saved location.
      </p>
      <ApiLinks items={SEARCH_REVERSE_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="reverse-options">ReverseGeocoderOptions</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['position', 'GeoCoordinate', 'The coordinate to reverse geocode'],
              ['radius', 'Int', 'Search radius in metres (default 10 000)'],
              ['language', 'Locale', 'BCP-47 language for result text'],
              ['entityType', 'Set<EntityType>?', 'Restrict to Country, MunicipalitySubdivision, etc.'],
            ].map(([opt, type, desc]) => (
              <tr key={opt}>
                <td><code>{opt}</code></td>
                <td style={{ color: '#e2001a', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="reverse-demo">Tap-to-geocode demo</h2>
        <p className="body">
          Tap one of the circles on the map to simulate a reverse geocode request. The
          address card appears once the (mocked) response arrives.
        </p>
        <ReverseGeoDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="reverse-result">Result structure</h2>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['freeFormAddress', 'Full address as a single human-readable string'],
              ['streetName', 'Street name without number'],
              ['streetNumber', 'House/building number'],
              ['municipality', 'City or town name'],
              ['countryCode', 'ISO 3166-1 alpha-2 (e.g. "NL")'],
              ['postalCode', 'Postal/ZIP code'],
            ].map(([field, desc]) => (
              <tr key={field}>
                <td><code>{field}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="reverse-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {REVERSE_KOTLIN}
          {REVERSE_SWIFT}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ─── 6. NavSDKSearchByod ────────────────────────────────────────────────────── */

const BYOD_KOTLIN = `// Step 1 — build the index dataset
val poiRecords = listOf(
    SearchIndexRecord(
        id       = "dealer-001",
        name     = "Amsterdam Flagship Store",
        position = GeoCoordinate(52.3700, 4.8952),
        address  = Address(freeFormAddress = "Hoofdweg 1, Amsterdam"),
        categories = listOf("car dealer", "showroom")
    ),
    // … more records
)

// Step 2 — create the data provider
val dataProvider = SearchIndexDataProvider.create(
    records = poiRecords
)

// Step 3 — add to the search engine
val searchEngine = OnlineSearch.create(
    context  = applicationContext,
    apiKey   = "YOUR_API_KEY",
    additionalDataProviders = listOf(dataProvider)
)

// Step 4 — search blends TomTom + custom results automatically
searchEngine.search(
    FuzzySearchOptions(query = "Amsterdam store")
) { result ->
    result.onSuccess { response ->
        // response.results contains both TomTom and custom POIs
        response.results.forEach { place ->
            val isCustom = place.dataSources?.contains("custom") == true
        }
    }
}`;

const BYOD_SWIFT_PLACEHOLDER = `// iOS — partial custom result blending
// Full SearchIndexDataProvider is Android-only.
// On iOS you can pre-process results client-side:

searchAPI.search(query: query) { result in
    guard case .success(let response) = result else { return }

    // Fetch your own POI data separately
    let myPois = MyPoiStore.shared.search(term: query.term)

    // Merge and re-rank client-side
    let merged = (response.results + myPois.map { $0.asSearchResult() })
        .sorted { $0.score > $1.score }

    // Display merged list
    updateUI(with: merged)
}`;

const SEARCH_BYOD_APIS = [
  { name: 'Find a Location',        type: 'Android SDK', description: 'Fuzzy search that blends BYOD records — the same FuzzySearchOptions call surfaces both cloud and custom results.',pageId: 'navsdk-search-find',       productId: 'navsdk' },
  { name: 'Search Quickstart',      type: 'Android SDK', description: 'OnlineSearch.create() must be called with the SearchIndexDataProvider before BYOD records are available.',        pageId: 'navsdk-search-quickstart', productId: 'navsdk' },
  { name: 'Search Engine (UX)',     type: 'Android SDK', description: 'UX Library search component that renders blended BYOD results alongside TomTom cloud results.',                   pageId: 'search-engine',            productId: 'ux-library' },
];

export function NavSDKSearchByod({ onNavigate }) {
  const [tab, setTab] = useState('architecture');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bring Your Own Data</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Blend custom POI data — dealer locations, venue directories, internal points of
        interest — directly into TomTom fuzzy search results on Android.
      </p>
      <ApiLinks items={SEARCH_BYOD_APIS} onNavigate={onNavigate} />

      <Callout type="warn">
        Full BYOD support via <strong>SearchIndexDataProvider</strong> is Android-only. iOS does
        not expose an equivalent index injection API; custom results must be merged client-side
        after separate fetching.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="byod-overview">Custom search provider</h2>
        <p className="body">
          <code>SearchIndexDataProvider</code> accepts a list of <code>SearchIndexRecord</code>
          objects at startup. The SDK indexes them in memory and blends matching records into
          every <code>FuzzySearchOptions</code> call transparently — no changes to existing
          search calls are needed.
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {['architecture', 'use-cases'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '5px 12px', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer',
              fontWeight: tab === t ? 700 : 400,
              background: tab === t ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${tab === t ? '#e2001a' : 'var(--border)'}`,
              color: tab === t ? '#e2001a' : 'var(--mid)',
            }}>{t === 'architecture' ? 'Architecture' : 'Use cases'}</button>
          ))}
        </div>

        {tab === 'architecture' ? (
          <div style={{
            padding: '16px', borderRadius: 10, background: 'var(--bg)',
            border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.8rem',
            lineHeight: 2, color: 'var(--mid)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: '#fff5f5', color: '#e2001a', padding: '2px 8px', borderRadius: 4, border: '1px solid #fecaca' }}>Your POI records</span>
              <span>→</span>
              <span style={{ background: 'var(--bg)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>SearchIndexDataProvider</span>
              <span>→</span>
              <span style={{ background: 'var(--bg)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>OnlineSearch.create()</span>
              <span>→</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 4, border: '1px solid #bbf7d0' }}>Blended results</span>
            </div>
          </div>
        ) : (
          <ul style={{ paddingLeft: 18, lineHeight: 2, color: 'var(--mid)', fontSize: '0.875rem' }}>
            <li>In-house dealer network — surface brand locations before generic competition</li>
            <li>Venue directories — airports, campuses, shopping malls with internal POIs</li>
            <li>Fleet depots — maintenance centers visible only to fleet operator apps</li>
            <li>Event-specific POIs — temporary locations for festivals or race circuits</li>
          </ul>
        )}
      </div>

      <div className="zone">
        <h2 className="sh" id="byod-record">SearchIndexRecord fields</h2>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['id', 'String', 'Yes', 'Unique identifier in your data set'],
              ['name', 'String', 'Yes', 'Display name used for text matching'],
              ['position', 'GeoCoordinate', 'Yes', 'WGS-84 lat/lon for proximity ranking'],
              ['address', 'Address', 'No', 'Structured address returned in results'],
              ['categories', 'List<String>', 'No', 'Category tags for idxSet filtering'],
              ['phone', 'String', 'No', 'Contact number shown in result detail'],
            ].map(([field, type, req, desc]) => (
              <tr key={field}>
                <td><code>{field}</code></td>
                <td style={{ color: '#e2001a', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ fontSize: '0.875rem', color: req === 'Yes' ? '#e2001a' : 'var(--muted)' }}>{req}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="byod-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {BYOD_KOTLIN}
          {BYOD_SWIFT_PLACEHOLDER}
        </CodeBlock>
        <Callout type="warn">
          The Swift example above shows client-side merging as a workaround. There is no
          SDK-level index injection on iOS; the merged results will not benefit from the
          server-side relevance ranking that Android's <code>SearchIndexDataProvider</code>
          provides.
        </Callout>
      </div>
    </div>
  );
}
