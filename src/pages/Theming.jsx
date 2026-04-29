import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

const BASE = import.meta.env.BASE_URL;

/* ─── Step number badge ──────────────────────────────────────────────────────── */
function Step({ n, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--red)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
        }}>{n}</div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{title}</h3>
      </div>
      <div style={{ paddingLeft: 40 }}>{children}</div>
    </div>
  );
}

/* ─── Screenshot with caption ────────────────────────────────────────────────── */
function Figure({ src, alt, caption }) {
  return (
    <figure style={{ margin: '16px 0 20px', padding: 0 }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%', display: 'block', borderRadius: 8,
          border: '1px solid var(--border)',
        }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
      {caption && (
        <figcaption style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 6 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── Checklist ──────────────────────────────────────────────────────────────── */
function Checklist({ items }) {
  return (
    <ul style={{ listStyle: 'none', margin: '12px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.86rem', color: 'var(--mid)' }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Theming scope grid ─────────────────────────────────────────────────────── */
const SCOPE = [
  { icon: '🎨', label: 'Colours',     note: 'Brand palette, semantic roles, light/dark modes' },
  { icon: '🔤', label: 'Typography',  note: 'Typeface, weight, size scale' },
  { icon: '⬜', label: 'Radius',      note: 'Corner radius per component tier' },
  { icon: '🖼', label: 'Icons',       note: 'Replaced via the Visual Assets Figma file' },
  { icon: '📐', label: 'Spacing',     note: 'Layout and component spacing scale' },
  { icon: '📏', label: 'Sizes',       note: 'Touch targets, panel heights, map safe areas' },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function Theming() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Theming</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Apply your OEM brand to UX Library — colours, typography, radius, assets, and fonts — using Tokens Studio in Figma and the Android RRO mechanism.
      </div>

      {/* What you can theme */}
      <div className="zone">
        <h2 className="sh" id="theming-scope">What you can theme</h2>
        <p className="body">
          Every visual property in UX Library is driven by design tokens. You can customise all of the following to match your brand guidelines without touching any component code.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 8, marginBottom: 20,
        }}>
          {SCOPE.map(({ icon, label, note }) => (
            <div key={label} style={{
              padding: '12px 14px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="zone">
        <h2 className="sh" id="theming-prereqs">Prerequisites</h2>
        <p className="body">Before starting, make sure you have access to the following.</p>
        <Checklist items={[
          'Automotive UI Toolkit — the Figma file containing all components and Tokens Studio configuration',
          'Visual Assets — the Figma file for icons, graphics, and signage',
          'Tokens Studio plugin — installed in Figma',
          'GitHub access — to clone and run the RRO overlay script',
        ]} />
      </div>

      {/* Step 1 — Figma setup */}
      <div className="zone">
        <h2 className="sh" id="theming-setup">Set up in Figma</h2>
        <p className="body">
          Every ANA release ships an updated <strong>Automotive UI Toolkit</strong> and <strong>Visual Assets</strong> Figma file. Keep both in sync with your ANA version before starting any theme work.
        </p>

        <Step n="1" title="Get the Figma files">
          <p className="body" style={{ marginBottom: 12 }}>
            The <strong>Automotive UI Toolkit</strong> contains all core UI components, experience stacks, and Tokens Studio configuration. The <strong>Visual Assets</strong> file is the single source of truth for every icon, graphic, and piece of signage — replace assets here and all exports for both the map and UI are generated automatically.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <Figure
              src={`${BASE}theming/ui-toolkit.webp`}
              alt="Automotive UI Toolkit Figma file"
              caption="Automotive UI Toolkit — components, tokens, and theming instructions"
            />
            <Figure
              src={`${BASE}theming/visual-assets.webp`}
              alt="Visual Assets Figma file"
              caption="Visual Assets — icons, graphics, and signage for map and UI"
            />
          </div>
        </Step>

        <Step n="2" title="Publish both files">
          <p className="body" style={{ marginBottom: 12 }}>
            Publishing is required to connect the two files. Open each file and publish it to your Figma workspace library before proceeding.
          </p>
          <Figure
            src={`${BASE}theming/publish-library.webp`}
            alt="Publish Figma library"
            caption="Publish both the Automotive UI Toolkit and the Visual Assets file to your workspace"
          />
          <Callout type="info">
            For step-by-step instructions, see the <a href="https://help.figma.com/hc/en-us/articles/360025508373" target="_blank" rel="noopener noreferrer">Figma publishing guidelines</a>.
          </Callout>
        </Step>

        <Step n="3" title="Connect the libraries">
          <p className="body" style={{ marginBottom: 12 }}>
            Once published, swap the missing Visual Assets library reference in the UI Toolkit so your local copy is used. Open <strong>Manage libraries</strong>, locate the missing Visual Assets entry, and swap it with the file you published.
          </p>
          <Figure
            src={`${BASE}theming/swap-library.webp`}
            alt="Swap Figma library"
            caption="Swap the missing Visual Assets reference to your locally published copy"
          />
          <p className="body">
            After swapping, any asset replacements you make in your Visual Assets copy automatically propagate into the UI Toolkit.
          </p>
          <Callout type="info">
            See the <a href="https://help.figma.com/hc/en-us/articles/4404856784663" target="_blank" rel="noopener noreferrer">Figma library swap documentation</a> for details.
          </Callout>
        </Step>
      </div>

      {/* Tokens Studio */}
      <div className="zone">
        <h2 className="sh" id="theming-tokens-studio">Edit tokens with Tokens Studio</h2>
        <p className="body">
          TomTom uses <strong>Tokens Studio</strong> to manage design tokens, which are exported as Figma variables. Both are used in the UI Toolkit, but for OEM theming work directly in Tokens Studio rather than the Figma variables panel.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 8, margin: '12px 0 16px',
        }}>
          {[
            ['Run the plugin', 'Open the Automotive UI Toolkit and launch the Tokens Studio plugin from the plugin menu.'],
            ['Find your token', 'Use the search function to locate the token you want to change. Tokens are organised by tier: global → system → component.'],
            ['Edit the value', 'Right-click the token → Edit. Enter the new value (hex, dp, or reference to another token) and save.'],
            ['Select the token set', 'Make sure you are editing the correct set — for example Light or Dark for colour tokens.'],
            ['Export as variables', 'Once edits are finalised, export from Tokens Studio as Figma variables. This applies your changes across all components in the file.'],
          ].map(([title, desc]) => (
            <div key={title} style={{
              padding: '12px 14px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 4, color: 'var(--black)' }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
        <Callout type="info">
          For full Tokens Studio documentation, see <a href="https://docs.tokens.studio" target="_blank" rel="noopener noreferrer">docs.tokens.studio</a>.
        </Callout>
      </div>

      {/* Multi-display */}
      <div className="zone">
        <h2 className="sh" id="theming-displays">Theming across multiple displays</h2>
        <p className="body">
          UX Library supports theming across the central stack, instrument cluster, HUD, and micro/mini activities. How you structure your Figma files depends on whether you want a unified or differentiated theme.
        </p>
        <table className="prop-table">
          <thead>
            <tr><th>Scenario</th><th>Approach</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Same theme everywhere</strong></td>
              <td>Work from a single UI Toolkit file. The adaptiveness framework handles size adjustments per display automatically — no additional configuration needed.</td>
            </tr>
            <tr>
              <td><strong>Different themes per display</strong></td>
              <td>Create a separate copy of the UI Toolkit for each display (e.g., central stack and cluster). Edit token values independently in each copy.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Export */}
      <div className="zone">
        <h2 className="sh" id="theming-export">Export your theme</h2>
        <p className="body">Once your token edits are finalised in Figma, export three sets of files.</p>

        <h3 className="sub">Design tokens (JSON)</h3>
        <p className="body">
          Use Tokens Studio's Export function and choose <strong>Export as multiple JSON files</strong>. This produces one JSON file per token set, which is required by the RRO build process. Do not merge token sets into a single file.
        </p>

        <h3 className="sub">Visual assets</h3>
        <p className="body">
          Open the Visual Assets Figma file and export any icons or graphics you have replaced. Follow the naming conventions and file formats preset in the file — the RRO script expects exact filenames.
        </p>

        <h3 className="sub">Fonts</h3>
        <p className="body">
          If your theme uses a custom typeface, supply font files in the required Android formats. The recommended approach is to provide a file containing <strong>Latin characters only</strong> via the RRO — this keeps memory footprint minimal. For other scripts (Cyrillic, Arabic, CJK), the application falls back to the Android OS font mechanism automatically.
        </p>
      </div>

      {/* Apply via RRO */}
      <div className="zone">
        <h2 className="sh" id="theming-rro">Apply the theme via RRO</h2>
        <p className="body">
          With your JSON token files, assets, and fonts ready, apply the theme to your Android application using the <strong>RRO (Runtime Resource Overlay)</strong> script. RRO is Android's standard mechanism for replacing packaged resources at runtime without modifying the base application APK.
        </p>
        <Callout type="warn">
          The RRO script is currently in <strong>private preview</strong> and available on request only. Contact your TomTom integration engineer to request access.
        </Callout>
        <p className="body">
          Once you have the script, provide it with the paths to your exported JSON files, assets folder, and font files. The script packages everything into an overlay APK that is pushed alongside the navigation application.
        </p>
      </div>

      {/* Testing */}
      <div className="zone">
        <h2 className="sh" id="theming-testing">Test your theme</h2>
        <p className="body">
          After applying the RRO to your target device, verify your theme thoroughly before signing off.
        </p>
        <Checklist items={[
          'Check all colour tokens across light mode and dark mode',
          'Verify contrast ratios meet your accessibility and ANA requirements',
          'Test legibility across screen sizes (central stack, cluster, HUD)',
          'Confirm custom icons render correctly at all sizes',
          'Check that custom fonts display at all weights and styles used in the app',
          'Validate radius and spacing tokens in high-density UI areas (NIP, horizon panel)',
        ]} />
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
