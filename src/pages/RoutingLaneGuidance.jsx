import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'instructionsType', required: true, type: 'string', values: ['tagged'],
    desc: 'Must be set to tagged. Lane guidance is not returned for coded or text modes.' },
  { name: 'sectionType', required: true, type: 'string (repeatable)', values: ['lanes'],
    desc: 'Must include lanes. This activates the lanes[] array on each instruction object. Combine with other sectionType values as needed: &sectionType=lanes&sectionType=roadShields' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB',
    desc: 'Language for instruction text alongside the lane data.' },
];

const PARAMS_LANE = [
  { name: 'lanes', type: 'object[]', desc: 'Array of lane objects at this instruction point, ordered from left to right as seen by the driver facing the direction of travel. Only present on TURN and DIRECTION_INFO instruction types at junctions with lane-level data.', children: [
    { name: 'lanes[].laneNumber', type: 'integer', desc: 'Lane index from the left edge of the carriageway. Lane 1 is the leftmost lane.' },
    { name: 'lanes[].allowedDirections', type: 'string[]', values: ['STRAIGHT', 'RIGHT', 'LEFT', 'SLIGHT_RIGHT', 'SLIGHT_LEFT', 'SHARP_RIGHT', 'SHARP_LEFT', 'UTURN'],
      desc: 'All legal directions of travel from this lane. A lane can allow multiple directions — e.g. ["STRAIGHT", "RIGHT"] for a combined through/right-turn lane.' },
    { name: 'lanes[].isDrivable', type: 'boolean', desc: 'true if this lane leads toward the next maneuver on the recommended route. false for lanes that would cause a deviation. Use this to highlight or dim lanes in your UI.' },
    { name: 'lanes[].recommendedLane', type: 'boolean', desc: 'true for the single lane the API considers optimal for this maneuver — typically the rightmost drivable lane for a right turn, or the leftmost for a left turn. Highlight this lane most prominently.' },
    { name: 'lanes[].laneDirectionType', type: 'string', values: ['STRAIGHT', 'RIGHT', 'LEFT', 'SLIGHT_RIGHT', 'SLIGHT_LEFT', 'SHARP_RIGHT', 'SHARP_LEFT', 'UTURN', 'NONE'],
      desc: 'The primary direction for this lane as indicated by road markings. NONE when no marking data is available.' },
  ]},
];

const PARAMS_SECTION = [
  { name: 'type', type: 'string', desc: 'Always "lanes" for this section type.' },
  { name: 'startPointIndex', type: 'integer', desc: 'Index into the route points array where this lanes section begins.' },
  { name: 'endPointIndex', type: 'integer', desc: 'Index into the route points array where this lanes section ends.' },
  { name: 'sectionType', type: 'string', desc: 'Always "LANE" for lane sections.' },
  { name: 'travelMode', type: 'string', desc: 'Travel mode for this section.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_REQUEST = `# Lane guidance requires instructionsType=tagged AND sectionType=lanes

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?key=YOUR_API_KEY\\
  &instructionsType=tagged\\
  &sectionType=lanes\\
  &language=en-GB\\
  &travelMode=car"`;

const CODE_RESPONSE = `// legs[0].instructions[] — one instruction at a 4-lane junction
{
  "routes": [{
    "legs": [{
      "instructions": [
        {
          "routeOffsetInMeters": 820,
          "travelTimeInSeconds": 154,
          "point": { "latitude": 52.50680, "longitude": 13.43210 },
          "instructionType": "TURN",
          "street": "Köpenicker Straße",
          "maneuver": "TURN_RIGHT",
          "message": "Turn right onto <streetName>Köpenicker Straße</streetName>",
          "drivingSide": "RIGHT",
          "angle": 91,
          "lanes": [
            {
              "laneNumber": 1,
              "allowedDirections": ["LEFT", "SLIGHT_LEFT"],
              "laneDirectionType": "LEFT",
              "isDrivable": false,
              "recommendedLane": false
            },
            {
              "laneNumber": 2,
              "allowedDirections": ["STRAIGHT"],
              "laneDirectionType": "STRAIGHT",
              "isDrivable": false,
              "recommendedLane": false
            },
            {
              "laneNumber": 3,
              "allowedDirections": ["STRAIGHT", "RIGHT"],
              "laneDirectionType": "STRAIGHT",
              "isDrivable": true,
              "recommendedLane": false
            },
            {
              "laneNumber": 4,
              "allowedDirections": ["RIGHT"],
              "laneDirectionType": "RIGHT",
              "isDrivable": true,
              "recommendedLane": true
            }
          ]
        }
      ]
    }]
  }]
}`;

const CODE_RENDER = `// Rendering lane arrows — React/web example

function LaneBar({ lanes }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#1a1a2e', borderRadius: 20 }}>
      {lanes.map((lane) => (
        <div
          key={lane.laneNumber}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            opacity: lane.isDrivable ? 1 : 0.3,
          }}
        >
          {lane.allowedDirections.map((dir) => (
            <LaneArrow
              key={dir}
              direction={dir}
              highlighted={lane.recommendedLane}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// isDrivable=false  → dim / grey arrow
// isDrivable=true   → bright arrow (white or brand colour)
// recommendedLane=true → highlighted arrow (e.g. yellow or accent colour)`;

/* ─── Visual lane diagram ────────────────────────────────────────────────────── */

function LaneDiagram() {
  const lanes = [
    { n: 1, dirs: ['LEFT'],            drivable: false, recommended: false },
    { n: 2, dirs: ['STRAIGHT'],        drivable: false, recommended: false },
    { n: 3, dirs: ['STRAIGHT','RIGHT'],drivable: true,  recommended: false },
    { n: 4, dirs: ['RIGHT'],           drivable: true,  recommended: true  },
  ];

  const ARROWS = {
    LEFT:        '←',
    SLIGHT_LEFT: '↖',
    STRAIGHT:    '↑',
    SLIGHT_RIGHT:'↗',
    RIGHT:       '→',
    SHARP_LEFT:  '↰',
    SHARP_RIGHT: '↱',
    UTURN:       '↩',
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        Lane bar — visual rendering
      </div>
      <div style={{
        display: 'flex', gap: 2, padding: '16px 20px',
        background: '#1e1e2e', borderRadius: 20, justifyContent: 'center',
      }}>
        {lanes.map((lane) => (
          <div
            key={lane.n}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, padding: '8px 12px', borderRadius: 20, minWidth: 52,
              background: lane.recommended ? 'rgba(234,179,8,0.15)' : lane.drivable ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: lane.recommended ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(255,255,255,0.08)',
              opacity: lane.drivable ? 1 : 0.28,
            }}
          >
            {lane.dirs.map((d) => (
              <span key={d} style={{
                fontSize: '1.1rem', lineHeight: 1,
                color: lane.recommended ? '#eab308' : lane.drivable ? '#ffffff' : '#6b7280',
              }}>{ARROWS[d] ?? '↑'}</span>
            ))}
            <span style={{ fontSize: '0.5625rem', color: lane.recommended ? '#eab308' : 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {lane.recommended ? 'BEST' : lane.drivable ? 'OK' : '✕'}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        {[
          { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'recommendedLane: true' },
          { color: '#ffffff', bg: 'rgba(255,255,255,0.08)', label: 'isDrivable: true' },
          { color: '#6b7280', bg: 'transparent', label: 'isDrivable: false' },
        ].map(({ color, bg, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${color}`, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function RoutingLaneGuidance({ onNavigate }) {
  const requestSections = [
    {
      id: 'api-lane-request',
      heading: 'Enabling lane guidance',
      method: 'GET',
      params: PARAMS_REQUEST,
      note: 'Lane guidance is only available on roads where TomTom has lane-level map data. At junctions without coverage the lanes[] array will be absent from the instruction object.',
      extra: (
        <Callout type="warning" style={{ marginTop: 12 }}>
          Lane data requires <strong>both</strong>{' '}
          <code style={{ fontFamily: 'monospace' }}>instructionsType=tagged</code> and{' '}
          <code style={{ fontFamily: 'monospace' }}>sectionType=lanes</code>.
          Omitting either will result in no <code style={{ fontFamily: 'monospace' }}>lanes[]</code> array in the response.
        </Callout>
      ),
      code: CODE_REQUEST,
    },
  ];

  const responseSections = [
    {
      id: 'api-lane-response',
      heading: 'Lane object schema',
      params: PARAMS_LANE,
      note: 'Lanes are ordered left to right as seen by the driver. A typical 4-lane junction returns 4 objects. Use isDrivable to decide which lanes to highlight and recommendedLane to identify the optimal one.',
      extra: <LaneDiagram />,
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-lane-render',
      heading: 'Rendering guidance',
      params: [],
      note: (
        <>
          A lane bar typically appears at the bottom of the map view 400–800 m before a complex
          junction, then dismisses after the maneuver. The rendering pattern below is framework-agnostic —
          the same <code style={{ fontFamily: 'monospace' }}>isDrivable</code> /{' '}
          <code style={{ fontFamily: 'monospace' }}>recommendedLane</code> flags apply to any UI stack.
        </>
      ),
      extra: (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Rendering guidelines
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '↑', label: 'isDrivable: false', tip: 'Dim to ~25–30% opacity. The driver should not move into this lane for the upcoming maneuver.' },
              { icon: '→', label: 'isDrivable: true', tip: 'Full brightness in a neutral colour (white / brand secondary). Indicates valid lanes for the turn.' },
              { icon: '★', label: 'recommendedLane: true', tip: 'Highlight in your accent colour (yellow, orange). Speak as "use the right lane" in audio guidance.' },
            ].map(({ icon, label, tip }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)',
              }}>
                <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 3, fontFamily: 'monospace' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      code: CODE_RENDER,
      lang: 'javascript',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Lane Guidance</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Lane guidance extends turn-by-turn instructions with per-lane detail at complex junctions —
        which lanes are drivable, which directions they allow, and which single lane the API recommends.
        Use it to render a lane bar in the navigation UI and to include lane advice in audio prompts.
      </p>

      <Callout type="info">
        Coverage is road-dependent. Lane data is available on motorways, multi-lane arterials, and
        complex urban junctions in most TomTom map markets. At junctions without coverage, the{' '}
        <code style={{ fontFamily: 'monospace' }}>lanes[]</code> array is simply absent — your code
        should render the lane bar only when the array is present and non-empty.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="lane-request">Request</h2>
        <ApiRefTwoCol sections={requestSections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="lane-response">Response &amp; Rendering</h2>
        <ApiRefTwoCol sections={responseSections} panelLabel="Response example" />
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-instructions')}>
          ← Turn-by-Turn Instructions
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
          Calculate Route →
        </button>
      </div>
    </div>
  );
}
