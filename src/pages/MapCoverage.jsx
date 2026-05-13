import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';

export default function MapCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API — Market Coverage</h1>
        <PageActions pageId="map-coverage" pageTitle="Map Display API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Map Display API provides map tiles for the entire world at multiple zoom levels. Street-level
        map data, satellite imagery, and hillshade are available for a broad range of markets. Coverage
        quality varies by region.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Global Coverage</h2>
        <p>
          The Map Display API provides global coverage with varying levels of detail:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Street maps</strong> — Available globally at zoom levels 0–22.</li>
          <li><strong>Satellite imagery</strong> — Available globally at zoom levels 0–19.</li>
          <li><strong>Hillshade</strong> — Available globally at zoom levels 0–13.</li>
          <li><strong>High-detail street data</strong> — Coverage varies by market. Western Europe, North America, Australia, Japan, and South Korea typically have the highest detail levels.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="tile-levels">Coverage by Region</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Region', 'Street Maps', 'Satellite', 'Hillshade', 'Max Zoom Detail'].map(h => (
                <th key={h} style={h === 'Region' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Western Europe', CHECK, CHECK, CHECK, 'Level 22'],
              ['Eastern Europe', CHECK, CHECK, CHECK, 'Level 20–22'],
              ['North America', CHECK, CHECK, CHECK, 'Level 22'],
              ['Latin America', CHECK, CHECK, CHECK, 'Level 16–22'],
              ['Australia / NZ', CHECK, CHECK, CHECK, 'Level 22'],
              ['Japan / S. Korea', CHECK, CHECK, CHECK, 'Level 22'],
              ['South / SE Asia', CHECK, CHECK, CHECK, 'Level 16–20'],
              ['China', CHECK, CHECK, CHECK, 'Level 16–20'],
              ['Middle East', CHECK, CHECK, CHECK, 'Level 16–20'],
              ['Africa', CHECK, CHECK, CHECK, 'Level 12–18'],
            ].map(([region, street, sat, hill, zoom]) => (
              <tr key={region}>
                <td style={tdLeft}>{region}</td>
                <td style={tdStyle}>{street}</td>
                <td style={tdStyle}>{sat}</td>
                <td style={tdStyle}>{hill}</td>
                <td style={tdLeft}>{zoom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Full coverage data">
        For detailed country-level coverage information, refer to the{' '}
        <a href="https://developer.tomtom.com/map-display-api/documentation/tomtom-maps/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>Map Display API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
