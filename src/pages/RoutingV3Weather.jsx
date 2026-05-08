import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

const PUBLIC_PREVIEW_NOTE = (
  <>
    <strong>Public Preview — Routing API v3.</strong> This extension applies to both Calculate Route
    and Reachable Range services in Routing API v2 and v3. It enables dynamic adaptation of EV
    consumption parameters based on weather conditions.{' '}
    <strong>Prerequisite:</strong> the Electric Consumption Model must be set (
    <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>vehicleEngineType=electric</code> and
    consumption parameters must be provided).
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_WEATHER_REQUEST = [
  {
    name: 'consumptionAdaptation',
    type: 'string',
    default: 'none',
    values: ['outsideTemperature', 'none'],
    desc: 'Providing these optional parameters requests consideration of the impact of factors like outside temperature on the consumption of a vehicle.',
    children: [
      {
        name: 'consumptionAdaptation: outsideTemperature',
        type: '',
        desc: 'Adapt the constant speed consumption curve of an electric vehicle to account for a specific outside temperature. Assumes the consumption curve reflects consumption at 20°C. The adaptation requires the curve to contain a quadratic component corresponding to aerodynamic drag. If not present, the adaptation might not be applied.',
      },
      {
        name: 'consumptionAdaptation: none',
        type: '',
        desc: 'Do not adapt the consumption parameters. Default value.',
      },
    ],
  },
  {
    name: 'weatherSource',
    type: 'string',
    values: ['userSpecified', 'forecast'],
    desc: 'The weather source to use for route planning.',
    children: [
      {
        name: 'weatherSource: userSpecified',
        type: '',
        desc: 'Use weather conditions provided explicitly via the request POST parameter weatherInfo.',
      },
      {
        name: 'weatherSource: forecast',
        type: '',
        desc: 'Use current and predicted location-based weather conditions based on best-effort availability of data. This parameter must only be used with consumptionAdaptation=outsideTemperature.',
      },
    ],
  },
];

const PARAMS_WEATHER_BODY = [
  {
    name: 'weatherInfo',
    type: 'object',
    desc: 'An object defining weather conditions to consider when planning a route. Must only be used with weatherSource=userSpecified.',
    children: [
      {
        name: 'weatherInfo.temperatureInDegC',
        type: 'float',
        desc: 'The outside temperature in degrees Celsius. Value must be in the range [-40.0, 60.0]. Must only be used with weatherSource=userSpecified.',
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_USER_SPECIFIED = `# Routing API v3 — Weather Consideration (user-specified temperature)
# Applies to both Calculate Route and Reachable Range

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
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0",
    "consumptionAdaptation": "outsideTemperature",
    "weatherSource": "userSpecified",
    "weatherInfo": {
      "temperatureInDegC": 12.0
    }
  }'`;

const CODE_FORECAST = `# Using forecast weather (no weatherInfo body parameter needed)

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
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0",
    "consumptionAdaptation": "outsideTemperature",
    "weatherSource": "forecast"
  }'`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV3Weather() {
  const sections = [
    {
      id: 'routing-v3-weather-request',
      heading: 'Request parameters',
      method: 'POST',
      params: PARAMS_WEATHER_REQUEST,
      code: CODE_USER_SPECIFIED,
      lang: 'bash',
    },
    {
      id: 'routing-v3-weather-body',
      heading: 'POST request body parameters',
      params: PARAMS_WEATHER_BODY,
      note: 'The POST body can contain an optional weatherInfo object that specifies the weather conditions for dynamic adaptation of the EV consumption parameters. Only used with weatherSource=userSpecified.',
      code: CODE_FORECAST,
      lang: 'bash',
    },
    {
      id: 'routing-v3-weather-response',
      heading: 'Response data',
      params: [],
      note: 'The response format is unchanged from the base Calculate Route or Reachable Range response. Weather adaptation is reflected in the consumption figures and may influence route geometry and stop placement.',
      code: `// Response follows standard Routing API v3 structure.
// Weather adaptation is reflected in:
//   summary.batteryConsumptionInkWh    — adjusted for temperature
//   summary.remainingChargeAtArrivalInkWh
{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 38.6,
      "remainingChargeAtArrivalInkWh": 3.4
    }
  }]
}`,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Weather Consideration"
      description="Adapt the EV consumption curve for outside temperature on Routing API v3 Calculate Route and Reachable Range requests. Use forecast for automatic location-based weather, or userSpecified to provide a specific temperature. Requires an electric vehicle consumption model."
      version="v3-private"
      topBanner={<PrivatePreviewBanner api="Routing API v3" />}
      sections={sections}
    />
  );
}
