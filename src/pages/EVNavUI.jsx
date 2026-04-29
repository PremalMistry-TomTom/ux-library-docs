import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const NAV_UI_APIS = [
  { name: 'Reachable Range API',  type: 'REST API',    description: 'Calculate the reachable isoline for the range ring overlay — accounts for battery level, consumption model, and road network.', url: 'https://docs.tomtom.com/routing-api/documentation/extended-routing/reachable-range' },
  { name: 'Navigation SDK — VehicleProvider', type: 'Android SDK', description: 'SoC strip, range ring, and horizon charging stop are all driven by the live charge level maintained in VehicleProvider.', url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
  { name: 'Long Distance EV Routing API', type: 'REST API', description: 'Powers the horizon panel charging stop card — re-queries when SoC drops below the reroute threshold.', url: 'https://docs.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-maps/long-distance-ev-routing' },
];

/* ─── SoC state data ─────────────────────────────────────────────────────────── */
const SOC_STATES = {
  healthy: { pct: 76, rangeKm: 218, color: '#3fb950', label: 'Healthy', nextStop: null,      warning: false },
  low:     { pct: 21, rangeKm: 60,  color: '#d29922', label: 'Low',     nextStop: 'Ionity · 18 km', warning: false },
  critical:{ pct: 8,  rangeKm: 23,  color: '#f85149', label: 'Critical',nextStop: 'Ionity · 18 km', warning: true  },
};

/* ─── SoC indicator strip mock ───────────────────────────────────────────────── */
function SoCStrip({ state }) {
  const s = SOC_STATES[state];
  return (
    <div style={{ background: '#0f1117', borderRadius: 10, padding: '10px 14px', border: '1px solid #21262d', width: 280 }}>
      {/* Battery bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: '#21262d', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 5, transition: 'all 0.4s ease' }} />
        </div>
        {/* Battery terminal nub */}
        <div style={{ width: 5, height: 6, background: '#21262d', borderRadius: '0 2px 2px 0', flexShrink: 0 }} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, lineHeight: 1, transition: 'color 0.4s' }}>{s.pct}%</span>
          <span style={{ fontSize: '0.7rem', color: '#8b949e', marginLeft: 6 }}>{s.rangeKm} km range</span>
        </div>
        {s.nextStop && (
          <div style={{ fontSize: '0.68rem', color: '#8b949e', textAlign: 'right' }}>
            <div style={{ color: s.color }}>⚡ Next stop</div>
            <div>{s.nextStop}</div>
          </div>
        )}
      </div>

      {/* Low battery warning banner */}
      {s.warning && (
        <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8rem' }}>⚠️</span>
          <span style={{ fontSize: '0.68rem', color: '#f85149', lineHeight: 1.4 }}>Low battery — route recalculated to nearest charger</span>
        </div>
      )}
    </div>
  );
}

/* ─── Range ring (reachable range) mock ──────────────────────────────────────── */
function RangeRingMock({ state }) {
  const s = SOC_STATES[state];
  const rings = { healthy: 0.78, low: 0.28, critical: 0.12 };
  const r = rings[state];
  const cx = 140, cy = 110;
  const maxR = 90;
  const ringR = maxR * r;
  // Simple map grid lines
  return (
    <div style={{ background: '#1a2235', borderRadius: 10, border: '1px solid #21262d', overflow: 'hidden', width: 280 }}>
      <svg width="280" height="220" style={{ display: 'block' }}>
        {/* Map background tiles */}
        <rect width="280" height="220" fill="#1a2235" />
        {/* Grid */}
        {[40,80,120,160,200,240].map(x => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={220} stroke="#1e2d47" strokeWidth="1"/>)}
        {[40,80,120,160,200].map(y => <line key={`h${y}`} x1={0} y1={y} x2={280} y2={y} stroke="#1e2d47" strokeWidth="1"/>)}
        {/* Roads */}
        <path d="M 0 110 Q 80 100 140 110 Q 200 120 280 108" stroke="#253352" strokeWidth="4" fill="none"/>
        <path d="M 140 0 Q 145 60 140 110 Q 135 160 138 220" stroke="#253352" strokeWidth="3" fill="none"/>

        {/* Reachable range polygon (simplified circle) */}
        <circle cx={cx} cy={cy} r={ringR}
          fill={`${s.color}14`}
          stroke={s.color}
          strokeWidth="1.5"
          strokeDasharray={state === 'critical' ? '4 3' : 'none'}
          style={{ transition: 'all 0.5s ease' }}
        />
        {/* Range label */}
        <text x={cx} y={cy - ringR - 6} textAnchor="middle" fontSize="10" fill={s.color} style={{ transition: 'all 0.5s ease' }}>
          {s.rangeKm} km
        </text>

        {/* Vehicle marker */}
        <circle cx={cx} cy={cy} r={8} fill="#C82020" />
        <circle cx={cx} cy={cy} r={4} fill="#fff" />

        {/* Charging station pins (only visible within range) */}
        {state !== 'critical' && (
          <>
            <circle cx={185} cy={75} r={7} fill="#3fb950" />
            <text x={185} y={79} textAnchor="middle" fontSize="8" fill="#fff">⚡</text>
            <text x={185} y={92} textAnchor="middle" fontSize="9" fill="#8b949e">Ionity</text>
          </>
        )}
        {state === 'healthy' && (
          <>
            <circle cx={95}  cy={155} r={7} fill="#3fb950" />
            <text x={95}  y={159} textAnchor="middle" fontSize="8" fill="#fff">⚡</text>
            <text x={95}  y={172} textAnchor="middle" fontSize="9" fill="#8b949e">Fastned</text>
            <circle cx={220} cy={135} r={7} fill="#d29922" />
            <text x={220} y={139} textAnchor="middle" fontSize="8" fill="#fff">⚡</text>
            <text x={220} y={152} textAnchor="middle" fontSize="9" fill="#8b949e">ChargePoint</text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── Horizon panel mock with charging stop ───────────────────────────────────── */
function HorizonMock({ state }) {
  const s = SOC_STATES[state];
  const hasStop = state !== 'healthy';
  return (
    <div style={{ background: '#0f1117', borderRadius: 10, border: '1px solid #21262d', padding: '10px 14px', width: 280 }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: '0.64rem', color: '#8b949e' }}>Lyon</span>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#21262d', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '42%', background: '#C82020', borderRadius: 2 }} />
          {hasStop && (
            <div style={{ position: 'absolute', top: -4, left: '58%', width: 12, height: 12, borderRadius: '50%', background: s.color, border: '2px solid #0f1117', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px' }}>⚡</div>
          )}
        </div>
        <span style={{ fontSize: '0.64rem', color: '#8b949e' }}>Marseille</span>
      </div>

      {/* Upcoming events strip */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {/* NIP */}
        <div style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 7, background: '#161b22', border: '1px solid #21262d', minWidth: 70 }}>
          <div style={{ fontSize: '0.6rem', color: '#8b949e', marginBottom: 2 }}>1.2 km</div>
          <div style={{ fontSize: '0.75rem', color: '#e6edf3', fontWeight: 700 }}>→ A7</div>
        </div>

        {/* Speed */}
        <div style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 7, background: '#161b22', border: '1px solid #21262d' }}>
          <div style={{ fontSize: '0.6rem', color: '#8b949e', marginBottom: 2 }}>Speed</div>
          <div style={{ fontSize: '0.75rem', color: '#e6edf3', fontWeight: 700 }}>130</div>
        </div>

        {/* Charging stop card — only shown when SoC is low */}
        {hasStop && (
          <div style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 7, background: `${s.color}18`, border: `1px solid ${s.color}50`, minWidth: 90 }}>
            <div style={{ fontSize: '0.6rem', color: s.color, marginBottom: 2 }}>⚡ Charge · 18 km</div>
            <div style={{ fontSize: '0.72rem', color: '#e6edf3', fontWeight: 700 }}>Ionity</div>
            <div style={{ fontSize: '0.58rem', color: '#8b949e' }}>{s.pct}% → 80%</div>
          </div>
        )}

        {/* ETA */}
        <div style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 7, background: '#161b22', border: '1px solid #21262d' }}>
          <div style={{ fontSize: '0.6rem', color: '#8b949e', marginBottom: 2 }}>ETA</div>
          <div style={{ fontSize: '0.75rem', color: '#e6edf3', fontWeight: 700 }}>17:45</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Code snippets ─────────────────────────────────────────────────────────── */
const CODE_SOC_PANEL = `// Show/hide the SoC strip via EVNavigationConfiguration
val evConfig = EVNavigationConfiguration.Builder()
    .showStateOfCharge(true)           // SoC percentage + bar
    .showRemainingRange(true)          // Estimated km remaining
    .showNextChargingStop(true)        // Stop name + distance when SoC is low
    .lowBatteryThresholdPercent(25)    // Threshold to activate warnings
    .criticalBatteryThresholdPercent(10) // Threshold for critical re-route
    .build()

navigationView.setEVConfiguration(evConfig)`;

const CODE_RANGE_RING = `// Enable the reachable range overlay
val rangeConfig = ReachableRangeConfiguration.Builder()
    .enabled(true)
    .showChargersWithinRange(true)     // Pin chargers inside the isoline
    .updateIntervalMs(30_000)          // Refresh ring every 30 s
    .build()

mapView.setReachableRangeConfiguration(rangeConfig)

// Listen for range updates
navigationSession.addReachableRangeUpdatedListener { rangeResult ->
    // rangeResult.polygon → the isoline boundary coordinates
    // rangeResult.reachableChargingStations → stations inside range
}`;

const CODE_REROUTE = `// Configure low-battery re-routing behaviour
val rerouteConfig = EVRerouteConfiguration.Builder()
    .rerouteOnLowBattery(true)
    .rerouteThresholdPercent(15)       // Trigger re-route below 15% SoC
    .preferFastChargers(true)          // Prefer 50 kW+ on emergency route
    .showUserConfirmationDialog(false) // Auto-reroute without prompt
    .build()

navigationSession.setEVRerouteConfiguration(rerouteConfig)`;

export default function EVNavUI() {
  const { t } = useTranslation('ev');
  const [socState, setSocState] = useState('healthy');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('navUI.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('navUI.intro')}</div>

      <ApiLinks items={NAV_UI_APIS} />

      {/* State selector */}
      <div className="zone">
        <h2 className="sh" id="evui-soc">{t('navUI.soc.heading')}</h2>
        <p className="body">{t('navUI.soc.body')}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {Object.entries(SOC_STATES).map(([key, s]) => (
            <button key={key} onClick={() => setSocState(key)} style={{
              padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
              background: socState === key ? s.color : 'var(--white)',
              color: socState === key ? (key === 'low' ? '#000' : '#fff') : 'var(--black)',
              border: socState === key ? `1.5px solid ${s.color}` : '1.5px solid var(--border)',
              transition: 'all 0.15s',
            }}>
              {s.label} ({s.pct}%)
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{t('navUI.soc.stripLabel')}</div>
            <SoCStrip state={socState} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{t('navUI.soc.horizonLabel')}</div>
            <HorizonMock state={socState} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <CodeBlock language="kotlin" code={CODE_SOC_PANEL} />
        </div>
      </div>

      {/* Reachable range ring */}
      <div className="zone">
        <h2 className="sh" id="evui-range">{t('navUI.rangeRing.heading')}</h2>
        <p className="body">{t('navUI.rangeRing.body')}</p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{t('navUI.rangeRing.mapLabel')}</div>
          <RangeRingMock state={socState} />
          <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 8 }}>{t('navUI.rangeRing.hint')}</div>
        </div>

        <CodeBlock language="kotlin" code={CODE_RANGE_RING} />
        <Callout type="info">{t('navUI.rangeRing.callout')}</Callout>
      </div>

      {/* Low battery re-routing */}
      <div className="zone">
        <h2 className="sh" id="evui-reroute">{t('navUI.reroute.heading')}</h2>
        <p className="body">{t('navUI.reroute.body')}</p>
        <table className="prop-table">
          <thead>
            <tr><th>{t('navUI.reroute.colTrigger')}</th><th>{t('navUI.reroute.colBehaviour')}</th></tr>
          </thead>
          <tbody>
            {[
              [t('navUI.reroute.t1'), t('navUI.reroute.b1')],
              [t('navUI.reroute.t2'), t('navUI.reroute.b2')],
              [t('navUI.reroute.t3'), t('navUI.reroute.b3')],
              [t('navUI.reroute.t4'), t('navUI.reroute.b4')],
            ].map(([trigger, behaviour]) => (
              <tr key={trigger}><td style={{ fontWeight: 500 }}>{trigger}</td><td style={{ color: 'var(--mid)' }}>{behaviour}</td></tr>
            ))}
          </tbody>
        </table>
        <CodeBlock language="kotlin" code={CODE_REROUTE} />
        <Callout type="warn">{t('navUI.reroute.callout')}</Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
