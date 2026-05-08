import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Consumption curve visualisation ───────────────────────────────────────── */
// Example values from TomTom docs (kWh/100km) for a typical mid-size EV
const EXAMPLE_CURVE = [[10,11.41],[20,9.17],[30,8.77],[40,8.95],[50,9.48],[60,10.26],[70,11.26],[80,12.46],[90,13.85],[100,15.43],[110,17.19],[120,19.13],[130,21.25],[140,23.55]];

function ConsumptionCurveViz({ points, color = '#3b82f6' }) {
  const W = 320, H = 100, PL = 16, PR = 16, PT = 10, PB = 20;
  const iW = W - PL - PR, iH = H - PT - PB;
  const maxX = Math.max(...points.map(p => p[0]));
  const maxY = Math.max(...points.map(p => p[1])) * 1.1;
  const toX = v => PL + (v / maxX) * iW;
  const toY = v => H - PB - (v / maxY) * iH;
  const d = points.map(([x, y], i) => `${i===0?'M':'L'} ${toX(x).toFixed(1)} ${toY(y).toFixed(1)}`).join(' ');
  const fill = d + ` L ${toX(maxX).toFixed(1)} ${H-PB} L ${toX(10).toFixed(1)} ${H-PB} Z`;

  // Minimum point (best efficiency)
  const minPt = points.reduce((best, p) => p[1] < best[1] ? p : best, points[0]);

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <path d={fill} fill={`${color}15`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={toX(x)} cy={toY(y)} r="2.5" fill={color} />
      ))}
      {/* Mark minimum efficiency point */}
      <circle cx={toX(minPt[0])} cy={toY(minPt[1])} r="5" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,2" />
      <text x={toX(minPt[0])} y={toY(minPt[1])-8} fontSize="9" fill={color} textAnchor="middle">{minPt[1]} kWh/100km</text>
      {/* X axis labels */}
      <text x={toX(10)}  y={H-4} fontSize="9" fill="var(--muted)" textAnchor="middle">10</text>
      <text x={toX(80)}  y={H-4} fontSize="9" fill="var(--muted)" textAnchor="middle">80</text>
      <text x={toX(140)} y={H-4} fontSize="9" fill="var(--muted)" textAnchor="middle">140 km/h</text>
      {/* Y axis */}
      <text x={PL} y={PT+6} fontSize="9" fill="var(--muted)">{Math.round(maxY / 1.1)} kWh</text>
    </svg>
  );
}

/* ─── Battery charge curve visualisation ────────────────────────────────────── */
const EXAMPLE_BATTERY_CURVE = [
  { soc: 0,  pct: 35 }, { soc: 5,  pct: 90 }, { soc: 10, pct: 100 },
  { soc: 35, pct: 100 },{ soc: 50, pct: 90 }, { soc: 70, pct: 50 }, { soc: 100, pct: 5 }
];

function BatteryCurveViz({ color = '#3fb950' }) {
  const W = 280, H = 90, PL = 16, PR = 16, PT = 14, PB = 22;
  const iW = W - PL - PR, iH = H - PT - PB;
  const toX = soc => PL + (soc / 100) * iW;
  const toY = pct => H - PB - (pct / 100) * iH;
  const d = EXAMPLE_BATTERY_CURVE.map(({ soc, pct }, i) => `${i===0?'M':'L'} ${toX(soc).toFixed(1)} ${toY(pct).toFixed(1)}`).join(' ');
  const fill = d + ` L ${toX(100).toFixed(1)} ${H-PB} L ${toX(0).toFixed(1)} ${H-PB} Z`;
  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <path d={fill} fill={`${color}15`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {EXAMPLE_BATTERY_CURVE.map(({ soc, pct }, i) => (
        <circle key={i} cx={toX(soc)} cy={toY(pct)} r="3" fill={color} />
      ))}
      <line x1={toX(10)} y1={toY(100)} x2={toX(10)} y2={H-PB} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={toX(35)} y1={toY(100)} x2={toX(35)} y2={H-PB} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
      <text x={toX(0)}   y={H-6} fontSize="9" fill="var(--muted)" textAnchor="middle">0%</text>
      <text x={toX(35)}  y={H-6} fontSize="9" fill={color}        textAnchor="middle">35%</text>
      <text x={toX(100)} y={H-6} fontSize="9" fill="var(--muted)" textAnchor="middle">100%</text>
      <text x={PL} y={PT+2} fontSize="9" fill="var(--muted)">Peak kW</text>
    </svg>
  );
}

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_CONSUMPTION = `# Consumption model passed as query parameter (required)
# Format: speed1,kWh1:speed2,kWh2:...
# Speeds in km/h, consumption in kWh/100km
# URL-encode the colons (%3A) and commas (%2C) in GET requests.

&constantSpeedConsumptionInkWhPerHundredkm=\\
  10,11.41:\\
  30,8.77:\\
  50,9.48:\\
  80,12.46:\\
  100,15.43:\\
  120,19.13:\\
  140,23.55

# Rules:
# - 1–25 speed/consumption pairs
# - No duplicate speeds
# - Consumption at larger speeds must be >= consumption at second-largest speed
# - Baseline: 20°C ambient, flat road, constant speed, no HVAC`;

const CODE_BATTERY_CURVE = `# Charging curve in POST body (recommended)
# Maps state of energy (kWh) → maximum acceptable charge power (kW)
# Determines how long each charging stop takes.

{
  "chargingParameters": {
    "batteryCurve": [
      { "stateOfChargeInkWh": 0.0,  "maxPowerInkW": 35  },
      { "stateOfChargeInkWh": 3.75, "maxPowerInkW": 90  },
      { "stateOfChargeInkWh": 7.5,  "maxPowerInkW": 150 },
      { "stateOfChargeInkWh": 26.25,"maxPowerInkW": 150 },
      { "stateOfChargeInkWh": 37.5, "maxPowerInkW": 135 },
      { "stateOfChargeInkWh": 52.5, "maxPowerInkW": 75  },
      { "stateOfChargeInkWh": 75.0, "maxPowerInkW": 7   }
    ]
  }
}

# Notes:
# - 0–20 entries; stateOfChargeInkWh values must be unique and >= 0
# - maxPowerInkW must be > 0
# - Entry at 0 kWh is mandatory
# - Interpolated linearly between points by the routing engine`;

const CODE_EFFICIENCY = `# Optional efficiency parameters (require vehicleWeight)
# All values are dimensionless fractions in range [0, 1].
# Default: 0.9 for all four when not supplied.

&vehicleWeight=2100
&accelerationEfficiency=0.91  # KineticEnergyGained / ElectricEnergyConsumed
&decelerationEfficiency=0.85  # ElectricEnergyGained / KineticEnergyLost
&uphillEfficiency=0.92         # PotentialEnergyGained / ElectricEnergyConsumed
&downhillEfficiency=0.88       # ElectricEnergyGained / PotentialEnergyLost
&auxiliaryPowerInkW=0.5        # Avg non-drivetrain load (HVAC, infotainment)

# Pairing rules (must supply both or neither):
#   accelerationEfficiency + decelerationEfficiency
#   uphillEfficiency + downhillEfficiency`;

export default function LDEVRBatteryModel() {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Battery &amp; Consumption Model</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        The consumption model tells LDEVR how much energy the vehicle uses at different speeds and how fast it charges at any given state of charge. Accurate parameters are the single biggest factor in realistic charging stop placement and stop-time estimates.
      </div>

      {/* Consumption curve */}
      <div className="zone">
        <h2 className="sh" id="lbm-consumption">Speed consumption curve</h2>
        <p className="body">
          The <code className="ic">constantSpeedConsumptionInkWhPerHundredkm</code> parameter is the only required consumption model input. It maps vehicle speed to energy consumption under ideal baseline conditions — flat road, 20°C ambient, constant speed, no HVAC or auxiliary load.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typical mid-size EV consumption</div>
            <ConsumptionCurveViz points={EXAMPLE_CURVE} />
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>Optimal efficiency around 30 km/h. Rises steeply above 100 km/h from aerodynamic drag.</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 10, color: 'var(--mid)' }}>Constraints</div>
            <table className="prop-table" style={{ fontSize: '0.8125rem' }}>
              <tbody>
                {[
                  ['Points', '1–25 speed/consumption pairs'],
                  ['Format', 'speed (km/h), kWh/100km'],
                  ['No duplicates', 'All speed values must be unique'],
                  ['Monotone tail', 'At max speed, consumption ≥ second-highest'],
                  ['Baseline', '20°C, flat, constant speed, no HVAC'],
                  ['Auxiliary', 'Excluded — pass separately via auxiliaryPowerInkW'],
                ].map(([k, v]) => (
                  <tr key={k}><td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CodeBlock language="bash" code={CODE_CONSUMPTION} />
        <Callout type="warn">
          The consumption curve is the most impactful parameter in the entire model. A 10% error in curve values produces a ~10% error in consumption estimates — leading to stops appearing too early or too late. Use validated dyno data; avoid rough estimates for production deployments.
        </Callout>
      </div>

      {/* Battery charge curve */}
      <div className="zone">
        <h2 className="sh" id="lbm-battery-curve">Battery charge curve</h2>
        <p className="body">
          The <code className="ic">batteryCurve</code> inside <code className="ic">chargingParameters</code> maps state of energy (kWh) to the maximum power the battery can accept. LDEVR integrates under this curve between arrival SoC and target SoC to compute charging stop duration.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typical curve shape</div>
            <BatteryCurveViz />
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6, maxWidth: 280 }}>Flat peak at 10–35% SoC. Tapers from 70% to preserve cell health.</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 10, color: 'var(--mid)' }}>Default reference values</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 8, lineHeight: 1.55 }}>
              When no curve is supplied, use these percentages of peak power as a starting point. Always prefer supplier-provided curve data for production.
            </p>
            <table className="prop-table" style={{ fontSize: '0.8125rem' }}>
              <thead><tr><th>SoC</th><th>% of peak</th></tr></thead>
              <tbody>
                {[[0,35],[5,90],[10,100],[35,100],[50,90],[70,50],[100,5]].map(([soc, pct]) => (
                  <tr key={soc}><td>{soc}%</td><td><code className="ic">{pct}%</code></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CodeBlock language="json" code={CODE_BATTERY_CURVE} />
      </div>

      {/* Efficiency parameters */}
      <div className="zone">
        <h2 className="sh" id="lbm-efficiency">Efficiency parameters</h2>
        <p className="body">
          Four optional parameters refine how the consumption model handles acceleration, braking, and elevation changes. They require <code className="ic">vehicleWeight</code> and must be supplied in pairs — you cannot set uphill without downhill, or acceleration without deceleration.
        </p>

        <table className="prop-table" style={{ marginBottom: 20 }}>
          <thead>
            <tr><th>Parameter</th><th>Definition</th><th>Typical value</th><th>Pair</th></tr>
          </thead>
          <tbody>
            {[
              ['accelerationEfficiency', 'KineticEnergyGained / ElectricEnergyConsumed', '0.90–0.93', 'deceleration'],
              ['decelerationEfficiency', 'ElectricEnergyGained / KineticEnergyLost',     '0.84–0.87', 'acceleration'],
              ['uphillEfficiency',       'PotentialEnergyGained / ElectricEnergyConsumed','0.90–0.93','downhill'],
              ['downhillEfficiency',     'ElectricEnergyGained / PotentialEnergyLost',   '0.86–0.89', 'uphill'],
            ].map(([param, def, typ, pair]) => (
              <tr key={param}>
                <td><code style={{ fontSize: '0.75rem' }}>{param}</code></td>
                <td style={{ fontSize: '0.875rem' }}>{def}</td>
                <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{typ}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Pair with <code style={{ fontSize: '0.75rem' }}>{pair}Efficiency</code></td>
              </tr>
            ))}
          </tbody>
        </table>

        <CodeBlock language="bash" code={CODE_EFFICIENCY} />
        <Callout type="info">
          All four efficiency values default to 0.9 when not supplied. The routing engine uses a typical driving scenario at 2% slope / 80 km/h as the reference. Efficiency values are independent of vehicle weight — do not update them when weight changes.
        </Callout>
      </div>

      {/* Auxiliary power */}
      <div className="zone">
        <h2 className="sh" id="lbm-aux">Auxiliary power</h2>
        <p className="body">
          Pass <code className="ic">auxiliaryPowerInkW</code> as a query parameter to account for non-drivetrain electrical load — climate control, infotainment, lighting, and heated seats. This is added to the consumption curve at every point.
        </p>
        <table className="prop-table">
          <thead><tr><th>Scenario</th><th>Typical auxiliaryPowerInkW</th><th>Range impact</th></tr></thead>
          <tbody>
            {[
              ['Summer, mild climate',   '0.25–0.40', '~3–5%'],
              ['Summer, hot + AC',       '0.60–1.00', '~8–12%'],
              ['Winter, moderate cold',  '0.80–1.50', '~15–22%'],
              ['Winter, severe cold',    '1.50–2.50', '~25–35%'],
              ['Not supplied (default)', '0 (no adjustment)', 'Consumption curve only'],
            ].map(([s, v, i]) => (
              <tr key={s}><td>{s}</td><td><code className="ic">{v}</code></td><td style={{ color: 'var(--mid)' }}>{i}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
