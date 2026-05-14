import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/* ─── Nav section version badge — uses Playbook semantic tokens ──────────────── */
const NAV_VERSION_BADGES = {
  'v1':         { label: 'Production',      color: 'var(--success-text)', bg: 'var(--success-bg)' },
  'v2-public':  { label: 'Public Preview',  color: 'var(--info-text)',    bg: 'var(--info-bg)'    },
  'v3-public':  { label: 'Public Preview',  color: 'var(--info-text)',    bg: 'var(--info-bg)'    },
  'v2-private': { label: 'Private Preview', color: 'var(--warn-text)',    bg: 'var(--warn-bg)'    },
  'v3-private': { label: 'Private Preview', color: 'var(--warn-text)',    bg: 'var(--warn-bg)'    },
};

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
/* bg/color as CSS-var strings so they respond to dark-mode token overrides */
const METHOD_PILL_COLORS = {
  GET:    { bg: 'var(--info-bg)',    color: 'var(--info-text)'    },
  POST:   { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  DELETE: { bg: 'var(--danger-bg)',  color: 'var(--danger-text)'  },
  PUT:    { bg: 'var(--warn-bg)',    color: 'var(--warn-text)'    },
};

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
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onAnchorClick(anchor.id))}
            aria-current={activeAnchor === anchor.id ? 'true' : undefined}
          >
            {isLast ? <CornerConnector /> : <TeeConnector />}
            <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <span style={{ flex: 1 }}>{anchor.label}</span>
              {mc && (
                <span style={{
                  fontSize: '0.5rem', fontWeight: 700, padding: '2px 5px', borderRadius: 3,
                  background: mc.bg, color: mc.color,
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
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleLabelClick())}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
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

          // Suppress parent highlight when a child anchor is the active item
          const showAsActive = isActive && !(anchorOpen && activeAnchor);

          return (
            <Fragment key={item.id}>
              <span
                className={`sidenav-item${showAsActive ? ' active' : ''}`}
                onClick={handleItemClick}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleItemClick())}
                role="button"
                tabIndex={0}
                aria-current={showAsActive ? 'page' : undefined}
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
                                  onDrawerClose, isDark, onToggleTheme, title, nav,
                                  navCollapsed = false, onCollapse }) {
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
  const [versionFilter, setVersionFilter] = useState('all');
  useEffect(() => { if (activeGroupKey) setOpenKey(activeGroupKey); }, [activeGroupKey]);

  // Reset the version filter whenever the nav switches to one that has no filter control
  // (e.g. switching from Option C → B should not leave the filter stuck on v3)
  const hasVersionFilter = nav.some(e => e.type === 'version-filter');
  useEffect(() => { if (!hasVersionFilter) setVersionFilter('all'); }, [hasVersionFilter]);

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
    setActiveAnchor(null);

    const getStickThreshold = () =>
      parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--app-top-offset') || '102') + 28;

    let rafId;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // At the very top: highlight the page title, not any anchor
        if (window.scrollY < 80) { setActiveAnchor(null); return; }
        const threshold = getStickThreshold();
        // Walk anchors in reverse — first one whose top has reached/passed the
        // sticky line is the section currently pinned at the top
        const active = [...currentAnchors].reverse().find(a => {
          const el = document.getElementById(a.id);
          return el && el.getBoundingClientRect().top <= threshold;
        });
        setActiveAnchor(active ? active.id : null);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run immediately in case the page is already scrolled (e.g. back-navigation)
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentPage, currentAnchors]);

  /* ── Scroll to anchor ── */
  const handleAnchorClick = useCallback((anchorId) => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--app-top-offset') || '102'
    );
    // Highlight immediately on click — don't wait for the scroll listener to catch up
    setActiveAnchor(anchorId);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - 24 });
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
        if (entry.type === 'section') {
          const badgeCfg = entry.badge ? NAV_VERSION_BADGES[entry.badge] : null;
          return (
            <div key={`section-${i}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 10px 4px',
              userSelect: 'none',
            }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                {entry.label}
              </span>
              {badgeCfg && (
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  padding: '2px 7px', borderRadius: 4,
                  background: badgeCfg.bg, color: badgeCfg.color,
                  whiteSpace: 'nowrap',
                }}>
                  {badgeCfg.label}
                </span>
              )}
            </div>
          );
        }

        if (entry.type === 'version-filter') {
          const VF_COLORS = {
            v1: { active: '#22c55e', activeBg: 'rgba(34,  197,  94, 0.15)' },
            v2: { active: '#a78bfa', activeBg: 'rgba(167, 139, 250, 0.15)' },
            v3: { active: '#fb923c', activeBg: 'rgba(251, 146,  60, 0.15)' },
          };
          return (
            <div key="version-filter" style={{ padding: '6px 10px 8px' }}>
              <div style={{ display: 'flex', borderRadius: 6, border: '1px solid var(--border)', overflow: 'hidden' }}>
                {['all','v1','v2','v3'].map((v, vi) => {
                  const isActive = versionFilter === v;
                  const vc = VF_COLORS[v];
                  return (
                    <button key={v} onClick={() => setVersionFilter(v)} style={{
                      flex: 1, padding: '4px 0',
                      border: 'none',
                      borderRight: vi < 3 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      fontSize: '0.6rem', fontWeight: 700,
                      background: isActive ? (v === 'all' ? 'var(--text)' : vc.activeBg) : 'transparent',
                      color:      isActive ? (v === 'all' ? 'var(--bg)'   : vc.active)   : 'var(--muted)',
                      transition: 'all 0.1s',
                    }}>
                      {v === 'all' ? 'All' : v.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (entry.type === 'top') {
          // Hide when version filter is active and this endpoint doesn't match
          if (entry.vDots && versionFilter !== 'all' && !entry.vDots.includes(versionFilter)) {
            return null;
          }
          const label     = t(`nav.${entry.id}`, { defaultValue: entry.label });
          const isActive  = currentPage === entry.id;
          const hasAnchors = entry.anchors?.length > 0;
          const anchorOpen = hasAnchors && anchorOpenId === entry.id;
          const showAsActive = isActive && !(anchorOpen && activeAnchor);

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
                className={`sidenav-top-link${showAsActive ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={handleClick}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleClick())}
                role="button"
                tabIndex={0}
                aria-current={showAsActive ? 'page' : undefined}
              >
                <span style={{ flex: 1 }}>{label}</span>
                {entry.ref && (
                  <span style={{
                    fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px',
                    borderRadius: 3, background: 'var(--info-bg)',
                    color: 'var(--info-text)', fontFamily: 'monospace',
                    letterSpacing: '0.04em', flexShrink: 0,
                  }}>REF</span>
                )}
                {entry.vDots && versionFilter === 'all' && (
                  <span style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
                    {entry.vDots.map(v => (
                      <span key={v} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: v === 'v1' ? '#22c55e' : v === 'v2' ? '#a78bfa' : '#fb923c',
                      }} />
                    ))}
                  </span>
                )}
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
      <aside className={`sidenav${navCollapsed ? ' sidenav--collapsed' : ''}`} aria-label="Site navigation">
        <div className="sidenav-inner">
        {navContent}
        </div>
        {/* Collapse trigger — docked to bottom of nav */}
        <div className="sidenav-collapse-bar">
          <button
            className="sidenav-collapse-btn"
            onClick={onCollapse}
            title="Hide sidebar  [ ]"
            aria-label="Hide sidebar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 2L6 6l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div className="sidenav-drawer-backdrop" onClick={onDrawerClose} aria-hidden="true" />
      )}
      <aside className={`sidenav sidenav-drawer${drawerOpen ? ' sidenav-drawer--open' : ''}`} aria-label="Navigation drawer">
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
      </aside>
    </>
  );
}
