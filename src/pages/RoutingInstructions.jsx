import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import VersionTabBar from '../components/ui/VersionTabBar';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'instructionsType', required: true, type: 'string', values: ['coded', 'text', 'tagged'],
    desc: 'Activates guidance in the response. coded returns numeric maneuver IDs only. text returns fully rendered natural-language strings. tagged wraps street names and road numbers in XML-style tags for custom rendering and is required for lane guidance.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB',
    desc: 'Language for instruction text and street name localisation. Examples: en-GB, de-DE, fr-FR, zh-CN. Only applies when instructionsType=text or tagged.' },
  { name: 'sectionType', type: 'string (repeatable)', values: ['lanes', 'roadShields', 'speedLimit', 'travelMode', 'traffic', 'toll'],
    desc: 'Include sectionType=lanes to receive per-instruction lane arrays in the response. Required for lane guidance data.' },
];

const PARAMS_INSTRUCTION = [
  { name: 'routeOffsetInMeters', type: 'integer', desc: 'Distance along the route from the origin to this instruction point, in metres.' },
  { name: 'travelTimeInSeconds', type: 'integer', desc: 'Cumulative travel time from the origin to this instruction point, in seconds.' },
  { name: 'point', type: 'object', desc: 'Coordinates of the maneuver point.', children: [
    { name: 'point.latitude',  type: 'float', desc: 'WGS 84 latitude.' },
    { name: 'point.longitude', type: 'float', desc: 'WGS 84 longitude.' },
  ]},
  { name: 'instructionType', type: 'string', values: ['TURN', 'ROAD_CHANGE', 'LOCATION_DEPARTURE', 'LOCATION_ARRIVAL', 'DIRECTION_INFO', 'LOCATION_WAYPOINT'],
    desc: 'Category of instruction. TURN is the most common; ROAD_CHANGE covers name/type changes with no physical turn required.' },
  { name: 'roadNumbers', type: 'string[]', desc: 'Road reference numbers at the maneuver point, e.g. ["A10", "E35"]. Empty array if unnamed.' },
  { name: 'street', type: 'string', desc: 'Street or road name at the maneuver point. May be empty for unnamed roads.' },
  { name: 'signpostText', type: 'string', desc: 'Destination text from a physical signpost at this junction, if available. Useful for "Follow signs to…" phrasing.' },
  { name: 'exitNumber', type: 'string', desc: 'Motorway or roundabout exit number, e.g. "Exit 14" or "3rd exit".' },
  { name: 'maneuver', type: 'string',
    values: ['ARRIVE', 'ARRIVE_LEFT', 'ARRIVE_RIGHT', 'DEPART', 'STRAIGHT', 'KEEP_RIGHT', 'BEAR_RIGHT', 'TURN_RIGHT', 'SHARP_RIGHT', 'KEEP_LEFT', 'BEAR_LEFT', 'TURN_LEFT', 'SHARP_LEFT', 'MAKE_UTURN', 'ENTER_MOTORWAY', 'ENTER_FREEWAY', 'ENTER_HIGHWAY', 'TAKE_EXIT', 'MOTORWAY_EXIT_LEFT', 'MOTORWAY_EXIT_RIGHT', 'TAKE_FERRY', 'ROUNDABOUT_CROSS', 'ROUNDABOUT_RIGHT', 'ROUNDABOUT_LEFT', 'ROUNDABOUT_BACK', 'TRY_MAKE_UTURN', 'FOLLOW', 'SWITCH_PARALLEL_ROAD', 'SWITCH_MAIN_ROAD', 'ENTRANCE_RAMP', 'WAYPOINT_LEFT', 'WAYPOINT_RIGHT', 'WAYPOINT_REACHED'],
    desc: 'The specific driving action at this point. Use this to select the correct turn arrow icon in your UI.' },
  { name: 'message', type: 'string', desc: 'The rendered instruction string. Only present when instructionsType=text or tagged. With tagged, street names are wrapped in <streetName> and road numbers in <roadNumber> tags.' },
  { name: 'combinedMessage', type: 'string', desc: 'A combined instruction merging this step with the next when they occur close together, e.g. "Turn right, then immediately turn left onto Friedrichstraße." Only present when instructionsType=text or tagged.' },
  { name: 'drivingSide', type: 'string', values: ['LEFT', 'RIGHT'], desc: 'The side of the road traffic drives on at this point. Useful for localising lane diagrams.' },
  { name: 'angle', type: 'integer', desc: 'Turning angle in degrees relative to the current direction of travel. 0° = straight, 90° = right, 270° = left.' },
  { name: 'junction', type: 'object', desc: 'Junction metadata, if available.', children: [
    { name: 'junction.type', type: 'string', values: ['REGULAR', 'ROUNDABOUT'], desc: 'Junction type.' },
    { name: 'junction.name', type: 'string', desc: 'Named junction or interchange, e.g. "Knotenpunkt Barmbek".' },
  ]},
  { name: 'lanes', type: 'object[]', desc: 'Lane-level guidance array. Only present when sectionType=lanes is requested and instructionsType=tagged. See Lane Guidance for the full schema.' },
];

const PARAMS_CODED = [
  { name: 'instructionType', type: 'integer', desc: 'Numeric instruction category code (1 = TURN, 2 = ROAD_CHANGE, 3 = LOCATION_DEPARTURE, 4 = LOCATION_ARRIVAL, 5 = DIRECTION_INFO, 6 = LOCATION_WAYPOINT).' },
  { name: 'maneuver', type: 'integer', desc: 'Numeric maneuver code. Map to a maneuver icon using the coded maneuver table. The full code table is available in the API Reference → All Parameters page.' },
  { name: 'combinedManeuver', type: 'integer', desc: 'Numeric code for the combined next maneuver, when two turns occur close together.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_REQUEST = `# Request with text instructions in German
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?key=YOUR_API_KEY\\
  &instructionsType=text\\
  &language=de-DE\\
  &travelMode=car\\
  &routeType=fastest"`;

const CODE_TAGGED = `# instructionsType=tagged — street names wrapped in XML tags
# Required for lane guidance; also useful for custom styled rendering

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?key=YOUR_API_KEY\\
  &instructionsType=tagged\\
  &sectionType=lanes\\
  &language=en-GB"`;

const CODE_RESPONSE = `// GET /routing/1/calculateRoute — legs[0].instructions[]
{
  "routes": [{
    "legs": [{
      "instructions": [
        {
          "routeOffsetInMeters": 0,
          "travelTimeInSeconds": 0,
          "point": { "latitude": 52.50931, "longitude": 13.42936 },
          "instructionType": "LOCATION_DEPARTURE",
          "street": "Görlitzer Ufer",
          "maneuver": "DEPART",
          "message": "Depart on <streetName>Görlitzer Ufer</streetName> heading north-east",
          "drivingSide": "RIGHT",
          "angle": 0
        },
        {
          "routeOffsetInMeters": 340,
          "travelTimeInSeconds": 68,
          "point": { "latitude": 52.51180, "longitude": 13.43320 },
          "instructionType": "TURN",
          "street": "Spreeufer",
          "roadNumbers": [],
          "maneuver": "TURN_RIGHT",
          "message": "Turn right onto <streetName>Spreeufer</streetName>",
          "combinedMessage": "Turn right onto <streetName>Spreeufer</streetName>, then turn left",
          "drivingSide": "RIGHT",
          "angle": 88,
          "junction": { "type": "REGULAR" }
        },
        {
          "routeOffsetInMeters": 1879,
          "travelTimeInSeconds": 396,
          "point": { "latitude": 52.50274, "longitude": 13.43872 },
          "instructionType": "LOCATION_ARRIVAL",
          "maneuver": "ARRIVE",
          "message": "You have arrived at your destination, on the right",
          "drivingSide": "RIGHT"
        }
      ]
    }]
  }]
}`;

const CODE_CODED = `// instructionsType=coded — numeric IDs instead of text strings
// Use when you map maneuver codes to your own icon / audio assets

{
  "routes": [{
    "legs": [{
      "instructions": [
        {
          "routeOffsetInMeters": 0,
          "travelTimeInSeconds": 0,
          "point": { "latitude": 52.50931, "longitude": 13.42936 },
          "instructionType": 3,
          "maneuver": 2,
          "drivingSide": "RIGHT"
        },
        {
          "routeOffsetInMeters": 340,
          "travelTimeInSeconds": 68,
          "point": { "latitude": 52.51180, "longitude": 13.43320 },
          "instructionType": 1,
          "maneuver": 7,
          "combinedManeuver": 8,
          "drivingSide": "RIGHT",
          "angle": 88
        }
      ]
    }]
  }]
}`;

/* ─── Maneuver code quick-reference ─────────────────────────────────────────── */

const MANEUVER_MAP = [
  { code: 1,  text: 'ARRIVE' },
  { code: 2,  text: 'DEPART' },
  { code: 3,  text: 'STRAIGHT' },
  { code: 4,  text: 'KEEP_RIGHT' },
  { code: 5,  text: 'BEAR_RIGHT' },
  { code: 6,  text: 'TURN_RIGHT' },
  { code: 7,  text: 'SHARP_RIGHT' },
  { code: 8,  text: 'KEEP_LEFT' },
  { code: 9,  text: 'BEAR_LEFT' },
  { code: 10, text: 'TURN_LEFT' },
  { code: 11, text: 'SHARP_LEFT' },
  { code: 12, text: 'MAKE_UTURN' },
  { code: 13, text: 'ENTER_MOTORWAY' },
  { code: 14, text: 'TAKE_EXIT' },
  { code: 15, text: 'TAKE_FERRY' },
  { code: 16, text: 'ROUNDABOUT_CROSS' },
  { code: 17, text: 'FOLLOW' },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function RoutingInstructions({ onNavigate }) {
  const requestSections = [
    {
      id: 'api-instr-request',
      heading: 'Request parameters',
      method: 'GET',
      params: PARAMS_REQUEST,
      note: 'Add these parameters to any calculateRoute request. instructionsType activates guidance; all other guidance parameters are ignored if it is omitted.',
      code: CODE_REQUEST,
    },
  ];

  const responseSections = [
    {
      id: 'api-instr-response',
      heading: 'Instruction object',
      params: PARAMS_INSTRUCTION,
      note: 'Each object in legs[].instructions[] describes one maneuver step. The array is always ordered by routeOffsetInMeters. LOCATION_DEPARTURE is always first; LOCATION_ARRIVAL is always last.',
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-instr-coded',
      heading: 'Coded mode',
      params: PARAMS_CODED,
      note: 'When instructionsType=coded the instruction object omits message and combinedMessage. Instead, instructionType and maneuver are integers from the tables below. Use coded mode when you map maneuver IDs to your own icon or audio assets.',
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Maneuver code reference
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {MANEUVER_MAP.map(({ code, text }) => (
              <div key={code} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)',
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, background: 'var(--blue-light)', color: 'var(--blue)', flexShrink: 0, minWidth: 22, textAlign: 'center' }}>{code}</span>
                <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--mid)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      code: CODE_CODED,
      lang: 'json',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Turn-by-Turn Instructions</h1>
        <PageActions />
        <VersionTabBar versions={['v1']} activeTab="v1" onTabChange={() => {}} />
      </div>

      <p className="quick-answer">
        The Routing API can return a full maneuver list alongside the route shape. Add{' '}
        <code style={{ fontFamily: 'monospace' }}>instructionsType</code> to any{' '}
        <code style={{ fontFamily: 'monospace' }}>calculateRoute</code> request to activate it.
        Three modes are available: <strong>text</strong> for ready-to-display strings,{' '}
        <strong>tagged</strong> for custom rendering control, and <strong>coded</strong> for
        numeric IDs you map to your own icon and audio assets.
      </p>

      <Callout type="info">
        Lane guidance data (<code style={{ fontFamily: 'monospace' }}>lanes[]</code> on each instruction)
        requires <code style={{ fontFamily: 'monospace' }}>instructionsType=tagged</code> combined with{' '}
        <code style={{ fontFamily: 'monospace' }}>sectionType=lanes</code>. See the{' '}
        <button
          onClick={() => onNavigate?.('routing-lane-guidance')}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--blue)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}
        >
          Lane Guidance
        </button>{' '}
        page for the full schema.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="instr-request">Request</h2>
        <ApiRefTwoCol sections={requestSections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="instr-response">Response</h2>
        <ApiRefTwoCol sections={responseSections} panelLabel="Response example" />
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-lane-guidance')}>
          Lane Guidance →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
          Calculate Route →
        </button>
      </div>
    </div>
  );
}
