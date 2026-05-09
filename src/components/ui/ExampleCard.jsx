/* ── Tag pill — Playbook semantic tokens ─────────────────────────────────── */
const TAG_STYLES = {
  start:       { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  custom:      { bg: 'var(--info-bg)',    color: 'var(--info-text)'    },
  playground:  { bg: 'var(--warn-bg)',    color: 'var(--warn-text)'    },
  feature:     { bg: 'var(--bg)',         color: 'var(--muted)'        },
  platform:    { bg: 'var(--bg)',         color: 'var(--muted)'        },
};

function Tag({ label, variant = 'feature' }) {
  const s = TAG_STYLES[variant] || TAG_STYLES.feature;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 99,
      fontSize: '0.625rem', fontWeight: 600, lineHeight: '16px',
      background: s.bg, color: s.color,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* ── Main component ────────────────────────────────────────────────────────── */
/**
 * ExampleCard — entire card is a link to the live demo.
 *
 * Props:
 *   title       string
 *   description string
 *   href        string   – URL to live example on docs.tomtom.com
 *   tags        Array<{ label, variant }>
 *   Thumb       React component — SVG map illustration for the card thumbnail
 *   imgSrc      string   – static image path (takes priority over Thumb)
 */
const BASE = import.meta.env.BASE_URL;

export default function ExampleCard({ title, description, href, tags = [], Thumb, imgSrc }) {
  const resolvedSrc = imgSrc ? `${BASE}${imgSrc.replace(/^\//, '')}` : null;
  return (
    <a
      className="nav-card example-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Thumbnail */}
      <div className="example-card-thumb">
        {resolvedSrc
          ? <img src={resolvedSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : Thumb && <Thumb />}
      </div>

      {/* Body */}
      <div className="example-card-body">
        <span className="example-card-title">{title}</span>
        <p className="example-card-desc">{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="example-card-tags">
            {tags.map(t => <Tag key={t.label} label={t.label} variant={t.variant} />)}
          </div>
        )}
      </div>
    </a>
  );
}
