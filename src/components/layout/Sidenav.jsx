import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/* ─── Tree connector icons (CSS, stretch to item height) ─────────────────────── */
const CONNECTOR_COLOR = '#D4D4D4';

function CornerConnector() {
  return (
    <div style={{ width: 16, alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: 7,
        top: 0,
        width: 9,
        height: 'calc(50% + 1px)',
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
      <div style={{
        position: 'absolute',
        left: 7,
        top: 0,
        bottom: 0,
        width: 1.5,
        background: CONNECTOR_COLOR,
      }} />
      <div style={{
        position: 'absolute',
        left: 7,
        top: '50%',
        right: 0,
        height: 1.5,
        background: CONNECTOR_COLOR,
        transform: 'translateY(-50%)',
      }} />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: 'transform 0.15s' }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.9999 11.1011L3.41064 6.51189L4.58916 5.33337L7.9999 8.74412L11.4106 5.33337L12.5892 6.51189L7.9999 11.1011Z" fill="#5C5C5C"/>
    </svg>
  );
}

/* ─── Nav group ──────────────────────────────────────────────────────────────── */
function NavGroup({ group, currentPage, onNavigate, plumbing, isOpen, onToggle }) {
  const { t } = useTranslation('common');

  const groupLabel = group.key
    ? t(`nav.groups.${group.key}`, { defaultValue: group.label })
    : group.label;

  // Groups with a landingId: label navigates, chevron toggles.
  // Groups without: whole header toggles.
  const handleLabelClick = () => {
    if (group.landingId) {
      onNavigate(group.landingId);
      onToggle(true); // always open when navigating to landing
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
        {plumbing && <span style={{ marginRight: 5, fontSize: '0.8rem' }}>⚙</span>}
        <span className="sidenav-label-text">{groupLabel}</span>
        <span className="sidenav-chevron-wrap" onClick={handleChevronClick}>
          <ChevronIcon />
        </span>
      </div>
      <div className={`sidenav-items${isOpen ? ' open' : ''}`}>
        {group.items.map((item, idx) => {
          const isLast = idx === group.items.length - 1;
          const isActive = currentPage === item.id;
          const itemLabel = t(`nav.items.${item.id}`, { defaultValue: item.label });
          return (
            <span
              key={item.id}
              className={`sidenav-item${isActive ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {isLast ? <CornerConnector /> : <TeeConnector />}
              <span className="sidenav-item-label">{itemLabel}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sidenav ────────────────────────────────────────────────────────────────── */
export default function Sidenav({ currentPage, onNavigate, drawerOpen = false, onDrawerClose, isDark, onToggleTheme, title, nav }) {
  const { t } = useTranslation('common');

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('ux-lang', next);
  };

  // Derive the key of whichever group contains the active page
  const activeGroupKey = (nav || []).find(
    e => e.type === 'group' && (
      e.items?.some(item => item.id === currentPage) ||
      e.landingId === currentPage
    )
  )?.key ?? null;

  const [openKey, setOpenKey] = useState(activeGroupKey);

  // When navigation changes the active page, open that group
  useEffect(() => {
    if (activeGroupKey) setOpenKey(activeGroupKey);
  }, [activeGroupKey]);

  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onDrawerClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen, onDrawerClose]);

  const handleToggle = useCallback((groupKey, forceOpen) => {
    setOpenKey(prev => {
      if (forceOpen) return groupKey;
      return prev === groupKey ? null : groupKey;
    });
  }, []);

  const navContent = (
    <>
      {(nav || []).map((entry, i) => {
        if (entry.type === 'top') {
          const label = t(`nav.${entry.id}`, { defaultValue: entry.label });
          return (
            <span
              key={entry.id}
              className={`sidenav-top-link${currentPage === entry.id ? ' active' : ''}`}
              onClick={() => onNavigate(entry.id)}
            >
              {label}
            </span>
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
          />
        );
      })}
    </>
  );

  return (
    <>
      {/* Normal sidenav — visible in grid on desktop/tablet */}
      <aside className="sidenav">
        {navContent}
      </aside>

      {/* Drawer overlay — mobile only */}
      {drawerOpen && (
        <div className="sidenav-drawer-backdrop" onClick={onDrawerClose} aria-hidden="true" />
      )}
      <aside className={`sidenav sidenav-drawer${drawerOpen ? ' sidenav-drawer--open' : ''}`}>
        <div className="sidenav-drawer-header">
          <div className="sidenav-drawer-header-actions">
            <button className="lang-toggle" onClick={toggleLang} title="Switch language" aria-label="Switch language">
              {t('ui.langToggle')}
            </button>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label={isDark ? t('ui.switchToLight') : t('ui.switchToDark')}>
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
              <line x1="1" y1="1" x2="11" y2="11"/>
              <line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
            Close
          </button>
        </div>

        {/* Scrollable nav list */}
        <div className="sidenav-drawer-scroll">
          {title && <div className="sidenav-drawer-title">{title}</div>}
          {navContent}
        </div>

        {/* Sticky footer — Private badge + version, docked to bottom */}
        <div className="sidenav-drawer-footer">
          <span className="topnav-badge">{t('ui.private')}</span>
          <span className="topnav-version">{t('ui.version')}</span>
        </div>
      </aside>
    </>
  );
}
