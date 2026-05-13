import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const MIGRATION_CHANGES_V1_V2 = [
  { area: 'Endpoint URL',    v1: 'POST /routing/1/calculateLongDistanceEVRoute/{locs}/json', v2: 'POST /maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=2', note: 'Update URL. Locations move from path to POST body.' },
  { area: 'Locations',       v1: 'routePlanningLocations path parameter', v2: 'routePlanningLocations POST body (GeoJSON MultiPoint)', note: 'Convert locations to GeoJSON format in POST body.' },
  { area: 'API key',         v1: 'key query parameter', v2: 'TomTom-Api-Key header', note: 'Move API key to request header.' },
  { area: 'Response format', v1: 'contentType path param (json)', v2: 'Accept header', note: 'Remove contentType from URL; set Accept: application/json.' },
];

const FIELD_RENAMES = [
  ['travelTimeInSeconds', 'travelDurationInSeconds'],
  ['trafficDelayInSeconds', 'trafficDelayDurationInSeconds'],
  ['departureTime', 'departureDateTime'],
  ['arrivalTime', 'arrivalDateTime'],
  ['countryCode (alpha-3)', 'countryCodeIso2 (alpha-2)'],
  ['points', 'path (GeoJSON)'],
  ['deviationTime', 'deviationDurationInSeconds'],
  ['deviationDistance', 'deviationDistanceInMeters'],
  ['effectiveSpeedInKmh', 'effectiveSpeedInKilometersPerHour'],
  ['maxSpeedLimitInKmh', 'maxSpeedLimitInKilometersPerHour'],
  ['startPointIndex', 'startPathIndex'],
  ['endPointIndex', 'endPathIndex'],
];

const MIGRATION_CHANGES_V2_V3 = [
  { area: 'Endpoint URL',       v1: 'POST /maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=2', v2: 'POST /maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=3', note: 'Change apiVersion from 2 to 3.' },
  { area: 'Attributes header',  v1: 'Not required', v2: 'Required — specifies response fields using dot-notation', note: 'Add Attributes header to every request.' },
  { area: 'departAt / arriveAt', v1: 'Query parameters', v2: 'departureDateTime / arrivalDateTime in POST body', note: 'Move to POST body parameters.' },
  { area: 'Guidance',           v1: 'instructionsType query param (coded/text/tagged)', v2: 'guidance POST body param (instructions or none)', note: 'Replace instructionsType with guidance POST body param.' },
  { area: 'Enum values',        v1: 'UPPER_SNAKE_CASE', v2: 'camelCase', note: 'Update all enum comparisons (travelMode, vehicleEngineType, etc.).' },
  { area: 'simpleCategory',     v1: 'simpleCategory (integer)', v2: 'iconCategory (camelCase string)', note: 'Update category field references.' },
  { area: 'sections',           v1: 'Array of section objects with sectionType field', v2: 'Map of arrays keyed by section type', note: 'Restructure sections iteration.' },
  { area: 'progress',           v1: 'progress object', v2: 'progressPoints object', note: 'Rename progress references to progressPoints.' },
];

const CODE_BEFORE = `# v1 — TomTom Maps
POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute
     /52.36443,13.50929:48.85660,2.35220/json
     ?key={key}&vehicleEngineType=electric&currentChargeInkWh=45`;

const CODE_AFTER = `# v3 — Orbis Maps
POST https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEVRoute
     ?apiVersion=3
Headers:
  TomTom-Api-Key: {key}
  Attributes: routes.summary,routes.legs,routes.instructions
Content-Type: application/json

{
  "routePlanningLocations": {
    "type": "MultiPoint",
    "coordinates": [[13.50929, 52.36443], [2.35220, 48.85660]]
  },
  "vehicleEngineType": "electric",
  "currentChargeInkWh": 45,
  "maxChargeInkWh": 77,
  "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6"
}`;

export default function LDEVRMigration({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API — Migration Guide</h1>
        <PageActions pageId="ldevr-migration" pageTitle="Long Distance EV Routing API — Migration Guide" />
      </div>

      <p className="quick-answer">
        Migrating LDEVR from v1 to v2 moves authentication to a header and locations to a GeoJSON
        POST body. Moving from v2 to v3 adds the required Attributes header and switches all enum
        values to camelCase.
      </p>

      <div className="zone">
        <h2 className="sh" id="v1-to-v2">v1 → v2</h2>

        <Callout type="info" title="Public Preview">
          LDEVR v2 is in Public Preview.
        </Callout>

        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden', marginTop: '1rem',
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
          {MIGRATION_CHANGES_V1_V2.map(({ area, v1, v2, note }) => (
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

        <h3 style={{ fontSize: '0.9375rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Response field renames (v1 → v2)</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>v1 field</th>
              <th style={thStyle}>v2 field</th>
            </tr>
          </thead>
          <tbody>
            {FIELD_RENAMES.map(([v1, v2]) => (
              <tr key={v1}>
                <td style={tdStyle}><code>{v1}</code></td>
                <td style={tdStyle}><code>{v2}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="v2-to-v3">v2 → v3</h2>

        <Callout type="warn" title="Private Preview">
          LDEVR v3 is in Private Preview.
        </Callout>

        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden', marginTop: '1rem',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
            padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Area', 'v2', 'v3', 'Action'].map(h => (
              <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {MIGRATION_CHANGES_V2_V3.map(({ area, v1, v2, note }) => (
            <div key={area} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
              padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'start', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{area}</span>
              <code style={{ fontSize: '0.6875rem', color: '#a78bfa', fontFamily: 'var(--font-mono)', background: '#a78bfa12', padding: '2px 5px', borderRadius: '4px', wordBreak: 'break-all' }}>{v1}</code>
              <code style={{ fontSize: '0.6875rem', color: '#fb923c', fontFamily: 'var(--font-mono)', background: '#fb923c12', padding: '2px 5px', borderRadius: '4px', wordBreak: 'break-all' }}>{v2}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="code-comparison">Code comparison</h2>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Before (v1 — TomTom Maps):</p>
        <CodeBlock code={CODE_BEFORE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>After (v3 — Orbis Maps):</p>
        <CodeBlock code={CODE_AFTER} language="bash" />
      </div>

      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>Calculate EV Route</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-tomtom-maps', 'ldevr')}>LDEVR v1</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-orbis-v2', 'ldevr')}>LDEVR v2</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-orbis-v3', 'ldevr')}>LDEVR v3</button>
        </div>
      </div>
    </div>
  );
}
