import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

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

function PlatformBadge({ platform }) {
  const isAndroid = platform === 'android';
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '2px 8px', borderRadius: 4,
      background: isAndroid ? '#e8f5e9' : '#e3f2fd',
      color: isAndroid ? '#1b5e20' : '#0d47a1',
      border: `1px solid ${isAndroid ? '#a5d6a7' : '#90caf9'}`,
      marginRight: 6,
    }}>{platform}</span>
  );
}

function RequirementRow({ req, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--mid)', minWidth: 140 }}>{req}</span>
      <code style={{ fontSize: '0.875rem', color: 'var(--black)', fontFamily: 'var(--font-mono)' }}>{value}</code>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. PROJECT SETUP
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKProjectSetup() {
  const [platform, setPlatform] = useState('android');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Project Setup</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Add the TomTom NavSDK to your Android or iOS project in a few steps. Configure your Gradle or SPM dependencies, set the API key, and meet the minimum platform requirements.
      </div>

      {/* Minimum requirements */}
      <div className="zone">
        <h2 className="sh" id="ps-requirements">Minimum requirements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 8 }}>
              Android
            </div>
            <RequirementRow req="Min SDK" value="API 23 (Android 6.0)" />
            <RequirementRow req="Compile SDK" value="API 34+" />
            <RequirementRow req="Kotlin" value="1.9.0+" />
            <RequirementRow req="AGP" value="8.0.0+" />
            <RequirementRow req="Jetpack Compose" value="BOM 2024.01+" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 8 }}>
              iOS
            </div>
            <RequirementRow req="Min deployment" value="iOS 14.0+" />
            <RequirementRow req="Swift" value="5.9+" />
            <RequirementRow req="Xcode" value="15.0+" />
            <RequirementRow req="Package manager" value="SPM or CocoaPods" />
          </div>
        </div>
      </div>

      {/* Platform toggle */}
      <div className="zone">
        <h2 className="sh" id="ps-steps">Installation steps</h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {['android', 'ios'].map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: '7px 18px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
              fontWeight: platform === p ? 600 : 400, textTransform: 'capitalize',
              background: platform === p ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${platform === p ? 'var(--red)' : 'var(--border)'}`,
              color: platform === p ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p === 'android' ? 'Android' : 'iOS'}</button>
          ))}
        </div>

        {platform === 'android' ? (
          <>
            <StepCard number="1" title="Add the TomTom Maven repository">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                In your root-level <code>settings.gradle.kts</code>, add the TomTom repository:
              </p>
              <CodeBlock tabs={['Kotlin (settings.gradle.kts)']}>
                <pre>
                  {'dependencyResolutionManagement {\n'}
                  {'    repositories {\n'}
                  {'        google()\n'}
                  {'        mavenCentral()\n'}
                  {'        maven {\n'}
                  {'            url = uri('}<span className="hl-s">'"https://repositories.tomtom.com/artifactory/maven"'</span>{')\n'}
                  {'        }\n'}
                  {'    }\n}'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="2" title="Add NavSDK dependencies">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                In your app module <code>build.gradle.kts</code>:
              </p>
              <CodeBlock tabs={['Kotlin (build.gradle.kts)']}>
                <pre>
                  <span className="hl-k">val</span>{' navSdkVersion = '}<span className="hl-s">"1.4.0"</span>{'\n\n'}
                  {'dependencies {\n'}
                  {'    '}<span className="hl-c">{'// Core map display\n'}</span>
                  {'    implementation('}<span className="hl-s">'"com.tomtom.sdk:maps-display:$navSdkVersion"'</span>{')\n'}
                  {'    '}<span className="hl-c">{'// Jetpack Compose map composable\n'}</span>
                  {'    implementation('}<span className="hl-s">'"com.tomtom.sdk:maps-display-ui-compose:$navSdkVersion"'</span>{')\n'}
                  {'    '}<span className="hl-c">{'// Navigation engine\n'}</span>
                  {'    implementation('}<span className="hl-s">'"com.tomtom.sdk:navigation-ui:$navSdkVersion"'</span>{')\n'}
                  {'    '}<span className="hl-c">{'// Routing\n'}</span>
                  {'    implementation('}<span className="hl-s">'"com.tomtom.sdk:routing-online:$navSdkVersion"'</span>{')\n'}
                  {'    '}<span className="hl-c">{'// Search\n'}</span>
                  {'    implementation('}<span className="hl-s">'"com.tomtom.sdk:search-online:$navSdkVersion"'</span>{')\n}'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="3" title="Set the API key">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Store your API key in <code>local.properties</code> (never commit this file) and read it in <code>build.gradle.kts</code>:
              </p>
              <CodeBlock tabs={['Kotlin (build.gradle.kts)']}>
                <pre>
                  <span className="hl-k">import</span>{' java.util.Properties\n\n'}
                  <span className="hl-k">val</span>{' localProps = '}<span className="hl-t">Properties</span>{'().apply {\n'}
                  {'    '}<span className="hl-f">load</span>{'(rootProject.file('}<span className="hl-s">"local.properties"</span>{').'}<span className="hl-f">inputStream</span>{'())\n}\n\n'}
                  {'android {\n'}
                  {'    defaultConfig {\n'}
                  {'        buildConfigField('}<span className="hl-s">'"String"'</span>{', '}<span className="hl-s">'"TOMTOM_API_KEY"'</span>{',\n'}
                  {'            '}<span className="hl-s">{'"\\""'}</span>{' + localProps['}<span className="hl-s">'"TOMTOM_API_KEY"'</span>{'] + '}<span className="hl-s">{'"\\""'}</span>{')\n'}
                  {'    }\n}'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="4" title="Sync and verify">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
                Run <code>./gradlew assembleDebug</code> to verify the dependency resolution completes without errors. Your project is ready for SDK initialisation.
              </p>
            </StepCard>
          </>
        ) : (
          <>
            <StepCard number="1" title="Add the package via Swift Package Manager">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                In Xcode: <strong>File → Add Package Dependencies…</strong> and enter the TomTom SDK repository URL.
              </p>
              <CodeBlock tabs={['Package.swift']}>
                <pre>
                  {'// swift-tools-version: 5.9\n'}
                  <span className="hl-k">import</span>{' PackageDescription\n\n'}
                  <span className="hl-k">let</span>{' package = '}<span className="hl-t">Package</span>{'(\n'}
                  {'    name: '}<span className="hl-s">'"MyNavApp"'</span>{',\n'}
                  {'    platforms: [.'}<span className="hl-f">iOS</span>{'(.'}<span className="hl-f">v14</span>{')],\n'}
                  {'    dependencies: [\n'}
                  {'        .'}<span className="hl-f">package</span>{'(\n'}
                  {'            url: '}<span className="hl-s">'"https://github.com/tomtom-international/tomtom-sdk-spm-navigation.git"'</span>{',\n'}
                  {'            from: '}<span className="hl-s">'"1.4.0"'</span>{'\n'}
                  {'        )\n'}
                  {'    ],\n'}
                  {'    targets: [\n'}
                  {'        .'}<span className="hl-f">target</span>{'(\n'}
                  {'            name: '}<span className="hl-s">'"MyNavApp"'</span>{',\n'}
                  {'            dependencies: [\n'}
                  {'                .'}<span className="hl-f">product</span>{'(name: '}<span className="hl-s">'"TomTomSDKMapDisplay"'</span>{', package: '}<span className="hl-s">'"tomtom-sdk-spm-navigation"'</span>{'),\n'}
                  {'                .'}<span className="hl-f">product</span>{'(name: '}<span className="hl-s">'"TomTomSDKNavigation"'</span>{', package: '}<span className="hl-s">'"tomtom-sdk-spm-navigation"'</span>{'),\n'}
                  {'                .'}<span className="hl-f">product</span>{'(name: '}<span className="hl-s">'"TomTomSDKRouting"'</span>{', package: '}<span className="hl-s">'"tomtom-sdk-spm-navigation"'</span>{'),\n'}
                  {'            ]\n'}
                  {'        )\n'}
                  {'    ]\n}'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="2" title="Add API key to Info.plist">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Add a <code>TomTomAPIKey</code> entry to your app's <code>Info.plist</code>. Use Xcode's environment variables or a secrets manager — never hard-code in source.
              </p>
              <CodeBlock tabs={['Info.plist (XML)']}>
                <pre>
                  {'<key>TomTomAPIKey</key>\n<string>$(TOMTOM_API_KEY)</string>'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="3" title="Add location usage description">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 10 }}>
                Navigation requires location access. Add these keys to <code>Info.plist</code>:
              </p>
              <CodeBlock tabs={['Info.plist (XML)']}>
                <pre>
                  {'<key>NSLocationWhenInUseUsageDescription</key>\n'}
                  {'<string>This app uses your location for turn-by-turn navigation.</string>\n\n'}
                  {'<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>\n'}
                  {'<string>This app uses your location in the background during active navigation.</string>'}
                </pre>
              </CodeBlock>
            </StepCard>

            <StepCard number="4" title="Build and verify">
              <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
                Build the project (<code>⌘B</code>) in Xcode. Resolve any package graph errors, then proceed to SDK initialisation.
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
   8. SDK INITIALISATION
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKSdkInit() {
  const [tab, setTab] = useState('android');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Initializing the SDK</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Initialise the TomTom NavSDK with your API key at app startup, request location permissions, and prepare the core SDK services before displaying a map.
      </div>

      {/* Android init */}
      <div className="zone">
        <h2 className="sh" id="si-android">Android — Application class</h2>
        <p className="body">
          Initialise the SDK in your <code>Application</code> subclass so it is ready before any Activity or Fragment starts. Inject the API key via <code>BuildConfig</code>.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">MyApplication</span>{' : '}<span className="hl-t">Application</span>{'() {\n\n'}
            {'    '}<span className="hl-k">override fun</span>{' '}<span className="hl-f">onCreate</span>{'() {\n'}
            {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">onCreate</span>{'()\n\n'}
            {'        '}<span className="hl-c">{'// Initialise the NavSDK with API key\n'}</span>
            {'        '}<span className="hl-t">TomTomSDKInitializer</span>{'.'}<span className="hl-f">initialize</span>{'(\n'}
            {'            context = this,\n'}
            {'            apiKey = '}<span className="hl-t">BuildConfig</span>{'.TOMTOM_API_KEY\n'}
            {'        )\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
        <p className="body" style={{ marginTop: 12 }}>
          Register your Application class in <code>AndroidManifest.xml</code>:
        </p>
        <CodeBlock tabs={['XML']}>
          <pre>
            {'<application\n'}
            {'    android:name=".MyApplication"\n'}
            {'    ... />'}
          </pre>
        </CodeBlock>
      </div>

      {/* Android permissions */}
      <div className="zone">
        <h2 className="sh" id="si-android-perms">Android — Location permissions</h2>
        <p className="body">
          Declare the required permissions in <code>AndroidManifest.xml</code> and request them at runtime before starting navigation.
        </p>
        <CodeBlock tabs={['XML', 'Kotlin']}>
          {[
            <pre key="xml">
              {'<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n'}
              {'<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n'}
              {'<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />\n'}
              {'<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />'}
            </pre>,
            <pre key="kt">
              <span className="hl-k">private val</span>{' locationPermissionRequest =\n'}
              {'    '}<span className="hl-f">registerForActivityResult</span>{'(\n'}
              {'        '}<span className="hl-t">ActivityResultContracts</span>{'.'}<span className="hl-t">RequestMultiplePermissions</span>{'()\n'}
              {'    ) { permissions ->\n'}
              {'        '}<span className="hl-k">val</span>{' granted = permissions['}<span className="hl-t">Manifest</span>{'.permission.'}<span className="hl-n">ACCESS_FINE_LOCATION</span>{'] == true\n'}
              {'        if (granted) '}<span className="hl-f">startMap</span>{'()\n'}
              {'    }\n\n'}
              <span className="hl-c">{'// Request at runtime\n'}</span>
              {'locationPermissionRequest.'}<span className="hl-f">launch</span>{'(arrayOf(\n'}
              {'    '}<span className="hl-t">Manifest</span>{'.permission.'}<span className="hl-n">ACCESS_FINE_LOCATION</span>{',\n'}
              {'    '}<span className="hl-t">Manifest</span>{'.permission.'}<span className="hl-n">{'ACCESS_COARSE_LOCATION'}</span>{'\n'}
              {'))'}
            </pre>,
          ]}
        </CodeBlock>
      </div>

      {/* iOS init */}
      <div className="zone">
        <h2 className="sh" id="si-ios">iOS — AppDelegate</h2>
        <p className="body">
          On iOS, initialise the SDK in <code>AppDelegate</code> (UIKit) or the <code>App</code> struct's <code>init()</code> (SwiftUI). Read the API key from <code>Info.plist</code>.
        </p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">import</span>{' TomTomSDKCommon\n'}
            <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
            <span className="hl-c">{'// UIKit AppDelegate\n'}</span>
            <span className="hl-k">class</span>{' '}<span className="hl-t">AppDelegate</span>{': '}<span className="hl-t">UIResponder</span>{', '}<span className="hl-t">UIApplicationDelegate</span>{' {\n\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">application</span>{'(_ application: '}<span className="hl-t">UIApplication</span>{',\n'}
            {'        didFinishLaunchingWithOptions launchOptions: ['}<span className="hl-t">UIApplication</span>{'.'}<span className="hl-t">LaunchOptionsKey</span>{': Any]?) -> Bool {\n\n'}
            {'        '}<span className="hl-k">let</span>{' apiKey = '}<span className="hl-t">Bundle</span>{'.'}<span className="hl-f">main</span>{'.object(forInfoDictionaryKey: '}<span className="hl-s">'"TomTomAPIKey"'</span>{') '}<span className="hl-k">as</span>{'? '}<span className="hl-t">String</span>{' ?? '}<span className="hl-s">""</span>{'\n'}
            {'        '}<span className="hl-t">TomTomSDK</span>{'.'}<span className="hl-f">initialize</span>{'(apiKey: apiKey)\n\n'}
            {'        '}<span className="hl-k">return true</span>{'\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
      </div>

      {/* iOS permissions */}
      <div className="zone">
        <h2 className="sh" id="si-ios-perms">iOS — Location permissions</h2>
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
        <h2 className="sh" id="si-services">Initialising SDK services</h2>
        <p className="body">
          Create SDK service instances once (typically in a ViewModel or DI container) and reuse them throughout the app lifecycle.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {[
            <pre key="kt">
              <span className="hl-c">{'// In your ViewModel or DI module\n'}</span>
              <span className="hl-k">val</span>{' searchApi: '}<span className="hl-t">SearchApi</span>{' = '}<span className="hl-t">OnlineSearch</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    context = context,\n'}
              {'    searchApiKey = '}<span className="hl-t">BuildConfig</span>{'.TOMTOM_API_KEY\n'}
              {')\n\n'}
              <span className="hl-k">val</span>{' routingApi: '}<span className="hl-t">RoutingApi</span>{' = '}<span className="hl-t">OnlineRouting</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    context = context,\n'}
              {'    routingApiKey = '}<span className="hl-t">BuildConfig</span>{'.TOMTOM_API_KEY\n'}
              {')\n\n'}
              <span className="hl-k">val</span>{' navigation: '}<span className="hl-t">TomTomNavigation</span>{' = '}<span className="hl-t">OnlineTomTomNavigationFactory</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    '}<span className="hl-t">NavigationConfiguration</span>{'(\n'}
              {'        context = context,\n'}
              {'        navigationApiKey = '}<span className="hl-t">BuildConfig</span>{'.TOMTOM_API_KEY,\n'}
              {'        locationProvider = locationProvider\n'}
              {'    )\n}'}
            </pre>,
            <pre key="sw">
              <span className="hl-k">let</span>{' searchApi = '}<span className="hl-t">OnlineSearch</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    searchApiKey: apiKey\n'}
              {')\n\n'}
              <span className="hl-k">let</span>{' routingApi = '}<span className="hl-t">OnlineRouting</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    routingApiKey: apiKey\n'}
              {')\n\n'}
              <span className="hl-k">let</span>{' navigation = '}<span className="hl-t">TomTomNavigation</span>{'.'}<span className="hl-f">create</span>{'(\n'}
              {'    navigationApiKey: apiKey,\n'}
              {'    locationProvider: locationProvider\n}'}
            </pre>,
          ]}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. FIRST MAP
   ═══════════════════════════════════════════════════════════════════════════ */
function FirstMapPreview() {
  return (
    <div style={{ width: '100%', height: 280, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
      {/* Map background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="300" height="200" fill="#1e2d40" />
        {/* Grid */}
        {[40, 80, 120, 160, 200, 240].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        ))}
        {[50, 100, 150].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        ))}
        {/* Streets */}
        <path d="M0 100 Q80 93 150 100 T300 97" stroke="#c8a96e" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 0 Q148 100 150 200" stroke="#c8a96e" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 50 Q80 47 150 50 T300 49" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 150 Q90 146 150 150 T300 149" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        {/* Labels */}
        <text x="75" y="92" textAnchor="middle" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Main Street</text>
        <text x="225" y="92" textAnchor="middle" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Main Street</text>
        <text x="158" y="75" textAnchor="start" fill="rgba(200,200,200,0.35)" style={{ fontSize: 7 }}>Bridge Rd</text>
        {/* User location puck */}
        <circle cx="150" cy="100" r="14" fill="rgba(226,0,26,0.15)" />
        <circle cx="150" cy="100" r="9" fill="rgba(226,0,26,0.25)" />
        <circle cx="150" cy="100" r="5" fill="#e2001a" />
        <circle cx="150" cy="100" r="5" fill="none" stroke="white" strokeWidth="1.5" />
        {/* Heading triangle */}
        <polygon points="150,82 155,92 145,92" fill="rgba(226,0,26,0.7)" />
      </svg>
      {/* UI overlays */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, flexDirection: 'column' }}>
        {['+', '−'].map(btn => (
          <div key={btn} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.92)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#333', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'default' }}>
            {btn}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)' }}>
        TomTomMap — zoom: 14
      </div>
    </div>
  );
}

export function NavSDKFirstMap() {
  const [platform, setPlatform] = useState('android');
  const [composeOrViews, setComposeOrViews] = useState('compose');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your First Map</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        A complete minimal example to display a TomTom map in your app. After project setup and SDK initialisation, showing a map takes fewer than 20 lines of code.
      </div>

      {/* Preview */}
      <div className="zone">
        <h2 className="sh" id="fm-preview">Expected result</h2>
        <p className="body">The code below produces a full-screen map centred on Amsterdam at zoom level 14, with a location puck at the device position.</p>
        <FirstMapPreview />
      </div>

      {/* Platform selector */}
      <div className="zone">
        <h2 className="sh" id="fm-code">Complete example</h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['android', 'ios'].map(p => (
              <button key={p} onClick={() => setPlatform(p)} style={{
                padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
                fontWeight: platform === p ? 600 : 400, textTransform: 'capitalize',
                background: platform === p ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${platform === p ? 'var(--red)' : 'var(--border)'}`,
                color: platform === p ? 'var(--red)' : 'var(--mid)',
                transition: 'all 0.1s',
              }}>{p === 'android' ? 'Android' : 'iOS'}</button>
            ))}
          </div>
          {platform === 'android' && (
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'compose', label: 'Compose' },
                { id: 'views', label: 'Views' },
              ].map(v => (
                <button key={v.id} onClick={() => setComposeOrViews(v.id)} style={{
                  padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
                  fontWeight: composeOrViews === v.id ? 600 : 400,
                  background: composeOrViews === v.id ? 'rgba(0,0,0,0.07)' : 'var(--bg)',
                  border: `1px solid ${composeOrViews === v.id ? 'var(--black)' : 'var(--border)'}`,
                  color: composeOrViews === v.id ? 'var(--black)' : 'var(--mid)',
                  transition: 'all 0.1s',
                }}>{v.label}</button>
              ))}
            </div>
          )}
        </div>

        {platform === 'android' && composeOrViews === 'compose' && (
          <CodeBlock tabs={['Kotlin (Compose)']}>
            <pre>
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.TomTomMap\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.camera.CameraOptions\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.common.screen.Padding\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.location.LocationMarkerOptions\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.ui.compose.TomTomMapComposable\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.maps.display.MapOptions\n\n'}
              <span className="hl-k">import</span>{' com.tomtom.sdk.location.GeoPoint\n\n'}
              {'@'}<span className="hl-t">Composable</span>{'\n'}
              <span className="hl-k">fun</span>{' '}<span className="hl-f">MapScreen</span>{'() {\n'}
              {'    '}<span className="hl-k">var</span>{' tomTomMap: '}<span className="hl-t">TomTomMap</span>{'? by '}<span className="hl-f">remember</span>{' { '}<span className="hl-f">mutableStateOf</span>{'(null) }\n\n'}
              {'    '}<span className="hl-t">TomTomMapComposable</span>{'(\n'}
              {'        modifier = '}<span className="hl-t">Modifier</span>{'.'}<span className="hl-f">fillMaxSize</span>{'(),\n'}
              {'        mapOptions = '}<span className="hl-t">MapOptions</span>{'(\n'}
              {'            cameraOptions = '}<span className="hl-t">CameraOptions</span>{'(\n'}
              {'                position = '}<span className="hl-t">GeoPoint</span>{'(lat = 52.376799, lon = 4.908162),\n'}
              {'                zoom = 14.0\n'}
              {'            )\n'}
              {'        ),\n'}
              {'        onMapReady = { map ->\n'}
              {'            tomTomMap = map\n'}
              {'            '}<span className="hl-c">{'// Enable the user location puck\n'}</span>
              {'            map.'}<span className="hl-f">enableLocationMarker</span>{'('}<span className="hl-t">LocationMarkerOptions</span>{'())\n'}
              {'        }\n'}
              {'    )\n}'}
            </pre>
          </CodeBlock>
        )}

        {platform === 'android' && composeOrViews === 'views' && (
          <>
            <CodeBlock tabs={['activity_main.xml']}>
              <pre>
                {'<?xml version="1.0" encoding="utf-8"?>\n'}
                {'<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n'}
                {'    android:layout_width="match_parent"\n'}
                {'    android:layout_height="match_parent">\n\n'}
                {'    <androidx.fragment.app.FragmentContainerView\n'}
                {'        android:id="@+id/map_fragment"\n'}
                {'        android:name="com.tomtom.sdk.maps.display.ui.MapFragment"\n'}
                {'        android:layout_width="match_parent"\n'}
                {'        android:layout_height="match_parent" />\n\n'}
                {'</FrameLayout>'}
              </pre>
            </CodeBlock>
            <div style={{ marginTop: 12 }}>
              <CodeBlock tabs={['Kotlin (Activity)']}>
                <pre>
                  <span className="hl-k">class</span>{' '}<span className="hl-t">MainActivity</span>{' : '}<span className="hl-t">AppCompatActivity</span>{'() {\n\n'}
                  {'    '}<span className="hl-k">override fun</span>{' '}<span className="hl-f">onCreate</span>{'(savedInstanceState: '}<span className="hl-t">Bundle</span>{'?) {\n'}
                  {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">onCreate</span>{'(savedInstanceState)\n'}
                  {'        '}<span className="hl-f">setContentView</span>{'(R.layout.activity_main)\n\n'}
                  {'        '}<span className="hl-k">val</span>{' mapFragment = '}<span className="hl-f">{'supportFragmentManager'}</span>{'\n'}
                  {'            .'}<span className="hl-f">findFragmentById</span>{'(R.id.map_fragment) '}<span className="hl-k">as</span>{' '}<span className="hl-t">MapFragment</span>{'\n\n'}
                  {'        mapFragment.'}<span className="hl-f">getMapAsync</span>{' { map ->\n'}
                  {'            map.'}<span className="hl-f">moveCamera</span>{'('}<span className="hl-t">CameraOptions</span>{'(\n'}
                  {'                position = '}<span className="hl-t">GeoPoint</span>{'(lat = 52.376799, lon = 4.908162),\n'}
                  {'                zoom = 14.0\n'}
                  {'            ))\n'}
                  {'            map.'}<span className="hl-f">enableLocationMarker</span>{'('}<span className="hl-t">LocationMarkerOptions</span>{'())\n'}
                  {'        }\n'}
                  {'    }\n}'}
                </pre>
              </CodeBlock>
            </div>
          </>
        )}

        {platform === 'ios' && (
          <>
            <CodeBlock tabs={['Swift (UIKit)', 'Swift (SwiftUI)']}>
              {[
                <pre key="uikit">
                  <span className="hl-k">import</span>{' UIKit\n'}
                  <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
                  <span className="hl-k">class</span>{' '}<span className="hl-t">MapViewController</span>{': '}<span className="hl-t">UIViewController</span>{' {\n\n'}
                  {'    '}<span className="hl-k">private var</span>{' mapView: '}<span className="hl-t">TomTomMapView</span>{'!\n\n'}
                  {'    '}<span className="hl-k">override func</span>{' '}<span className="hl-f">viewDidLoad</span>{'() {\n'}
                  {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">viewDidLoad</span>{'()\n\n'}
                  {'        '}<span className="hl-k">let</span>{' cameraUpdate = '}<span className="hl-t">CameraUpdate</span>{'(\n'}
                  {'            coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.376799, longitude: 4.908162),\n'}
                  {'            zoom: 14\n'}
                  {'        )\n'}
                  {'        '}<span className="hl-k">let</span>{' mapOptions = '}<span className="hl-t">MapOptions</span>{'(cameraUpdate: cameraUpdate)\n'}
                  {'        mapView = '}<span className="hl-t">TomTomMapView</span>{'(mapOptions: mapOptions)\n'}
                  {'        mapView.frame = view.bounds\n'}
                  {'        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]\n'}
                  {'        view.'}<span className="hl-f">addSubview</span>{'(mapView)\n\n'}
                  {'        '}<span className="hl-c">{'// Show user location puck\n'}</span>
                  {'        mapView.'}<span className="hl-f">enableLocationMarker</span>{'('}<span className="hl-t">LocationMarkerOptions</span>{'())\n'}
                  {'    }\n}'}
                </pre>,
                <pre key="swiftui">
                  <span className="hl-k">import</span>{' SwiftUI\n'}
                  <span className="hl-k">import</span>{' TomTomSDKMapDisplay\n\n'}
                  <span className="hl-k">struct</span>{' '}<span className="hl-t">TomTomMapView</span>{': '}<span className="hl-t">UIViewRepresentable</span>{' {\n\n'}
                  {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">makeUIView</span>{'(context: '}<span className="hl-t">Context</span>{') -> '}<span className="hl-t">TomTomSDKMapDisplay.TomTomMapView</span>{' {\n'}
                  {'        '}<span className="hl-k">let</span>{' cameraUpdate = '}<span className="hl-t">CameraUpdate</span>{'(\n'}
                  {'            coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.376799, longitude: 4.908162),\n'}
                  {'            zoom: 14\n'}
                  {'        )\n'}
                  {'        '}<span className="hl-k">let</span>{' mapView = '}<span className="hl-t">TomTomSDKMapDisplay.TomTomMapView</span>{'(\n'}
                  {'            mapOptions: '}<span className="hl-t">MapOptions</span>{'(cameraUpdate: cameraUpdate)\n'}
                  {'        )\n'}
                  {'        mapView.'}<span className="hl-f">enableLocationMarker</span>{'('}<span className="hl-t">LocationMarkerOptions</span>{'())\n'}
                  {'        '}<span className="hl-k">return</span>{' mapView\n'}
                  {'    }\n\n'}
                  {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">updateUIView</span>{'(_ uiView: '}<span className="hl-t">TomTomSDKMapDisplay.TomTomMapView</span>{', context: '}<span className="hl-t">Context</span>{') {}\n}\n\n'}
                  <span className="hl-k">struct</span>{' '}<span className="hl-t">ContentView</span>{': '}<span className="hl-t">View</span>{' {\n'}
                  {'    '}<span className="hl-k">var</span>{' body: some '}<span className="hl-t">View</span>{' {\n'}
                  {'        '}<span className="hl-t">TomTomMapView</span>{'().'}<span className="hl-f">ignoresSafeArea</span>{'()\n'}
                  {'    }\n}'}
                </pre>,
              ]}
            </CodeBlock>
          </>
        )}
      </div>

      {/* What's next */}
      <div className="zone">
        <h2 className="sh" id="fm-next">Next steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { title: 'Map Styles', desc: 'Switch between day, night, and custom style URLs', id: 'navsdk-map-styles' },
            { title: 'Camera & Animations', desc: 'Control zoom, tilt, and bearing programmatically', id: 'navsdk-map-camera' },
            { title: 'Markers', desc: 'Add custom icon pins with tap interaction', id: 'navsdk-map-markers' },
            { title: 'Traffic', desc: 'Overlay real-time traffic flow and incidents', id: 'navsdk-map-traffic' },
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
        The examples above centre the map on Amsterdam (52.376799, 4.908162) — TomTom's home. Replace this with your desired default location or use the device's current position via <code>LocationProvider</code>.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKLocalization() {
  const [selectedLang, setSelectedLang] = useState('en');
  const LANGS = [
    { code: 'en', label: 'English', bcp47: 'en-US' },
    { code: 'de', label: 'Deutsch', bcp47: 'de-DE' },
    { code: 'fr', label: 'Français', bcp47: 'fr-FR' },
    { code: 'nl', label: 'Nederlands', bcp47: 'nl-NL' },
    { code: 'ja', label: '日本語', bcp47: 'ja-JP' },
    { code: 'ar', label: 'العربية', bcp47: 'ar-SA', rtl: true },
  ];

  const SAMPLES = {
    en: { turn: 'Turn right onto Baker Street', dist: 'In 300 metres', arrive: 'You have arrived' },
    de: { turn: 'Rechts abbiegen auf Baker Street', dist: 'In 300 Metern', arrive: 'Sie haben Ihr Ziel erreicht' },
    fr: { turn: 'Tournez à droite sur Baker Street', dist: 'Dans 300 mètres', arrive: 'Vous êtes arrivé' },
    nl: { turn: 'Sla rechts af, Baker Street', dist: 'Over 300 meter', arrive: 'U bent aangekomen' },
    ja: { turn: 'Baker Streetを右折します', dist: '300メートル先', arrive: '目的地に到着しました' },
    ar: { turn: 'انعطف يميناً في Baker Street', dist: 'بعد 300 متر', arrive: 'لقد وصلت إلى وجهتك' },
  };

  const sample = SAMPLES[selectedLang];
  const lang = LANGS.find(l => l.code === selectedLang);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Localizing the SDK</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure map labels, guidance instructions, and address formatting to match the user's locale.
        The SDK supports 40+ languages for voice instructions and map display.
      </p>

      <div className="zone">
        <h2 className="sh" id="loc-demo">Language preview</h2>
        <p className="body">Select a language to preview how guidance prompts are localised.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setSelectedLang(l.code)}
              style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                background: selectedLang === l.code ? 'var(--black)' : 'var(--surface)',
                color: selectedLang === l.code ? 'var(--white)' : 'var(--mid)' }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ background: '#0d1117', borderRadius: 14, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }} dir={lang?.rtl ? 'rtl' : 'ltr'}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>{lang?.bcp47}</div>
          {[['Turn instruction', sample.turn], ['Distance', sample.dist], ['Arrival', sample.arrive]].map(([label, text]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', minWidth: 100, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: '0.9375rem', color: '#e2e8f0', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="loc-map-lang">Map language</h2>
        <p className="body">Set the language used for road names, POI labels, and place names on the map.</p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`// Set map label language (BCP 47 tag)
val mapOptions = MapOptions(
    styleDescriptor = StyleDescriptor.DEFAULT,
    mapLocale = MapLocale(Locale("de", "DE"))
)

TomTomMapComposable(
    mapOptions = mapOptions,
    onMapReady = { map -> /* ... */ }
)`}
          {`// Set map label language
let mapOptions = MapOptions(
    mapStyle: .defaultStyle,
    locale: Locale(identifier: "de_DE")
)

let mapView = TomTomMapView(mapOptions: mapOptions)`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="loc-voice">Voice instruction language</h2>
        <p className="body">Voice instructions are generated in the language specified at navigation start. This is independent of the map label language.</p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`// Set the guidance language when starting navigation
val navigationOptions = NavigationOptions(
    guidanceLanguage = Locale("fr", "FR"),
    voiceLanguage = Locale("fr", "FR")
)

tomTomNavigation.start(
    route = route,
    options = navigationOptions
)`}
          {`// Set guidance language
let navigationOptions = NavigationOptions(
    guidanceLanguage: Locale(identifier: "fr_FR")
)

tomTomNavigation.start(
    route: route,
    options: navigationOptions
)`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="loc-address">Address format</h2>
        <p className="body">Reverse geocoding results automatically return addresses formatted for the target country.</p>
        <Callout type="info">
          The SDK uses CLDR locale data for address formatting. No extra configuration is needed — pass the user's <code>Locale</code> and the SDK handles regional address order, postal code placement, and unit systems automatically.
        </Callout>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MIGRATION (SDK v1 → v2)
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKMigration() {
  const [activeTab, setActiveTab] = useState('deps');
  const TABS = [
    { id: 'deps', label: 'Dependencies' },
    { id: 'init', label: 'Initialization' },
    { id: 'map', label: 'Map Display' },
    { id: 'nav', label: 'Navigation' },
  ];

  const DIFFS = {
    deps: {
      v1: `// v1 — separate Maven artifacts
implementation("com.tomtom.sdk:maps-display-ui:1.x.x")
implementation("com.tomtom.sdk:navigation-core:1.x.x")
implementation("com.tomtom.sdk:navigation-ui:1.x.x")
implementation("com.tomtom.sdk:search-online:1.x.x")`,
      v2: `// v2 — unified BOM + modular modules
implementation(platform("com.tomtom.sdk:bom:2.x.x"))
implementation("com.tomtom.sdk:maps-display")
implementation("com.tomtom.sdk:navigation")
implementation("com.tomtom.sdk:search")`,
    },
    init: {
      v1: `// v1 — per-service API keys
TomTomSDK.initialise(context, apiKey)
val search = SearchApi.create(context, "YOUR_KEY")
val routing = RoutingApi.create(context, "YOUR_KEY")`,
      v2: `// v2 — single OnlineTomTomServicesFactory
val services = OnlineTomTomServicesFactory.create(
    OnlineTomTomServicesOptions(apiKey = "YOUR_KEY")
)
val search  = services.createSearch()
val routing = services.createRouting()`,
    },
    map: {
      v1: `// v1 — MapView via XML + MapFragment
class MapActivity : AppCompatActivity() {
    override fun onCreate(...) {
        setContentView(R.layout.activity_map)
        val fragment = MapFragment.newInstance(mapOptions)
        supportFragmentManager.beginTransaction()
            .add(R.id.map_container, fragment).commit()
        fragment.getMapAsync { map ->
            tomTomMap = map
        }
    }
}`,
      v2: `// v2 — TomTomMapComposable (Compose) or TomTomMapFragment
@Composable
fun MyMapScreen() {
    TomTomMapComposable(
        mapOptions = MapOptions(styleUri = StyleDescriptor.DEFAULT),
        onMapReady = { map -> tomTomMap = map }
    )
}`,
    },
    nav: {
      v1: `// v1 — NavigationApi, separate observer registrations
val navApi = NavigationApi.create(...)
navApi.addProgressObserver(myProgressObserver)
navApi.addGuidanceObserver(myGuidanceObserver)
navApi.start(route)`,
      v2: `// v2 — TomTomNavigation, unified observer lifecycle
val navigation = TomTomNavigationFactory.create(services)
navigation.addNavigationStateChangeListener(myListener)
navigation.addProgressObserver(myObserver)
navigation.start(StartNavigationOptions(route = route))`,
    },
  };

  const diff = DIFFS[activeTab];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Migrate to SDK v2</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        SDK v2 introduces a unified BOM, a single <code>OnlineTomTomServicesFactory</code>, and a
        cleaner Compose-first map API. Most migration changes are mechanical find-and-replace operations.
      </p>

      <Callout type="warn">
        SDK v1 reaches end-of-life support in Q4 2025. New projects should start with v2. Existing v1 integrations should migrate before this date to continue receiving security and map updates.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="mig-diff">v1 → v2 diff viewer</h2>
        <p className="body">Select an area to see before/after code changes.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                background: activeTab === t.id ? '#e2001a' : 'var(--surface)',
                color: activeTab === t.id ? '#fff' : 'var(--mid)' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['v1 (old)', diff.v1, '#2a0a0e'], ['v2 (new)', diff.v2, '#0a1f12']].map(([label, code, borderCol]) => (
            <div key={label}>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
              <CodeBlock language="kotlin" code={code} />
            </div>
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="mig-breaking">Breaking changes summary</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            ['Artifact IDs', 'Per-module artifacts replaced by BOM + short module names'],
            ['API key injection', 'Per-service keys replaced by single OnlineTomTomServicesFactory'],
            ['Map composable', 'MapFragment.getMapAsync() replaced by TomTomMapComposable'],
            ['Navigation start', 'NavigationApi.start(route) replaced by TomTomNavigation.start(StartNavigationOptions)'],
            ['Observer registration', 'add*Observer() methods moved to TomTomNavigation with lifecycle-aware variants'],
            ['Search options', 'SearchOptions() renamed to FuzzySearchOptions() with builder pattern'],
          ].map(([name, desc]) => (
            <div key={name} style={{ display: 'flex', gap: 14, padding: '10px 14px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <code style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', flexShrink: 0, minWidth: 160 }}>{name}</code>
              <span style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Callout type="info">
        The iOS SDK follows a separate versioning scheme. See the iOS migration guide on the TomTom developer portal for iOS-specific changes.
      </Callout>
    </div>
  );
}
