import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const MIGRATION_CHANGES_V1 = [
  { area: 'Base URL',           v1: '/search/2/geocode/...', v2: '/maps/orbis/places/geocode/...', note: 'Update base path to Orbis places.' },
  { area: 'Versioning',         v1: 'versionNumber in path (value: 2)', v2: 'apiVersion=1 param or TomTom-Api-Version: 1 header', note: 'Required — add to all requests.' },
  { area: 'API key',            v1: 'key query parameter', v2: 'key query parameter (unchanged)', note: 'No change.' },
  { area: 'Structured Geocode', v1: 'Supported', v2: 'Not supported', note: 'Remove structured geocode calls or keep TomTom Maps for this endpoint.' },
  { area: 'Geopolitical views', v1: 'Full set', v2: 'Unified, AR, IL, MA only', note: 'Restrict geopolitical view usage.' },
];

const MIGRATION_CHANGES_V2 = [
  { area: 'Base URL',           v1: '/search/2/geocode/Amsterdam.json', v2: '/maps/orbis/places/geocode?query=Amsterdam', note: 'query moves from path to query parameter.' },
  { area: 'API key',            v1: 'key query parameter', v2: 'TomTom-Api-Key header (required)', note: 'Move API key to header.' },
  { area: 'Versioning',         v1: 'versionNumber path param', v2: 'TomTom-Api-Version: 2 header (required)', note: 'Add required version header.' },
  { area: 'Attributes',         v1: 'Not required', v2: 'Attributes header required (e.g., results)', note: 'Add Attributes header specifying response fields.' },
  { area: 'Response format',    v1: '.json / .xml extension in path', v2: 'Accept header only (application/json)', note: 'Remove file extension from URL.' },
  { area: 'Structured Geocode', v1: 'Not in Orbis v1', v2: 'Supported again in v2', note: 'Structured geocode is restored in Orbis v2.' },
];

const CODE_BEFORE = `// Before — TomTom Maps
GET https://api.tomtom.com/search/2/geocode/Amsterdam.json
    ?key={Your_API_Key}`;

const CODE_ORBIS_V1 = `// After — Orbis v1
GET https://api.tomtom.com/maps/orbis/places/geocode/Amsterdam.json
    ?key={Your_API_Key}&apiVersion=1`;

const CODE_ORBIS_V2 = `// After — Orbis v2
GET https://api.tomtom.com/maps/orbis/places/geocode
    ?query=Amsterdam&apiVersion=2
Headers:
  TomTom-Api-Version: 2
  TomTom-Api-Key: {Your_API_Key}
  Attributes: results`;

export default function GeocodingMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API — Migration Guide</h1>
        <PageActions pageId="geocoding-migration" pageTitle="Geocoding API — Migration Guide" />
      </div>

      <p className="quick-answer">
        Moving from TomTom Maps to Orbis v1 requires only a URL update and a version parameter.
        Moving to Orbis v2 additionally requires moving authentication to a header and adding an
        Attributes header for response field selection.
      </p>

      <Callout type="warn" title="Public Preview">
        Both Orbis Maps Geocoding versions are in Public Preview.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="v1-migration">v1 — TomTom Maps → Orbis v1</h2>
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
          {MIGRATION_CHANGES_V1.map(({ area, v1, v2, note }) => (
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
        <h2 className="sh" id="v2-migration">v2 — TomTom Maps → Orbis v2</h2>
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
          {MIGRATION_CHANGES_V2.map(({ area, v1, v2, note }) => (
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

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (Orbis v1):</p>
        <CodeBlock code={CODE_ORBIS_V1} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (Orbis v2):</p>
        <CodeBlock code={CODE_ORBIS_V2} language="bash" />
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>Geocode endpoint</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-tomtom-maps', 'geocoding-api')}>TomTom Maps v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-orbis-maps', 'geocoding-api')}>Orbis Maps</button>
        </div>
      </div>
    </div>
  );
}
