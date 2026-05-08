/* ─── Private Preview banner ─────────────────────────────────────────────────
   Shown at the top of any page that covers a Private Preview API version.
   Mirrors the style used in TomTom external docs (EV Charge Finder pattern).
──────────────────────────────────────────────────────────────────────────── */

function LightningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/>
    </svg>
  );
}

export default function PrivatePreviewBanner({ api = 'this API' }) {
  return (
    <div style={{
      display: 'flex', gap: 14,
      padding: '16px 20px',
      marginBottom: 28,
      background: 'rgba(0,112,205,0.06)',
      border: '1px solid rgba(0,112,205,0.18)',
      borderLeft: '4px solid #0070cd',
      borderRadius: 8,
    }}>
      {/* Icon */}
      <div style={{
        flexShrink: 0,
        width: 32, height: 32,
        borderRadius: 8,
        background: '#0070cd',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
      }}>
        <LightningIcon />
      </div>

      {/* Text */}
      <div>
        <p style={{
          margin: '0 0 6px',
          fontSize: '0.9375rem', fontWeight: 700,
          color: 'var(--black)',
          lineHeight: 1.3,
        }}>
          Private Preview — {api}
        </p>
        <p style={{
          margin: 0,
          fontSize: '0.875rem', lineHeight: 1.65,
          color: 'var(--mid)',
        }}>
          This version is currently available to selected partners only. Features, request
          formats, and response schemas are subject to change before general availability.
          Do not use in production. To request access,{' '}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            style={{ color: '#0070cd', textDecoration: 'underline' }}
          >
            contact TomTom developer support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
