import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ═══════════════════════════════════════════════════════════════════════════════
   ROUTE RECONSTRUCTION
   ═══════════════════════════════════════════════════════════════════════════════ */

const CODE_RECONSTRUCTION = `# Route Reconstruction — POST body with supportingPoints
# Reconstruct a route from a GPS trace (ordered lat/lon points)

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&reconstructionMode=routeMatch" \\
  -H "Content-Type: application/json" \\
  -d '{
    "supportingPoints": [
      { "latitude": 52.3676, "longitude": 4.9041 },
      { "latitude": 52.1500, "longitude": 4.4800 },
      { "latitude": 51.9200, "longitude": 4.4700 },
      { "latitude": 50.8500, "longitude": 4.3500 },
      { "latitude": 49.6100, "longitude": 6.1300 },
      { "latitude": 48.8566, "longitude": 2.3522 }
    ]
  }'`;

export function RoutingReconstruction({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Route Reconstruction</h1>
        <PageActions pageId="routing-reconstruction" pageTitle="Route Reconstruction" />
      </div>
      <p className="quick-answer">
        Reconstruct a route from a sequence of GPS coordinates using the{' '}
        <code>supportingPoints</code> POST body parameter. The API snaps the points to the
        road network and returns a coherent routable polyline.
      </p>

      <div className="zone">
        <h2 className="sh" id="how-it-works">How reconstruction works</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Route reconstruction is useful when you have a GPS trace (e.g. from a previous
          trip or a tracked asset) and want to map-match it to a routable path. Instead of
          relying on the routing engine to find the best path, the API matches your
          supporting points to the nearest road segments in the correct order.
        </p>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          The origin and destination are still specified in the URL path. The{' '}
          <code>supportingPoints</code> array provides intermediate GPS coordinates that
          guide the map-match. Points do not need to be on exact road intersections — the
          API handles snapping.
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { param: 'supportingPoints', type: 'GeoPoint[]', desc: 'Ordered array of {latitude, longitude} objects. The route is reconstructed to pass near all points in sequence.' },
            { param: 'reconstructionMode', type: 'string', desc: '"routeMatch" — map-match the supporting points to the road network. Future modes may be added.' },
            { param: 'encodedPolyline', type: 'string', desc: 'Alternative to supportingPoints. A compressed polyline string (precision 5 or 7). Use with encodedPolylinePrecision.' },
            { param: 'encodedPolylinePrecision', type: 'integer', desc: '5 (default, Google standard) or 7. Must match the precision used to encode the polyline.' },
          ].map(({ param, type, desc }) => (
            <div key={param} style={{
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{type}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock code={CODE_RECONSTRUCTION} language="bash" />

        <Callout type="info" title="Detailed parameter reference coming soon">
          Full documentation for reconstruction-specific response fields (matchConfidence,
          deviationDistance, etc.) is being added. In the meantime, see the Calculate Route
          page for the base response schema.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-howto', 'routing-api')}>How-to guides</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   AVOID AREAS
   ═══════════════════════════════════════════════════════════════════════════════ */

const CODE_AVOID_AREAS = `# Avoid a rectangular zone (e.g. city centre or roadworks area)
curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "avoidAreas": {
      "rectangles": [
        {
          "southWestCorner": { "latitude": 50.7500, "longitude": 4.2500 },
          "northEastCorner": { "latitude": 50.9500, "longitude": 4.4500 }
        }
      ]
    }
  }'`;

export function RoutingAvoidAreas({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Avoiding Areas</h1>
        <PageActions pageId="routing-avoid-areas" pageTitle="Avoiding Areas" />
      </div>
      <p className="quick-answer">
        Use <code>avoidAreas</code> in the POST body to exclude rectangular geographic zones
        from the calculated route. Useful for avoiding roadworks, restricted zones, or
        dangerous areas.
      </p>

      <div className="zone">
        <h2 className="sh" id="avoid-areas">avoidAreas parameter</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          The <code>avoidAreas</code> object accepts an array of rectangles. Each rectangle
          is defined by its south-west and north-east corners. The routing engine will
          calculate a path that does not enter any of the defined rectangles.
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { param: 'avoidAreas.rectangles', type: 'object[]', desc: 'Array of rectangular exclusion zones. Maximum 10 rectangles per request.' },
            { param: 'rectangles[].southWestCorner', type: 'GeoPoint', desc: 'Bottom-left corner of the avoid rectangle. { latitude, longitude }. Latitude: −80 to +80.' },
            { param: 'rectangles[].northEastCorner', type: 'GeoPoint', desc: 'Top-right corner. Must have a higher latitude and longitude than southWestCorner.' },
            { param: 'avoidVignette', type: 'string[]', desc: 'Array of ISO 3166-1 alpha-3 country codes (e.g. ["AUT", "CHE"]) whose vignette toll systems to avoid.' },
            { param: 'allowVignette', type: 'string[]', desc: 'Allow vignettes only in listed countries. Mutually exclusive with avoidVignette.' },
          ].map(({ param, type, desc }) => (
            <div key={param} style={{
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{type}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock code={CODE_AVOID_AREAS} language="bash" />

        <Callout type="warn" title="Rectangle size limit">
          Each rectangle may span up to approximately 160 × 160 km. Larger zones must be
          split into multiple overlapping rectangles. Maximum 10 per request.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="avoid-query-params">Query-param avoids</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          For road-type avoidance (not geographic zones), use the <code>avoid</code> query
          parameter. It can be repeated: <code>&amp;avoid=motorways&amp;avoid=tollRoads</code>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {['motorways', 'tollRoads', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings', 'lowEmissionZones', 'carpools', 'alreadyUsedRoads'].map(v => (
            <code key={v} style={{
              fontSize: '0.75rem', padding: '3px 8px',
              background: 'var(--s1)', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--mid)',
            }}>{v}</code>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-tolls', 'routing-api')}>Vignettes &amp; Toll Systems</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TOLL SYSTEMS
   ═══════════════════════════════════════════════════════════════════════════════ */

const VIGNETTE_COUNTRIES = [
  { code: 'AUT', name: 'Austria', iso3: 'AUT', cars: true, trucks: true, note: 'Digital vignette mandatory from 2024.' },
  { code: 'CHE', name: 'Switzerland', iso3: 'CHE', cars: true, trucks: false, note: 'Trucks pay distance-based HVF instead.' },
  { code: 'CZE', name: 'Czech Republic', iso3: 'CZE', cars: true, trucks: false, note: 'Trucks use e-toll (distance-based). Cars need vignette for motorways.' },
  { code: 'HUN', name: 'Hungary', iso3: 'HUN', cars: true, trucks: true, note: 'e-Vignette system. Mobile app purchase available.' },
  { code: 'SVK', name: 'Slovakia', iso3: 'SVK', cars: true, trucks: false, note: 'eVignette for passenger vehicles on motorways.' },
  { code: 'SVN', name: 'Slovenia', iso3: 'SVN', cars: true, trucks: false, note: 'Vignette required. Quarterly and annual options.' },
  { code: 'ROU', name: 'Romania', iso3: 'ROU', cars: true, trucks: false, note: 'Rovinieta sticker. Trucks pay e-toll.' },
  { code: 'BGR', name: 'Bulgaria', iso3: 'BGR', cars: true, trucks: false, note: 'Annual or weekly vignette.' },
];

export function RoutingTollSystems({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Vignettes &amp; Toll Systems</h1>
        <PageActions pageId="routing-tolls" pageTitle="Vignettes & Toll Systems" />
      </div>
      <p className="quick-answer">
        Control toll and vignette avoidance using <code>avoid=tollRoads</code>,{' '}
        <code>avoidVignette</code>, and <code>allowVignette</code>. The Routing API supports
        vignette systems across central and eastern Europe.
      </p>

      <div className="zone">
        <h2 className="sh" id="toll-avoidance">Toll road avoidance</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Use the <code>avoid=tollRoads</code> query parameter to route around all toll roads.
          For commercial vehicles, also consider <code>vehicleCommercial=true</code> to apply
          the correct commercial access rules in addition to toll avoidance.
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { param: 'avoid=tollRoads', desc: 'Avoid all toll roads including motorways, tunnels, and bridges that charge fees.' },
            { param: 'avoidVignette', desc: 'Array of ISO 3166-1 alpha-3 country codes. Avoids motorways in those countries that require a vignette.' },
            { param: 'allowVignette', desc: 'Only avoid vignette motorways in countries NOT listed. Mutually exclusive with avoidVignette.' },
            { param: 'vehicleCommercial', desc: 'Set true to apply commercial vehicle road-access restrictions separate from vignette.' },
          ].map(({ param, desc }) => (
            <div key={param} style={{
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.2rem' }}>{param}</code>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="vignette-coverage">Vignette coverage</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The following countries have vignette systems supported by the Routing API:
        </p>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '48px 1fr 64px 64px 1fr',
            padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Code', 'Country', 'Cars', 'Trucks', 'Notes'].map(h => (
              <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {VIGNETTE_COUNTRIES.map(({ iso3, name, cars, trucks, note }) => (
            <div key={iso3} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 64px 64px 1fr',
              padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{iso3}</code>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{name}</span>
              <span style={{ fontSize: '0.875rem', color: cars ? '#22c55e' : 'var(--muted)' }}>{cars ? 'Yes' : 'No'}</span>
              <span style={{ fontSize: '0.875rem', color: trucks ? '#22c55e' : 'var(--muted)' }}>{trucks ? 'Yes' : 'No'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-avoid-areas', 'routing-api')}>Avoiding Areas</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EV ROUTING LANDING
   ═══════════════════════════════════════════════════════════════════════════════ */

const EV_GUIDE_CARDS = [
  {
    id: 'routing-ev-overview',
    title: 'EV Route Planning',
    desc: 'Configure multi-stop EV routes with automatic charging stop insertion and battery management.',
  },
  {
    id: 'routing-ev-consumption',
    title: 'Consumption Models',
    desc: 'Model combustion and electric consumption per vehicle type. Required for accurate ETA and energy estimates.',
  },
  {
    id: 'routing-ev-connectors',
    title: 'Vehicle Profiles',
    desc: 'Map vehicle types, connector standards, and charging speeds to your fleet or end-user vehicles.',
  },
];

export function RoutingEVLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Routing</h1>
        <PageActions pageId="routing-ev" pageTitle="EV Routing Guides" />
      </div>
      <p className="quick-answer">
        Guides for planning electric vehicle routes with the Routing API — covering consumption
        models, battery configuration, and vehicle profiles across v1, v2, and v3.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {EV_GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'routing-api')}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   HOW-TO LANDING
   ═══════════════════════════════════════════════════════════════════════════════ */

const HOWTO_CARDS = [
  {
    id: 'routing-reconstruction',
    title: 'Route Reconstruction',
    desc: 'Reconstruct a route from a GPS trace using supportingPoints.',
    icon: '↩',
  },
  {
    id: 'routing-avoid-areas',
    title: 'Avoiding Areas',
    desc: 'Exclude rectangular geographic zones from the calculated route.',
    icon: '⛔',
  },
  {
    id: 'routing-tolls',
    title: 'Vignettes & Toll Systems',
    desc: 'Control toll road and vignette avoidance across European markets.',
    icon: '🛣',
  },
];

export function RoutingHowToLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>How-to Guides</h1>
        <PageActions pageId="routing-howto" pageTitle="Routing API How-to Guides" />
      </div>
      <p className="quick-answer">
        Step-by-step guides for common Routing API tasks. Each guide focuses on a specific
        use case with working code examples.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {HOWTO_CARDS.map(({ id, title, desc, icon }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'routing-api')}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>{icon}</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TOMTOM MAPS (v1 platform)
   ═══════════════════════════════════════════════════════════════════════════════ */

export function RoutingTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing API v1</h1>
        <PageActions pageId="routing-tomtom-maps" pageTitle="Routing API v1" />
      </div>
      <p className="quick-answer">
        Routing API v1 is the production-ready, globally available version for all
        current integrations. It supports GET and POST, and has the broadest parameter
        and geographic coverage of any version.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Platform overview</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          TomTom Maps is the established map data platform behind Routing API v1. It provides
          global road network coverage with real-time traffic, historical traffic patterns
          (IQ Routes), and geocoding compatibility.
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Base URL', value: 'https://api.tomtom.com/routing/1/' },
            { label: 'Authentication', value: 'API key via ?key= query parameter' },
            { label: 'Methods', value: 'GET or POST' },
            { label: 'Map data', value: 'TomTom Maps global road network' },
            { label: 'Traffic data', value: 'Real-time incidents + IQ Routes historical patterns' },
            { label: 'Coverage', value: 'Global — Europe, North America, Asia Pacific, Middle East & Africa, Latin America' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '8px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mid)' }}>{label}</span>
              <code style={{ fontSize: '0.8125rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{value}</code>
            </div>
          ))}
        </div>

        <Callout type="success" title="Production ready">
          TomTom Maps (v1) is the recommended platform for all new production integrations.
          SLAs, global coverage, and full parameter support are all available.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="geocoding">Geocoding compatibility</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>
          Routing API v1 waypoints (lat/lon pairs in the URL path) are compatible with
          coordinates returned by the TomTom Search API, Geocoding API, and any standard
          WGS84 coordinate source. There is no additional coordinate transform required.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route (v1)</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-orbis-maps', 'routing-api')}>Routing API v2 &amp; v3</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-migration', 'routing-api')}>Migration Guide</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ORBIS MAPS (v2 & v3 platform)
   ═══════════════════════════════════════════════════════════════════════════════ */

export function RoutingOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing API v2 &amp; v3</h1>
        <PageActions pageId="routing-orbis-maps" pageTitle="Routing API v2 & v3" />
      </div>
      <p className="quick-answer">
        Routing API v2 and v3 run on TomTom's next-generation map platform. Both versions
        offer enhanced road attributes and improved lane-level data versus v1, and are
        currently in preview.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Platform overview</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Orbis Maps represents a new data model for TomTom's road network. It separates
          the physical road geometry from semantic attributes, enabling richer routing
          decisions based on lane-level detail, turn restrictions, and enhanced guidance
          attributes.
        </p>

        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            {
              version: 'v2', color: '#a78bfa', label: 'Public Preview',
              url: 'https://api.tomtom.com/routing/2/',
              desc: 'Orbis-backed routing with enhanced guidance (road shields, lane arrows, junction views). POST only.',
            },
            {
              version: 'v3', color: '#fb923c', label: 'Private Preview',
              url: 'https://api.tomtom.com/maps/orbis/routing/v3/routes',
              desc: 'Attribute-selected response fields. New waypoint syntax. POST only. Requires preview access.',
            },
          ].map(v => (
            <div key={v.version} style={{
              padding: '1rem 1.125rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <span style={{
                  padding: '2px 8px', background: v.color + '22',
                  border: `1px solid ${v.color}66`, borderRadius: '6px',
                  fontSize: '0.75rem', fontWeight: 700, color: v.color,
                }}>{v.version}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{v.label}</span>
              </div>
              <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.375rem' }}>{v.url}</code>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.625rem' }}>
          Key improvements in Orbis
        </h3>
        <div style={{ display: 'grid', gap: '0.375rem' }}>
          {[
            'Enhanced road attributes — sign text, speed limits, lane counts per segment',
            'Lane-level routing — per-lane turn restrictions and merge guidance',
            'Improved junction views — more accurate lane arrow and road shield data',
            'Richer guidance instructions — cleaner instruction model with follow-road segments',
            'Better international road shield support (motorway, state, county levels)',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.375rem 0' }}>
              <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-v2-calculate-route', 'routing-api')}>Calculate Route (v2)</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-v3-calculate-route', 'routing-api')}>Calculate Route (v3)</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-migration', 'routing-api')}>Migration Guide</button>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MIGRATION GUIDE (v1 → v2)
   ═══════════════════════════════════════════════════════════════════════════════ */

const CODE_V1_GET = `# v1 — GET request
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&travelMode=car\\
&routeType=fastest\\
&instructionsType=text"`;

const CODE_V2_POST = `# v2 — POST request (Orbis Maps)
curl -X POST \\
  "https://api.tomtom.com/routing/2/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?travelMode=car\\
&routeType=fastest\\
&instructionsType=text" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{}'`;

const MIGRATION_CHANGES = [
  {
    area: 'Base URL',
    v1: '/routing/1/calculateRoute/…',
    v2: '/routing/2/calculateRoute/…',
    note: 'Change the version segment from 1 to 2.',
  },
  {
    area: 'Authentication',
    v1: '?key=YOUR_API_KEY (query param)',
    v2: 'Authorization: Bearer YOUR_API_KEY (header)',
    note: 'Move API key to Authorization header with Bearer prefix.',
  },
  {
    area: 'Request method',
    v1: 'GET or POST',
    v2: 'POST only',
    note: 'v2 is POST-only. Migrate all GET requests to POST.',
  },
  {
    area: 'Content-Type',
    v1: 'Not required for GET',
    v2: 'Content-Type: application/json required',
    note: 'Always include the Content-Type header.',
  },
  {
    area: 'Guidance',
    v1: 'instructionsType + Turn-by-Turn sections',
    v2: 'instructionsType + enhanced Guidance object',
    note: 'Guidance output is richer in v2 — road shields and lane arrows included.',
  },
  {
    area: 'Road shield notes',
    v1: 'roadShieldAtlas + roadShieldReferences in response',
    v2: 'Road shields embedded directly in instructions',
    note: 'Remove any roadShieldAtlas/roadShieldReferences parsing from your code.',
  },
];

export function RoutingMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Migration Guide</h1>
        <PageActions pageId="routing-migration" pageTitle="Routing API Migration Guide" />
      </div>
      <p className="quick-answer">
        Moving from Routing API v1 to v2 requires three changes: update the base URL,
        move the API key to an Authorization header, and switch from GET to POST requests.
        Most routing parameters remain unchanged.
      </p>

      <div className="zone">
        <h2 className="sh" id="key-changes">Key changes</h2>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
            padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Area', 'v1', 'v2', 'Action'].map(h => (
              <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {MIGRATION_CHANGES.map(({ area, v1, v2, note }) => (
            <div key={area} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
              padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'start', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{area}</span>
              <code style={{ fontSize: '0.6875rem', color: '#22c55e', fontFamily: 'var(--font-mono)', background: '#22c55e12', padding: '2px 5px', borderRadius: '4px', wordBreak: 'break-all' }}>{v1}</code>
              <code style={{ fontSize: '0.6875rem', color: '#a78bfa', fontFamily: 'var(--font-mono)', background: '#a78bfa12', padding: '2px 5px', borderRadius: '4px', wordBreak: 'break-all' }}>{v2}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="code-comparison">Code comparison</h2>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Before (v1 GET):</p>
        <CodeBlock code={CODE_V1_GET} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (v2 POST):</p>
        <CodeBlock code={CODE_V2_POST} language="bash" />

        <Callout type="info" title="Parameters stay the same">
          Route, vehicle, consumption, and section parameters are unchanged between v1 and
          v2. The migration is structural (URL, auth, method) not semantic.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-v2-calculate-route', 'routing-api')}>Calculate Route (v2)</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-tomtom-maps', 'routing-api')}>Routing API v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-orbis-maps', 'routing-api')}>Routing API v2 &amp; v3</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PLATFORM LANDING
   ═══════════════════════════════════════════════════════════════════════════════ */

const PLATFORM_CARDS = [
  {
    id: 'routing-tomtom-maps',
    title: 'Routing API v1',
    version: 'v1', vColor: '#22c55e',
    desc: 'The production version of the Routing API. Global coverage, full parameter support.',
    icon: '↗',
  },
  {
    id: 'routing-orbis-maps',
    title: 'Routing API v2 & v3',
    version: 'v2 & v3', vColor: '#a78bfa',
    desc: 'Next-generation API versions (public & private preview). Enhanced lane data and attribute-based responses.',
    icon: '↗',
  },
  {
    id: 'routing-migration',
    title: 'Migration Guide',
    version: 'v1 → v2', vColor: 'var(--mid)',
    desc: 'Step-by-step guide for moving from Routing API v1 to v2. URL, auth method, and request format changes.',
    icon: '↗',
  },
];

export function RoutingPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Platforms &amp; Migration</h1>
        <PageActions pageId="routing-platform" pageTitle="Routing API Platforms" />
      </div>
      <p className="quick-answer">
        The Routing API runs on two map data platforms: TomTom Maps (v1, production) and
        Orbis Maps (v2/v3, preview). Choose the right platform and learn how to migrate.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {PLATFORM_CARDS.map(({ id, title, version, vColor, desc, icon }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'routing-api')}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                <span style={{
                  fontSize: '0.6875rem', fontWeight: 700, color: vColor,
                  background: vColor + '18', border: `1px solid ${vColor}44`,
                  borderRadius: '5px', padding: '1px 6px',
                }}>{version}</span>
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PARAMETER INDEX
   ═══════════════════════════════════════════════════════════════════════════════ */

/* v badge helper */
const V = { 1: { bg: 'rgba(34,197,94,0.1)', color: '#15803d' }, 2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' }, 3: { bg: 'rgba(251,146,60,0.1)', color: '#c2410c' } };

const PARAM_TABLE = [
  { name: 'accelerationEfficiency',        type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Efficiency of energy→kinetic conversion during acceleration. Paired with decelerationEfficiency; product ≤ 1. Requires vehicleWeight.' },
  { name: 'allowVignette',                 type: 'string[]',       dflt: '—',          v: [1,2,3], desc: 'ISO 3166-1 alpha-3 codes where vignette roads are permitted. Mutually exclusive with avoidVignette. POST body.', constraint: 'Error if both allowVignette and avoidVignette are set.' },
  { name: 'alternativeType',               type: 'string',         dflt: 'anyRoute',   v: [1],     desc: 'Quality threshold for alternative routes.', values: 'anyRoute, betterRoute', constraint: 'Requires maxAlternatives > 0.' },
  { name: 'arrivalSidePreference',         type: 'string',         dflt: 'anySide',    v: [1,2],   desc: 'Preferred side of road for arrival at each waypoint.', values: 'anySide, curbSide', constraint: 'Falls back to anySide if stop is < 2 m from the preferred side.' },
  { name: 'arriveAt',                      type: 'datetime',       dflt: '—',          v: [1,2,3], desc: 'Desired arrival time (RFC 3339). Cannot combine with departAt, minDeviationDistance, or minDeviationTime.' },
  { name: 'auxiliaryPowerInkW',            type: 'float',          dflt: '0',          v: [1,2,3], desc: 'Continuous power draw from HVAC, infotainment, and accessories in kW. Electric model only.' },
  { name: 'auxiliaryPowerInLitersPerHour', type: 'float',          dflt: '0',          v: [1,2,3], desc: 'Additional fuel consumption from accessories per hour. Combustion model only.' },
  { name: 'avoid',                         type: 'string (×n)',    dflt: '—',          v: [1,2,3], desc: 'Road or feature types to exclude. Repeatable param.', values: 'tollRoads, motorways, ferries, unpavedRoads, tunnels, carTrains, borderCrossings, lowEmissionZones, carpools, alreadyUsedRoads', constraint: 'motorways may time out on routes > 500 km.' },
  { name: 'avoidAreas',                    type: 'object',         dflt: '—',          v: [1,2,3], desc: 'Rectangular exclusion zones. Max 10, each up to ~160×160 km. POST body.', constraint: 'Latitudes −80 to +80. Cannot cross 180th meridian.' },
  { name: 'avoidVignette',                 type: 'string[]',       dflt: '—',          v: [1,2,3], desc: 'ISO 3166-1 alpha-3 codes whose vignette roads to avoid. POST body.', constraint: 'Mutually exclusive with allowVignette.' },
  { name: 'computeBestOrder',              type: 'boolean',        dflt: 'false',      v: [1,2,3], desc: 'Optimise waypoint visit order (TSP). Returns optimizedWaypoints[] in the response.', constraint: 'Cannot combine with maxAlternatives > 0 or circle waypoints.' },
  { name: 'computeTravelTimeFor',          type: 'string',         dflt: 'none',       v: [1,2],   desc: 'Include travel time variants in the response.', values: 'none, all', constraint: 'all returns noTraffic, historicTraffic, and liveTrafficIncidents times.' },
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', type: 'colon pairs', dflt: '—', v: [1,2,3], desc: '1–25 speed:kWh/100km pairs defining the EV consumption curve.', constraint: 'Required for electric model. No duplicate speeds.' },
  { name: 'constantSpeedConsumptionInLitersPerHundredkm', type: 'colon pairs', dflt: '—', v: [1,2,3], desc: '1–25 speed:L/100km pairs defining the combustion consumption curve.', constraint: 'Required for combustion model. No duplicate speeds.' },
  { name: 'consumptionInkWhPerkmAltitudeGain', type: 'float',      dflt: '—',          v: [1,2,3], desc: 'kWh consumed per 1 km of altitude gain. Paired with recuperationInkWhPerkmAltitudeLoss.', constraint: 'Cannot combine with efficiency parameters.' },
  { name: 'coordinatePrecision',           type: 'string',         dflt: 'default',    v: [1],     desc: 'Decimal precision of coordinates in the response.', values: 'default (5 dp), full (7 dp)' },
  { name: 'currentChargeInkWh',            type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Current battery charge in kWh. Paired with maxChargeInkWh. Enables remainingChargeAfterArrival in response.' },
  { name: 'currentFuelInLiters',           type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Current fuel level in litres. Enables remainingFuelInLiters in response. Combustion model only.' },
  { name: 'decelerationEfficiency',        type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Efficiency of kinetic→energy recovery during braking. Paired with accelerationEfficiency; product ≤ 1.' },
  { name: 'departAt',                      type: 'datetime',       dflt: 'now',        v: [1,2,3], desc: 'Departure time (RFC 3339). Defaults to now. Cannot combine with arriveAt.' },
  { name: 'downhillEfficiency',            type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Efficiency of potential→energy conversion going downhill. Paired with uphillEfficiency; product ≤ 1.' },
  { name: 'encodedPolyline',               type: 'string',         dflt: '—',          v: [1,2,3], desc: 'Compressed polyline for route reconstruction. POST body.', constraint: 'Must specify encodedPolylinePrecision (5 or 7). Use with reconstructionMode.' },
  { name: 'fuelEnergyDensityInMJoulesPerLiter', type: 'float',     dflt: '—',          v: [1,2,3], desc: 'Fuel energy density in MJ/litre. Required when using combustion efficiency params.', constraint: 'Typical: petrol 34.2, diesel 35.8.' },
  { name: 'hilliness',                     type: 'string',         dflt: 'normal',     v: [1,2,3], desc: 'Hill preference for thrilling routes.', values: 'low, normal, high', constraint: 'Only with routeType=thrilling.' },
  { name: 'instructionsType',              type: 'string',         dflt: '—',          v: [1,2,3], desc: 'Activates turn-by-turn guidance in the response.', values: 'coded, text, tagged' },
  { name: 'key',                           type: 'string',         dflt: '—',          v: [1,2,3], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'language',                      type: 'string (IETF)',  dflt: 'en-GB',      v: [1,2,3], desc: 'Language for instruction text and street name localisation. E.g. en-GB, de-DE, fr-FR.' },
  { name: 'maxAlternatives',               type: 'integer',        dflt: '0',          v: [1,2,3], desc: 'Number of alternative routes to return (0–5).', constraint: 'Cannot combine with computeBestOrder=true.' },
  { name: 'maxChargeInkWh',                type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Total battery capacity in kWh. Paired with currentChargeInkWh.' },
  { name: 'minDeviationDistance',          type: 'integer (m)',    dflt: '—',          v: [1,2],   desc: 'Minimum deviation distance (metres) from the reference route.', constraint: 'Only with arriveAt. Cannot combine with minDeviationTime.' },
  { name: 'minDeviationTime',              type: 'integer (s)',    dflt: '—',          v: [1,2],   desc: 'Minimum deviation time (seconds) from the reference route.', constraint: 'Only with arriveAt. Cannot combine with minDeviationDistance.' },
  { name: 'reconstructionMode',            type: 'string',         dflt: 'normal',     v: [1,2,3], desc: 'How to interpret provided polyline or supportingPoints.', values: 'normal, strict, track, update', constraint: 'Only when encodedPolyline or supportingPoints is set.' },
  { name: 'recuperationInkWhPerkmAltitudeLoss', type: 'float',     dflt: '—',          v: [1,2,3], desc: 'kWh recovered per 1 km of altitude loss. Paired with consumptionInkWhPerkmAltitudeGain.', constraint: 'Cannot combine with efficiency parameters.' },
  { name: 'report',                        type: 'string',         dflt: '—',          v: [1,2,3], desc: 'Returns effectiveSettings in the response showing which values were applied.', values: 'effectiveSettings' },
  { name: 'routeRepresentation',           type: 'string',         dflt: 'polyline',   v: [1,2,3], desc: 'Polyline format returned in the response.', values: 'polyline, encodedPolyline, summaryOnly, none', constraint: 'none requires computeBestOrder=true.' },
  { name: 'routeType',                     type: 'string',         dflt: 'fastest',    v: [1,2,3], desc: 'Route optimisation objective.', values: 'fastest, shortest, eco, thrilling', constraint: 'thrilling limited to ~900 km. Use with hilliness/windingness.' },
  { name: 'sectionType',                   type: 'string (×n)',    dflt: '—',          v: [1,2,3], desc: 'Section types to include in the response. Repeatable.', values: 'travelMode, traffic, toll, tollVignette, country, motorway, tunnel, ferry, speedLimit, lowEmissionZone, carpool, roadShields, lanes, importantRoadStretch' },
  { name: 'supportingPoints',              type: 'GeoPoint[]',     dflt: '—',          v: [1,2,3], desc: 'Ordered GPS coordinates for route reconstruction. POST body. Use with reconstructionMode.' },
  { name: 'traffic',                       type: 'boolean',        dflt: 'true',       v: [1,2,3], desc: 'Use real-time and historic traffic. Historic patterns still apply when false.' },
  { name: 'travelMode',                    type: 'string',         dflt: 'car',        v: [1,2,3], desc: 'Vehicle or transport type.', values: 'car, truck, taxi, bus, van, motorcycle, bicycle, pedestrian', constraint: 'taxi, bus, van, motorcycle are BETA. bicycle/pedestrian cannot use consumption model.' },
  { name: 'uphillEfficiency',              type: 'float',          dflt: '—',          v: [1,2,3], desc: 'Efficiency of energy→potential conversion on uphill segments. Paired with downhillEfficiency; product ≤ 1.' },
  { name: 'vehicleAdrTunnelRestrictionCode', type: 'string',       dflt: '—',          v: [1,2,3], desc: 'ADR tunnel restriction code for hazmat transport.', values: 'B, C, D, E', constraint: 'Not for bicycle/pedestrian. Restricts tunnels at or above this code.' },
  { name: 'vehicleAxleWeight',             type: 'integer (kg)',   dflt: '0',          v: [1,2,3], desc: 'Weight per axle. 0 = ignore axle weight restrictions.' },
  { name: 'vehicleCommercial',             type: 'boolean',        dflt: 'false',      v: [1,2,3], desc: 'Mark as a commercial vehicle to apply relevant road restrictions.' },
  { name: 'vehicleEngineType',             type: 'string',         dflt: 'combustion', v: [1,2,3], desc: 'Engine type for consumption model selection.', values: 'combustion, electric' },
  { name: 'vehicleHasElectricTollCollectionTransponder', type: 'string', dflt: 'all', v: [1],      desc: 'ETC lane access. all = include transponder-only lanes; none = avoid them.', values: 'all, none' },
  { name: 'vehicleHeight',                 type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle height for bridge/tunnel clearance restrictions. 0 = ignore.' },
  { name: 'vehicleHeading',                type: 'integer (0–359°)', dflt: '—',        v: [1,2],   desc: 'Initial vehicle heading in degrees clockwise from true north. Helps anchor the origin to the correct road direction.' },
  { name: 'vehicleLength',                 type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle length including equipment. 0 = ignore length restrictions.' },
  { name: 'vehicleLoadType',               type: 'string (×n)',    dflt: '—',          v: [1,2,3], desc: 'Hazardous cargo classification.', values: 'USHazmatClass1–9, otherHazmatExplosive, otherHazmatGeneral, otherHazmatHarmfulToWater', constraint: 'Not for bicycle/pedestrian.' },
  { name: 'vehicleMaxSpeed',               type: 'integer (km/h)', dflt: '0',          v: [1,2,3], desc: 'Maximum vehicle speed. 0 = auto from road data. Range: 0–250.' },
  { name: 'vehicleNumberOfAxles',          type: 'integer',        dflt: '0',          v: [1,2,3], desc: 'Total axle count. 0 = ignore axle-count road restrictions.' },
  { name: 'vehicleWeight',                 type: 'integer (kg)',   dflt: '0',          v: [1,2,3], desc: 'Total vehicle weight. 0 = ignore weight restrictions. Must be > 0 when using efficiency parameters.' },
  { name: 'vehicleWidth',                  type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle width. 0 = ignore width restrictions.' },
  { name: 'windingness',                   type: 'string',         dflt: 'normal',     v: [1,2,3], desc: 'Winding road preference for thrilling routes.', values: 'low, normal, high', constraint: 'Only with routeType=thrilling.' },
];

export function RoutingParamIndex({ onNavigate }) {
  const thStyle = {
    padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.6875rem',
    fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', borderBottom: '2px solid var(--border)',
    background: 'var(--s1)',
  };
  const vBadge = {
    fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px',
    borderRadius: 4, fontFamily: 'var(--font-mono)',
  };

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Parameter Index</h1>
        <PageActions pageId="routing-params-ref" pageTitle="Routing API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Routing API request parameters in one place — type, default, version availability,
        and key constraints. For full code examples see the endpoint reference pages.
      </p>

      <div className="zone">
        <h2 className="sh" id="all-params">Common parameters (A–Z)</h2>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 220 }}>Parameter</th>
                <th style={{ ...thStyle, minWidth: 110 }}>Type</th>
                <th style={{ ...thStyle, minWidth: 80 }}>Default</th>
                <th style={{ ...thStyle, minWidth: 90 }}>Versions</th>
                <th style={{ ...thStyle }}>Description &amp; constraints</th>
              </tr>
            </thead>
            <tbody>
              {PARAM_TABLE.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{p.name}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{p.dflt}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {p.v.map(n => (
                        <span key={n} style={{ ...vBadge, background: V[n].bg, color: V[n].color }}>v{n}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top', color: 'var(--text)', lineHeight: 1.5 }}>
                    {p.desc}
                    {p.values && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)' }}>
                        Values: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--mid)', fontSize: '0.75rem' }}>{p.values}</code>
                      </div>
                    )}
                    {p.constraint && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>{p.constraint}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="zone">
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route (v1)</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-response-ref', 'routing-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-error-codes', 'routing-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   RESPONSE SCHEMA
   ═══════════════════════════════════════════════════════════════════════════════ */

export function RoutingResponseRef({ onNavigate }) {
  const tree = [
    { key: 'formatVersion', type: 'string', desc: 'API format version. Currently "0.0.12".' },
    { key: 'copyright',     type: 'string', desc: 'TomTom copyright notice. Required to display in map applications.' },
    { key: 'privacy',       type: 'string', desc: 'Link to the TomTom privacy policy.' },
    {
      key: 'routes[]', type: 'Route[]',
      desc: 'Array of route objects. Index 0 is the primary route. Additional entries are alternatives when maxAlternatives > 0.',
      children: [
        {
          key: 'summary', type: 'RouteSummary',
          desc: 'Aggregate statistics for the full route.',
          children: [
            { key: 'lengthInMeters',                          type: 'integer',          desc: 'Total route distance in metres.' },
            { key: 'travelTimeInSeconds',                     type: 'integer',          desc: 'Total travel time including real-time traffic.' },
            { key: 'trafficDelayInSeconds',                   type: 'integer',          desc: 'Delay caused by traffic vs free-flow speed.' },
            { key: 'trafficLengthInMeters',                   type: 'integer',          desc: 'Length of route segments affected by traffic incidents.' },
            { key: 'departureTime',                           type: 'string (RFC 3339)', desc: 'Actual departure time used for calculation, with timezone offset.' },
            { key: 'arrivalTime',                             type: 'string (RFC 3339)', desc: 'Estimated arrival time, with timezone offset.' },
            { key: 'noTrafficTravelTimeInSeconds',            type: 'integer',          desc: 'Travel time assuming zero traffic. Only when computeTravelTimeFor=all.' },
            { key: 'historicTrafficTravelTimeInSeconds',      type: 'integer',          desc: 'Travel time using historic traffic patterns only. Only when computeTravelTimeFor=all.' },
            { key: 'liveTrafficIncidentsTravelTimeInSeconds', type: 'integer',          desc: 'Travel time using live incidents only. Only when computeTravelTimeFor=all.' },
            { key: 'fuelConsumptionInLiters',                 type: 'float',            desc: 'Total fuel consumed. Only when vehicleEngineType=combustion and a consumption model is set.' },
            { key: 'batteryConsumptionInkWh',                 type: 'float',            desc: 'Net battery energy consumed. Negative = net recuperation. Only when vehicleEngineType=electric.' },
            { key: 'remainingFuelInLiters',                   type: 'float',            desc: 'Estimated fuel remaining on arrival. Only when currentFuelInLiters is set.' },
            { key: 'remainingChargeAfterArrivalInkWh',        type: 'float',            desc: 'Estimated battery charge on arrival. Only when currentChargeInkWh is set.' },
            { key: 'deviationDistance',                       type: 'integer',          desc: 'Deviation in metres from the reference route. Only when minDeviationDistance is set with arriveAt.' },
            { key: 'deviationTime',                           type: 'integer',          desc: 'Deviation in seconds from the reference route. Only when minDeviationTime is set with arriveAt.' },
          ],
        },
        {
          key: 'legs[]', type: 'Leg[]',
          desc: 'One leg per consecutive waypoint pair. Each leg has its own summary and polyline.',
          children: [
            { key: 'summary', type: 'LegSummary', desc: 'Same fields as the route summary — travel time, distance, and traffic for this leg only.' },
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
          desc: 'Typed route segments referencing point indices into legs[0].points. Populated when sectionType query param is set.',
          children: [
            { key: 'startPointIndex',     type: 'integer',       desc: 'Index into legs[0].points where this section starts.' },
            { key: 'endPointIndex',       type: 'integer',       desc: 'Index into legs[0].points where this section ends.' },
            { key: 'sectionType',         type: 'string',        desc: 'Type identifier. Determines which additional fields are present on the section object.' },
            { key: 'travelMode',          type: 'string',        desc: 'TRAVEL_MODE sections only. The mode of travel for this segment.' },
            { key: 'simpleCategory',      type: 'string',        desc: 'TRAFFIC sections only. E.g. JAM, ROAD_WORK, CLOSED, ROAD_WORKS, LANE_CLOSED.' },
            { key: 'effectiveSpeedInKmh', type: 'integer',       desc: 'TRAFFIC sections only. Actual traffic speed on the segment.' },
            { key: 'delayInSeconds',      type: 'integer',       desc: 'TRAFFIC sections only. Delay vs free-flow on this segment.' },
            { key: 'magnitudeOfDelay',    type: 'integer (0–4)', desc: 'TRAFFIC sections only. 0 = unknown, 1 = minor, 2 = moderate, 3 = major, 4 = undefined (closures).' },
            { key: 'tollPaymentTypes[]',  type: 'string[]',      desc: 'TOLL sections only. Accepted methods: CASH, CREDIT_CARD, DEBIT_CARD, ETC_TRANSPONDER, ETC2_TRANSPONDER, SUBSCRIPTION, FREE, PAY_BY_PLATE, TAG.' },
            { key: 'maxSpeedLimitInKmh',  type: 'integer',       desc: 'SPEED_LIMIT sections only. Legal speed limit for this segment.' },
            { key: 'countryCode',         type: 'string',        desc: 'COUNTRY sections only. ISO 3166-1 alpha-3 country code.' },
            {
              key: 'roadShieldReferences[]', type: 'RoadShieldRef[]',
              desc: 'ROAD_SHIELDS sections only. References into the shieldContent atlas.',
              children: [
                { key: 'reference',     type: 'integer', desc: 'Index into the shieldContent array included in the response.' },
                { key: 'shieldContent', type: 'object',  desc: 'Road number, shield category (MOTORWAY, NATIONAL_ROAD, etc.), and affixes.' },
              ],
            },
            {
              key: 'lanes[]', type: 'Lane[]',
              desc: 'LANES sections only. Per-lane directional data at this point.',
              children: [
                { key: 'indications[]', type: 'string[]', desc: 'Permitted directions from this lane: straight, left, right, sharpLeft, sharpRight, slightLeft, slightRight, uTurnLeft, uTurnRight.' },
                { key: 'isActive',      type: 'boolean',  desc: 'Whether this lane keeps you on the current route.' },
              ],
            },
          ],
        },
        {
          key: 'guidance', type: 'Guidance',
          desc: 'Turn-by-turn instruction data. Only populated when instructionsType is set.',
          children: [
            {
              key: 'instructions[]', type: 'Instruction[]',
              desc: 'Ordered list of manoeuvre events from departure to arrival.',
              children: [
                { key: 'routeOffsetInMeters',       type: 'integer',  desc: 'Distance from the route start to this instruction.' },
                { key: 'travelTimeInSeconds',        type: 'integer',  desc: 'Cumulative travel time from departure to this instruction.' },
                { key: 'point',                      type: 'GeoPoint', desc: 'Location of the manoeuvre { latitude, longitude }.' },
                { key: 'instructionType',            type: 'string',   desc: 'Event type: TURN, ROUNDABOUT_ENTER, ROUNDABOUT_EXIT, ROUNDABOUT_PASS, MOTORWAY_ENTER_EXIT, WAYPOINT_REACHED, WAYPOINT_LEFT, ARRIVE, DEPART, ROAD_NAME_CHANGE, FOLLOW.' },
                { key: 'street',                     type: 'string',   desc: 'Street name at the manoeuvre point.' },
                { key: 'roadNumbers[]',              type: 'string[]', desc: 'Road identifiers at the manoeuvre point, e.g. A9, B2.' },
                { key: 'exitNumber',                 type: 'string',   desc: 'Motorway or roundabout exit number.' },
                { key: 'junctionType',               type: 'string',   desc: 'REGULAR, ROUNDABOUT, or BIFURCATION.' },
                { key: 'turnAngleInDecimalDegrees',  type: 'integer',  desc: 'Turn angle in degrees (−180 to +180). Negative = left, positive = right.' },
                { key: 'roundaboutExitNumber',       type: 'integer',  desc: 'Exit number to take at a roundabout. ROUNDABOUT_EXIT instructions only.' },
                { key: 'drivingSide',                type: 'string',   desc: 'Prevailing driving side: LEFT or RIGHT.' },
                { key: 'maneuver',                   type: 'string',   desc: 'Coded manoeuvre: ARRIVE, DEPART, STRAIGHT, TURN_LEFT, TURN_RIGHT, KEEP_LEFT, KEEP_RIGHT, SHARP_LEFT, SHARP_RIGHT, U_TURN_LEFT, ROUNDABOUT_EXIT_N (N = exit number), etc.' },
                { key: 'message',                    type: 'string',   desc: 'Plain-text instruction. Populated when instructionsType=text. E.g. "Turn right onto Kurfürstendamm".' },
                { key: 'combinedMessage',            type: 'string',   desc: 'Combined instruction merging this step and the next. instructionsType=text only.' },
              ],
            },
            {
              key: 'instructionGroups[]', type: 'InstructionGroup[]',
              desc: 'Bundles consecutive instructions for compact HUD display, e.g. "Keep right then turn left".',
              children: [
                { key: 'firstInstructionIndex', type: 'integer', desc: 'Index of the first instruction in this group.' },
                { key: 'lastInstructionIndex',  type: 'integer', desc: 'Index of the last instruction in this group.' },
                { key: 'groupMessage',          type: 'string',  desc: 'Combined text for the grouped instructions.' },
                { key: 'groupLengthInMeters',   type: 'integer', desc: 'Total road length covered by this instruction group.' },
              ],
            },
          ],
        },
        {
          key: 'optimizedWaypoints[]', type: 'WaypointOrder[]',
          desc: 'Reordered waypoint mapping when computeBestOrder=true. The route itself already reflects the optimised sequence.',
          children: [
            { key: 'providedIndex',   type: 'integer', desc: 'Original 0-based index of the waypoint as given in the request.' },
            { key: 'optimizedIndex',  type: 'integer', desc: 'Position in the optimised visit sequence.' },
          ],
        },
      ],
    },
    {
      key: 'effectiveSettings', type: 'object',
      desc: 'Parameter values actually applied by the server. Only returned when report=effectiveSettings is set. Use this to debug parameter interactions and confirm which values were used.',
      children: [
        { key: 'routeType',  type: 'string', desc: 'Effective route optimisation objective.' },
        { key: 'travelMode', type: 'string', desc: 'Effective travel mode — may differ from requested if not available for the full route.' },
      ],
    },
    {
      key: 'warnings[]', type: 'Warning[]',
      desc: 'Non-fatal issues. The route was calculated but one or more parameters were silently adjusted or ignored. Always check this during development — ignored parameters do not cause a 400 error.',
      children: [
        { key: 'code',     type: 'string',   desc: 'Warning identifier. E.g. vehicleParameterNotConsidered.' },
        { key: 'text',     type: 'string',   desc: 'Human-readable description of what was adjusted and why.' },
        { key: 'fields[]', type: 'string[]', desc: 'Names of the parameters that triggered the warning.' },
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
        <PageActions pageId="routing-response-ref" pageTitle="Routing API Response Schema" />
      </div>
      <p className="quick-answer">
        Every Calculate Route response follows the same top-level structure. This page
        describes the full object hierarchy, key fields, and conditional fields.
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
        <h2 className="sh" id="next-steps">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-params-ref', 'routing-api')}>Parameter Index</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-error-codes', 'routing-api')}>Error Codes</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route (v1)</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ERROR CODES
   ═══════════════════════════════════════════════════════════════════════════════ */

const ERRORS = [
  {
    status: 400, code: '400-1', title: 'Bad request',
    desc: 'One or more request parameters are invalid or missing.',
    resolution: 'Check parameter spelling, types, and required combinations. Enable report=effectiveSettings to see applied values.',
  },
  {
    status: 400, code: '400-2', title: 'Invalid waypoints',
    desc: 'Waypoints are malformed, out of range, or fewer than 2.',
    resolution: 'Ensure lat/lon are valid WGS84 coordinates (lat: −90 to +90, lon: −180 to +180). Minimum 2 waypoints required.',
  },
  {
    status: 400, code: '400-5', title: 'Unreachable destination',
    desc: 'No route can be found between the given waypoints.',
    resolution: 'Check that both origin and destination are on routable roads. For EV routing, verify the destination is within battery range.',
  },
  {
    status: 403, code: '403-1', title: 'Forbidden — invalid key',
    desc: 'The API key is missing, invalid, or does not have access to the Routing API.',
    resolution: 'Verify the key in the TomTom Developer Portal. Ensure Routing API is enabled for the application.',
  },
  {
    status: 403, code: '403-3', title: 'Forbidden — private preview',
    desc: 'The API key does not have access to the v3 private preview endpoint.',
    resolution: 'Request private preview access from TomTom. Only approved accounts can access /maps/orbis/routing/v3/.',
  },
  {
    status: 404, code: '404-1', title: 'Resource not found',
    desc: 'The endpoint URL is incorrect.',
    resolution: 'Check the base URL and version number. v1: /routing/1/. v2: /routing/2/. v3: /maps/orbis/routing/v3/.',
  },
  {
    status: 429, code: '429-1', title: 'Rate limit exceeded',
    desc: 'The request rate for this API key has exceeded the plan limit.',
    resolution: 'Implement exponential backoff. Review your usage in the Developer Portal. Contact TomTom to increase limits.',
  },
  {
    status: 500, code: '500-1', title: 'Internal server error',
    desc: 'An unexpected server-side error occurred.',
    resolution: 'Retry with exponential backoff. If the error persists, contact TomTom support with the error details and request ID.',
  },
];

const STATUS_COLORS = { 400: '#fb923c', 403: '#f87171', 404: '#a78bfa', 429: '#facc15', 500: '#f87171' };

export function RoutingErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Error Codes</h1>
        <PageActions pageId="routing-error-codes" pageTitle="Routing API Error Codes" />
      </div>
      <p className="quick-answer">
        The Routing API uses standard HTTP status codes with structured error responses.
        Each error includes a detailCode that pinpoints the cause.
      </p>

      <div className="zone">
        <h2 className="sh" id="error-table">Error reference</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {ERRORS.map(({ status, code, title, desc, resolution }) => (
            <div key={code} style={{
              padding: '0.875rem 1rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '14px',
              display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0.875rem',
              alignItems: 'start',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: '2px 8px',
                  background: (STATUS_COLORS[status] || 'var(--mid)') + '22',
                  border: `1px solid ${STATUS_COLORS[status] || 'var(--mid)'}55`,
                  borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                  color: STATUS_COLORS[status] || 'var(--mid)',
                }}>{status}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{code}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: '0.375rem' }}>{desc}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--mid)' }}>Resolution: </strong>{resolution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">See also</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-response-ref', 'routing-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-params-ref', 'routing-api')}>Parameter Index</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MARKET COVERAGE
   ═══════════════════════════════════════════════════════════════════════════════ */

const tdStyle   = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle   = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft    = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';
const STAR  = '★';

const COVERAGE_HEADERS = ['Market', 'Country codes', 'Calculate Route & Reachable Range', 'Real-time Traffic'];

const COVERAGE_AMERICAS = [
  ['Anguilla', 'AI/AIA', CHECK, '—'],
  ['Antigua & Barbuda', 'AG/ATG', CHECK, '—'],
  ['Argentina', 'AR/ARG', CHECK, CHECK],
  ['Aruba', 'AW/ABW', CHECK, '—'],
  ['Bahamas', 'BS/BHS', CHECK, '—'],
  ['Barbados', 'BB/BRB', CHECK, '—'],
  ['Belize', 'BZ/BLZ', CHECK, '—'],
  ['Bermuda', 'BM/BMU', CHECK, '—'],
  ['Bolivia', 'BO/BOL', CHECK, '—'],
  ['Bouvet Island', 'BV/BVT', CHECK, '—'],
  ['Brazil', 'BR/BRA', CHECK, CHECK],
  ['British Virgin Islands', 'VG/VGB', CHECK, '—'],
  ['Canada', 'CA/CAN', CHECK, CHECK],
  ['Caribbean Netherlands', 'BQ/BES', CHECK, '—'],
  ['Cayman Islands', 'KY/CYM', CHECK, '—'],
  ['Chile', 'CL/CHL', CHECK, CHECK],
  ['Colombia', 'CO/COL', CHECK, CHECK],
  ['Costa Rica', 'CR/CRI', CHECK, '—'],
  ['Cuba', 'CU/CUB', CHECK, '—'],
  ['Curaçao', 'CW/CUW', CHECK, '—'],
  ['Dominica', 'DM/DMA', CHECK, '—'],
  ['Dominican Republic', 'DO/DOM', CHECK, '—'],
  ['Ecuador', 'EC/ECU', CHECK, '—'],
  ['El Salvador', 'SV/SLV', CHECK, '—'],
  ['Falkland Islands', 'FK/FLK', CHECK, '—'],
  ['French Guiana', 'GF/GUF', CHECK, '—'],
  ['Grenada', 'GD/GRD', CHECK, '—'],
  ['Guadeloupe', 'GP/GLP', CHECK, CHECK],
  ['Guatemala', 'GT/GTM', CHECK, '—'],
  ['Guyana', 'GY/GUY', CHECK, '—'],
  ['Haiti', 'HT/HTI', CHECK, '—'],
  ['Honduras', 'HN/HND', CHECK, '—'],
  ['Jamaica', 'JM/JAM', CHECK, '—'],
  ['Martinique', 'MQ/MTQ', CHECK, CHECK],
  ['Mexico', 'MX/MEX', CHECK, CHECK],
  ['Montserrat', 'MS/MSR', CHECK, '—'],
  ['Nicaragua', 'NI/NIC', CHECK, '—'],
  ['Panama', 'PA/PAN', CHECK, '—'],
  ['Paraguay', 'PY/PRY', CHECK, '—'],
  ['Peru', 'PE/PER', CHECK, CHECK],
  ['Puerto Rico', 'PR/PRI', CHECK, CHECK],
  ['Sint Maarten', 'SX/SXM', CHECK, '—'],
  ['South Georgia & South Sandwich Islands', 'GS/SGS', CHECK, '—'],
  ['St. Barthélemy', 'BL/BLM', CHECK, '—'],
  ['St. Kitts & Nevis', 'KN/KNA', CHECK, '—'],
  ['St. Lucia', 'LC/LCA', CHECK, '—'],
  ['St. Martin', 'MF/MAF', CHECK, '—'],
  ['St. Pierre & Miquelon', 'PM/SPM', CHECK, '—'],
  ['St. Vincent & Grenadines', 'VC/VCT', CHECK, '—'],
  ['Suriname', 'SR/SUR', CHECK, '—'],
  ['Trinidad & Tobago', 'TT/TTO', CHECK, '—'],
  ['Turks & Caicos Islands', 'TC/TCA', CHECK, '—'],
  ['U.S. Virgin Islands', 'VI/VIR', CHECK, CHECK],
  ['United States', 'US/USA', CHECK, CHECK],
  ['Uruguay', 'UY/URY', CHECK, CHECK],
  ['Venezuela', 'VE/VEN', CHECK, '—'],
];

const COVERAGE_ASIA_PACIFIC = [
  ['Afghanistan', 'AF/AFG', CHECK, '—'],
  ['American Samoa', 'AS/ASM', CHECK, '—'],
  ['Australia', 'AU/AUS', CHECK, CHECK],
  ['Bangladesh', 'BD/BGD', CHECK, '—'],
  ['Bhutan', 'BT/BTN', CHECK, '—'],
  ['Brunei', 'BN/BRN', CHECK, CHECK],
  ['Cambodia', 'KH/KHM', CHECK, '—'],
  ['Christmas Island', 'CX/CXR', CHECK, '—'],
  ['Cocos (Keeling) Islands', 'CC/CCK', CHECK, '—'],
  ['Comoros', 'KM/COM', CHECK, '—'],
  ['Cook Islands', 'CK/COK', CHECK, '—'],
  ['Fiji', 'FJ/FJI', CHECK, '—'],
  ['French Polynesia', 'PF/PYF', CHECK, '—'],
  ['French Southern Territories', 'TF/ATF', CHECK, '—'],
  ['Guam', 'GU/GUM', CHECK, CHECK],
  ['Hong Kong SAR China', 'HK/HKG', CHECK, CHECK],
  ['India', 'IN/IND', CHECK, CHECK],
  ['Indonesia', 'ID/IDN', CHECK, CHECK],
  ['Kazakhstan', 'KZ/KAZ', CHECK, CHECK],
  ['Kiribati', 'KI/KIR', CHECK, '—'],
  ['Kyrgyzstan', 'KG/KGZ', CHECK, '—'],
  ['Laos', 'LA/LAO', CHECK, '—'],
  ['Macao SAR China', 'MO/MAC', CHECK, CHECK],
  ['Malaysia', 'MY/MYS', CHECK, CHECK],
  ['Maldives', 'MV/MDV', CHECK, '—'],
  ['Marshall Islands', 'MH/MHL', CHECK, '—'],
  ['Micronesia', 'FM/FSM', CHECK, '—'],
  ['Mongolia', 'MN/MNG', CHECK, '—'],
  ['Myanmar (Burma)', 'MM/MMR', CHECK, '—'],
  ['Nauru', 'NR/NRU', CHECK, '—'],
  ['Nepal', 'NP/NPL', CHECK, '—'],
  ['New Caledonia', 'NC/NCL', CHECK, '—'],
  ['New Zealand', 'NZ/NZL', CHECK, CHECK],
  ['Niue', 'NU/NIU', CHECK, '—'],
  ['Norfolk Island', 'NF/NFK', CHECK, '—'],
  ['Northern Mariana Islands', 'MP/MNP', CHECK, '—'],
  ['Pakistan', 'PK/PAK', CHECK, '—'],
  ['Palau', 'PW/PLW', CHECK, '—'],
  ['Papua New Guinea', 'PG/PNG', CHECK, '—'],
  ['Philippines', 'PH/PHL', CHECK, CHECK],
  ['Pitcairn Islands', 'PN/PCN', CHECK, '—'],
  ['Samoa', 'WS/WSM', CHECK, '—'],
  ['Singapore', 'SG/SGP', CHECK, CHECK],
  ['Solomon Islands', 'SB/SLB', CHECK, '—'],
  ['South Korea', 'KR/KOR', STAR, STAR],
  ['Sri Lanka', 'LK/LKA', CHECK, '—'],
  ['Taiwan', 'TW/TWN', CHECK, CHECK],
  ['Tajikistan', 'TJ/TJK', CHECK, '—'],
  ['Thailand', 'TH/THA', CHECK, CHECK],
  ['Timor-Leste', 'TL/TLS', CHECK, '—'],
  ['Tokelau', 'TK/TKL', CHECK, '—'],
  ['Tonga', 'TO/TON', CHECK, '—'],
  ['Turkmenistan', 'TM/TKM', CHECK, '—'],
  ['Tuvalu', 'TV/TUV', CHECK, '—'],
  ['Uzbekistan', 'UZ/UZB', CHECK, '—'],
  ['Vanuatu', 'VU/VUT', CHECK, '—'],
  ['Vietnam', 'VN/VNM', CHECK, CHECK],
  ['Wallis & Futuna', 'WF/WLF', CHECK, '—'],
];

const COVERAGE_EUROPE = [
  ['Albania', 'AL/ALB', CHECK, '—'],
  ['Andorra', 'AD/AND', CHECK, CHECK],
  ['Armenia', 'AM/ARM', CHECK, '—'],
  ['Austria', 'AT/AUT', CHECK, CHECK],
  ['Azerbaijan', 'AZ/AZE', CHECK, '—'],
  ['Belarus', 'BY/BLR', CHECK, CHECK],
  ['Belgium', 'BE/BEL', CHECK, CHECK],
  ['Bosnia & Herzegovina', 'BA/BIH', CHECK, CHECK],
  ['Bulgaria', 'BG/BGR', CHECK, CHECK],
  ['Croatia', 'HR/HRV', CHECK, CHECK],
  ['Cyprus', 'CY/CYP', CHECK, CHECK],
  ['Czechia', 'CZ/CZE', CHECK, CHECK],
  ['Denmark', 'DK/DNK', CHECK, CHECK],
  ['Estonia', 'EE/EST', CHECK, CHECK],
  ['Faroe Islands', 'FO/FRO', CHECK, '—'],
  ['Finland', 'FI/FIN', CHECK, CHECK],
  ['France', 'FR/FRA', CHECK, CHECK],
  ['Georgia', 'GE/GEO', CHECK, '—'],
  ['Germany', 'DE/DEU', CHECK, CHECK],
  ['Gibraltar', 'GI/GIB', CHECK, CHECK],
  ['Greece', 'GR/GRC', CHECK, CHECK],
  ['Greenland', 'GL/GRL', CHECK, '—'],
  ['Guernsey', 'GG/GGY', CHECK, CHECK],
  ['Hungary', 'HU/HUN', CHECK, CHECK],
  ['Iceland', 'IS/ISL', CHECK, CHECK],
  ['Ireland', 'IE/IRL', CHECK, CHECK],
  ['Isle of Man', 'IM/IMN', CHECK, CHECK],
  ['Italy', 'IT/ITA', CHECK, CHECK],
  ['Jersey', 'JE/JEY', CHECK, CHECK],
  ['Latvia', 'LV/LVA', CHECK, CHECK],
  ['Liechtenstein', 'LI/LIE', CHECK, CHECK],
  ['Lithuania', 'LT/LTU', CHECK, CHECK],
  ['Luxembourg', 'LU/LUX', CHECK, CHECK],
  ['Malta', 'MT/MLT', CHECK, CHECK],
  ['Moldova', 'MD/MDA', CHECK, '—'],
  ['Monaco', 'MC/MCO', CHECK, CHECK],
  ['Montenegro', 'ME/MNE', CHECK, '—'],
  ['Netherlands', 'NL/NLD', CHECK, CHECK],
  ['North Macedonia', 'MK/MKD', CHECK, '—'],
  ['Norway', 'NO/NOR', CHECK, CHECK],
  ['Poland', 'PL/POL', CHECK, CHECK],
  ['Portugal', 'PT/PRT', CHECK, CHECK],
  ['Romania', 'RO/ROU', CHECK, CHECK],
  ['Russia', 'RU/RUS', CHECK, CHECK],
  ['San Marino', 'SM/SMR', CHECK, CHECK],
  ['Serbia', 'RS/SRB', CHECK, CHECK],
  ['Slovakia', 'SK/SVK', CHECK, CHECK],
  ['Slovenia', 'SI/SVN', CHECK, CHECK],
  ['Spain', 'ES/ESP', CHECK, CHECK],
  ['Sweden', 'SE/SWE', CHECK, CHECK],
  ['Switzerland', 'CH/CHE', CHECK, CHECK],
  ['Türkiye', 'TR/TUR', CHECK, CHECK],
  ['Ukraine', 'UA/UKR', CHECK, CHECK],
  ['United Kingdom', 'GB/GBR', CHECK, CHECK],
  ['Vatican City', 'VA/VAT', CHECK, '—'],
];

const COVERAGE_MEA = [
  ['Algeria', 'DZ/DZA', CHECK, '—'],
  ['Angola', 'AO/AGO', CHECK, '—'],
  ['Bahrain', 'BH/BHR', CHECK, CHECK],
  ['Benin', 'BJ/BEN', CHECK, '—'],
  ['Botswana', 'BW/BWA', CHECK, '—'],
  ['Burkina Faso', 'BF/BFA', CHECK, '—'],
  ['Burundi', 'BI/BDI', CHECK, '—'],
  ['Cameroon', 'CM/CMR', CHECK, '—'],
  ['Cape Verde', 'CV/CPV', CHECK, '—'],
  ['Central African Republic', 'CF/CAF', CHECK, '—'],
  ['Chad', 'TD/TCD', CHECK, '—'],
  ['Congo - Brazzaville', 'CG/COG', CHECK, '—'],
  ['Congo - Kinshasa', 'CD/COD', CHECK, '—'],
  ["Côte d'Ivoire", 'CI/CIV', CHECK, '—'],
  ['Djibouti', 'DJ/DJI', CHECK, '—'],
  ['Egypt', 'EG/EGY', CHECK, CHECK],
  ['Equatorial Guinea', 'GQ/GNQ', CHECK, '—'],
  ['Eritrea', 'ER/ERI', CHECK, '—'],
  ['Eswatini', 'SZ/SWZ', CHECK, '—'],
  ['Ethiopia', 'ET/ETH', CHECK, '—'],
  ['Gabon', 'GA/GAB', CHECK, '—'],
  ['Gambia', 'GM/GMB', CHECK, '—'],
  ['Ghana', 'GH/GHA', CHECK, '—'],
  ['Guinea', 'GN/GIN', CHECK, '—'],
  ['Guinea-Bissau', 'GW/GNB', CHECK, '—'],
  ['Iran', 'IR/IRN', CHECK, '—'],
  ['Iraq', 'IQ/IRQ', CHECK, '—'],
  ['Israel', 'IL/ISR', CHECK, CHECK],
  ['Jordan', 'JO/JOR', CHECK, '—'],
  ['Kenya', 'KE/KEN', CHECK, CHECK],
  ['Kuwait', 'KW/KWT', CHECK, CHECK],
  ['Lebanon', 'LB/LBN', CHECK, '—'],
  ['Lesotho', 'LS/LSO', CHECK, CHECK],
  ['Liberia', 'LR/LBR', CHECK, '—'],
  ['Libya', 'LY/LBY', CHECK, '—'],
  ['Madagascar', 'MG/MDG', CHECK, '—'],
  ['Malawi', 'MW/MWI', CHECK, '—'],
  ['Mali', 'ML/MLI', CHECK, '—'],
  ['Mauritania', 'MR/MRT', CHECK, '—'],
  ['Mauritius', 'MU/MUS', CHECK, '—'],
  ['Mayotte', 'YT/MYT', CHECK, '—'],
  ['Morocco', 'MA/MAR', CHECK, CHECK],
  ['Mozambique', 'MZ/MOZ', CHECK, CHECK],
  ['Namibia', 'NA/NAM', CHECK, '—'],
  ['Niger', 'NE/NER', CHECK, '—'],
  ['Nigeria', 'NG/NGA', CHECK, CHECK],
  ['Oman', 'OM/OMN', CHECK, CHECK],
  ['Qatar', 'QA/QAT', CHECK, CHECK],
  ['Rwanda', 'RW/RWA', CHECK, '—'],
  ['Réunion', 'RE/REU', CHECK, CHECK],
  ['Saudi Arabia', 'SA/SAU', CHECK, CHECK],
  ['Senegal', 'SN/SEN', CHECK, '—'],
  ['Seychelles', 'SC/SYC', CHECK, '—'],
  ['Sierra Leone', 'SL/SLE', CHECK, '—'],
  ['Somalia', 'SO/SOM', CHECK, '—'],
  ['South Africa', 'ZA/ZAF', CHECK, CHECK],
  ['South Sudan', 'SS/SSD', CHECK, '—'],
  ['St. Helena', 'SH/SHN', CHECK, '—'],
  ['Sudan', 'SD/SDN', CHECK, '—'],
  ['Syria', 'SY/SYR', CHECK, '—'],
  ['São Tomé & Príncipe', 'ST/STP', CHECK, '—'],
  ['Tanzania', 'TZ/TZA', CHECK, '—'],
  ['Togo', 'TG/TGO', CHECK, '—'],
  ['Tunisia', 'TN/TUN', CHECK, '—'],
  ['Uganda', 'UG/UGA', CHECK, '—'],
  ['United Arab Emirates', 'AE/ARE', CHECK, CHECK],
  ['Yemen', 'YE/YEM', CHECK, '—'],
  ['Zambia', 'ZM/ZMB', CHECK, '—'],
  ['Zimbabwe', 'ZW/ZWE', CHECK, '—'],
];

function CoverageTable({ region, id, rows }) {
  return (
    <div className="zone">
      <h2 className="sh" id={id}>{region}</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            {COVERAGE_HEADERS.map(h => (
              <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([market, code, route, traffic], i) => (
            <tr key={market} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
              <td style={tdLeft}>{market}</td>
              <td style={tdStyle}>{code}</td>
              <td style={tdStyle}>{route}</td>
              <td style={tdStyle}>{traffic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RoutingCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing API — Market Coverage</h1>
        <PageActions pageId="routing-coverage" pageTitle="Routing API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Routing API supports Calculate Route, Calculate Reachable Range, and real-time
        traffic-aware routing across a broad set of global markets. Coverage and real-time
        traffic availability vary by region. Markets not listed are not currently supported.
      </p>

      <div className="zone">
        <h2 className="sh" id="definitions">Definitions</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>{CHECK}</td>
              <td style={tdLeft}>Country is provided with data.</td>
            </tr>
            <tr>
              <td style={tdStyle}>{STAR}</td>
              <td style={tdLeft}>Country is provided with data, but under certain conditions. See the Region-specific content page for details.</td>
            </tr>
            <tr>
              <td style={tdStyle}>—</td>
              <td style={tdLeft}>Country data is not provided. Functionality may not work as expected.</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Country codes follow ISO 3166-1 alpha-2 and alpha-3 formats. If a market is missing from the
          tables below, it is not currently supported. Contact{' '}
          <a href="https://support.tomtom.com/support" style={{ color: 'var(--brand)' }}>TomTom support</a> for more information.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="coverage-legend">Coverage Columns</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left' }}>Column</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Calculate Route & Reachable Range', 'The Calculate Route service computes a route between an origin and destination (with optional waypoints). Calculate Reachable Range computes the set of locations reachable from an origin point within a given time or distance budget.'],
              ['Real-time Traffic', 'Delivers real-time information about traffic jams and road closures, and a detailed view of current speeds and travel times across the road network.'],
            ].map(([col, desc]) => (
              <tr key={col}>
                <td style={tdLeft}><strong>{col}</strong></td>
                <td style={tdLeft}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CoverageTable region="Americas"             id="americas"      rows={COVERAGE_AMERICAS} />
      <CoverageTable region="Asia Pacific"         id="asia-pacific"  rows={COVERAGE_ASIA_PACIFIC} />
      <CoverageTable region="Europe"               id="europe"        rows={COVERAGE_EUROPE} />
      <CoverageTable region="Middle East & Africa" id="mea"           rows={COVERAGE_MEA} />

      <Callout type="info" title="Full coverage data">
        The tables above reflect v1 (TomTom Maps) coverage. For the complete and up-to-date
        country-level list, refer to the{' '}
        <a href="https://developer.tomtom.com/routing-api/documentation/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>Routing API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
