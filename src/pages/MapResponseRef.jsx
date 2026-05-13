import PageActions from '../components/ui/PageActions';

export default function MapResponseRef({ onNavigate }) {
  const rasterTree = [
    { key: 'Content-Type',    type: 'header', desc: 'image/png, image/png8, or image/jpeg — the binary tile image content.' },
    { key: 'Cache-Control',   type: 'header', desc: 'Caching directive. Base map tiles have long TTLs (hours to days). Traffic and dynamic overlay tiles have shorter TTLs.' },
    { key: 'ETag',            type: 'header', desc: 'Entity tag for conditional GET requests. Use If-None-Match header to avoid re-downloading unchanged tiles.' },
    { key: 'Last-Modified',   type: 'header', desc: 'Timestamp of last tile data update. Use with If-Modified-Since for conditional requests.' },
    { key: 'body',            type: 'binary', desc: 'Raw image bytes. 256×256 or 512×512 pixels. Overlay tiles (hybrid, labels) use PNG with transparent background.' },
  ];

  const vectorTree = [
    { key: 'Content-Type', type: 'header', desc: 'application/x-protobuf — Mapbox Vector Tile (MVT/PBF) binary data.' },
    { key: 'Cache-Control', type: 'header', desc: 'Caching directive. Vector tiles typically have longer TTLs than raster tiles.' },
    { key: 'ETag',          type: 'header', desc: 'Entity tag for conditional GET. Tiles are identical at the same zoom/x/y unless map data is updated.' },
    {
      key: 'body (PBF)', type: 'MapboxVectorTile',
      desc: 'Protobuf-encoded vector tile following the Mapbox Vector Tile 2.0 specification. Contains one or more named layers.',
      children: [
        {
          key: 'Basic layer', type: 'VectorLayer',
          desc: 'Primary map data layer. Contains road geometry, land use polygons, water bodies, buildings, and labels.',
          children: [
            { key: 'class',     type: 'string',  desc: 'Feature class: motorway, street, ferry, path, water, landuse, building, etc.' },
            { key: 'name',      type: 'string',  desc: 'Feature label in the requested language.' },
            { key: 'name_en',   type: 'string',  desc: 'Feature label in English (for multilingual apps).' },
            { key: 'rank',      type: 'integer', desc: 'Label priority rank. Lower number = higher priority in label conflict resolution.' },
          ],
        },
      ],
    },
  ];

  const staticImageTree = [
    { key: 'Content-Type', type: 'header', desc: 'image/png or image/jpeg — the static map image content.' },
    { key: 'Cache-Control', type: 'header', desc: 'Caching directive for the generated image.' },
    { key: 'body',          type: 'binary', desc: 'Rendered map image at the requested width × height in pixels, centred on the requested bbox or center+zoom coordinates.' },
  ];

  const copyrightsTree = [
    { key: 'formatVersion',  type: 'string', desc: 'Response format version string.' },
    {
      key: 'regions[]', type: 'CopyrightRegion[]',
      desc: 'List of copyright attribution regions.',
      children: [
        { key: 'country',    type: 'object',   desc: 'Country identifier. Has ISO, label, and optionally code fields.' },
        { key: 'copyrights[]', type: 'string[]', desc: 'Copyright attribution strings for this region. Must be displayed when showing map tiles for this area.' },
      ],
    },
    { key: 'generalCopyrights[]', type: 'string[]', desc: 'Global/general copyright strings that apply regardless of region. Always display these.' },
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
        <PageActions pageId="map-response-ref" pageTitle="Map Display API Response Schema" />
      </div>
      <p className="quick-answer">
        Map Display API endpoints return different response types — binary PNG/JPEG raster tiles, Protobuf vector tiles, static rendered images, and JSON for copyrights and style data.
      </p>

      <div className="zone">
        <h2 className="sh" id="raster">Raster Tiles (PNG/JPEG)</h2>
        <SectionBlock title="HTTP response — raster tile" tree={rasterTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="vector">Vector Tiles (PBF)</h2>
        <SectionBlock title="HTTP response — vector tile" tree={vectorTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="static">Static Image</h2>
        <SectionBlock title="HTTP response — static image" tree={staticImageTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="copyrights">Copyrights (JSON)</h2>
        <SectionBlock title="JSON response — copyrights" tree={copyrightsTree} />
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-params-ref', 'map-display-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-error-codes', 'map-display-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-raster-tile', 'map-display-api')}>Raster Tiles</button>
        </div>
      </div>
    </div>
  );
}
