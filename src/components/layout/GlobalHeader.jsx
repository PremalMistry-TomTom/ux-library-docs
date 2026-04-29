/* ─────────────────────────────────────────────────────────────────────────────
 * GlobalHeader — prototype mock of the TomTom Docs global site header.
 * The TomTom logo is NOT rendered here — it lives as a shared FixedLogo element
 * in App.jsx so it stays pinned in position regardless of header scroll state.
 * Asset-accurate version can be swapped in from the TomTom design system later.
 * ───────────────────────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="6" x2="10" y2="6"/>
      <polyline points="6 2 10 6 6 10"/>
    </svg>
  );
}

const NAV_LINKS = ['Products', 'Resources', 'Pricing'];

export default function GlobalHeader({ isVisible, onMouseEnter, onMouseLeave }) {
  return (
    <header
      className={`global-header${isVisible ? '' : ' global-header--hidden'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left — divider + "Docs" label + nav links.
          Offset via CSS to start after the shared FixedLogo element. */}
      <div className="gh-left">
        <div className="gh-divider" />
        <span className="gh-product-label">Docs</span>

        <nav className="gh-nav">
          {NAV_LINKS.map(link => (
            <a key={link} href="#" className="gh-nav-link" onClick={e => e.preventDefault()}>
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Right — search, help, sign-in */}
      <div className="gh-right">
        <button className="gh-icon-btn" aria-label="Search">
          <SearchIcon />
        </button>
        <button className="gh-icon-btn" aria-label="Help">
          <HelpIcon />
        </button>
        <button className="gh-signin-btn">
          Sign in <ArrowIcon />
        </button>
      </div>
    </header>
  );
}
