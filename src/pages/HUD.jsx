import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

export default function HUD({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Head-Up Display</h1>
        <p className="page-subtitle">
          Project turn-by-turn navigation instructions onto a vehicle HUD so drivers keep eyes on the road.
        </p>
      </div>

      <div className="page-body">
        <h2 className="sh">Overview</h2>
        <p>
          TomTom's UX Library provides a lightweight HUD rendering surface designed for AOSP-based
          head-up displays. A dedicated <code>TomTomHudView</code> component mirrors the active
          navigation state — current instruction, distance to manoeuvre, speed limit, and lane
          guidance — at the contrast ratios required by automotive HUD optics.
        </p>
        <p>
          The HUD layout is intentionally minimal: maximum two data fields visible at once, high-contrast
          iconography, and text sizes calibrated for a 1–3 metre focal distance. All elements auto-scale
          with the display's DPI and accept the same <code>TomTomTheme</code> token overrides as the main
          navigation UI.
        </p>

        <Callout type="info">
          HUD support requires NavSDK 2.1 or later and a display with a full Android activity surface.
          Waveguide or combiner optics that run outside Android are not supported.
        </Callout>

        <h2 className="sh">Integration</h2>
        <p>
          Add <code>TomTomHudView</code> to your HUD activity layout. The view binds to the same
          <code>NavigationController</code> instance used by your main navigation UI — there is no
          separate data connection to set up.
        </p>

        <CodeBlock language="xml" title="hud_activity.xml">{`<com.tomtom.ux.hud.TomTomHudView
    android:id="@+id/tomtom_hud_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:hudTheme="@style/TomTomHudTheme"
    app:showSpeedLimit="true"
    app:showLaneGuidance="true" />`}</CodeBlock>

        <CodeBlock language="kotlin" title="HudActivity.kt">{`class HudActivity : AppCompatActivity() {

    private lateinit var hudView: TomTomHudView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.hud_activity)

        hudView = findViewById(R.id.tomtom_hud_view)

        // Bind to the shared NavigationController
        val navigationController = NavigationServiceLocator.navigationController
        hudView.setNavigationController(navigationController)
    }

    override fun onDestroy() {
        hudView.release()
        super.onDestroy()
    }
}`}</CodeBlock>

        <h2 className="sh">Theming</h2>
        <p>
          Override the built-in HUD token set to match your vehicle's combiner or projection colour
          profile. HUD displays typically require inverted colours on a dark background — the default
          theme is pre-configured for this.
        </p>

        <CodeBlock language="xml" title="themes.xml">{`<style name="TomTomHudTheme" parent="TomTomHudBaseTheme">
    <!-- Primary instruction text -->
    <item name="tomtomHudColorPrimary">#FFFFFF</item>
    <!-- Secondary distance / ETA text -->
    <item name="tomtomHudColorSecondary">#B3FFFFFF</item>
    <!-- Manoeuvre arrow fill -->
    <item name="tomtomHudColorArrowFill">#E8382C</item>
    <!-- Speed limit circle -->
    <item name="tomtomHudColorSpeedLimitBg">#FFFFFF</item>
    <item name="tomtomHudColorSpeedLimitText">#000000</item>
    <!-- Background (near-black for projection) -->
    <item name="tomtomHudColorBackground">#00000000</item>
</style>`}</CodeBlock>

        <h2 className="sh">Layout modes</h2>
        <p>
          <code>TomTomHudView</code> supports three built-in layout modes selectable at runtime:
        </p>
        <ul>
          <li><strong>Compact</strong> — Instruction icon + distance only. Minimum screen space.</li>
          <li><strong>Standard</strong> — Instruction, distance, road name, and speed limit. Default.</li>
          <li><strong>Extended</strong> — Adds lane guidance strip. Requires ≥ 200 dp height.</li>
        </ul>

        <CodeBlock language="kotlin">{`// Switch layout at runtime (e.g. when approaching a complex junction)
hudView.setLayoutMode(HudLayoutMode.EXTENDED)`}</CodeBlock>

        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip" onClick={() => onNavigate?.('cluster')}>
            Displaying on Cluster
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('nav-controls')}>
            Navigation Controls
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('adas')}>
            ADAS Integration
          </button>
        </div>
      </div>
    </div>
  );
}
