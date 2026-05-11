import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PRIVATE_PREVIEW_NOTE = (
  <>
    <strong>Private Preview.</strong> This extension to LDEVR v2 allows optimisation of long-distance
    EV routes while filtering out charging parks that would be closed during the expected arrival
    time window. The <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>chargePlanningPreferences</code> object
    must be included in the POST body to enable opening hours filtering.
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'chargePlanningPreferences',
    type: 'object',
    desc: 'Object containing charging park opening hours preferences. The following sub-parameters control how charging parks with official opening hours (OA) are handled during route planning.',
    children: [
      {
        name: 'chargePlanningPreferences.useNonOAChargingParks',
        type: 'string',
        values: ['disabled', 'enabled'],
        desc: 'Enables support for charging parks that have official opening hours. When disabled, charging parks without official opening hours are excluded from consideration.',
      },
      {
        name: 'chargePlanningPreferences.chargingParkMinTimeDiffBeforeCloseInMinutes',
        type: 'integer',
        desc: 'Defines how far in advance of a charging park\'s closing time the vehicle must arrive to be considered a valid stop. Minimum value: -60.',
      },
      {
        name: 'chargePlanningPreferences.chargingParkMinTimeDiffAfterOpenInMinutes',
        type: 'integer',
        desc: 'Defines the minimum time (in minutes) after a charging park\'s opening time that the vehicle must arrive. Used to exclude arrivals that are too close to opening time. Minimum value: 0.',
      },
      {
        name: 'chargePlanningPreferences.chargingParkMaxTimeDiffBeforeOpenInMinutes',
        type: 'integer',
        desc: 'Defines how early (in minutes before opening) the vehicle is permitted to arrive and wait at a charging park. Minimum value: 0. Note: This parameter can only be used if supportingPoints is also provided.',
      },
      {
        name: 'chargePlanningPreferences.chargingParkMaxTimeDiffAfterCloseInMinutes',
        type: 'integer',
        desc: 'Defines how late (in minutes after closing) the vehicle is permitted to finish charging at a park. Minimum value: 0. Note: This parameter can only be used if supportingPoints is also provided.',
      },
    ],
  },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'chargingParkOpeningHours',
    type: 'object',
    desc: 'Part of the chargingInformationAtEndOfLeg response object, if available. Contains opening hours data for the selected charging park.',
    children: [
      {
        name: 'chargingParkOpeningHours.twentyFourSeven',
        type: 'boolean',
        desc: 'Whether the charging park is open 24 hours a day, 7 days a week. When true, openingPeriods may be empty.',
      },
      {
        name: 'chargingParkOpeningHours.timeZoneOffset',
        type: 'string',
        desc: 'The timezone for this charging park. Format: UTC+H:MM or UTC-H:MM (e.g. "UTC+1:00").',
      },
      {
        name: 'chargingParkOpeningHours.openingPeriods',
        type: 'array',
        desc: 'Array of time periods representing the opening schedule of the charging park. May be empty if twentyFourSeven is true.',
        children: [
          {
            name: 'openingPeriods[].dayOfWeek',
            type: 'integer',
            desc: 'Day of the week as an integer. Monday = 1, Tuesday = 2, ..., Sunday = 7.',
          },
          {
            name: 'openingPeriods[].startTime',
            type: 'string',
            desc: 'Opening time in HH:MM format (local time).',
          },
          {
            name: 'openingPeriods[].endTime',
            type: 'string',
            desc: 'Closing time in HH:MM format (local time).',
          },
          {
            name: 'openingPeriods[].validFrom',
            type: 'string',
            desc: 'ISO 8601 date from which this period is valid.',
          },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR v2 — Charging Parks with Opening Hours
# Route excludes charging parks that would be closed on arrival

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
    "departureTime": "2025-06-15T08:00:00",
    "chargePlanningPreferences": {
      "useNonOAChargingParks": "disabled",
      "chargingParkMinTimeDiffBeforeCloseInMinutes": 30,
      "chargingParkMaxTimeDiffBeforeOpenInMinutes": 15
    }
  }'`;

const CODE_RESPONSE = `// chargingInformationAtEndOfLeg now includes opening hours data
{
  "routes": [{
    "chargingInformationAtLegs": [{
      "chargingParkName": "Fastned Cologne South",
      "chargingTimeInSeconds": 1800,
      "targetChargeAfterChargingInkWh": 60.0,
      "chargingParkOpeningHours": {
        "twentyFourSeven": false,
        "timeZoneOffset": "UTC+1:00",
        "openingPeriods": [
          { "dayOfWeek": 1, "startTime": "06:00", "endTime": "22:00" },
          { "dayOfWeek": 2, "startTime": "06:00", "endTime": "22:00" },
          { "dayOfWeek": 6, "startTime": "08:00", "endTime": "20:00" },
          { "dayOfWeek": 7, "startTime": "08:00", "endTime": "20:00" }
        ]
      }
    }]
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRChargingParks() {
  const sections = [
    {
      id: 'ldevr-parks-request',
      heading: 'Request parameters',
      method: 'POST',
      demoId: 'ldevr-parks',
      note: PRIVATE_PREVIEW_NOTE,
      params: PARAMS_REQUEST,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-parks-response',
      heading: 'Response data',
      params: PARAMS_RESPONSE,
      note: 'Opening hours data is returned as part of the chargingInformationAtLegs array in the route response. Each charging stop that has opening hours data will include a chargingParkOpeningHours object.',
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Charging Park Opening Hours"
      description="Exclude charging parks that would be closed at the expected arrival time. Use chargePlanningPreferences to define minimum time buffers before closing and after opening, and whether to allow the vehicle to wait before a park opens."
      version="v2-private"
      sections={sections}
    />
  );
}
