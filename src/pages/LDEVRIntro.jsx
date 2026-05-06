import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

/* ─── Hero illustration ──────────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="520" height="260" fill="#0d1117"/>
      {/* Road / route line halo */}
      <path d="M 40 200 C 100 200 120 130 180 120 C 240 110 260 160 320 140 C 370 125 400 80 470 80" stroke="#e2001a" strokeWidth="8" fill="none" opacity="0.12"/>
      {/* Road / route line */}
      <path d="M 40 200 C 100 200 120 130 180 120 C 240 110 260 160 320 140 C 370 125 400 80 470 80" stroke="#e2001a" strokeWidth="2.5" fill="none"/>

      {/* Origin marker */}
      <circle cx="40" cy="200" r="8" fill="#e2001a"/>
      <circle cx="40" cy="200" r="4" fill="white"/>

      {/* Charging stop 1 */}
      <circle cx="180" cy="120" r="13" fill="#0d1117" stroke="#22c55e" strokeWidth="2"/>
      <text x="180" y="125" textAnchor="middle" fontSize="11" fill="#22c55e" fontFamily="system-ui" fontWeight="700">⚡</text>
      <rect x="148" y="96" width="64" height="16" rx="3" fill="#22c55e" opacity="0.15"/>
      <text x="180" y="108" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">Fastned · 45 min</text>

      {/* Battery arc 1 — arriving low */}
      <path d="M 100 185 Q 140 165 178 130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" fill="none" opacity="0.6"/>
      <text x="110" y="177" fontSize="7.5" fill="#f59e0b" fontFamily="monospace" opacity="0.9">12%</text>

      {/* Battery arc 2 — departing charged */}
      <path d="M 182 110 Q 240 90 318 140" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <text x="242" y="92" fontSize="7.5" fill="#22c55e" fontFamily="monospace" opacity="0.9">78%</text>

      {/* Charging stop 2 */}
      <circle cx="320" cy="140" r="13" fill="#0d1117" stroke="#22c55e" strokeWidth="2"/>
      <text x="320" y="145" textAnchor="middle" fontSize="11" fill="#22c55e" fontFamily="system-ui" fontWeight="700">⚡</text>
      <rect x="290" y="116" width="60" height="16" rx="3" fill="#22c55e" opacity="0.15"/>
      <text x="320" y="128" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">Ionity · 28 min</text>

      {/* Battery arc 3 — low again */}
      <path d="M 325 130 Q 390 110 465 83" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" fill="none" opacity="0.6"/>
      <text x="388" y="103" fontSize="7.5" fill="#f59e0b" fontFamily="monospace" opacity="0.9">18%</text>

      {/* Destination marker */}
      <circle cx="470" cy="80" r="8" fill="#e2001a"/>
      <circle cx="470" cy="80" r="4" fill="white"/>

      {/* City labels */}
      <text x="34" y="220" fontSize="9" fill="#64748b" fontFamily="system-ui" textAnchor="middle">Amsterdam</text>
      <text x="470" y="68" fontSize="9" fill="#64748b" fontFamily="system-ui" textAnchor="middle">Paris</text>

      {/* Battery bar */}
      <rect x="30" y="235" width="460" height="6" rx="3" fill="#1e293b"/>
      <rect x="30" y="235" width="110" height="6" rx="3" fill="#22c55e"/>
      <rect x="158" y="235" width="4" height="6" fill="#0d1117"/>
      <rect x="162" y="235" width="110" height="6" rx="0" fill="#22c55e"/>
      <rect x="272" y="235" width="4" height="6" fill="#0d1117"/>
      <rect x="276" y="235" width="120" height="6" rx="0" fill="#22c55e"/>

      {/* Legend */}
      <circle cx="32" cy="252" r="3" fill="#22c55e"/>
      <text x="40" y="256" fontSize="8" fill="#64748b" fontFamily="monospace">Driving</text>
      <circle cx="88" cy="252" r="3" fill="#22c55e" stroke="#22c55e"/>
      <text x="96" y="256" fontSize="8" fill="#64748b" fontFamily="monospace">Charging stop</text>

      {/* Title */}
      <text x="260" y="22" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="system-ui" fontWeight="600">Long Distance EV Route — Amsterdam → Paris</text>
      <text x="260" y="38" textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">2 charging stops · 503 km · 6h 54 min total</text>
    </svg>
  );
}

/* ─── Endpoint thumbnail ─────────────────────────────────────────────────────── */
function ThumbEVRoute() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
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

      <Callout type="info" title="Separate from the Routing API">
        Long Distance EV Routing is a standalone product with its own endpoint, quota, and pricing.
        For single-charge EV routing with a consumption model, use the{' '}
        <button
          onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}
          style={{ background: 'none', border: 'none', padding: 0, color: '#e2001a', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: 'inherit' }}
        >
          Routing API — Calculate Route
        </button>.
      </Callout>

      {/* Hero illustration */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#0d1117', height: 260, marginBottom: 36 }}>
        <HeroIllustration />
      </div>

      {/* The endpoint */}
      <div className="zone">
        <h2 className="sh" id="ldevr-endpoint">The endpoint</h2>
        <div
          onClick={() => onNavigate?.('ldevr-calculate-route')}
          style={{ cursor: 'pointer', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', display: 'grid', gridTemplateColumns: '200px 1fr', transition: 'box-shadow 0.15s, border-color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <div style={{ background: '#0d1117', overflow: 'hidden', padding: 8 }}>
            <ThumbEVRoute />
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(88,166,255,0.12)', color: '#58a6ff', fontFamily: 'monospace', letterSpacing: '0.04em' }}>POST</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--black)', marginBottom: 4 }}>Calculate EV Route</div>
            <code style={{ display: 'block', fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 10 }}>
              /routing/1/calculateLongDistanceEVRoute/{'{locations}'}/json
            </code>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>
              Plan a multi-leg EV route with automatic charging stop selection. Returns a complete itinerary including
              station names, connector details, dwell times, and battery state at every leg boundary.
            </div>
            <div style={{ marginTop: 12, fontSize: '0.625rem', color: 'var(--red)', fontWeight: 600 }}>
              View full reference →
            </div>
          </div>
        </div>
      </div>

      {/* Key capabilities */}
      <div className="zone">
        <h2 className="sh" id="ldevr-capabilities">Key capabilities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            {
              icon: '🔋',
              title: 'Battery state modelling',
              body: 'Simulates charge level along every road segment — accounting for speed, elevation, auxiliary power draw, and regenerative braking efficiency.',
            },
            {
              icon: '⚡',
              title: 'Automatic stop selection',
              body: 'Searches TomTom\'s live charging station database and picks the combination of stops that minimises total journey time, including dwell at each charger.',
            },
            {
              icon: '🔌',
              title: 'Connector matching',
              body: 'Pass the connectors your vehicle supports (CCS, CHAdeMO, GB/T, Tesla…) and only compatible stations are considered as candidates.',
            },
            {
              icon: '🗺️',
              title: 'Traffic-aware energy',
              body: 'Real-time and historic traffic affects modelled consumption. Stop-and-go driving uses more energy than free-flow, and the route adjusts accordingly.',
            },
          ].map(f => (
            <div key={f.title} style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Base URL + auth */}
      <div className="zone">
        <h2 className="sh" id="ldevr-base">Base URL &amp; authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { label: 'Endpoint', content: <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--black)' }}>POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{'{locations}'}/json</code> },
            { label: 'Auth', content: <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>API key via <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>?key=</code> query parameter or <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>Authorization: apiKey</code> header</span> },
            { label: 'Method', content: <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>POST — route points in the URL path; all vehicle and EV parameters in the JSON request body</span> },
            { label: 'Plan tier', content: <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>Developer, Flex, Enterprise — not included in the free Routing API quota</span> },
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
          <div style={{ padding: '16px', borderRadius: 10, border: '1px solid #22c55e44', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#22c55e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>✅ Use LDEVR when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {[
                'The trip exceeds the vehicle\'s single-charge range',
                'You want the API to select charging stops automatically',
                'You need station brand, power, and connector data in the response',
                'You are building an IVI or companion app with charging UX',
                'You use the TomTom Navigation SDK and want charging stop cards',
              ].map(i => (
                <li key={i} style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>›</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Use Routing API instead when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {[
                'The trip fits within a single charge',
                'You only need to model battery consumption, not plan stops',
                'You are routing a combustion or hybrid vehicle',
                'You need Orbis Maps v2 compatibility today',
                'You want alternatives, truck routing, or bicycle/pedestrian modes',
              ].map(i => (
                <li key={i} style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
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
          <div style={{ flex: '1 1 260px', padding: '20px', borderRadius: 12, border: '2px solid #e2001a', background: 'var(--bg)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 14, right: 14, fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: '#e2001a22', color: '#e2001a' }}>Available</div>
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
              <div key={f} style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 3 }}>
                <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
          </div>
          <div style={{ flex: '1 1 260px', padding: '20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', opacity: 0.7 }}>
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
