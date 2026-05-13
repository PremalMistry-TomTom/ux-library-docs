import PageActions from '../components/ui/PageActions';

export default function EVResponseRef({ onNavigate }) {
  const tree = [
    {
      key: 'summary', type: 'SearchSummary',
      desc: 'Search execution metadata.',
      children: [
        { key: 'query',        type: 'string',  desc: 'The query string used.' },
        { key: 'queryType',    type: 'string',  desc: 'Query type: NON_NEAR or NEARBY.' },
        { key: 'queryTime',    type: 'integer', desc: 'Server-side processing time in milliseconds.' },
        { key: 'numResults',   type: 'integer', desc: 'Number of results in this page.' },
        { key: 'offset',       type: 'integer', desc: 'Starting offset of the result set.' },
        { key: 'totalResults', type: 'integer', desc: 'Total matching results across all pages.' },
      ],
    },
    {
      key: 'results[]', type: 'EVStationResult[]',
      desc: 'Array of EV charging station results ordered by relevance or distance.',
      children: [
        { key: 'type',  type: 'string', desc: 'Result type. Always POI for station search results.' },
        { key: 'id',    type: 'string', desc: 'Unique result identifier.' },
        { key: 'score', type: 'float',  desc: 'Relevance score 0–1.' },
        { key: 'dist',  type: 'float',  desc: 'Distance in metres from the search anchor. Present when lat/lon is provided.' },
        {
          key: 'poi', type: 'POI',
          desc: 'POI-specific details for the charging station.',
          children: [
            { key: 'name',         type: 'string',   desc: 'Station or operator name.' },
            { key: 'phone',        type: 'string',   desc: 'Contact phone number.' },
            { key: 'url',          type: 'string',   desc: 'Operator website URL.' },
            { key: 'categories[]', type: 'string[]', desc: 'POI category names. Includes "Electric Vehicle Station".' },
            { key: 'brands[]',     type: 'object[]', desc: 'Operator/brand objects with name field.' },
            {
              key: 'openingHours', type: 'OpeningHours',
              desc: 'Opening hours data. Only present when openingHours=nextSevenDays is requested.',
              children: [
                { key: 'mode',         type: 'string',    desc: 'Opening hours mode: nextSevenDays.' },
                { key: 'timeRanges[]', type: 'object[]',  desc: 'Array of { startTime, endTime } objects.' },
              ],
            },
          ],
        },
        {
          key: 'address', type: 'Address',
          desc: 'Structured address of the charging station.',
          children: [
            { key: 'streetNumber',  type: 'string', desc: 'House or building number.' },
            { key: 'streetName',    type: 'string', desc: 'Street name.' },
            { key: 'municipality',  type: 'string', desc: 'City or town name.' },
            { key: 'countrySubdivision', type: 'string', desc: 'State or province name.' },
            { key: 'postalCode',    type: 'string', desc: 'Postal code.' },
            { key: 'country',       type: 'string', desc: 'Country display name.' },
            { key: 'countryCode',   type: 'string', desc: 'ISO 3166-1 alpha-2 country code.' },
            { key: 'freeformAddress', type: 'string', desc: 'Full formatted address as a single string.' },
          ],
        },
        {
          key: 'position', type: 'GeoPoint',
          desc: 'WGS84 coordinate of the charging station.',
          children: [
            { key: 'lat', type: 'float', desc: 'Latitude in decimal degrees.' },
            { key: 'lon', type: 'float', desc: 'Longitude in decimal degrees.' },
          ],
        },
        {
          key: 'viewport', type: 'Viewport',
          desc: 'Bounding box for map display.',
          children: [
            { key: 'topLeftPoint',  type: 'GeoPoint', desc: 'Top-left corner { lat, lon }.' },
            { key: 'btmRightPoint', type: 'GeoPoint', desc: 'Bottom-right corner { lat, lon }.' },
          ],
        },
        {
          key: 'chargingPark', type: 'ChargingPark',
          desc: 'EV charging park details — connector types, power levels, and current availability.',
          children: [
            {
              key: 'connectors[]', type: 'Connector[]',
              desc: 'Array of available connector types at this charging station.',
              children: [
                { key: 'connectorType',  type: 'object',  desc: 'Connector standard. Has value (code string, e.g. IEC62196Type2CableAttached) and localizedName (display name) fields.' },
                { key: 'ratedPowerKW',   type: 'float',   desc: 'Rated maximum power output in kW for this connector.' },
                { key: 'voltageV',       type: 'integer', desc: 'Connector voltage in volts.' },
                { key: 'currentA',       type: 'integer', desc: 'Maximum current in amps.' },
                { key: 'currentType',    type: 'string',  desc: 'Current type: AC1 (single-phase AC), AC3 (three-phase AC), or DC.' },
              ],
            },
          ],
        },
        {
          key: 'entryPoints[]', type: 'EntryPoint[]',
          desc: 'Vehicle entry points for the station.',
          children: [
            { key: 'type',     type: 'string',   desc: 'Entry type: main or minor.' },
            { key: 'position', type: 'GeoPoint', desc: 'Entry coordinates { lat, lon }.' },
          ],
        },
      ],
    },
  ];

  // Availability response tree
  const availTree = [
    {
      key: 'connectorAvailabilities[]', type: 'ConnectorAvailability[]',
      desc: 'Live availability data grouped by connector type and power level.',
      children: [
        {
          key: 'connectorType', type: 'object',
          desc: 'Connector type identifier.',
          children: [
            { key: 'value',         type: 'string', desc: 'Connector type code, e.g. IEC62196Type2CableAttached.' },
            { key: 'localizedName', type: 'string', desc: 'Human-readable connector type name.' },
          ],
        },
        { key: 'ratedPowerKW',    type: 'float',   desc: 'Rated power for this connector group in kW.' },
        { key: 'totalCount',      type: 'integer', desc: 'Total number of connectors of this type at this station.' },
        { key: 'availableCount',  type: 'integer', desc: 'Number of connectors currently available (not in use or occupied).' },
        { key: 'occupiedCount',   type: 'integer', desc: 'Number of connectors currently occupied/in use.' },
        { key: 'reservedCount',   type: 'integer', desc: 'Number of connectors currently reserved.' },
        { key: 'unknownCount',    type: 'integer', desc: 'Number of connectors with unknown availability state.' },
        { key: 'outOfServiceCount', type: 'integer', desc: 'Number of connectors out of service.' },
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
        <PageActions pageId="ev-response-ref" pageTitle="EV Charging API Response Schema" />
      </div>
      <p className="quick-answer">
        The EV Charging Stations Availability API has two response types: a search results envelope (station search, nearby, along-route) and a live availability response (Charging Availability endpoint).
      </p>

      <div className="zone">
        <h2 className="sh" id="search-response">Station search response</h2>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '0.5rem 0', overflow: 'hidden',
        }}>
          {renderTree(tree)}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="availability-response">Charging Availability response</h2>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '0.5rem 0', overflow: 'hidden',
        }}>
          {renderTree(availTree)}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-params-ref', 'ev-charging-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-error-codes', 'ev-charging-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-charging-availability', 'ev-charging-api')}>Charging Availability</button>
        </div>
      </div>
    </div>
  );
}
