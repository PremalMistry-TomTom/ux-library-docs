import PageActions from '../components/ui/PageActions';

export default function SearchResponseRef({ onNavigate }) {
  const tree = [
    {
      key: 'summary', type: 'SearchSummary',
      desc: 'Metadata about the search execution.',
      children: [
        { key: 'query',           type: 'string',  desc: 'The query string used in the search.' },
        { key: 'queryType',       type: 'string',  desc: 'Type of query interpretation: NON_NEAR or NEARBY.' },
        { key: 'queryTime',       type: 'integer', desc: 'Server-side query execution time in milliseconds.' },
        { key: 'numResults',      type: 'integer', desc: 'Number of results returned in this response page.' },
        { key: 'offset',          type: 'integer', desc: 'Starting offset of the result set. Matches the ofs request parameter.' },
        { key: 'totalResults',    type: 'integer', desc: 'Total number of matching results available across all pages.' },
        { key: 'fuzzyLevel',      type: 'integer', desc: 'Fuzzy match level actually applied. Between minFuzzyLevel and maxFuzzyLevel.' },
        { key: 'geoBias',         type: 'object',  desc: 'The geo-bias anchor applied, if any. Contains lat and lon fields.' },
        { key: 'queryIntent',     type: 'object[]', desc: 'Detected query intents (e.g. coordinate search, mapcode). Each has id and score.' },
      ],
    },
    {
      key: 'results[]', type: 'SearchResult[]',
      desc: 'Array of result objects, ordered by relevance score descending.',
      children: [
        { key: 'type',  type: 'string',  desc: 'Result type: POI, Street, Geography, Cross Street, Address Range, or Point Address.' },
        { key: 'id',    type: 'string',  desc: 'Unique result identifier. Stable within a query but not guaranteed across versions.' },
        { key: 'score', type: 'float',   desc: 'Relevance score from 0 to 1. Higher = more relevant.' },
        { key: 'dist',  type: 'float',   desc: 'Distance in metres from the geo-bias or lat/lon anchor. Only present when a position is provided.' },
        { key: 'info',  type: 'string',  desc: 'Additional result info string. Present on some geographic results.' },
        {
          key: 'poi', type: 'POI',
          desc: 'POI-specific fields. Only present when type = POI.',
          children: [
            { key: 'name',          type: 'string',   desc: 'POI display name.' },
            { key: 'phone',         type: 'string',   desc: 'Primary phone number.' },
            { key: 'url',           type: 'string',   desc: 'Website URL.' },
            { key: 'categories[]',  type: 'string[]', desc: 'List of POI category names.' },
            { key: 'classifications[]', type: 'object[]', desc: 'Detailed classification hierarchy. Each has code and names[].' },
            { key: 'brands[]',      type: 'object[]', desc: 'Brand objects with name field.' },
            {
              key: 'openingHours', type: 'OpeningHours',
              desc: 'Opening hours. Only present when openingHours=nextSevenDays is requested.',
              children: [
                { key: 'mode',       type: 'string',    desc: 'Opening hours mode: nextSevenDays.' },
                { key: 'timeRanges[]', type: 'object[]', desc: 'Array of { startTime, endTime } objects with date and hour/minute fields.' },
              ],
            },
          ],
        },
        {
          key: 'address', type: 'Address',
          desc: 'Structured address for the result.',
          children: [
            { key: 'streetNumber',           type: 'string', desc: 'Street / house number.' },
            { key: 'streetName',             type: 'string', desc: 'Street name.' },
            { key: 'municipality',           type: 'string', desc: 'City or town name.' },
            { key: 'municipalitySubdivision', type: 'string', desc: 'Suburb, district, or neighbourhood.' },
            { key: 'countrySubdivision',     type: 'string', desc: 'State, province, or region name.' },
            { key: 'countrySubdivisionCode', type: 'string', desc: 'ISO 3166-2 subdivision code.' },
            { key: 'postalCode',             type: 'string', desc: 'Postal or ZIP code.' },
            { key: 'extendedPostalCode',     type: 'string', desc: 'Extended postal code. Only when extendedPostalCodesFor is requested.' },
            { key: 'country',                type: 'string', desc: 'Country name.' },
            { key: 'countryCode',            type: 'string', desc: 'ISO 3166-1 alpha-2 country code.' },
            { key: 'countryCodeISO3',        type: 'string', desc: 'ISO 3166-1 alpha-3 country code.' },
            { key: 'freeformAddress',        type: 'string', desc: 'Formatted full address as a single string.' },
            { key: 'localName',              type: 'string', desc: 'Local/native name of the location.' },
          ],
        },
        {
          key: 'position', type: 'GeoPoint',
          desc: 'WGS84 coordinate of the result centroid.',
          children: [
            { key: 'lat', type: 'float', desc: 'Latitude in decimal degrees.' },
            { key: 'lon', type: 'float', desc: 'Longitude in decimal degrees.' },
          ],
        },
        {
          key: 'viewport', type: 'Viewport',
          desc: 'Bounding box that contains the result. Useful for map centering and zoom.',
          children: [
            { key: 'topLeftPoint',     type: 'GeoPoint', desc: 'Top-left corner of the viewport { lat, lon }.' },
            { key: 'btmRightPoint',    type: 'GeoPoint', desc: 'Bottom-right corner of the viewport { lat, lon }.' },
          ],
        },
        {
          key: 'entryPoints[]', type: 'EntryPoint[]',
          desc: 'Vehicle or pedestrian entry points for the result location.',
          children: [
            { key: 'type',     type: 'string',   desc: 'Entry type: main or minor.' },
            { key: 'position', type: 'GeoPoint', desc: 'Entry point coordinates { lat, lon }.' },
          ],
        },
        {
          key: 'chargingPark', type: 'ChargingPark',
          desc: 'EV charging park details. Only present on EV charging station results.',
          children: [
            {
              key: 'connectors[]', type: 'Connector[]',
              desc: 'Available connectors at this charging station.',
              children: [
                { key: 'connectorType',       type: 'object', desc: 'Connector standard. Has value (code) and localizedName fields.' },
                { key: 'ratedPowerKW',        type: 'float',  desc: 'Rated maximum power output in kW.' },
                { key: 'voltageV',            type: 'integer', desc: 'Connector voltage in volts.' },
                { key: 'currentA',            type: 'integer', desc: 'Maximum current in amps.' },
                { key: 'currentType',         type: 'string',  desc: 'Current type: AC1, AC3, or DC.' },
              ],
            },
          ],
        },
        { key: 'mapcodes[]',   type: 'object[]', desc: 'Mapcode representations of the position. Only present when mapcodes parameter is set.' },
        { key: 'timeZone',     type: 'object',   desc: 'Time zone info { ianaId, offset }. Only present when timeZone=iana is requested.' },
        { key: 'relatedPois[]', type: 'object[]', desc: 'Related POIs (child/parent venue). Only present when relatedPois is set.' },
        { key: 'matchConfidence', type: 'object', desc: 'Match quality score { score }. Values 0–1.' },
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
        <PageActions pageId="search-response-ref" pageTitle="Search API Response Schema" />
      </div>
      <p className="quick-answer">
        The Search API returns a consistent response envelope across all search endpoints — Fuzzy, POI, Nearby, Geometry, Along-Route, and Autocomplete. This page describes the full object hierarchy.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('search-params-ref', 'search-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-error-codes', 'search-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-fuzzy', 'search-api')}>Fuzzy Search</button>
        </div>
      </div>
    </div>
  );
}
