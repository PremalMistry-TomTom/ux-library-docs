/* ── Tag pill ──────────────────────────────────────────────────────────────── */
const TAG_STYLES = {
  start:       { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  custom:      { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb' },
  playground:  { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
  feature:     { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  platform:    { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
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
export default function ExampleCard({ title, description, href, tags = [], Thumb, imgSrc }) {
  return (
    <a
      className="nav-card example-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Thumbnail */}
      <div className="example-card-thumb">
        {imgSrc
          ? <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
