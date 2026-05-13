import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'geometries', required: true, type: 'string', desc: 'Comma-separated list of geometry IDs previously retrieved from a Search API result (the dataSources.geometry.id field). Returns the polygon boundary for each ID. Maximum 20 IDs per request.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'geometriesZoom', type: 'integer', desc: 'Precision level for returned polygon coordinates. Maps to a map zoom level: 0 (156 km, whole world) through 22 (0.04 m). Higher values return more detailed polygon vertices. Maximum value: 22.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'additionalData', type: 'array', desc: 'Root array. Each element corresponds to one requested geometry ID, in the same order as the input.' },
  { name: 'additionalData[].providerID', type: 'string', desc: 'The geometry ID echoed back from the request.' },
  { name: 'additionalData[].error', type: 'string', desc: 'Error message if the geometry ID was not found or could not be retrieved. Present only on failure.' },
  { name: 'additionalData[].geometryData', type: 'object', desc: 'GeoJSON FeatureCollection containing the polygon boundary. Present only on success.', children: [
    { name: 'geometryData.type', type: 'string', desc: 'Always FeatureCollection.' },
    { name: 'geometryData.features', type: 'array', desc: 'Array of GeoJSON Feature objects.' },
    { name: 'geometryData.features[].type', type: 'string', desc: 'Always Feature.' },
    { name: 'geometryData.features[].properties', type: 'object', desc: 'Always an empty object {}.' },
    { name: 'geometryData.features[].id', type: 'string', desc: 'The geometry provider ID for this feature.' },
    { name: 'geometryData.features[].geometry', type: 'object', desc: 'GeoJSON geometry object.', children: [
      { name: 'geometry.type', type: 'string', desc: 'Geometry type — typically Polygon or MultiPolygon.' },
      { name: 'geometry.coordinates', type: 'array', desc: 'Nested coordinate arrays. For Polygon: [[[lon, lat], ...]] where the first and last coordinate are identical (closed ring).' },
    ]},
  ]},
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Additional Data — retrieve polygon boundaries for two geography IDs (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/additionalData.json\\
?key=YOUR_API_KEY\\
&geometries=00004631-3400-3c00-0000-0000673c4d2e,00004631-3400-3c00-0000-0000673c42fe\\
&geometriesZoom=12"`;

const CODE_V2 = `# Additional Data — retrieve polygon boundaries for two geography IDs (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/additionalData.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
&geometries=00004631-3400-3c00-0000-0000673c4d2e,00004631-3400-3c00-0000-0000673c42fe\\
&geometriesZoom=12"`;

const CODE_RESPONSE = `{
  "additionalData": [
    {
      "providerID": "00004145-3100-3c00-1110-000023c34641",
      "error": "Requested geometry not found"
    },
    {
      "providerID": "00004631-3400-3c00-0000-0000673c42fe",
      "geometryData": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "id": "00004631-3400-3c00-0000-0000673c42fe",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [4.7289, 52.4312],
                  [4.7520, 52.4198],
                  [4.7831, 52.4063],
                  [5.1077, 52.2780],
                  [5.0820, 52.2540],
                  [4.8800, 52.3100],
                  [4.7289, 52.4312]
                ]
              ]
            }
          }
        ]
      }
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchAdditionalData({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Additional Data</h1>
        <PageActions pageId="search-additional-data" pageTitle="Additional Data" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Retrieve polygon boundary coordinates for geographic entities — cities, countries, postal
        code areas, and other administrative divisions. Accepts up to 20 geometry IDs sourced from
        Search API results and returns GeoJSON FeatureCollections at a configurable zoom precision
        level.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              note: 'https://api.tomtom.com/search/2/additionalData.json — Geometry IDs are obtained from the dataSources.geometry.id field in Fuzzy Search or other Search API responses that return geography results.',
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
              note: 'https://api.tomtom.com/maps/orbis/places/additionalData.json  — Public Preview. Geometry IDs are obtained from the dataSources.geometry.id field in Fuzzy Search or other Search API responses that return geography results.',
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
          ]}
        />
      )}
    </div>
  );
}
