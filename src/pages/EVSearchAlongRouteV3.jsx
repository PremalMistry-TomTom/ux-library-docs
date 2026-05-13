import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── V3 Orbis Maps — EV Search Along Route ─────────────────────────────────
   Endpoint: POST /maps/orbis/places/ev/sar
   Requires: TomTom-Api-Version: 1 header
   Status:   Private Preview
────────────────────────────────────────────────────────────────────────────── */

const QUERY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'detour', type: 'boolean', default: false, desc: 'When true, enriches each result with detour distance, detour time, and detour offset from the route start. Maximum limit is capped at 20 when enabled.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100). Capped at 20 when detour=true.' },
  { name: 'status', type: 'string', values: ['Available', 'Reserved', 'Occupied', 'OutOfService', 'Unknown'], desc: 'Comma-separated charging point status values to filter by.' },
  { name: 'connector', type: 'string', desc: 'Comma-separated connector types to filter by. Example: IEC62196Type2Outlet,IEC62196Type2CCS,Chademo.' },
  { name: 'accessType', type: 'string', values: ['Public', 'Authorized', 'Restricted', 'Private', 'Unknown'], desc: 'Comma-separated access types to filter by.' },
  { name: 'restriction', type: 'string', values: ['evOnly', 'plugged', 'disabled', 'customers', 'motorcycles'], desc: 'Comma-separated parking restriction types to filter by.' },
  { name: 'capability', type: 'string', desc: 'Comma-separated capability filters. Values: RemoteStartStopCapable, Reservable, RfidReader, CreditCardPayable, ContactlessCardSupport, PlugAndCharge, ChargingProfileCapable, and others.' },
  { name: 'minPowerKW', type: 'double', desc: 'Minimum connector power in kilowatts (closed interval). Example: 22.2.' },
  { name: 'maxPowerKW', type: 'double', desc: 'Maximum connector power in kilowatts (closed interval). Example: 150.0.' },
  { name: 'vehicleType', type: 'string', values: ['Car', 'Truck'], desc: 'Comma-separated vehicle types the station must support.' },
  { name: 'vehicleCategory', type: 'string', values: ['N1', 'N2', 'N3', 'N3+O4'], desc: 'Comma-separated vehicle categories. URL-encode the plus sign: N3%2BO4.' },
  { name: 'vehicleHeight', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this height in metres.' },
  { name: 'vehicleWidth', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this width in metres.' },
  { name: 'vehicleLength', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this length in metres.' },
  { name: 'vehicleWeight', type: 'integer', desc: 'Restrict to stations accessible by vehicles up to this weight in kilograms.' },
  { name: 'vehicleBrand', type: 'string', desc: 'Restrict to stations where this vehicle brand is permitted to charge. Example: Tesla.' },
  { name: 'nearby', type: 'string', desc: 'Comma-separated POI category IDs for nearby amenities filter.' },
  { name: 'brand', type: 'string', desc: 'Comma-separated EV network brand names or IDs. Example: TotalEnergies,Allego.' },
  { name: 'paymentBrand', type: 'string', desc: 'Comma-separated payment brand names or IDs. Example: Shell Recharge,Plugsurfing.' },
  { name: 'include', type: 'string', values: ['tariffs'], desc: 'Additional data to include in the response. Use include=tariffs to receive connector pricing information.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RS', 'RU', 'TR', 'CN', 'TW'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
];

const BODY_FIELDS = [
  { name: 'route', required: true, type: 'object', desc: 'GeoJSON LineString geometry describing the route to search along.' },
  { name: 'route.type', required: true, type: 'string', desc: 'GeoJSON geometry type. Must be "LineString".' },
  { name: 'route.coordinates', required: true, type: 'array', desc: 'Array of [longitude, latitude] coordinate pairs defining the route. Per RFC 7946, longitude comes first.' },
  { name: 'width', type: 'integer', default: 500, desc: 'Search corridor width in metres from the route geometry. Default 500 m.' },
];

const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults (results in response) and totalResults (total matching results).' },
  { name: 'results', type: 'array', desc: 'Array of EV POIs along the route corridor.' },
  { name: 'results[].id', type: 'string', desc: 'Unique EV POI ID (UUID). Use with EV Search by Id for full detail.' },
  { name: 'results[].name', type: 'string', desc: 'Display name of the charging location.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the EV POI.' },
  { name: 'results[].detourInfo', type: 'object', desc: 'Detour details — only present when detour=true is requested.', children: [
    { name: 'detourInfo.detourDistance', type: 'double', desc: 'Additional distance in metres compared to the original route. Negative if the detoured route is shorter.' },
    { name: 'detourInfo.detourTime', type: 'integer', desc: 'Additional time in seconds required for the detour. Negative if the detoured route is faster.' },
    { name: 'detourInfo.detourOffset', type: 'double', desc: 'Distance in metres from the route start to the point where the detour begins.' },
  ]},
  { name: 'results[].chargingStations', type: 'array', desc: 'Array of charging stations at this POI.', children: [
    { name: 'chargingStations[].id', type: 'string', desc: 'Station ID in EVSE format.' },
    { name: 'chargingStations[].chargingPoints', type: 'array', desc: 'Individual charging points with evseId, status, capabilities, and connectors.', children: [
      { name: 'chargingPoints[].evseId', type: 'string', desc: 'Unique EVSE ID for the charging point.' },
      { name: 'chargingPoints[].status', type: 'string', desc: 'Live status: Available, Reserved, Occupied, OutOfService, Unknown.' },
      { name: 'chargingPoints[].connectors', type: 'array', desc: 'Connectors with type, currentType, ratedPowerKW, currentA, voltageV, and optional tariffId.' },
    ]},
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, streetNumber, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].accessType', type: 'string', desc: 'Access restriction: Public, Authorized, Restricted, or Private.' },
  { name: 'results[].timeZone', type: 'object', desc: 'IANA time zone ID for the POI. Example: { ianaId: "Europe/Amsterdam" }.' },
  { name: 'results[].nearbyPois', type: 'array', desc: 'Category IDs of POIs within walking distance.' },
  { name: 'references', type: 'object', desc: 'Tariff details when include=tariffs is used.' },
];

const CODE = `# EV Search Along Route (v3 Orbis) — CCS chargers ≥50 kW within 1 km of route corridor
curl --location \\
  "https://api.tomtom.com/maps/orbis/places/ev/sar?key=YOUR_API_KEY\\
&connector=IEC62196Type2CCS\\
&minPowerKW=50\\
&status=Available,Unknown\\
&accessType=Public\\
&detour=true\\
&limit=10\\
&view=Unified" \\
  --header "Content-Type: application/json" \\
  --header "TomTom-Api-Version: 1" \\
  --data '{
    "route": {
      "type": "LineString",
      "coordinates": [
        [4.90415, 52.36759],
        [4.90393, 52.36774],
        [4.90386, 52.36775],
        [4.90355, 52.36793],
        [4.90344, 52.36799],
        [4.90310, 52.36796],
        [4.90299, 52.36793]
      ]
    },
    "width": 1000
  }'`;

const CODE_RESPONSE = `{
  "summary": { "numResults": 2, "totalResults": 5 },
  "results": [
    {
      "id": "79ded460-ecbb-4699-852b-71e8cf1d27ab",
      "name": "FastCharge NL — Mosveld",
      "position": { "lat": 52.3791, "lon": 4.9058 },
      "detourInfo": {
        "detourDistance": 420.5,
        "detourTime": 95,
        "detourOffset": 1240.0
      },
      "chargingStations": [
        {
          "id": "NL*FNL*E00456",
          "chargingPoints": [
            {
              "evseId": "NL*FNL*E00456*1",
              "status": "Available",
              "capabilities": ["RemoteStartStopCapable", "RfidReader", "CreditCardPayable"],
              "connectors": [
                {
                  "id": "1",
                  "type": "IEC62196Type2CCS",
                  "currentType": "DC",
                  "ratedPowerKW": 150.0
                }
              ]
            }
          ]
        }
      ],
      "address": {
        "streetName": "Mosveld",
        "streetNumber": "3",
        "municipality": "Amsterdam",
        "postalCode": "1032 GC",
        "countryCode": "NL",
        "freeformAddress": "Mosveld 3, 1032 GC Amsterdam"
      },
      "accessType": "Public",
      "timeZone": { "ianaId": "Europe/Amsterdam" }
    }
  ]
}`;

/* ─── V3 Content (named export for Unified wrapper) ─────────────────────────── */
export function EVSearchAlongRouteV3Content({ onNavigate }) {
  return (
    <>
      <PrivatePreviewBanner api="EV & Charging API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Find EV charging stations within a corridor along a pre-calculated route using the Orbis Maps SAR endpoint. Identical filter parameters to v1 but on the new Orbis base URL. Requires the TomTom-Api-Version: 1 header on every request."
        sections={[
          {
            id: 'request',
            heading: 'Request',
            method: 'POST',
            note: 'https://api.tomtom.com/maps/orbis/places/ev/sar — Orbis Maps v3 (Private Preview). Requires TomTom-Api-Version: 1 header and a JSON body containing the route geometry (GeoJSON LineString) and optional corridor width.',
            params: QUERY_PARAMS,
            code: CODE,
            lang: 'bash',
          },
          {
            id: 'request-body',
            heading: 'Request Body',
            note: 'POST body must be application/json. Supply route as a GeoJSON LineString with coordinates in [longitude, latitude] order.',
            params: BODY_FIELDS,
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
