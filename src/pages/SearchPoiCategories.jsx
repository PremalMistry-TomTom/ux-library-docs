import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for category names and synonyms. When a category is not available in the requested language, English is used as the fallback. Cannot be NGT or NGT-Latn.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'poiCategories', type: 'array', desc: 'Root array containing the full POI category taxonomy.' },
  { name: 'poiCategories[].id', type: 'long', desc: 'Numeric category ID. Use this value in the categorySet parameter of other Search API endpoints to filter results by category.' },
  { name: 'poiCategories[].name', type: 'string', desc: 'Display name of the category in the requested language (e.g. Sports Center, Stadium, Restaurant).' },
  { name: 'poiCategories[].childCategoryIds', type: 'integer[]', desc: 'List of numeric IDs for subcategories that belong to this parent category. Empty array for leaf-level categories.' },
  { name: 'poiCategories[].synonyms', type: 'string[]', desc: 'List of alternative names and common synonyms for the category in the requested language (e.g. Gym, Health Club for Sports Center).' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# POI Categories — retrieve the full taxonomy in English (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/poiCategories.json\\
?key=YOUR_API_KEY\\
&language=en-GB"`;

const CODE_V2 = `# POI Categories — retrieve the full taxonomy in English (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/poiCategories.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
&language=en-GB"`;

const CODE_RESPONSE = `{
  "poiCategories": [
    {
      "id": 7311,
      "name": "Petrol/Gasoline Station",
      "childCategoryIds": [
        7311001,
        7311002,
        7311003
      ],
      "synonyms": [
        "Filling Station",
        "Fuel Station",
        "Gas Station",
        "Garage",
        "Service Station"
      ]
    },
    {
      "id": 7315,
      "name": "Restaurant",
      "childCategoryIds": [
        7315001,
        7315002,
        7315003,
        7315015,
        7315016
      ],
      "synonyms": [
        "Bistro",
        "Brasserie",
        "Cafe",
        "Diner",
        "Eatery"
      ]
    },
    {
      "id": 7315015,
      "name": "Pizza Restaurant",
      "childCategoryIds": [],
      "synonyms": [
        "Pizza",
        "Pizzeria"
      ]
    },
    {
      "id": 7320,
      "name": "Sports Center",
      "childCategoryIds": [
        7320002,
        7320003,
        7320004,
        7320005,
        7320006
      ],
      "synonyms": [
        "Fitness Center",
        "Fitness Centre",
        "Fitness Club",
        "Gym",
        "Gymnasium",
        "Health Club",
        "Indoor Sports",
        "Sports Centre",
        "Wellness Club"
      ]
    },
    {
      "id": 7374,
      "name": "Stadium",
      "childCategoryIds": [
        7374002,
        7374003,
        7374004,
        7374005,
        7374006
      ],
      "synonyms": [
        "Arena",
        "Indoor Arena",
        "Sports Field",
        "Sports Ground",
        "Sports Stadium"
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchPoiCategories({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>POI Categories</h1>
        <PageActions pageId="search-poi-categories" pageTitle="POI Categories" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Returns the full taxonomy of available POI category codes, names, synonyms, and
        hierarchical relationships. Use the numeric category IDs from this response in the
        categorySet parameter of Fuzzy Search, Nearby Search, Geometry Search, and other Search
        API endpoints to filter results by place type.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              note: 'https://api.tomtom.com/search/2/poiCategories.json — The response is the full category tree. No pagination is applied; all categories are returned in a single response.',
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
              note: 'https://api.tomtom.com/maps/orbis/places/poiCategories.json  — Public Preview. The response is the full category tree. No pagination is applied; all categories are returned in a single response.',
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
