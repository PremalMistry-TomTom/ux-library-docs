import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared helpers ─────────────────────────────────────────────────────── */
function StepCard({ number, title, children }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '16px 18px',
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
      marginBottom: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'var(--red)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8125rem', fontWeight: 700, marginTop: 2,
      }}>{number}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 6 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function RequirementRow({ req, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--mid)', minWidth: 160 }}>{req}</span>
      <code style={{ fontSize: '0.875rem', color: 'var(--black)', fontFamily: 'var(--font-mono)' }}>{value}</code>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. PROJECT SETUP (iOS)
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_PROJECT_SETUP_APIS = [
  { name: 'Initializing the SDK (iOS)', type: 'iOS SDK', description: 'TomTomSDK.start(apiKey:) initialization in AppDelegate or @main App — the step that follows dependency setup.',  pageId: 'navsdk-ios-sdk-init',    productId: 'navsdk-ios' },
  { name: 'Your First Map (iOS)',        type: 'iOS SDK', description: 'Minimal SwiftUI map example to validate that dependencies are correctly configured.',                            pageId: 'navsdk-ios-first-map',   productId: 'navsdk-ios' },
];

export function NavSDKiOSProjectSetup({ onNavigate }) {
  const [pkgManager, setPkgManager] = useState('spm');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Project Setup</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Add the TomTom NavSDK to your iOS project using Swift Package Manager or CocoaPods. Configure your API key in <code>Info.plist</code> and meet the minimum platform requirements.
      </p>

      <ApiLinks items={IOS_PROJECT_SETUP_APIS} onNavigate={onNavigate} />

      {/* Minimum requirements */}
      <div className="zone">
        <h2 className="sh" id="ios-ps-requirements">Minimum requirements</h2>
        <div style={{ maxWidth: 400 }}>
          <RequirementRow req="iOS deployment target" value="iOS 14.0+" />
          <RequirementRow req="Swift" value="5.9+" />
          <RequirementRow req="Xcode" value="15.0+" />
          <RequirementRow req="Package manager" value="Swift Package Manager or CocoaPods" />
        </div>
      </div>

      {/* Package manager toggle */}
      <div className="zone">
        <h2 className="sh" id="ios-ps-steps">Installation steps</h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[
            { id: 'spm', label: 'Swift Package Manager' },
            { id: 'cocoapods', label: 'CocoaPods' },
          ].map(p => (
            <button key={p.id} onClick={() => setPkgManager(p.id)} style={{
              padding: '7px 18px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
              fontWeight: pkgManager === p.id ? 600 : 400,
              background: pkgManager === p.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${pkgManager === p.id ? 'var(--red)' : 'var(--border)'}`,
              color: pkgManager === p.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p.label}</button>
          ))}
        </div>

        {pkgManager === 'spm' ? (
          <>
            <StepCard number="1" title="Add the package via Swift Package Manager">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                In Xcode: <strong>File &rarr; Add Package Dependencies&hellip;</strong> and enter the repository URL, or add it to <code>Package.swift</code>:
              </p>
              <CodeBlock tabs={['Swift']}>
                <pre>
                  <span className="hl-c">{'// Package.swift or Xcode File > Add Packages\n'}</span>
                  <span className="hl-c">{'// URL: https://github.com/tomtom-international/tomtom-navigation-ios\n\n'}</span>
                  <span className="hl-c">{'// Info.plist\n'}</span>
                  {'<key>TTSDKApiKey</key>\n'}
                  {'<string>$(TOMTOM_API_KEY)</string>\n'}
                  {'<key>NSLocationWhenInUseUsageDescription</key>\n'}
                  {'<string>Navigation requires your location.</string>'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="2" title="Configure the API key in Info.plist">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Add <code>TTSDKApiKey</code> to your app's <code>Info.plist</code>. Use an Xcode build setting or environment variable — never hard-code the key in source.
              </p>
              <CodeBlock tabs={['Info.plist (XML)']}>
                <pre>
                  {'<key>TTSDKApiKey</key>\n'}
                  {'<string>$(TOMTOM_API_KEY)</string>'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="3" title="Add location usage description">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Navigation requires location access. Add this key to <code>Info.plist</code>:
              </p>
              <CodeBlock tabs={['Info.plist (XML)']}>
                <pre>
                  {'<key>NSLocationWhenInUseUsageDescription</key>\n'}
                  {'<string>Navigation requires your location.</string>\n\n'}
                  {'<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>\n'}
                  {'<string>This app uses your location during active navigation.</string>'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="4" title="Build and verify">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
                Build the project (<code>&#8984;B</code>) in Xcode. Resolve any package graph errors, then proceed to SDK initialisation.
              </p>
            </StepCard>
          </>
        ) : (
          <>
            <StepCard number="1" title="Add the pod to your Podfile">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Add the TomTom NavSDK pods to your <code>Podfile</code>:
              </p>
              <CodeBlock tabs={['Podfile']}>
                <pre>
                  {'platform :ios, '}<span className="hl-s">"'14.0'"</span>{'\n\n'}
                  {'target '}<span className="hl-s">"'MyNavApp'"</span>{' do\n'}
                  {'  use_frameworks!\n\n'}
                  {"  pod 'TomTomSDKMapDisplay'\n"}
                  {"  pod 'TomTomSDKNavigation'\n"}
                  {"  pod 'TomTomSDKRouting'\n"}
                  {'end'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="2" title="Run pod install">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Run <code>pod install</code> in your project directory, then open the generated <code>.xcworkspace</code> file.
              </p>
              <CodeBlock tabs={['Shell']}>
                <pre>{'pod install\nopen MyNavApp.xcworkspace'}</pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="3" title="Configure API key and location usage">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Add <code>TTSDKApiKey</code> and location usage descriptions to <code>Info.plist</code> (same as SPM step 2–3 above).
              </p>
            </StepCard>

            <StepCard number="4" title="Build and verify">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
                Build the project in Xcode. Resolve any CocoaPods linkage issues, then proceed to SDK initialisation.
              </p>
            </StepCard>
          </>
        )}
      </div>

      <Callout type="info">
        Get your free API key at <strong>developer.tomtom.com</strong>. The same key works for both Android and iOS. Keys are scoped per product — ensure your key has <em>Navigation SDK</em> access enabled in the developer portal.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. SDK INITIALISATION (iOS)
   ═══════════════════════════════════════════════════════════════════════════ */
const IOS_SDK_INIT_APIS = [
  { name: 'Project Setup (iOS)',         type: 'iOS SDK', description: 'SPM/CocoaPods dependency configuration that makes the SDK available for initialisation.',                    pageId: 'navsdk-ios-project-setup', productId: 'navsdk-ios' },
  { name: 'Your First Map (iOS)',         type: 'iOS SDK', description: 'First map display that depends on a successful SDK initialisation.',                                         pageId: 'navsdk-ios-first-map',     productId: 'navsdk-ios' },
];

export function NavSDKiOSSdkInit({ onNavigate }) {
  const [entryPoint, setEntryPoint] = useState('swiftui');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Initializing the SDK</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Call <code>TomTomSDK.start(apiKey:)</code> once at app startup — before any map or navigation API is used. Use the <code>@main</code> App struct for SwiftUI or <code>AppDelegate</code> for UIKit.
      </p>

      <ApiLinks items={IOS_SDK_INIT_APIS} onNavigate={onNavigate} />

      {/* Entry point toggle */}
      <div className="zone">
        <h2 className="sh" id="ios-si-entrypoint">Initialisation entry point</h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[
            { id: 'swiftui', label: '@main App (SwiftUI)' },
            { id: 'uikit',   label: 'AppDelegate (UIKit)' },
          ].map(p => (
            <button key={p.id} onClick={() => setEntryPoint(p.id)} style={{
              padding: '7px 18px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
              fontWeight: entryPoint === p.id ? 600 : 400,
              background: entryPoint === p.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${entryPoint === p.id ? 'var(--red)' : 'var(--border)'}`,
              color: entryPoint === p.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p.label}</button>
          ))}
        </div>

        {entryPoint === 'swiftui' ? (
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' TomTomSDKCommon\n\n'}
              {'@'}<span className="hl-t">main</span>{'\n'}
              <span className="hl-k">struct</span>{' '}<span className="hl-t">MyApp</span>{': '}<span className="hl-t">App</span>{' {\n'}
              {'    '}<span className="hl-k">init</span>{'() {\n'}
              {'        '}<span className="hl-t">TomTomSDK</span>{'.'}<span className="hl-f">start</span>{'(apiKey: '}<span className="hl-t">Bundle</span>{'.'}<span className="hl-f">main</span>{'.object(forInfoDictionaryKey: '}<span className="hl-s">'"TTSDKApiKey"'</span>{') '}<span className="hl-k">as</span>{'! '}<span className="hl-t">String</span>{')\n'}
              {'    }\n\n'}
              {'    '}<span className="hl-k">var</span>{' body: some '}<span className="hl-t">Scene</span>{' {\n'}
              {'        '}<span className="hl-t">WindowGroup</span>{' { '}<span className="hl-t">ContentView</span>{'() }\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        ) : (
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' UIKit\n'}
              <span className="hl-k">import</span>{' TomTomSDKCommon\n\n'}
              {'@'}<span className="hl-t">UIApplicationMain</span>{'\n'}
              <span className="hl-k">class</span>{' '}<span className="hl-t">AppDelegate</span>{': '}<span className="hl-t">UIResponder</span>{', '}<span className="hl-t">UIApplicationDelegate</span>{' {\n\n'}
              {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">application</span>{'(_ application: '}<span className="hl-t">UIApplication</span>{',\n'}
              {'        didFinishLaunchingWithOptions launchOptions: ['}<span className="hl-t">UIApplication</span>{'.'}<span className="hl-t">LaunchOptionsKey</span>{': Any]?) -> '}<span className="hl-t">Bool</span>{' {\n\n'}
              {'        '}<span className="hl-k">let</span>{' apiKey = '}<span className="hl-t">Bundle</span>{'.'}<span className="hl-f">main</span>{'.object(forInfoDictionaryKey: '}<span className="hl-s">'"TTSDKApiKey"'</span>{') '}<span className="hl-k">as</span>{'! '}<span className="hl-t">String</span>{'\n'}
              {'        '}<span className="hl-t">TomTomSDK</span>{'.'}<span className="hl-f">start</span>{'(apiKey: apiKey)\n\n'}
              {'        '}<span className="hl-k">return true</span>{'\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        )}
      </div>

      {/* Location permissions */}
      <div className="zone">
        <h2 className="sh" id="ios-si-perms">Location permissions</h2>
        <p className="body">
          Request location permission before starting navigation. Always request <code>WhenInUse</code> first; upgrade to <code>Always</code> only when the user begins a navigation session.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">import</span>{' CoreLocation\n\n'}
            <span className="hl-k">class</span>{' '}<span className="hl-t">LocationPermissionManager</span>{' {\n'}
            {'    '}<span className="hl-k">private let</span>{' manager = '}<span className="hl-t">CLLocationManager</span>{'()\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">requestPermission</span>{'() {\n'}
            {'        manager.'}<span className="hl-f">requestWhenInUseAuthorization</span>{'()\n'}
            {'    }\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">requestAlwaysPermission</span>{'() {\n'}
            {'        '}<span className="hl-c">{'// For background navigation\n'}</span>
            {'        manager.'}<span className="hl-f">requestAlwaysAuthorization</span>{'()\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
        <Callout type="info">
          Always request <code>WhenInUse</code> first. Upgrade to <code>Always</code> authorization only when the user starts a navigation session — iOS may reject an <code>Always</code> request if asked too early.
        </Callout>
      </div>

      {/* SDK services */}
      <div className="zone">
        <h2 className="sh" id="ios-si-services">Initialising SDK services</h2>
        <p className="body">
          Create SDK service instances once (typically in a ViewModel or app-level container) and reuse them throughout the app lifecycle.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">let</span>{' searchApi = '}<span className="hl-t">OnlineSearch</span>{'.'}<span className="hl-f">create</span>{'(\n'}
            {'    searchApiKey: apiKey\n'}
            {')\n\n'}
            <span className="hl-k">let</span>{' routingApi = '}<span className="hl-t">OnlineRouting</span>{'.'}<span className="hl-f">create</span>{'(\n'}
            {'    routingApiKey: apiKey\n'}
            {')\n\n'}
            <span className="hl-k">let</span>{' navigation = '}<span className="hl-t">TomTomNavigation</span>{'.'}<span className="hl-f">create</span>{'(\n'}
            {'    navigationApiKey: apiKey,\n'}
            {'    locationProvider: locationProvider\n}'}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FIRST MAP (iOS)
   ═══════════════════════════════════════════════════════════════════════════ */
function iOSFirstMapPreview() {
  return (
    <div style={{ width: '100%', height: 280, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="300" height="200" fill="#1e2d40" />
        {[40, 80, 120, 160, 200, 240].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        ))}
        {[50, 100, 150].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        ))}
        <path d="M0 100 Q80 93 150 100 T300 97" stroke="#c8a96e" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 0 Q148 100 150 200" stroke="#c8a96e" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 50 Q80 47 150 50 T300 49" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 150 Q90 146 150 150 T300 149" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        <text x="75" y="92" textAnchor="middle" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Main Street</text>
        <text x="225" y="92" textAnchor="middle" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Main Street</text>
        <text x="158" y="75" textAnchor="start" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Bridge Rd</text>
        <circle cx="150" cy="100" r="14" fill="rgba(226,0,26,0.15)" />
        <circle cx="150" cy="100" r="9" fill="rgba(226,0,26,0.25)" />
        <circle cx="150" cy="100" r="5" fill="#e2001a" />
        <circle cx="150" cy="100" r="5" fill="none" stroke="white" strokeWidth="1.5" />
        <polygon points="150,82 155,92 145,92" fill="rgba(226,0,26,0.7)" />
      </svg>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, flexDirection: 'column' }}>
        {['+', '−'].map(btn => (
          <div key={btn} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.92)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#333', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'default' }}>
            {btn}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)' }}>
        TomTomMapView · SwiftUI · zoom: 12
      </div>
    </div>
  );
}

const IOS_FIRST_MAP_APIS = [
  { name: 'Initializing the SDK (iOS)', type: 'iOS SDK', description: 'TomTomSDK.start(apiKey:) that must be called before creating any map view.',                                  pageId: 'navsdk-ios-sdk-init',    productId: 'navsdk-ios' },
  { name: 'Map Display for SwiftUI',    type: 'iOS SDK', description: 'Full SwiftUI TomTomMapView API following this minimal quickstart.',                                            pageId: 'navsdk-ios-map-swiftui', productId: 'navsdk-ios' },
  { name: 'Map Display for UIKit',      type: 'iOS SDK', description: 'UIKit TomTomMapView integration for UIViewController-based apps.',                                             pageId: 'navsdk-ios-map-uikit',   productId: 'navsdk-ios' },
  { name: 'Map Styles (iOS)',           type: 'iOS SDK', description: 'Customise the map style, layer visibility, and colour scheme beyond the default appearance.',                  pageId: 'navsdk-ios-map-styles',  productId: 'navsdk-ios' },
];

export function NavSDKiOSFirstMap({ onNavigate }) {
  const [framework, setFramework] = useState('swiftui');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your First Map</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Show a TomTom map in 5 lines of SwiftUI — or embed it into a <code>UIViewController</code> for UIKit apps. After project setup and SDK initialisation, the map is fully interactive.
      </p>

      <ApiLinks items={IOS_FIRST_MAP_APIS} onNavigate={onNavigate} />

      {/* Preview */}
      <div className="zone">
        <h2 className="sh" id="ios-fm-preview">Expected result</h2>
        <p className="body">The code below produces a full-screen map centred on Amsterdam, with default gesture support and zoom controls.</p>
        {iOSFirstMapPreview()}
      </div>

      {/* Framework selector */}
      <div className="zone">
        <h2 className="sh" id="ios-fm-code">Complete example</h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { id: 'swiftui', label: 'SwiftUI' },
            { id: 'uikit',   label: 'UIKit' },
          ].map(f => (
            <button key={f.id} onClick={() => setFramework(f.id)} style={{
              padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
              fontWeight: framework === f.id ? 600 : 400,
              background: framework === f.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${framework === f.id ? 'var(--red)' : 'var(--border)'}`,
              color: framework === f.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{f.label}</button>
          ))}
        </div>

        {framework === 'swiftui' && (
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' SwiftUI\n'}
              <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
              <span className="hl-k">struct</span>{' '}<span className="hl-t">ContentView</span>{': '}<span className="hl-t">View</span>{' {\n'}
              {'    '}<span className="hl-k">var</span>{' body: some '}<span className="hl-t">View</span>{' {\n'}
              {'        '}<span className="hl-t">TomTomMapView</span>{'()\n'}
              {'            .'}<span className="hl-f">ignoresSafeArea</span>{'()\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        )}

        {framework === 'uikit' && (
          <CodeBlock tabs={['Swift']}>
            <pre>
              <span className="hl-k">import</span>{' UIKit\n'}
              <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
              <span className="hl-k">class</span>{' '}<span className="hl-t">MapViewController</span>{': '}<span className="hl-t">UIViewController</span>{' {\n'}
              {'    '}<span className="hl-k">private let</span>{' mapView = '}<span className="hl-t">TomTomMapView</span>{'()\n\n'}
              {'    '}<span className="hl-k">override func</span>{' '}<span className="hl-f">viewDidLoad</span>{'() {\n'}
              {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">viewDidLoad</span>{'()\n'}
              {'        mapView.frame = view.bounds\n'}
              {'        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]\n'}
              {'        view.'}<span className="hl-f">addSubview</span>{'(mapView)\n'}
              {'    }\n}'}
            </pre>
          </CodeBlock>
        )}
      </div>

      {/* What's next */}
      <div className="zone">
        <h2 className="sh" id="ios-fm-next">Next steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { title: 'Map Styles', desc: 'Switch between day, night, and custom style URLs', id: 'navsdk-ios-map-styles' },
            { title: 'Camera & Animations', desc: 'Control zoom, tilt, and bearing programmatically', id: 'navsdk-ios-map-camera' },
            { title: 'Markers', desc: 'Add PointAnnotation pins with tap interaction', id: 'navsdk-ios-map-markers' },
            { title: 'Traffic', desc: 'Overlay real-time traffic flow and incidents', id: 'navsdk-ios-map-traffic' },
          ].map(card => (
            <div key={card.id} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('ux-navigate', { detail: card.id }))}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.45 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <Callout type="info">
        The examples above are minimal starting points. For production use, call <code>TomTomSDK.start(apiKey:)</code> in your <code>@main</code> App init or <code>AppDelegate</code> before creating any map view.
      </Callout>
    </div>
  );
}
