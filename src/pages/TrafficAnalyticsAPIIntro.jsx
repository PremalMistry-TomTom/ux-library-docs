import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_TrafficStats, L_AreaAnalytics, L_ODAnalysis, L_JunctionAnalytics,
} from '../illustrations/lightVariants';
import {
  IlloTrafficStats, IlloAreaAnalytics, IlloODAnalysis, IlloJunctionAnalytics,
} from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloAreaAnalytics, L_AreaAnalytics);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TrafficAnalyticsAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloTrafficStats, L_TrafficStats),
      method: 'POST',
      title: 'Route Statistics',
      desc: 'Compute historical travel time, speed, and delay statistics along a defined route or corridor.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloAreaAnalytics, L_AreaAnalytics),
      method: 'POST',
      title: 'Area Analytics',
      desc: 'Analyse historical congestion metrics — density, speed index, and travel time — within a custom geographic area.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloODAnalysis, L_ODAnalysis),
      method: 'POST',
      title: 'O/D Analysis',
      desc: 'Measure historical traffic flows and travel times between origin-destination pairs to understand mobility patterns.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloJunctionAnalytics, L_JunctionAnalytics),
      method: 'POST',
      title: 'Junction Analytics',
      desc: 'Retrieve turning movement counts, queue lengths, and signal performance metrics at road junctions.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficStats, L_TrafficStats),
      method: 'POST',
      title: 'Road Segment Stats',
      desc: 'Query speed percentiles, delay indices, and reliability scores for individual road segments over a date range.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloAreaAnalytics, L_AreaAnalytics),
      method: 'GET',
      title: 'Probe Metadata',
      desc: 'Retrieve available time ranges and geographic coverage regions for probe-based traffic analytics datasets.',
      pageId: 'traffic-analytics-api-intro',
      tag: 'v1',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/trafficstats/1/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Version',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Service version <strong>1</strong> — enterprise tier, requires dedicated plan access</span>,
    },
    {
      label: 'Data type',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Historical probe-based data — typically available for the past <strong>2 years</strong>, updated daily</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic Analytics API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Traffic Analytics API provides access to historical traffic statistics for routes,
        areas, junctions, and origin-destination pairs. It enables urban planners, fleet operators, and
        smart-city applications to understand congestion patterns, optimise signal timing, and analyse
        mobility demand over time.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          All analytics endpoints are POST requests to <code>/trafficstats/1/</code> and accept a JSON body describing the area or route.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(({ Thumb, method, title, desc, pageId, tag }) => (
            <div
              key={title}
              className="nav-card"
              onClick={() => onNavigate?.(pageId)}
            >
              <div className="nav-card-thumb" style={illoTheme !== 'dark' ? { background: illoPalette.bg, padding: 0 } : undefined}>
                <Thumb />
              </div>
              <div className="nav-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: method === 'POST' ? 'rgba(88,166,255,0.12)' : 'rgba(63,185,80,0.12)', color: method === 'POST' ? '#58a6ff' : '#3fb950', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{method}</span>
                  {tag && <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(88,166,255,0.08)', color: '#58a6ff', fontWeight: 600 }}>{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Base URL table */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL &amp; Authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {baseUrlRows.map(({ label, content }, i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < baseUrlRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="getting-started">Getting started</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Query historical travel-time statistics for a route corridor:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`const API_KEY = 'your-api-key';

// Route Statistics — historical speeds on the A10 ring-road segment
const res = await fetch(
  \`https://api.tomtom.com/trafficstats/1/routeStatistics?key=\${API_KEY}\`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      network: {
        segmentIds: ['372320780', '372320781'],  // OpenLR or TomTom segment IDs
      },
      dateRange: {
        from: '2025-01-01',
        to:   '2025-01-31',
      },
      timeGroups: [{ days: ['MON','TUE','WED','THU','FRI'], timeRange: { from: '07:00', to: '09:00' } }],
    }),
  }
);
const { segmentResults } = await res.json();
segmentResults.forEach(s => {
  console.log(s.segmentId, '—', s.travelTimeSeconds.avg, 's avg travel time');
});`}</pre>
      </div>
    </div>
  );
}
