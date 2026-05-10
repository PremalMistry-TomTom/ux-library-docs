/* ─────────────────────────────────────────────────────────────────────────────
 * GlobalHeader — prototype mock of the TomTom Docs global site header.
 * The TomTom logo is NOT rendered here — it lives as a shared FixedLogo element
 * in App.jsx so it stays pinned in position regardless of header scroll state.
 * Asset-accurate version can be swapped in from the TomTom design system later.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';

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

function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18"/>
          <line x1="18" y1="4" x2="4" y2="18"/>
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="19" y2="6"/>
          <line x1="3" y1="11" x2="19" y2="11"/>
          <line x1="3" y1="16" x2="19" y2="16"/>
        </>
      )}
    </svg>
  );
}

const NAV_LINKS = ['Products', 'Resources', 'Pricing'];

export default function GlobalHeader({ isVisible, onMouseEnter, onMouseLeave, onProductsClick, onDocsClick, docsPortalOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close menu on resize back to desktop */
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* Close menu when clicking outside */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.global-header')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <header
      className={`global-header${isVisible ? '' : ' global-header--hidden'}${menuOpen ? ' global-header--menu-open' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left — divider + "Docs" label + nav links (hidden on mobile) */}
      <div className="gh-left">
        <div className="gh-divider" />
        <span className="gh-product-label" style={{ cursor: 'pointer' }} onClick={() => onDocsClick?.()} role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onDocsClick?.())}>Docs</span>

        <nav className="gh-nav">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              className={`gh-nav-link${link === 'Products' && docsPortalOpen ? ' gh-nav-link--active' : ''}`}
              onClick={e => {
                e.preventDefault();
                if (link === 'Products' && onProductsClick) onProductsClick();
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Right — search always visible; help + sign-in hidden on mobile */}
      <div className="gh-right">
        <button className="gh-icon-btn" aria-label="Search">
          <SearchIcon />
        </button>
        <button className="gh-icon-btn gh-desktop-only" aria-label="Help">
          <HelpIcon />
        </button>
        <button className="gh-signin-btn gh-desktop-only">
          Sign in <ArrowIcon />
        </button>

        {/* Hamburger — mobile only */}
        <button
          className="gh-icon-btn gh-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="gh-mobile-menu">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              className={`gh-mobile-link${link === 'Products' && docsPortalOpen ? ' gh-mobile-link--active' : ''}`}
              onClick={e => {
                e.preventDefault();
                setMenuOpen(false);
                if (link === 'Products' && onProductsClick) onProductsClick();
              }}
            >
              {link}
            </a>
          ))}
          <div className="gh-mobile-divider" />
          <a href="#" className="gh-mobile-link" onClick={e => e.preventDefault()}>
            Help
          </a>
          <a href="#" className="gh-mobile-link gh-mobile-signin" onClick={e => e.preventDefault()}>
            Sign in <ArrowIcon />
          </a>
        </div>
      )}
    </header>
  );
}
