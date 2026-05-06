import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

export default function WaypointOptIntro({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Waypoint Optimization API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Find the fastest ordering of a set of stops — solving the travelling salesman problem for
        real-world routing. Feed the reordered waypoints into the Routing API to get the full route.
      </p>

      <Callout type="info" title="Works alongside the Routing API">
        Waypoint Optimization reorders stops; it does not return a navigable route. Pass the optimized
        sequence to the <button onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')} style={{ background: 'none', border: 'none', padding: 0, color: '#e2001a', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: 'inherit' }}>Calculate Route endpoint</button> to get turn-by-turn directions.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="wp-key">Key details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { icon: '📍', title: 'Capacity', body: '2–12 waypoints per request (expandable on premium plans)' },
            { icon: '🚗', title: 'Travel modes', body: 'Car and truck. Truck mode respects dimensions, weight, and hazmat constraints.' },
            { icon: '⏰', title: 'Constraints', body: 'Time windows, stop priority/importance, and order constraints can be applied.' },
            { icon: '🔗', title: 'Output', body: 'Returns the optimized stop order. Pair with Calculate Route to build the full route.' },
          ].map(f => (
            <div key={f.title} style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 7 }}>{f.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.55 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="wp-endpoint">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--black)' }}>
          POST https://api.tomtom.com/routing/waypointoptimization/1
        </div>
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('waypoint-optimize')}>Optimize Waypoints →</button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>Calculate Route (Routing API) →</button>
      </div>
    </div>
  );
}
