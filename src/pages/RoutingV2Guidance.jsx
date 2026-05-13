import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PageActions from '../components/ui/PageActions';

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'instructionsType',
    type: 'string',
    values: ['coded', 'text', 'tagged'],
    desc: 'Activates turn-by-turn guidance instructions.',
    children: [
      { name: 'coded', desc: 'Returns maneuver codes (e.g. TURN_LEFT). Best for programmatic use where you render your own icons.' },
      { name: 'text', desc: 'Returns human-readable instruction strings in the specified language.' },
      { name: 'tagged', desc: 'Wraps street names and road numbers in XML-like tags for custom rendering.' },
    ],
  },
  {
    name: 'language',
    type: 'string',
    default: 'en-GB',
    desc: 'IETF language tag for instruction text. Only used with instructionsType=text or tagged. Must be a supported language.',
  },
  {
    name: 'consolidatedInstruction',
    type: 'boolean',
    desc: 'When true, consecutive maneuvers of the same type are combined into a single instruction.',
  },
  {
    name: 'continuationInstruction',
    type: 'boolean',
    default: false,
    desc: 'When true, instructions are generated for straight segments where the road name or number changes — useful for motorway transitions.',
  },
];

/* ─── Guidance instruction object ───────────────────────────────────────── */
const PARAMS_INSTRUCTION = [
  {
    name: 'instructionType',
    type: 'string',
    values: ['TURN_LEFT_RIGHT', 'ROUNDABOUT_EXIT', 'ROUNDABOUT_PASS', 'MOTORWAY_ENTER_EXIT', 'MOTORWAY_CHANGE', 'COMBINED', 'LOCATION_DEPARTURE', 'LOCATION_ARRIVAL', 'LOCATION_WAYPOINT'],
    desc: 'The type of this instruction.',
  },
  {
    name: 'maneuver',
    type: 'string',
    values: ['DEPART', 'ARRIVE', 'TURN_LEFT', 'TURN_RIGHT', 'TURN_SHARP_LEFT', 'TURN_SHARP_RIGHT', 'TURN_SLIGHT_LEFT', 'TURN_SLIGHT_RIGHT', 'KEEP_LEFT', 'KEEP_RIGHT', 'MAKE_UTURN', 'FOLLOW', 'MOTORWAY_ENTER', 'MOTORWAY_EXIT_LEFT', 'MOTORWAY_EXIT_RIGHT', 'MOTORWAY_CHANGE_LEFT', 'MOTORWAY_CHANGE_RIGHT', 'ROUNDABOUT_CROSS', 'ROUNDABOUT_EXIT_LEFT', 'ROUNDABOUT_EXIT_RIGHT', 'TAKE_FERRY', 'ENTER_TUNNEL', 'BORDER_CROSSING', 'FOLLOW_ROAD', 'BEAR_LEFT', 'BEAR_RIGHT', 'ELEVATOR_TRAIN', 'END_OF_ROAD_LEFT', 'END_OF_ROAD_RIGHT'],
    desc: 'Specific maneuver action. Used when instructionType is TURN_LEFT_RIGHT or similar.',
  },
  {
    name: 'routeOffset',
    type: 'integer',
    desc: 'Distance in metres from the start of the route to the point where this instruction applies.',
  },
  {
    name: 'travelTime',
    type: 'integer',
    desc: 'Estimated travel time in seconds from the start of the route to this instruction point.',
  },
  {
    name: 'point',
    type: 'object',
    desc: 'Geographic location where the maneuver occurs.',
    children: [
      { name: 'point.latitude', type: 'float', desc: 'Latitude of the maneuver point.' },
      { name: 'point.longitude', type: 'float', desc: 'Longitude of the maneuver point.' },
    ],
  },
  {
    name: 'roadNumbers',
    type: 'string[]',
    desc: 'Road reference numbers at this instruction point (e.g. ["A10", "E35"]).',
  },
  {
    name: 'street',
    type: 'string',
    desc: 'Street name at this instruction point.',
  },
  {
    name: 'countryCode',
    type: 'string',
    desc: 'ISO 3166-1 alpha-3 country code at this instruction point.',
  },
  {
    name: 'junction',
    type: 'string',
    desc: 'Junction or intersection name, if available.',
  },
  {
    name: 'exitNumber',
    type: 'string',
    desc: 'Motorway exit number, if applicable.',
  },
  {
    name: 'roundaboutExitNumber',
    type: 'integer',
    desc: 'Which exit to take at a roundabout (1-indexed).',
  },
];

/* ─── Lane information ───────────────────────────────────────────────────── */
const PARAMS_LANES = [
  {
    name: 'laneInfo',
    type: 'object',
    desc: 'Lane configuration at this junction.',
    children: [
      {
        name: 'laneInfo.laneType',
        type: 'string',
        values: ['STRAIGHT', 'LEFT', 'RIGHT', 'SLIGHT_LEFT', 'SLIGHT_RIGHT', 'SHARP_LEFT', 'SHARP_RIGHT', 'UTURN', 'NONE'],
        desc: 'Directional options available in this lane.',
      },
      {
        name: 'laneInfo.laneTypeBitmask',
        type: 'string',
        desc: 'Bitmask encoding of lane directions. See the Routing API v2 reference for bit definitions.',
      },
      {
        name: 'laneInfo.isDrivable',
        type: 'boolean',
        desc: 'Whether this lane can be used for the current maneuver.',
      },
      {
        name: 'laneInfo.isRecommended',
        type: 'boolean',
        desc: 'Whether this lane is the recommended choice for the upcoming maneuver.',
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `curl "https://api.tomtom.com/maps/orbis/routing/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?instructionsType=tagged\\
  &language=en-GB\\
  &sectionType=lanes\\
  &sectionType=roadShields" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "routes": [{
    "guidance": {
      "instructions": [
        {
          "instructionType": "LOCATION_DEPARTURE",
          "maneuver": "DEPART",
          "routeOffset": 0,
          "travelTime": 0,
          "point": { "latitude": 52.50931, "longitude": 13.42936 },
          "street": "Kurfürstendamm"
        },
        {
          "instructionType": "TURN_LEFT_RIGHT",
          "maneuver": "TURN_RIGHT",
          "routeOffset": 340,
          "travelTime": 82,
          "point": { "latitude": 52.50753, "longitude": 13.43201 },
          "street": "Tauentzienstraße",
          "roadNumbers": ["B96"]
        },
        {
          "instructionType": "LOCATION_ARRIVAL",
          "maneuver": "ARRIVE",
          "routeOffset": 1879,
          "travelTime": 396,
          "point": { "latitude": 52.50274, "longitude": 13.43872 }
        }
      ]
    }
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export function RoutingV2GuidanceContent() {
  const sections = [
    {
      id: 'routing-v2-guidance-request',
      heading: 'Request parameters',
      method: 'GET',
      note: 'Add instructionsType to any Calculate Route v2 request to receive guidance. The guidance object is included in the response alongside legs and sections.',
      params: PARAMS_REQUEST,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v2-guidance-object',
      heading: 'Guidance instruction object',
      note: 'Each element of guidance.instructions represents a single navigation event.',
      params: PARAMS_INSTRUCTION,
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'routing-v2-guidance-lanes',
      heading: 'Lane information',
      note: 'Lane data is returned in sections[] when sectionType=lanes is requested alongside instructionsType.',
      params: PARAMS_LANES,
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <>
      <p className="quick-answer">Activate turn-by-turn navigation instructions on Routing API v2 Calculate Route requests. Choose between coded maneuver IDs, human-readable text, or XML-tagged output for custom rendering.</p>
      <ApiRefTwoCol
        sections={sections}
      />
    </>
  );
}

export default function RoutingV2Guidance() {
  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Guidance Instructions</h1>
        <PageActions />
      </div>
      <RoutingV2GuidanceContent />
    </div>
  );
}
