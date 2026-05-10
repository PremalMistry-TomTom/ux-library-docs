import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';
import { useDemoStyle } from '../hooks/useDemoStyle';

const ROUTING_APIS = [
  { name: 'Long Distance EV Routing API', type: 'REST API',    description: 'Calculate multi-stop routes with automatic charging stop insertion, MSP preference, and battery curve awareness.', pageId: 'ldevr-calculate-route', productId: 'ldevr' },
  { name: 'EV Routing — Consumption Model', type: 'REST API',  description: 'Reference for the battery curve, consumption curve, and efficiency parameter constraints used in route calculation.', pageId: 'ldevr-battery-model', productId: 'ldevr' },
  { name: 'Navigation SDK — VehicleProvider', type: 'Android SDK', description: 'Vehicle parameters set via VehicleInfoManager are automatically forwarded to the routing engine — no manual wiring required.', url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
];

/* ─── Berlin → Amsterdam trip data ──────────────────────────────────────────── */
// Real energy math: 75 kWh usable battery, 18.5 kWh/100 km, minAtStop 18%, charge to 80%.
// Per-leg available range: (80%-18%) × 75 kWh ÷ 0.185 kWh/km ≈ 251 km.
const TRIP = {
  battery: 75,
  legs: [
    { from: 'Berlin',              fromSoc: 78, toSoc: null, km: null, type: 'origin' },
    { km: 245, mins: 113,                                               type: 'leg'    },
    { name: 'Ionity Bochum',       network: 'Ionity',    socIn: 18, socOut: 80, kWh: 46.5, mins: 21, kW: 350, type: 'stop' },
    { km: 250, mins: 115,                                               type: 'leg'    },
    { name: 'Fastned Eindhoven',   network: 'Fastned',   socIn: 18, socOut: 78, kWh: 45.0, mins: 19, kW: 300, type: 'stop' },
    { km: 184, mins: 85,                                               type: 'leg'    },
    { to: 'Amsterdam',             toSoc: 33,                          type: 'dest'   },
  ],
};

function useSoCColor(pct) {
  const M = useDemoStyle();
  return pct >= 40 ? M.green : pct >= 20 ? M.amber : M.red;
}

function SoCBadge({ pct }) {
  const color = useSoCColor(pct);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 20, background: `${color}22`, border: `1px solid ${color}55`, fontSize: '0.875rem', fontWeight: 700, color, whiteSpace: 'nowrap' }}>
      ⚡ {pct}%
    </span>
  );
}

export function TripTimeline() {
  const Mc = useDemoStyle();

  const totalKm = TRIP.legs.filter(l => l.type === 'leg').reduce((s, l) => s + l.km, 0);
  const totalChargeMins = TRIP.legs.filter(l => l.type === 'stop').reduce((s, l) => s + l.mins, 0);
  const totalDriveMins  = TRIP.legs.filter(l => l.type === 'leg').reduce((s, l) => s + l.mins, 0);
  const totalMins = totalDriveMins + totalChargeMins;
  const totalHrs = Math.floor(totalMins / 60), remMins = totalMins % 60;

  return (
    <div>
      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, marginBottom: 20 }}>
        {[
          ['📍', `${totalKm} km`, 'Total distance'],
          ['🔌', `${TRIP.legs.filter(l => l.type === 'stop').length} stops`, 'Auto-inserted'],
          ['⚡', `${totalChargeMins} min`, 'Total charging'],
          ['🕐', `${totalHrs}h ${remMins}min`, 'Total journey'],
        ].map(([icon, val, label]) => (
          <div key={label} style={{ background: Mc.card, border: `1px solid ${Mc.line}`, borderRadius: 20, padding: '10px 12px' }}>
            <div style={{ fontSize: '1rem', marginBottom: 3 }}>{icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: Mc.text, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.875rem', color: Mc.dim, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Route timeline */}
      <div style={{ background: Mc.bg, border: `1px solid ${Mc.line}`, borderRadius: 20, padding: '16px 18px' }}>
        {TRIP.legs.map((item, i) => {
          if (item.type === 'origin') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a3d2b', border: `2px solid ${Mc.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>📍</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: Mc.text }}>{item.from}</span>
                <span style={{ fontSize: '0.875rem', color: Mc.dim, marginLeft: 8 }}>Start</span>
              </div>
              <SoCBadge pct={item.fromSoc} />
            </div>
          );
          if (item.type === 'leg') return (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 10, margin: '2px 0' }}>
              <div style={{ width: 28, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 2, background: Mc.line, borderRadius: 1 }}/>
              </div>
              <div style={{ padding: '6px 0', fontSize: '0.875rem', color: Mc.dim }}>
                {item.km} km &nbsp;·&nbsp; {Math.floor(item.mins / 60)}h {item.mins % 60}min driving
              </div>
            </div>
          );
          if (item.type === 'stop') return (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1c2d4a', border: `2px solid ${Mc.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>🔌</div>
                <div style={{ flex: 1, background: Mc.card2, border: `1px solid ${Mc.line}`, borderRadius: 20, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: Mc.text }}>{item.name}</span>
                    <span style={{ fontSize: '0.875rem', padding: '2px 7px', borderRadius: 20, background: '#1c2d4a', border: `1px solid ${Mc.blue}44`, color: Mc.blue }}>{item.network}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <SoCBadge pct={item.socIn} />
                      <span style={{ fontSize: '0.875rem', color: Mc.dim }}>→</span>
                      <SoCBadge pct={item.socOut} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: Mc.dim }}>+{item.kWh} kWh &nbsp;·&nbsp; {item.kW} kW peak &nbsp;·&nbsp; {item.mins} min</span>
                  </div>
                </div>
              </div>
            </div>
          );
          if (item.type === 'dest') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${Mc.purple}33`, border: `2px solid ${Mc.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>🏁</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: Mc.text }}>{item.to}</span>
                <span style={{ fontSize: '0.875rem', color: Mc.dim, marginLeft: 8 }}>Destination</span>
              </div>
              <SoCBadge pct={item.toSoc} />
            </div>
          );
          return null;
        })}
      </div>

      {/* OEM value callout */}
      <div style={{ marginTop: 14, background: `${Mc.green}18`, border: `1px solid ${Mc.green}44`, borderRadius: 20, padding: '10px 14px', display: 'flex', gap: 10 }}>
        <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>✅</span>
        <div style={{ fontSize: '0.75rem', color: Mc.green, lineHeight: 1.55 }}>
          <strong>Zero routing code from the OEM.</strong> Battery parameters set once via <code style={{ fontSize: '0.75rem', background: `${Mc.line}66`, padding: '1px 4px', borderRadius: 3 }}>VehicleInfoManager</code> are automatically forwarded to LDEVR. The SDK plans the stops, monitors SoC in-drive, and re-queries if conditions change.
        </div>
      </div>
    </div>
  );
}

/* ─── Mock palette is now supplied by useDemoStyle() inside each component ── */

/* ─── Charging stop strategy calculator ──────────────────────────────────────── */
// Model: 679 km trip, 75 kWh battery, 18 kWh/100 km average consumption
// Total energy needed: 679 * 0.18 = 122 kWh. Battery usable: 75 kWh (100% → 0%)
// Start SoC: 60% = 45 kWh usable.
// Each charging session tops up to (100% - minAtStop%) kWh worth of capacity.
// We compute a simplified stop sequence.

function computeStops(minAtStopPct, minAtDestPct) {
  const battCapacity = 75;     // kWh
  const totalEnergy  = 122;    // kWh for 679 km
  const startKwh     = 45;     // 60% start
  const minStop      = (minAtStopPct / 100) * battCapacity;   // kWh floor at stop
  const minDest      = (minAtDestPct / 100) * battCapacity;   // kWh floor at dest
  const targetCharge = battCapacity * 0.80;   // charge to 80% (typical fast-charge target)
  const chargeTime   = (kwhNeeded) => Math.round((kwhNeeded / 150) * 60); // mins at 150 kW avg

  const stops = [];
  let current = startKwh;
  let distCovered = 0;
  const totalDist = 679;

  while (distCovered < totalDist) {
    // How far can we go before hitting the stop floor?
    const usable = current - minStop;
    if (usable <= 0) break;
    const legKm = (usable / 0.18);   // 18 kWh/100 km → 0.18 kWh/km
    const legDist = Math.min(legKm, totalDist - distCovered);
    const energyUsed = legDist * 0.18;
    current -= energyUsed;
    distCovered += legDist;

    if (distCovered >= totalDist) break;

    // Need to charge
    const needed = targetCharge - current;
    const mins = chargeTime(needed);
    const arrivalPct = Math.round((current / battCapacity) * 100);
    const departurePct = Math.round((targetCharge / battCapacity) * 100);

    stops.push({
      distCovered: Math.round(distCovered),
      arrivalPct,
      departurePct,
      chargeKwh: Math.round(needed),
      mins,
    });
    current = targetCharge;
  }

  const arrivalAtDestPct = Math.round((current / battCapacity) * 100);
  const totalChargeMins = stops.reduce((s, st) => s + st.mins, 0);
  const driveMins = Math.round((679 / 110) * 60); // avg 110 km/h

  return { stops, arrivalAtDestPct, totalChargeMins, totalMins: driveMins + totalChargeMins };
}

const STATION_NAMES = ['Ionity Reims', 'Fastned Lyon', 'Ionity Montpellier', 'bp pulse Nîmes', 'Electra Marseille'];

export function StopStrategyCalculator({ t }) {
  const M = useDemoStyle();
  const [minStop, setMinStop] = useState(15);
  const [minDest, setMinDest] = useState(15);

  const { stops, arrivalAtDestPct, totalChargeMins, totalMins } = computeStops(minStop, minDest);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const socColor = pct => pct >= 30 ? M.green : pct >= 15 ? M.dim : M.red;

  return (
    <div>
      {/* Sliders */}
      <div className="grid-2-col" style={{ marginBottom: 24 }}>
        {[
          { label: t('routing.strategy.minAtStop'), val: minStop, set: setMinStop },
          { label: t('routing.strategy.minAtDest'), val: minDest, set: setMinDest },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6' }}>{val}%</span>
            </div>
            <input type="range" min={5} max={35} step={5} value={val}
              onChange={e => set(Number(e.target.value))}
              aria-label={`${label}: ${val}%`}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)', marginTop: 2 }}>
              <span>5%</span><span>35%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          ['🛑', t('routing.strategy.stops'),       `${stops.length}`,            stops.length <= 2 ? M.green : stops.length <= 4 ? M.dim : M.red],
          ['⏱', t('routing.strategy.chargeTime'),   `${totalChargeMins} min`,     totalChargeMins < 60 ? M.green : M.dim],
          ['🕐', t('routing.strategy.totalTime'),    `${hrs}h ${mins}m`,           '#58a6ff'],
          ['🔋', t('routing.strategy.arrivalSoC'),  `${arrivalAtDestPct}%`,       socColor(arrivalAtDestPct)],
        ].map(([icon, label, val, color]) => (
          <div key={label} style={{ padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', flex: '1 1 130px' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: 3 }}>{icon}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Route timeline */}
      <div style={{ background: M.card, borderRadius: 20, border: `1px solid ${M.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: M.text }}>Paris → Marseille · 679 km</span>
          <span style={{ fontSize: '0.875rem', color: M.dim }}>🔋 {stops.length} {t('routing.strategy.chargeStopsLabel')}</span>
        </div>

        <div style={{ padding: '10px 14px' }}>
          {/* Origin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, fontSize: '0.75rem', color: M.dim }}>
            <span style={{ fontSize: '0.875rem' }}>📍</span>
            <span>Paris · 🔋 60%</span>
          </div>

          {stops.map((s, i) => (
            <div key={i}>
              {/* Leg connector */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 14, marginBottom: 4 }}>
                <div style={{ width: 1, height: 20, background: M.line }} />
                <span style={{ fontSize: '0.875rem', color: M.dim }}>{i === 0 ? s.distCovered : s.distCovered - stops[i-1].distCovered} km</span>
              </div>
              {/* Stop card */}
              <div style={{ background: M.card2, borderRadius: 20, padding: '9px 12px', marginBottom: 6, border: `1px solid ${M.line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: M.text }}>🔌 {STATION_NAMES[i] || `Stop ${i+1}`}</span>
                  <span style={{ fontSize: '0.875rem', color: M.muted }}>{s.mins} min</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: M.dim }}>
                  🔋 <span style={{ color: socColor(s.arrivalPct) }}>{s.arrivalPct}%</span>
                  {' → '}
                  <span style={{ color: M.blue }}>{s.departurePct}%</span>
                  {' · '}+{s.chargeKwh} kWh
                </div>
              </div>
            </div>
          ))}

          {/* Final leg */}
          {stops.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 14, marginBottom: 4 }}>
              <div style={{ width: 1, height: 20, background: M.line }} />
              <span style={{ fontSize: '0.875rem', color: M.dim }}>{679 - (stops[stops.length-1]?.distCovered || 0)} km</span>
            </div>
          )}

          {/* Destination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: M.dim }}>
            <span style={{ fontSize: '0.875rem' }}>🏁</span>
            <span>Marseille · 🔋 <span style={{ color: socColor(arrivalAtDestPct) }}>{arrivalAtDestPct}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Preferences mock ───────────────────────────────────────────────────────── */
function PreferencesMock() {
  const M = useDemoStyle();
  return (
    <div style={{ background: M.card, borderRadius: 20, overflow: 'hidden', width: 260, flexShrink: 0, border: `1px solid ${M.line}` }}>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}`, fontSize: '0.75rem', fontWeight: 700, color: M.text }}>Route preferences</div>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.875rem', color: M.dim, marginBottom: 10 }}>Minimum battery on arrival</div>
        {[{ label: 'At charging stop', val: '15%', pct: 15 }, { label: 'At destination', val: '15%', pct: 15 }].map(p => (
          <div key={p.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.875rem', color: M.text, marginBottom: 5 }}>{p.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: M.line, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${p.pct}%`, background: M.blue, borderRadius: 2 }} />
                <div style={{ position: 'absolute', top: -4, left: `${p.pct}%`, width: 12, height: 12, borderRadius: '50%', background: M.blue, border: `2px solid ${M.bg}`, transform: 'translateX(-50%)' }} />
              </div>
              <span style={{ fontSize: '0.875rem', color: M.blue, minWidth: 28, textAlign: 'right' }}>{p.val}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: '0.875rem', color: M.dim, marginBottom: 8 }}>Avoid on this route</div>
        {[{ icon: '🛣', label: 'Tolls' }, { icon: '🛤', label: 'Unpaved Roads' }].map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.875rem', color: M.text }}>
              <span>{r.icon}</span>{r.label}
            </div>
            <div style={{ width: 34, height: 18, borderRadius: 9, background: M.line, position: 'relative', border: `1px solid ${M.muted}` }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: M.muted, position: 'absolute', top: 1, left: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Code ───────────────────────────────────────────────────────────────────── */
const CODE_LDEVR = `# Route: Paris (48.8566, 2.3522) → Marseille (43.2965, 5.3698)
# Vehicle: 75 kWh battery, starting at 60% (45 kWh); preferred MSPs: Ionity, Fastned

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
  48.8566,2.3522:43.2965,5.3698/json\\
  ?vehicleEngineType=electric\\
  &currentChargeInkWh=45\\
  &maxChargeInkWh=75\\
  &minChargeAtDestinationInkWh=7.5\\
  &minChargeAtChargingStopsInkWh=11.25\\
  &key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chargingParameters": {
      "batteryCurve": [
        { "stateOfChargeInkWh": 0,  "maxPowerInkW": 50  },
        { "stateOfChargeInkWh": 20, "maxPowerInkW": 150 },
        { "stateOfChargeInkWh": 56, "maxPowerInkW": 75  },
        { "stateOfChargeInkWh": 72, "maxPowerInkW": 20  }
      ],
      "chargingConnectors": [
        {
          "currentType": "DC",
          "maxPowerInkW": 150,
          "plugTypes": [ "IEC62196Type2CCS" ]
        }
      ]
    },
    "preferredMSPs": [ "Ionity", "Fastned", "TotalEnergies" ]
  }'`;

const PREF_ROWS = [
  ['minAtStop',    'minChargeAtChargingStopsInkWh',       '15%'],
  ['minAtDest',    'minChargeAtDestinationInkWh',         '15%'],
  ['minAtFirst',   'minChargeAtFirstChargingStopInkWh',   'Same as stops'],
  ['criticalMin',  'criticalMinChargeAtDestinationInkWh', 'Optional'],
  ['avoidTolls',   'avoid=tollRoads',                     'Off'],
  ['avoidUnpaved', 'avoid=unpavedRoads',                  'Off'],
];

export default function EVRouting({ onNavigate }) {
  const { t } = useTranslation('ev');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('routing.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('routing.intro')}</div>

      <ApiLinks items={ROUTING_APIS} onNavigate={onNavigate} />

      {/* Charging stop strategy — automatic vs manual */}
      <div className="zone">
        <h2 className="sh" id="evr-charging-strategy">{t('routing.chargingStrategy.heading')}</h2>
        <p className="body">{t('routing.chargingStrategy.body')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            {
              icon: '⚡',
              title: 'Automatic (default)',
              desc: 'LDEVR calculates the optimal number and location of charging stops based on battery state, consumption model, and network coverage. The driver receives a complete plan before departure — no routing code required from the OEM.',
              badge: 'Recommended',
              badgeColor: '#3fb950',
              param: 'chargingStopsStrategy: "automaticFastest"',
            },
            {
              icon: '🗺️',
              title: 'Manual',
              desc: 'The driver selects specific charging stops along the route. LDEVR optimises the duration and target SoC at each manually chosen stop, but stop locations are driver-controlled. Suitable for drivers with specific network preferences.',
              badge: 'Advanced',
              badgeColor: '#d29922',
              param: 'chargingStopsStrategy: "manualFastest"',
            },
          ].map(s => (
            <div key={s.title} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '16px 18px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.125rem' }}>{s.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{s.title}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${s.badgeColor}22`, color: s.badgeColor, border: `1px solid ${s.badgeColor}55` }}>{s.badge}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, marginBottom: 12 }}>{s.desc}</p>
              <code style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--white)', padding: '3px 7px', borderRadius: 6, border: '1px solid var(--border)' }}>{s.param}</code>
            </div>
          ))}
        </div>
        <Callout type="info">{t('routing.chargingStrategy.callout')}</Callout>
      </div>

      {/* Stop strategy calculator */}
      <div className="zone">
        <h2 className="sh" id="evr-strategy">{t('routing.strategy.heading')}</h2>
        <p className="body">{t('routing.strategy.body')}</p>
        <StopStrategyCalculator t={t} />
        <Callout type="info" style={{ marginTop: 16 }}>{t('routing.strategy.callout')}</Callout>
      </div>

      {/* Route preferences */}
      <div className="zone">
        <h2 className="sh" id="evr-prefs">{t('preferences.heading')}</h2>
        <p className="body">{t('preferences.body')}</p>

        {/* SoC defaults reference */}
        <table className="prop-table" style={{ marginBottom: 24 }}>
          <thead>
            <tr><th>Preference</th><th>Default</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {[
              ['Min SoC at charging stop',        '15%',  'Floor battery level on arrival at each charging stop. Adjust higher for safety margin in markets with lower charger density.'],
              ['Min SoC at destination',           '15%',  'Floor battery level on arrival at the final destination. Increase for long drives or uncertain final-mile conditions.'],
              ['Critical min at home destination', '35% of min', 'Reduced buffer for destinations with a private charger (home/workplace). Avoids unnecessary en-route stops when the driver will charge on arrival.'],
              ['Minimum charge time',              '300 s', 'Non-configurable. The SDK always adds at least 5 minutes at any stop, even if less charge is mathematically needed.'],
            ].map(([pref, def, note]) => (
              <tr key={pref}>
                <td style={{ fontWeight: 600 }}>{pref}</td>
                <td><code className="ic">{def}</code></td>
                <td style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
          <PreferencesMock />
          <div style={{ maxWidth: 360, flex: 1 }}>
            <table className="prop-table">
              <thead>
                <tr>
                  <th>{t('preferences.colUi')}</th>
                  <th>{t('preferences.colParam')}</th>
                  <th>{t('preferences.colDefault')}</th>
                </tr>
              </thead>
              <tbody>
                {PREF_ROWS.map(([key, param, def]) => (
                  <tr key={key}>
                    <td>{t(`preferences.rows.${key}`)}</td>
                    <td><code style={{ fontSize: '0.75rem' }}>{param}</code></td>
                    <td>{def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Callout type="info">{t('preferences.callout')}</Callout>
      </div>

      {/* LDEVR API */}
      <div className="zone">
        <h2 className="sh" id="evr-api">{t('ldevr.apiRequest.heading')}</h2>
        <p className="body">{t('ldevr.apiRequest.body')}</p>
        <CodeBlock language="json" code={CODE_LDEVR} />
        <Callout type="warn">{t('ldevr.callout2')}</Callout>
      </div>

      {/* Response fields */}
      <div className="zone">
        <h2 className="sh" id="evr-response">{t('ldevr.responseTable.heading')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr><th>{t('ldevr.responseTable.colField')}</th><th>{t('ldevr.responseTable.colDesc')}</th></tr>
            </thead>
            <tbody>
              {Object.entries({
                'remainingChargeAtArrivalInkWh':                                          t('ldevr.responseTable.fields.remainingChargeAtArrivalInkWh'),
                'chargingInformationAtEndOfLeg.targetChargeInkWh':                        t('ldevr.responseTable.fields.targetChargeInkWh'),
                'chargingInformationAtEndOfLeg.chargingTimeInSeconds':                    t('ldevr.responseTable.fields.chargingTimeInSeconds'),
                'chargingInformationAtEndOfLeg.chargingParkName':                         t('ldevr.responseTable.fields.chargingParkName'),
                'chargingInformationAtEndOfLeg.chargingConnectionInfo.chargingPowerInkW': t('ldevr.responseTable.fields.chargingPowerInkW'),
                'chargingInformationAtEndOfLeg.chargingParkPaymentOptions':               t('ldevr.responseTable.fields.chargingParkPaymentOptions'),
                'chargingInformationAtEndOfLeg.chargingStopType':                         t('ldevr.responseTable.fields.chargingStopType'),
                'summary.totalChargingTimeInSeconds':                                      t('ldevr.responseTable.fields.totalChargingTimeInSeconds'),
              }).map(([field, desc]) => (
                <tr key={field}><td><code style={{ fontSize: '0.75rem' }}>{field}</code></td><td>{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-world trip example */}
      <div className="zone">
        <h2 className="sh" id="evr-trip">{t('routing.trip.heading')}</h2>
        <p className="body">{t('routing.trip.body')}</p>
        <TripTimeline />
        <Callout type="info" style={{ marginTop: 16 }}>{t('routing.trip.callout')}</Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
