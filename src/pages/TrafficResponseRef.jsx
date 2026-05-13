import PageActions from '../components/ui/PageActions';

export default function TrafficResponseRef({ onNavigate }) {
  const rasterFlowTree = [
    { key: 'Content-Type',  type: 'header', desc: 'image/png or image/png8 — the raster tile image bytes.' },
    { key: 'Cache-Control', type: 'header', desc: 'Caching directive. Flow tiles have short TTLs (typically 30–60s) to reflect real-time data.' },
    { key: 'ETag',          type: 'header', desc: 'Entity tag for conditional GET requests. Use If-None-Match to avoid re-downloading unchanged tiles.' },
    { key: 'body',          type: 'binary', desc: 'Raw PNG image bytes. 256×256 or 512×512 pixels. Transparent background for overlay rendering on base map tiles.' },
  ];

  const vectorFlowTree = [
    { key: 'Content-Type', type: 'header', desc: 'application/x-protobuf — Mapbox Vector Tile (MVT) binary.' },
    {
      key: 'Traffic layer (PBF)', type: 'VectorLayer',
      desc: 'Vector tile layer containing road segments with traffic data.',
      children: [
        { key: 'road_type',              type: 'integer', desc: 'Road type classification: 0=Motorway, 1=Major, 2=Minor, 3=Local, 4=Other.' },
        { key: 'traffic_level',          type: 'integer', desc: 'Congestion level 0–100. 0 = free flow; 100 = completely blocked.' },
        { key: 'traffic_road_coverage',  type: 'integer', desc: 'Percentage of road length affected by the reported traffic level.' },
        { key: 'left_hand_traffic',      type: 'boolean', desc: 'Whether this road segment is in a left-hand traffic country.' },
      ],
    },
  ];

  const flowSegmentTree = [
    {
      key: 'flowSegmentData', type: 'FlowSegmentData',
      desc: 'Flow data for the road segment nearest to the requested coordinate.',
      children: [
        { key: 'frc',               type: 'string',  desc: 'Functional road class: FRC0 (highest/motorway) through FRC7 (local road).' },
        { key: 'currentSpeed',      type: 'integer', desc: 'Current traffic speed on this segment in the requested unit (KMPH or MPH).' },
        { key: 'freeFlowSpeed',     type: 'integer', desc: 'Historical free-flow speed for this segment and time of day.' },
        { key: 'currentTravelTime', type: 'integer', desc: 'Estimated travel time through this segment under current conditions, in seconds.' },
        { key: 'freeFlowTravelTime', type: 'integer', desc: 'Estimated travel time under free-flow conditions, in seconds.' },
        { key: 'confidence',        type: 'float',   desc: 'Quality score for the traffic data 0–1. 1.0 = high confidence real-time measurement.' },
        {
          key: 'coordinates', type: 'Coordinates',
          desc: 'Geometry of the matched road segment.',
          children: [
            {
              key: 'coordinate[]', type: 'GeoPoint[]',
              desc: 'Ordered polyline coordinates for the segment.',
              children: [
                { key: 'latitude',  type: 'float', desc: 'WGS84 latitude.' },
                { key: 'longitude', type: 'float', desc: 'WGS84 longitude.' },
              ],
            },
          ],
        },
        { key: 'openLR',     type: 'string',  desc: 'OpenLR binary location reference for this segment. Only when openLr=true is requested.' },
      ],
    },
  ];

  const incidentVectorTree = [
    { key: 'Content-Type', type: 'header', desc: 'application/x-protobuf — Mapbox Vector Tile (MVT) binary.' },
    {
      key: 'Incidents layer (PBF)', type: 'VectorLayer',
      desc: 'Vector tile layer with one feature per incident or incident cluster.',
      children: [
        { key: 'icon_category',  type: 'integer', desc: 'Incident category code: 1=Accident, 2=Fog, 3=Dangerous, 4=Rain, 5=Ice, 6=Jam, 7=Lane Closed, 8=Road Closed, 9=Road Works, 10=Wind, 11=Flooding.' },
        { key: 'description',    type: 'string',  desc: 'Short human-readable description of the incident in the requested language.' },
        { key: 'delay',          type: 'integer', desc: 'Delay introduced by this incident in seconds compared to free-flow travel.' },
        { key: 'road_category',  type: 'integer', desc: 'Functional road class of the affected road segment.' },
        { key: 'magnitude',      type: 'integer', desc: 'Impact magnitude: 1=Minor, 2=Moderate, 3=Major, 4=Undefined (closure).' },
        { key: 'cluster_size',   type: 'integer', desc: 'Number of incidents merged into this cluster point. Only present on cluster features.' },
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

  const SectionBlock = ({ title, tree }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.625rem' }}>{title}</h3>
      <div style={{
        background: 'var(--s1)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '0.5rem 0', overflow: 'hidden',
      }}>
        {renderTree(tree)}
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Response Schema</h1>
        <PageActions pageId="traffic-response-ref" pageTitle="Traffic API Response Schema" />
      </div>
      <p className="quick-answer">
        Traffic API endpoints return different response types depending on the endpoint — binary tile images, Protobuf vector tiles, or JSON flow segment data. This page describes each response format.
      </p>

      <div className="zone">
        <h2 className="sh" id="raster-flow">Raster Flow / Incident Tiles</h2>
        <SectionBlock title="HTTP response (PNG image)" tree={rasterFlowTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="vector-flow">Vector Flow Tiles (PBF)</h2>
        <SectionBlock title="Protobuf tile structure — flow" tree={vectorFlowTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="vector-incidents">Vector Incident Tiles (PBF)</h2>
        <SectionBlock title="Protobuf tile structure — incidents" tree={incidentVectorTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="flow-segment">Flow Segment Data (JSON)</h2>
        <SectionBlock title="JSON response — flow segment" tree={flowSegmentTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-params-ref', 'traffic-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-error-codes', 'traffic-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-raster-flow', 'traffic-api')}>Raster Flow Tiles</button>
        </div>
      </div>
    </div>
  );
}
