import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PARAMS = [
  { name: 'parkingId', required: true, type: 'string', desc: 'TomTom parking facility ID. Obtain from a parking search result.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
];

const RESPONSE_FIELDS = [
  { name: 'parkingId', type: 'string', desc: 'Parking facility identifier.' },
  { name: 'name', type: 'string', desc: 'Facility display name.' },
  {
    name: 'tariffs', type: 'array', desc: 'List of pricing tiers. Tiers are ordered by duration.',
    children: [
      { name: 'duration', type: 'object', desc: 'Duration range this tier applies to, in minutes.' },
      { name: 'duration.from', type: 'integer', desc: 'Start of the duration window in minutes (inclusive).' },
      { name: 'duration.to', type: 'integer', desc: 'End of the duration window in minutes (exclusive). Omitted on the last tier.' },
      { name: 'price', type: 'number', desc: 'Cost for this duration tier.' },
      { name: 'currency', type: 'string', desc: 'ISO 4217 currency code (e.g. EUR, GBP, USD).' },
      { name: 'conditions', type: 'string', desc: 'Human-readable conditions for this tariff, e.g. "Mon–Fri 08:00–18:00".' },
      { name: 'paymentMethods', type: 'array', values: ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'APP', 'CONTACTLESS'], desc: 'Accepted payment methods for this tariff.' },
    ],
  },
];

const CODE = `curl "https://api.tomtom.com/parking/2/prices/EEE60B32E17403E8CA9CDB14.json?key=YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "parkingId": "EEE60B32E17403E8CA9CDB14",
  "name": "Amsterdam Centraal Parkeergarage",
  "tariffs": [
    {
      "duration": { "from": 0, "to": 30 },
      "price": 2.50,
      "currency": "EUR",
      "conditions": "Mon–Sun 00:00–24:00",
      "paymentMethods": ["CREDIT_CARD", "DEBIT_CARD", "APP", "CONTACTLESS"]
    },
    {
      "duration": { "from": 30, "to": 60 },
      "price": 4.50,
      "currency": "EUR",
      "conditions": "Mon–Sun 00:00–24:00",
      "paymentMethods": ["CREDIT_CARD", "DEBIT_CARD", "APP", "CONTACTLESS"]
    },
    {
      "duration": { "from": 60, "to": 120 },
      "price": 8.00,
      "currency": "EUR",
      "conditions": "Mon–Sun 00:00–24:00",
      "paymentMethods": ["CREDIT_CARD", "DEBIT_CARD", "APP", "CONTACTLESS"]
    },
    {
      "duration": { "from": 120 },
      "price": 14.00,
      "currency": "EUR",
      "conditions": "Daily maximum",
      "paymentMethods": ["CREDIT_CARD", "DEBIT_CARD", "APP", "CONTACTLESS"]
    }
  ]
}`;

export default function ParkingPrices({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Parking Prices"
      description="Retrieve detailed pricing tariffs for an off-street parking facility. Returns duration-based pricing tiers, accepted payment methods, and applicable conditions such as day-of-week or time-of-day restrictions."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Parking Prices',
          method: 'GET',
          demoId: 'parking-prices',
          note: 'https://api.tomtom.com/parking/2/prices/{parkingId}.json',
          params: PARAMS,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: RESPONSE_FIELDS,
          code: CODE_RESPONSE,
          lang: 'json',
        },
      ]}
    />
  );
}
