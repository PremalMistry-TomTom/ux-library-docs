import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PRIVATE_PREVIEW_NOTE = (
  <>
    <strong>Private Preview.</strong> The Long Distance EV Routing service with Vehicle Brand
    is only available as a Private Preview. The <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>vehicleBrand</code> parameter
    allows users to specify the brand name of their vehicle to filter compatible charging stations.
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_VEHICLE_BRAND = [
  {
    name: 'vehicleBrand',
    type: 'string',
    desc: 'When present, specifies the brand name of the vehicle. If a charging station is only available to certain vehicle brands, vehicleBrand is matched against the station\'s allowed brands to filter possible charging stations. A charging park restricted to certain vehicle brands that is incompatible with the vehicleBrand cannot be added to the route. If the vehicleBrand is not specified, all charging parks with brand restrictions are treated as incompatible with the vehicle.',
    children: [
      {
        name: 'Format rules',
        type: '',
        desc: 'If specified, the vehicleBrand string must contain UTF-8 encoded letters, diacritics (e.g. á, ö), hyphens, periods, or ampersands. Must not be empty or exceed 40 characters.',
      },
      {
        name: 'Mutual exclusivity',
        type: '',
        desc: 'vehicleBrand cannot be used with the vehicleModelId parameter.',
      },
    ],
  },
];

/* ─── Code example ───────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR v2 — Vehicle Brand filter
# Charging stations incompatible with the specified brand are excluded

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
    "vehicleBrand": "Tesla"
  }'`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRVehicleBrand() {
  const sections = [
    {
      id: 'ldevr-vehicle-brand-params',
      heading: 'Request parameters',
      method: 'POST',
      demoId: 'ldevr-vehicle-brand',
      note: PRIVATE_PREVIEW_NOTE,
      params: PARAMS_VEHICLE_BRAND,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-vehicle-brand-response',
      heading: 'Response data',
      params: [],
      note: 'The response format is unchanged from the base Calculate EV Route response. The vehicleBrand filter affects which charging stations appear in the route — incompatible stations are excluded from consideration entirely.',
      code: `// Response follows the standard Calculate EV Route structure.
// Charging stops in sections[] will only include brand-compatible stations.
{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 35.4,
      "remainingChargeAtArrivalInkWh": 5.0,
      "totalChargingTimeInSeconds": 3900
    },
    "sections": [
      { "sectionType": "TRAVEL", "startPointIndex": 0, "endPointIndex": 47 },
      {
        "sectionType": "CHARGING_STATION",
        "chargingStationData": {
          "brandName": "Tesla",
          "chargingParkName": "Tesla Supercharger — Reims",
          "connectors": [{ "connectorType": { "value": "Tesla" }, "ratedPowerKW": 250 }]
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
      title="Vehicle Brand"
      description="Filter charging stations by vehicle brand compatibility. When vehicleBrand is set, stations restricted to certain brands are matched against the vehicle — incompatible stations are excluded from route planning entirely."
      version="v2"
      sections={sections}
    />
  );
}
