import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

/* ─── Mock component imports ─────────────────────────────────────────────────── */
import { ZonesDiagram, ResizeDemo, UIStateExplorer }   from './HomeScreenLayout';
import { ButtonBarConfig, SearchEntryConfig }           from './NavigationControls';
import { GuidanceMock }                                  from './HorizonPanel';
import { NIPMock }                                       from './InstructionPanel';
import { ETAMock, CONTENT_FIELDS as ETA_FIELDS }         from './ETAPanel';
import { PositioningDiagram }                            from './RouteBar';
import { SearchMock, LPPMock, TransitionExplorer, SearchUICustomiser } from './SearchEngine';
import { ArchDiagram as EVArchDiagram, EVSearchMock, StationDetailMock, RouteMock, PreferencesMock } from './EVSupport';
import { ArchDiagram as TAIAArchDiagram }                from './TAIAOverview';
import { BoundaryDiagram }                               from './SpeechToText';

/* ─── Status badge ───────────────────────────────────────────────────────────── */
const STATUS = {
  mock:    { label: 'SVG mock',           bg: '#fefce8', color: '#92400e', border: '#fde68a' },
  needed:  { label: 'Screenshot needed',  bg: '#fff5f5', color: '#991b1b', border: '#fecaca' },
  done:    { label: 'Static .png',        bg: '#f0fdf4', color: '#14532d', border: '#bbf7d0' },
  planned: { label: 'Planned',            bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.planned;
  return (
    <span style={{
      fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

/* ─── State chips ────────────────────────────────────────────────────────────── */
function StateChips({ states }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {states.map(s => (
        <span key={s} style={{
          fontSize: '0.67rem', padding: '2px 7px', borderRadius: 12,
          background: 'var(--bg)', border: '1px solid var(--border)',
          color: 'var(--mid)', whiteSpace: 'nowrap',
        }}>{s}</span>
      ))}
    </div>
  );
}

/* ─── Preview card ───────────────────────────────────────────────────────────── */
function PreviewCard({ name, component, desc, states, status, preview }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Preview area */}
      <div style={{
        background: '#0b0f14',
        minHeight: 80,
        maxHeight: 420,
        overflowY: 'auto',
        overflowX: 'auto',
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: preview?.center !== false ? 'flex-start' : undefined,
      }}>
        {preview
          ? preview.node
          : (
            <div style={{
              width: '100%', height: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#374151', fontSize: '0.75rem', fontStyle: 'italic',
            }}>
              No preview yet
            </div>
          )
        }
      </div>

      {/* Metadata strip */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{name}</span>
          <StatusBadge status={status || 'mock'} />
        </div>
        {component && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>
            {component}
          </div>
        )}
        <p style={{ margin: 0, fontSize: '0.77rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</p>
        <StateChips states={states} />
      </div>
    </div>
  );
}

/* ─── Inventory data ─────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'home-screen-layout',
    group: 'Home Screen Layout',
    navGroup: 'App Customisation',
    desc: 'Application area zones, dynamic resize, and UI state signalling.',
    screens: [
      {
        name: 'Zone overview',
        component: 'ZonesDiagram',
        desc: '4 named zones annotated over a dark map: Nav Application Area (amber), Map Safe Area (blue), Map Display Area (purple), Controls Zone (red).',
        states: ['Nav area highlighted', 'Safe area highlighted', 'Display area highlighted', 'Controls zone highlighted'],
      },
      {
        name: 'Resize demo',
        component: 'ResizeDemo',
        desc: 'Map fills screen with configurable insets on all 4 sides. Shows how the nav app area shrinks to make room for IVI widgets.',
        states: ['Default 0,0,0,0', 'Right inset 35%', 'Right inset 50%', 'Top 10% + Right 35%', 'Bottom 20%'],
      },
      {
        name: 'UI state — Passive',
        component: 'UIStateExplorer',
        desc: '4-dimension state signal in passive (non-guidance) mode. Shows state values for activity, panel, map interaction, trip.',
        states: ['Idle browsing', 'Route planning', 'Search open', 'LPP open'],
      },
      {
        name: 'UI state — Active',
        component: 'UIStateExplorer',
        desc: '4-dimension state signal when turn-by-turn guidance is running.',
        states: ['Turn-by-turn', 'Route overview', 'Map free-pan during guidance', 'Arrival'],
      },
    ],
  },
  {
    id: 'nav-controls',
    group: 'Navigation Controls',
    navGroup: 'App Customisation',
    desc: 'Button bar position, button visibility toggles, and search entry point.',
    screens: [
      {
        name: 'Button bar config',
        component: 'ButtonBarConfig',
        desc: 'Map controls bar with position (left/right/top/bottom) and per-button visibility toggles.',
        states: ['All buttons visible', 'Search hidden', 'Mute hidden', 'Settings hidden', 'All hidden'],
      },
      {
        name: 'Search entry point',
        component: 'SearchEntryConfig',
        desc: 'Search represented either as a full destination panel or as a button inside the button bar.',
        states: ['Default (panel visible)', 'Button visible in bar', 'Button hidden'],
      },
    ],
  },
  {
    id: 'horizon-panel',
    group: 'Horizon Panel',
    navGroup: 'App Customisation',
    desc: 'The composed guidance panel combining NIP, Upcoming Events strip, and ETA bar.',
    screens: [
      {
        name: 'Composed — right docked',
        component: 'GuidanceMock',
        desc: 'Full composed panel (NIP + Upcoming + ETA) anchored to the right edge.',
        states: ['Composed — right'],
      },
      {
        name: 'Composed — left docked',
        component: 'GuidanceMock',
        desc: 'Full composed panel anchored to the left edge.',
        states: ['Composed — left'],
      },
      {
        name: 'Composed — centre',
        component: 'GuidanceMock',
        desc: 'Full composed panel centred horizontally.',
        states: ['Composed — centre'],
      },
      {
        name: 'Decomposed',
        component: 'GuidanceMock',
        desc: 'NIP, Upcoming Events, and ETA rendered as separate floating panels.',
        states: ['NIP only', 'NIP + upcoming strip', 'NIP + ETA bar'],
      },
    ],
  },
  {
    id: 'instruction-panel',
    group: 'Next Instruction Panel',
    navGroup: 'App Customisation',
    desc: 'Standalone NIP positioned freely anywhere on the map surface.',
    screens: [
      {
        name: 'NIP positions',
        component: 'NIPMock',
        desc: 'The NIP can be anchored to 5 positions relative to the navigation area.',
        states: ['Top left', 'Top centre', 'Top right', 'Bottom left', 'Bottom right'],
      },
    ],
  },
  {
    id: 'eta-panel',
    group: 'ETA Panel',
    navGroup: 'App Customisation',
    desc: 'Standalone ETA bar showing remaining time, distance, and arrival time.',
    screens: [
      {
        name: 'ETA panel positions',
        component: 'ETAMock',
        desc: 'The ETA bar supports 6 anchor positions in a 2×3 grid (top/bottom × left/centre/right).',
        states: ['Bottom left', 'Bottom centre', 'Bottom right', 'Top left', 'Top centre', 'Top right'],
      },
    ],
  },
  {
    id: 'route-bar',
    group: 'Route Bar',
    navGroup: 'App Customisation',
    desc: 'Upcoming events visualised as a scrollable strip along the active route.',
    screens: [
      {
        name: 'Positioning diagram',
        component: 'PositioningDiagram',
        desc: 'Shows where the Route Bar sits in the layout relative to the NIP and ETA panel.',
        states: ['Free drive (hidden)', 'Guided drive', 'Landscape'],
        status: 'planned',
      },
    ],
  },
  {
    id: 'search-engine',
    group: 'Search Engine',
    navGroup: 'App Customisation',
    desc: 'Search provider integration, connectivity states, and LPP enrichment.',
    screens: [
      {
        name: 'Online search (third-party)',
        component: 'SearchMock',
        desc: 'Search bar and results list in online mode with a third-party provider and attribution badge.',
        states: ['Empty state', 'With results', 'With "Powered by Google" badge'],
      },
      {
        name: 'Offline search (TomTom)',
        component: 'SearchMock',
        desc: 'TomTom-only offline search — no attribution badge, limited result set.',
        states: ['Empty state', 'With results'],
      },
      {
        name: 'Connectivity transitions',
        component: 'TransitionExplorer',
        desc: 'Modal or inline indicator that switches the provider when connectivity changes.',
        states: ['Online → offline', 'Offline → online'],
      },
      {
        name: 'Search UI customisation',
        component: 'SearchUICustomiser',
        desc: 'Interactive explorer for Basic, Enriched, Filtered, and Attribution UI variants.',
        states: ['Basic', 'Enriched results', 'With filters', 'Google attribution'],
      },
      {
        name: 'Location Preview Panel',
        component: 'LPPMock',
        desc: 'Bottom sheet showing place details after selecting a search result.',
        states: ['Default (no route)', 'With route options', 'POI details', 'Address only'],
      },
    ],
  },
  {
    id: 'ev',
    group: 'EV Support',
    navGroup: 'Vehicle Integration',
    desc: 'Charging station search, LDEVR route planning, and route preferences.',
    screens: [
      {
        name: 'Architecture diagram',
        component: 'EVArchDiagram',
        desc: 'SVG showing data flow: Vehicle BMS → Vehicle Integration API → Navigation SDK → LDEVR API / EV Search API.',
        states: ['Static'],
      },
      {
        name: 'EV charging search',
        component: 'EVSearchMock',
        desc: 'Charging station list with speed / payment / services filter chips.',
        states: ['Speed filter', 'Payment filter', 'Services filter'],
      },
      {
        name: 'Station detail panel',
        component: 'StationDetailMock',
        desc: 'Full station detail: name, address, distance, connector types with live availability.',
        states: ['CCS + Type 2 station', 'Compatible', 'Incompatible connector'],
      },
      {
        name: 'LDEVR route preview',
        component: 'RouteMock',
        desc: 'Route timeline with 2 charging stops showing arrival SoC, target SoC, charge time, and operator.',
        states: ['Plan charging: ON', 'Plan charging: OFF', 'Out-of-range warning'],
      },
      {
        name: 'Route preferences',
        component: 'PreferencesMock',
        desc: 'Min battery sliders for stops and destination, plus avoid-tolls / avoid-unpaved toggles.',
        states: ['Default 15%/15%', 'High threshold 30%/25%', 'Avoid tolls on'],
      },
    ],
  },
  {
    id: 'ai-overview',
    group: 'TomTom AI Assistant (TAIA)',
    navGroup: 'TomTom AI Assistant',
    desc: 'Architecture diagrams for the full TAIA voice pipeline.',
    screens: [
      {
        name: 'Full architecture diagram',
        component: 'TAIAArchDiagram',
        desc: 'Complete voice pipeline: Driver → STT → VPA Cloud → TAIA SDK → TAIA Cloud → TTS → Speaker.',
        states: ['Static'],
      },
      {
        name: 'STT boundary diagram',
        component: 'BoundaryDiagram',
        desc: 'Shows the TAIA integration boundary — OEM owns audio/STT/VPA; TAIA receives only the text transcript.',
        states: ['Static'],
      },
    ],
  },
];

/* ─── Summary counts ─────────────────────────────────────────────────────────── */
function countByStatus(sections) {
  const counts = { mock: 0, needed: 0, done: 0, planned: 0, total: 0 };
  sections.forEach(s => s.screens.forEach(sc => {
    const st = sc.status || 'mock';
    counts[st] = (counts[st] || 0) + 1;
    counts.total += 1;
  }));
  return counts;
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function ScreenshotAssets() {
  const { t } = useTranslation('pages');

  const counts = countByStatus(SECTIONS);
  const totalStates = SECTIONS.reduce((n, s) =>
    n + s.screens.reduce((m, sc) => m + sc.states.length, 0), 0);

  /* Map component key → rendered React node */
  const PREVIEW = {
    'ZonesDiagram':       { node: <ZonesDiagram t={t} /> },
    'ResizeDemo':         { node: <ResizeDemo t={t} /> },
    'UIStateExplorer':    { node: <UIStateExplorer t={t} /> },
    'ButtonBarConfig':    { node: <ButtonBarConfig t={t} /> },
    'SearchEntryConfig':  { node: <SearchEntryConfig t={t} /> },
    'GuidanceMock':       { node: <GuidanceMock position="RIGHT" decomposed={false} /> },
    'NIPMock':            { node: <NIPMock position="TOP_LEFT" /> },
    'ETAMock':            { node: <ETAMock position="BOTTOM_LEFT" visibleFields={ETA_FIELDS.filter(f => f.id !== 'soc')} /> },
    'PositioningDiagram': { node: <PositioningDiagram /> },
    'SearchMock':         { node: <SearchMock /> },
    'LPPMock':            { node: <LPPMock /> },
    'TransitionExplorer': { node: <TransitionExplorer /> },
    'SearchUICustomiser': { node: <SearchUICustomiser /> },
    'EVArchDiagram':      { node: <EVArchDiagram /> },
    'EVSearchMock':       { node: <EVSearchMock /> },
    'StationDetailMock':  { node: <StationDetailMock /> },
    'RouteMock':          { node: <RouteMock /> },
    'PreferencesMock':    { node: <PreferencesMock /> },
    'TAIAArchDiagram':    { node: <TAIAArchDiagram /> },
    'BoundaryDiagram':    { node: <BoundaryDiagram /> },
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Screenshot Assets &amp; States</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        An inventory of every UI mock in the library — track which screens still need real device screenshots to replace the current SVG mocks.
      </div>

      <Callout type="warn">
        This page is for internal planning only. All screens are currently JSX/SVG mocks.
        The goal is to identify, agree on, and track the capture of real device screenshots
        to replace them.
      </Callout>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '24px 0' }}>
        {[
          { label: 'Total screens', value: counts.total, color: 'var(--text)' },
          { label: 'Total states',  value: totalStates,  color: 'var(--text)' },
          { label: 'SVG mocks',     value: counts.mock,  color: '#92400e' },
          { label: 'Screenshot needed', value: counts.needed,  color: '#991b1b' },
          { label: 'Static .png',   value: counts.done,  color: '#14532d' },
          { label: 'Planned',       value: counts.planned, color: 'var(--muted)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg)', minWidth: 110, textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 3, lineHeight: 1.3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <div className="zone" id="sa-how">
        <h2 className="sh">How to use this page</h2>
        <p className="body">
          Each section below maps to a documentation page. Live previews show the current JSX/SVG mock
          as it appears inline in the docs. The state chips list which distinct variants need individual
          screenshots. Status badges track progress from <strong>SVG mock</strong> → <strong>Screenshot needed</strong> → <strong>Static .png</strong>.
        </p>
        <p className="body">
          When a screenshot is ready, update the <code>status</code> field in{' '}
          <code>src/pages/ScreenshotAssets.jsx</code> from <code>&apos;mock&apos;</code> to{' '}
          <code>&apos;done&apos;</code>.
          Screens marked <strong>Planned</strong> have no interactive mock yet.
        </p>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          {Object.entries(STATUS).map(([key, s]) => (
            <span key={key} style={{
              fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
              background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            }}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(section => (
        <div className="zone" key={section.id} id={`sa-${section.id}`}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <h2 className="sh" style={{ margin: 0 }}>{section.group}</h2>
            <span style={{
              fontSize: '0.67rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)',
            }}>{section.navGroup}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginLeft: 'auto' }}>
              {section.screens.length} screen{section.screens.length !== 1 ? 's' : ''}{' · '}
              {section.screens.reduce((n, s) => n + s.states.length, 0)} states
            </span>
          </div>
          <p className="body" style={{ marginTop: 0, marginBottom: 16 }}>{section.desc}</p>

          {/* Preview card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {section.screens.map(screen => (
              <PreviewCard
                key={screen.name}
                name={screen.name}
                component={screen.component}
                desc={screen.desc}
                states={screen.states}
                status={screen.status}
                preview={PREVIEW[screen.component] || null}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
