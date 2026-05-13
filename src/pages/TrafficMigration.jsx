import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const MIGRATION_CHANGES_FLOW = [
  { area: 'Base path',    v1: '/traffic/map/4/tile/flow/{type}/{z}/{x}/{y}.pbf', v2: '/maps/orbis/traffic/flow/vector/tile/{z}/{x}/{y}', note: 'Update tile URL. Remove type path segment.' },
  { area: 'Versioning',   v1: 'versionNumber path param (4)', v2: 'apiVersion=2 or TomTom-Api-Version: 2', note: 'Add required versioning.' },
  { area: 'type param',   v1: 'Required path param (relative, absolute, etc.)', v2: 'Removed', note: 'Remove type from URL path.' },
  { area: 'tags param',   v1: 'tags query parameter', v2: 'Replaced by Attributes mechanism', note: 'Use Attributes / Attributes-Exclude headers instead.' },
  { area: 'roadTypes',    v1: 'roadTypes query parameter', v2: 'roadCategories attribute via Attributes', note: 'Switch to Attributes-based filtering.' },
  { area: 'Content-Type', v1: 'image/pbf', v2: 'application/vnd.mapbox-vector-tile', note: 'Update content-type handling in tile consumers.' },
];

const MIGRATION_CHANGES_INCIDENTS = [
  { area: 'Base path',          v1: '/traffic/services/5/incidentDetails', v2: '/maps/orbis/traffic/incidents/details', note: 'Update endpoint URL.' },
  { area: 'fields param',       v1: 'fields query parameter', v2: 'Attributes request header (required)', note: 'Move field selection to Attributes header.' },
  { area: 'language param',     v1: 'language query parameter', v2: 'Accept-Language header', note: 'Move language to header.' },
  { area: 'categoryFilter',     v1: 'categoryFilter (integer codes)', v2: 'iconCategories (string values: accident, jam, etc.)', note: 'Switch to string-based category filtering.' },
  { area: 'timeValidityFilter', v1: 'timeValidityFilter', v2: 'timeValidity', note: 'Rename parameter.' },
  { area: 'iconCategory type',  v1: 'integer', v2: 'string (accident, jam, roadWorks, etc.)', note: 'Update any integer→string category mapping.' },
  { area: 'magnitudeOfDelay',   v1: 'integer (0–4)', v2: 'string (unknown, minor, moderate, major, undefined)', note: 'Update delay magnitude handling.' },
];

const CODE_BEFORE = `# Flow vector tile (TomTom Maps)
GET https://api.tomtom.com/traffic/map/4/tile/flow/relative/12/2048/1366.pbf
    ?key={key}

# Incident details (TomTom Maps)
GET https://api.tomtom.com/traffic/services/5/incidentDetails
    ?key={key}&bbox=4.84,52.32,4.95,52.42&fields=%7Bincidents%7Btype,geometry,properties%7D%7D`;

const CODE_AFTER = `# Flow vector tile (Orbis v2)
GET https://api.tomtom.com/maps/orbis/traffic/flow/vector/tile/12/2048/1366
    ?key={key}&apiVersion=2
Headers:
  Attributes: *,tags(relative_speed,road_category)

# Incident details (Orbis v2)
GET https://api.tomtom.com/maps/orbis/traffic/incidents/details
    ?key={key}&apiVersion=2&bbox=4.84,52.32,4.95,52.42
Headers:
  Attributes: incidents`;

export default function TrafficMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API — Migration Guide</h1>
        <PageActions pageId="traffic-migration" pageTitle="Traffic API — Migration Guide" />
      </div>

      <p className="quick-answer">
        Migrating to Traffic API Orbis v2 requires updating endpoint URLs, moving field/tag
        selection to the new Attributes header mechanism, and updating category/delay values
        from integers to descriptive strings.
      </p>

      <Callout type="warn" title="Private Preview">
        Traffic API Orbis v2 is in Private Preview for testing purposes only.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="general-changes">General changes</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Authentication</strong> — API key moves to the <code>TomTom-Api-Key</code> request header.</li>
          <li><strong>Attributes mechanism</strong> — replaces the <code>tags</code>, <code>fields</code>, and <code>roadTypes</code> query parameters. Use the <code>Attributes</code> request header to specify which fields or tags to include.</li>
          <li><strong>Error format</strong> — new unified error body: <code>{'{ detailedError: { code, message } }'}</code>.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="flow-vector-tiles">Flow vector tiles</h2>
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
          {MIGRATION_CHANGES_FLOW.map(({ area, v1, v2, note }) => (
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
        <h2 className="sh" id="incident-details">Incident details</h2>
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
          {MIGRATION_CHANGES_INCIDENTS.map(({ area, v1, v2, note }) => (
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

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Before (TomTom Maps):</p>
        <CodeBlock code={CODE_BEFORE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (Orbis v2):</p>
        <CodeBlock code={CODE_AFTER} language="bash" />
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-flow-tiles', 'traffic-api')}>Flow Tiles</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-tomtom-maps', 'traffic-api')}>TomTom Maps v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-orbis-maps', 'traffic-api')}>Orbis Maps v2</button>
        </div>
      </div>
    </div>
  );
}
