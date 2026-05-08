import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const addLn = t => {
  const esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = esc.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
};

/* ─── Shared UI ──────────────────────────────────────────────────────────────── */

/* ─── Parameter data ─────────────────────────────────────────────────────────── */
const PARAMS_ROUTE = [
  { name: 'locations', required: true, type: 'string (path)', desc: 'Colon-separated lat,lon pairs. Minimum 2 points (origin + destination). Up to 150 intermediate waypoints.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'van'], desc: 'Only car and van are supported for EV routing. truck, bicycle, and pedestrian are not applicable.' },
  { name: 'departAt', type: 'datetime (RFC 3339)', desc: 'Departure date/time. Defaults to now. Affects traffic and energy consumption modelling.' },
  { name: 'traffic', type: 'boolean', default: true, desc: 'Use real-time and historic traffic. Affects energy consumption on the route (stop-and-go vs free-flow).' },
  { name: 'routeType', type: 'string', default: 'fastest', values: ['fastest', 'eco'], desc: 'eco optimises for minimum energy consumption — recommended for EVs. fastest minimises travel time but may use more battery.' },
  { name: 'avoid', type: 'string', desc: 'Comma-separated list of features to avoid. Values: tollRoads, motorways, ferries, unpavedRoads, carpools, alreadyUsedRoads.' },
  { name: 'maxAlternatives', type: 'integer', default: 0, desc: 'Up to 5 alternative routes. Each alternative will also include charging stop candidates.' },
  { name: 'chargingStopsStrategy', type: 'string', default: 'automaticFastest', values: ['automaticFastest', 'manualFastest'], desc: 'Controls how charging stops are selected. automaticFastest (default) lets the API pick the optimal stops for the fastest total journey. manualFastest requires you to specify stops via chargingWaypoints in the POST body.' },
];

const PARAMS_EV = [
  { name: 'vehicleEngineType', required: true, type: 'string', default: 'electric', values: ['electric'], desc: 'Must be electric for EV routing. This unlocks the charging stop planner and battery model.' },
  { name: 'currentChargeInkWh', required: true, type: 'float', desc: 'Available battery charge at the start of the journey in kWh. Example: 45.0 for a vehicle with a 75 kWh pack at 60% charge.' },
  { name: 'maxChargeInkWh', required: true, type: 'float', desc: 'Maximum battery capacity in kWh. Must match the physical battery size. Example: 75.0.' },
  { name: 'minChargeAtDestinationInkWh', type: 'float', default: 0, desc: 'Minimum charge level required on arrival at the destination. Avoids arriving with a flat battery.' },
  { name: 'minChargeAtChargingStopsInkWh', type: 'float', default: 0, desc: 'Minimum charge when arriving at each charging stop. Setting this higher avoids deep discharge cycles.' },
  { name: 'targetChargeAtChargingStopsInkWh', type: 'float', desc: 'Charge level to reach at each stop before continuing. If omitted, the API chooses the optimal amount for the route.' },
];

const PARAMS_CONNECTOR = [
  { name: 'connectorSet', required: true, type: 'string (CSV)', desc: 'Comma-separated list of supported connector types. Only charging stations with at least one matching connector will be considered. See the connector types table below.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum charger power in kW. Filters out slow chargers that would add excessive dwell time. Recommended: 50 kW for DC fast charging.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum charger power in kW. Can be used to restrict to AC charging only or to match the vehicle onboard charger limit.' },
];

const PARAMS_CONSUMPTION = [
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', required: true, type: 'string (CSV pairs)', desc: 'Speed-to-consumption lookup table. Colon-separated speed:kWh pairs. Example: "50,8.2:90,14.6:120,21.0". 1–25 speed/consumption pairs required. API interpolates between entries; extrapolates beyond range.' },
  { name: 'currentFuelInLiters', type: 'float', desc: 'For range-extended EVs (REX): current fuel level in litres. Ignored for pure BEV.' },
  { name: 'auxiliaryPowerInkW', type: 'float', default: 0, desc: 'Constant auxiliary draw in kW (HVAC, lighting, infotainment). Added to consumption at every segment. Typical value: 1.5–3.0 kW.' },
  { name: 'accelerationEfficiency', type: 'float', default: 0.9, desc: 'Fraction of electrical energy converted to kinetic energy during acceleration. Range 0–1. Default 0.9.' },
  { name: 'decelerationEfficiency', type: 'float', default: 0.9, desc: 'Fraction of kinetic energy recovered as electrical energy during regenerative braking. Range 0–1. Default 0.9. Higher = better regen capture.' },
  { name: 'uphillEfficiency', type: 'float', default: 0.9, desc: 'Fraction of electrical energy converted to potential energy on uphill segments. Range 0–1. Default 0.9.' },
  { name: 'downhillEfficiency', type: 'float', default: 0.9, desc: 'Fraction of potential energy recovered as electrical energy on downhill segments (regen). Range 0–1. Default 0.9.' },
];

/* ─── Connector types ─────────────────────────────────────────────────────────── */
const CONNECTORS = [
  { id: 'IEC62196Type1',      label: 'Type 1 (J1772)',    region: 'North America / Japan',       power: 'AC up to 7.4 kW' },
  { id: 'IEC62196Type1CCS',   label: 'CCS Combo 1',       region: 'North America',               power: 'DC up to 350 kW' },
  { id: 'IEC62196Type2',      label: 'Type 2 (Mennekes)', region: 'Europe',                      power: 'AC up to 22 kW' },
  { id: 'IEC62196Type2CCS',   label: 'CCS Combo 2',       region: 'Europe',                      power: 'DC up to 350 kW' },
  { id: 'IEC62196Type2Outlet',label: 'Type 2 Outlet',     region: 'Europe',                      power: 'AC up to 22 kW' },
  { id: 'GBT20234Part2',      label: 'GB/T AC',           region: 'China',                       power: 'AC up to 7.4 kW' },
  { id: 'GBT20234Part3',      label: 'GB/T DC',           region: 'China',                       power: 'DC up to 250 kW' },
  { id: 'CHAdeMO',            label: 'CHAdeMO',           region: 'Japan / Global',              power: 'DC up to 400 kW' },
  { id: 'Tesla',              label: 'Tesla Proprietary', region: 'North America',               power: 'DC up to 250 kW' },
  { id: 'Chaoji',             label: 'ChaoJi',            region: 'China / Japan (emerging)',    power: 'DC up to 900 kW' },
];

/* ─── Response section types ─────────────────────────────────────────────────── */
const SECTION_TYPES = [
  { type: 'TRAVEL',           desc: 'Normal driving segment between waypoints or charging stops.' },
  { type: 'CHARGING_STATION', desc: 'A planned charging stop. Contains full station data: location, brand, connectors, rated power, and time to charge to the target level.' },
  { type: 'TRAFFIC',          desc: 'Segment where real-time traffic conditions were applied to the energy model.' },
  { type: 'TOLL',             desc: 'Segment passing through a toll facility. Useful for cost estimation overlays.' },
  { type: 'FERRY',            desc: 'Segment using a ferry crossing. Ferry time is included in travelTimeInSeconds but no energy is consumed.' },
  { type: 'COUNTRY',          desc: 'Marks a country border crossing. Speed limits and road rules change after this point.' },
];

/* ─── Response field data ────────────────────────────────────────────────────── */
const EV_SUMMARY_FIELDS = [
  { name: 'batteryConsumptionInkWh',       type: 'float',    desc: 'Total energy consumed on driving segments (excludes charging dwell time).' },
  { name: 'remainingChargeAtArrivalInkWh', type: 'float',    desc: 'Predicted battery level at the final destination.' },
  { name: 'totalChargingTimeInSeconds',    type: 'integer',  desc: 'Sum of all dwell times across every charging stop on the route.' },
  { name: 'chargingInformationAtLegs',     type: 'object[]', desc: 'Per-leg charging data. One entry per leg that ends at or departs from a charging stop.', children: [
    { name: 'chargingInformationAtLegs[].chargingParkName',               type: 'string',  desc: 'Human-readable station name (e.g. "Fastned Liège-Ardenne A3").' },
    { name: 'chargingInformationAtLegs[].chargingTimeInSeconds',          type: 'integer', desc: 'Estimated dwell time at this charging stop.' },
    { name: 'chargingInformationAtLegs[].targetChargeAfterChargingInkWh', type: 'float',   desc: 'Battery level reached before departing this stop.' },
  ]},
];

const CHARGING_STATION_FIELDS = [
  { name: 'connectors', type: 'object[]', desc: 'Array of available connectors at this charging station.', children: [
    { name: 'connectors[].connectorType', type: 'object', desc: 'Connector type identification.', children: [
      { name: 'connectorType.value', type: 'string', desc: 'Connector identifier (e.g. IEC62196Type2CCS, CHAdeMO, Tesla).' },
    ]},
    { name: 'connectors[].ratedPowerKW', type: 'float',  desc: 'Maximum rated output power in kW.' },
    { name: 'connectors[].currentType',  type: 'string', values: ['AC','DC'], desc: 'Electrical current type.' },
  ]},
  { name: 'facilityType',   type: 'string', values: ['CHARGING_STATION','PETROL_STATION','AMENITY'], desc: 'Station category. PETROL_STATION is returned for range-extended EVs with a fuel top-up stop.' },
  { name: 'brandName',      type: 'string', desc: 'Charging network operator name (e.g. Ionity, Fastned, Tesla Supercharger).' },
  { name: 'chargingParkName', type: 'string', desc: 'Human-readable station name suitable for display in UI.' },
  { name: 'location', type: 'GeoPoint', desc: 'Geographic position of the charging station.', children: [
    { name: 'location.latitude',  type: 'float', desc: 'Latitude of the station.' },
    { name: 'location.longitude', type: 'float', desc: 'Longitude of the station.' },
  ]},
  { name: 'chargingTimeInSeconds',          type: 'integer', desc: 'Estimated time to charge from arrival SoC to targetChargeAfterChargingInkWh.' },
  { name: 'targetChargeAfterChargingInkWh', type: 'float',   desc: 'Battery level the vehicle should reach before leaving this stop.' },
];

/* ─── Code examples ───────────────────────────────────────────────────────────── */

const CODE_RESPONSE = `{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 35.4,
      "remainingChargeAtArrivalInkWh": 5.0,
      "totalChargingTimeInSeconds": 3900
    },
    "sections": [
      { "startPointIndex": 0,  "endPointIndex": 47,
        "sectionType": "TRAVEL" },
      { "startPointIndex": 47, "endPointIndex": 47,
        "sectionType": "CHARGING_STATION",
        "chargingStationData": {
          "connectors": [{
            "connectorType": { "value": "IEC62196Type2CCS" },
            "ratedPowerKW": 150,
            "currentType": "DC"
          }],
          "brandName": "Fastned",
          "chargingParkName": "Fastned Liège-Ardenne A3",
          "location": { "latitude": 50.581, "longitude": 5.571 },
          "chargingTimeInSeconds": 1620,
          "targetChargeAfterChargingInkWh": 60.0
        }
      },
      // ... second TRAVEL + CHARGING_STATION section omitted
    ],
    "chargingInformationAtLegs": [{
      "chargingParkName": "Fastned Liège-Ardenne A3",
      "chargingTimeInSeconds": 1620,
      "targetChargeAfterChargingInkWh": 60.0
    }]
  }]
}`;


/* ─── Response sections ──────────────────────────────────────────────────────── */
const RESPONSE_SECTIONS_DATA = [
  {
    id: 'api-ldevr-response-summary',
    heading: 'Route & battery summary',
    note: (
      <>
        The response mirrors <strong>Calculate Route</strong> with the addition of{' '}
        <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>CHARGING_STATION</code>{' '}
        sections and per-route battery summary fields.
      </>
    ),
    params: EV_SUMMARY_FIELDS,
    extra: (
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Section types
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {SECTION_TYPES.map(s => (
            <div key={s.type} style={{ padding: '12px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <code style={{ fontSize: '0.875rem', color: s.type === 'CHARGING_STATION' ? '#22c55e' : 'var(--blue)', fontFamily: 'monospace', fontWeight: 700, display: 'block', marginBottom: 5 }}>{s.type}</code>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    code: CODE_RESPONSE,
    lang: 'json',
  },
  {
    id: 'api-ldevr-response-station',
    heading: 'Charging stop details',
    params: CHARGING_STATION_FIELDS,
    code: CODE_RESPONSE,
    lang: 'json',
  },
  {
    id: 'api-ldevr-errors',
    heading: 'Error codes',
    params: [],
    note: 'When a request fails the API returns an HTTP error status and a JSON body describing the problem.',
    extra: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {[
          { code: '400',        title: 'Bad Request',          desc: 'Invalid parameter values — typically a malformed connectorSet, out-of-range charge values, or an invalid consumption table.' },
          { code: '400 · 4004', title: 'Route Not Found',      desc: 'No feasible route exists. Check that connectorSet covers stations along the corridor and that currentChargeInkWh is sufficient to reach the first available charger.' },
          { code: '400 · 4015', title: 'Insufficient Battery', desc: 'currentChargeInkWh is too low to reach any charging station from the origin. Consider reducing minChargeAtChargingStopsInkWh or starting with more charge.' },
          { code: '403',        title: 'Forbidden',            desc: 'API key does not have access to Long Distance EV Routing. This feature is available on Developer, Flex, and Enterprise plans.' },
          { code: '429',        title: 'Too Many Requests',    desc: 'Rate limit exceeded. EV route requests count toward the Routing API quota.' },
        ].map(e => (
          <div key={e.code} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '12px 14px', borderRadius: 20,
            border: '1px solid var(--border)', background: 'var(--bg)',
          }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
              borderRadius: 4, background: 'rgba(226,0,26,0.08)',
              color: '#e2001a', fontFamily: 'monospace', letterSpacing: '0.02em',
              flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap',
            }}>{e.code}</span>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    lang: 'json',
    code: `// HTTP 400 · detailedError code 4004
{
  "formatVersion": "0.0.12",
  "detailedError": {
    "code": "MV_ROUTE_NOT_FOUND",
    "message": "Engine failure to find a route.",
    "target": "calculateLongDistanceEVRoute",
    "innererror": {
      "code": "4004",
      "message": "No feasible route exists. Verify that connectorSet covers charging stations along the corridor and that currentChargeInkWh is sufficient to reach the first stop."
    }
  }
}`,
  },
];

/* ─── Cross-reference chip ───────────────────────────────────────────────────── */
function SeeAlso({ label, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '10px 14px', borderRadius: 12,
        border: '1px solid var(--border)', background: 'var(--bg)',
        marginBottom: 16, cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = 'rgba(0,112,205,0.04)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
      role="link"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <span style={{ fontSize: '0.875rem', color: 'var(--blue)', marginTop: 1, flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
          <path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 3 }}>
          Core Concepts: {label}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function RoutingEVRoute({ onNavigate }) {

  /* ─── Parameter sections — each with its own contextual code example ── */
  const sections = [
    {
      id: 'api-ldevr-route',
      heading: 'Route planning',
      method: 'POST',
      params: PARAMS_ROUTE,
      tokens: {
        routeType: 'routeType=eco',
        travelMode: 'travelMode=car',
      },
      extra: (
        <SeeAlso
          label="Charging Stop Selection"
          desc="How automaticFastest and manualFastest affect stop placement, SoC thresholds, and manual waypoints."
          onClick={() => onNavigate?.('ldevr-charging-stops', 'ldevr')}
        />
      ),
      code: `# Route: Amsterdam (52.3676, 4.9041) → Paris (48.8566, 2.3522)
# Long distance EV route with live traffic and toll avoidance

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
  52.3676,4.9041:48.8566,2.3522/json\\
  ?travelMode=car\\
  &routeType=eco\\
  &traffic=true\\
  &avoid=tollRoads\\
  &key=YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    },
    {
      id: 'api-ldevr-battery',
      heading: 'Electric vehicle & battery',
      method: 'POST',
      params: PARAMS_EV,
      code: `# Battery state: 45 kWh available, 75 kWh total capacity
# Arrive with at least 5 kWh; charge stops to at least 5 kWh before continuing

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
  52.3676,4.9041:48.8566,2.3522/json\\
  ?vehicleEngineType=electric\\
  &currentChargeInkWh=45\\
  &maxChargeInkWh=75\\
  &minChargeAtDestinationInkWh=5\\
  &minChargeAtChargingStopsInkWh=5\\
  &targetChargeAtChargingStopsInkWh=60\\
  &key=YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    },
    {
      id: 'api-ldevr-connector',
      heading: 'Charging connector & power',
      method: 'POST',
      params: PARAMS_CONNECTOR,
      extra: (
        <div style={{ marginTop: 8 }}>
          <SeeAlso
            label="Connector Types"
            desc="Plug type codes for the POST body, currentType values, effective charging power formula, and connector compatibility by region."
            onClick={() => onNavigate?.('ldevr-connectors', 'ldevr')}
          />
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Connector types reference
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: 10, lineHeight: 1.6 }}>
            Pass one or more of these identifiers as a comma-separated value for <code className="ic" style={{ fontSize: '0.75rem' }}>connectorSet</code>.
          </p>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="prop-table" style={{ minWidth: 360 }}>
              <thead>
                <tr>
                  <th>connectorSet value</th>
                  <th>Common name</th>
                  <th>Region</th>
                  <th>Typical power</th>
                </tr>
              </thead>
              <tbody>
                {CONNECTORS.map(c => (
                  <tr key={c.id}>
                    <td><code style={{ fontSize: '0.75rem' }}>{c.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{c.label}</td>
                    <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{c.region}</td>
                    <td style={{ color: 'var(--mid)', whiteSpace: 'nowrap' }}>{c.power}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
      lang: 'json',
      code: `// POST body — chargingParameters
// Defines battery charge curve and supported connector types.
// Send as the JSON body alongside URL query parameters.

{
  "chargingParameters": {

    // Charge curve: at 50 kWh SoC → max 200 kW; tapers as battery fills
    "batteryCurve": [
      { "stateOfChargeInkWh": 20.0, "maxPowerInkW": 250 },
      { "stateOfChargeInkWh": 50.0, "maxPowerInkW": 200 },
      { "stateOfChargeInkWh": 65.0, "maxPowerInkW": 100 },
      { "stateOfChargeInkWh": 75.0, "maxPowerInkW":  40 }
    ],

    // Supported connectors — DC fast charging (CCS2) + AC fallback (Type 2)
    "chargingConnectors": [
      {
        "currentType": "DC",
        "plugTypes": ["Combo_to_IEC_62196_Type_2_Base"],
        "voltageRange": { "minVoltageInV": 200, "maxVoltageInV": 920 },
        "efficiency": 0.93,
        "maxPowerInkW": 250
      },
      {
        "currentType": "AC3",
        "plugTypes": ["IEC_62196_Type_2_Outlet"],
        "efficiency": 0.90,
        "maxPowerInkW": 11
      }
    ],

    "chargingTimeOffsetInSec": 120
  }
}`,
    },
    {
      id: 'api-ldevr-consumption',
      heading: 'Energy consumption model',
      method: 'POST',
      params: PARAMS_CONSUMPTION,
      extra: (
        <SeeAlso
          label="Battery & Consumption Model"
          desc="How to build accurate consumption curves, set the battery charge curve, configure efficiency parameters, and model auxiliary power loads."
          onClick={() => onNavigate?.('ldevr-battery-model', 'ldevr')}
        />
      ),
      code: `# Speed-to-consumption table (speed km/h : kWh per 100 km)
# Values below are typical for a mid-size EV sedan

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
  52.3676,4.9041:48.8566,2.3522/json\\
  ?vehicleEngineType=electric\\
  &currentChargeInkWh=45\\
  &maxChargeInkWh=75\\
  &minChargeAtDestinationInkWh=5\\
  &connectorSet=IEC62196Type2CCS\\
  &minPowerKW=50\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,8.2:90,14.6:120,21.0\\
  &auxiliaryPowerInkW=1.5\\
  &accelerationEfficiency=0.9\\
  &decelerationEfficiency=0.9\\
  &uphillEfficiency=0.9\\
  &downhillEfficiency=0.9\\
  &key=YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Long Distance EV Route</h1>
        <PageActions pageId="routing-ev-route" pageTitle="Long Distance EV Route" />
      </div>


      {/* ── Description ── */}
      <p className="quick-answer">
        Plans multi-stop EV routes across distances that exceed a single charge. Pass battery state, connector types, and a speed–consumption table; the API selects optimal charging stops and returns a full itinerary with station details and dwell times.
      </p>

      {/* ── Two-column: params left, sticky code right ── */}
      <div className="zone">
        <Callout type="info" title="Request format">
          Long Distance EV Route uses <strong>POST</strong>. Route points are passed in the URL path; all other parameters go in the query string.
        </Callout>
        <ApiRefTwoCol
          sections={sections}
          panelLabel="Example"
        />
      </div>

      {/* ── Response + Error codes ── */}
      <div className="zone">
        <h2 className="sh" id="ev-response">Response</h2>
        <ApiRefTwoCol
          sections={RESPONSE_SECTIONS_DATA}
          panelLabel="Response example"
        />
      </div>

      {/* ── Related ── */}
      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-first-route', 'ldevr')}>
          Quick Start →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>
          Calculate Route →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-intro', 'ldevr')}>
          LDEVR overview →
        </button>
      </div>
    </div>
  );
}
