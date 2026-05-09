import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_TrafficStats, L_AreaAnalytics, L_ODAnalysis, L_JunctionAnalytics,
} from '../illustrations/lightVariants';
import {
  IlloTrafficStats, IlloAreaAnalytics, IlloODAnalysis, IlloJunctionAnalytics,
} from './IntroIllustrations';

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

function EndpointCard({ Illo, title, method = 'GET', path, desc }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, flexShrink: 0, overflow: 'hidden' }}>
        <Illo />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MethodBadge method={method} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        </div>
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloAreaAnalytics, L_AreaAnalytics);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TrafficAnalyticsAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(IlloTrafficStats, L_TrafficStats),
      title: 'Traffic Stats',
      method: 'POST',
      path: '/trafficstats/1/routeStatistics',
      desc: 'Compute historical travel time, speed, and delay statistics along a defined route or corridor.',
    },
    {
      Illo: makeThumb(IlloAreaAnalytics, L_AreaAnalytics),
      title: 'Area Analytics',
      method: 'POST',
      path: '/trafficstats/1/areaStatistics',
      desc: 'Analyse historical congestion metrics — density, speed index, and travel time — within a custom geographic area.',
    },
    {
      Illo: makeThumb(IlloODAnalysis, L_ODAnalysis),
      title: 'O/D Analysis',
      method: 'POST',
      path: '/trafficstats/1/odAnalysis',
      desc: 'Measure historical traffic flows and travel times between origin-destination pairs to understand mobility patterns.',
    },
    {
      Illo: makeThumb(IlloJunctionAnalytics, L_JunctionAnalytics),
      title: 'Junction Analytics',
      method: 'POST',
      path: '/trafficstats/1/junctionStatistics',
      desc: 'Retrieve turning movement counts, queue lengths, and signal performance metrics at road junctions.',
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
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: palette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} />
          ))}
        </div>
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--black)' }}>
          POST https://api.tomtom.com/trafficstats/1/routeStatistics?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
