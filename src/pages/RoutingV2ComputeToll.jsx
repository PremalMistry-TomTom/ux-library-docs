import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_TOLL = [
  {
    name: 'computeTollAmounts',
    type: 'string',
    default: 'none',
    values: ['none', 'totalToll'],
    desc: 'Calculates toll amounts. When totalToll, the response summary includes a totalTollAmounts array with per-currency breakdown.',
    children: [
      { name: 'none', desc: 'Does not calculate toll amounts.' },
      { name: 'totalToll', desc: 'Calculates toll costs using the payment method determined by the vehicleHasElectronicTollCollectionTransponder value.' },
    ],
  },
  {
    name: 'vehicleHasElectronicTollCollectionTransponder',
    type: 'string',
    default: 'unknown',
    values: ['all', 'unknown', 'none'],
    desc: 'Availability of an ETC transponder. Determines which toll costs are calculated.',
    children: [
      { name: 'all', desc: 'The vehicle accepts all ETC transponder toll systems.' },
      { name: 'unknown', desc: 'Transponder availability is not known; cash payment is used as a fallback. This is the default.' },
      { name: 'none', desc: 'No ETC transponder is present; tolls that are ETC-only are excluded from the calculation.' },
    ],
  },
];

/* ─── Response parameters ────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'totalTollAmounts',
    type: 'array',
    desc: 'Sum of all toll amounts along the route. One entry per currency.',
    children: [
      {
        name: 'totalTollAmounts[].price',
        type: 'object',
        desc: 'Price object for a single currency.',
        children: [
          { name: 'price.amount', type: 'number', desc: 'The toll amount in major currency units.' },
          { name: 'price.minorUnit', type: 'integer', desc: 'Number of minor units after the decimal separator (e.g. 2 for EUR/USD, 0 for JPY).' },
          { name: 'price.currency', type: 'string', desc: 'ISO 4217 three-letter currency code (e.g. EUR, USD, JPY).' },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `curl "https://api.tomtom.com/maps/orbis/routing/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?computeTollAmounts=totalToll\\
&vehicleHasElectronicTollCollectionTransponder=all" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "routes": [{
    "summary": {
      "lengthInMeters": 1879,
      "travelTimeInSeconds": 396,
      "totalTollAmounts": [
        { "price": { "amount": 12.00, "minorUnit": 2, "currency": "EUR" } }
      ]
    }
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV2ComputeToll() {
  const sections = [
    {
      id: 'routing-v2-toll',
      heading: 'Request parameters',
      method: 'GET',
      note: 'computeTollAmounts and vehicleHasElectronicTollCollectionTransponder are supported on both GET and POST Calculate Route v2 requests.',
      params: PARAMS_TOLL,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v2-toll-response',
      heading: 'Response data',
      note: 'totalTollAmounts is only present when computeTollAmounts=totalToll. The price object uses ISO 4217 currency codes.',
      params: PARAMS_RESPONSE,
      extra: (
        <div style={{
          padding: '12px 14px', borderRadius: 20,
          border: '1px solid var(--border)', background: 'var(--bg)',
          fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6, marginTop: 4,
        }}>
          <strong style={{ color: 'var(--black)' }}>Supported countries</strong>
          {' — '}
          Currently toll amount calculation is not available in any region. Coverage is being rolled out progressively.
        </div>
      ),
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Compute Toll Amounts"
      description="Calculate total toll costs on Routing API v2 routes. Available on both GET and POST. Returns totalTollAmounts in the route summary broken down by currency, with optional ETC transponder support."
      version="v2-public"
      sections={sections}
    />
  );
}
