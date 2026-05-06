import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/* ─── Tree connector icons ───────────────────────────────────────────────────── */
const CONNECTOR_COLOR = '#D4D4D4';

function CornerConnector() {
  return (
    <div style={{ width: 16, alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 7, top: 0,
        width: 9, height: 'calc(50% + 1px)',
        borderLeft: `1.5px solid ${CONNECTOR_COLOR}`,
        borderBottom: `1.5px solid ${CONNECTOR_COLOR}`,
        borderBottomLeftRadius: 6,
      }} />
    </div>
  );
}

function TeeConnector() {
  return (
    <div style={{ width: 16, alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1.5, background: CONNECTOR_COLOR }} />
      <div style={{ position: 'absolute', left: 7, top: '50%', right: 0, height: 1.5, background: CONNECTOR_COLOR, transform: 'translateY(-50%)' }} />
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7.9999 11.1011L3.41064 6.51189L4.58916 5.33337L7.9999 8.74412L11.4106 5.33337L12.5892 6.51189L7.9999 11.1011Z"
        fill="#5C5C5C"/>
    </svg>
  );
}

/* ─── Anchor sub-item list — reuses sidenav-item styles ─────────────────────── */
const METHOD_PILL_COLORS = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149', PUT: '#f59e0b' };

function AnchorItems({ anchors, activeAnchor, onAnchorClick, open, extraIndent = false }) {
  return (
    <div className={`sidenav-items${open ? ' open' : ''}`}
      style={extraIndent ? { paddingLeft: 24 } : undefined}>
      {anchors.map((anchor, ai) => {
        const isLast = ai === anchors.length - 1;
        const mc = anchor.method ? METHOD_PILL_COLORS[anchor.method] : null;
        return (
          <span
            key={anchor.id}
            className={`sidenav-item${activeAnchor === anchor.id ? ' active' : ''}`}
            onClick={() => onAnchorClick(anchor.id)}
          >
            {isLast ? <CornerConnector /> : <TeeConnector />}
            <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <span style={{ flex: 1 }}>{anchor.label}</span>
              {mc && (
                <span style={{
                  fontSize: '0.5rem', fontWeight: 700, padding: '2px 5px', borderRadius: 3,
                  background: `${mc}22`, color: mc,
                  fontFamily: 'monospace', letterSpacing: '0.05em', flexShrink: 0,
                }}>
                  {anchor.method}
                </span>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* ─── Nav group ──────────────────────────────────────────────────────────────── */
function NavGroup({ group, currentPage, onNavigate, plumbing, isOpen, onToggle,
                    activeAnchor, onAnchorClick, anchorOpenId, onAnchorToggle }) {
  const { t } = useTranslation('common');

  const groupLabel = group.key
    ? t(`nav.groups.${group.key}`, { defaultValue: group.label })
    : group.label;

  const handleLabelClick = () => {
    if (group.landingId) {
      onNavigate(group.landingId);
      onToggle(true);
    } else {
      onToggle(!isOpen);
    }
  };

  const handleChevronClick = (e) => {
    e.stopPropagation();
    onToggle(!isOpen);
  };

  const isLandingActive = group.landingId === currentPage;

  return (
    <div className={`sidenav-group${plumbing ? ' sidenav-group--plumbing' : ''}`}>
      {plumbing && <div className="sidenav-plumbing-divider" />}
      <div
        className={`sidenav-label${isOpen ? ' open' : ''}${isLandingActive ? ' landing-active' : ''}`}
        onClick={handleLabelClick}
        style={plumbing ? { opacity: 0.6 } : undefined}
      >
        {plumbing && <span style={{ marginRight: 5, fontSize: '0.75rem' }}>⚙</span>}
        <span className="sidenav-label-text">{groupLabel}</span>
        <span className="sidenav-chevron-wrap" onClick={handleChevronClick}>
          <ChevronIcon open={isOpen} />
        </span>
      </div>

      <div className={`sidenav-items${isOpen ? ' open' : ''}`}>
        {group.items.map((item, idx) => {
          const isActive   = currentPage === item.id;
          const isLast     = idx === group.items.length - 1;
          const hasAnchors = item.anchors?.length > 0;
          const anchorOpen = hasAnchors && anchorOpenId === item.id;
          const itemLabel  = t(`nav.items.${item.id}`, { defaultValue: item.label });

          const handleItemClick = () => {
            if (hasAnchors) {
              if (isActive) {
                // toggle when already on this page
                onAnchorToggle(anchorOpen ? null : item.id);
              } else {
                onNavigate(item.id);
                onAnchorToggle(item.id);
              }
            } else {
              onNavigate(item.id);
            }
          };

          return (
            <Fragment key={item.id}>
              <span
                className={`sidenav-item${isActive ? ' active' : ''}`}
                onClick={handleItemClick}
              >
                {/* Use corner only on true-last item that has no open sub-list */}
                {isLast && !anchorOpen ? <CornerConnector /> : <TeeConnector />}
                <span className="sidenav-item-label">{itemLabel}</span>
                {hasAnchors && <ChevronIcon open={anchorOpen} />}
              </span>

              {hasAnchors && (
                <AnchorItems
                  anchors={item.anchors}
                  activeAnchor={activeAnchor}
                  onAnchorClick={onAnchorClick}
                  open={anchorOpen}
                  extraIndent
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sidenav ────────────────────────────────────────────────────────────────── */
export default function Sidenav({ currentPage, onNavigate, drawerOpen = false,
                                  onDrawerClose, isDark, onToggleTheme, title, nav }) {
  const { t } = useTranslation('common');

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('ux-lang', next);
  };

  /* ── Group open/close ── */
  const activeGroupKey = (nav || []).find(
    e => e.type === 'group' && (
      e.items?.some(item => item.id === currentPage) ||
      e.landingId === currentPage
    )
  )?.key ?? null;

  const [openKey, setOpenKey] = useState(activeGroupKey);
  useEffect(() => { if (activeGroupKey) setOpenKey(activeGroupKey); }, [activeGroupKey]);

  const handleToggle = useCallback((groupKey, forceOpen) => {
    setOpenKey(prev => {
      if (forceOpen) return groupKey;
      return prev === groupKey ? null : groupKey;
    });
    setAnchorOpenId(null); // close any open top-level anchor list
  }, []);

  /* ── Anchor open/close ── */
  const [anchorOpenId, setAnchorOpenId] = useState(null);

  // Find anchors for the current page (top-level or group item)
  const currentAnchors = useMemo(() => {
    for (const entry of (nav || [])) {
      if (entry.type === 'top' && entry.id === currentPage && entry.anchors?.length) {
        return entry.anchors;
      }
      if (entry.type === 'group') {
        const item = entry.items?.find(i => i.id === currentPage);
        if (item?.anchors?.length) return item.anchors;
      }
    }
    return [];
  }, [nav, currentPage]);

  // Auto-open anchor list when landing on a page that has anchors
  useEffect(() => {
    if (currentAnchors.length > 0) setAnchorOpenId(currentPage);
  }, [currentPage, currentAnchors.length]);

  /* ── Active anchor tracking ── */
  const [activeAnchor, setActiveAnchor] = useState(null);

  useEffect(() => {
    if (!currentAnchors.length) { setActiveAnchor(null); return; }
    setActiveAnchor(currentAnchors[0].id);
    let obs;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(
        (entries) => {
          const topmost = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (topmost) setActiveAnchor(topmost.target.id);
        },
        { rootMargin: '-5% 0px -60% 0px', threshold: 0 }
      );
      currentAnchors.forEach(anchor => {
        const el = document.getElementById(anchor.id);
        if (el) obs.observe(el);
      });
    }, 120);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, [currentPage, currentAnchors]);

  /* ── Scroll to anchor ── */
  const handleAnchorClick = useCallback((anchorId) => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--app-top-offset') || '102'
    );
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - 24, behavior: 'smooth' });
  }, []);

  /* ── Escape closes drawer ── */
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onDrawerClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen, onDrawerClose]);

  /* ── Nav content ── */
  const navContent = (
    <>
      {(nav || []).map((entry, i) => {
        if (entry.type === 'top') {
          const label     = t(`nav.${entry.id}`, { defaultValue: entry.label });
          const isActive  = currentPage === entry.id;
          const hasAnchors = entry.anchors?.length > 0;
          const anchorOpen = hasAnchors && anchorOpenId === entry.id;

          const handleClick = () => {
            if (hasAnchors) {
              if (isActive) {
                setAnchorOpenId(anchorOpen ? null : entry.id);
              } else {
                onNavigate(entry.id);
                setAnchorOpenId(entry.id);
              }
              setOpenKey(null); // close any open group
            } else {
              onNavigate(entry.id);
              setAnchorOpenId(null);
              setOpenKey(null);
            }
          };

          return (
            <Fragment key={entry.id}>
              <span
                className={`sidenav-top-link${isActive ? ' active' : ''}`}
                style={hasAnchors ? { display: 'flex', alignItems: 'center' } : undefined}
                onClick={handleClick}
              >
                <span style={hasAnchors ? { flex: 1 } : undefined}>{label}</span>
                {hasAnchors && <ChevronIcon open={anchorOpen} />}
              </span>
              {hasAnchors && (
                <AnchorItems
                  anchors={entry.anchors}
                  activeAnchor={activeAnchor}
                  onAnchorClick={handleAnchorClick}
                  open={anchorOpen}
                />
              )}
            </Fragment>
          );
        }

        return (
          <NavGroup
            key={entry.key ?? i}
            group={entry}
            currentPage={currentPage}
            onNavigate={onNavigate}
            plumbing={entry.plumbing}
            isOpen={openKey === entry.key}
            onToggle={(forceOpen) => handleToggle(entry.key, forceOpen)}
            activeAnchor={activeAnchor}
            onAnchorClick={handleAnchorClick}
            anchorOpenId={anchorOpenId}
            onAnchorToggle={setAnchorOpenId}
          />
        );
      })}
    </>
  );

  return (
    <>
      <aside className="sidenav">{navContent}</aside>

      {drawerOpen && (
        <div className="sidenav-drawer-backdrop" onClick={onDrawerClose} aria-hidden="true" />
      )}
      <aside className={`sidenav sidenav-drawer${drawerOpen ? ' sidenav-drawer--open' : ''}`}>
        <div className="sidenav-drawer-header">
          <div className="sidenav-drawer-header-actions">
            <button className="lang-toggle" onClick={toggleLang} title="Switch language" aria-label="Switch language">
              {t('ui.langToggle')}
            </button>
            <button className="theme-toggle" onClick={onToggleTheme}
              aria-label={isDark ? t('ui.switchToLight') : t('ui.switchToDark')}>
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
          <button className="sidenav-drawer-close" onClick={onDrawerClose} aria-label="Close navigation">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
            Close
          </button>
        </div>
        <div className="sidenav-drawer-scroll">
          {title && <div className="sidenav-drawer-title">{title}</div>}
          {navContent}
        </div>
        <div className="sidenav-drawer-footer">
          <span className="topnav-badge">{t('ui.private')}</span>
          <span className="topnav-version">{t('ui.version')}</span>
        </div>
      </aside>
    </>
  );
}
