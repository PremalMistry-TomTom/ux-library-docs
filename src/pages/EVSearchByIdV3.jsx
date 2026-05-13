import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── V3 Orbis Maps — EV Search by Id ───────────────────────────────────────
   Endpoint: GET /maps/orbis/places/ev/id
   Requires: TomTom-Api-Version: 1 header
   Status:   Private Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'id', required: true, type: 'string', desc: 'Comma-separated list of EV POI IDs (UUIDs). Up to 100 IDs per request. Example: 0b903425-3f5a-4072-9d5d-070f6f0647b3,79ded460-ecbb-4699-852b-71e8cf1d27ab' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RS', 'RU', 'TR', 'CN', 'TW'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
  { name: 'include', type: 'string', values: ['tariffs'], desc: 'Additional data to include. Use include=tariffs to receive full pricing information for each connector, referenced in the response references.tariffs array.' },
];

const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults (results in response) and totalResults (total matched).' },
  { name: 'results', type: 'array', desc: 'Array of EV POI detail records, one per requested ID.' },
  { name: 'results[].id', type: 'string', desc: 'EV POI ID (UUID).' },
  { name: 'results[].name', type: 'string', desc: 'Display name of the charging location.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the EV POI.' },
  { name: 'results[].chargingStations', type: 'array', desc: 'Array of charging stations at the POI. Each station has an id and chargingPoints array.', children: [
    { name: 'chargingStations[].id', type: 'string', desc: 'Station ID in EVSE format, e.g. NL*POD*E1234.' },
    { name: 'chargingStations[].chargingPoints', type: 'array', desc: 'Individual charging points (EVSEs) at the station.', children: [
      { name: 'chargingPoints[].evseId', type: 'string', desc: 'Unique EVSE ID — alphanumeric code used in roaming networks.' },
      { name: 'chargingPoints[].id', type: 'string', desc: 'Charging point identifier within the station.' },
      { name: 'chargingPoints[].physicalReference', type: 'string', desc: 'Label printed on the physical station, visible to the driver.' },
      { name: 'chargingPoints[].status', type: 'string', desc: 'Live status: Available, Reserved, Occupied, OutOfService, Unknown.' },
      { name: 'chargingPoints[].capabilities', type: 'string[]', desc: 'Capabilities: RemoteStartStopCapable, Reservable, RfidReader, CreditCardPayable, ContactlessCardSupport, PlugAndCharge, ChargingProfileCapable, DebitCardPayable, and others.' },
      { name: 'chargingPoints[].restrictions', type: 'string[]', desc: 'Parking restrictions: evOnly, plugged, disabled, customers, motorcycles.' },
      { name: 'chargingPoints[].connectors', type: 'array', desc: 'Connectors on this charging point.', children: [
        { name: 'connectors[].id', type: 'string', desc: 'Connector identifier within the charging point.' },
        { name: 'connectors[].type', type: 'string', desc: 'Connector standard, e.g. IEC62196Type2Outlet, IEC62196Type2CCS, Chademo.' },
        { name: 'connectors[].currentType', type: 'string', desc: 'Electrical current type: AC1, AC3, or DC.' },
        { name: 'connectors[].ratedPowerKW', type: 'double', desc: 'Rated charging power in kilowatts.' },
        { name: 'connectors[].currentA', type: 'integer', desc: 'Amperage in amperes.' },
        { name: 'connectors[].voltageV', type: 'integer', desc: 'Voltage in volts.' },
        { name: 'connectors[].tariffId', type: 'string', desc: 'References a tariff object in references.tariffs — only present when include=tariffs is requested.' },
      ]},
    ]},
  ]},
  { name: 'results[].address', type: 'object', desc: 'Full structured address: streetName, streetNumber, municipality, postalCode, countryCode, country, freeformAddress, localName.' },
  { name: 'results[].phone', type: 'string', desc: 'Contact phone number for the station operator.' },
  { name: 'results[].openingHours', type: 'object', desc: 'Opening schedule with mode (nextSevenDays) and timeRanges array.' },
  { name: 'results[].timeZone', type: 'object', desc: 'IANA time zone ID for the POI. Example: { ianaId: "Europe/Belgrade" }.' },
  { name: 'results[].brands', type: 'array', desc: 'EV network brands available at the POI, each with id and name.' },
  { name: 'results[].paymentOptions', type: 'array', desc: 'Payment methods accepted. Each entry has an optional method and brands array.' },
  { name: 'results[].nearbyPois', type: 'array', desc: 'Category IDs of POIs within walking distance.' },
  { name: 'results[].accessType', type: 'string', desc: 'Access restriction: Public, Authorized, Restricted, or Private.' },
  { name: 'results[].vehicleConstraint', type: 'object', desc: 'Vehicle constraints: types, categories, length, height, width, weight, and brands array.' },
  { name: 'references', type: 'object', desc: 'Referenced data from the results. Contains tariffs array with full pricing details.' },
  { name: 'references.tariffs[]', type: 'array', desc: 'Tariff records with id, partner, currency, product, minPrice, maxPrice, and elements array.', children: [
    { name: 'tariffs[].elements', type: 'array', desc: 'Pricing rule elements with priceComponents (price, stepSize, type: ENERGY/TIME/FLAT/PARKING_TIME) and restrictions.' },
  ]},
];

const CODE = `# EV Search by Id (v3 Orbis) — fetch a station with tariff information
curl "https://api.tomtom.com/maps/orbis/places/ev/id?key=YOUR_API_KEY\\
&id=0b903425-3f5a-4072-9d5d-070f6f0647b3\\
&include=tariffs\\
&view=Unified" \\
  -H "TomTom-Api-Version: 1"`;

const CODE_RESPONSE = `{
  "summary": { "numResults": 1, "totalResults": 1 },
  "results": [
    {
      "id": "0b903425-3f5a-4072-9d5d-070f6f0647b3",
      "name": "Mega M d.o.o.",
      "position": { "lat": 44.810263, "lon": 20.4354 },
      "chargingStations": [
        {
          "id": "RS*ORI*E1161",
          "chargingPoints": [
            {
              "evseId": "RS*ORI*E1167",
              "status": "Available",
              "capabilities": ["RemoteStartStopCapable"],
              "connectors": [
                {
                  "id": "1",
                  "type": "IEC62196Type2Outlet",
                  "currentType": "AC3",
                  "ratedPowerKW": 22.0,
                  "currentA": 32,
                  "voltageV": 400
                }
              ]
            }
          ]
        }
      ],
      "address": {
        "streetName": "Ulica Vladimira Popovica",
        "streetNumber": "8",
        "municipality": "Belgrade",
        "postalCode": "11070",
        "countryCode": "RS",
        "freeformAddress": "Ulica Vladimira Popovica 8, 11070 Belgrade"
      },
      "accessType": "Public",
      "timeZone": { "ianaId": "Europe/Belgrade" }
    }
  ]
}`;

/* ─── V3 Content (named export for Unified wrapper) ─────────────────────────── */
export function EVSearchByIdV3Content({ onNavigate }) {
  return (
    <>
      <PrivatePreviewBanner api="EV & Charging API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Retrieve detailed information about one or more EV charging stations by their unique POI IDs using the Orbis Maps endpoint. Returns full charging point status, connector specifications, opening hours, and optionally connector tariff pricing. Requires the TomTom-Api-Version: 1 header."
        sections={[
          {
            id: 'request',
            heading: 'Request',
            method: 'GET',
            note: 'https://api.tomtom.com/maps/orbis/places/ev/id — Orbis Maps v3 (Private Preview). Requires TomTom-Api-Version: 1 header. EV POI IDs are obtained from EV Search Nearby or EV Search Along Route responses.',
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
    </>
  );
}
