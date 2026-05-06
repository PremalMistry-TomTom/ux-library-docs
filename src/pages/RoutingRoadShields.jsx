import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'sectionType', required: true, type: 'string (repeatable)', values: ['roadShields'],
    desc: 'Include roadShields in the sectionType list to activate shield data in routes[].sections[]. Can be combined with other section types: &sectionType=roadShields&sectionType=traffic' },
  { name: 'instructionsType', type: 'string', values: ['tagged'],
    desc: 'When set to tagged, road numbers in instruction message strings are wrapped in <roadNumber> tags, enabling inline shield rendering at each maneuver step.' },
];

const PARAMS_SECTION = [
  { name: 'startPointIndex', type: 'integer', desc: 'Index into the route points array where this road shield section begins.' },
  { name: 'endPointIndex',   type: 'integer', desc: 'Index into the route points array where this road shield section ends.' },
  { name: 'sectionType',     type: 'string',  desc: 'Always "ROAD_SHIELDS" for this section type.' },
  { name: 'roadShields',     type: 'object[]', desc: 'Array of shield objects covering this section of the route.', children: [
    { name: 'roadShields[].other',          type: 'object',   desc: 'Container for the shields array.' },
    { name: 'roadShields[].other.shields',  type: 'object[]', desc: 'One or more shield objects for this road. Multiple shields occur when a road carries both a national and an international (E-road) designation simultaneously.' },
  ]},
];

const PARAMS_SHIELD = [
  { name: 'iconCategory', type: 'integer', values: ['1','2','3','4','5','6','7','8','9'],
    desc: 'Numeric code that maps to a shield shape and colour. Use this to select the correct asset from your icon set. See the category table below.' },
  { name: 'reference',     type: 'string', desc: 'The road identifier as it appears on physical signs — e.g. "A10", "E35", "M25", "N7". This is the text to overlay on the shield graphic.' },
  { name: 'shieldContent', type: 'string', desc: 'Display text for the shield. Usually the same as reference, but may differ for roads with formatted or abbreviated sign text.' },
  { name: 'version',       type: 'string', desc: 'Shield style version used for this data. Used internally to handle versioned icon sets.' },
];

/* ─── Icon category data ─────────────────────────────────────────────────────── */

const ICON_CATEGORIES = [
  { cat: 1, name: 'International E-road',  example: 'E35, E40',    color: '#22c55e', desc: 'Green background, white text. Pan-European route network.' },
  { cat: 2, name: 'National motorway',     example: 'M25, A10',    color: '#1d4ed8', desc: 'Country-specific. Blue in UK/Germany/France; green in US/Ireland.' },
  { cat: 3, name: 'National road',         example: 'N7, RN1',     color: '#e2001a', desc: 'Typically red or yellow depending on country.' },
  { cat: 4, name: 'Regional / secondary',  example: 'B14, D906',   color: '#f59e0b', desc: 'Yellow or white shields. Varies widely by country.' },
  { cat: 5, name: 'Local road',            example: 'L123',        color: '#64748b', desc: 'White or plain shields. Often no graphical asset available.' },
  { cat: 6, name: 'Scenic / special',      example: 'Romantic Road',color: '#a78bfa', desc: 'Named tourist or scenic routes. No standard shape.' },
  { cat: 7, name: 'Ferry',                 example: 'Ferry route',  color: '#38bdf8', desc: 'Water crossing segment.' },
  { cat: 8, name: 'Other',                 example: '—',           color: '#94a3b8', desc: 'Catch-all for roads that do not fit other categories.' },
  { cat: 9, name: 'Unknown',               example: '—',           color: '#475569', desc: 'Shield data present but category cannot be determined.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_REQUEST = `# Request road shield sections alongside turn-by-turn instructions
# instructionsType=tagged enables <roadNumber> tags in message strings

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?key=YOUR_API_KEY\\
  &sectionType=roadShields\\
  &instructionsType=tagged\\
  &language=en-GB\\
  &travelMode=car"`;

const CODE_RESPONSE = `// routes[0].sections[] — road shield sections
{
  "routes": [{
    "sections": [
      {
        "startPointIndex": 0,
        "endPointIndex": 12,
        "sectionType": "ROAD_SHIELDS",
        "roadShields": [
          {
            "other": {
              "shields": [
                {
                  "iconCategory": 2,
                  "reference": "A100",
                  "shieldContent": "A100",
                  "version": "2"
                }
              ]
            }
          },
          {
            "other": {
              "shields": [
                {
                  "iconCategory": 2,
                  "reference": "A113",
                  "shieldContent": "A113",
                  "version": "2"
                },
                {
                  "iconCategory": 1,
                  "reference": "E30",
                  "shieldContent": "E30",
                  "version": "2"
                }
              ]
            }
          }
        ]
      }
    ],
    "legs": [{
      "instructions": [
        {
          "maneuver": "ENTER_MOTORWAY",
          "message": "Take the <roadNumber>A100</roadNumber> motorway towards <streetName>Charlottenburg</streetName>",
          "routeOffsetInMeters": 340
        }
      ]
    }]
  }]
}`;

const CODE_RENDER = `// Rendering road shields inline with instruction text
// Parse <roadNumber> tags from the tagged instruction message

function renderInstruction(message, shieldsForStep) {
  // Split on <roadNumber> tags
  const parts = message.split(/(<roadNumber>.*?<\/roadNumber>)/g);

  return parts.map((part, i) => {
    const match = part.match(/<roadNumber>(.*?)<\/roadNumber>/);
    if (!match) return <span key={i}>{part}</span>;

    const roadRef = match[1]; // e.g. "A100"
    const shield  = shieldsForStep?.find(s => s.reference === roadRef);

    return (
      <RoadShieldBadge
        key={i}
        reference={roadRef}
        iconCategory={shield?.iconCategory ?? 8}
      />
    );
  });
}

// iconCategory → visual style mapping
const SHIELD_STYLES = {
  1: { bg: '#22c55e', color: '#fff', shape: 'rect'   }, // E-road
  2: { bg: '#1d4ed8', color: '#fff', shape: 'rect'   }, // Motorway
  3: { bg: '#e2001a', color: '#fff', shape: 'rect'   }, // National
  4: { bg: '#f59e0b', color: '#000', shape: 'rect'   }, // Regional
  5: { bg: '#e2e8f0', color: '#1e293b', shape: 'rect' }, // Local
};`;

/* ─── Icon category visual ───────────────────────────────────────────────────── */

function CategoryTable() {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        iconCategory reference
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ICON_CATEGORIES.map(({ cat, name, example, color, desc }) => (
          <div key={cat} style={{
            display: 'grid', gridTemplateColumns: '28px 1fr',
            gap: 10, alignItems: 'center',
            padding: '6px 10px', borderRadius: 6,
            border: '1px solid var(--border)', background: 'var(--bg)',
          }}>
            <div style={{
              width: 26, height: 18, borderRadius: 3,
              background: color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{cat}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--black)' }}>{name}</span>
                <span style={{ fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{example}</span>
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function RoutingRoadShields({ onNavigate }) {
  const requestSections = [
    {
      id: 'api-shields-request',
      heading: 'Enabling road shields',
      method: 'GET',
      params: PARAMS_REQUEST,
      note: 'Road shields are returned as route sections alongside the existing route geometry. Combine with instructionsType=tagged to also get <roadNumber> inline tags in instruction message strings — enabling you to render the correct shield graphic at each maneuver point.',
      code: CODE_REQUEST,
    },
  ];

  const responseSections = [
    {
      id: 'api-shields-section',
      heading: 'Road shield section',
      params: PARAMS_SECTION,
      note: 'Each ROAD_SHIELDS section covers a contiguous stretch of the route that shares the same road designation. A route across a motorway junction may produce multiple sections as the road number changes.',
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-shields-object',
      heading: 'Shield object',
      params: PARAMS_SHIELD,
      note: 'A single road can carry multiple shields simultaneously — for example a national motorway (iconCategory 2) that also forms part of the E-road network (iconCategory 1). In this case both appear in the shields[] array for the same road segment.',
      extra: <CategoryTable />,
      code: CODE_RENDER,
      lang: 'javascript',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Road Shield Notes</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The Routing API can return road sign metadata — shield shape category, road reference number,
        and display text — for every road segment on the route. Use it to render accurate motorway
        and route shields in your navigation UI, both on the map and inline within turn-by-turn
        instruction strings.
      </p>

      <Callout type="info">
        Road shields require <code style={{ fontFamily: 'monospace' }}>sectionType=roadShields</code>.
        For inline rendering within instruction text, also add{' '}
        <code style={{ fontFamily: 'monospace' }}>instructionsType=tagged</code> — road numbers will
        appear as <code style={{ fontFamily: 'monospace' }}>&lt;roadNumber&gt;</code> tags you can
        replace with the correct shield graphic at render time.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="shields-request">Request</h2>
        <ApiRefTwoCol sections={requestSections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="shields-response">Response</h2>
        <ApiRefTwoCol sections={responseSections} panelLabel="Response example" />
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-instructions')}>
          ← Turn-by-Turn Instructions
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-lane-guidance')}>
          Lane Guidance →
        </button>
      </div>
    </div>
  );
}
