import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const MIGRATION_CHANGES = [
  { area: 'Base URL',          v1: 'https://api.tomtom.com/search/2/...', v2: 'https://api.tomtom.com/maps/orbis/places/...', note: 'Update all base URLs to the new Orbis path.' },
  { area: 'Versioning',        v1: 'versionNumber path param (always 2)', v2: 'apiVersion=1 query param or TomTom-Api-Version: 1 header (required)', note: 'Add required versioning — pick one method and apply consistently.' },
  { area: 'API key',           v1: 'key query parameter', v2: 'key query parameter (unchanged)', note: 'No change to authentication.' },
  { area: 'Parameters',        v1: 'Full parameter set', v2: 'No changes to parameters or responses', note: 'Existing query parameters and response fields are unchanged.' },
  { area: 'Geopolitical views', v1: 'Full set', v2: 'Unified, AR, IL, MA only', note: 'If using other geopolitical views, continue using TomTom Maps endpoints.' },
  { area: 'Filters service',   v1: 'Available', v2: 'Not available on Orbis Maps', note: 'Remove any Filters service integration or keep using TomTom Maps for this use case.' },
];

const CODE_BEFORE = `// Before — TomTom Maps
GET https://api.tomtom.com/search/2/search/Amsterdam.json
    ?key={Your_API_Key}&limit=10`;

const CODE_AFTER = `// After — Orbis Maps
GET https://api.tomtom.com/maps/orbis/places/search/Amsterdam.json
    ?key={Your_API_Key}&apiVersion=1&limit=10`;

export default function SearchMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API — Migration Guide</h1>
        <PageActions pageId="search-migration" pageTitle="Search API — Migration Guide" />
      </div>

      <p className="quick-answer">
        Moving from the TomTom Maps Search API to Orbis Maps requires updating the base URL
        and adding a versioning header or parameter. Parameters and response fields are unchanged.
      </p>

      <Callout type="warn" title="Public Preview">
        The Orbis Maps Search API is in Public Preview. Check release notes before updating
        production integrations.
      </Callout>

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

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Before (TomTom Maps):</p>
        <CodeBlock code={CODE_BEFORE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (Orbis Maps):</p>
        <CodeBlock code={CODE_AFTER} language="bash" />
      </div>

      <div className="zone">
        <h2 className="sh" id="removed">Services not available</h2>
        <p>The following service from TomTom Maps is <strong>not</strong> available on Orbis Maps:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Filters service</strong> — filter custom or third-party POIs within a geometry. Continue using the TomTom Maps endpoint for this use case.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('fuzzy-search', 'search-api')}>Fuzzy Search</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-tomtom-maps', 'search-api')}>TomTom Maps v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-orbis-maps', 'search-api')}>Orbis Maps v2</button>
        </div>
      </div>
    </div>
  );
}
