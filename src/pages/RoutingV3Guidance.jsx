import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';
import PageActions from '../components/ui/PageActions';

/* ─── Enabling guidance ──────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'instructionsType', type: 'string', values: ['coded', 'text', 'tagged'], desc: 'coded returns compact integer maneuver codes; text returns human-readable strings; tagged wraps street names in XML-like tags.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for turn-by-turn instruction text and street name localisation.' },
  { name: 'consolidateInstructions', type: 'boolean', desc: 'Merge adjacent identical instructions into one.' },
  { name: 'report', type: 'string', values: ['effectiveSettings'], desc: 'Include effectiveSettings in the response to see which values were actually applied.' },
];

/* ─── Instruction object ─────────────────────────────────────────────────── */
const PARAMS_INSTRUCTION_OBJECT = [
  { name: 'routeOffsetInMeters', type: 'integer', desc: 'Distance from route start to this instruction.' },
  { name: 'travelTimeInSeconds', type: 'integer', desc: 'Travel time from start to this maneuver.' },
  { name: 'point.latitude',  type: 'float', desc: 'Latitude of the maneuver point.' },
  { name: 'point.longitude', type: 'float', desc: 'Longitude of the maneuver point.' },
  { name: 'pointIndex', type: 'integer', desc: 'Index into the legs[].points polyline array.' },
  { name: 'instructionType', type: 'string', values: ['TURN', 'ROAD_CHANGE', 'LOCATION_DEPARTURE', 'LOCATION_ARRIVAL', 'DIRECTION_INFO', 'LOCATION_WAYPOINT'], desc: 'High-level classification of this instruction.' },
  { name: 'maneuver', type: 'string', values: ['ARRIVE', 'ARRIVE_LEFT', 'ARRIVE_RIGHT', 'DEPART', 'STRAIGHT', 'KEEP_RIGHT', 'BEAR_RIGHT', 'TURN_RIGHT', 'SHARP_RIGHT', 'KEEP_LEFT', 'BEAR_LEFT', 'TURN_LEFT', 'SHARP_LEFT', 'MAKE_UTURN', 'ENTER_MOTORWAY', 'ENTER_FREEWAY', 'ENTER_HIGHWAY', 'TAKE_EXIT', 'MOTORWAY_OR_FREEWAY_OR_HIGHWAY_EXIT_LEFT', 'MOTORWAY_OR_FREEWAY_OR_HIGHWAY_EXIT_RIGHT', 'TAKE_FERRY', 'ROUNDABOUT_CROSS', 'ROUNDABOUT_RIGHT', 'ROUNDABOUT_LEFT', 'ROUNDABOUT_BACK', 'TRY_MAKE_UTURN', 'FOLLOW', 'SWITCH_PARALLEL_ROAD', 'SWITCH_MAIN_ROAD', 'ENTRANCE_RAMP', 'WAYPOINT_LEFT', 'WAYPOINT_RIGHT', 'WAYPOINT_REACHED'], desc: 'Maneuver code. See values for the full enumeration.' },
  { name: 'street', type: 'string', desc: 'Name of the road on which the maneuver occurs.' },
  { name: 'signpostText', type: 'string', desc: 'Text shown on the road sign at this maneuver.' },
  { name: 'countryCode', type: 'string (ISO 3-letter)', desc: 'Country code at the maneuver location.' },
  { name: 'exitNumber', type: 'string', desc: 'Road exit number, if applicable.' },
  { name: 'roundaboutExitNumber', type: 'integer', desc: 'Exit number around a roundabout (1-based, counting from entry).' },
  { name: 'roadNumbers', type: 'string[]', desc: 'Road numbers (e.g. A100, E30) at the maneuver point.' },
  { name: 'drivingSide', type: 'string', values: ['LEFT', 'RIGHT'], desc: 'Side of the road driven at this maneuver location.' },
  { name: 'possibleCombineWithNext', type: 'boolean', desc: 'Whether this instruction may be merged with the following one.' },
  { name: 'message', type: 'string', desc: 'Human-readable instruction text when instructionsType=text or tagged.' },
  { name: 'combinedMessage', type: 'string', desc: 'Combined message when merged with next instruction.' },
];

/* ─── Lane information ───────────────────────────────────────────────────── */
const PARAMS_LANES = [
  { name: 'lanes[].directions', type: 'string[]', values: ['straight', 'slightRight', 'right', 'sharpRight', 'rightUTurn', 'slightLeft', 'left', 'sharpLeft', 'leftUTurn'], desc: 'All possible exit directions from this lane.' },
  { name: 'lanes[].follow', type: 'string', values: ['straight', 'slightRight', 'right', 'sharpRight', 'rightUTurn', 'slightLeft', 'left', 'sharpLeft', 'leftUTurn'], desc: 'The direction to follow for the current route.' },
  { name: 'lanes[].laneType', type: 'string', values: ['normal', 'bus', 'carpool'], desc: 'Classification of this lane.' },
  { name: 'laneSeparators', type: 'string[]', values: ['unknown', 'noMarking', 'longDashed', 'doubleSolid', 'singleSolid', 'solidDashed', 'dashedSolid', 'shortDashed', 'shadedArrowMarking', 'dashedBlocks', 'doubleDashed', 'crossingAlert', 'physicalDivider'], desc: 'Separator markings from left of leftmost lane to right of rightmost lane.' },
  { name: 'sections[].properties', type: 'string[]', values: ['isManeuver'], desc: 'Optional section properties.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Enable guidance instructions — Routing API v3

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?instructionsType=text\\
  &language=en-GB\\
  &sectionType=lanes" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_INSTRUCTION = `// guidance.instructions[] — example object
{
  "routeOffsetInMeters": 423,
  "travelTimeInSeconds": 78,
  "point": { "latitude": 52.50712, "longitude": 13.43201 },
  "pointIndex": 12,
  "instructionType": "TURN",
  "maneuver": "TURN_RIGHT",
  "street": "Unter den Linden",
  "roadNumbers": ["B2"],
  "drivingSide": "RIGHT",
  "message": "Turn right onto Unter den Linden",
  "possibleCombineWithNext": false
}`;

const CODE_LANES = `// sections[] with lane data (sectionType=lanes)
{
  "sections": [{
    "startPointIndex": 10,
    "endPointIndex": 14,
    "sectionType": "LANES",
    "lanes": [
      {
        "directions": ["straight", "slightRight"],
        "follow": "straight",
        "laneType": "normal"
      },
      {
        "directions": ["right"],
        "follow": "",
        "laneType": "normal"
      }
    ],
    "laneSeparators": ["noMarking", "singleSolid", "noMarking"],
    "properties": ["isManeuver"]
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export function RoutingV3GuidanceContent() {
  const sections = [
    {
      id: 'routing-v3-guidance-request',
      heading: 'Enabling guidance',
      method: 'GET',
      note: 'Guidance instructions are activated by adding instructionsType to the Calculate Route request. The language parameter controls the locale for street names and maneuver text.',
      params: PARAMS_REQUEST,
      code: CODE_REQUEST,
      lang: 'bash',
    },
    {
      id: 'routing-v3-guidance-object',
      heading: 'Instruction object',
      note: 'Each element in guidance.instructions[] describes a single maneuver point. The most important fields for UI rendering are maneuver, message, and point.',
      params: PARAMS_INSTRUCTION_OBJECT,
      code: CODE_INSTRUCTION,
      lang: 'json',
    },
    {
      id: 'routing-v3-guidance-lanes',
      heading: 'Lane information',
      note: 'Lane data is included when sectionType=lanes is set. Sections with lanes contain a lanes[] array. Each Lane object describes one lane left-to-right in the direction of travel.',
      params: PARAMS_LANES,
      code: CODE_LANES,
      lang: 'json',
    },
  ];

  return (
    <>
      <PrivatePreviewBanner api="Routing API v3" />
      <p className="quick-answer">Turn-by-turn instruction schema returned in the guidance object of a Routing API v3 Calculate Route response. Enable with instructionsType=text, tagged, or coded. Includes lane information when sectionType=lanes is also set.</p>
      <ApiRefTwoCol
        sections={sections}
      />
    </>
  );
}

export default function RoutingV3Guidance() {
  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Guidance Instructions</h1>
        <PageActions />
      </div>
      <RoutingV3GuidanceContent />
    </div>
  );
}
