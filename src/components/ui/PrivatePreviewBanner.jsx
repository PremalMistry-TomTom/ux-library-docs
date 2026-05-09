/* ─── Private Preview banner ─────────────────────────────────────────────────
   Shown at the top of any page that covers a Private Preview API version.
   Uses Playbook-aligned info semantic tokens — no hardcoded colours.
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
    <div className="ppb-root">
      {/* Icon */}
      <div className="ppb-icon">
        <LightningIcon />
      </div>

      {/* Text */}
      <div className="ppb-body">
        <p className="ppb-title">Private Preview — {api}</p>
        <p className="ppb-desc">
          This version is currently available to selected partners only. Features, request
          formats, and response schemas are subject to change before general availability.
          Do not use in production. To request access,{' '}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="ppb-link"
          >
            contact TomTom developer support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
