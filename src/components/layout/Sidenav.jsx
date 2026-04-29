import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NAV } from '../../data/navigation';

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
function NavGroup({ group, currentPage, onNavigate, plumbing }) {
  const { t } = useTranslation('common');
  const containsActive = group.items.some(item => item.id === currentPage)
    || group.landingId === currentPage;
  const [open, setOpen] = useState(group.defaultOpen || containsActive);

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [currentPage]); // re-evaluate on every navigation

  const groupLabel = group.key
    ? t(`nav.groups.${group.key}`, { defaultValue: group.label })
    : group.label;

  // Groups with a landingId: label navigates, chevron toggles.
  // Groups without: whole header toggles as before.
  const handleLabelClick = () => {
    if (group.landingId) {
      onNavigate(group.landingId);
      setOpen(true);
    } else {
      setOpen(o => !o);
    }
  };

  const handleChevronClick = (e) => {
    e.stopPropagation();
    setOpen(o => !o);
  };

  const isLandingActive = group.landingId === currentPage;

  return (
    <div className={`sidenav-group${plumbing ? ' sidenav-group--plumbing' : ''}`}>
      {plumbing && <div className="sidenav-plumbing-divider" />}
      <div
        className={`sidenav-label${open ? ' open' : ''}${isLandingActive ? ' landing-active' : ''}`}
        onClick={handleLabelClick}
        style={plumbing ? { opacity: 0.6 } : undefined}
      >
        {plumbing && <span style={{ marginRight: 5, fontSize: '0.8rem' }}>⚙</span>}
        <span className="sidenav-label-text">{groupLabel}</span>
        <span className="sidenav-chevron-wrap" onClick={handleChevronClick}>
          <ChevronIcon />
        </span>
      </div>
      <div className={`sidenav-items${open ? ' open' : ''}`}>
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
export default function Sidenav({ currentPage, onNavigate }) {
  const { t } = useTranslation('common');

  return (
    <aside className="sidenav">
      {NAV.map((entry, i) => {
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
            key={i}
            group={entry}
            currentPage={currentPage}
            onNavigate={onNavigate}
            plumbing={entry.plumbing}
          />
        );
      })}
    </aside>
  );
}
