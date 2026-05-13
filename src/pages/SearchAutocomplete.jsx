import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'query', required: true, type: 'string (path)', desc: 'Partial or complete query string to get suggestions for. As short as 1 character. URL-encoded.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', required: true, type: 'string (IETF)', desc: 'Language for suggestion labels. Also influences which aliases are matched. Example: en-GB, de-DE, fr-FR.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 country codes to limit suggestions. Example: US,CA.' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic bias. Boosts suggestions relevant to this location. Pair with lon.' },
  { name: 'lon', type: 'float', desc: 'Longitude for geographic bias. Pair with lat.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres around lat/lon. Restricts geographically biased suggestions.' },
  { name: 'geobias', type: 'string', desc: 'Soft location bias (ranking only, not filtering). Formats: point:lat,lon or rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon. Mutually exclusive with lat/lon for ranking.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours in downstream search calls. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'resultSet', type: 'string', desc: 'Comma-separated result type filters. Values: category (POI category suggestions), brand (brand name suggestions). Omit to return both types.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of suggestions to return (1–10). Capped at 10 for autocomplete.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'results', type: 'array', desc: 'Array of autocomplete suggestion objects ordered by relevance.' },
  { name: 'results[].type', type: 'string', desc: 'Suggestion type: category (a POI category) or brand (a known brand name).' },
  { name: 'results[].entityType', type: 'string', desc: 'More specific entity classification, e.g. POICategory, Brand.' },
  { name: 'results[].matchedAlternativeName', type: 'string', desc: 'The alias or synonym that was matched if the query matched an alternative name rather than the primary label.' },
  { name: 'results[].segments', type: 'array', desc: 'Token segments for text highlighting — use to bold the matched portion of the suggestion label.', children: [
    { name: 'segments[].type', type: 'string', desc: 'Segment type: branded (brand name token), category (category token), or plain (unmatched text).' },
    { name: 'segments[].value', type: 'string', desc: 'The text content of this segment.' },
    { name: 'segments[].offset', type: 'integer', desc: 'Zero-based character offset within the full suggestion string where this segment starts.' },
    { name: 'segments[].length', type: 'integer', desc: 'Number of characters in this segment.' },
    { name: 'segments[].matches', type: 'object[]', desc: 'Array of { offset, length } objects marking the exact matched characters within this segment for fine-grained highlighting.' },
  ]},
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Autocomplete — suggestions for partial query "pizz" (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/autocomplete/pizz.json\\
?key=YOUR_API_KEY\\
&language=en-GB\\
&lat=51.5074&lon=-0.1278\\
&limit=5"`;

const CODE_V2 = `# Autocomplete — suggestions for partial query "pizz" (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/autocomplete/pizz.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
&language=en-GB\\
&geobias=point:51.5074,-0.1278\\
&limit=5"`;

const CODE_RESPONSE = `{
  "results": [
    {
      "type": "category",
      "entityType": "POICategory",
      "segments": [
        {
          "type": "category",
          "value": "pizza restaurant",
          "offset": 0,
          "length": 16,
          "matches": [
            { "offset": 0, "length": 4 }
          ]
        }
      ]
    },
    {
      "type": "brand",
      "entityType": "Brand",
      "segments": [
        {
          "type": "branded",
          "value": "Pizza Hut",
          "offset": 0,
          "length": 9,
          "matches": [
            { "offset": 0, "length": 4 }
          ]
        }
      ]
    },
    {
      "type": "brand",
      "entityType": "Brand",
      "segments": [
        {
          "type": "branded",
          "value": "Pizza Express",
          "offset": 0,
          "length": 13,
          "matches": [
            { "offset": 0, "length": 4 }
          ]
        }
      ]
    }
  ]
}`;

const CODE_HIGHLIGHT = `// Using segments to render highlighted suggestions in React
function Suggestion({ segments }) {
  return (
    <span>
      {segments.map((seg, i) => {
        if (!seg.matches?.length) return <span key={i}>{seg.value}</span>;
        // Build an array of marked / unmarked character runs
        const chars = seg.value.split('');
        const highlighted = seg.matches.reduce((acc, m) => {
          acc[m.offset] = true;
          return acc;
        }, {});
        return (
          <span key={i}>
            {chars.map((ch, ci) =>
              highlighted[ci]
                ? <strong key={ci}>{ch}</strong>
                : <span key={ci}>{ch}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchAutocomplete({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Autocomplete</h1>
        <PageActions pageId="search-autocomplete" pageTitle="Autocomplete" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Return type-ahead category and brand suggestions for partial query strings. Each result
        includes segment data with character-level match offsets for rendering highlighted
        suggestions in an instant-search UI.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              demoId: 'autocomplete',
              note: 'https://api.tomtom.com/search/2/autocomplete/{query}.json — language is required. Results are POI categories and brand names only, not individual place results.',
              params: PARAMS_SHARED,
              code: CODE_V1,
              lang: 'bash',
            },
            {
              id: 'response',
              heading: 'Response',
              params: RESPONSE_FIELDS,
              code: CODE_RESPONSE,
              lang: 'json',
            },
            {
              id: 'highlight-example',
              heading: 'Text Highlighting',
              note: 'Use the segments[].matches offsets to bold matched characters in your UI. Each match object gives a start offset and length within the segment value.',
              params: [],
              code: CODE_HIGHLIGHT,
              lang: 'javascript',
            },
          ]}
        />
      )}

      {tab === 'v2' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request-v2',
              heading: 'Request',
              method: 'GET',
              note: 'https://api.tomtom.com/maps/orbis/places/autocomplete/{query}.json  — Public Preview. language is required. Results are POI categories and brand names only, not individual place results.',
              params: v2Params,
              code: CODE_V2,
              lang: 'bash',
            },
            {
              id: 'response-v2',
              heading: 'Response',
              params: RESPONSE_FIELDS,
              code: CODE_RESPONSE,
              lang: 'json',
            },
            {
              id: 'highlight-example-v2',
              heading: 'Text Highlighting',
              note: 'Use the segments[].matches offsets to bold matched characters in your UI. Each match object gives a start offset and length within the segment value.',
              params: [],
              code: CODE_HIGHLIGHT,
              lang: 'javascript',
            },
          ]}
        />
      )}
    </div>
  );
}
