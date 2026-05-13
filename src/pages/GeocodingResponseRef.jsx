import PageActions from '../components/ui/PageActions';

export default function GeocodingResponseRef({ onNavigate }) {
  const tree = [
    {
      key: 'summary', type: 'GeocodeSummary',
      desc: 'Metadata about the geocode request.',
      children: [
        { key: 'query',        type: 'string',  desc: 'The query string used in the geocode request.' },
        { key: 'queryType',    type: 'string',  desc: 'Type of query interpretation: NON_NEAR or NEARBY.' },
        { key: 'queryTime',    type: 'integer', desc: 'Server-side processing time in milliseconds.' },
        { key: 'numResults',   type: 'integer', desc: 'Number of results returned in this page.' },
        { key: 'offset',       type: 'integer', desc: 'Result set starting offset.' },
        { key: 'totalResults', type: 'integer', desc: 'Total number of matching results across all pages.' },
        { key: 'fuzzyLevel',   type: 'integer', desc: 'Fuzzy match level applied to the query.' },
      ],
    },
    {
      key: 'results[]', type: 'GeocodeResult[]',
      desc: 'Array of geocoded result objects, ordered by relevance.',
      children: [
        { key: 'type',  type: 'string', desc: 'Result type: Point Address, Address Range, Street, Cross Street, or Geography.' },
        { key: 'id',    type: 'string', desc: 'Unique result identifier.' },
        { key: 'score', type: 'float',  desc: 'Relevance score 0–1. Higher = more relevant.' },
        {
          key: 'address', type: 'Address',
          desc: 'Structured address components of the geocoded result.',
          children: [
            { key: 'streetNumber',           type: 'string', desc: 'House or building number.' },
            { key: 'streetName',             type: 'string', desc: 'Street name.' },
            { key: 'municipality',           type: 'string', desc: 'City or town name.' },
            { key: 'municipalitySubdivision', type: 'string', desc: 'Suburb or district name.' },
            { key: 'countrySubdivision',     type: 'string', desc: 'State, province, or county name.' },
            { key: 'countrySubdivisionCode', type: 'string', desc: 'ISO 3166-2 subdivision code, e.g. CA-ON.' },
            { key: 'countrySecondarySubdivision', type: 'string', desc: 'Secondary administrative subdivision (e.g. county within state).' },
            { key: 'countryTertiarySubdivision',  type: 'string', desc: 'Tertiary administrative subdivision.' },
            { key: 'postalCode',             type: 'string', desc: 'Postal or ZIP code.' },
            { key: 'extendedPostalCode',     type: 'string', desc: 'Extended postal code. Only when extendedPostalCodesFor is requested.' },
            { key: 'country',                type: 'string', desc: 'Country display name.' },
            { key: 'countryCode',            type: 'string', desc: 'ISO 3166-1 alpha-2 country code, e.g. US.' },
            { key: 'countryCodeISO3',        type: 'string', desc: 'ISO 3166-1 alpha-3 country code, e.g. USA.' },
            { key: 'freeformAddress',        type: 'string', desc: 'Full formatted address as a single display string.' },
            { key: 'localName',              type: 'string', desc: 'Local/native name for the location.' },
          ],
        },
        {
          key: 'position', type: 'GeoPoint',
          desc: 'WGS84 coordinate of the geocoded result.',
          children: [
            { key: 'lat', type: 'float', desc: 'Latitude in decimal degrees.' },
            { key: 'lon', type: 'float', desc: 'Longitude in decimal degrees.' },
          ],
        },
        {
          key: 'viewport', type: 'Viewport',
          desc: 'Bounding box suitable for map display of this result.',
          children: [
            { key: 'topLeftPoint',  type: 'GeoPoint', desc: 'Top-left corner { lat, lon }.' },
            { key: 'btmRightPoint', type: 'GeoPoint', desc: 'Bottom-right corner { lat, lon }.' },
          ],
        },
        {
          key: 'boundingBox', type: 'BoundingBox',
          desc: 'Tighter bounding box for the result geometry, distinct from the viewport.',
          children: [
            { key: 'topLeftPoint',  type: 'GeoPoint', desc: 'Top-left corner { lat, lon }.' },
            { key: 'btmRightPoint', type: 'GeoPoint', desc: 'Bottom-right corner { lat, lon }.' },
          ],
        },
        {
          key: 'entryPoints[]', type: 'EntryPoint[]',
          desc: 'Vehicle and pedestrian entry points for the result address.',
          children: [
            { key: 'type',     type: 'string',   desc: 'Entry type: main or minor.' },
            { key: 'position', type: 'GeoPoint', desc: 'Entry point coordinates { lat, lon }.' },
          ],
        },
        {
          key: 'matchConfidence', type: 'MatchConfidence',
          desc: 'Confidence score for the address match quality.',
          children: [
            { key: 'score', type: 'float', desc: 'Match quality from 0 to 1. 1.0 = exact match.' },
          ],
        },
        { key: 'mapcodes[]',       type: 'object[]', desc: 'Mapcode representations of the position. Only when mapcodes parameter is set.' },
        { key: 'dataSources',      type: 'object',   desc: 'Source data identifiers. Contains geometry { id } for cross-referencing with additional data endpoints.' },
      ],
    },
  ];

  const renderTree = (nodes, depth = 0) => nodes.map(node => (
    <div key={node.key} style={{ marginLeft: depth * 20 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
        padding: '0.4rem 0.75rem',
        borderLeft: depth > 0 ? '2px solid var(--border)' : 'none',
        marginLeft: depth > 0 ? '8px' : 0,
      }}>
        <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{node.key}</code>
        <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', flexShrink: 0 }}>{node.type}</span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{node.desc}</span>
      </div>
      {node.children && renderTree(node.children, depth + 1)}
    </div>
  ));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Response Schema</h1>
        <PageActions pageId="geocoding-response-ref" pageTitle="Geocoding API Response Schema" />
      </div>
      <p className="quick-answer">
        The Geocoding API returns a consistent response structure for all geocode endpoints. This page describes the full object hierarchy including address fields, position, confidence scores, and viewports.
      </p>

      <div className="zone">
        <h2 className="sh" id="schema">Response object tree</h2>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '0.5rem 0', overflow: 'hidden',
        }}>
          {renderTree(tree)}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-params-ref', 'geocoding-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-error-codes', 'geocoding-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>Geocode Endpoint</button>
        </div>
      </div>
    </div>
  );
}
