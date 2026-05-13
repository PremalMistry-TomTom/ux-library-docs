/* ─── VersionTabBar ─────────────────────────────────────────────────────────
   Shared tab strip for routing API endpoint pages.
   Shows one tab per version with identity colour and status badge.
   Single-version endpoints pass a one-element array — the tab renders as
   a non-interactive indicator communicating which version owns the page.
──────────────────────────────────────────────────────────────────────────── */

/* Version identity — hardcoded brand colours, not CSS tokens */
export const VERSION_META = {
  v1: { label: 'V1', badge: 'Production',      color: '#22c55e', badgeColor: '#166534', badgeBg: '#dcfce7' },
  v2: { label: 'V2', badge: 'Public Preview',  color: '#a78bfa', badgeColor: '#5b21b6', badgeBg: '#ede9fe' },
  v3: { label: 'V3', badge: 'Private Preview', color: '#fb923c', badgeColor: '#7c2d12', badgeBg: '#fed7aa' },
};

export default function VersionTabBar({ versions, activeTab, onTabChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--border)',
      width: '100%',
      marginTop: 4,
    }}>
      {versions.map((vKey) => {
        const v = VERSION_META[vKey];
        const isActive = activeTab === vKey;
        return (
          <button
            key={vKey}
            onClick={() => onTabChange(vKey)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? `2px solid ${v.color}` : '2px solid transparent',
              marginBottom: -1,
              cursor: versions.length > 1 ? 'pointer' : 'default',
              color: isActive ? v.color : 'var(--muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontWeight: 700 }}>{v.label}</span>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 99,
              background: isActive ? v.badgeBg : 'var(--surface, var(--bg))',
              color: isActive ? v.badgeColor : 'var(--muted)',
              border: `1px solid ${isActive ? 'transparent' : 'var(--border)'}`,
              transition: 'background 0.15s, color 0.15s',
            }}>
              {v.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
