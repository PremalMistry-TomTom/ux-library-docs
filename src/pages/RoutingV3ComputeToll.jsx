import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

const PUBLIC_PREVIEW_NOTE = (
  <>
    <strong>Public Preview — Routing API v3.</strong> This is an extension to the v3 Calculate Route
    service that provides toll amount data. The same parameters are available in both GET and POST
    request formats. Toll calculation coverage is being rolled out progressively by country.
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'computeTollAmounts',
    type: 'string',
    default: 'none',
    values: ['none', 'totalToll'],
    desc: 'Calculates toll amounts for the route. When set to totalToll, the response includes a totalTollAmounts array with the total toll cost broken down by currency.',
    children: [
      { name: 'computeTollAmounts: none', type: '', desc: 'Does not calculate toll amounts on routes. Default value.' },
      { name: 'computeTollAmounts: totalToll', type: '', desc: 'Calculates the total toll along the route using a payment method based on the vehicleHasElectronicTollCollectionTransponder value.' },
    ],
  },
  {
    name: 'vehicleHasElectronicTollCollectionTransponder',
    type: 'string',
    default: 'unknown',
    values: ['all', 'unknown', 'none'],
    desc: 'Specifies the availability of an ETC (Electronic Toll Collection) transponder in the vehicle. Affects which toll costs are computed.',
    children: [
      { name: 'value: all', type: '', desc: 'The vehicle\'s ETC transponder accepts all road tolls.' },
      { name: 'value: unknown', type: '', desc: 'Not known whether the vehicle has an ETC transponder. Default. Ordinary toll payment methods are used as fallback.' },
      { name: 'value: none', type: '', desc: 'Vehicle has no ETC transponder. ETC-only toll costs are not calculated.' },
    ],
  },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'totalTollAmounts',
    type: 'array',
    desc: 'Sum of all toll amounts along the route. One entry per currency. Only present in the response when computeTollAmounts is set to totalToll.',
    children: [
      {
        name: 'totalTollAmounts[].price',
        type: 'object',
        desc: 'The price object for this currency.',
        children: [
          { name: 'totalTollAmounts[].price.amount', type: 'number', desc: 'The toll amount. Returns N/A if unavailable.' },
          { name: 'totalTollAmounts[].price.currencyCode', type: 'string', desc: 'ISO 4217 three-letter currency code (e.g. EUR, USD, GBP).' },
          { name: 'totalTollAmounts[].price.currency', type: 'string', desc: 'Full currency name.' },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `# Routing API v3 — Compute Toll Amounts (GET)
curl -X GET \\
  "https://api.tomtom.com/maps/orbis/routing/v3/calculateRoute/\\
  52.3676,4.9041:48.8566,2.3522/json?\\
  computeTollAmounts=totalToll&\\
  vehicleHasElectronicTollCollectionTransponder=all&\\
  key=YOUR_API_KEY"`;

const CODE_POST = `# Routing API v3 — Compute Toll Amounts (POST)
curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/v3/calculateRoute" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Attributes: summary,legs" \\
  -d '{
    "legs": [
      { "routeStop": { "entryPoints": [{ "latitude": 52.36443, "longitude": 13.50929 }] } },
      { "routeStop": { "entryPoints": [{ "latitude": 48.85660, "longitude":  2.35220 }] } }
    ],
    "computeTollAmounts": "totalToll",
    "vehicleHasElectronicTollCollectionTransponder": "all"
  }'`;

const CODE_RESPONSE = `// Successful response — toll amounts in route summary
{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "totalTollAmounts": [
        {
          "price": {
            "amount": 14.80,
            "currencyCode": "EUR",
            "currency": "Euro"
          }
        }
      ]
    }
  }]
}`;

const SUPPORTED_NOTE = (
  <div style={{
    marginTop: 16, padding: '12px 16px', borderRadius: 8,
    background: 'rgba(255, 165, 0, 0.06)', border: '1px solid rgba(255, 165, 0, 0.25)',
  }}>
    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>
      Supported countries
    </div>
    <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6 }}>
      Toll calculation is not currently supported in any country. Coverage is being rolled out
      progressively. Check the TomTom developer portal for the latest updates.
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV3ComputeToll() {
  const sections = [
    {
      id: 'routing-v3-toll-get',
      heading: 'Request parameters (GET)',
      method: 'GET',
      params: PARAMS_REQUEST,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v3-toll-post',
      heading: 'Request parameters (POST)',
      method: 'POST',
      params: PARAMS_REQUEST,
      code: CODE_POST,
      lang: 'bash',
    },
    {
      id: 'routing-v3-toll-response',
      heading: 'Response data',
      params: PARAMS_RESPONSE,
      extra: SUPPORTED_NOTE,
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Compute Toll Amounts"
      description="Calculate total toll costs along a Routing API v3 route. Available in both GET and POST request formats. Returns a totalTollAmounts array with per-currency cost breakdowns, accounting for ETC transponder availability."
      version="v3-private"
      topBanner={<PrivatePreviewBanner api="Routing API v3" />}
      sections={sections}
    />
  );
}
