import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_ColourSystem, L_MapStyle, L_HomeScreen, L_Cluster, L_AIVoice,
  L_ETAPanel, L_SearchResult, L_ThemingTokens, L_ChargingSearch, L_ConversationPersonality, L_ADAS,
  L_EVRouting, L_NavGuidance,
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
  IcoColourSystem, IcoConversationPersonality, IcoMapStyle, IcoSearchResult, IcoThemingTokens,
} from '../illustrations/iconVariants';
import {
  IlloColourSystem, IlloMapStyle, IlloSearchResult,
  IlloHomeScreen, IlloETAPanel, IlloThemingTokens, IlloChargingSearch,
  IlloAIVoice, IlloNavControls, IlloHorizonPanel,
  IlloConversationPersonality, IlloCluster, IlloADAS,
  IlloEVRouting, IlloEVBattery, IlloEVNavUI, IlloEVRequirements,
  IlloRouteBar, IlloInstructionPanel,
  IlloSpeechToText, IlloAIConfig, IlloIntentRouting, IlloVoiceEngine,
  IlloVIBasics, IlloHUD, IlloTruck,
} from './IntroIllustrations';

/* ─── Cross-link helpers ─────────────────────────────────────────────────────── */
function DocLink({ pageId, productId, onNavigate, children }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, productId)}
      style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'var(--red)', textDecoration: 'underline', font: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
    >
      {children}
    </button>
  );
}

function WhenCard({ type = 'check', title, children }) {
  const isWarn = type === 'warn';
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        {isWarn ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M8 1.5L14.928 13.5H1.072L8 1.5Z" fill="#f59e0b"/>
            <rect x="7.25" y="6" width="1.5" height="4" rx="0.75" fill="white"/>
            <circle cx="8" cy="11.5" r="0.85" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="7" fill="#22c55e"/>
            <path d="M5 8.2l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Domain card ────────────────────────────────────────────────────────────── */
function DomainCard({ id, label, desc, pages, Thumb, onNavigate }) {
  const { theme, palette } = useIlloStyle();
  return (
    <div className="nav-card" onClick={() => onNavigate(id)} role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onNavigate(id))}>
      <div className="nav-card-thumb" style={theme !== 'dark' ? { background: palette.bg, padding: 0 } : undefined}>
        <Thumb />
      </div>
      <div className="nav-card-body">
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {pages.map(p => (
            <span key={p} style={{ fontSize: '0.75rem', padding: '2px 7px', borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--mid)', whiteSpace: 'nowrap' }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Domain data (one card per nav group, in nav order) ─────────────────────── */
const DOMAIN_CARDS = [
  { id: 'assets',              key: 'assets',             Thumb: makeThumb(IlloColourSystem,    L_ColourSystem, IcoColourSystem),
    pages: ['Design Tokens', 'Theming', 'Colour', 'Font', 'Corner Radius'] },
  { id: 'map-customisation',   key: 'mapCustomisation',   Thumb: makeThumb(IlloMapStyle,        L_MapStyle, IcoMapStyle),
    pages: ['Map Style', 'Traffic', 'Safety Locations'] },
  { id: 'app-customisation',   key: 'appCustomisation',   Thumb: makeThumb(IlloHomeScreen,      L_HomeScreen, IcoHomeScreen),
    pages: ['Home Screen', 'Search Engine', 'Nav Controls', 'Horizon Panel', 'Instruction Panel', 'ETA Panel', 'Route Bar'] },
  { id: 'ev-charging',         key: 'evCharging',         Thumb: makeThumb(IlloEVRouting,       L_EVRouting, IcoEVRouting),
    pages: ['EV Overview', 'Battery Model', 'Charging Search', 'Long-Distance Routing', 'In-Navigation UI', 'Requirements'] },
  { id: 'vehicle-integration', key: 'vehicleIntegration', Thumb: makeThumb(IlloCluster,         L_Cluster, IcoCluster),
    pages: ['VI Basics', 'Cluster', 'Head-Up Display', 'ADAS Integration', 'Truck Support'] },
  { id: 'ai-assistant',        key: 'aiAssistant',        Thumb: makeThumb(IlloIntentRouting,   L_AIVoice, IcoIntentRouting),
    pages: ['Overview', 'Personality', 'Intent Routing', 'Voice Engine', 'Speech to Text', 'Config'] },
];

/* ─── Use-case card (thumbnail + group tag + title + desc) ──────────────────── */
function UseCaseCard({ id, label, desc, group, Thumb, onNavigate }) {
  const { theme, palette } = useIlloStyle();
  return (
    <div className="nav-card" onClick={() => onNavigate(id)} role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onNavigate(id))}>
      <div className="nav-card-thumb" style={theme !== 'dark' ? { background: palette.bg, padding: 0 } : undefined}>
        <Thumb />
      </div>
      <div className="nav-card-body">
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>{group}</div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

const USE_CASE_CARDS = [
  { id: 'home-screen-layout', key: 'homeScreenLayout',  Thumb: makeThumb(IlloHomeScreen,              L_HomeScreen, IcoHomeScreen)           },
  { id: 'theming',            key: 'theming',           Thumb: makeThumb(IlloThemingTokens,           L_ThemingTokens, IcoThemingTokens)        },
  { id: 'search-engine',      key: 'searchEngine',      Thumb: makeThumb(IlloSearchResult,            L_SearchResult, IcoSearchResult)         },
  { id: 'eta-panel',          key: 'etaPanel',          Thumb: makeThumb(IlloETAPanel,                L_ETAPanel, IcoETAPanel)             },
  { id: 'ev-routing',         key: 'evRouting',         Thumb: makeThumb(IlloEVRouting,               L_EVRouting, IcoEVRouting)            },
  { id: 'cluster',            key: 'cluster',           Thumb: makeThumb(IlloCluster,                 L_Cluster, IcoCluster)              },
  { id: 'ai-personality',     key: 'aiPersonality',     Thumb: makeThumb(IlloConversationPersonality, L_ConversationPersonality, IcoConversationPersonality) },
  { id: 'instruction-panel',  key: 'instructionPanel',  Thumb: makeThumb(IlloInstructionPanel,        L_NavGuidance, IcoInstructionPanel)          },
  { id: 'hud',                key: 'hud',               Thumb: makeThumb(IlloHUD,                     L_ADAS, IcoHUD)                 },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function Overview({ onNavigate }) {
  const { t } = useTranslation('overview');

  const domains = DOMAIN_CARDS.map(({ id, key, Thumb, pages }) => ({
    id, Thumb, pages,
    label: t(`domains.${key}.label`),
    desc:  t(`domains.${key}.desc`),
  }));

  const useCases = USE_CASE_CARDS.map(({ id, key, Thumb }) => ({
    id, Thumb,
    label: t(`useCases.${key}.label`),
    desc:  t(`useCases.${key}.desc`),
    group: t(`useCases.${key}.group`),
  }));

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('intro')}</div>
      <a
        href="https://www.tomtom.com/en_gb/automotive/contact/"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 8, marginBottom: 28,
          border: 'none', background: 'var(--red)',
          color: '#fff', fontWeight: 700, fontSize: '0.875rem',
          textDecoration: 'none',
        }}
      >
        Contact Sales →
      </a>

      {/* Hero image */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, background: '#0d1d2e', border: '1px solid var(--border)', position: 'relative' }}>
        <img
          src={`${import.meta.env.BASE_URL}hero.png`}
          alt="UX Library — navigation interface"
          style={{ width: '100%', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
        <div style={{ display: 'none', height: 260, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.25)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Save your screenshot as <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ux-library/public/hero.png</code></span>
        </div>
      </div>

      {/* What is UX Library */}
      <div className="zone">
        <h2 className="sh" id="ov-what">{t('what.heading')}</h2>
        <p className="body">{t('what.body1')}</p>
        <p className="body">{t('what.body2')}</p>
      </div>

      {/* When to choose UX Library */}
      <div className="zone">
        <h2 className="sh" id="ov-when">When to choose UX Library</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard type="check" title="Ready-made navigation UI">
            Complete Compose components for map display, guidance, search, ETA panel, and EV charging — no UI design from scratch.
          </WhenCard>
          <WhenCard type="check" title="Fully themeable">
            Override colours, typography, corner radius, and icon sets via design tokens to match your OEM brand identity.
          </WhenCard>
          <WhenCard type="check" title="Built on NavSDK">
            Sits directly on top of the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>.
            All NavSDK capabilities remain accessible beneath the component layer.
          </WhenCard>
          <WhenCard type="check" title="Production-tested patterns">
            Components follow the same UX patterns used in TomTom's own navigation application — proven in real vehicles.
          </WhenCard>
          <WhenCard type="warn" title="Android only">
            UX Library targets Jetpack Compose on Android. iOS is not currently supported — use the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>{' '}
            directly on iOS.
          </WhenCard>
          <WhenCard type="warn" title="TomTom UI structure">
            The component architecture follows TomTom's UX patterns. For a completely bespoke layout, build directly on the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>{' '}
            instead.
          </WhenCard>
        </div>
      </div>

      {/* Key use cases */}
      <div className="zone">
        <h2 className="sh" id="ov-usecases">{t('useCases.heading')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>{t('useCases.subheading')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {useCases.map(card => (
            <UseCaseCard key={card.id} {...card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Domain cards */}
      <div className="zone">
        <h2 className="sh" id="ov-explore">{t('explore.heading')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>{t('explore.subheading')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
          {domains.map(card => (
            <DomainCard key={card.id} {...card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <Callout type="info">{t('callout')}</Callout>
    </div>
  );
}
