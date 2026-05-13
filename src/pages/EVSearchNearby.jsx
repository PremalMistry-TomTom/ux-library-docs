import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'lat', type: 'double', desc: 'Latitude of the search centre for circular area search. Range: −90 to 90. Must be paired with lon and radius.' },
  { name: 'lon', type: 'double', desc: 'Longitude of the search centre for circular area search. Range: −180 to 180. Must be paired with lat and radius.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres (1–100000) for circular area search. Must be paired with lat and lon.' },
  { name: 'topLeft', type: 'string', desc: 'Top-left corner of bounding box search as "lat,lon". Must be paired with btmRight. Radius search takes precedence if both sets are provided.' },
  { name: 'btmRight', type: 'string', desc: 'Bottom-right corner of bounding box search as "lat,lon". Must be paired with topLeft. Bounding boxes >200 km diagonal are clipped to 200 km.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'status', type: 'string', values: ['Available', 'Reserved', 'Occupied', 'OutOfService', 'Unknown'], desc: 'Comma-separated charging point status values to filter by.' },
  { name: 'connector', type: 'string', desc: 'Comma-separated connector type IDs. Example: IEC62196Type2Outlet,IEC62196Type2CableAttached,Chademo,IEC62196Type2CCS.' },
  { name: 'accessType', type: 'string', values: ['Public', 'Authorized', 'Restricted', 'Private', 'Unknown'], desc: 'Comma-separated access types to filter by.' },
  { name: 'restriction', type: 'string', values: ['evOnly', 'plugged', 'disabled', 'customers', 'motorcycles'], desc: 'Comma-separated parking restriction types to filter by.' },
  { name: 'capability', type: 'string', desc: 'Comma-separated charging point capability filters. Values: ChargingProfileCapable, RemoteStartStopCapable, Reservable, RfidReader, CreditCardPayable, ContactlessCardSupport, PlugAndCharge, and others.' },
  { name: 'minPowerKW', type: 'double', desc: 'Minimum connector power in kilowatts (closed interval). Example: 22.2.' },
  { name: 'maxPowerKW', type: 'double', desc: 'Maximum connector power in kilowatts (closed interval). Example: 150.0.' },
  { name: 'vehicleType', type: 'string', values: ['Car', 'Truck'], desc: 'Comma-separated vehicle types that the charging station must support.' },
  { name: 'vehicleCategory', type: 'string', values: ['N1', 'N2', 'N3', 'N3+O4'], desc: 'Comma-separated vehicle categories. URL-encode the plus sign: N3%2BO4.' },
  { name: 'vehicleHeight', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this height in metres.' },
  { name: 'vehicleWidth', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this width in metres.' },
  { name: 'vehicleLength', type: 'double', desc: 'Restrict to stations accessible by vehicles up to this length in metres.' },
  { name: 'vehicleWeight', type: 'integer', desc: 'Restrict to stations accessible by vehicles up to this weight in kilograms.' },
  { name: 'vehicleBrand', type: 'string', desc: 'Restrict to stations where this vehicle brand is permitted to charge. Example: Tesla.' },
  { name: 'nearby', type: 'string', desc: 'Comma-separated POI category IDs for filtering stations that have nearby amenities within walking distance. Values: 7315 (Restaurant), 9932 (Public Amenity), 9376 (Café/Pub), 7314 (Hotel/Motel), 9361 (Shop), 9362 (Park).' },
  { name: 'brand', type: 'string', desc: 'Comma-separated EV network brand names or IDs. Example: TotalEnergies,Allego.' },
  { name: 'paymentBrand', type: 'string', desc: 'Comma-separated payment brand names or IDs. Example: Shell Recharge,Plugsurfing,Eneco.' },
  { name: 'include', type: 'string', values: ['tariffs'], desc: 'Additional data to include in the response. Use include=tariffs to receive pricing information for each connector.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RS', 'RU', 'TR', 'CN', 'TW'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults (results in response) and totalResults (total matching results).' },
  { name: 'results', type: 'array', desc: 'Array of EV POI results sorted by distance.' },
  { name: 'results[].id', type: 'string', desc: 'Unique EV POI ID (UUID). Use with EV Search by Id for full detail.' },
  { name: 'results[].name', type: 'string', desc: 'Display name of the charging location.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the EV POI.' },
  { name: 'results[].chargingStations', type: 'array', desc: 'Array of charging stations at this POI. Each station has an id and chargingPoints array.', children: [
    { name: 'chargingStations[].id', type: 'string', desc: 'Station ID in EVSE format, e.g. NL*POD*E1234.' },
    { name: 'chargingStations[].chargingPoints', type: 'array', desc: 'Array of individual charging points (EVSEs) at the station.', children: [
      { name: 'chargingPoints[].evseId', type: 'string', desc: 'Unique EVSE ID for the charging point.' },
      { name: 'chargingPoints[].status', type: 'string', desc: 'Live availability: Available, Reserved, Occupied, OutOfService, Unknown.' },
      { name: 'chargingPoints[].capabilities', type: 'string[]', desc: 'List of charging point capabilities, e.g. RemoteStartStopCapable, RfidReader.' },
      { name: 'chargingPoints[].connectors', type: 'array', desc: 'Array of connectors on this charging point.', children: [
        { name: 'connectors[].id', type: 'string', desc: 'Connector identifier.' },
        { name: 'connectors[].type', type: 'string', desc: 'Connector standard, e.g. IEC62196Type2Outlet, IEC62196Type2CCS, Chademo.' },
        { name: 'connectors[].currentType', type: 'string', desc: 'Electrical current type: AC1, AC3, or DC.' },
        { name: 'connectors[].ratedPowerKW', type: 'double', desc: 'Rated power of the connector in kilowatts.' },
        { name: 'connectors[].currentA', type: 'integer', desc: 'Amperage in amperes.' },
        { name: 'connectors[].voltageV', type: 'integer', desc: 'Voltage in volts.' },
        { name: 'connectors[].tariffId', type: 'string', desc: 'Tariff identifier — only present when include=tariffs is requested.' },
      ]},
    ]},
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, streetNumber, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].phone', type: 'string', desc: 'Contact phone number for the station operator.' },
  { name: 'results[].openingHours', type: 'object', desc: 'Opening schedule when openingHours is requested.' },
  { name: 'results[].timeZone', type: 'object', desc: 'IANA time zone ID for the POI location. Example: { ianaId: "Europe/Amsterdam" }.' },
  { name: 'results[].accessType', type: 'string', desc: 'Access restriction: Public, Authorized, Restricted, or Private.' },
  { name: 'results[].paymentOptions', type: 'array', desc: 'Accepted payment methods and brands.' },
  { name: 'results[].nearbyPois', type: 'array', desc: 'Category IDs of POIs within walking distance (restaurants, shops, etc.).' },
  { name: 'results[].vehicleConstraint', type: 'object', desc: 'Vehicle restrictions: types, categories, length, height, width, weight, brands.' },
  { name: 'references', type: 'object', desc: 'Tariff details when include=tariffs is used. Contains tariffs array with pricing elements and restrictions.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# EV Search Nearby (v1) — available CCS chargers ≥50 kW within 2 km of Amsterdam Centraal
curl "https://api.tomtom.com/search/2/evsearch?key=YOUR_API_KEY\\
&lat=52.3791&lon=4.9003\\
&radius=2000\\
&connector=IEC62196Type2CCS\\
&minPowerKW=50\\
&status=Available\\
&accessType=Public\\
&limit=10\\
&view=Unified"`;

const CODE_RESPONSE = `{
  "summary": {
    "numResults": 2,
    "totalResults": 7
  },
  "results": [
    {
      "id": "0b903425-3f5a-4072-9d5d-070f6f0647b3",
      "name": "Allego Charging Hub AMS",
      "position": { "lat": 52.3812, "lon": 4.9014 },
      "chargingStations": [
        {
          "id": "NL*ALG*E00123",
          "chargingPoints": [
            {
              "evseId": "NL*ALG*E00123*1",
              "status": "Available",
              "capabilities": ["RemoteStartStopCapable", "RfidReader", "CreditCardPayable"],
              "connectors": [
                {
                  "id": "1",
                  "type": "IEC62196Type2CCS",
                  "currentType": "DC",
                  "ratedPowerKW": 150.0,
                  "voltageV": 920
                }
              ]
            },
            {
              "evseId": "NL*ALG*E00123*2",
              "status": "Occupied",
              "capabilities": ["RemoteStartStopCapable", "RfidReader"],
              "connectors": [
                {
                  "id": "1",
                  "type": "Chademo",
                  "currentType": "DC",
                  "ratedPowerKW": 50.0
                }
              ]
            }
          ]
        }
      ],
      "address": {
        "streetName": "Stationsplein",
        "streetNumber": "10",
        "municipality": "Amsterdam",
        "postalCode": "1012 AB",
        "countryCode": "NL",
        "country": "Netherlands",
        "freeformAddress": "Stationsplein 10, 1012 AB Amsterdam"
      },
      "phone": "+31 88 123 4567",
      "timeZone": { "ianaId": "Europe/Amsterdam" },
      "accessType": "Public",
      "nearbyPois": [7315, 9361]
    }
  ]
}`;

/* ─── V1 Content (named export for Unified wrapper) ─────────────────────────── */
export function EVSearchNearbyV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Discover EV charging stations within a circular area or bounding box. Filter by connector type, availability status, power level, access type, vehicle constraints, and nearby amenities. Returns live charging point status and full connector specifications."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'ev-station-search',
          note: 'https://api.tomtom.com/search/2/evsearch — TomTom Maps v1. Use either lat+lon+radius or topLeft+btmRight for the search area. No special headers required.',
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
