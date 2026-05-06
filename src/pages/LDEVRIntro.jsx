import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ExampleCard from '../components/ui/ExampleCard';

/* ─── Endpoint thumbnails ────────────────────────────────────────────────────── */
function ThumbEVRoute() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {[[90, 72], [140, 58]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#22c55e" style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <circle cx="20" cy="105" r="4" fill="#3fb950"/>
        <circle cx="185" cy="38" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Battery</span>
          <span style={{ fontSize: '0.5rem', color: '#22c55e', fontWeight: 700 }}>18% → 78% → 22%</span>
        </div>
        <div style={{ height: 3, background: '#1e293b', borderRadius: 2 }}>
          <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #22c55e, #3fb950)', borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

function ThumbBatchEV() {
  const routes = [
    { color: '#22c55e', stops: 2, w: 85 },
    { color: '#3fb950', stops: 1, w: 62 },
    { color: '#58a6ff', stops: 2, w: 91 },
    { color: '#a78bfa', stops: 3, w: 74 },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Batch EV · 4 routes</div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
          <div style={{ flex: 1, height: 3, background: '#1e293b', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${r.w}%`, background: r.color, borderRadius: 2, opacity: 0.8 }}/>
          </div>
          <span style={{ fontSize: '0.4375rem', color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>
            {r.stops}⚡
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/>
        <span style={{ fontSize: '0.5rem', color: '#22c55e' }}>4/4 completed · async</span>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function LDEVRIntro({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Plan routes for electric vehicles over distances that exceed a single charge.
        The API automatically selects optimal charging stops — factoring in connector type,
        charger power, detour cost, and battery state — and returns a complete itinerary
        with dwell times and station details ready to render in-app.
      </p>

      {/* Capability tiles — inline under summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, margin: '20px 0 0' }}>
        {[
          ['🔋', 'Battery state modelling', 'Simulates charge level along every road segment — accounting for speed, elevation, auxiliary power draw, and regenerative braking.'],
          ['⚡', 'Automatic stop selection', 'Picks the combination of charging stops that minimises total journey time, including dwell at each charger.'],
          ['🔌', 'Connector matching', 'Pass the connectors your vehicle supports (CCS, CHAdeMO, GB/T…) and only compatible stations are considered.'],
          ['🗺️', 'Traffic-aware energy', 'Real-time and historic traffic affects modelled consumption — stop-and-go driving uses more energy than free-flow.'],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
              <span style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{icon}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>


      {/* Endpoints */}
      <div className="zone">
        <h2 className="sh" id="ldevr-endpoints">Endpoints</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>Two endpoints. Use only what you need — each can be called standalone.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {[
            {
              Thumb: ThumbEVRoute,
              method: 'POST',
              title: 'Calculate EV Route',
              path: '/routing/1/calculateLongDistanceEVRoute/{locations}/json',
              desc: 'Plan a multi-leg EV route with automatic charging stop selection. Returns a complete itinerary with station names, connector details, dwell times, and battery state at every leg boundary.',
              pageId: 'ldevr-calculate-route',
            },
            {
              Thumb: ThumbBatchEV,
              method: 'POST',
              title: 'Batch EV Route',
              path: '/routing/1/calculateLongDistanceEVRoute/batch/sync/json',
              desc: 'Submit up to 700 EV route calculations in a single call. Synchronous (100 items) and asynchronous modes. Each item carries its own vehicle and battery parameters.',
              pageId: 'ldevr-batch',
            },
          ].map(({ Thumb, method, title, path, desc, pageId }) => (
            <div
              key={title}
              onClick={() => onNavigate?.(pageId)}
              style={{ cursor: 'pointer', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ height: 120, background: '#0d1117', overflow: 'hidden', padding: 8, flexShrink: 0 }}>
                <Thumb />
              </div>
              <div style={{ padding: '12px 14px', flex: 1 }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(88,166,255,0.12)', color: '#58a6ff', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{method}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <code style={{ display: 'block', fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</code>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDK examples */}
      <div className="zone">
        <h2 className="sh" id="ldevr-examples">SDK examples</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Live demos built with the{' '}
          <a href="https://docs.tomtom.com/maps-sdk-js/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
            TomTom Maps SDK for JavaScript
          </a>{' '}
          on top of the LDEVR API. Click <strong>Key config</strong> to see the API parameters in action.
        </p>
        <div className="examples-grid">

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-model-id"
            title="LDEVR with model ID"
            description="A–B Long Distance EV Route from Paris to Amsterdam with automatic charging stops, using a registered vehicle model variant."
            tags={[
              { label: 'Getting Started', variant: 'start' },
              { label: 'Electric Vehicles', variant: 'feature' },
              { label: 'Web', variant: 'platform' },
            ]}
            Thumb={() => (
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 280 160" fill="none">
                <rect width="280" height="160" fill="#1a2535"/>
                <line x1="0" y1="90" x2="280" y2="90" stroke="#243040" strokeWidth="5"/>
                <line x1="0" y1="55" x2="280" y2="55" stroke="#243040" strokeWidth="3"/>
                <line x1="85" y1="0" x2="85" y2="160" stroke="#243040" strokeWidth="4"/>
                <line x1="190" y1="0" x2="190" y2="160" stroke="#243040" strokeWidth="4"/>
                <path d="M35 132 Q75 112 108 90 Q148 64 190 44 Q222 30 252 22" stroke="rgba(226,0,26,0.18)" strokeWidth="11" strokeLinecap="round"/>
                <path d="M35 132 Q75 112 108 90 Q148 64 190 44 Q222 30 252 22" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
                {[[108,90],[190,44]].map(([cx,cy],i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="7.5" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
                    <text x={cx} y={cy+3.5} textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="sans-serif">⚡</text>
                  </g>
                ))}
                <circle cx="35" cy="132" r="5" fill="#22c55e"/>
                <circle cx="35" cy="132" r="9" fill="rgba(34,197,94,0.2)"/>
                <circle cx="252" cy="22" r="5" fill="#e2001a"/>
                <circle cx="252" cy="22" r="9" fill="rgba(226,0,26,0.2)"/>
                <text x="46" y="129" fill="#64748b" fontSize="9" fontFamily="sans-serif">Paris</text>
                <text x="214" y="19" fill="#64748b" fontSize="9" fontFamily="sans-serif">Amsterdam</text>
                <rect x="0" y="126" width="280" height="34" fill="rgba(8,14,26,0.85)"/>
                <text x="14" y="140" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">variantId</text>
                <text x="14" y="152" fill="#94a3b8" fontSize="7" fontFamily="monospace">54B969E8-E28D-11EC-…</text>
                <text x="160" y="140" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">currentCharge</text>
                <text x="160" y="152" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="700">25 kWh</text>
              </svg>
            )}
            snippet={`// LDEVR with registered vehicle model
const route = await calculateRoute({
  locations: await Promise.all(
    ['Paris, FR', 'Amsterdam, NL'].map(geocodeOne)
  ),
  vehicle: {
    engineType: 'electric',
    model: {
      // Registered vehicle variant — battery capacity,
      // connector types and consumption curves auto-resolved
      variantId: '54B969E8-E28D-11EC-8FEA-0242AC120002',
    },
    state: {
      currentChargeInkWh: 25,
    },
    preferences: {
      chargingPreferences: {
        minChargeAtDestinationInkWh: 5,
        minChargeAtChargingStopsInkWh: 5,
      },
    },
  },
});
routingModule.showRoutes(route);`}
          />

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-custom-charging-stops"
            title="Custom charging stop icons"
            description="Munich to Paris EV route with charging stops rendered using custom SVG icons mapped by charger speed — slow, regular and fast."
            tags={[
              { label: 'Customisation', variant: 'custom' },
              { label: 'Electric Vehicles', variant: 'feature' },
              { label: 'Web', variant: 'platform' },
            ]}
            Thumb={() => (
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 280 160" fill="none">
                <rect width="280" height="160" fill="#1a2535"/>
                <line x1="0" y1="85" x2="280" y2="85" stroke="#243040" strokeWidth="5"/>
                <line x1="100" y1="0" x2="100" y2="160" stroke="#243040" strokeWidth="4"/>
                <line x1="185" y1="0" x2="185" y2="160" stroke="#243040" strokeWidth="4"/>
                <path d="M28 138 Q70 118 103 96 Q138 72 175 52 Q210 35 255 20" stroke="rgba(226,0,26,0.18)" strokeWidth="11" strokeLinecap="round"/>
                <path d="M28 138 Q70 118 103 96 Q138 72 175 52 Q210 35 255 20" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Slow charger */}
                <rect x="96" y="88" width="14" height="18" rx="2" fill="#0d1117" stroke="#94a3b8" strokeWidth="1.2"/>
                <text x="103" y="101" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">⚡</text>
                {/* Regular charger */}
                <rect x="131" y="68" width="14" height="18" rx="2" fill="#0d1117" stroke="#3b82f6" strokeWidth="1.2"/>
                <text x="138" y="81" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="sans-serif">⚡</text>
                {/* Fast charger */}
                <rect x="171" y="44" width="14" height="18" rx="2" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
                <text x="178" y="57" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="sans-serif">⚡</text>
                <circle cx="28" cy="138" r="5" fill="#22c55e"/>
                <circle cx="28" cy="138" r="9" fill="rgba(34,197,94,0.2)"/>
                <circle cx="255" cy="20" r="5" fill="#e2001a"/>
                <circle cx="255" cy="20" r="9" fill="rgba(226,0,26,0.2)"/>
                <text x="38" y="135" fill="#64748b" fontSize="9" fontFamily="sans-serif">Munich</text>
                <text x="216" y="17" fill="#64748b" fontSize="9" fontFamily="sans-serif">Paris</text>
                <rect x="0" y="126" width="280" height="34" fill="rgba(8,14,26,0.85)"/>
                <circle cx="16" cy="136" r="4" fill="#0d1117" stroke="#94a3b8" strokeWidth="1.2"/>
                <text x="24" y="139" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">slow</text>
                <circle cx="56" cy="136" r="4" fill="#0d1117" stroke="#3b82f6" strokeWidth="1.2"/>
                <text x="64" y="139" fill="#3b82f6" fontSize="7" fontFamily="sans-serif">regular</text>
                <circle cx="106" cy="136" r="4" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
                <text x="114" y="139" fill="#22c55e" fontSize="7" fontFamily="sans-serif">fast / ultra-fast</text>
                <text x="14" y="152" fill="#475569" fontSize="7" fontFamily="monospace">icon.mapping.basedOn: 'chargingSpeed'</text>
              </svg>
            )}
            snippet={`// Map custom SVG icons to charger speed
const routingModule = await RoutingModule.get(map, {
  chargingStops: {
    // Overlay charging duration on the marker
    text: {
      title: ['format', ['get', 'chargingDuration'],
        { 'text-color': '#243882' }],
    },
    icon: {
      customIcons: [
        { id: 'slow-charger',    image: chargerSlowSVG },
        { id: 'regular-charger', image: chargerRegularSVG },
        { id: 'fast-charger',    image: chargerFastSVG },
      ],
      // 'chargingSpeed' comes from the LDEVR API response
      mapping: {
        basedOn: 'chargingSpeed',
        value: {
          slow:         'slow-charger',
          regular:      'regular-charger',
          fast:         'fast-charger',
          'ultra-fast': 'fast-charger',
        },
      },
    },
  },
});`}
          />

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-detailed-vehicle"
            title="LDEVR with detailed vehicle"
            description="Paris to Amsterdam EV route with a fully specified vehicle — battery capacity, connector types, consumption curves and auxiliary power load."
            tags={[
              { label: 'Getting Started', variant: 'start' },
              { label: 'Electric Vehicles', variant: 'feature' },
              { label: 'Web', variant: 'platform' },
            ]}
            Thumb={() => (
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 280 160" fill="none">
                <rect width="280" height="160" fill="#1a2535"/>
                <line x1="0" y1="88" x2="280" y2="88" stroke="#243040" strokeWidth="5"/>
                <line x1="88" y1="0" x2="88" y2="160" stroke="#243040" strokeWidth="4"/>
                <line x1="192" y1="0" x2="192" y2="160" stroke="#243040" strokeWidth="4"/>
                <path d="M35 132 Q76 112 108 90 Q148 64 190 44 Q222 30 250 22" stroke="rgba(226,0,26,0.18)" strokeWidth="11" strokeLinecap="round"/>
                <path d="M35 132 Q76 112 108 90 Q148 64 190 44 Q222 30 250 22" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
                {[[108,90],[190,44]].map(([cx,cy],i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="7.5" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
                    <text x={cx} y={cy+3.5} textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="sans-serif">⚡</text>
                  </g>
                ))}
                <circle cx="35" cy="132" r="5" fill="#22c55e"/>
                <circle cx="35" cy="132" r="9" fill="rgba(34,197,94,0.2)"/>
                <circle cx="250" cy="22" r="5" fill="#e2001a"/>
                <circle cx="250" cy="22" r="9" fill="rgba(226,0,26,0.2)"/>
                {/* Vehicle spec panel */}
                <rect x="156" y="68" width="118" height="60" rx="4" fill="rgba(8,14,26,0.92)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8"/>
                <text x="165" y="80" fill="#475569" fontSize="6.5" fontFamily="sans-serif">Vehicle spec</text>
                {[
                  ['maxCharge','77.4 kWh'],
                  ['connectors','CCS, Type2'],
                  ['auxPower','1.7 kW'],
                  ['efficiency','~6.5 km/kWh'],
                ].map(([k,v],i) => (
                  <g key={k}>
                    <text x="165" y={90+i*10} fill="#64748b" fontSize="6.5" fontFamily="monospace">{k}</text>
                    <text x="230" y={90+i*10} fill="#94a3b8" fontSize="6.5" fontFamily="monospace">{v}</text>
                  </g>
                ))}
              </svg>
            )}
            snippet={`// Full vehicle specification — no model variantId needed
const route = await calculateRoute({
  locations: await Promise.all(
    ['Paris, FR', 'Amsterdam, NL'].map(geocodeOne)
  ),
  vehicle: {
    engineType: 'electric',
    // Detailed spec instead of model ID
    maxChargeInkWh: 77.4,
    connectorSet: ['IEC62196Type2Outlet', 'IEC62196Type2CableAttached'],
    auxiliaryPowerInkW: 1.7,
    // Speed-based consumption table (kWh per 100 km)
    consumptionInkWhPer100km: [
      { speed: 50,  consumption: 14.5 },
      { speed: 80,  consumption: 17.0 },
      { speed: 120, consumption: 23.2 },
    ],
    state: { currentChargeInkWh: 20 },
    preferences: {
      chargingPreferences: {
        minChargeAtDestinationInkWh: 5,
        minChargeAtChargingStopsInkWh: 5,
      },
    },
  },
});`}
          />

        </div>
      </div>

      {/* Base URL + auth */}
      <div className="zone">
        <h2 className="sh" id="ldevr-base">Base URL &amp; authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {[
            { label: 'Endpoint', content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{'{locations}'}/json</code> },
            { label: 'Auth', content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>?key=</code> query parameter or <code style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>Authorization: apiKey</code> header</span> },
            { label: 'Method', content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>POST — route points in the URL path; all vehicle and EV parameters in the JSON request body</span> },
            { label: 'Plan tier', content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Developer, Flex, Enterprise — not included in the free Routing API quota</span> },
          ].map(({ label, content }, i, arr) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="zone">
        <h2 className="sh" id="ldevr-when">When to use this API</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <div style={{ padding: '16px', borderRadius: 20, border: '1px solid #22c55e44', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#22c55e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>✅ Use LDEVR when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {[
                'The trip exceeds the vehicle\'s single-charge range',
                'You want the API to select charging stops automatically',
                'You need station brand, power, and connector data in the response',
                'You are building an IVI or companion app with charging UX',
                'You use the TomTom Navigation SDK and want charging stop cards',
              ].map(i => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>›</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '16px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Use Routing API instead when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {[
                'The trip fits within a single charge',
                'You only need to model battery consumption, not plan stops',
                'You are routing a combustion or hybrid vehicle',
                'You need Orbis Maps v2 compatibility today',
                'You want alternatives, truck routing, or bicycle/pedestrian modes',
              ].map(i => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: 'var(--muted)', flexShrink: 0 }}>›</span> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Platform availability */}
      <div className="zone">
        <h2 className="sh" id="ldevr-platforms">Platform availability</h2>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', padding: '20px', borderRadius: 20, border: '2px solid #e2001a', background: 'var(--bg)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 14, right: 14, fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#e2001a22', color: '#e2001a' }}>Available</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>TomTom Maps</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)', marginBottom: 12 }}>Service Version 1</div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--mid)', background: '#0d1117', padding: '8px 12px', borderRadius: 6, marginBottom: 14 }}>
              api.tomtom.com/routing/1/calculateLongDistanceEVRoute/
            </div>
            {[
              'Full battery consumption model',
              'Connector type matching (CCS, CHAdeMO, GB/T…)',
              'Minimum charger power filter',
              'Batch EV routing (up to 700 parallel)',
              'Kotlin SDK + Android Navigation SDK',
              '~215 countries',
            ].map(f => (
              <div key={f} style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 3 }}>
                <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
          </div>
          <div style={{ flex: '1 1 260px', padding: '20px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', opacity: 0.7 }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Orbis Maps</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)', marginBottom: 12 }}>Service Version 2</div>
            <Callout type="warning" title="Not yet available">
              EV routing is planned for Orbis Maps v2 in Q3 2025. All EV routing should use the TomTom Maps (v1) endpoint.
            </Callout>
          </div>
        </div>
      </div>

      {/* Ready to build */}
      <div className="zone">
        <h2 className="sh" id="ldevr-start">Ready to build?</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          The Quick Start walks through authentication and your first EV route request — with a working cURL example and Kotlin SDK snippet — in under 5 minutes.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('ldevr-first-route')}
          >
            Quick Start
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route')}>
            Calculate EV Route reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-battery-model')}>
            Battery &amp; consumption model
          </button>
        </div>
      </div>
    </div>
  );
}
