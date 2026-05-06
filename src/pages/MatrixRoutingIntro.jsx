import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

export default function MatrixRoutingIntro({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Matrix Routing v2 API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Calculate travel times and distances for every combination of a set of origins and destinations
        in a single API call. Designed for logistics, fleet management, and demand-forecasting applications
        that need many-to-many cost matrices at scale.
      </p>

      <Callout type="info" title="Separate product">
        Matrix Routing v2 is a standalone API — it is not part of the Routing API quota or endpoint set.
        For point-to-point routes, use the <button onClick={() => onNavigate?.('routing-api-intro', 'routing-api')} style={{ background: 'none', border: 'none', padding: 0, color: '#e2001a', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: 'inherit' }}>Routing API</button>.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="mx-modes">Synchronous vs asynchronous</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            {
              title: 'Synchronous',
              limit: 'Up to 2,500 cells',
              method: 'POST → immediate JSON response',
              use: 'Small matrices for real-time use cases (e.g. nearest-driver assignment)',
            },
            {
              title: 'Asynchronous',
              limit: 'Up to 100,000,000 cells',
              method: 'Submit job → poll status → download results (retained 24 h)',
              use: 'Large planning matrices, overnight logistics batch runs',
            },
          ].map(m => (
            <div key={m.title} style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#e2001a', marginBottom: 8 }}>{m.limit}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--mid)', marginBottom: 6, lineHeight: 1.5 }}><strong>Method:</strong> {m.method}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.5 }}><strong>Best for:</strong> {m.use}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="mx-endpoint">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--black)' }}>
          POST https://api.tomtom.com/routing/matrix/2
        </div>
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('matrix-synchronous')}>Synchronous Matrix →</button>
        <button className="page-action-btn" onClick={() => onNavigate?.('matrix-asynchronous')}>Asynchronous Matrix →</button>
      </div>
    </div>
  );
}
