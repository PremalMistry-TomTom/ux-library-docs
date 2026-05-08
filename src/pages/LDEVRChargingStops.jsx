import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Interactive calculator ─────────────────────────────────────────────────── */
const M = {
  bg: '#0d1117', card: '#161b22', card2: '#1c2333', line: '#21262d',
  text: '#e6edf3', dim: '#8b949e', blue: '#58a6ff', green: '#3fb950',
  amber: '#d29922', red: '#f85149',
};

function computeStops(minAtStopPct, minAtDestPct) {
  const battKwh = 75, totalKm = 679, startKwh = 45;
  const minStop = (minAtStopPct / 100) * battKwh;
  const minDest = (minAtDestPct / 100) * battKwh;
  const targetKwh = battKwh * 0.80;
  const chargeMins = kWh => Math.round((kWh / 150) * 60);

  const stops = [];
  let current = startKwh, dist = 0;
  while (dist < totalKm) {
    const usable = current - minStop;
    if (usable <= 0) break;
    const legKm = Math.min(usable / 0.18, totalKm - dist);
    current -= legKm * 0.18;
    dist += legKm;
    if (dist >= totalKm) break;
    const needed = targetKwh - current;
    stops.push({ dist: Math.round(dist), arrPct: Math.round((current / battKwh) * 100), depPct: Math.round((targetKwh / battKwh) * 100), kWh: Math.round(needed), mins: chargeMins(needed) });
    current = targetKwh;
  }
  const arrPct = Math.round((current / battKwh) * 100);
  const chargeMinsTotal = stops.reduce((s, st) => s + st.mins, 0);
  const driveMins = Math.round((679 / 110) * 60);
  return { stops, arrPct, chargeMinsTotal, totalMins: driveMins + chargeMinsTotal };
}

const STATION_NAMES = ['Ionity Reims', 'Fastned Lyon', 'Ionity Montpellier', 'bp pulse Nîmes'];

function StopCalculator() {
  const [minStop, setMinStop] = useState(15);
  const [minDest, setMinDest] = useState(15);
  const { stops, arrPct, chargeMinsTotal, totalMins } = computeStops(minStop, minDest);
  const hrs = Math.floor(totalMins / 60), mins = totalMins % 60;
  const socColor = p => p >= 30 ? M.green : p >= 15 ? M.amber : M.red;

  return (
    <div>
      <div className="grid-2-col" style={{ marginBottom: 20 }}>
        {[['Min battery at charging stop', minStop, setMinStop], ['Min battery at destination', minDest, setMinDest]].map(([label, val, set]) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6' }}>{val}%</span>
            </div>
            <input type="range" min={5} max={35} step={5} value={val} onChange={e => set(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)', marginTop: 2 }}><span>5%</span><span>35%</span></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          ['🛑', 'Charging stops', `${stops.length}`, stops.length <= 2 ? M.green : M.amber],
          ['⏱', 'Total charging', `${chargeMinsTotal} min`, chargeMinsTotal < 60 ? M.green : M.dim],
          ['🕐', 'Journey time', `${hrs}h ${mins}m`, M.blue],
          ['🔋', 'Arrival SoC', `${arrPct}%`, socColor(arrPct)],
        ].map(([icon, label, val, color]) => (
          <div key={label} style={{ padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', flex: '1 1 120px' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: 2 }}>{icon}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: M.card, borderRadius: 20, border: `1px solid ${M.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: M.text }}>Paris → Marseille · 679 km</span>
          <span style={{ fontSize: '0.875rem', color: M.dim }}>🔋 75 kWh · start 60%</span>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: '0.875rem', color: M.dim }}>
            <span>📍</span><span>Paris · 🔋 60%</span>
          </div>
          {stops.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 14, marginBottom: 4 }}>
                <div style={{ width: 1, height: 20, background: M.line }} />
                <span style={{ fontSize: '0.875rem', color: M.dim }}>{i === 0 ? s.dist : s.dist - stops[i-1].dist} km</span>
              </div>
              <div style={{ background: M.card2, borderRadius: 20, padding: '8px 12px', marginBottom: 8, border: `1px solid ${M.line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: M.text }}>🔌 {STATION_NAMES[i] || `Stop ${i+1}`}</span>
                  <span style={{ fontSize: '0.875rem', color: M.dim }}>{s.mins} min</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: M.dim }}>
                  🔋 <span style={{ color: socColor(s.arrPct) }}>{s.arrPct}%</span>
                  {' → '}<span style={{ color: M.blue }}>{s.depPct}%</span>
                  {' · +' + s.kWh + ' kWh'}
                </span>
              </div>
            </div>
          ))}
          {stops.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 14, marginBottom: 8 }}>
              <div style={{ width: 1, height: 20, background: M.line }} />
              <span style={{ fontSize: '0.875rem', color: M.dim }}>{679 - (stops[stops.length-1]?.dist || 0)} km</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: M.dim }}>
            <span>🏁</span><span>Marseille · 🔋 <span style={{ color: socColor(arrPct) }}>{arrPct}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTO = `# Automatic charging stop insertion (default)
# LDEVR selects stop locations and timing to minimise total trip time.

POST /routing/1/calculateLongDistanceEVRoute/52.5074,13.4251:48.8566,2.3522/json
  ?key=YOUR_API_KEY
  &vehicleEngineType=electric
  &currentChargeInkWh=45
  &maxChargeInkWh=75
  &minChargeAtDestinationInkWh=7.5       # 10% of 75 kWh
  &minChargeAtChargingStopsInkWh=11.25   # 15% of 75 kWh
  &criticalMinChargeAtDestinationInkWh=5 # emergency fallback
  &constantSpeedConsumptionInkWhPerHundredkm=50,8.2:90,14.6:130,22.8
  &chargingStopsStrategy=automaticFastest`;

const CODE_MANUAL = `# Manual charging stop selection (driver-controlled locations)
# Route will be calculated through these specific parks.
# LDEVR optimises the charge duration at each stop.

POST /routing/1/calculateLongDistanceEVRoute/...
  &chargingStopsStrategy=manualFastest

{
  "chargingWaypoints": [
    { "waypointIndex": 1, "chargingParkId": "a4b60dff-b599-339a-0a1b-aae200153b86" },
    { "waypointIndex": 2, "chargingParkId": "64470d9f-100f-3c41-5d48-d2a500153b86" }
  ]
}`;

const CODE_PREFS = `# Charging preferences — prioritise preferred MSPs, avoid specific parks
{
  "chargingPreferences": {
    "mobilityServiceProviders": {
      "prefer": [
        { "id": "ionity-msp-id",   "name": "Ionity" },
        { "id": "fastned-msp-id",  "name": "Fastned" }
      ]
    },
    "chargePointOperators": {
      "avoid": []
    },
    "chargingParks": {
      "avoid": [
        { "id": "uuid-of-park-to-skip" }
      ]
    },
    "plugAndChargeProviders": {
      "prefer": [
        { "id": "pnc-provider-id", "name": "My PnC Provider" }
      ]
    }
  }
}`;

export default function LDEVRChargingStops({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Charging Stop Selection</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        LDEVR automatically inserts charging stops to minimise total journey time. You control the safety thresholds, preferred networks, and — optionally — the exact stops. This page covers how stop selection works and how to configure it.
      </div>

      {/* Strategy */}
      <div className="zone">
        <h2 className="sh" id="lcs-strategy">Charging stop strategy</h2>
        <p className="body">
          The <code className="ic">chargingStopsStrategy</code> parameter controls whether the API chooses stop locations automatically or follows manual waypoints.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            {
              value: 'automaticFastest',
              label: 'Automatic (default)',
              badge: 'Recommended',
              badgeColor: '#3fb950',
              desc: 'LDEVR selects both the number and location of charging stops to minimise total elapsed trip time. The vehicle arrives at every stop and the destination above the configured minimum SoC.',
            },
            {
              value: 'manualFastest',
              label: 'Manual',
              badge: 'Advanced',
              badgeColor: '#d29922',
              desc: 'The caller specifies charging stops via chargingWaypoints. LDEVR optimises the charge duration at each designated stop, but does not add or remove stops. Arrival SoC may fall below the configured minimum if the manual plan is suboptimal.',
            },
          ].map(s => (
            <div key={s.value} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '16px 18px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{s.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${s.badgeColor}22`, color: s.badgeColor, border: `1px solid ${s.badgeColor}44` }}>{s.badge}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</p>
              <code style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--white)', padding: '3px 7px', borderRadius: 6, border: '1px solid var(--border)' }}>chargingStopsStrategy: "{s.value}"</code>
            </div>
          ))}
        </div>

        <CodeBlock language="bash" code={CODE_AUTO} />
      </div>

      {/* SoC thresholds */}
      <div className="zone">
        <h2 className="sh" id="lcs-thresholds">SoC thresholds</h2>
        <p className="body">
          Three query parameters set the minimum battery levels the route plan must respect. These are specified in kWh, not percentage — derive the values from your vehicle's <code className="ic">maxChargeInkWh</code>.
        </p>
        <table className="prop-table" style={{ marginBottom: 20 }}>
          <thead>
            <tr><th>Parameter</th><th>Default</th><th>Max constraint</th><th>What it controls</th></tr>
          </thead>
          <tbody>
            {[
              ['minChargeAtChargingStopsInkWh', '15% of max', '50% of maxChargeInkWh', 'Floor battery level on arrival at each automatic charging stop.'],
              ['minChargeAtDestinationInkWh',   '15% of max', '—',                      'Floor battery level on arrival at the final destination.'],
              ['criticalMinChargeAtDestinationInkWh', 'Optional', 'Same as minAtDest', 'Reduced floor for home/private-charger destinations. Avoids an unnecessary en-route stop when the vehicle will charge on arrival.'],
            ].map(([param, def, max, desc]) => (
              <tr key={param}>
                <td><code style={{ fontSize: '0.75rem' }}>{param}</code></td>
                <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{def}</td>
                <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{max}</td>
                <td style={{ fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 8px' }}>Interactive threshold explorer</h3>
        <p className="body" style={{ marginBottom: 16 }}>Drag the sliders to see how adjusting the thresholds affects stop count, total charge time, and arrival SoC on a 679 km Paris → Marseille route with a 75 kWh vehicle.</p>
        <StopCalculator />
        <Callout type="info" style={{ marginTop: 16 }}>
          Lower thresholds reduce stop count and journey time but leave less buffer for unexpected consumption spikes. TomTom recommends 15% at stops and destination as a baseline for most European markets.
        </Callout>
      </div>

      {/* Manual stops */}
      <div className="zone">
        <h2 className="sh" id="lcs-manual">Manual charging waypoints</h2>
        <p className="body">
          When using <code className="ic">manualFastest</code> strategy, specify one or more <code className="ic">chargingWaypoints</code> in the POST body. Each entry names a charging park by its UUID and the leg index at which the stop occurs.
        </p>
        <CodeBlock language="json" code={CODE_MANUAL} />
        <Callout type="warn">
          With manual stops, LDEVR will not add additional stops even if the vehicle cannot reach the next waypoint on current charge. Always verify the route is feasible with the chosen stop locations and threshold settings.
        </Callout>
      </div>

      {/* Charging preferences */}
      <div className="zone">
        <h2 className="sh" id="lcs-preferences">Charging preferences</h2>
        <p className="body">
          The <code className="ic">chargingPreferences</code> object in the POST body lets you bias stop selection towards preferred networks or away from specific parks. Preferences influence selection when stops are otherwise equivalent in quality — they do not override minimum SoC requirements.
        </p>
        <table className="prop-table" style={{ marginBottom: 20 }}>
          <thead>
            <tr><th>Field</th><th>Max entries</th><th>Effect</th></tr>
          </thead>
          <tbody>
            {[
              ['mobilityServiceProviders.prefer', '20', 'Prioritise stops where the driver has a contract or subscription (MSP preference).'],
              ['chargePointOperators.prefer',     '20', 'Prefer specific CPO brands (e.g. Ionity, bp pulse) regardless of MSP contract.'],
              ['chargePointOperators.avoid',      '40', 'Exclude stops operated by specific CPOs.'],
              ['chargingParks.avoid',             '40', 'Exclude specific parks by UUID (e.g. out-of-service or user-flagged).'],
              ['plugAndChargeProviders.prefer',   '20', 'Prefer parks that support the vehicle\'s Plug & Charge provider for seamless authentication.'],
            ].map(([field, max, effect]) => (
              <tr key={field}>
                <td><code style={{ fontSize: '0.75rem' }}>{field}</code></td>
                <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{max}</td>
                <td style={{ fontSize: '0.875rem' }}>{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CodeBlock language="json" code={CODE_PREFS} />
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
