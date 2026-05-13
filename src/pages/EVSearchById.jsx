import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'id', required: true, type: 'string', desc: 'Comma-separated list of EV POI IDs (UUIDs). Up to 100 IDs per request. Example: 0b903425-3f5a-4072-9d5d-070f6f0647b3,79ded460-ecbb-4699-852b-71e8cf1d27ab' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RS', 'RU', 'TR', 'CN', 'TW'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
  { name: 'include', type: 'string', values: ['tariffs'], desc: 'Additional data to include. Use include=tariffs to receive full pricing information for each connector, referenced in the response references.tariffs array.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults (results in response) and totalResults (total matched).' },
  { name: 'results', type: 'array', desc: 'Array of EV POI detail records, one per requested ID.' },
  { name: 'results[].id', type: 'string', desc: 'EV POI ID (UUID).' },
  { name: 'results[].name', type: 'string', desc: 'Display name of the charging location.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the EV POI.' },
  { name: 'results[].chargingStations', type: 'array', desc: 'Array of charging stations at the POI. Each station has an id and chargingPoints array.', children: [
    { name: 'chargingStations[].id', type: 'string', desc: 'Station ID in EVSE format, e.g. NL*POD*E1234.' },
    { name: 'chargingStations[].chargingPoints', type: 'array', desc: 'Individual charging points (EVSEs) at the station.', children: [
      { name: 'chargingPoints[].evseId', type: 'string', desc: 'Unique EVSE ID — alphanumeric code used to identify the charging point in roaming networks.' },
      { name: 'chargingPoints[].id', type: 'string', desc: 'Charging point identifier within the station.' },
      { name: 'chargingPoints[].physicalReference', type: 'string', desc: 'Label printed on the physical station, visible to the driver.' },
      { name: 'chargingPoints[].status', type: 'string', desc: 'Live status: Available, Reserved, Occupied, OutOfService, Unknown.' },
      { name: 'chargingPoints[].capabilities', type: 'string[]', desc: 'Capabilities: RemoteStartStopCapable, Reservable, RfidReader, CreditCardPayable, ContactlessCardSupport, PlugAndCharge, ChargingProfileCapable, DebitCardPayable, and others.' },
      { name: 'chargingPoints[].restrictions', type: 'string[]', desc: 'Parking restrictions: evOnly, plugged, disabled, customers, motorcycles.' },
      { name: 'chargingPoints[].connectors', type: 'array', desc: 'Connectors on this charging point.', children: [
        { name: 'connectors[].id', type: 'string', desc: 'Connector identifier within the charging point.' },
        { name: 'connectors[].type', type: 'string', desc: 'Connector standard, e.g. IEC62196Type2Outlet, IEC62196Type2CCS, Chademo, IEC62196Type2CableAttached.' },
        { name: 'connectors[].currentType', type: 'string', desc: 'Electrical current type: AC1, AC3, or DC.' },
        { name: 'connectors[].ratedPowerKW', type: 'double', desc: 'Rated charging power in kilowatts.' },
        { name: 'connectors[].currentA', type: 'integer', desc: 'Amperage in amperes.' },
        { name: 'connectors[].voltageV', type: 'integer', desc: 'Voltage in volts.' },
        { name: 'connectors[].tariffId', type: 'string', desc: 'References a tariff object in references.tariffs — only present when include=tariffs is requested.' },
      ]},
    ]},
  ]},
  { name: 'results[].address', type: 'object', desc: 'Full structured address: streetName, streetNumber, municipality, municipalitySubdivision, postalCode, countryCode, country, countryCodeISO3, freeformAddress, localName.' },
  { name: 'results[].phone', type: 'string', desc: 'Contact phone number for the station operator.' },
  { name: 'results[].openingHours', type: 'object', desc: 'Opening schedule with mode (nextSevenDays) and timeRanges array of { startTime, endTime } objects.' },
  { name: 'results[].timeZone', type: 'object', desc: 'IANA time zone ID for the POI. Example: { ianaId: "Europe/Belgrade" }.' },
  { name: 'results[].brands', type: 'array', desc: 'EV network brands available at the POI, each with id and name.' },
  { name: 'results[].paymentOptions', type: 'array', desc: 'Payment methods accepted. Each entry has an optional method and brands array with id, name, restricted fields.' },
  { name: 'results[].nearbyPois', type: 'array', desc: 'Category IDs of POIs within walking distance: 7315 (Restaurant), 9932 (Public Amenity), 9376 (Café/Pub), 7314 (Hotel/Motel), 9361 (Shop), 9362 (Park).' },
  { name: 'results[].accessType', type: 'string', desc: 'Access restriction: Public (open to all), Authorized (permit required), Restricted (specific groups), or Private.' },
  { name: 'results[].vehicleConstraint', type: 'object', desc: 'Vehicle constraints: types (Car, Truck), categories (N1–N3+O4), length, height, width, weight (metres/kg), and brands array.' },
  { name: 'references', type: 'object', desc: 'Referenced data from the results. Contains tariffs array with full pricing details for each connector tariffId referenced in the response.' },
  { name: 'references.tariffs[]', type: 'array', desc: 'Tariff records. Each entry: id, partner { id, type }, currency (ISO-4217), product { name, type }, minPrice, maxPrice, elements array.', children: [
    { name: 'tariffs[].elements', type: 'array', desc: 'Pricing rule elements. Each element has priceComponents (price, stepSize, type: ENERGY/TIME/FLAT/PARKING_TIME) and restrictions (daysOfWeek, startDate, endDate, startTime, endTime, power, energy, duration bounds).' },
  ]},
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# EV Search by Id (v1) — fetch a single station with tariff information
curl "https://api.tomtom.com/search/2/evbyid?key=YOUR_API_KEY\\
&id=0b903425-3f5a-4072-9d5d-070f6f0647b3\\
&include=tariffs\\
&view=Unified"`;

const CODE_RESPONSE = `{
  "summary": {
    "numResults": 1,
    "totalResults": 1
  },
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
            },
            {
              "evseId": "RS*ORI*E1166",
              "status": "Occupied",
              "capabilities": ["RemoteStartStopCapable"],
              "connectors": [
                {
                  "id": "1",
                  "type": "Chademo",
                  "currentType": "DC",
                  "ratedPowerKW": 50.0
                }
              ]
            },
            {
              "evseId": "RS*ORI*E1165",
              "status": "OutOfService",
              "capabilities": ["RemoteStartStopCapable"],
              "connectors": [
                {
                  "id": "1",
                  "type": "IEC62196Type2CCS",
                  "currentType": "DC",
                  "ratedPowerKW": 75.0
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
        "municipalitySubdivision": "Novi Beograd",
        "postalCode": "11070",
        "countryCode": "RS",
        "country": "Serbia",
        "countryCodeISO3": "SRB",
        "freeformAddress": "Ulica Vladimira Popovica 8, 11070 Belgrade",
        "localName": "Belgrade"
      },
      "phone": "+386 3 777 77 77",
      "openingHours": {
        "mode": "nextSevenDays",
        "timeRanges": [
          {
            "startTime": { "date": "2026-05-12", "hour": 0, "minute": 0 },
            "endTime":   { "date": "2026-05-19", "hour": 0, "minute": 0 }
          }
        ]
      },
      "timeZone": { "ianaId": "Europe/Belgrade" },
      "accessType": "Public",
      "paymentOptions": [
        { "brands": [{ "name": "Shell Recharge" }, { "name": "Eneco" }] }
      ],
      "nearbyPois": [7315, 9932],
      "vehicleConstraint": {
        "types": ["Car", "Truck"],
        "length": 5.0,
        "height": 2.75,
        "width": 2.0,
        "weight": 3500
      }
    }
  ],
  "references": {
    "tariffs": [
      {
        "id": "USCPIT10vn*B*2llX",
        "partner": { "id": "CHCXGIH2", "type": "CPO" },
        "currency": "USD",
        "product": { "name": "Adhoc", "type": "ADHOC" },
        "minPrice": { "amount": 0.0, "vat": 20.0 },
        "maxPrice": { "amount": 100.0, "vat": 20.0 },
        "elements": [
          {
            "priceComponents": [
              { "price": { "amount": 2.3, "vat": 20.0 }, "stepSize": 1.0, "type": "ENERGY" }
            ],
            "restrictions": {
              "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
              "startTime": "08:00",
              "endTime": "20:00",
              "minPowerInKilowatts": 7.0,
              "maxPowerInKilowatts": 22.0
            }
          }
        ]
      }
    ]
  }
}`;

/* ─── V1 Content (named export for Unified wrapper) ─────────────────────────── */
export function EVSearchByIdV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Retrieve detailed information about one or more EV charging stations by their unique POI IDs. Returns full charging point status, connector specifications, opening hours, access restrictions, vehicle constraints, and optionally connector tariff pricing data."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'ev-station-search',
          note: 'https://api.tomtom.com/search/2/evbyid — TomTom Maps v1. EV POI IDs are obtained from EV Search Nearby or EV Search Along Route responses. No special headers required.',
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
