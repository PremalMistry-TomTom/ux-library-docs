import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PRIVATE_PREVIEW_NOTE = (
  <>
    <strong>Private Preview.</strong> This page describes TomTom's implementation of the
    Entitlements 2.0 specification in the Routing API, which creates custom conditions on
    charging station visibility for OEM partners in EV preferences. This document is provided
    for internal reference purposes.
  </>
);

/* ─── eMSP provider table ────────────────────────────────────────────────── */
const EMSP_PROVIDERS = [
  { code: 'MC', name: 'Maserati Charge' },
  { code: 'NE', name: 'Nissan Energy' },
  { code: 'MY', name: 'MyEasyCharge' },
  { code: 'FC', name: 'F2M Charge' },
  { code: 'EC', name: 'eSolutions Charging' },
  { code: 'XX', name: 'Jaguar Land Rover personal charge' },
];

const EMSP_TABLE = (
  <div style={{ overflowX: 'auto' }}>
    <table className="prop-table" style={{ marginTop: 12 }}>
      <thead>
        <tr>
          <th>eMSP ID</th>
          <th>Provider</th>
        </tr>
      </thead>
      <tbody>
        {EMSP_PROVIDERS.map(p => (
          <tr key={p.code}>
            <td><code style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--blue)', fontWeight: 700 }}>{p.code}</code></td>
            <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>{p.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── Request header parameters ─────────────────────────────────────────── */
const PARAMS_HEADERS = [
  {
    name: 'TomTom-Entitlements',
    type: 'string (header)',
    desc: 'Instructs the Routing API to enable a specific entitlement. The Routing API expects the value of this header to be in accordance with the Entitlements 2.1 spec, while also considering the Entitlements 3.1 spec.',
    children: [
      { name: 'Format', type: '', desc: 'Comma or semicolon-separated list of key=value pairs. Keys are camelCase and must be unique. Values with multiple elements are comma-separated.' },
      { name: 'Constraints', type: '', desc: 'Minimum number of keyValue pairs: 0. Maximum number of values per key: 30. Values may include numbers, commas, semicolons, or spaces. Maximum header length: 248 characters.' },
    ],
  },
];

const PARAMS_SEV = [
  {
    name: 'SEV',
    type: 'string (entitlement key)',
    desc: 'Contains a list of restricted eMSP (Mobility Service Provider) IDs. The only supported value format is PA[<eMSP_IDs>] where eMSP IDs are dash-separated.',
    children: [
      { name: 'Format', type: '', desc: 'PA[<id1>-<id2>-...] where each ID is a 2-letter eMSP code. Example: PA[MC-FC] restricts to Maserati Charge and F2M Charge.' },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR — OEM eMSP Support
# Restrict charging station results to specific eMSP providers
# In this example: Maserati Charge (MC) and F2M Charge (FC)

curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEV" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "TomTom-Entitlements: SEV=PA[MC-FC]" \\
  -d '{
    "legs": [
      { "routeStop": { "entryPoints": [{ "latitude": 52.36443, "longitude": 13.50929 }] } },
      { "routeStop": { "entryPoints": [{ "latitude": 48.85660, "longitude":  2.35220 }] } }
    ],
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0"
  }'`;

const CODE_FLOW = `// How the TomTom-Entitlements header is processed:
//
// 1. OEM API client adds TomTom-Entitlements header to each request
// 2. Routing API reads the SEV key and its list of eMSP IDs
// 3. Charging station results are filtered to show only stations
//    affiliated with the specified eMSP providers
// 4. If the header is absent, restricted eMSP stations are not shown
// 5. If an eMSP ID in the list is not recognised, it is silently ignored

// Valid examples:
TomTom-Entitlements: SEV=PA[MC]          // Maserati Charge only
TomTom-Entitlements: SEV=PA[MC-NE-EC]   // Multiple providers
TomTom-Entitlements: SEV=PA[XX]          // Jaguar Land Rover only`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVROemEmsp() {
  const sections = [
    {
      id: 'ldevr-emsp-headers',
      heading: 'Request headers',
      method: 'POST',
      note: PRIVATE_PREVIEW_NOTE,
      params: PARAMS_HEADERS,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-emsp-sev',
      heading: 'SEV entitlement key',
      params: PARAMS_SEV,
      extra: (
        <>
          <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 12, lineHeight: 1.6 }}>
            Supported eMSP provider IDs:
          </div>
          {EMSP_TABLE}
        </>
      ),
      code: CODE_FLOW,
      lang: 'javascript',
    },
    {
      id: 'ldevr-emsp-response',
      heading: 'Response data',
      params: [],
      note: 'The response format is unchanged from the base Calculate EV Route response. The eMSP entitlement header affects which charging stations are considered during route planning — only stations affiliated with the specified eMSP providers will appear as charging stops.',
      code: `// Response follows the standard Calculate EV Route structure.
// Charging stops in sections[] will only include eMSP-affiliated stations.
{
  "routes": [{
    "sections": [
      { "sectionType": "TRAVEL", "startPointIndex": 0, "endPointIndex": 47 },
      {
        "sectionType": "CHARGING_STATION",
        "chargingStationData": {
          "brandName": "Maserati Charge",
          "chargingParkName": "MC Station — Stuttgart",
          "connectors": [{
            "connectorType": { "value": "IEC62196Type2CCS" },
            "ratedPowerKW": 150
          }]
        }
      }
    ]
  }]
}`,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="OEM eMSP Support"
      description="Restrict route planning to charging stations affiliated with specific eMSP (Mobility Service Provider) networks. Pass the TomTom-Entitlements request header with a SEV entitlement key listing the allowed provider IDs."
      version="v2-private"
      sections={sections}
    />
  );
}
