import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';
import { useDemoStyle } from '../hooks/useDemoStyle';

const BATTERY_APIS = [
  { name: 'Vehicle Metadata',             type: 'Android SDK', description: 'Build EV vehicle selection UIs and retrieve a configured EV object — battery, connectors, consumption — for route planning.', pageId: 'navsdk-adv-vehicle',    productId: 'navsdk' },
  { name: 'EV Routing Consumption Model', type: 'REST API',    description: 'Reference for battery curve, consumption curve, and efficiency parameter constraints used by the routing engine.',              pageId: 'ldevr-battery-model',   productId: 'ldevr' },
  { name: 'Long-Distance EV Routing',     type: 'REST API',    description: 'Calculate multi-stop routes with automatic charging stop insertion — battery model defined here drives stop placement.',          pageId: 'ev-routing',            productId: 'ux-library' },
  { name: 'EV Charging Search',           type: 'Android SDK', description: 'Discover compatible charging stations — connector type matching is driven by the vehicle profile configured here.',                pageId: 'ev-charging-search',    productId: 'ux-library' },
];

/* ─── Vehicle class preset data ─────────────────────────────────────────────── */
// nominalKwh  — spec-sheet maximum at 20°C (fixed for vehicle variant)
// capacity    — usable after aging (current battery capacity, stable during trip)
// soe         — demo starting state of energy
// consumption — [[speed km/h, Wh/km], ...] baseline: 20°C, flat, no HVAC
//               7 points from 10→120 km/h. REST API equivalent: Wh/km ÷ 10 = kWh/100km.
export const PRESETS = {
  city: {
    nominalKwh: 44, capacity: 40, soe: 28,
    curve: [[0,30],[10,80],[28,40],[36,15]],
    consumption: [[10,114],[30,92],[50,95],[70,112],[90,135],[110,165],[120,185]],
    uphill: 0.91, downhill: 0.88, accel: 0.92, decel: 0.85,
    auxPower: 400,
    connectors: ['IEC_62196_TYPE_2_CABLE'],
    color: '#10b981',
  },
  family: {
    nominalKwh: 82, capacity: 75, soe: 45,
    curve: [[0,50],[20,150],[56,75],[72,20]],
    consumption: [[10,138],[30,108],[50,115],[70,136],[90,165],[110,200],[120,225]],
    uphill: 0.92, downhill: 0.88, accel: 0.90, decel: 0.85,
    auxPower: 500,
    connectors: ['IEC_62196_TYPE_2_COMBO', 'IEC_62196_TYPE_2_CABLE'],
    color: '#3b82f6',
  },
  performance: {
    nominalKwh: 109, capacity: 100, soe: 75,
    curve: [[0,80],[30,250],[70,120],[92,25]],
    consumption: [[10,152],[30,118],[50,125],[70,148],[90,178],[110,215],[120,245]],
    uphill: 0.93, downhill: 0.89, accel: 0.91, decel: 0.87,
    auxPower: 600,
    connectors: ['IEC_62196_TYPE_2_COMBO', 'IEC_62196_TYPE_2_CABLE'],
    color: '#ef4444',
  },
  suv: {
    nominalKwh: 98, capacity: 90, soe: 60,
    curve: [[0,60],[25,180],[65,90],[85,22]],
    consumption: [[10,162],[30,128],[50,138],[70,164],[90,198],[110,240],[120,270]],
    uphill: 0.91, downhill: 0.87, accel: 0.89, decel: 0.84,
    auxPower: 550,
    connectors: ['IEC_62196_TYPE_2_COMBO', 'IEC_62196_TYPE_2_CABLE', 'CHADEM_O'],
    color: '#f59e0b',
  },
};

/* ─── Battery charge curve mini-visualisation ────────────────────────────────── */
function ChargeCurve({ points, color, capacity }) {
  const W = 220, H = 80, PAD = 12;
  const maxKw = Math.max(...points.map(p => p[1])) * 1.1;
  const toX = kwh => PAD + ((kwh / capacity) * (W - PAD * 2));
  const toY = kw  => H - PAD - ((kw / maxKw) * (H - PAD * 2));
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`).join(' ');
  const fill = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`).join(' ')
    + ` L ${toX(points[points.length-1][0]).toFixed(1)} ${H-PAD} L ${toX(points[0][0]).toFixed(1)} ${H-PAD} Z`;

  return (
    <div>
      <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Charge rate curve</div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <path d={fill} fill={`${color}18`} />
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3.5" fill={color} />
        ))}
        <text x={PAD} y={H} fontSize="9" fill="var(--muted)">0%</text>
        <text x={W - PAD} y={H} fontSize="9" fill="var(--muted)" textAnchor="end">100%</text>
        <text x={0} y={PAD + 4} fontSize="9" fill="var(--muted)">{Math.round(maxKw / 1.1)} kW</text>
      </svg>
    </div>
  );
}

/* ─── Consumption curve mini-visualisation ───────────────────────────────────── */
export function ConsumptionCurve({ points, color, width = 220, height = 80, showLabel = true }) {
  const W = width, H = height, PAD = 12;
  const maxWh = Math.max(...points.map(p => p[1])) * 1.1;
  const maxSpd = Math.max(...points.map(p => p[0]));
  const toX = s  => PAD + ((s / maxSpd) * (W - PAD * 2));
  const toY = wh => H - PAD - ((wh / maxWh) * (H - PAD * 2));
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`).join(' ');
  const fill = d + ` L ${toX(maxSpd).toFixed(1)} ${H-PAD} L ${toX(points[0][0]).toFixed(1)} ${H-PAD} Z`;

  return (
    <div>
      {showLabel && <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speed consumption (Wh/km)</div>}
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <path d={fill} fill={`${color}18`} />
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3" fill={color} />
        ))}
        <text x={PAD} y={H} fontSize="9" fill="var(--muted)">10</text>
        <text x={W - PAD} y={H} fontSize="9" fill="var(--muted)" textAnchor="end">{maxSpd} km/h</text>
        <text x={PAD} y={PAD + 4} fontSize="9" fill="var(--muted)">{Math.round(maxWh / 1.1)} Wh/km</text>
      </svg>
    </div>
  );
}

/* ─── Default charging curve shape ──────────────────────────────────────────── */
// Reference percentages from TomTom EV routing docs — use when measured data is unavailable.
// X = SoC %, Y = % of peak charging power.
const DEFAULT_CURVE_SHAPE = [[0,35],[5,90],[10,100],[35,100],[50,90],[70,50],[100,5]];

function DefaultChargeCurveViz({ color }) {
  const W = 260, H = 90, PL = 16, PR = 16, PT = 16, PB = 24;
  const iW = W - PL - PR, iH = H - PT - PB;
  const toX = soc => PL + (soc / 100) * iW;
  const toY = pct => H - PB - (pct / 100) * iH;
  const d = DEFAULT_CURVE_SHAPE.map(([s, p], i) => `${i===0?'M':'L'} ${toX(s).toFixed(1)} ${toY(p).toFixed(1)}`).join(' ');
  const fill = d + ` L ${toX(100).toFixed(1)} ${H-PB} L ${toX(0).toFixed(1)} ${H-PB} Z`;

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <path d={fill} fill={`${color}18`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {DEFAULT_CURVE_SHAPE.map(([s, p], i) => (
        <circle key={i} cx={toX(s)} cy={toY(p)} r="3" fill={color} />
      ))}
      {/* Guide dashes: flat-top range 10%–35% */}
      <line x1={toX(10)} y1={toY(100)} x2={toX(10)} y2={H-PB} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={toX(35)} y1={toY(100)} x2={toX(35)} y2={H-PB} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
      <text x={toX(0)}   y={H-8} fontSize="9" fill="var(--muted)" textAnchor="middle">0%</text>
      <text x={toX(10)}  y={H-8} fontSize="9" fill={color}        textAnchor="middle">10%</text>
      <text x={toX(35)}  y={H-8} fontSize="9" fill={color}        textAnchor="middle">35%</text>
      <text x={toX(70)}  y={H-8} fontSize="9" fill="var(--muted)" textAnchor="middle">70%</text>
      <text x={toX(100)} y={H-8} fontSize="9" fill="var(--muted)" textAnchor="middle">100%</text>
      <text x={PL} y={PT+2} fontSize="9" fill="var(--muted)">Peak power</text>
    </svg>
  );
}

/* ─── Generated configuration code ──────────────────────────────────────────── */
function buildCode(cls, p) {
  const clsName = cls.charAt(0).toUpperCase() + cls.slice(1);
  const curvePts = p.curve.map(([kwh, kw], i) => {
    const socPct = Math.round((kwh / p.capacity) * 100);
    const comments = {
      0: 'SoC floor — taper begins from rest',
      1: 'peak DC charge rate',
      [p.curve.length - 2]: 'first taper threshold',
      [p.curve.length - 1]: 'final taper — preserve cell health',
    };
    const comment = comments[i] ? `  // ${socPct}% SoC: ${comments[i]}` : `  // ${socPct}% SoC`;
    return `        Point(${kwh}.0, ${kw}.0)${comment}`;
  }).join(',\n');

  const consumpPts = p.consumption.map(([spd, wh]) => {
    const label =
      spd <= 20  ? '// urban crawl'   :
      spd <= 60  ? '// city/suburban' :
      spd <= 100 ? '// motorway'      : '// high-speed motorway';
    return `        EvSpeedConsumptionPoint(Speed.kilometersPerHour(${spd}.0), ${wh}.0)  ${label}`;
  }).join(',\n');

  const connectorLines = p.connectors.map(c => {
    const isAC = c.includes('CABLE');
    const type = isAC ? 'ElectricityType.AC' : 'ElectricityType.DC';
    const note = isAC ? '// AC home / destination charging' : '// DC rapid charging';
    return `        ConnectorInfo(VehicleConnectorType.${c}, ${type})  ${note}`;
  }).join(',\n');

  return `/**
 * ${clsName}EVConfiguration.kt
 *
 * Static vehicle programme parameters — sourced from EV Spec Sheet.
 * Update only when the vehicle programme changes, not at runtime.
 * Nominal capacity: ${p.nominalKwh} kWh  |  Current usable: ${p.capacity} kWh
 */
class ${clsName}EVConfiguration(
    private val vehicleInfoManager: VehicleInfoManager
) {

    /** Call once in Application.onCreate() before any navigation session starts. */
    fun apply(onComplete: (success: Boolean) -> Unit) {
        val results = mutableListOf<Boolean>()
        val expected = 5

        fun check(ok: Boolean) {
            results += ok
            if (results.size == expected) onComplete(results.all { it })
        }

        vehicleInfoManager.sendBatteryInfo(buildBatteryParams()) { r ->
            check(r is Success)
        }
        vehicleInfoManager.sendConsumptionCurve(buildConsumptionParams()) { r ->
            check(r is Success)
        }
        vehicleInfoManager.sendEvEfficiency(buildEfficiencyParams()) { r ->
            check(r is Success)
        }
        vehicleInfoManager.sendConnectorInfo(buildConnectorParams()) { r ->
            check(r is Success)
        }
        vehicleInfoManager.sendAuxiliaryPower(buildAuxiliaryParams()) { r ->
            check(r is Success)
        }
    }

    // ── Battery capacity & charge curve ──────────────────────────────────────
    // currentBatteryCapacity = usable after aging; lower than the spec-sheet nominal.
    // Curve maps State-of-Energy (kWh) → max charge rate (kW). 2–20 points.
    private fun buildBatteryParams() = BatteryInfoParameters.Builder()
        .currentBatteryCapacity(Energy.kilowattHours(${p.capacity}.0))
        .batteryChargeCurve(listOf(
${curvePts}
        ))
        .build()

    // ── Speed → energy consumption (Wh/km) ───────────────────────────────────
    // Baseline at 20°C, flat road, solo occupant, no payload, no HVAC.
    // REST API equivalent: Wh/km ÷ 10 = kWh/100km.
    // 15–25 points required; must span 10 km/h → vehicle v_max.
    private fun buildConsumptionParams() = ConsumptionCurveParameters.Builder()
        .speedConsumptionCurve(EvSpeedConsumptionCurve(listOf(
${consumpPts}
        )))
        .build()

    // ── Drivetrain efficiency factors ─────────────────────────────────────────
    // All values in range [0, 1]. Defaults to 0.9 if unavailable.
    // Use vehicle programme dyno data (typical scenario: 2% slope at 80 km/h).
    private fun buildEfficiencyParams() = EvEfficiencyParameters.Builder()
        .uphillEfficiency(${p.uphill}f)         // PotentialEnergyGained / ElectricEnergyConsumed
        .downhillEfficiency(${p.downhill}f)      // ElectricEnergyGained / PotentialEnergyLost
        .accelerationEfficiency(${p.accel}f)    // KineticEnergyGained / ElectricEnergyConsumed
        .decelerationEfficiency(${p.decel}f)    // ElectricEnergyGained / KineticEnergyLost
        .build()

    // ── Supported connector types ─────────────────────────────────────────────
    // Drives automatic connector compatibility filtering in EV Search results.
    private fun buildConnectorParams() = ConnectorInfoParameters.Builder()
        .vehicleConnectors(listOf(
${connectorLines}
        ))
        .build()

    // ── Auxiliary electrical load ─────────────────────────────────────────────
    // 5-minute rolling average: HVAC, infotainment, lighting, seat heating, ADAS.
    // Default 500 W when not supplied. Winter peak: ~${Math.round(p.auxPower * 2.4)} W.
    private fun buildAuxiliaryParams() = AuxiliaryPowerParameters.Builder()
        .auxiliaryPower(Power.watts(${p.auxPower}.0))
        .build()
}`;
}

const CODE_SDK_VEHICLE = `/**
 * EVVehicleViewModel.kt
 *
 * Bridges your vehicle's BMS into the Navigation SDK's VehicleProvider.
 * Owns two distinct responsibilities:
 *   1. Static init  — set the vehicle type once per session (Application.onCreate)
 *   2. Dynamic sync — forward live SoC from BMS at ~1 Hz throughout the session
 *
 * Extend ViewModel so the BMS subscription survives screen rotations but is
 * automatically cancelled when the owning Activity/Fragment is destroyed.
 */
class EVVehicleViewModel(
    private val bmsRepository: BmsRepository       // your OEM BMS data layer
) : ViewModel() {

    private var bmsJob: Job? = null

    // ── 1. Static vehicle type init ───────────────────────────────────────────
    // Call once per navigation session before route calculation begins.
    // SoC here is the reading at session start — snapshot from BMS, not estimated.
    fun initVehicle(currentSocKwh: Double, maxCapacityKwh: Double) {
        VehicleProvider.vehicle = Vehicle.Car(
            electricEngine = ElectricEngine(
                chargeLevel = ChargeLevel(
                    current = Energy.kilowattHours(currentSocKwh),
                    max     = Energy.kilowattHours(maxCapacityKwh)
                )
            )
        )
    }

    // ── 2. Dynamic SoC sync ───────────────────────────────────────────────────
    // Start after initVehicle(). BMS typically reports at 0.5–2 Hz; 1 Hz is ideal.
    // The SDK re-evaluates range ring and charging stop plan on each update.
    fun startBmsSync() {
        bmsJob?.cancel() // guard against duplicate calls
        bmsJob = viewModelScope.launch {
            bmsRepository.socFlow()           // StateFlow<Double> of kWh from BMS
                .distinctUntilChanged()        // skip redundant SDK calls
                .collect { socKwh ->
                    VehicleProvider.updateVehicleProperties(
                        listOf(
                            ElectricEngineProperties(
                                listOf(CurrentChargeProperty(Energy.kilowattHours(socKwh)))
                            )
                        )
                    )
                }
        }
    }

    // ── 3. Listen for SDK-side state changes ──────────────────────────────────
    // The SDK may adjust SoC internally (e.g. after charging stop).
    // Use this to keep your cluster / HUD in sync with what the SDK believes.
    fun observeVehicleState(onChargeUpdated: (Energy) -> Unit) {
        VehicleProvider.addVehicleUpdatedListener { vehicle, updatedProperties ->
            if (PropertyId.CurrentCharge in updatedProperties) {
                val charge = (vehicle.engine as? ElectricEngine)
                    ?.chargeLevel?.current ?: return@addVehicleUpdatedListener
                onChargeUpdated(charge)
            }
        }
    }

    // ── 4. Session resume ─────────────────────────────────────────────────────
    // When the driver returns to a paused navigation session, re-seed VehicleProvider
    // with the latest BMS reading rather than replaying the stale session SoC.
    fun resumeSession() {
        val latestSoc = bmsRepository.currentSocKwh()
        VehicleProvider.updateVehicleProperties(
            listOf(
                ElectricEngineProperties(
                    listOf(CurrentChargeProperty(Energy.kilowattHours(latestSoc)))
                )
            )
        )
    }

    override fun onCleared() {
        super.onCleared()
        bmsJob?.cancel()   // BMS flow automatically unsubscribed on VM destruction
    }
}`;

export default function EVBattery({ onNavigate }) {
  const { t } = useTranslation('ev');
  const [cls, setCls] = useState('family');
  const p = PRESETS[cls];
  const classes = ['city', 'family', 'performance', 'suv'];

  const PARAMS = [
    ['nominalBatteryCapacity',  'Energy (kWh)',         'Spec-sheet maximum at 20°C. Fixed for the vehicle variant. Never changes at runtime.'],
    ['currentBatteryCapacity',  'Energy (kWh)',         'Usable after aging. Must stay stable during a trip — fluctuations above 0.3% cause stop instability.'],
    ['stateOfEnergy',           'Energy (kWh)',         'Current charge. Update at 1 Hz; fluctuation < 0.3%. Range: [0, currentBatteryCapacity].'],
    ['batteryChargeCurve',      'List<Point(SoE, kW)>', '2–20 entries. Piecewise-linear. First point must be at 0 kWh. Piecewise-constant also accepted.'],
    ['speedConsumptionCurve',   'List<(km/h, Wh/km)>', '15–25 points. Must span 10 km/h → v_max. Baseline: 20°C, flat, no HVAC.'],
    ['uphillEfficiency',        'Float (0–1)',          'PotentialEnergyGained / ElectricEnergyConsumed. Default 0.9.'],
    ['downhillEfficiency',      'Float (0–1)',          'ElectricEnergyGained / PotentialEnergyLost. Default 0.9.'],
    ['accelerationEfficiency',  'Float (0–1)',          'KineticEnergyGained / ElectricEnergyConsumed. Default 0.9.'],
    ['decelerationEfficiency',  'Float (0–1)',          'ElectricEnergyGained / KineticEnergyLost. Default 0.9.'],
    ['vehicleConnectors',       'List<ConnectorInfo>',  'Drives station compatibility filtering in EV Search. Include all physically supported types.'],
    ['auxiliaryPower',          'Power (W)',            'Default 500 W. 5-minute rolling average. Includes HVAC, infotainment, lighting, ADAS.'],
    ['chargingTimeOffset',      'Duration (s)',         'Plug-in/out overhead. Default: 60 s (REST API), 180 s (Navigation SDK / ANA).'],
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('battery.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('battery.intro')}</div>

      <ApiLinks items={BATTERY_APIS} onNavigate={onNavigate} />

      {/* ── 1. Vehicle class preset builder ─────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-presets">{t('battery.presets.heading')}</h2>
        <p className="body">{t('battery.presets.body')}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {classes.map(c => (
            <button key={c} onClick={() => setCls(c)} style={{
              padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              background: cls === c ? PRESETS[c].color : 'var(--white)',
              color: cls === c ? '#fff' : 'var(--black)',
              border: cls === c ? `1.5px solid ${PRESETS[c].color}` : '1.5px solid var(--border)',
              transition: 'all 0.15s',
            }}>
              {t(`battery.presets.classes.${c}`)}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
          {[
            ['🔋', t('battery.presets.stats.capacity'),       `${p.capacity} kWh usable`],
            ['⚡', t('battery.presets.stats.peakCharge'),     `${Math.max(...p.curve.map(([,kw]) => kw))} kW`],
            ['📉', t('battery.presets.stats.highwayConsumed'),`${p.consumption[p.consumption.length-1][1]} Wh/km (${(p.consumption[p.consumption.length-1][1]/10).toFixed(1)} kWh/100km)`],
            ['🔌', t('battery.presets.stats.aux'),            `${p.auxPower} W`],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ padding: '12px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '1rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: p.color }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <ChargeCurve points={p.curve} color={p.color} capacity={p.capacity} />
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <ConsumptionCurve points={p.consumption} color={p.color} />
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {t('battery.presets.generatedCode')}
        </div>
        <CodeBlock language="kotlin" code={buildCode(cls, p)} />
        <Callout type="info">{t('battery.presets.callout')}</Callout>
      </div>

      {/* ── 2. Battery capacity — nominal vs current ─────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-capacity">{t('battery.capacity.heading')}</h2>
        <p className="body">{t('battery.capacity.body')}</p>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value — {t(`battery.presets.classes.${cls}`)}</th>
                <th>What it represents</th>
                <th>When to update</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>nominalBatteryCapacity</code></td>
                <td><span style={{ color: 'var(--mid)', fontWeight: 700 }}>{p.nominalKwh} kWh</span></td>
                <td>Maximum extractable energy at 20°C — the value on the spec sheet. Fixed for the vehicle variant.</td>
                <td style={{ color: 'var(--muted)' }}>Set once per vehicle variant. Never changes at runtime.</td>
              </tr>
              <tr>
                <td><code>currentBatteryCapacity</code></td>
                <td><span style={{ color: '#d29922', fontWeight: 700 }}>{p.capacity} kWh</span></td>
                <td>Usable capacity after aging. Batteries lose 2–3% per year. This is the value the routing engine uses for range calculations.</td>
                <td style={{ color: 'var(--muted)' }}>Set at session start from OEM SoH data. Do not update mid-trip.</td>
              </tr>
              <tr>
                <td><code>stateOfEnergy</code></td>
                <td><span style={{ color: p.color, fontWeight: 700 }}>{p.soe} kWh</span></td>
                <td>Current charge. Maps linearly to the driver-facing percentage: 0 kWh = 0%, {p.capacity} kWh = 100%.</td>
                <td style={{ color: 'var(--muted)' }}>Update continuously at 1 Hz from BMS. Keep fluctuation below 0.3%.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout type="warn">{t('battery.capacity.stabilityCallout')}</Callout>
      </div>

      {/* ── 3. Navigation SDK VehicleProvider ───────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-provider">{t('vehicleSetup.vehicleProvider.heading')}</h2>
        <p className="body">{t('vehicleSetup.vehicleProvider.body')}</p>
        <CodeBlock language="kotlin" code={CODE_SDK_VEHICLE} />
      </div>

      {/* ── 4. Charging parameters ───────────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-charging-params">{t('battery.chargingParams.heading')}</h2>
        <p className="body">{t('battery.chargingParams.body')}</p>

        {/* Charging curve */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 8px' }}>{t('battery.chargingParams.curve.heading')}</h3>
        <p className="body" style={{ marginBottom: 16 }}>{t('battery.chargingParams.curve.body')}</p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-start' }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default curve shape</div>
            <DefaultChargeCurveViz color={p.color} />
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6, maxWidth: 260 }}>
              Flat top at 10–35% SoC, then tapering to protect cell health above 70%.
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8, color: 'var(--mid)' }}>Default reference points</div>
            <table className="prop-table" style={{ fontSize: '0.8125rem' }}>
              <thead><tr><th>SoC</th><th>% of peak power</th></tr></thead>
              <tbody>
                {DEFAULT_CURVE_SHAPE.map(([soc, pct]) => (
                  <tr key={soc}>
                    <td>{soc}%</td>
                    <td><code className="ic">{pct}%</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
              Use only when supplier-provided curve data is unavailable. Always prefer measured battery data for production.
            </div>
          </div>
        </div>

        {/* Effective charging power */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 8px' }}>{t('battery.chargingParams.power.heading')}</h3>
        <p className="body" style={{ marginBottom: 12 }}>{t('battery.chargingParams.power.body')}</p>

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

        <table className="prop-table" style={{ marginBottom: 24 }}>
          <thead><tr><th>Variable</th><th>Typical value</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['efficiency',   'AC: 0.90 / DC: ~1.0',        'Fraction of station power reaching the battery after cable and charger losses.'],
              ['curve(SoE)',   'Vehicle-specific',             'Maximum power the battery accepts at the current state of energy — from the charging curve.'],
              ['P_available',  'Station-reported (kW)',        'Rated output of the connected charging station.'],
              ['baseLoad',     'AC: 0.1–0.5 kW / DC: 0.4–1.0 kW', 'Power drawn by on-vehicle systems during charging: BMS, HVAC pre-conditioning, cabin systems.'],
            ].map(([v, val, desc]) => (
              <tr key={v}>
                <td><code>{v}</code></td>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--mid)' }}>{val}</td>
                <td style={{ fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Connector compatibility */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 8px' }}>{t('battery.chargingParams.connectors.heading')}</h3>
        <p className="body" style={{ marginBottom: 12 }}>{t('battery.chargingParams.connectors.body')}</p>

        <table className="prop-table">
          <thead><tr><th>Plug type</th><th>Current type</th><th>Typical use</th></tr></thead>
          <tbody>
            {[
              ['IEC_62196_TYPE_2_CABLE', 'AC (AC1 / AC3)',    'Home, destination, and AC public charging — Europe standard'],
              ['IEC_62196_TYPE_2_COMBO', 'DC',                'CCS2 — standard DC rapid charging across Europe'],
              ['IEC_62196_TYPE_1',       'AC (AC1)',           'Type 1 markets: Japan, North America'],
              ['IEC_62196_TYPE_1_COMBO', 'DC',                'CCS1 — DC rapid charging in North America and Japan'],
              ['CHADEM_O',               'DC',                'CHAdeMO — legacy DC, some Japanese OEMs'],
              ['GBT_AC',                 'AC',                'China market — GB/T AC standard'],
              ['GBT_DC',                 'DC',                'China market — GB/T DC rapid charging'],
            ].map(([plug, ct, use]) => (
              <tr key={plug}>
                <td><code className="ic">{plug}</code></td>
                <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{ct}</td>
                <td style={{ fontSize: '0.875rem' }}>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 5. Auxiliary power ───────────────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-aux">{t('battery.aux.heading')}</h2>
        <p className="body">{t('battery.aux.body')}</p>
        <table className="prop-table">
          <thead><tr><th>{t('battery.aux.colVehicle')}</th><th>{t('battery.aux.colLoad')}</th><th>{t('battery.aux.colImpact')}</th></tr></thead>
          <tbody>
            {[
              ['City EV (summer)',       '250–400 W',   '~5% range reduction'],
              ['City EV (winter)',       '600–1200 W',  '~15–25% range reduction'],
              ['Family EV (summer)',     '400–600 W',   '~6% range reduction'],
              ['Family EV (winter)',     '800–1500 W',  '~18–28% range reduction'],
              ['Performance EV (HVAC)', '600–900 W',   '~8% range reduction'],
              ['SUV (cold climate)',     '1000–2000 W', '~20–35% range reduction'],
            ].map(([v, l, i]) => <tr key={v}><td>{v}</td><td><code className="ic">{l}</code></td><td style={{ color: 'var(--mid)' }}>{i}</td></tr>)}
          </tbody>
        </table>
        <Callout type="warn">{t('battery.aux.callout')}</Callout>
      </div>

      {/* ── 6. Charging time offset ──────────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-offset">{t('battery.offset.heading')}</h2>
        <p className="body">{t('battery.offset.body')}</p>
        <table className="prop-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Integration</th><th>Default offset</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Online Routing API (REST)',        '60 s',  'Lower default — assumes automated or fast cable connection scenarios.'],
              ['Navigation SDK',                   '180 s', 'Higher default — accounts for exiting the vehicle, walking to the charger, and session initiation.'],
              ['Automotive Navigation Application','180 s', 'Same as Navigation SDK.'],
              ['Minimum charge time',              '300 s', 'Non-configurable floor. The SDK always adds at least 5 minutes at any stop, even if less charge is needed.'],
            ].map(([integ, def, note]) => (
              <tr key={integ}>
                <td>{integ}</td>
                <td><code className="ic">{def}</code></td>
                <td style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 7. Full parameters reference ────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="evb-params">{t('vehicleSetup.paramsTable.heading')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>{t('vehicleSetup.paramsTable.colParam')}</th>
                <th>{t('vehicleSetup.paramsTable.colType')}</th>
                <th>{t('vehicleSetup.paramsTable.colNotes')}</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS.map(([param, typ, notes]) => (
                <tr key={param}><td><code>{param}</code></td><td style={{ whiteSpace: 'nowrap' }}>{typ}</td><td>{notes}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="warn">{t('vehicleSetup.vehicleApi.callout')}</Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}

export function EVBatteryDemo() {
  const M = useDemoStyle();
  const [cls, setCls] = useState('family');
  return (
    <div style={{ padding: 20, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Vehicle Class Preset</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { id: 'compact', label: 'Compact EV', range: '38 kWh · 250 km' },
          { id: 'family',  label: 'Family EV',  range: '77 kWh · 500 km' },
          { id: 'suv',     label: 'SUV EV',     range: '100 kWh · 580 km' },
          { id: 'truck',   label: 'EV Truck',   range: '135 kWh · 480 km' },
        ].map(c => (
          <button key={c.id} onClick={() => setCls(c.id)} style={{
            padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: '0.8125rem',
            background: cls === c.id ? M.green : 'var(--bg)',
            color: cls === c.id ? '#fff' : 'var(--mid)',
            border: `1px solid ${cls === c.id ? M.green : 'var(--border)'}`,
            fontWeight: cls === c.id ? 700 : 400,
          }}>
            <div>{c.label}</div>
            <div style={{ fontSize: '0.6875rem', opacity: 0.75, marginTop: 2 }}>{c.range}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--mid)' }}>
        <span style={{ color: M.blue }}>VehicleOptions.Builder</span>{'()'}
        <br />{'  .'}<span style={{ color: M.blue }}>batteryCapacityKwh</span>{'('}<span style={{ color: M.green }}>{cls === 'compact' ? '38.0' : cls === 'family' ? '77.4' : cls === 'suv' ? '100.0' : '135.0'}</span>{')'}
        <br />{'  .'}<span style={{ color: M.blue }}>maxChargeRateKw</span>{'('}<span style={{ color: M.green }}>{cls === 'compact' ? '100' : cls === 'family' ? '250' : cls === 'suv' ? '300' : '350'}</span>{')'}
        <br />{'  .'}<span style={{ color: M.blue }}>build</span>{'()'}
      </div>
    </div>
  );
}
