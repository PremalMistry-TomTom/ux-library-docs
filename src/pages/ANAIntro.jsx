import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

const BASE = import.meta.env.BASE_URL;

/* ─── Inline cross-product link ─────────────────────────────────────────────── */
function DocLink({ children, pageId, productId, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, productId)}
      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red, #e2001a)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
    >
      {children}
    </button>
  );
}

function WhenCard({ icon, title, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Integration layer diagram ─────────────────────────────────────────────── */
function IntegrationDiagram({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600 }}>
      {/* OEM App layer */}
      <div style={{ background: 'rgba(0,102,204,0.09)', border: '1px solid rgba(0,102,204,0.3)', borderRadius: '8px 8px 0 0', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('anaIntro.archLayers.yourLayer')}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['OEM HMI App', 'Vehicle ECU / IVI', 'EV Battery System', 'Dashboard Cluster'].map(item => (
            <span key={item} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, background: 'rgba(0,102,204,0.12)', border: '1px solid rgba(0,102,204,0.25)', color: '#0066cc', fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Arrows down */}
      <div style={{ display: 'flex', gap: 8, padding: '2px 0', justifyContent: 'center' }}>
        {['VIL', 'CIL'].map(label => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
            <span style={{ fontSize: '0.5rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
          </div>
        ))}
      </div>

      {/* Integration layers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div style={{ background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3fb950', marginBottom: 4 }}>{t('anaIntro.archLayers.vilTitle')}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {t('anaIntro.archLayers.vilDesc')}
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['EV SoC', 'Connectors', 'Speed', 'GDPR', 'Cluster'].map(tag => (
              <span key={tag} style={{ fontSize: '0.875rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(63,185,80,0.1)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a855f7', marginBottom: 4 }}>{t('anaIntro.archLayers.cilTitle')}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {t('anaIntro.archLayers.cilDesc')}
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['Navigate to', 'Route info', 'POI search', 'ETA', 'Cancel'].map(tag => (
              <span key={tag} style={{ fontSize: '0.875rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
        <div style={{ width: 1, height: 12, background: 'var(--border)' }}/>
      </div>

      {/* ANA core */}
      <div style={{ background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.3)', borderRadius: '0 0 8px 8px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2001a' }}/>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2001a' }}>{t('anaIntro.archLayers.anaTitle')}</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
          {t('anaIntro.archLayers.anaDesc')}
        </div>
      </div>
    </div>
  );
}

/* ─── Feature card thumbnails ────────────────────────────────────────────────── */
function ThumbPhoto({ src, objectPosition = 'center top' }) {
  return (
    <img
      src={`${BASE}${src}`}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
    />
  );
}

function ThumbVIL() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', green: '#3fb950' };
  const signals = [['Battery SoC', '74%', '#3fb950'], ['Connector type', 'CCS2', '#58a6ff'], ['Speed', '87 km/h', '#fbbf24'], ['GDPR consent', 'Granted', '#3fb950']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>VIL — Vehicle signals</div>
      <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 8 }}>← Feeding into ANA</div>
      {signals.map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ flex: 1, fontSize: '0.5rem', color: M.dim }}>{label}</div>
          <span style={{ fontSize: '0.5rem', fontWeight: 600, color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbCIL() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', purple: '#a855f7' };
  const cmds = [['navigateTo(destination)', 'Sets active route'], ['cancelNavigation()', 'Ends session'], ['searchNearby(query)', 'Returns POI list']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>CIL — Control API</div>
      <div style={{ fontSize: '0.5rem', color: M.purple, marginBottom: 8 }}>→ Commanding ANA</div>
      {cmds.map(([fn, desc]) => (
        <div key={fn} style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '5px 7px', marginBottom: 4 }}>
          <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: M.purple }}>{fn}</div>
          <div style={{ fontSize: '0.5rem', color: M.dim, marginTop: 1 }}>{desc}</div>
        </div>
      ))}
    </div>
  );
}

function ThumbTheming() {
  const tokens = [
    { name: '--brand-primary', from: '#e2001a', to: '#0066ff' },
    { name: '--corner-radius', from: '4dp', to: '12dp', text: true },
    { name: '--font-family', from: 'Roboto', to: 'Inter', text: true },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#8b949e', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM Theme tokens</div>
      {tokens.map(({ name, from, to, text }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: '#161b22', border: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.5rem', color: '#8b949e', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>→</span>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: '#161b22', border: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#0066ff', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────────────── */
function FeatureCard({ Thumb, src, objectPosition, title, desc, tag, pageId, onNavigate }) {
  const clickable = Boolean(pageId && onNavigate);
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', flexShrink: 0 }}>
        {src
          ? <ThumbPhoto src={src} objectPosition={objectPosition} />
          : <div style={{ padding: 10, height: '100%' }}><Thumb /></div>
        }
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{title}</div>
          {tag && <span style={{ fontSize: '0.875rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(226,0,26,0.08)', color: '#e2001a', fontWeight: 600 }}>{tag}</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Screenshot showcase ────────────────────────────────────────────────────── */
function ScreenshotShowcase({ t }) {
  const SCREENSHOTS = [
    { src: 'ana_live_traffic.png',    labelKey: 'liveTraffic'  },
    { src: 'ana_pmd.png',             labelKey: 'premiumMap'   },
    { src: 'ana_ev_charging.png',     labelKey: 'evCharging'   },
    { src: 'ana_automatic_routes.png',labelKey: 'ldEvRoute'    },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {SCREENSHOTS.map(({ src, labelKey }) => (
        <div key={src} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ height: 180, overflow: 'hidden', background: '#0d1117' }}>
            <img
              src={`${BASE}${src}`}
              alt={t(`anaIntro.screenshots.${labelKey}.label`)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{t(`anaIntro.screenshots.${labelKey}.label`)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{t(`anaIntro.screenshots.${labelKey}.desc`)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function ANAIntro({ onNavigate }) {
  const { t } = useTranslation('pages');

  const FEATURES = [
    {
      src: 'ana_live_traffic.png',
      objectPosition: 'center 30%',
      title: t('anaIntro.features.driverExperience.title'),
      desc: t('anaIntro.features.driverExperience.desc'),
      pageId: 'ana-driver-experience',
    },
    {
      Thumb: ThumbVIL,
      title: t('anaIntro.features.vil.title'),
      desc: t('anaIntro.features.vil.desc'),
      pageId: 'ana-vil',
    },
    {
      Thumb: ThumbCIL,
      title: t('anaIntro.features.cil.title'),
      desc: t('anaIntro.features.cil.desc'),
      pageId: 'ana-cil',
      tag: t('anaIntro.features.cil.tag'),
    },
    {
      Thumb: ThumbTheming,
      title: t('anaIntro.features.theming.title'),
      desc: t('anaIntro.features.theming.desc'),
      pageId: 'ana-theming',
    },
    {
      src: 'ana_ev_charging.png',
      objectPosition: 'center 20%',
      title: t('anaIntro.features.evSupport.title'),
      desc: t('anaIntro.features.evSupport.desc'),
      pageId: 'ana-vil-ev',
      tag: t('anaIntro.features.evSupport.tag'),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('anaIntro.title')}</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        {t('anaIntro.quickAnswer')}
      </p>

      {/* Hero — real ANA UI screenshot */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, border: '1px solid var(--border)' }}>
        <img
          src={`${BASE}ana_live_traffic.png`}
          alt={t('anaIntro.heroAlt')}
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* When to choose ANA */}
      <div className="zone">
        <h2 className="sh" id="ana-when">{t('anaIntro.whenTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.fastTimeToMarket.title')}>
            {t('anaIntro.whenCards.fastTimeToMarket.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.tomtomMaintained.title')}>
            {t('anaIntro.whenCards.tomtomMaintained.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.fullEvSupport.title')}>
            {t('anaIntro.whenCards.fullEvSupport.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.aaOsCertified.title')}>
            {t('anaIntro.whenCards.aaOsCertified.desc')}
          </WhenCard>
          <WhenCard icon="⚠️" title={t('anaIntro.whenCards.limitedCustomisation.title')}>
            {t('anaIntro.whenCards.limitedCustomisation.descPart1')}
            <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>{t('anaIntro.whenCards.limitedCustomisation.uxLibraryLink')}</DocLink>
            {t('anaIntro.whenCards.limitedCustomisation.descPart2')}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>{t('anaIntro.whenCards.limitedCustomisation.navSdkLink')}</DocLink>
            {t('anaIntro.whenCards.limitedCustomisation.descPart3')}
          </WhenCard>
          <WhenCard icon="⚠️" title={t('anaIntro.whenCards.apkDependency.title')}>
            {t('anaIntro.whenCards.apkDependency.desc')}
          </WhenCard>
        </div>
      </div>

      {/* Screenshot showcase */}
      <div className="zone">
        <h2 className="sh" id="ana-screenshots">{t('anaIntro.screenshotsTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {t('anaIntro.screenshotsSubtitle')}
        </p>
        <ScreenshotShowcase t={t} />
      </div>

      {/* Features */}
      <div className="zone">
        <h2 className="sh" id="ana-features">{t('anaIntro.featuresTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {t('anaIntro.featuresSubtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.pageId} {...f} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Integration architecture */}
      <div className="zone">
        <h2 className="sh" id="ana-arch">{t('anaIntro.archTitle')}</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          {t('anaIntro.archBody')}
        </p>
        <IntegrationDiagram t={t} />
      </div>

      {/* Getting started CTA */}
      <div className="zone">
        <h2 className="sh" id="ana-start">{t('anaIntro.readyTitle')}</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {t('anaIntro.readyBody')}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('ana-system-overview')}
          >
            {t('anaIntro.ctaSystemOverview')}
          </button>
          <button
            className="page-action-btn"
            onClick={() => onNavigate?.('ana-quick-start')}
          >
            {t('anaIntro.ctaQuickStart')}
          </button>
        </div>
      </div>

      <Callout type="info">
        {t('anaIntro.callout')}
      </Callout>
    </div>
  );
}
