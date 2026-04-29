import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const ROUTING_APIS = [
  { name: 'Long Distance EV Routing API', type: 'REST API',    description: 'Calculate multi-stop routes with automatic charging stop insertion, MSP preference, and battery curve awareness.', url: 'https://docs.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-maps/long-distance-ev-routing' },
  { name: 'EV Routing — Consumption Model', type: 'REST API',  description: 'Reference for the battery curve, consumption curve, and efficiency parameter constraints used in route calculation.', url: 'https://docs.tomtom.com/electric-vehicle/ev-routing/introduction' },
  { name: 'Navigation SDK — VehicleProvider', type: 'Android SDK', description: 'Vehicle parameters set via VehicleInfoManager are automatically forwarded to the routing engine — no manual wiring required.', url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
];

/* ─── Mock palette ──────────────────────────────────────────────────────────── */
const M = {
  bg: '#0d1117', card: '#161b22', card2: '#1c2333', line: '#21262d',
  text: '#e6edf3', dim: '#8b949e', muted: '#6e7681',
  blue: '#58a6ff', green: '#3fb950', red: '#f85149',
};

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

function StopStrategyCalculator({ t }) {
  const [minStop, setMinStop] = useState(15);
  const [minDest, setMinDest] = useState(15);

  const { stops, arrivalAtDestPct, totalChargeMins, totalMins } = computeStops(minStop, minDest);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const socColor = pct => pct >= 30 ? M.green : pct >= 15 ? M.dim : M.red;

  return (
    <div>
      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {[
          { label: t('routing.strategy.minAtStop'), val: minStop, set: setMinStop },
          { label: t('routing.strategy.minAtDest'), val: minDest, set: setMinDest },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--black)' }}>{label}</span>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#3b82f6' }}>{val}%</span>
            </div>
            <input type="range" min={5} max={35} step={5} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>
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
          <div key={label} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', flex: '1 1 130px' }}>
            <div style={{ fontSize: '0.9rem', marginBottom: 3 }}>{icon}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Route timeline */}
      <div style={{ background: M.card, borderRadius: 12, border: `1px solid ${M.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: M.text }}>Paris → Marseille · 679 km</span>
          <span style={{ fontSize: '0.66rem', color: M.dim }}>🔋 {stops.length} {t('routing.strategy.chargeStopsLabel')}</span>
        </div>

        <div style={{ padding: '10px 14px' }}>
          {/* Origin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, fontSize: '0.74rem', color: M.dim }}>
            <span style={{ fontSize: '0.9rem' }}>📍</span>
            <span>Paris · 🔋 60%</span>
          </div>

          {stops.map((s, i) => (
            <div key={i}>
              {/* Leg connector */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 14, marginBottom: 4 }}>
                <div style={{ width: 1, height: 20, background: M.line }} />
                <span style={{ fontSize: '0.62rem', color: M.dim }}>{i === 0 ? s.distCovered : s.distCovered - stops[i-1].distCovered} km</span>
              </div>
              {/* Stop card */}
              <div style={{ background: M.card2, borderRadius: 8, padding: '9px 12px', marginBottom: 6, border: `1px solid ${M.line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: M.text }}>🔌 {STATION_NAMES[i] || `Stop ${i+1}`}</span>
                  <span style={{ fontSize: '0.62rem', color: M.muted }}>{s.mins} min</span>
                </div>
                <div style={{ fontSize: '0.64rem', color: M.dim }}>
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
              <span style={{ fontSize: '0.62rem', color: M.dim }}>{679 - (stops[stops.length-1]?.distCovered || 0)} km</span>
            </div>
          )}

          {/* Destination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.74rem', color: M.dim }}>
            <span style={{ fontSize: '0.9rem' }}>🏁</span>
            <span>Marseille · 🔋 <span style={{ color: socColor(arrivalAtDestPct) }}>{arrivalAtDestPct}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Preferences mock ───────────────────────────────────────────────────────── */
function PreferencesMock() {
  return (
    <div style={{ background: M.card, borderRadius: 12, overflow: 'hidden', width: 260, flexShrink: 0, border: `1px solid ${M.line}` }}>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}`, fontSize: '0.8rem', fontWeight: 700, color: M.text }}>Route preferences</div>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.66rem', color: M.dim, marginBottom: 10 }}>Minimum battery on arrival</div>
        {[{ label: 'At charging stop', val: '15%', pct: 15 }, { label: 'At destination', val: '15%', pct: 15 }].map(p => (
          <div key={p.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.68rem', color: M.text, marginBottom: 5 }}>{p.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: M.line, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${p.pct}%`, background: M.blue, borderRadius: 2 }} />
                <div style={{ position: 'absolute', top: -4, left: `${p.pct}%`, width: 12, height: 12, borderRadius: '50%', background: M.blue, border: '2px solid #fff', transform: 'translateX(-50%)' }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: M.blue, minWidth: 28, textAlign: 'right' }}>{p.val}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: '0.66rem', color: M.dim, marginBottom: 8 }}>Avoid on this route</div>
        {[{ icon: '🛣', label: 'Tolls' }, { icon: '🛤', label: 'Unpaved Roads' }].map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.7rem', color: M.text }}>
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
const CODE_LDEVR = `POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/
    48.8566,2.3522:43.2965,5.3698/json?key={API_KEY}
    &vehicleEngineType=electric
    &currentChargeInKwh=45
    &minChargeAtDestinationInkWh=7.5
    &minChargeAtChargingStopsInkWh=11.25
    &constantSpeedConsumptionInkWhPerHundredkm=10:180,80:180,120:260

{
  "chargingConnectors": [{
    "currentType": "DC",
    "maxPowerInkW": 150,
    "plugTypes": ["Combo_to_IEC_62196_Type_2_Base"]
  }],
  "batteryCurve": [
    { "stateOfChargeInkWh": 0,  "maxPowerInkW": 50  },
    { "stateOfChargeInkWh": 20, "maxPowerInkW": 150 },
    { "stateOfChargeInkWh": 56, "maxPowerInkW": 75  },
    { "stateOfChargeInkWh": 72, "maxPowerInkW": 20  }
  ],
  "chargingTimeOffsetInSec": 120,
  "preferredMSPs": ["Ionity", "Fastned", "TotalEnergies"]
}`;

const PREF_ROWS = [
  ['minAtStop',    'minChargeAtChargingStopsInkWh',       '15%'],
  ['minAtDest',    'minChargeAtDestinationInkWh',         '15%'],
  ['minAtFirst',   'minChargeAtFirstChargingStopInkWh',   'Same as stops'],
  ['criticalMin',  'criticalMinChargeAtDestinationInkWh', 'Optional'],
  ['avoidTolls',   'avoid=tollRoads',                     'Off'],
  ['avoidUnpaved', 'avoid=unpavedRoads',                  'Off'],
];

export default function EVRouting() {
  const { t } = useTranslation('ev');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('routing.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('routing.intro')}</div>

      <ApiLinks items={ROUTING_APIS} />

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
                    <td><code style={{ fontSize: '0.72rem' }}>{param}</code></td>
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
                <tr key={field}><td><code style={{ fontSize: '0.72rem' }}>{field}</code></td><td>{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
