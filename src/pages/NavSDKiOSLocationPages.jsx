import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Shared map background ─────────────────────────────────────────────── */
function MapBg({ children, height = 280 }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={280} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[40, 80, 120, 160, 200, 240].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
        <path d="M0 140 Q100 120 200 140 T400 130" stroke="rgba(255,255,255,0.10)" strokeWidth="4" fill="none" />
        <path d="M160 0 Q170 80 180 140 Q190 200 200 280" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
        <path d="M160 0 Q170 80 180 140 Q190 200 200 280" stroke="rgba(255,255,255,0.09)" strokeWidth="3" fill="none" />
      </svg>
      {children}
    </div>
  );
}

/* ─── NavSDKiOSLocationQuickstart ────────────────────────────────────────── */

function LocationPulsingDot() {
  const [tick, setTick] = useState(0);
  const [pos, setPos] = useState({ x: 200, y: 140 });
  const idxRef = useRef(0);

  const PATH = [
    { x: 200, y: 140 }, { x: 220, y: 130 }, { x: 250, y: 125 },
    { x: 270, y: 135 }, { x: 290, y: 130 }, { x: 310, y: 128 },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % PATH.length;
      setPos({ ...PATH[idxRef.current] });
      setTick(t => t + 1);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <MapBg>
      {/* Accuracy ring */}
      <div style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 52, height: 52,
        borderRadius: '50%',
        background: 'rgba(226,0,26,0.12)',
        border: '1px solid rgba(226,0,26,0.3)',
        transform: 'translate(-50%,-50%)',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Pulsing ring */}
      <div key={tick} style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 28, height: 28,
        borderRadius: '50%',
        border: '2px solid rgba(226,0,26,0.6)',
        transform: 'translate(-50%,-50%)',
        animation: 'locPulse 0.9s ease-out',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: 12, height: 12,
        borderRadius: '50%',
        background: '#e2001a',
        border: '2px solid white',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 8px rgba(226,0,26,0.5)',
        transition: 'left 0.9s ease, top 0.9s ease',
      }} />
      {/* Coords badge */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'monospace',
        fontSize: '0.75rem', color: '#94a3b8',
      }}>
        <span style={{ color: '#e2001a' }}>lat</span> {(52.3676 + idxRef.current * 0.0002).toFixed(6)}
        {'  '}
        <span style={{ color: '#e2001a' }}>lon</span> {(4.9041 + idxRef.current * 0.0003).toFixed(6)}
      </div>
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '5px 10px',
        border: '1px solid rgba(255,255,255,0.12)',
        fontSize: '0.75rem', color: '#94a3b8',
      }}>
        <span style={{ color: '#4ade80' }}>●</span> GPS active
      </div>
      <style>{`@keyframes locPulse { 0%{opacity:0.9;transform:translate(-50%,-50%) scale(0.5)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2.2)} }`}</style>
    </MapBg>
  );
}

const SW_LOCATION = `// 1. Add to Info.plist:
// NSLocationWhenInUseUsageDescription  → "Used for turn-by-turn navigation"
// NSLocationAlwaysAndWhenInUseUsageDescription  ← for background guidance

import TomTomSDKLocationProvider
import CoreLocation

let locationProvider = DefaultCLLocationProvider()
locationProvider.requestPermission()   // triggers system dialog
locationProvider.start()

// Observe updates
locationProvider.addObserver(self)

extension ViewController: LocationProviderObserver {
    func locationProvider(_ provider: LocationProvider,
                          didUpdateLocations locations: [GeoLocation]) {
        guard let location = locations.last else { return }
        map.centerOn(coordinate: location.coordinate)
        print("Lat: \\(location.coordinate.latitude), " +
              "Lon: \\(location.coordinate.longitude), " +
              "Accuracy: \\(location.accuracy ?? 0)m")
    }
}`;

export function NavSDKiOSLocationQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Location Provider</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Set up <code>DefaultCLLocationProvider</code> to stream device position into the Navigation
        SDK. Request CoreLocation permission, start updates, and conform to
        <code> LocationProviderObserver</code> to receive <code>GeoLocation</code> events.
      </p>

      <div className="zone">
        <h2 className="sh" id="location-overview">Overview</h2>
        <p className="body">
          The <code>DefaultCLLocationProvider</code> wraps CoreLocation's <code>CLLocationManager</code>
          and feeds a continuous stream of <code>GeoLocation</code> objects into the Navigation SDK.
          Every navigation component — routing, lane guidance, ETA calculation — consumes this stream
          automatically once started.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-permissions">Permissions setup</h2>
        <p className="body">
          iOS uses a combined <code>WhenInUse</code> / <code>AlwaysAndWhenInUse</code> permission model
          through CoreLocation. The system prompts the user with a single dialog, and they choose the
          level of access. Declare both keys in <code>Info.plist</code>.
        </p>
        <Callout type="info">
          Background location (<em>Always</em>) allows guidance when the screen is off. The user
          may downgrade this to <em>While Using</em> at any time via Settings. Design your app to
          gracefully handle the reduced permission level.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-demo">Live position demo</h2>
        <p className="body">
          The dot below simulates a device moving along a road segment with a pulsing accuracy ring.
          Coordinates update every 900 ms, matching a typical GPS cadence.
        </p>
        <LocationPulsingDot />
      </div>

      <div className="zone">
        <h2 className="sh" id="location-code">Implementation</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_LOCATION}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-background">Background location</h2>
        <p className="body">
          Enable the <strong>Location updates</strong> background mode in your target's
          <em> Signing &amp; Capabilities</em> tab. Without it, CoreLocation pauses updates when
          the app is suspended, interrupting turn-by-turn guidance.
        </p>
        <table className="prop-table">
          <thead><tr><th>Permission</th><th>Info.plist key</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['When in Use', 'NSLocationWhenInUseUsageDescription', 'Sufficient for foreground-only navigation'],
              ['Always', 'NSLocationAlwaysAndWhenInUseUsageDescription', 'Required for background guidance; user may downgrade'],
            ].map(([perm, key, note]) => (
              <tr key={perm}>
                <td style={{ fontWeight: 500 }}>{perm}</td>
                <td><code style={{ fontSize: '0.7rem' }}>{key}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="location-stop">Stopping updates</h2>
        <CodeBlock tabs={['Swift']}>
          {`// Stop location updates when navigation ends or view is dismissed
locationProvider.stop()
locationProvider.removeObserver(self)

// In deinit
deinit {
    locationProvider.stop()
}`}
        </CodeBlock>
      </div>
    </div>
  );
}
