import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Private-preview notice ──────────────────────────────────────────────── */
const PRIVATE_PREVIEW_NOTE = (
  <>
    <strong>Private Preview.</strong> This feature is part of the Long Distance EV Routing v2
    service on TomTom Orbis Maps and is restricted to private preview access. The Electric
    Consumption Model must be set before using weather adaptation parameters.
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
        desc: 'Adapt the constant speed consumption curve (see constantSpeedConsumptionInkWhPerHundredkm) of an electric vehicle to account for a specific outside temperature. It is assumed that the provided constant speed consumption curve reflects the consumption of the vehicle at an outside temperature of 20°C. Additionally, the adaptation based on temperature requires the provided consumption curve to contain a quadratic component corresponding to the aerodynamic drag experienced by the vehicle. If this is not the case, the requested adaptation might not be applied.',
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
        desc: 'Use current and predicted location-based weather conditions. Note: forecast weather takes weather conditions into account based on best effort depending on the availability of data. This parameter must only be used with consumptionAdaptation=outsideTemperature.',
      },
    ],
  },
];

const PARAMS_WEATHER_BODY = [
  {
    name: 'weatherInfo',
    type: 'object',
    desc: 'An object defining the weather conditions to consider when planning a route. This parameter must only be used with weatherSource=userSpecified.',
    children: [
      {
        name: 'weatherInfo.temperatureInDegC',
        type: 'float',
        desc: 'The outside temperature in degrees Celsius. The value must be in the range [-40.0, 60.0]. This parameter must only be used with weatherSource=userSpecified.',
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR v2 — Weather Consideration
# POST to the Orbis Maps calculateLongDistanceEV endpoint

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
    "consumptionAdaptation": "outsideTemperature",
    "weatherSource": "userSpecified",
    "weatherInfo": {
      "temperatureInDegC": 12.0
    }
  }'`;

const CODE_FORECAST = `# Using forecast weather (no weatherInfo body parameter needed)

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
    "consumptionAdaptation": "outsideTemperature",
    "weatherSource": "forecast"
  }'`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRWeather() {
  const sections = [
    {
      id: 'ldevr-weather-request-params',
      heading: 'Request parameters',
      method: 'POST',
      note: PRIVATE_PREVIEW_NOTE,
      params: PARAMS_WEATHER_REQUEST,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-weather-body-params',
      heading: 'POST request body parameters',
      params: PARAMS_WEATHER_BODY,
      note: 'The POST data can contain an optional weatherInfo object that specifies the weather conditions for dynamic adaptation of the EV consumption parameters.',
      code: CODE_FORECAST,
      lang: 'bash',
    },
    {
      id: 'ldevr-weather-response',
      heading: 'Response data',
      params: [],
      note: 'The response format is unchanged from the base Calculate EV Route response. Weather adaptation affects the route geometry, charging stop placement, and energy consumption figures in the summary — no additional response fields are added.',
      code: `// Response follows the same structure as Calculate EV Route.
// Weather adaptation is reflected in:
//   summary.batteryConsumptionInkWh    — adjusted for temperature
//   summary.remainingChargeAtArrivalInkWh
//   sections[].sectionType: "CHARGING_STATION"  — may differ from non-weather route
{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 38.2,
      "remainingChargeAtArrivalInkWh": 3.8,
      "totalChargingTimeInSeconds": 4200
    }
  }]
}`,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Weather Consideration"
      description="Dynamically adapt EV consumption parameters based on outside temperature. Use forecast for location-based weather data, or userSpecified with a temperatureInDegC value in the POST body. Requires an electric vehicle consumption model."
      version="v2-private"
      sections={sections}
    />
  );
}
