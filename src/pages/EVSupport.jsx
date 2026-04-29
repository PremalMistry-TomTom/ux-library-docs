import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks, ApiRef } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

const EV_APIS = [
  {
    name: 'Vehicle Integration API',
    type: 'Android SDK',
    description: 'Send battery, consumption, and connector data from BMS to the Navigation SDK.',
    url: 'https://docs.tomtom.com/automotive-solutions/en/guides/ev-integration',
  },
  {
    name: 'Navigation SDK — Vehicle',
    type: 'Android SDK',
    description: 'Set and update vehicle type, charge level, and listen for state changes.',
    url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle',
  },
  {
    name: 'Long Distance EV Routing API',
    type: 'REST API',
    description: 'Calculate multi-stop routes with automatic charging stop planning.',
    url: 'https://docs.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-maps/long-distance-ev-routing',
  },
  {
    name: 'EV Search',
    type: 'Android SDK',
    description: 'Find compatible charging stations with power, connector, and availability filters.',
    url: 'https://docs.tomtom.com/navigation/android/guides/search/ev-search',
  },
  {
    name: 'EV POI Details',
    type: 'Android SDK',
    description: 'Retrieve real-time connector availability and payment details by Place ID.',
    url: 'https://docs.tomtom.com/navigation/android/guides/search/ev-poi-details',
  },
  {
    name: 'EV Routing — Consumption Model',
    type: 'REST API',
    description: 'Reference for battery curve, consumption curve, and efficiency parameter constraints.',
    url: 'https://docs.tomtom.com/electric-vehicle/ev-routing/introduction',
  },
];

/* ─── Mock palette ──────────────────────────────────────────────────────────── */
const M = {
  bg:     '#0d1117',
  card:   '#161b22',
  card2:  '#1c2333',
  line:   '#21262d',
  text:   '#e6edf3',
  dim:    '#8b949e',
  muted:  '#6e7681',
  blue:   '#58a6ff',
  blueDim:'#1f3a5c',
  green:  '#3fb950',
  greenDim:'#0f2a17',
  amber:  '#d29922',
  red:    '#f85149',
  teal:   '#39d353',
};

/* ─── Architecture diagram — stack pattern (same as TAIA) ───────────────────── */
export function ArchDiagram() {
  return (
    <div className="adas-stack" style={{ maxWidth: 560, margin: '20px 0' }}>

      {/* OEM — Vehicle BMS */}
      <div className="adas-stack-layer adas-stack-oem" style={{ borderRadius: '8px 8px 0 0' }}>
        <div className="adas-stack-text">
          <span className="adas-stack-label">Vehicle BMS</span>
          <span className="adas-stack-note">Sends battery state and SoC data from the drivetrain</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-oem">OEM</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* TomTom — Vehicle Integration API */}
      <div className="adas-stack-layer adas-stack-highlight">
        <div className="adas-stack-text">
          <span className="adas-stack-label">Vehicle Integration API</span>
          <span className="adas-stack-note">VehicleInfoManager — bridges BMS events into the SDK</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* TomTom — Navigation SDK */}
      <div className="adas-stack-layer adas-stack-highlight" style={{ borderRadius: '0 0 8px 8px' }}>
        <div className="adas-stack-text">
          <span className="adas-stack-label">Navigation SDK</span>
          <span className="adas-stack-note">VehicleProvider — source of truth for range-aware routing</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* Outputs — LDEVR + EV Search */}
      <div className="adas-stack-outputs">
        <div className="adas-stack-output adas-stack-output-tt">
          <span className="adas-stack-label">LDEVR API</span>
          <span className="adas-stack-note">Calculates charging stops on long routes</span>
          <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
        </div>
        <div className="adas-stack-output adas-stack-output-tt">
          <span className="adas-stack-label">EV Search API</span>
          <span className="adas-stack-note">Finds compatible charging stations nearby</span>
          <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
        </div>
      </div>

    </div>
  );
}

/* ─── EV Search mock ────────────────────────────────────────────────────────── */
const STATIONS = [
  { n: 'Belib', addr: 'Rue des Écoles, 75005 Paris', kw: '22 kW', avail: '4/5 available', dist: '950 m' },
  { n: 'Indigo', addr: 'Rue Soufflot, 75005 Paris', kw: '50 kW', avail: '2/2 available', dist: '370 m' },
  { n: 'Saemes', addr: 'Rue Louis Thullier, 75005', kw: '7 kW', avail: '6/8 available', dist: '600 m' },
];

export function EVSearchMock({ activeFilter = 'speed' }) {
  const filters = [
    { id: 'speed', icon: '⚡', label: 'Speed' },
    { id: 'payment', icon: '💳', label: 'Payment' },
    { id: 'services', icon: '🍴', label: 'Services' },
  ];
  const speedChips = ['0 – 11 kW', '12 – 49 kW', '50 kW+', '150 kW+'];
  const operatorChips = ['EVgo', 'TotalEnergies', 'Belib', 'Allego', 'ChargePoint', 'Electra'];
  const cardChips = ['Plugsurfing', 'Shell Recharge'];
  const serviceChips = ['Restaurant', 'Hotel', 'Cafe', 'Public Amenity', 'Shop', 'Recreation area'];

  return (
    <div style={{ background: M.card, borderRadius: 12, overflow: 'hidden', width: 280, flexShrink: 0, border: `1px solid ${M.line}` }}>
      {/* Header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Charging station</div>
        <div style={{ fontSize: '0.7rem', color: M.green }}>Near you · Available now</div>
      </div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${M.line}` }}>
        {filters.map(f => (
          <div key={f.id} style={{
            flex: 1, padding: '7px 4px', textAlign: 'center', fontSize: '0.64rem', fontWeight: 600,
            color: f.id === activeFilter ? M.blue : M.dim,
            borderBottom: f.id === activeFilter ? `2px solid ${M.blue}` : '2px solid transparent',
            cursor: 'pointer',
          }}>
            <span style={{ marginRight: 3 }}>{f.icon}</span>{f.label}
          </div>
        ))}
      </div>
      {/* Filter content */}
      {activeFilter === 'speed' && (
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ fontSize: '0.68rem', color: M.dim, marginBottom: 7 }}>Charging speed</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {speedChips.map((c, i) => (
              <span key={c} style={{
                fontSize: '0.66rem', padding: '4px 9px', borderRadius: 6, cursor: 'pointer',
                background: i === 2 ? M.blue : M.card2,
                color: i === 2 ? '#fff' : M.dim,
                border: `1px solid ${i === 2 ? M.blue : M.line}`,
              }}>⚡ {c}</span>
            ))}
          </div>
        </div>
      )}
      {activeFilter === 'payment' && (
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ fontSize: '0.68rem', color: M.dim, marginBottom: 7 }}>My preferred operators</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {operatorChips.map((c, i) => (
              <span key={c} style={{
                fontSize: '0.66rem', padding: '4px 9px', borderRadius: 6,
                background: i < 3 ? M.blue : M.card2,
                color: i < 3 ? '#fff' : M.dim,
                border: `1px solid ${i < 3 ? M.blue : M.line}`,
              }}>{c}</span>
            ))}
          </div>
          <div style={{ fontSize: '0.68rem', color: M.dim, marginBottom: 7 }}>My charging cards</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {cardChips.map(c => (
              <span key={c} style={{ fontSize: '0.66rem', padding: '4px 9px', borderRadius: 6, background: M.card2, color: M.dim, border: `1px solid ${M.line}` }}>{c}</span>
            ))}
          </div>
        </div>
      )}
      {activeFilter === 'services' && (
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ fontSize: '0.68rem', color: M.dim, marginBottom: 7 }}>Services nearby</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {serviceChips.map((c, i) => (
              <span key={c} style={{
                fontSize: '0.66rem', padding: '4px 9px', borderRadius: 6,
                background: i === 2 ? M.blue : M.card2,
                color: i === 2 ? '#fff' : M.dim,
                border: `1px solid ${i === 2 ? M.blue : M.line}`,
              }}>{c}</span>
            ))}
          </div>
        </div>
      )}
      {/* Results */}
      {STATIONS.map((s, i) => (
        <div key={i} style={{ padding: '9px 12px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: M.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.62rem', fontWeight: 700, color: '#000' }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: M.text }}>{s.n}</span>
              <span style={{ fontSize: '0.66rem', color: M.dim }}>{s.dist}</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: M.muted, marginBottom: 2 }}>{s.addr}</div>
            <div style={{ fontSize: '0.64rem', color: M.dim }}>⚡ {s.kw} · <span style={{ color: M.green }}>{s.avail}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Station detail mock ───────────────────────────────────────────────────── */
export function StationDetailMock() {
  return (
    <div style={{ background: M.card, borderRadius: 12, overflow: 'hidden', width: 260, flexShrink: 0, border: `1px solid ${M.line}` }}>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.64rem', color: M.green, marginBottom: 2 }}>Charging station</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: M.text }}>Indigo</div>
        <div style={{ fontSize: '0.68rem', color: M.muted }}>Rue Soufflot, 75005 Paris</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
          {['24/7', '🅿', '♿', '🚻'].map(t => (
            <span key={t} style={{ fontSize: '0.62rem', background: M.card2, color: M.dim, padding: '2px 6px', borderRadius: 4, border: `1px solid ${M.line}` }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 14px', borderBottom: `1px solid ${M.line}`, display: 'flex', gap: 14, fontSize: '0.66rem', color: M.dim }}>
        <span>3 min · 370 m</span>
        <span style={{ color: M.green }}>38% at arrival</span>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ flex: 1, background: M.card2, border: `1px solid ${M.line}`, borderRadius: 7, padding: '7px', textAlign: 'center', fontSize: '0.7rem', color: M.dim }}>Routes</div>
        <div style={{ flex: 1, background: M.blue, borderRadius: 7, padding: '7px', textAlign: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>Drive</div>
      </div>
      {/* Compatible charge points */}
      <div style={{ padding: '8px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.66rem', color: M.dim }}>
          <span>Compatible charge points</span><span>∧</span>
        </div>
        {[{ type: 'Type 2 CCS', kw: '50 kW', avail: '2/2 available' }, { type: 'Type 2', kw: '7 kW', avail: '4/6 available' }].map(c => (
          <div key={c.type} style={{ marginBottom: 5 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: M.text }}>⚡ {c.type}</div>
            <div style={{ fontSize: '0.62rem', color: M.dim }}>{c.kw} · <span style={{ color: M.green }}>{c.avail}</span></div>
          </div>
        ))}
      </div>
      {/* Payment */}
      <div style={{ padding: '8px 14px', fontSize: '0.64rem' }}>
        <div style={{ color: M.dim, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}><span>Payment</span><span>∧</span></div>
        <div style={{ color: M.text, fontWeight: 600, marginBottom: 1 }}>In Network</div>
        <div style={{ color: M.muted, marginBottom: 5 }}>Plugsurfing, Shell Recharge</div>
        <div style={{ color: M.text, fontWeight: 600, marginBottom: 1 }}>Payment methods</div>
        <div style={{ color: M.muted }}>App, Charging card, Credit card</div>
      </div>
    </div>
  );
}

/* ─── LDEVR route mock ──────────────────────────────────────────────────────── */
export function RouteMock() {
  const stops = [
    { label: 'Current location', type: 'origin' },
    { leg: '50 min · 54 km', toll: '1 min' },
    { label: 'bp pulse', time: '17:11', socIn: '21%', socOut: '46%', kw: '400 kW', chargeTime: '20 min charge', type: 'charge' },
    { leg: '53 min · 104 km', toll: '0 min' },
    { label: 'Fastned', time: '19:12', socIn: '15%', socOut: '40%', kw: '350 kW', chargeTime: '25 min charge', type: 'charge' },
  ];
  return (
    <div style={{ background: M.card, borderRadius: 12, overflow: 'hidden', width: 270, flexShrink: 0, border: `1px solid ${M.line}` }}>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Routes</div>
        <div style={{ fontSize: '0.68rem', color: M.dim }}>9 hr 28 min · 679 km · <span style={{ color: M.red }}>⚡ 1 min</span></div>
        <div style={{ fontSize: '0.64rem', color: M.dim, marginTop: 2 }}>🔋 15% at arrival · 🔌 6 charges</div>
      </div>
      <div style={{ padding: '8px 14px' }}>
        {stops.map((s, i) => {
          if (s.leg) return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 10, marginBottom: 4 }}>
              <div style={{ width: 1, background: M.line, alignSelf: 'stretch', marginLeft: 4 }} />
              <span style={{ fontSize: '0.62rem', color: M.dim }}>{s.leg}</span>
              {s.toll && <span style={{ fontSize: '0.6rem', color: M.red }}>⚡ {s.toll}</span>}
            </div>
          );
          if (s.type === 'origin') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '0.7rem', color: M.dim }}>
              <span style={{ fontSize: '0.8rem' }}>📍</span>{s.label}
            </div>
          );
          return (
            <div key={i} style={{ background: M.card2, borderRadius: 8, padding: '8px 10px', marginBottom: 6, border: `1px solid ${M.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: M.text }}>🔌 {s.label}</span>
                <span style={{ fontSize: '0.64rem', color: M.muted }}>›</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: M.dim, marginBottom: 2 }}>🕐 {s.time} · 🔋 {s.socIn} → {s.socOut}</div>
              <div style={{ fontSize: '0.62rem', color: M.dim }}>{s.kw} · {s.chargeTime}</div>
            </div>
          );
        })}
      </div>
      {/* Plan charging toggle */}
      <div style={{ padding: '8px 14px', borderTop: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.68rem', color: M.dim }}>Plan charging automatically</span>
        <div style={{ width: 34, height: 18, borderRadius: 9, background: M.blue, position: 'relative' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: 2 }} />
        </div>
      </div>
      <div style={{ padding: '8px 14px', paddingTop: 0 }}>
        <div style={{ background: M.card2, border: `1px solid ${M.line}`, borderRadius: 7, padding: '7px', textAlign: 'center', fontSize: '0.68rem', color: M.dim }}>⚙ Manage stops</div>
      </div>
    </div>
  );
}

/* ─── Route preferences mock ────────────────────────────────────────────────── */
export function PreferencesMock() {
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
        <div style={{ fontSize: '0.6rem', color: M.muted, lineHeight: 1.4 }}>While driving, arrival percentages might drop up to 2% below set value</div>
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
      <div style={{ padding: '8px 14px', paddingTop: 0 }}>
        <div style={{ background: M.blue, borderRadius: 7, padding: '8px', textAlign: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>✈ Drive</div>
      </div>
    </div>
  );
}

/* ─── Code snippets ─────────────────────────────────────────────────────────── */
const CODE_VEHICLE = `// 1. Battery configuration
val batteryParams = BatteryInfoParameters.Builder()
    .currentBatteryCapacity(Energy.kilowattHours(75.0))
    .stateOfEnergy(Energy.kilowattHours(45.0))
    .batteryChargeCurve(listOf(
        Point(0.0,  50.0),   // 0 kWh → 50 kW max
        Point(20.0, 150.0),  // 20 kWh → 150 kW max
        Point(56.0, 75.0),   // 56 kWh → 75 kW max
        Point(72.0, 20.0),   // 72 kWh → 20 kW max
    ))
    .build()

// 2. Consumption curve (speed → Wh/km)
val consumptionParams = ConsumptionCurveParameters.Builder()
    .speedConsumptionCurve(EvSpeedConsumptionCurve(listOf(
        EvSpeedConsumptionPoint(Speed.kilometersPerHour(10.0), 150.0),
        EvSpeedConsumptionPoint(Speed.kilometersPerHour(80.0), 180.0),
        EvSpeedConsumptionPoint(Speed.kilometersPerHour(120.0), 260.0),
    )))
    .build()

// 3. Efficiency factors
val efficiencyParams = EvEfficiencyParameters.Builder()
    .uphillEfficiency(0.92f)
    .downhillEfficiency(0.88f)
    .accelerationEfficiency(0.90f)
    .decelerationEfficiency(0.85f)
    .build()

// 4. Connector types
val connectorParams = ConnectorInfoParameters.Builder()
    .vehicleConnectors(listOf(
        ConnectorInfo(VehicleConnectorType.IEC_62196_TYPE_2_COMBO, ElectricityType.DC),
        ConnectorInfo(VehicleConnectorType.IEC_62196_TYPE_2_CABLE, ElectricityType.AC),
    ))
    .build()

// 5. Send to Navigation SDK
vehicleInfoManager.sendBatteryInfo(batteryParams) { result -> }
vehicleInfoManager.sendConsumptionCurve(consumptionParams) { result -> }
vehicleInfoManager.sendEvEfficiency(efficiencyParams) { result -> }
vehicleInfoManager.sendConnectorInfo(connectorParams) { result -> }`;

const CODE_SDK_VEHICLE = `// Set initial vehicle state in Navigation SDK
val electricCar = Vehicle.Car(
    electricEngine = ElectricEngine(
        chargeLevel = ChargeLevel(
            current = Energy.kilowattHours(45.0),
            max = Energy.kilowattHours(75.0),
        )
    )
)
VehicleProvider.vehicle = electricCar

// Update SoC dynamically as BMS reports changes
VehicleProvider.updateVehicleProperties(
    listOf(ElectricEngineProperties(
        listOf(CurrentChargeProperty(Energy.kilowattHours(42.5)))
    ))
)

// Listen for vehicle state changes
VehicleProvider.addVehicleUpdatedListener { vehicle, updatedProperties ->
    if (PropertyId.CurrentCharge in updatedProperties) {
        // Sync to your UI / BMS
    }
}`;

const CODE_SEARCH = `// EV charging station search
val options = EvSearchOptions.Builder()
    .geoBias(GeoPoint(latitude = 48.8566, longitude = 2.3522))
    .radius(Distance.kilometers(5.0))
    .minPower(Power.kilowatts(50.0))          // filter by minimum power
    .connectors(listOf(ConnectorType.CCS))    // match vehicle connectors
    .status(Status.Available)                  // available stations only
    .accessTypes(listOf(AccessType.Public))
    .limit(10)
    .nearbyPoiCategories(setOf(
        StandardCategoryId.Restaurant,
        StandardCategoryId.CafePub,
    ))
    .build()

search.evSearch(options) { result ->
    when (result) {
        is Success -> result.value.results.forEach { station ->
            val name     = station.place.name
            val distance = station.detour?.distance
            val access   = station.accessType
            val points   = station.place.details?.chargingPark?.chargingPoints
        }
        is Failure -> handleError(result.failure)
    }
}`;

const CODE_POI_DETAILS = `// Fetch real-time station detail by Place ID
val options = buildEvPoiDetailsOptions(placeId) {
    locale = Locale.FRANCE
}

when (val result = search.requestEvPoiDetails(options)) {
    is Success -> {
        result.value.evPoiDetails.forEach { details ->
            val connectors    = details.place.details?.chargingPark?.connectors
            val chargingPoints = details.place.details?.chargingPark?.chargingPoints
            // chargingPoints[n].status → Available / Occupied / Unknown
        }
        // partial success: result.value.failedIds contains unresolved IDs
    }
    is Failure -> handleError(result.failure)
}`;

const CODE_LDEVR = `// Long Distance EV Route via REST API
POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/
    48.8566,2.3522:43.2965,5.3698/json?key={API_KEY}
    &vehicleEngineType=electric
    &currentChargeInKwh=45
    &minChargeAtDestinationInkWh=7.5
    &minChargeAtChargingStopsInkWh=11.25
    &constantSpeedConsumptionInkWhPerHundredkm=10:180,80:180,120:260

Content-Type: application/json

{
  "chargingConnectors": [{
    "currentType": "DC",
    "maxPowerInkW": 150,
    "voltageRange": { "minVoltageInV": 355, "maxVoltageInV": 0 },
    "plugTypes": ["Combo_to_IEC_62196_Type_2_Base"]
  }],
  "batteryCurve": [
    { "stateOfChargeInkWh": 0,  "maxPowerInkW": 50  },
    { "stateOfChargeInkWh": 20, "maxPowerInkW": 150 },
    { "stateOfChargeInkWh": 56, "maxPowerInkW": 75  },
    { "stateOfChargeInkWh": 72, "maxPowerInkW": 20  }
  ],
  "chargingTimeOffsetInSec": 120,
  "preferredMSPs": ["Fastned", "Ionity", "TotalEnergies"]
}`;

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function EVSupport() {
  const { t } = useTranslation('ev');

  const BATTERY_PARAMS = [
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

  const SEARCH_FILTERS = [
    ['geoBias',              'GeoPoint',              t('evSearch.filterTable.options.geoBias')],
    ['radius',               'Distance',              t('evSearch.filterTable.options.radius')],
    ['minPower / maxPower',  'Power (kW)',             t('evSearch.filterTable.options.minMaxPower')],
    ['connectors',           'List<ConnectorType>',   t('evSearch.filterTable.options.connectors')],
    ['status',               'Status',                t('evSearch.filterTable.options.status')],
    ['accessTypes',          'List<AccessType>',      t('evSearch.filterTable.options.accessTypes')],
    ['limit',                'Int',                   t('evSearch.filterTable.options.limit')],
    ['nearbyPoiCategories',  'Set<StandardCategoryId>', t('evSearch.filterTable.options.nearbyPoiCategories')],
  ];

  const LDEVR_FIELDS = [
    ['remainingChargeAtArrivalInkWh',                                             t('ldevr.responseTable.fields.remainingChargeAtArrivalInkWh')],
    ['chargingInformationAtEndOfLeg.targetChargeInkWh',                           t('ldevr.responseTable.fields.targetChargeInkWh')],
    ['chargingInformationAtEndOfLeg.chargingTimeInSeconds',                       t('ldevr.responseTable.fields.chargingTimeInSeconds')],
    ['chargingInformationAtEndOfLeg.chargingParkName',                            t('ldevr.responseTable.fields.chargingParkName')],
    ['chargingInformationAtEndOfLeg.chargingConnectionInfo.chargingPowerInkW',    t('ldevr.responseTable.fields.chargingPowerInkW')],
    ['chargingInformationAtEndOfLeg.chargingParkPaymentOptions',                  t('ldevr.responseTable.fields.chargingParkPaymentOptions')],
    ['chargingInformationAtEndOfLeg.chargingStopType',                            t('ldevr.responseTable.fields.chargingStopType')],
    ['summary.totalChargingTimeInSeconds',                                         t('ldevr.responseTable.fields.totalChargingTimeInSeconds')],
  ];

  const PREF_ROWS = [
    ['minAtStop',    'minChargeAtChargingStopsInkWh',       '15%'],
    ['minAtDest',    'minChargeAtDestinationInkWh',         '15%'],
    ['minAtFirst',   'minChargeAtFirstChargingStopInkWh',   'Same as stops'],
    ['criticalMin',  'criticalMinChargeAtDestinationInkWh', 'Optional'],
    ['avoidTolls',   'avoid=tollRoads',                     'Off'],
    ['avoidUnpaved', 'avoid=unpavedRoads',                  'Off'],
  ];

  const REQ_DEPS = [
    ['vehicleLib',    'com.tomtom.sdk.vehicle:vehicle-integration-api'],
    ['vehicleModule', 'com.tomtom.sdk.vehicle:vehicle-provider:2.2.0'],
    ['searchModule',  'com.tomtom.sdk.search:search-ev:2.2.0'],
    ['ldevrApi',      'api.tomtom.com/routing/1/calculateLongDistanceEVRoute'],
    ['evSearch',      'Included in Navigation SDK search module'],
    ['bms',           'OEM-provided. Update frequency: 1 Hz minimum.'],
    ['internet',      'Required for LDEVR and real-time station availability.'],
    ['weight',        'Hardcoded at 2000 kg — cannot be overridden.'],
  ];

  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="page-header" id="ev-overview">
        <h1>{t('title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">{t('intro')}</div>

      <ApiLinks items={EV_APIS} />

      {/* ── Architecture ── */}
      <div className="zone" id="ev-architecture">
        <h2 className="sh">{t('architecture.heading')}</h2>
        <p className="body">{t('architecture.body')}</p>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <ArchDiagram />
        </div>
        <Callout type="info">{t('architecture.callout')}</Callout>
      </div>

      {/* ── Vehicle Setup ── */}
      <div className="zone" id="ev-vehicle">
        <h2 className="sh">{t('vehicleSetup.heading')}</h2>
        <p className="body">{t('vehicleSetup.body')}</p>

        <h3 className="sub">
          {t('vehicleSetup.vehicleApi.heading')}{' '}
          <ApiRef name="Automotive Solutions docs" url="https://docs.tomtom.com/automotive-solutions/en/guides/ev-integration" type="Android SDK" />
        </h3>
        <p className="body">{t('vehicleSetup.vehicleApi.body')}</p>

        <CodeBlock tabs={['Kotlin']}>
          <pre>{CODE_VEHICLE}</pre>
        </CodeBlock>

        <Callout type="warning">{t('vehicleSetup.vehicleApi.callout')}</Callout>

        <h3 className="sub">
          {t('vehicleSetup.vehicleProvider.heading')}{' '}
          <ApiRef name="Vehicle guide" url="https://docs.tomtom.com/navigation/android/guides/navigation/vehicle" type="Android SDK" />
        </h3>
        <p className="body">{t('vehicleSetup.vehicleProvider.body')}</p>

        <CodeBlock tabs={['Kotlin']}>
          <pre>{CODE_SDK_VEHICLE}</pre>
        </CodeBlock>

        <h3 className="sub">{t('vehicleSetup.paramsTable.heading')}</h3>
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
              {BATTERY_PARAMS.map(([param, typ, notes]) => (
                <tr key={param}>
                  <td><code>{param}</code></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{typ}</td>
                  <td>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EV Search ── */}
      <div className="zone" id="ev-search">
        <h2 className="sh">{t('evSearch.heading')}</h2>
        <p className="body">{t('evSearch.body')}</p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--mid)' }}>{t('evSearch.speedFilters')}</p>
            <EVSearchMock activeFilter="speed" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--mid)' }}>{t('evSearch.paymentFilters')}</p>
            <EVSearchMock activeFilter="payment" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--mid)' }}>{t('evSearch.serviceFilters')}</p>
            <EVSearchMock activeFilter="services" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--mid)' }}>{t('evSearch.stationDetail')}</p>
            <StationDetailMock />
          </div>
        </div>

        <h3 className="sub">
          {t('evSearch.searchOptions.heading')}{' '}
          <ApiRef name="EV Search guide" url="https://docs.tomtom.com/navigation/android/guides/search/ev-search" type="Android SDK" />
        </h3>
        <p className="body">{t('evSearch.searchOptions.body')}</p>

        <CodeBlock tabs={['Kotlin']}>
          <pre>{CODE_SEARCH}</pre>
        </CodeBlock>

        <h3 className="sub">
          {t('evSearch.realtimeDetails.heading')}{' '}
          <ApiRef name="EV POI Details guide" url="https://docs.tomtom.com/navigation/android/guides/search/ev-poi-details" type="Android SDK" />
        </h3>
        <p className="body">{t('evSearch.realtimeDetails.body')}</p>

        <CodeBlock tabs={['Kotlin']}>
          <pre>{CODE_POI_DETAILS}</pre>
        </CodeBlock>

        <h3 className="sub">{t('evSearch.filterTable.heading')}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>{t('evSearch.filterTable.colOption')}</th>
                <th>{t('evSearch.filterTable.colType')}</th>
                <th>{t('evSearch.filterTable.colDesc')}</th>
              </tr>
            </thead>
            <tbody>
              {SEARCH_FILTERS.map(([opt, typ, desc]) => (
                <tr key={opt}><td><code>{opt}</code></td><td style={{ whiteSpace: 'nowrap' }}>{typ}</td><td>{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── LDEVR ── */}
      <div className="zone" id="ev-routing">
        <h2 className="sh">{t('ldevr.heading')}</h2>
        <p className="body">{t('ldevr.body')}</p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--mid)' }}>{t('ldevr.routePreview')}</p>
            <RouteMock />
          </div>
          <div style={{ maxWidth: 380, flex: 1 }}>
            <Callout type="info" style={{ marginTop: 0 }}>{t('ldevr.callout1')}</Callout>
            <Callout type="warning">{t('ldevr.callout2')}</Callout>
          </div>
        </div>

        <h3 className="sub">
          {t('ldevr.apiRequest.heading')}{' '}
          <ApiRef name="Full API reference" url="https://docs.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-maps/long-distance-ev-routing" type="REST API" />
          {' '}
          <ApiRef name="Consumption model" url="https://docs.tomtom.com/electric-vehicle/ev-routing/introduction" type="REST API" />
        </h3>
        <p className="body">{t('ldevr.apiRequest.body')}</p>

        <CodeBlock tabs={['REST (JSON)']}>
          <pre>{CODE_LDEVR}</pre>
        </CodeBlock>

        <h3 className="sub">{t('ldevr.responseTable.heading')}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>{t('ldevr.responseTable.colField')}</th>
                <th>{t('ldevr.responseTable.colDesc')}</th>
              </tr>
            </thead>
            <tbody>
              {LDEVR_FIELDS.map(([field, desc]) => (
                <tr key={field}><td><code style={{ fontSize: '0.72rem' }}>{field}</code></td><td>{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Route Preferences ── */}
      <div className="zone" id="ev-preferences">
        <h2 className="sh">{t('preferences.heading')}</h2>
        <p className="body">{t('preferences.body')}</p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
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

      {/* ── Requirements ── */}
      <div className="zone" id="ev-requirements">
        <h2 className="sh">{t('requirements.heading')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>{t('requirements.colDep')}</th>
                <th>{t('requirements.colVersion')}</th>
              </tr>
            </thead>
            <tbody>
              {REQ_DEPS.map(([key, detail]) => (
                <tr key={key}>
                  <td>{t(`requirements.deps.${key}`)}</td>
                  <td><code style={{ fontSize: '0.75rem' }}>{detail}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
