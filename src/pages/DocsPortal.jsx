import { useState } from 'react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const TABS = ['Navigation', 'Maps', 'Places', 'Traffic', 'Mobility'];

const PRODUCTS = {
  Navigation: [
    { name: 'ADAS SDK',                    desc: 'Bring ISA-compliant TomTom ADAS data to your vehicle and efficiently augment your existing navigation.' },
    { name: 'Automotive Navigation App',   desc: 'A fully featured, customisable navigation experience built for automotive OEM integration.' },
    { name: 'Long Distance EV Routing API',desc: 'Plan optimised long-distance EV routes with automatic charging stop suggestions.' },
    { name: 'Maps & Navigation SDK',       desc: 'Full-featured maps and navigation SDK for Android and iOS automotive applications.' },
    { name: 'Matrix Routing v2 API',       desc: 'Calculate travel times and distances between multiple origins and destinations simultaneously.' },
    { name: 'Routing API',                 desc: 'Get highly accurate routes with real-time traffic, multi-modal options, and advanced guidance.' },
    { name: 'Waypoint Optimization API',   desc: 'Find the optimal order of waypoints for efficient multi-stop route planning.' },
  ],
  Maps: [
    { name: 'Global Entity Matcher',       desc: 'Match geographic entities across datasets using TomTom\'s global map data.' },
    { name: 'Map Display API',             desc: 'Embed beautiful, customisable TomTom maps into your web or mobile application.' },
    { name: 'Map Feedback API',            desc: 'Collect and submit user map corrections directly to TomTom\'s map team.' },
    { name: 'Maps SDK for JavaScript',     desc: 'A powerful JavaScript SDK for building interactive web map applications.' },
  ],
  Places: [
    { name: 'Batch Search API',            desc: 'Run multiple search queries simultaneously for high-volume location data workflows.' },
    { name: 'EV Search API',               desc: 'Find EV charging stations by connector type, power level, and real-time availability.' },
    { name: 'Geocoding API',               desc: 'Convert addresses to geographic coordinates and vice versa with global coverage.' },
    { name: 'Points of Interest Details API', desc: 'Retrieve rich POI details including opening hours, contacts, and categories.' },
    { name: 'Points of Interest Photos API', desc: 'Access curated photos for points of interest from TomTom\'s global POI database.' },
    { name: 'Premium Geocoding API',       desc: 'High-precision geocoding with enhanced address parsing and confidence scoring.' },
    { name: 'Reverse Geocoding API',       desc: 'Convert geographic coordinates into human-readable addresses and place names.' },
    { name: 'Search API',                  desc: 'Powerful fuzzy search across addresses, POIs, and geographic features worldwide.' },
  ],
  Traffic: [
    { name: 'Area Analytics API',          desc: 'Analyse traffic patterns and congestion metrics for defined geographic areas.' },
    { name: 'Connected Services API',      desc: 'Real-time connected vehicle services powered by live traffic and map data.' },
    { name: 'Intermediate Traffic API',    desc: 'Access detailed traffic flow data for intermediate route segments.' },
    { name: 'Junction Analytics API',      desc: 'Deep analytics on intersection performance and traffic flow.' },
    { name: 'O/D Analysis API',            desc: 'Origin-destination analysis revealing travel patterns across a road network.' },
    { name: 'Route Monitoring API',        desc: 'Monitor route conditions in real time and receive alerts on traffic changes.' },
    { name: 'Traffic API',                 desc: 'Access real-time and historical traffic flow and incident data worldwide.' },
    { name: 'Traffic Stats API',           desc: 'Historical traffic statistics for trend analysis and infrastructure planning.' },
  ],
  Mobility: [
    { name: 'Fuel Prices API',             desc: 'Access live and historical fuel price data across thousands of stations globally.' },
    { name: 'Geofencing API',              desc: 'Define geographic boundaries and receive real-time enter/exit events.' },
    { name: 'Location History API',        desc: 'Store, retrieve, and analyse device location history at scale.' },
    { name: 'Notifications API',           desc: 'Trigger location-based notifications when assets enter or leave defined zones.' },
    { name: 'On Street Parking API',       desc: 'Discover on-street parking availability and restrictions in real time.' },
    { name: 'Parking Availability API',    desc: 'Real-time off-street parking availability across thousands of locations.' },
    { name: 'Parking Prices API',          desc: 'Access parking tariff data for accurate journey cost estimation.' },
    { name: 'Snap to Roads API',           desc: 'Match raw GPS traces to the road network for clean, accurate positioning.' },
  ],
};

const TOOLS = [
  { name: 'TomTom Move Portal',            desc: 'The central hub for managing your TomTom API keys, usage, and billing.' },
  { name: 'TomTom Map Maker',              desc: 'Create and customise your own TomTom map style with an intuitive visual editor.' },
  { name: 'Figma TomTom Maps Generator',   desc: 'Generate accurate, styled TomTom map screenshots directly inside Figma.' },
  { name: 'MCP Server',                    desc: 'Integrate TomTom location services into AI agent workflows via the Model Context Protocol.' },
];

const RESOURCES = [
  { name: 'API Explorer',    desc: 'Try APIs and experiment with parameters without writing code.',          icon: <ApiIcon /> },
  { name: 'GitHub',          desc: 'Code snippets, repositories, and examples from TomTom.',               icon: <GitHubIcon /> },
  { name: 'Knowledge Base',  desc: 'Detailed technical articles, FAQs, and in-depth guides.',              icon: <BookIcon /> },
  { name: 'Technical Support', desc: 'Get help from TomTom\'s developer support team.',                    icon: <SupportIcon /> },
];

/* ─── Icons ─────────────────────────────────────────────────────────────────── */
function ApiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="7" x2="12" y2="7"/><polyline points="8 3 12 7 8 11"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function ProductCard({ name, desc }) {
  return (
    <div className="dp-product-card">
      <div className="dp-product-name">{name}</div>
      <div className="dp-product-desc">{desc}</div>
      <span className="dp-product-link">Documentation <ArrowRight /></span>
    </div>
  );
}

function ToolCard({ name, desc }) {
  return (
    <div className="dp-tool-card">
      <div className="dp-tool-name">{name}</div>
      <div className="dp-tool-desc">{desc}</div>
      <div className="dp-tool-links">
        <span className="dp-tool-link">Documentation <ArrowRight /></span>
      </div>
    </div>
  );
}

function ResourceCard({ name, desc, icon }) {
  return (
    <div className="dp-resource-card">
      <div className="dp-resource-icon">{icon}</div>
      <div className="dp-resource-name">{name}</div>
      <div className="dp-resource-desc">{desc}</div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function DocsPortal() {
  const [activeTab, setActiveTab] = useState('Navigation');

  return (
    <div className="dp-root">

      {/* ── Hero ── */}
      <section className="dp-hero">
        <div className="dp-hero-inner">
          <h1 className="dp-hero-heading">
            Start building with TomTom APIs, SDKs,<br />and location technology.
          </h1>

          {/* Search */}
          <div className="dp-search-wrap">
            <span className="dp-search-icon"><SearchIcon /></span>
            <input
              className="dp-search-input"
              type="text"
              placeholder="Search Documentation, APIs and SDKs"
            />
          </div>

          {/* NavSDK Banner */}
          <div className="dp-navsdk-banner">
            <div className="dp-navsdk-text">
              <span className="dp-navsdk-badge">NEW</span>
              <div className="dp-navsdk-heading">Try our latest Maps and Navigation SDK</div>
              <div className="dp-navsdk-sub">Get instant access to test our automotive-grade Maps and Navigation SDK</div>
              <button className="dp-navsdk-cta">Get started <ArrowRight /></button>
            </div>
            <div className="dp-navsdk-visual">
              {/* Abstract map visual */}
              <svg viewBox="0 0 220 120" width="220" height="120" xmlns="http://www.w3.org/2000/svg">
                {/* Map background */}
                <rect width="220" height="120" fill="#1a2744" rx="8"/>
                {/* Roads */}
                <path d="M0 60 Q55 40 110 60 Q165 80 220 60" stroke="#2d4a8e" strokeWidth="8" fill="none"/>
                <path d="M0 60 Q55 40 110 60 Q165 80 220 60" stroke="#3d5faa" strokeWidth="4" fill="none" strokeDasharray="12 4"/>
                <path d="M110 0 L110 120" stroke="#2d4a8e" strokeWidth="6" fill="none"/>
                <path d="M110 0 L110 120" stroke="#3d5faa" strokeWidth="3" fill="none" strokeDasharray="10 4"/>
                <path d="M0 90 Q80 70 160 90 L220 95" stroke="#2d4a8e" strokeWidth="5" fill="none"/>
                {/* Buildings */}
                <rect x="30" y="20" width="18" height="30" fill="#243660" rx="2"/>
                <rect x="52" y="28" width="14" height="22" fill="#1e2e50" rx="2"/>
                <rect x="155" y="15" width="20" height="35" fill="#243660" rx="2"/>
                <rect x="178" y="25" width="12" height="25" fill="#1e2e50" rx="2"/>
                {/* Route line */}
                <path d="M20 100 Q90 50 190 25" stroke="#DF1B12" strokeWidth="3" fill="none" strokeDasharray="0"/>
                {/* Pin */}
                <circle cx="190" cy="25" r="7" fill="#DF1B12"/>
                <circle cx="190" cy="25" r="3" fill="white"/>
                {/* Start dot */}
                <circle cx="20" cy="100" r="5" fill="#4ade80"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="dp-products" id="products-section">
        <div className="dp-section-inner">
          <h2 className="dp-section-heading">Products</h2>

          {/* Tab bar */}
          <div className="dp-tabs" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`dp-tab${activeTab === tab ? ' dp-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="dp-product-grid">
            {PRODUCTS[activeTab].map(p => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="dp-tools">
        <div className="dp-section-inner">
          <h2 className="dp-section-heading">Tools</h2>
          <p className="dp-section-sub">Giving you access to even more environments to craft maps for your unique needs.</p>
          <div className="dp-tool-grid">
            {TOOLS.map(t => (
              <ToolCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Developer Resources ── */}
      <section className="dp-resources">
        <div className="dp-section-inner">
          <h2 className="dp-section-heading">Developer Resources</h2>
          <div className="dp-resource-grid">
            {RESOURCES.map(r => (
              <ResourceCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="dp-footer">
        <div className="dp-footer-inner">
          <div className="dp-footer-links">
            {['Careers', 'Company', 'Newsroom', 'Investors', 'Privacy Policy', 'Legal Overview', 'Cookies', 'Terms', 'Deprecation Policy'].map(l => (
              <a key={l} href="#" className="dp-footer-link" onClick={e => e.preventDefault()}>{l}</a>
            ))}
          </div>
          <div className="dp-footer-copy">Copyright © 2026 TomTom International BV. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
