import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared dark map canvas ─────────────────────────────────────────────── */
function MapCanvas({ children, height = 260 }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
        {[60, 120, 180, 240, 300, 360].map(x => (
          <line key={x} x1={x} y1={0} x2={x} y2={260} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[52, 104, 156, 208].map(y => (
          <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Road network */}
        <path d="M0 130 Q100 110 200 130 T400 120" stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" />
        <path d="M120 0 L115 260" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <path d="M280 0 L275 260" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <path d="M0 80 L400 85" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
        <path d="M0 180 L400 175" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. OFFLINE QUICKSTART
   ═══════════════════════════════════════════════════════════════════════════ */
const OFFLINE_QUICKSTART_APIS = [
  { name: 'Map Display API',        type: 'REST API',    description: 'Vector tile endpoint whose tiles are pre-fetched and stored in NativeMapStore for offline rendering.',         pageId: 'map-display-api-intro',    productId: 'map-display-api' },
  { name: 'Offline Map Setup',      type: 'Android SDK', description: 'OfflineMapRegionManager configuration that follows on from this NativeMapStore initialisation.',               pageId: 'navsdk-offline-setup',     productId: 'navsdk' },
  { name: 'Offline Map Management', type: 'Android SDK', description: 'Listing, updating, and deleting downloaded regions after the initial offline setup.',                          pageId: 'navsdk-offline-mgmt',      productId: 'navsdk' },
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'Navigation session that uses the offline map and routing data downloaded here.',                               pageId: 'navsdk-nav-quickstart',    productId: 'navsdk' },
];

export function NavSDKOfflineQuickstart({ onNavigate }) {
  const [phase, setPhase] = useState('idle'); // idle | downloading | complete
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  function startDownload() {
    setPhase('downloading');
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          setPhase('complete');
          return 100;
        }
        return p + 2;
      });
    }, 60);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setPhase('idle');
    setProgress(0);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Offline Quickstart</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Set up <code>NativeMapStore</code> and <code>OfflineManager</code>, download a region package,
        and verify that navigation works without network connectivity.
      </p>
      <ApiLinks items={OFFLINE_QUICKSTART_APIS} onNavigate={onNavigate} />
      <Callout type="warn">
        Full offline map packages (country/region downloads) are available on <strong>Android only</strong>.
        iOS uses automatic tile caching — you cannot pre-download a full region on iOS.
      </Callout>

      {/* ── Interactive demo ── */}
      <div className="zone">
        <h2 className="sh" id="offqs-demo">Interactive demo</h2>
        <p className="body">Simulate downloading a region and watching it become available offline.</p>

        <MapCanvas>
          {/* Highlighted Netherlands region */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
            <rect x="130" y="60" width="140" height="140" rx="8"
              fill={phase === 'complete' ? 'rgba(226,0,26,0.18)' : 'rgba(226,0,26,0.08)'}
              stroke={phase === 'complete' ? '#e2001a' : 'rgba(226,0,26,0.4)'}
              strokeWidth="1.5"
              strokeDasharray={phase === 'idle' ? '6 3' : 'none'}
            />
            <text x="200" y="125" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">Netherlands</text>
            <text x="200" y="142" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">~850 MB</text>
          </svg>

          {/* Status overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            {phase === 'idle' && (
              <button onClick={startDownload} style={{
                background: '#e2001a', color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 20px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%',
              }}>
                Download Region
              </button>
            )}
            {phase === 'downloading' && (
              <div style={{ background: 'rgba(13,17,23,0.92)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600 }}>Downloading Netherlands…</span>
                  <span style={{ color: '#e2001a', fontSize: '0.8125rem', fontWeight: 700 }}>{progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: '#e2001a', width: `${progress}%`, transition: 'width 0.06s linear' }} />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 6 }}>
                  {Math.round(progress * 8.5)} MB / 850 MB
                </div>
              </div>
            )}
            {phase === 'complete' && (
              <div style={{ background: 'rgba(22,163,74,0.15)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(22,163,74,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <div style={{ color: '#86efac', fontSize: '0.8125rem', fontWeight: 700 }}>Netherlands downloaded</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Offline navigation ready · 850 MB</div>
                </div>
                <button onClick={reset} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>Reset</button>
              </div>
            )}
          </div>
        </MapCanvas>
      </div>

      {/* ── Setup ── */}
      <div className="zone">
        <h2 className="sh" id="offqs-setup">1. Initialize NativeMapStore</h2>
        <p className="body">
          Configure <code>NativeMapStore</code> as the storage backend and attach it to the SDK before
          displaying any map. This enables the map to serve tiles from local storage when offline.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          <pre>{`// Android
val nativeMapStore = NativeMapStore.Builder()
    .storagePath(context.filesDir.absolutePath + "/offline_maps")
    .maxStorageBytes(4L * 1024 * 1024 * 1024) // 4 GB
    .build()

val offlineManager = OfflineManager.Builder(context)
    .nativeMapStore(nativeMapStore)
    .build()

TomTomNavigation.Builder()
    .offlineManager(offlineManager)
    .build(context)`}</pre>
          <pre>{`// iOS — tile caching only (no full region download)
// Tile caching is automatic via TileStoreOptions
let options = TileStoreOptions()
options.diskQuotaBytes = 2 * 1024 * 1024 * 1024 // 2 GB

// Attach to map via MapOptions
let mapOptions = MapOptions.Builder()
    .tileStoreOptions(options)
    .build()`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offqs-download">2. Download a region</h2>
        <p className="body">
          Use <code>OfflineManager.downloadRegion()</code> with a <code>MapRegion</code> descriptor.
          Track download progress via the callback.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val region = MapRegion.Builder()
    .regionCode("NLD") // ISO 3166-1 alpha-3
    .build()

offlineManager.downloadRegion(
    region = region,
    onProgress = { progress ->
        val pct = progress.progressPercentage
        val downloaded = progress.bytesDownloaded
        val total = progress.bytesTotal
        Log.d("Offline", "Progress: $pct% ($downloaded/$total bytes)")
    },
    onComplete = {
        Log.d("Offline", "Netherlands ready for offline use")
    },
    onError = { error ->
        Log.e("Offline", "Download failed: \${error.message}")
    }
)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offqs-verify">3. Verify offline capability</h2>
        <p className="body">
          Before navigating, check that the required region is downloaded and up to date.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val status = offlineManager.getRegionStatus("NLD")

when (status) {
    RegionStatus.DOWNLOADED -> {
        // Safe to navigate offline
        startNavigation()
    }
    RegionStatus.DOWNLOADING -> {
        showDownloadProgress()
    }
    RegionStatus.OUTDATED -> {
        // Available but may have stale data
        showUpdatePrompt()
    }
    RegionStatus.NOT_DOWNLOADED -> {
        promptDownload()
    }
}`}</pre>
        </CodeBlock>

        <Callout type="info">
          On iOS, use <code>tileStore.tileRegions(completion:)</code> to list cached tile regions.
          Full status checks equivalent to Android are not available.
        </Callout>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. OFFLINE MAP SETUP
   ═══════════════════════════════════════════════════════════════════════════ */
const DOWNLOAD_STATES = ['idle', 'downloading', 'complete', 'outdated'];
const DOWNLOAD_STATE_LABELS = {
  idle: { label: 'Not downloaded', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)' },
  downloading: { label: 'Downloading…', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  complete: { label: 'Up to date', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  outdated: { label: 'Update available', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
};

const OFFLINE_SETUP_APIS = [
  { name: 'Map Display API',        type: 'REST API',    description: 'Vector tile endpoint that defines the tile schema downloaded by OfflineMapRegionManager.',                    pageId: 'map-display-api-intro',     productId: 'map-display-api' },
  { name: 'Offline Quickstart',     type: 'Android SDK', description: 'NativeMapStore setup that must be completed before region manager policies take effect.',                      pageId: 'navsdk-offline-quickstart', productId: 'navsdk' },
  { name: 'Offline Map Management', type: 'Android SDK', description: 'Post-setup operations — list, update, and delete packages configured with this region manager.',               pageId: 'navsdk-offline-mgmt',       productId: 'navsdk' },
];

export function NavSDKOfflineSetup({ onNavigate }) {
  const [downloadState, setDownloadState] = useState('idle');
  const [progressPct, setProgressPct] = useState(0);
  const timerRef = useRef(null);

  function handleStateChange(state) {
    clearInterval(timerRef.current);
    setDownloadState(state);
    if (state === 'downloading') {
      setProgressPct(0);
      timerRef.current = setInterval(() => {
        setProgressPct(p => {
          if (p >= 100) { clearInterval(timerRef.current); setDownloadState('complete'); return 100; }
          return p + 3;
        });
      }, 80);
    }
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const stateInfo = DOWNLOAD_STATE_LABELS[downloadState];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Offline Map Setup</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure <code>OfflineMapRegionManager</code>, define regions by bounding box or region code,
        monitor download progress, and set storage quota policies.
      </p>
      <ApiLinks items={OFFLINE_SETUP_APIS} onNavigate={onNavigate} />
      <Callout type="warn">
        Full offline map packages are available on <strong>Android only</strong>. iOS uses automatic
        tile caching managed by <code>TileStore</code> — manual region pre-download is not supported.
      </Callout>

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="offs-demo">Region download states</h2>
        <p className="body">Select a state to preview how the SDK reports download status.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {DOWNLOAD_STATES.map(s => (
            <button key={s} onClick={() => handleStateChange(s)} style={{
              padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: downloadState === s ? DOWNLOAD_STATE_LABELS[s].bg : 'var(--bg)',
              border: `1px solid ${downloadState === s ? DOWNLOAD_STATE_LABELS[s].color : 'var(--border)'}`,
              color: downloadState === s ? DOWNLOAD_STATE_LABELS[s].color : 'var(--mid)',
              transition: 'all 0.12s',
            }}>{DOWNLOAD_STATE_LABELS[s].label}</button>
          ))}
        </div>

        <MapCanvas height={220}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220" preserveAspectRatio="none">
            <rect x="100" y="30" width="200" height="160" rx="10"
              fill={`${stateInfo.bg}`}
              stroke={stateInfo.color}
              strokeWidth="1.5"
            />
            <text x="200" y="105" textAnchor="middle" fill={stateInfo.color} fontSize="11" fontFamily="monospace" fontWeight="600">
              {stateInfo.label}
            </text>
            <text x="200" y="120" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
              Germany · ~2.4 GB
            </text>
          </svg>
          {downloadState === 'downloading' && (
            <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>Downloading Germany…</span>
                <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>{progressPct}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '100%', borderRadius: 3, background: '#f59e0b', width: `${progressPct}%`, transition: 'width 0.08s linear' }} />
              </div>
            </div>
          )}
        </MapCanvas>
      </div>

      {/* ── OfflineMapRegionManager ── */}
      <div className="zone">
        <h2 className="sh" id="offs-manager">OfflineMapRegionManager</h2>
        <p className="body">
          The central API for downloading and managing map regions. Create it once and keep a reference
          throughout the app lifecycle.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val regionManager = OfflineMapRegionManager.Builder(context)
    .apiKey(BuildConfig.TOMTOM_API_KEY)
    .storageQuotaBytes(8L * 1024 * 1024 * 1024) // 8 GB max
    .autoDeletePolicy(AutoDeletePolicy.LEAST_RECENTLY_USED)
    .build()`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offs-mapregion">MapRegion — bounding box vs region code</h2>
        <p className="body">
          Define a download area using an ISO region code (recommended for country/state packages)
          or a custom bounding box for arbitrary areas.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Option A — region code (country or state)
val countryRegion = MapRegion.Builder()
    .regionCode("DEU") // Germany
    .build()

// Option B — bounding box
val bbox = BoundingBox(
    southWest = LatLng(47.2, 5.8),
    northEast = LatLng(55.1, 15.1)
)
val customRegion = MapRegion.Builder()
    .boundingBox(bbox)
    .build()

// Estimate storage before downloading
regionManager.estimateSize(countryRegion) { estimate ->
    val bytes = estimate.estimatedBytes
    Log.d("Offline", "Estimated size: ${bytes / 1_000_000} MB")
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offs-progress">Download progress callback</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`regionManager.downloadRegion(
    region = countryRegion,
    listener = object : DownloadProgressListener {
        override fun onProgress(progress: DownloadProgress) {
            val pct   = progress.progressPercentage  // 0–100
            val done  = progress.bytesDownloaded
            val total = progress.bytesTotal
        }

        override fun onComplete(region: DownloadedRegion) {
            // region.regionId, region.sizeBytes available
        }

        override fun onError(error: OfflineError) {
            when (error.type) {
                OfflineErrorType.STORAGE_FULL      -> handleStorageFull()
                OfflineErrorType.NETWORK_ERROR     -> scheduleRetry()
                OfflineErrorType.REGION_NOT_FOUND  -> showError()
            }
        }
    }
)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offs-storage">Storage management</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Set hard quota (bytes)
regionManager.setStorageQuota(6L * 1024 * 1024 * 1024)

// Query current usage
val usage = regionManager.getStorageUsage()
Log.d("Offline", "Used: ${usage.usedBytes} / ${usage.quotaBytes}")

// Auto-delete policy
regionManager.setAutoDeletePolicy(
    AutoDeletePolicy.LEAST_RECENTLY_USED
    // or AutoDeletePolicy.NEVER
)`}</pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. OFFLINE MAP MANAGEMENT
   ═══════════════════════════════════════════════════════════════════════════ */
const MOCK_REGIONS = [
  { id: 'NLD', name: 'Netherlands', size: '850 MB', status: 'up-to-date', date: '2026-04-12' },
  { id: 'BEL', name: 'Belgium',     size: '620 MB', status: 'outdated',   date: '2026-02-03' },
  { id: 'DEU', name: 'Germany',     size: '2.4 GB', status: 'up-to-date', date: '2026-04-12' },
];

const OFFLINE_MGMT_APIS = [
  { name: 'Map Display API',        type: 'REST API',    description: 'Tile endpoint whose downloaded packages are managed here — delta update URLs are served from this API.',       pageId: 'map-display-api-intro',     productId: 'map-display-api' },
  { name: 'Offline Quickstart',     type: 'Android SDK', description: 'Initial NativeMapStore and OfflineManager setup — required before regions are available to manage.',          pageId: 'navsdk-offline-quickstart', productId: 'navsdk' },
  { name: 'Offline Map Setup',      type: 'Android SDK', description: 'Region download configuration including bounding box, quota policy, and progress listeners.',                 pageId: 'navsdk-offline-setup',      productId: 'navsdk' },
];

export function NavSDKOfflineMgmt({ onNavigate }) {
  const [regions, setRegions] = useState(MOCK_REGIONS);
  const [updating, setUpdating] = useState(null);

  function deleteRegion(id) {
    setRegions(r => r.filter(x => x.id !== id));
  }

  function updateRegion(id) {
    setUpdating(id);
    setTimeout(() => {
      setRegions(r => r.map(x => x.id === id ? { ...x, status: 'up-to-date', date: '2026-05-10' } : x));
      setUpdating(null);
    }, 1800);
  }

  const statusColor = s => s === 'up-to-date' ? '#22c55e' : '#f97316';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Manual Map Management</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        List downloaded regions, delete individual packages, check for map updates, and apply
        incremental delta updates to keep offline data current with minimal bandwidth.
      </p>
      <ApiLinks items={OFFLINE_MGMT_APIS} onNavigate={onNavigate} />
      <Callout type="info">
        Delta (incremental) updates are available on <strong>Android</strong>. On iOS, the tile
        cache is managed automatically by <code>TileStore</code> without manual update control.
      </Callout>

      {/* ── Interactive demo ── */}
      <div className="zone">
        <h2 className="sh" id="offmgmt-demo">Downloaded regions</h2>
        <p className="body">Manage offline regions — update outdated packages or free up storage.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {regions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)', fontSize: '0.875rem', border: '1px dashed var(--border)', borderRadius: 10 }}>
              No downloaded regions
            </div>
          )}
          {regions.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)',
            }}>
              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(226,0,26,0.6)" strokeWidth="1.5" />
                  <path d="M7 12h10M12 7v10" stroke="rgba(226,0,26,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--black)' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.size} · Downloaded {r.date}</div>
              </div>
              {/* Status badge */}
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: `${statusColor(r.status)}18`,
                border: `1px solid ${statusColor(r.status)}44`,
                color: statusColor(r.status),
              }}>
                {r.status === 'up-to-date' ? 'Up to date' : 'Update available'}
              </span>
              {/* Actions */}
              {r.status === 'outdated' && (
                <button onClick={() => updateRegion(r.id)} disabled={updating === r.id} style={{
                  padding: '5px 12px', borderRadius: 7, cursor: updating === r.id ? 'not-allowed' : 'pointer',
                  background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.4)',
                  color: '#f97316', fontSize: '0.75rem', fontWeight: 600,
                  opacity: updating === r.id ? 0.6 : 1,
                }}>
                  {updating === r.id ? 'Updating…' : 'Update'}
                </button>
              )}
              <button onClick={() => deleteRegion(r.id)} style={{
                padding: '5px 10px', borderRadius: 7, cursor: 'pointer',
                background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.25)',
                color: '#e2001a', fontSize: '0.75rem', fontWeight: 600,
              }}>
                Delete
              </button>
            </div>
          ))}
          {regions.length > 0 && (
            <button onClick={() => setRegions(MOCK_REGIONS)} style={{
              alignSelf: 'flex-start', marginTop: 4, padding: '5px 12px', borderRadius: 7, cursor: 'pointer',
              background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.75rem',
            }}>Reset</button>
          )}
        </div>
      </div>

      {/* ── List regions ── */}
      <div className="zone">
        <h2 className="sh" id="offmgmt-list">List downloaded regions</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`regionManager.listDownloadedRegions { regions ->
    regions.forEach { region ->
        Log.d("Offline",
            "\${region.name}: \${region.sizeBytes / 1_000_000} MB, " +
            "status=\${region.status}, " +
            "downloaded=\${region.downloadDate}"
        )
    }
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offmgmt-delete">Delete a region</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`regionManager.deleteRegion(
    regionId = "NLD",
    onComplete = {
        Log.d("Offline", "Netherlands deleted, storage freed")
    },
    onError = { error ->
        Log.e("Offline", "Delete failed: \${error.message}")
    }
)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="offmgmt-updates">Check for updates</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`regionManager.checkForUpdates { updates ->
    updates.forEach { update ->
        Log.d("Offline",
            "\${update.regionId}: \${update.status}, " +
            "delta=\${update.deltaBytes / 1_000_000} MB"
        )
    }
}

// Apply incremental delta update for a specific region
regionManager.updateRegion(
    regionId = "BEL",
    onProgress = { progress ->
        Log.d("Offline", "Update: \${progress.progressPercentage}%")
    },
    onComplete = {
        Log.d("Offline", "Belgium updated to latest version")
    }
)`}</pre>
        </CodeBlock>

        <Callout type="info">
          Delta updates only transfer changed map tiles, typically 5–20% of the full region size.
          On iOS, tile cache refresh is handled automatically by the SDK — no explicit update call is required.
        </Callout>
      </div>
    </div>
  );
}
