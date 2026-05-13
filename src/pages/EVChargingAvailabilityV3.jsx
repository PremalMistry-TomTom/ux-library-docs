import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── V3 Orbis Maps — Charging Availability ─────────────────────────────────
   Endpoint: GET /maps/orbis/ev/chargingAvailability
   Requires: TomTom-Api-Version: 1 header
   Status:   Private Preview
────────────────────────────────────────────────────────────────────────────── */

const AVAILABILITY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'chargingAvailability', type: 'string', desc: 'Connector set ID returned in the dataSources.chargingAvailability.id field of a search result. Either this or id is required.' },
  { name: 'id', type: 'string', desc: 'Charging park POI ID. Alternative to chargingAvailability. Use when you already have the park identifier from a previous search.' },
  {
    name: 'connectorSet',
    type: 'string',
    desc: 'Comma-separated connector types to filter the availability response by. Only connector types matching this list are returned.',
    values: [
      'IEC62196Type1',
      'IEC62196Type1CCS',
      'IEC62196Type2CableAttached',
      'IEC62196Type2Outlet',
      'IEC62196Type2CCS',
      'IEC62196Type3',
      'Chademo',
      'GBT20234Part2',
      'GBT20234Part3',
      'Tesla',
      'AdaptedTesla',
    ],
  },
  { name: 'minPowerKW', type: 'double', desc: 'Minimum power in kilowatts. Only connector types with at least this rated power are returned.' },
  { name: 'maxPowerKW', type: 'double', desc: 'Maximum power in kilowatts. Only connector types with at most this rated power are returned.' },
];

const RESPONSE_FIELDS = [
  { name: 'chargingAvailability', type: 'object', desc: 'Root availability object.' },
  { name: 'chargingAvailability.id', type: 'string', desc: 'Connector set ID for this station.' },
  { name: 'chargingAvailability.connectors', type: 'array', desc: 'Array of connector type groups, each with type, total count, and live availability counts.', children: [
    { name: 'connectors[].type', type: 'object', desc: 'Connector type descriptor: id (enum string) and name (display label).' },
    { name: 'connectors[].availability', type: 'object', desc: 'Live availability counts for this connector type.', children: [
      { name: 'availability.current', type: 'object', desc: 'Current real-time counts: available, occupied, reserved, outOfService, unknown.' },
      { name: 'availability.perPowerLevel', type: 'array', desc: 'Availability broken down by power level (ratedPowerKW): available, occupied, reserved, outOfService, unknown per level.' },
    ]},
  ]},
  { name: 'lastUpdated', type: 'string (ISO 8601)', desc: 'Timestamp when the availability data was last refreshed. Format: YYYY-MM-DDTHH:mm:ssZ.' },
];

const AVAILABILITY_CODE = `# Charging Availability (v3 Orbis) — using a chargingAvailability ID from a search result
curl "https://api.tomtom.com/maps/orbis/ev/chargingAvailability.json?key=YOUR_API_KEY\\
&chargingAvailability=00112233-4455-6677-8899-aabbccddeeff\\
&connectorSet=IEC62196Type2CableAttached\\
&minPowerKW=22.2&maxPowerKW=43.2" \\
  -H "TomTom-Api-Version: 1"

# Using a charging park POI ID directly
curl "https://api.tomtom.com/maps/orbis/ev/chargingAvailability.json?key=YOUR_API_KEY\\
&id=CHARGING_PARK_ID" \\
  -H "TomTom-Api-Version: 1"`;

const CODE_RESPONSE = `{
  "chargingAvailability": {
    "id": "00112233-4455-6677-8899-aabbccddeeff",
    "connectors": [
      {
        "type": {
          "id": "IEC62196Type2CableAttached",
          "name": "IEC 62196 Type 2 (Cable attached)"
        },
        "availability": {
          "current": {
            "available": 2,
            "occupied": 1,
            "reserved": 0,
            "outOfService": 0,
            "unknown": 0
          },
          "perPowerLevel": [
            {
              "ratedPowerKW": 22.0,
              "available": 2,
              "occupied": 1,
              "reserved": 0,
              "outOfService": 0,
              "unknown": 0
            }
          ]
        }
      }
    ]
  },
  "lastUpdated": "2026-05-12T10:30:00Z"
}`;

/* ─── V3 Content (named export for Unified wrapper) ─────────────────────────── */
export function EVChargingAvailabilityV3Content({ onNavigate }) {
  return (
    <>
      <PrivatePreviewBanner api="EV & Charging API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Query real-time connector availability at a charging station using the Orbis Maps endpoint. Returns per-connector-type counts of available, occupied, and out-of-service connectors. Requires the TomTom-Api-Version: 1 header on every request."
        sections={[
          {
            id: 'charging-availability',
            heading: 'Charging Availability',
            method: 'GET',
            note: 'https://api.tomtom.com/maps/orbis/ev/chargingAvailability — Orbis Maps v3 (Private Preview). Requires TomTom-Api-Version: 1 header. Provide either a chargingAvailability ID (from dataSources.chargingAvailability.id in a search result) or a charging park id. Real-time data coverage varies by country.',
            params: AVAILABILITY_PARAMS,
            code: AVAILABILITY_CODE,
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
    </>
  );
}
