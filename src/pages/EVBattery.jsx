import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const BATTERY_APIS = [
  { name: 'Vehicle Integration API',        type: 'Android SDK', description: 'Send battery capacity, charge curve, consumption, connectors, and auxiliary load to the SDK via VehicleInfoManager.', url: 'https://docs.tomtom.com/automotive-solutions/en/guides/ev-integration' },
  { name: 'Navigation SDK — VehicleProvider', type: 'Android SDK', description: 'Set the initial vehicle type and charge level, then push live SoC updates from your BMS at runtime.', url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
  { name: 'EV Routing — Consumption Model', type: 'REST API',    description: 'Reference for battery curve, consumption curve, and efficiency parameter constraints used by the routing engine.', url: 'https://docs.tomtom.com/electric-vehicle/ev-routing/introduction' },
];

/* ─── Vehicle class preset data ─────────────────────────────────────────────── */
const PRESETS = {
  city: {
    capacity: 40,
    soe: 28,
    curve: [[0,30],[10,80],[28,40],[36,15]],
    consumption: [[10,120],[50,140],[80,160],[120,220]],
    uphill: 0.91, downhill: 0.88, accel: 0.92, decel: 0.85,
    auxPower: 400,
    connectors: ['IEC_62196_TYPE_2_CABLE'],
    color: '#10b981',
  },
  family: {
    capacity: 75,
    soe: 45,
    curve: [[0,50],[20,150],[56,75],[72,20]],
    consumption: [[10,150],[50,170],[80,200],[120,280]],
    uphill: 0.92, downhill: 0.88, accel: 0.90, decel: 0.85,
    auxPower: 500,
    connectors: ['IEC_62196_TYPE_2_COMBO', 'IEC_62196_TYPE_2_CABLE'],
    color: '#3b82f6',
  },
  performance: {
    capacity: 100,
    soe: 75,
    curve: [[0,80],[30,250],[70,120],[92,25]],
    consumption: [[10,180],[50,200],[80,220],[120,320]],
    uphill: 0.93, downhill: 0.89, accel: 0.91, decel: 0.87,
    auxPower: 600,
    connectors: ['IEC_62196_TYPE_2_COMBO', 'IEC_62196_TYPE_2_CABLE'],
    color: '#ef4444',
  },
  suv: {
    capacity: 90,
    soe: 60,
    curve: [[0,60],[25,180],[65,90],[85,22]],
    consumption: [[10,170],[50,195],[80,230],[120,310]],
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
      <div style={{ fontSize: '0.625rem', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Charge rate curve</div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <path d={fill} fill={`${color}18`} />
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3.5" fill={color} />
        ))}
        {/* Axis labels */}
        <text x={PAD} y={H} fontSize="9" fill="var(--muted)">0%</text>
        <text x={W - PAD} y={H} fontSize="9" fill="var(--muted)" textAnchor="end">100%</text>
        <text x={0} y={PAD + 4} fontSize="9" fill="var(--muted)">{Math.round(maxKw / 1.1)} kW</text>
      </svg>
    </div>
  );
}

/* ─── Consumption curve mini-visualisation ───────────────────────────────────── */
function ConsumptionCurve({ points, color }) {
  const W = 220, H = 80, PAD = 12;
  const maxWh = Math.max(...points.map(p => p[1])) * 1.1;
  const maxSpd = Math.max(...points.map(p => p[0]));
  const toX = s  => PAD + ((s / maxSpd) * (W - PAD * 2));
  const toY = wh => H - PAD - ((wh / maxWh) * (H - PAD * 2));
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`).join(' ');

  return (
    <div>
      <div style={{ fontSize: '0.625rem', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consumption (Wh/km)</div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3.5" fill={color} />
        ))}
        <text x={PAD} y={H} fontSize="9" fill="var(--muted)">10</text>
        <text x={W - PAD} y={H} fontSize="9" fill="var(--muted)" textAnchor="end">{maxSpd} km/h</text>
      </svg>
    </div>
  );
}

/* ─── Generated code ─────────────────────────────────────────────────────────── */
function buildCode(cls, p) {
  const clsName = cls.charAt(0).toUpperCase() + cls.slice(1);
  const nominalCap = Math.round(p.capacity * 1.09); // typical nominal is ~9% above usable
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
      spd <= 20  ? '// urban crawl'  :
      spd <= 60  ? '// city/suburban':
      spd <= 100 ? '// motorway'     : '// high-speed motorway';
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
 * Nominal capacity: ${nominalCap} kWh  |  Usable: ${p.capacity} kWh
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
    // Curve maps State-of-Energy (kWh) → max charge rate (kW).
    // Measured at 25°C on WLTP cycle. Do NOT extrapolate beyond the last point.
    private fun buildBatteryParams() = BatteryInfoParameters.Builder()
        .currentBatteryCapacity(Energy.kilowattHours(${p.capacity}.0))
        .batteryChargeCurve(listOf(
${curvePts}
        ))
        .build()

    // ── Speed → energy consumption (Wh/km) ───────────────────────────────────
    // Baseline at 20°C, flat road, solo occupant, no payload.
    // 15–25 points required; must span 10 km/h → vehicle v_max.
    private fun buildConsumptionParams() = ConsumptionCurveParameters.Builder()
        .speedConsumptionCurve(EvSpeedConsumptionCurve(listOf(
${consumpPts}
        )))
        .build()

    // ── Drivetrain efficiency factors ─────────────────────────────────────────
    // All values in range [0, 1]. Use vehicle programme dyno data where available.
    private fun buildEfficiencyParams() = EvEfficiencyParameters.Builder()
        .uphillEfficiency(${p.uphill}f)          // % of electrical energy converted to kinetic
        .downhillEfficiency(${p.downhill}f)       // % of kinetic energy recovered via regen
        .accelerationEfficiency(${p.accel}f)     // KineticEnergyGained / ElectricEnergyConsumed
        .decelerationEfficiency(${p.decel}f)     // ElectricEnergyGained / KineticEnergyLost
        .build()

    // ── Supported connector types ─────────────────────────────────────────────
    // Drives automatic connector compatibility filtering in EV Search results.
    private fun buildConnectorParams() = ConnectorInfoParameters.Builder()
        .vehicleConnectors(listOf(
${connectorLines}
        ))
        .build()

    // ── Auxiliary electrical load ─────────────────────────────────────────────
    // 5-minute rolling average covering HVAC, infotainment, lighting, and ADAS.
    // Winter peak can reach ${Math.round(p.auxPower * 2.4)} W — adjust per climate deployment.
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

export default function EVBattery() {
  const { t } = useTranslation('ev');
  const [cls, setCls] = useState('family');
  const p = PRESETS[cls];

  const classes = ['city', 'family', 'performance', 'suv'];

  const PARAMS = [
    ['currentBatteryCapacity', 'Energy (Wh)',          t('vehicleSetup.paramsTable.params.currentBatteryCapacity')],
    ['stateOfEnergy',          'Energy (Wh)',          t('vehicleSetup.paramsTable.params.stateOfEnergy')],
    ['batteryChargeCurve',     'List<Point(SoE, kW)>', t('vehicleSetup.paramsTable.params.batteryChargeCurve')],
    ['speedConsumptionCurve',  'List<(km/h, Wh/km)>', t('vehicleSetup.paramsTable.params.speedConsumptionCurve')],
    ['uphillEfficiency',       'Float (0–1)',          t('vehicleSetup.paramsTable.params.uphillEfficiency')],
    ['downhillEfficiency',     'Float (0–1)',          t('vehicleSetup.paramsTable.params.downhillEfficiency')],
    ['accelerationEfficiency', 'Float (0–1)',          t('vehicleSetup.paramsTable.params.accelerationEfficiency')],
    ['decelerationEfficiency', 'Float (0–1)',          t('vehicleSetup.paramsTable.params.decelerationEfficiency')],
    ['vehicleConnectors',      'List<ConnectorInfo>',  t('vehicleSetup.paramsTable.params.vehicleConnectors')],
    ['auxiliaryPower',         'Power (W)',            t('vehicleSetup.paramsTable.params.auxiliaryPower')],
    ['chargingTimeOffset',     'Duration (s)',         t('vehicleSetup.paramsTable.params.chargingTimeOffset')],
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('battery.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('battery.intro')}</div>

      <ApiLinks items={BATTERY_APIS} />

      {/* Vehicle class preset builder */}
      <div className="zone">
        <h2 className="sh" id="evb-presets">{t('battery.presets.heading')}</h2>
        <p className="body">{t('battery.presets.body')}</p>

        {/* Class selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {classes.map(c => (
            <button key={c} onClick={() => setCls(c)} style={{
              padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              background: cls === c ? PRESETS[c].color : 'var(--white)',
              color: cls === c ? '#fff' : 'var(--black)',
              border: cls === c ? `1.5px solid ${PRESETS[c].color}` : '1.5px solid var(--border)',
              transition: 'all 0.15s',
            }}>
              {t(`battery.presets.classes.${c}`)}
            </button>
          ))}
        </div>

        {/* Stats + curves */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
          {[
            ['🔋', t('battery.presets.stats.capacity'),    `${p.capacity} kWh`],
            ['⚡', t('battery.presets.stats.peakCharge'),  `${Math.max(...p.curve.map(([,kw]) => kw))} kW`],
            ['📉', t('battery.presets.stats.highwayConsumed'), `${p.consumption[3][1]} Wh/km`],
            ['🔌', t('battery.presets.stats.aux'),         `${p.auxPower} W`],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '1rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: p.color }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <ChargeCurve points={p.curve} color={p.color} capacity={p.capacity} />
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <ConsumptionCurve points={p.consumption} color={p.color} />
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {t('battery.presets.generatedCode')}
        </div>
        <CodeBlock language="kotlin" code={buildCode(cls, p)} />
        <Callout type="info">{t('battery.presets.callout')}</Callout>
      </div>

      {/* Navigation SDK VehicleProvider */}
      <div className="zone">
        <h2 className="sh" id="evb-provider">{t('vehicleSetup.vehicleProvider.heading')}</h2>
        <p className="body">{t('vehicleSetup.vehicleProvider.body')}</p>
        <CodeBlock language="kotlin" code={CODE_SDK_VEHICLE} />
      </div>

      {/* Auxiliary power */}
      <div className="zone">
        <h2 className="sh" id="evb-aux">{t('battery.aux.heading')}</h2>
        <p className="body">{t('battery.aux.body')}</p>
        <table className="prop-table">
          <thead><tr><th>{t('battery.aux.colVehicle')}</th><th>{t('battery.aux.colLoad')}</th><th>{t('battery.aux.colImpact')}</th></tr></thead>
          <tbody>
            {[
              ['City EV (summer)',      '250 – 400 W',  '~5% range reduction'],
              ['City EV (winter)',      '600 – 1200 W', '~15–25% range reduction'],
              ['Family EV (summer)',    '400 – 600 W',  '~6% range reduction'],
              ['Family EV (winter)',    '800 – 1500 W', '~18–28% range reduction'],
              ['Performance EV (HVAC)','600 – 900 W',  '~8% range reduction'],
              ['SUV (cold climate)',    '1000 – 2000 W','~20–35% range reduction'],
            ].map(([v, l, i]) => <tr key={v}><td>{v}</td><td><code className="ic">{l}</code></td><td style={{ color: 'var(--mid)' }}>{i}</td></tr>)}
          </tbody>
        </table>
        <Callout type="warn">{t('battery.aux.callout')}</Callout>
      </div>

      {/* Charging time offset */}
      <div className="zone">
        <h2 className="sh" id="evb-offset">{t('battery.offset.heading')}</h2>
        <p className="body">{t('battery.offset.body')}</p>
      </div>

      {/* Full params table */}
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
