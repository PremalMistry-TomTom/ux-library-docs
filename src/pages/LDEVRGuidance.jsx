import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PageActions from '../components/ui/PageActions';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';
import VersionTabBar from '../components/ui/VersionTabBar';

/* ─── Notice ─────────────────────────────────────────────────────────────── */
const ORBIS_NOTE = (
  <>
    <strong>TomTom Orbis Maps.</strong> This endpoint is powered by TomTom Orbis Maps and
    extends the{' '}
    <a href="https://developer.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-orbis-maps/v3/long-distance-ev-routing-v3">
      Long Distance EV Routing v3
    </a>{' '}
    endpoint. Only the additional guidance-specific parameters and response fields are documented
    here — all base route planning parameters continue to apply.
  </>
);

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'guidance',
    type: 'string',
    default: 'none',
    values: ['none', 'instructions'],
    desc: 'Controls whether turn-by-turn guidance instructions are included in the response. Set to instructions to enable. Omitting this parameter (or setting it to none) disables guidance and no instructions field is returned.',
  },
  {
    name: 'instructionPhonetics',
    type: 'string',
    values: ['ipa', 'lhp'],
    desc: 'Phonetic transcription format for road names, street names, and signpost text returned in the instructions. ipa returns International Phonetic Alphabet transcriptions. lhp returns L&H+ format from Cerence Inc. This parameter is mandatory when guidance is set to instructions, and must not be used otherwise.',
  },
];

const PARAMS_HEADER = [
  {
    name: 'Accept-Language',
    type: 'string',
    desc: 'BCP47 language tag controlling two aspects of the guidance response: (1) the language in which proper names (e.g., street names, road numbers) are returned, along with their phonetic transcriptions; (2) the language used for the human-readable instructionMessage field. If the requested language is unavailable for text generation, the API returns a user error.',
  },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const PARAMS_INSTRUCTION = [
  {
    name: 'maneuver',
    type: 'string',
    desc: 'Code identifying the maneuver type. Examples: depart, arrive, arriveLeft, arriveRight, arriveAhead, turnRight, turnLeft, turnSharpRight, turnSharpLeft, turnSlightRight, turnSlightLeft, makeUTurn, continueStraight, keepLeft, keepRight, keepCenter, roundaboutRight, roundaboutLeft, roundaboutBack, exitRoundabout, exitMotorwayRight, exitMotorwayLeft, switchMotorwayRight, switchMotorwayLeft, enterCarpoolLaneRight, mergeLeftLane, mergeRightLane, takeShipFerry, leaveShipFerry, takeCarTrain, leaveCarTrain, crossBorder, passTollgate, waypointReached.',
  },
  {
    name: 'maneuverPoint',
    type: 'GeoJsonPoint object',
    desc: 'Representative lat/lon point of the maneuver. Can be used to place a maneuver marker on the map.',
  },
  {
    name: 'routeOffsetInMeters',
    type: 'number',
    desc: 'Distance in meters from the start of the route to the maneuverPoint.',
  },
  {
    name: 'routePath',
    type: 'array of RoutePathPoint',
    desc: 'Ordered list of coordinate points forming the maneuver geometry. Each item has: point (lat/lon), distanceFromRouteStartInMeters, and travelTimeFromRouteStartInSeconds.',
  },
  {
    name: 'previousRoadInformation',
    type: 'RoadInformation object',
    desc: 'Information about the road segment before the maneuver: properties (urban, motorway, controlledAccess), streetName with phonetics, roadShields, roadNumbers, roadNames, countryCodeIso2.',
  },
  {
    name: 'nextRoadInformation',
    type: 'RoadInformation object',
    desc: 'Information about the road the route continues onto after the maneuver. If a signpost is available, information is taken from it; otherwise from the next road segment.',
  },
  {
    name: 'signpost',
    type: 'Signpost object',
    desc: 'Present when a signpost is associated with the maneuver. Contains: exitName, exitNumber, and towardName — each as TextWithPhonetics objects.',
  },
  {
    name: 'intersectionName',
    type: 'TextWithPhonetics object',
    desc: 'Name of the intersection where the maneuver must be performed. Included when an intersection name is available.',
  },
  {
    name: 'drivingSide',
    type: 'string',
    values: ['left', 'right'],
    desc: 'Indicates whether left-hand or right-hand traffic rules apply at the maneuver location.',
  },
  {
    name: 'landmark',
    type: 'string',
    desc: 'A notable nearby feature to help orient the driver. Values: endOfRoad, atTrafficLight, onToBridge, onBridge, afterBridge, intoTunnel, insideTunnel, afterTunnel. Included when a landmark is available.',
  },
  {
    name: 'sideRoads',
    type: 'array of SideRoad',
    desc: 'Roads connecting to the route immediately before the maneuver that are not part of the route. Ordered by ascending offset. Each item has: side (left/right), offsetFromManeuverInMeters, isDrivable. Useful for richer visual representations of the junction.',
  },
  {
    name: 'maneuverView',
    type: 'ManeuverView object',
    desc: 'Schematic representation of the intersection. Contains onRouteAngle (the outgoing route direction) and offRouteAngles (array of off-route road directions). Angle values: straight, slightRight, right, sharpRight, back, sharpLeft, left, slightLeft.',
  },
  {
    name: 'message',
    type: 'string',
    desc: 'Human-readable instruction text for display or text-to-speech output, localized to the language requested via Accept-Language. Previously named instructionMessage.',
  },
];

const PARAMS_TURN_ONLY = [
  {
    name: 'isManeuverObligatory',
    type: 'boolean',
    desc: 'Marks the maneuver as obligatory (e.g., a T-junction where only one direction is drivable). Only included for turn maneuvers: turnSlightRight, turnRight, turnSharpRight, turnSlightLeft, turnLeft, turnSharpLeft, makeUTurn.',
  },
  {
    name: 'changeOfAngleInDegrees',
    type: 'number',
    desc: 'Total heading change in degrees, range [-180, 180). For example, -90 means a perpendicular left turn. Present for turn and roundabout maneuvers.',
  },
  {
    name: 'roundaboutExitNumber',
    type: 'number',
    desc: 'Ordinal number of the roundabout exit to take (e.g., 2 = "take the second exit"). Present for all roundabout maneuvers.',
  },
  {
    name: 'roundaboutType',
    type: 'string',
    values: ['regular', 'small'],
    desc: 'Indicates the roundabout type. Present for all roundabout maneuvers.',
  },
  {
    name: 'tollgateName',
    type: 'TextWithPhonetics object',
    desc: 'Name of the tollgate. Only present for passTollgate maneuvers.',
  },
  {
    name: 'tollPaymentTypes',
    type: 'array of strings',
    desc: 'Available payment options at the tollgate. Values: cashCoinsAndBills, cashBillsOnly, cashCoinsOnly, cashExactChange, creditCard, debitCard, travelCard, etc, etcTransponder, etcVideoCamera, subscription. Only for passTollgate maneuvers.',
  },
  {
    name: 'mergePointRouteOffsetInMeters',
    type: 'number',
    desc: 'Route offset where the route merges onto the new motorway. Only for switchMotorwayLeft, switchMotorwayRight, switchMotorwayMiddle.',
  },
  {
    name: 'ambiguousExitOffsetFromManeuverInMeters',
    type: 'number',
    desc: 'Absolute offset to an earlier exit that could cause ambiguity (e.g., "take the 2nd exit"). Only for exit and switch motorway maneuvers, and exitRoundabout.',
  },
  {
    name: 'countryCrossingFromName / countryCrossingToName',
    type: 'TextWithPhonetics object',
    desc: 'Names of the countries at a border crossing. Only for crossBorder, takeShipFerry, takeCarTrain, leaveShipFerry, leaveCarTrain.',
  },
  {
    name: 'countryCrossingFromCodeIso2 / countryCrossingToCodeIso2',
    type: 'string',
    desc: 'ISO 3166-1 alpha-2 country codes for the border crossing. Same maneuver scope as countryCrossing names.',
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# LDEVR v3 — Enable guidance instructions
curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=3" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Accept-Language: en-GB" \\
  -d '{
    "legs": [
      {
        "routeStop": {
          "entryPoints": [{ "latitude": 52.36443, "longitude": 13.50929 }]
        }
      },
      {
        "routeStop": {
          "entryPoints": [{ "latitude": 48.85660, "longitude": 2.35220 }]
        }
      }
    ],
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0",
    "guidance": "instructions",
    "instructionPhonetics": "ipa"
  }'`;

const CODE_RESPONSE = `// Successful response — routes[0].instructions array (abbreviated)
{
  "routes": [
    {
      "summary": { ... },
      "legs": [ ... ],
      "instructions": [
        {
          "routeOffsetInMeters": 0,
          "maneuver": "depart",
          "maneuverPoint": { "latitude": 52.36443, "longitude": 13.50929 },
          "routePath": [
            {
              "point": { "latitude": 52.36443, "longitude": 13.50929 },
              "distanceFromRouteStartInMeters": 0,
              "travelTimeFromRouteStartInSeconds": 0
            }
          ],
          "nextRoadInformation": {
            "properties": [],
            "streetName": {
              "text": "Berliner Allee",
              "phonetic": "\\"bEr|li:|n6 ?a|le:",
              "phoneticLanguageCode": "de-DE"
            }
          },
          "drivingSide": "right",
          "message": "Head south-west on Berliner Allee."
        },
        {
          "routeOffsetInMeters": 1141,
          "maneuver": "turnRight",
          "maneuverPoint": { "latitude": 52.37236, "longitude": 4.90861 },
          "isManeuverObligatory": false,
          "changeOfAngleInDegrees": 87,
          "maneuverView": {
            "onRouteAngle": "right",
            "offRouteAngles": ["straight", "left"]
          },
          "previousRoadInformation": {
            "properties": [],
            "streetName": {
              "text": "Max-Brauer-Allee",
              "phonetic": "maks \\"braU|6 ?a|\\"le:",
              "phoneticLanguageCode": "de-DE"
            }
          },
          "nextRoadInformation": {
            "properties": ["motorway"],
            "streetName": {
              "text": "Schnellstraße",
              "phonetic": "SnEl|%Stra:|s@",
              "phoneticLanguageCode": "de-DE"
            },
            "roadShields": [
              {
                "roadNumber": { "text": "A2", "phonetic": "?a: \\"tsvaI", "phoneticLanguageCode": "de-DE" },
                "countryCodeIso2": "DE"
              }
            ]
          },
          "signpost": {
            "exitNumber": { "text": "3", "phonetic": "dRaI", "phoneticLanguageCode": "de-DE" },
            "towardName": { "text": "Potsdam", "phonetic": "pOts|dam", "phoneticLanguageCode": "de-DE" }
          },
          "drivingSide": "right",
          "landmark": "atTrafficLight",
          "message": "Turn right onto Schnellstraße towards Potsdam."
        },
        {
          "routeOffsetInMeters": 503200,
          "maneuver": "arrive",
          "maneuverPoint": { "latitude": 48.85660, "longitude": 2.35220 },
          "drivingSide": "right",
          "message": "You have arrived at your destination."
        }
      ]
    }
  ]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRGuidance({ onNavigate }) {
  const sections = [
    {
      id: 'ldevr-guidance-request',
      heading: 'Request parameters',
      method: 'POST',
      note: ORBIS_NOTE,
      params: PARAMS_REQUEST,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'ldevr-guidance-header',
      heading: 'Request headers',
      params: PARAMS_HEADER,
      note: 'Language availability for human-readable instruction text (message field) differs from availability for name translations. If the requested language cannot be used for instruction text generation, the API returns a user error rather than falling back silently.',
      code: `# Request guidance in German with IPA phonetics
curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=3" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Accept-Language: de-DE" \\
  -d '{
    "legs": [ ... ],
    "guidance": "instructions",
    "instructionPhonetics": "lhp"
  }'`,
      lang: 'bash',
    },
    {
      id: 'ldevr-guidance-instruction',
      heading: 'Instruction object — common fields',
      note: 'Every instruction in the routes[0].instructions array contains these fields. Additional fields are present depending on the maneuver type.',
      params: PARAMS_INSTRUCTION,
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'ldevr-guidance-conditional',
      heading: 'Maneuver-specific fields',
      note: 'These fields appear only for specific maneuver types as documented. Not all instructions will contain all fields.',
      params: PARAMS_TURN_ONLY,
      code: `// TextWithPhonetics object structure — used in street names, road numbers, signposts
{
  "text": "Schnellstraße",          // display text
  "phonetic": "SnEl|%Stra:|s@",    // phonetic transcription (IPA or L&H+ format)
  "phoneticLanguageCode": "de-DE"  // BCP47 language tag for the phonetics
}

// RoadInformation object structure
{
  "properties": ["motorway", "urban"],  // road attributes
  "streetName": { ... TextWithPhonetics },
  "roadShields": [
    {
      "roadNumber": { ... TextWithPhonetics },
      "countryCodeIso2": "DE",
      "countrySubdivisionCodeIso": "DE-BY"  // optional state code
    }
  ],
  "roadNumbers": [ { "identifier": { ... }, "source": "signpost", "roadAttribute": "expressway" } ],
  "roadNames":   [ { "identifier": { ... }, "source": "road" } ],
  "countryCodeIso2": "DE"
}`,
      lang: 'json',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Guidance Instructions</h1>
        <PageActions />
        <VersionTabBar versions={['v3']} activeTab="v3" onTabChange={() => {}} />
      </div>
      <PrivatePreviewBanner api="Long Distance EV Routing API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Extension to the Long Distance EV Routing endpoint that returns turn-by-turn guidance instructions for the calculated EV route. Enable by setting guidance to 'instructions' and specifying a phonetics format. Instructions include maneuver type, road names with phonetic transcriptions, road shield data, signpost information, intersection names, and human-readable instruction text suitable for in-vehicle TTS output."
        sections={sections}
      />
    </div>
  );
}
