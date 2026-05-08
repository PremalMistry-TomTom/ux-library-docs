import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PRIVATE_PREVIEW_NOTE = (
  <>
    <strong>Private Preview.</strong> This is an extension to the Long Distance EV Routing v2 service
    that provides toll amount data for planned EV routes. Toll calculation support is being rolled
    out per country — see the supported countries note below.
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'computeTollAmounts',
    type: 'string',
    default: 'none',
    values: ['none', 'totalToll'],
    desc: 'Calculates toll amounts for the route. When set to totalToll, returns a totalTollAmounts array in the response containing the total toll cost broken down by currency.',
    children: [
      { name: 'computeTollAmounts: none', type: '', desc: 'Does not calculate toll amounts. Default value.' },
      { name: 'computeTollAmounts: totalToll', type: '', desc: 'Calculates the total toll along the route using a payment method based on the vehicleHasElectronicTollCollectionTransponder value.' },
    ],
  },
  {
    name: 'vehicleHasElectronicTollCollectionTransponder',
    type: 'string',
    default: 'unknown',
    values: ['all', 'unknown', 'none'],
    desc: 'Specifies the availability of an ETC (Electronic Toll Collection) transponder in the vehicle. Affects which toll road costs are computed and which payment methods are considered.',
    children: [
      { name: 'value: all', type: '', desc: 'The vehicle ETC transponder accepts all road tolls.' },
      { name: 'value: unknown', type: '', desc: 'Not known whether the vehicle has an ETC transponder. Default value. If the vehicle does not have a transponder, ordinary toll payment methods are used.' },
      { name: 'value: none', type: '', desc: 'Vehicle has no ETC transponder. If no non-ETC payment methods are available for a toll, properties under that ETC category are not calculated.' },
    ],
  },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'totalTollAmounts',
    type: 'array',
    desc: 'Sum of all toll amounts along the route. One entry per currency. Only present when computeTollAmounts is totalToll.',
    children: [
      {
        name: 'totalTollAmounts[].price',
        type: 'object',
        desc: 'The price object for this currency entry.',
        children: [
          { name: 'totalTollAmounts[].price.amount', type: 'number', desc: 'The price amount. Returns N/A if the amount is not available.' },
          { name: 'totalTollAmounts[].price.currencyCode', type: 'string', desc: 'ISO 4217 three-letter currency code (e.g. EUR, USD).' },
          { name: 'totalTollAmounts[].price.currency', type: 'string', desc: 'Full currency name.' },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR v2 — Compute Toll Amounts
# Adds toll cost data to the EV route response

curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEV" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -d '{
    "legs": [
      { "routeStop": { "entryPoints": [{ "latitude": 52.36443, "longitude": 13.50929 }] } },
      { "routeStop": { "entryPoints": [{ "latitude": 48.85660, "longitude":  2.35220 }] } }
    ],
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0",
    "computeTollAmounts": "totalToll",
    "vehicleHasElectronicTollCollectionTransponder": "all"
  }'`;

const CODE_RESPONSE = `// Successful response — toll amounts in route summary
{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 35.4,
      "remainingChargeAtArrivalInkWh": 5.0,
      "totalChargingTimeInSeconds": 3900,
      "totalTollAmounts": [
        {
          "price": {
            "amount": 12.50,
            "currencyCode": "EUR",
            "currency": "Euro"
          }
        }
      ]
    }
  }]
}`;

/* ─── Supported countries note ──────────────────────────────────────────── */
const SUPPORTED_COUNTRIES_EXTRA = (
  <div style={{
    marginTop: 16, padding: '12px 16px', borderRadius: 8,
    background: 'rgba(255, 165, 0, 0.06)', border: '1px solid rgba(255, 165, 0, 0.25)',
  }}>
    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>
      Supported countries
    </div>
    <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6 }}>
      Toll calculation is not currently supported in any country. This feature is being rolled
      out progressively. Check the TomTom developer portal for the latest coverage updates.
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRComputeToll() {
  const sections = [
    {
      id: 'ldevr-toll-request',
      heading: 'Request parameters',
      method: 'POST',
      note: PRIVATE_PREVIEW_NOTE,
      params: PARAMS_REQUEST,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-toll-response',
      heading: 'Response data',
      params: PARAMS_RESPONSE,
      extra: SUPPORTED_COUNTRIES_EXTRA,
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Compute Toll Amounts"
      description="Add toll cost calculation to Long Distance EV routes. Returns the total toll along the planned route broken down by currency, optionally accounting for an ETC (Electronic Toll Collection) transponder."
      version="v2-private"
      sections={sections}
    />
  );
}
