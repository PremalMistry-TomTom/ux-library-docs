import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_CONNECTOR = `# Charging connectors in POST body
# Defines which connector types the vehicle supports and their physical limits.
# The routing engine uses this to filter compatible charging stations.

{
  "chargingParameters": {
    "chargingConnectors": [
      {
        "currentType": "DC",
        "plugTypes": [
          "IEC_62196_Type_2_Outlet",
          "Combo_to_IEC_62196_Type_2_Base"
        ],
        "maxPowerInkW": 150,
        "voltageRange": {
          "minVoltageInV": 200,
          "maxVoltageInV": 920
        },
        "efficiency": 0.97,
        "baseLoadInkW": 0.5
      },
      {
        "currentType": "AC3",
        "plugTypes": [
          "IEC_62196_Type_2_Outlet"
        ],
        "maxPowerInkW": 11,
        "efficiency": 0.90,
        "baseLoadInkW": 0.15
      }
    ]
  }
}`;

const CODE_POWER_FORMULA = `# Effective charging power at any given state of energy:
#
#   P(SoE) = efficiency × min( curve(SoE), P_available − baseLoad )
#
# Where:
#   curve(SoE)   = max power battery accepts at current SoE (from batteryCurve)
#   P_available  = rated output power of the connected station
#   baseLoad     = on-vehicle systems drawing power during charging
#   efficiency   = fraction of station power reaching the battery
#
# Example: 150 kW station, battery curve allows 120 kW at current SoC,
#          efficiency 0.97, baseLoad 0.5 kW
#
#   P = 0.97 × min(120, 150 − 0.5)
#   P = 0.97 × min(120, 149.5)
#   P = 0.97 × 120
#   P ≈ 116.4 kW effective`;

/* ─── Plug type table data ───────────────────────────────────────────────────── */
const PLUG_TYPES = [
  {
    group: 'CCS (Combined Charging System)',
    color: '#3b82f6',
    plugs: [
      ['Combo_to_IEC_62196_Type_2_Base', 'DC', 'CCS2 — standard DC rapid charging in Europe'],
      ['Combo_to_IEC_62196_Type_1_Base', 'DC', 'CCS1 — DC rapid charging in North America, Japan'],
    ],
  },
  {
    group: 'IEC 62196 (Mennekes / Type 2)',
    color: '#8b5cf6',
    plugs: [
      ['IEC_62196_Type_2_Outlet',  'AC3 / AC1', 'Type 2 — universal AC charging across Europe'],
      ['IEC_62196_Type_3_Outlet',  'AC1',       'Type 3 — legacy French/Italian standard'],
      ['IEC_62196_Type_1_Outlet',  'AC1',       'Type 1 (SAE J1772) — Japan, North America'],
    ],
  },
  {
    group: 'DC Legacy',
    color: '#d29922',
    plugs: [
      ['CHAdeMO',         'DC', 'CHAdeMO — legacy DC; some Japanese and Korean OEMs'],
      ['Tesla_Connector', 'DC', 'Tesla proprietary; North America (pre-NACS)'],
    ],
  },
  {
    group: 'China GB/T',
    color: '#10b981',
    plugs: [
      ['GBT_AC', 'AC', 'China market — GB/T AC standard'],
      ['GBT_DC', 'DC', 'China market — GB/T DC rapid charging'],
    ],
  },
  {
    group: 'Household / Other',
    color: '#6b7280',
    plugs: [
      ['Standard_Household_Country_Specific', 'AC1', 'Schuko, UK 3-pin, etc. — slow charging'],
      ['Type_E_French_Standard_CEE_7_5',     'AC1',  'French Type E socket'],
      ['Type_F_Schuko_CEE_7_4',              'AC1',  'Schuko socket — Germany, most of Europe'],
      ['SAE_J1772',                           'AC1',  'SAE J1772 — North America Level 2'],
    ],
  },
];

export default function LDEVRConnectors() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Connector Types</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        The <code className="ic" style={{ fontSize: '0.9375rem' }}>chargingConnectors</code> array tells LDEVR which plug types the vehicle supports and sets the physical limits for charging power. The routing engine uses this information to filter compatible stations and calculate realistic stop durations.
      </div>

      {/* Connector structure */}
      <div className="zone">
        <h2 className="sh" id="lco-structure">Connector object</h2>
        <p className="body">
          Each entry in <code className="ic">chargingConnectors</code> represents one connector the vehicle supports. Most vehicles have two: a DC connector for rapid charging and an AC connector for destination/home charging.
        </p>
        <table className="prop-table" style={{ marginBottom: 20 }}>
          <thead>
            <tr><th>Field</th><th>Required</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            {[
              ['currentType',   'Yes', 'AC1 | AC3 | DC',   'Phase type. AC1 = single-phase, AC3 = three-phase, DC = direct current.'],
              ['plugTypes',     'Yes', 'string[]',          'One or more plug type codes (see reference table below). The station must match at least one.'],
              ['maxPowerInkW',  'No',  'float',             'Vehicle-side power ceiling. Effective power = min(this, station rating).'],
              ['voltageRange',  'No',  '{ min, max }',      'Optional voltage window to select the correct charging mode at multi-level stations.'],
              ['efficiency',    'No',  'float (0–1)',        'Fraction of station power that reaches the battery. Typical: 0.90 AC, 0.97 DC.'],
              ['baseLoadInkW',  'No',  'float',             'On-vehicle systems drawing power during charging (BMS, cabin, HVAC pre-cond). Typical: 0.1–0.5 kW AC, 0.4–1.0 kW DC.'],
            ].map(([field, req, type, desc]) => (
              <tr key={field}>
                <td><code style={{ fontSize: '0.75rem' }}>{field}</code></td>
                <td><span style={{ fontSize: '0.75rem', fontWeight: 700, color: req === 'Yes' ? 'var(--red)' : 'var(--muted)' }}>{req}</span></td>
                <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{type}</td>
                <td style={{ fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CodeBlock language="json" code={CODE_CONNECTOR} />
      </div>

      {/* Effective power formula */}
      <div className="zone">
        <h2 className="sh" id="lco-power">Effective charging power</h2>
        <p className="body">
          The actual power delivered to the battery at any point during a stop depends on what the vehicle can accept (the battery curve), what the station can supply, and the on-vehicle base load and efficiency losses.
        </p>
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '1rem',
          marginBottom: 16, letterSpacing: '0.01em',
        }}>
          <span style={{ color: '#58a6ff' }}>P</span>
          <span style={{ color: 'var(--fg)' }}>(SoE)</span>
          <span style={{ color: 'var(--muted)' }}> = </span>
          <span style={{ color: '#79c0ff' }}>efficiency</span>
          <span style={{ color: 'var(--muted)' }}> × min(</span>
          <span style={{ color: '#3fb950' }}>curve(SoE)</span>
          <span style={{ color: 'var(--muted)' }}>, </span>
          <span style={{ color: '#d29922' }}>P_available</span>
          <span style={{ color: 'var(--muted)' }}> − baseLoad)</span>
        </div>
        <CodeBlock language="bash" code={CODE_POWER_FORMULA} />
        <Callout type="info">
          When <code>efficiency</code> and <code>baseLoadInkW</code> are omitted, the routing engine assumes full efficiency (1.0) and no base load. This can overestimate the effective charging power by 3–10% — always supply these values when you have them.
        </Callout>
      </div>

      {/* Current types */}
      <div className="zone">
        <h2 className="sh" id="lco-current">Current types</h2>
        <p className="body">
          The <code className="ic">currentType</code> field must match the station infrastructure type, not just the plug shape. A Type 2 socket can be either AC or DC depending on the station.
        </p>
        <table className="prop-table" style={{ marginBottom: 8 }}>
          <thead>
            <tr><th>currentType</th><th>What it means</th><th>Typical power range</th></tr>
          </thead>
          <tbody>
            {[
              ['AC1', 'Single-phase AC. Home chargers, standard public Level 2.', '3.7 – 7.4 kW'],
              ['AC3', 'Three-phase AC. European fast AC chargers, Mennekes stations.', '11 – 22 kW'],
              ['DC',  'Direct current. Rapid and ultra-rapid charging.', '50 – 350+ kW'],
            ].map(([t, desc, pwr]) => (
              <tr key={t}>
                <td><code className="ic">{t}</code></td>
                <td style={{ fontSize: '0.875rem' }}>{desc}</td>
                <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{pwr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plug type reference */}
      <div className="zone">
        <h2 className="sh" id="lco-plug-types">Plug type reference</h2>
        <p className="body">
          Pass the string values below in the <code className="ic">plugTypes</code> array. A station is considered compatible if it offers at least one matching plug type with the correct current type.
        </p>
        {PLUG_TYPES.map(group => (
          <div key={group.group} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: group.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, paddingLeft: 2 }}>
              {group.group}
            </div>
            <table className="prop-table">
              <thead>
                <tr><th>plugTypes value</th><th>currentType</th><th>Common use</th></tr>
              </thead>
              <tbody>
                {group.plugs.map(([plug, ct, use]) => (
                  <tr key={plug}>
                    <td><code className="ic" style={{ fontSize: '0.75rem' }}>{plug}</code></td>
                    <td style={{ color: group.color, whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.875rem' }}>{ct}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <Callout type="info">
          Include all plug types the vehicle physically supports. If the vehicle has both a CCS2 and a Type 2 AC inlet, list both connectors — omitting one prevents the routing engine from selecting stations that only offer that connector type.
        </Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
