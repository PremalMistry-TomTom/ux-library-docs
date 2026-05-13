import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_TrafficFlow, L_TrafficIncidents, L_TrafficFlowTile, L_TrafficModelID,
} from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';
import {
  IlloTrafficFlow, IlloTrafficIncidents, IlloTrafficFlowTile, IlloTrafficModelID,
} from './IntroIllustrations';

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TrafficAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloTrafficFlow, L_TrafficFlow, IcoTrafficFlow),
      method: 'GET',
      title: 'Flow Segment Data',
      desc: 'Retrieve real-time traffic flow for a road segment — current speed, free-flow speed, and confidence level.',
      pageId: 'traffic-flow-segment',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents),
      method: 'GET',
      title: 'Incident Details',
      desc: 'Get traffic incidents — accidents, road works, closures — with location, delay type, and severity within a bounding box.',
      pageId: 'traffic-incident-details',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficFlowTile, L_TrafficFlowTile, IcoTrafficFlowTile),
      method: 'GET',
      title: 'Raster Flow Tiles',
      desc: 'PNG map tiles colour-coded by current traffic speed for overlay on raster maps. Supports 22 zoom levels.',
      pageId: 'traffic-flow-tiles',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficFlowTile, L_TrafficFlowTile, IcoTrafficFlowTile),
      method: 'GET',
      title: 'Vector Flow Tiles',
      desc: 'Protocol Buffer vector tiles carrying traffic speed and flow data for client-side styled overlays.',
      pageId: 'traffic-flow-tiles',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents),
      method: 'GET',
      title: 'Raster Incident Tiles',
      desc: 'Raster tiles showing traffic incident pins and severity overlays for quick visual integration.',
      pageId: 'traffic-incident-details',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents),
      method: 'GET',
      title: 'Incident Viewport',
      desc: 'Return incidents within a viewport bounding box — optimised for map-aligned incident data fetching.',
      pageId: 'traffic-incident-details',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloTrafficModelID, L_TrafficModelID, IcoTrafficModelID),
      method: 'GET',
      title: 'Traffic Model ID',
      desc: 'Return the latest traffic data model identifier — use for cache invalidation when tiles are refreshed.',
      pageId: 'traffic-model-id',
      tag: 'v1',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/traffic/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Versions',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Flow endpoints use <strong>v4</strong>; Incident endpoints use <strong>v5</strong></span>,
    },
    {
      label: 'Refresh',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Data updated approximately every <strong>1 minute</strong>; tile CDN cache typically 30–60 s</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Traffic API delivers real-time traffic flow and incident data to power live traffic
        overlays, route avoidance, and ETA accuracy in your application. It provides per-segment speed
        data, incident details, and map tiles updated every minute.
      </p>

      {/* Quickstart CTA */}
      <div className="zone" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate?.('traffic-quickstart', 'traffic-api')}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Quickstart →
        </button>
        <button
          onClick={() => onNavigate?.('traffic-flow-tile', 'traffic-api')}
          style={{ background: 'var(--bg)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          API Reference
        </button>
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Flow endpoints are versioned at <code>/traffic/services/4/</code>; incident endpoints at <code>/traffic/services/5/</code>; tiles at <code>/traffic/map/4/</code>.
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
                  <span className={`http-tag http-tag-${method.toLowerCase()}`}>{method}</span>
                  {tag && <span className="meta-tag">{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides — before version table */}
      <div className="zone">
        <h2 className="sh" id="guides">Guides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { id: 'traffic-guide-tiles', title: 'Rendering Traffic Tiles', desc: 'Overlay raster and vector traffic tiles on a map — tile URL construction, cache strategies, and refresh timing.' },
            { id: 'traffic-guide-flow', title: 'Flow Data in Your App', desc: 'Use Flow Segment Data to display per-road speed data, calculate congestion levels, and update ETAs.' },
            { id: 'traffic-guide-model', title: 'Using Traffic Model ID', desc: 'Invalidate tile caches reliably by polling the Traffic Model ID endpoint to detect data updates.' },
          ].map(({ id, title, desc }) => (
            <button key={id} onClick={() => onNavigate?.(id, 'traffic-api')}
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Version comparison table */}
      <div className="zone">
        <h2 className="sh" id="versions">Versions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', width: '40%', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem' }}>Feature</th>
                {[
                  { label: 'V1', platform: 'TomTom Maps', status: 'Production', statusBg: 'rgba(34,197,94,0.1)', statusColor: '#15803d', color: '#15803d' },
                  { label: 'V2', platform: 'Orbis Maps',  status: 'Production', statusBg: 'rgba(34,197,94,0.1)', statusColor: '#15803d', color: '#7c3aed' },
                ].map(v => (
                  <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '30%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: v.color }}>{v.label}</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: v.statusBg, color: v.statusColor, whiteSpace: 'nowrap' }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 2 }}>{v.platform}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Flow Segment Data',      '✓', '✓'],
                ['Raster Flow Tiles',      '✓', '✓'],
                ['Vector Flow Tiles',      '✓', '✓'],
                ['Incident Details',       '✓', '✓'],
                ['Raster Incident Tiles',  '✓', '✓'],
                ['Vector Incident Tiles',  '✓', '✓'],
                ['Traffic Model ID',       '✓', '✓'],
                ['Extended flow tiles',    '—', '✓'],
                ['Extended incident tiles','—', '✓'],
                ['Production details',     '—', '✓'],
              ].map(([feat, v1, v2], i) => (
                <tr key={feat} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  <td style={{ padding: '9px 14px', color: 'var(--black)', fontWeight: 500 }}>{feat}</td>
                  {[v1, v2].map((val, j) => (
                    <td key={j} style={{ padding: '9px 14px', color: val === '✓' ? '#15803d' : 'var(--t-dis)', fontWeight: val === '✓' ? 700 : 400 }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

    </div>
  );
}
