import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const MIGRATION_CHANGES_GENERAL = [
  { area: 'API key',     v1: 'key query parameter', v2: 'TomTom-Api-Key header (recommended)', note: 'Move API key to header for security.' },
  { area: 'Error format', v1: 'Various formats', v2: '{ "detailedError": { "code": "...", "message": "..." } }', note: 'Update error handling to check detailedError.code.' },
];

const MIGRATION_CHANGES_VECTOR = [
  { area: 'Base path',   v1: '/map/1/tile/{layer}/{style}/{z}/{X}/{Y}.pbf', v2: '/maps/orbis/display/vector/tile/{z}/{X}/{Y}', note: 'Remove layer and style from path. Update URL structure.' },
  { area: 'Versioning',  v1: 'versionNumber path param (1)', v2: 'apiVersion=2 or TomTom-Api-Version: 2', note: 'Add required versioning.' },
  { area: 'layer param', v1: 'Required path param (basic, hybrid, labels, poi)', v2: 'Moved to optional query parameter', note: 'Move layer to query string.' },
  { area: 'style param', v1: 'Required path param (main)', v2: 'Removed — not applicable in Orbis v2 vector tiles', note: 'Remove style from URL entirely.' },
  { area: 'Content-Type', v1: 'image/pbf', v2: 'application/vnd.mapbox-vector-tile', note: 'Update content-type handling.' },
];

const MIGRATION_CHANGES_RASTER = [
  { area: 'Base path',  v1: '/map/1/tile/{layer}/{style}/{z}/{X}/{Y}.png', v2: '/maps/orbis/display/raster/tile/{z}/{X}/{Y}', note: 'Update URL. Remove layer and style from path.' },
  { area: 'layer param', v1: 'Required path param (basic, hybrid, labels)', v2: 'Moved to optional query parameter', note: 'Move layer to query string.' },
  { area: 'style param', v1: 'Required path param (main)', v2: 'Optional query param (e.g., street-light, street-dark)', note: 'Move style to query param. Update style name values.' },
  { area: 'tileSize',   v1: 'Query parameter (256, 512)', v2: 'Unchanged', note: 'No change.' },
];

const CODE_BEFORE = `# Vector tile (TomTom Maps)
GET https://api.tomtom.com/map/1/tile/basic/main/12/2048/1366.pbf
    ?key={key}

# Raster tile (TomTom Maps)
GET https://api.tomtom.com/map/1/tile/basic/main/12/2048/1366.png
    ?key={key}`;

const CODE_AFTER = `# Vector tile (Orbis v2)
GET https://api.tomtom.com/maps/orbis/display/vector/tile/12/2048/1366
    ?key={key}&apiVersion=2&layer=basic

# Raster tile (Orbis v2)
GET https://api.tomtom.com/maps/orbis/display/raster/tile/12/2048/1366
    ?key={key}&apiVersion=2&style=street-light`;

export default function MapMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API — Migration Guide</h1>
        <PageActions pageId="map-migration" pageTitle="Map Display API — Migration Guide" />
      </div>

      <p className="quick-answer">
        Migrating to Map Display API Orbis v2 requires restructuring tile URLs — layer and style
        move from path segments to query parameters, and the versioning mechanism changes from a
        path segment to a query parameter or header.
      </p>

      <Callout type="warn" title="Private Preview">
        Map Display API Orbis v2 is in Private Preview for testing purposes only.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="general-changes">General changes</h2>
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
          {MIGRATION_CHANGES_GENERAL.map(({ area, v1, v2, note }) => (
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
        <h2 className="sh" id="vector-tile">Vector tile</h2>
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
          {MIGRATION_CHANGES_VECTOR.map(({ area, v1, v2, note }) => (
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
        <h2 className="sh" id="raster-tile">Raster tile</h2>
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
          {MIGRATION_CHANGES_RASTER.map(({ area, v1, v2, note }) => (
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
          <button className="page-action-btn" onClick={() => onNavigate?.('map-raster-tile', 'map-display-api')}>Raster Tile</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-vector-tile', 'map-display-api')}>Vector Tile</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-tomtom-maps', 'map-display-api')}>TomTom Maps v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-orbis-maps', 'map-display-api')}>Orbis Maps</button>
        </div>
      </div>
    </div>
  );
}
