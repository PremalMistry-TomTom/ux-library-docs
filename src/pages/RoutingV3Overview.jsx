/* ─── Routing API v3 Overview ────────────────────────────────────────────── */
export default function RoutingV3Overview({ onNavigate }) {
  const services = [
    {
      id: 'routing-v3-calculate-route',
      name: 'Calculate Route',
      desc: 'Calculates a route between an origin and destination, passing through waypoints (if specified). Additional routing parameters like traffic, avoidance conditions, vehicle profiles, and EV consumption models can be taken into account.',
      method: 'POST',
    },
    {
      id: 'routing-v3-compute-toll',
      name: 'Compute Toll Amounts',
      desc: 'Extension to Calculate Route that returns total toll costs along the route, broken down by currency. Considers ETC transponder availability for payment method selection.',
      method: 'POST',
    },
    {
      id: 'routing-v3-weather',
      name: 'Weather Consideration',
      desc: 'Extension to Calculate Route and Reachable Range that enables dynamic adaptation of EV consumption parameters based on outside temperature, using either user-specified values or live forecast data.',
      method: 'POST',
    },
  ];

  return (
    <div className="zone" style={{ maxWidth: 820 }}>
      {/* Public preview notice */}
      <div style={{
        display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 8,
        background: 'rgba(0,112,205,0.06)', border: '1px solid rgba(0,112,205,0.2)',
        marginBottom: 32,
      }}>
        <div style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>ℹ️</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--black)' }}>Public Preview.</strong>{' '}
          Routing API v3 is powered by TomTom Orbis Maps and is available in public preview.
          The API uses the same TomTom API key as v1/v2 but requires the{' '}
          <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>TomTom-Api-Version: 3</code>{' '}
          header or the Orbis Maps endpoint. The API may change before general availability.
        </div>
      </div>

      {/* Purpose */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 12 }}>Purpose</h2>
      <p style={{ fontSize: '0.9375rem', color: 'var(--mid)', lineHeight: 1.7, marginBottom: 8 }}>
        TomTom Routing v3 is a suite of web services designed for developers using TomTom's latest
        scalable routing engine. The engine uses IQ Routes™ and TomTom Traffic™ for best-in-class
        route quality and real-time accuracy.
      </p>
      <p style={{ fontSize: '0.9375rem', color: 'var(--mid)', lineHeight: 1.7, marginBottom: 32 }}>
        Routing API v3 is <strong>POST-only</strong> and uses a structured JSON request body.
        Route stops are defined as a <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>legs</code> array
        rather than path parameters. The response is field-selectable via the required{' '}
        <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>Attributes</code> request header.
      </p>

      {/* Key differences from v2 */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 12 }}>
        Key differences from v2
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'HTTP method', v2: 'GET or POST', v3: 'POST only' },
          { label: 'Route waypoints', v2: 'Path parameters or POST body', v3: 'Always POST body legs array' },
          { label: 'Response fields', v2: 'Full response always returned', v3: 'Attributes header required — only listed fields returned' },
          { label: 'Base endpoint', v2: '/routing/2/calculateRoute/{locations}/json', v3: '/maps/orbis/routing/v3/calculateRoute' },
          { label: 'Preview status', v2: 'Generally available', v3: 'Public preview' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg)',
            fontSize: '0.8125rem',
          }}>
            <div style={{ fontWeight: 600, color: 'var(--black)' }}>{row.label}</div>
            <div style={{ color: 'var(--mid)' }}><span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 }}>v2</span>{row.v2}</div>
            <div style={{ color: 'var(--mid)' }}><span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 }}>v3</span>{row.v3}</div>
          </div>
        ))}
      </div>

      {/* Web services */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 16 }}>
        Routing web services
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {services.map(s => (
          <div key={s.id} style={{
            padding: '16px 18px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg)',
            cursor: 'pointer', transition: 'border-color 0.15s',
          }}
            onClick={() => onNavigate?.(s.id, 'routing-api')}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 4,
                background: 'rgba(34,197,94,0.1)', color: '#15803d', fontFamily: 'monospace',
              }}>{s.method}</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--blue)' }}>{s.name}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Endpoint & authentication */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 12 }}>
        Authentication
      </h2>
      <p style={{ fontSize: '0.9375rem', color: 'var(--mid)', lineHeight: 1.7, marginBottom: 16 }}>
        Routing API v3 uses the same TomTom API key as v1/v2. Pass the key as a query parameter
        or via the <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>TomTom-Api-Key</code> request header.
      </p>
      <div style={{
        background: 'var(--code-bg, #1e1e2e)', borderRadius: 8,
        padding: '16px 18px', fontFamily: 'monospace', fontSize: '0.8125rem',
        color: 'var(--code-fg, #cdd6f4)', overflowX: 'auto',
        marginBottom: 32,
      }}>
        <pre style={{ margin: 0 }}>{`# Routing API v3 base endpoint
POST https://api.tomtom.com/maps/orbis/routing/v3/calculateRoute

# Required headers
Content-Type: application/json
TomTom-Api-Key: YOUR_API_KEY
Attributes: summary,legs,guidance    # specify which fields to return`}</pre>
      </div>
    </div>
  );
}
