/* ─── ApiLinks + ApiRef ─────────────────────────────────────────────────────
 *
 *  ApiLinks  — page-top (or section) block listing all referenced APIs.
 *              Pass an array of { name, type, description, url?, pageId?, productId? } objects.
 *              Items with pageId/productId navigate internally via onNavigate prop.
 *              Items with url navigate externally (open in new tab).
 *
 *  ApiRef    — inline chip linking a single API within prose or code context.
 *              Usage: <ApiRef name="LDEVR API" url="https://..." />
 *
 * ─────────────────────────────────────────────────────────────────────────── */

const TYPE_COLORS = {
  'REST API':     { bg: '#fff5f5', border: '#fecaca', text: '#c0392b' },
  'Android SDK':  { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  'iOS SDK':      { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  'Web SDK':      { bg: '#fefce8', border: '#fde68a', text: '#b45309' },
  'Tool':         { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
};

const DEFAULT_COLOR = { bg: '#f8f8f8', border: '#e0e0e0', text: '#444' };

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
      <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const MAX_COLS = 4;

export function ApiLinks({ items = [], title = 'APIs used on this page', onNavigate }) {
  // Pad the last row only when there IS a second row — single-row layouts need no spacers
  const hasMultipleRows = items.length > MAX_COLS;
  const remainder       = items.length % MAX_COLS;
  const spacers         = hasMultipleRows && remainder !== 0 ? MAX_COLS - remainder : 0;

  return (
    <div className="api-links-block">
      <div className="api-links-header">{title}</div>
      <div className="api-links-grid">
        {items.map(item => {
          const col = TYPE_COLORS[item.type] || DEFAULT_COLOR;
          const isInternal = !!(item.pageId && onNavigate);

          const cardContent = (
            <>
              <div className="api-links-card-top">
                <span className="api-links-name">{item.name}</span>
                {isInternal ? <InternalIcon /> : <ExternalIcon />}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                {item.description && (
                  <span className="api-links-desc">{item.description}</span>
                )}
                <span className="api-links-badge" style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>
                  {item.type}
                </span>
              </div>
            </>
          );

          if (isInternal) {
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.pageId, item.productId)}
                className="api-links-card api-links-card--internal"
                style={{ textAlign: 'left', background: 'none', cursor: 'pointer' }}
              >
                {cardContent}
              </button>
            );
          }

          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="api-links-card"
            >
              {cardContent}
            </a>
          );
        })}
        {Array.from({ length: spacers }, (_, i) => (
          <div key={`spacer-${i}`} className="api-links-spacer" />
        ))}
      </div>
    </div>
  );
}

export function ApiRef({ name, url, type }) {
  const col = type ? (TYPE_COLORS[type] || DEFAULT_COLOR) : DEFAULT_COLOR;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="api-ref-chip"
      style={type ? { background: col.bg, borderColor: col.border, color: col.text } : {}}
    >
      {name}
      <ExternalIcon />
    </a>
  );
}
