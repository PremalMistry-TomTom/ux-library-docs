import PageActions from '../components/ui/PageActions';

export default function LDEVRResponseRef({ onNavigate }) {
  const tree = [
    { key: 'formatVersion', type: 'string', desc: 'API format version string.' },
    {
      key: 'routes[]', type: 'Route[]',
      desc: 'Array of route objects. Index 0 is the primary route. Includes all legs — driving legs plus charging stop legs.',
      children: [
        {
          key: 'summary', type: 'LDEVRRouteSummary',
          desc: 'Aggregate statistics for the entire route including all charging stops.',
          children: [
            { key: 'lengthInMeters',                   type: 'integer', desc: 'Total route distance in metres.' },
            { key: 'travelTimeInSeconds',              type: 'integer', desc: 'Total travel time including driving, charging, and any delays.' },
            { key: 'trafficDelayInSeconds',            type: 'integer', desc: 'Delay caused by traffic vs free-flow conditions.' },
            { key: 'departureTime',                    type: 'string (RFC 3339)', desc: 'Actual departure time used, with timezone offset.' },
            { key: 'arrivalTime',                      type: 'string (RFC 3339)', desc: 'Estimated arrival time, with timezone offset.' },
            { key: 'batteryConsumptionInkWh',          type: 'float',   desc: 'Net battery energy consumed across the entire route. Positive = net consumption.' },
            { key: 'remainingChargeAtArrivalInkWh',    type: 'float',   desc: 'Estimated battery charge remaining when arriving at the final destination.' },
            { key: 'totalChargingTimeInSeconds',       type: 'integer', desc: 'Total time spent charging at all automatic charging stops combined.' },
            { key: 'noTrafficTravelTimeInSeconds',     type: 'integer', desc: 'Travel time with zero traffic. Only when computeTravelTimeFor=all.' },
            { key: 'historicTrafficTravelTimeInSeconds', type: 'integer', desc: 'Travel time using historic patterns only. Only when computeTravelTimeFor=all.' },
          ],
        },
        {
          key: 'legs[]', type: 'Leg[]',
          desc: 'One leg per consecutive waypoint pair. Driving legs alternate with charging stop legs. Each charging stop produces an additional leg.',
          children: [
            { key: 'summary', type: 'LegSummary', desc: 'Per-leg statistics: lengthInMeters, travelTimeInSeconds, batteryConsumptionInkWh, remainingChargeAtArrivalInkWh.' },
            {
              key: 'chargingInformationAtEndOfLeg', type: 'ChargingInfo',
              desc: 'Charging details for legs that end at a charging stop. Present only on charging-stop legs.',
              children: [
                { key: 'targetChargeInkWh',    type: 'float',   desc: 'Target battery charge level when leaving the charging stop, in kWh.' },
                { key: 'chargingTimeInSeconds', type: 'integer', desc: 'Time needed to charge from arrival charge to targetChargeInkWh at this stop.' },
                {
                  key: 'chargingConnections[]', type: 'ChargingConnection[]',
                  desc: 'Array of charging connections at this stop. Usually one entry, but can include fallback connectors.',
                  children: [
                    { key: 'legIndex',           type: 'integer', desc: 'Index of the leg that ends at this charging stop (0-based).' },
                    { key: 'chargingTime',       type: 'integer', desc: 'Charging duration in seconds for this connection.' },
                    {
                      key: 'chargingPark', type: 'ChargingPark',
                      desc: 'Details about the charging station at this stop.',
                      children: [
                        { key: 'id',       type: 'string',   desc: 'TomTom POI identifier for the charging station.' },
                        { key: 'name',     type: 'string',   desc: 'Station or operator display name.' },
                        {
                          key: 'position', type: 'GeoPoint',
                          desc: 'Station coordinates.',
                          children: [
                            { key: 'latitude',  type: 'float', desc: 'WGS84 latitude.' },
                            { key: 'longitude', type: 'float', desc: 'WGS84 longitude.' },
                          ],
                        },
                        {
                          key: 'connectors[]', type: 'Connector[]',
                          desc: 'Available connector types at this station used for this charging stop.',
                          children: [
                            { key: 'connectorType', type: 'object',  desc: 'Connector standard. Has value (code) and localizedName fields.' },
                            { key: 'ratedPowerKW',  type: 'float',   desc: 'Rated power in kW.' },
                            { key: 'currentType',   type: 'string',  desc: 'Current type: AC1, AC3, or DC.' },
                            { key: 'voltageV',      type: 'integer', desc: 'Connector voltage in volts.' },
                            { key: 'currentA',      type: 'integer', desc: 'Maximum current in amps.' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              key: 'points[]', type: 'GeoPoint[]',
              desc: 'Ordered polyline coordinates for this leg.',
              children: [
                { key: 'latitude',  type: 'float', desc: 'WGS84 latitude.' },
                { key: 'longitude', type: 'float', desc: 'WGS84 longitude.' },
              ],
            },
          ],
        },
        {
          key: 'sections[]', type: 'Section[]',
          desc: 'Typed route segments (toll, traffic, country, etc.) when sectionType is requested.',
          children: [
            { key: 'startPointIndex', type: 'integer', desc: 'Start index into leg points.' },
            { key: 'endPointIndex',   type: 'integer', desc: 'End index into leg points.' },
            { key: 'sectionType',     type: 'string',  desc: 'Section type: travelMode, traffic, toll, country, motorway, tunnel, ferry, speedLimit.' },
          ],
        },
        {
          key: 'guidance', type: 'Guidance',
          desc: 'Turn-by-turn instructions. Only populated when instructionsType is set.',
          children: [
            {
              key: 'instructions[]', type: 'Instruction[]',
              desc: 'Ordered manoeuvre events from departure to arrival.',
              children: [
                { key: 'routeOffsetInMeters', type: 'integer',  desc: 'Distance from route start to this instruction.' },
                { key: 'travelTimeInSeconds', type: 'integer',  desc: 'Cumulative travel time from departure to this instruction.' },
                { key: 'point',               type: 'GeoPoint', desc: 'Location of the manoeuvre { latitude, longitude }.' },
                { key: 'instructionType',     type: 'string',   desc: 'Event type: TURN, ROUNDABOUT_ENTER, ROUNDABOUT_EXIT, MOTORWAY_ENTER_EXIT, WAYPOINT_REACHED, ARRIVE, DEPART, ROAD_NAME_CHANGE, FOLLOW.' },
                { key: 'street',              type: 'string',   desc: 'Street name at the manoeuvre point.' },
                { key: 'maneuver',            type: 'string',   desc: 'Coded manoeuvre: ARRIVE, DEPART, STRAIGHT, TURN_LEFT, TURN_RIGHT, KEEP_LEFT, KEEP_RIGHT, etc.' },
                { key: 'message',             type: 'string',   desc: 'Plain-text instruction. Only when instructionsType=text.' },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 'effectiveSettings', type: 'object',
      desc: 'Parameter values actually applied. Only returned when report=effectiveSettings is set.',
    },
    {
      key: 'warnings[]', type: 'Warning[]',
      desc: 'Non-fatal issues — parameters adjusted or ignored without a 400 error.',
      children: [
        { key: 'code',     type: 'string',   desc: 'Warning identifier.' },
        { key: 'text',     type: 'string',   desc: 'Human-readable description.' },
        { key: 'fields[]', type: 'string[]', desc: 'Parameter names that triggered the warning.' },
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
        <PageActions pageId="ldevr-response-ref" pageTitle="Long Distance EV Routing API Response Schema" />
      </div>
      <p className="quick-answer">
        The LDEVR response extends the standard Routing API response with EV-specific fields: battery consumption summaries, charging stop legs, and chargingInformationAtEndOfLeg for each charging stop.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-params-ref', 'ldevr')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-errors', 'ldevr')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>Calculate Route</button>
        </div>
      </div>
    </div>
  );
}
