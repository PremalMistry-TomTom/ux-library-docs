import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TOC_MAP = {
  colour: [
    { id: 'c-global',    label: 'Global colours' },
    { id: 'c-extended',  label: 'Extended collection' },
    { id: 'c-system',    label: 'System colours' },
    { id: 'c-surfaces',  label: 'a. Surfaces',          indent: true },
    { id: 'c-brand',     label: 'b. Brand',             indent: true },
    { id: 'c-guidance',  label: 'c. Guidance',          indent: true },
    { id: 'c-alerts',    label: 'd. Alerts & warnings', indent: true },
    { id: 'c-actions',   label: 'e. Actions',           indent: true },
    { id: 'c-ui',        label: 'f. UI controls',       indent: true },
    { id: 'c-signage',   label: 'g. Road signage',      indent: true },
    { id: 'c-poi',       label: 'h. POI categories',    indent: true },
    { id: 'c-semantics', label: 'Semantic definitions' },
  ],
  'home-screen-layout': [
    { id: 'h-overview',      label: 'Overview' },
    { id: 'h-zones',         label: 'Screen zones' },
    { id: 'h-resize',        label: 'Resize application area' },
    { id: 'h-states',        label: 'UI state API' },
    { id: 'h-requirements',  label: 'Requirements' },
  ],
  traffic: [
    { id: 'tr-overview',     label: 'Overview' },
    { id: 'tr-layers',       label: 'Flow & incidents layers' },
    { id: 'tr-incidents',    label: 'Incident types' },
    { id: 'tr-refresh',      label: 'Refresh interval' },
    { id: 'tr-provider',     label: 'Custom provider' },
    { id: 'tr-requirements', label: 'Requirements' },
  ],
  'safety-locations': [
    { id: 'sl-overview',     label: 'Overview' },
    { id: 'sl-types',        label: 'Safety location types' },
    { id: 'sl-zones',        label: 'Speed & danger zones' },
    { id: 'sl-style',        label: 'Style customisation' },
    { id: 'sl-requirements', label: 'Requirements' },
  ],
  'map-style': [
    { id: 'ms-overview',      label: 'Overview' },
    { id: 'ms-variants',      label: 'Style variants' },
    { id: 'ms-uri',           label: 'Style URIs' },
    { id: 'ms-custom',        label: 'Customising a style' },
    { id: 'ms-tilt',          label: 'Adding tilt' },
    { id: 'ms-requirements',  label: 'Requirements' },
  ],
  'nav-controls': [
    { id: 'nc-overview',     label: 'Overview' },
    { id: 'nc-position',     label: 'Position & visibility' },
    { id: 'nc-entry',        label: 'Search entry point' },
    { id: 'nc-requirements', label: 'Requirements' },
  ],
  'horizon-panel': [
    { id: 'hp-overview',     label: 'Overview' },
    { id: 'hp-decompose',    label: 'Composed vs decomposed' },
    { id: 'hp-position',     label: 'Position (composed)' },
    { id: 'hp-requirements', label: 'Requirements' },
  ],
  'instruction-panel': [
    { id: 'nip-overview',     label: 'Overview' },
    { id: 'nip-position',     label: 'Position' },
    { id: 'nip-requirements', label: 'Requirements' },
  ],
  'eta-panel': [
    { id: 'eta-overview',     label: 'Overview' },
    { id: 'eta-position',     label: 'Position' },
    { id: 'eta-content',      label: 'Content fields' },
    { id: 'eta-requirements', label: 'Requirements' },
  ],
  'route-bar': [
    { id: 'rb-overview',     label: 'Overview' },
    { id: 'rb-position',     label: 'Positioning' },
    { id: 'rb-requirements', label: 'Requirements' },
  ],
  'search-engine': [
    { id: 'se-overview',      label: 'Overview' },
    { id: 'se-provider',      label: 'Provider setup' },
    { id: 'se-transitions',   label: 'Connectivity transitions' },
    { id: 'se-ui-custom',     label: 'Search UI customisation' },
    { id: 'se-lpp',           label: 'Location preview panel' },
    { id: 'se-entry-points',  label: 'POI entry points' },
    { id: 'se-requirements',  label: 'Requirements' },
  ],
  font: [
    { id: 'f-global',          label: 'Global tokens' },
    { id: 'f-family',          label: 'Font family',     indent: true },
    { id: 'f-weight',          label: 'Font weight',     indent: true },
    { id: 'f-size',            label: 'Font size',       indent: true },
    { id: 'f-system',          label: 'System tokens' },
    { id: 'f-system-anatomy',  label: 'Token anatomy',   indent: true },
    { id: 'f-system-scale',    label: 'Token scale',     indent: true },
    { id: 'f-component',       label: 'Component tokens' },
    { id: 'f-theming',         label: 'Theming & scaling' },
  ],
  'corner-radius': [
    { id: 'cr-intro',    label: 'Introduction' },
    { id: 'cr-sizes',    label: 'Radius sizes' },
    { id: 'cr-examples', label: 'Examples' },
  ],
  'ai-overview': [
    { id: 'ai-overview',      label: 'Overview' },
    { id: 'ai-architecture',  label: 'Architecture' },
    { id: 'ai-scope',         label: 'Scope of responsibility' },
    { id: 'ai-capabilities',  label: 'Capabilities' },
    { id: 'ai-requirements',  label: 'Requirements' },
  ],
  'voice-engine': [
    { id: 've-overview',        label: 'Overview' },
    { id: 've-responsibilities', label: 'OEM responsibilities' },
    { id: 've-integration',     label: 'Connecting your TTS engine' },
    { id: 've-providers',       label: 'VPA providers' },
    { id: 've-requirements',    label: 'Requirements' },
  ],
  'speech-to-text': [
    { id: 'stt-overview',     label: 'Overview' },
    { id: 'stt-boundary',     label: 'The TAIA input boundary' },
    { id: 'stt-integration',  label: 'STT integration pattern' },
    { id: 'stt-wake',         label: 'Wake word handling' },
    { id: 'stt-requirements', label: 'Requirements' },
  ],
  'ai-config': [
    { id: 'ac-overview',      label: 'Overview' },
    { id: 'ac-dependency',    label: 'Adding the dependency' },
    { id: 'ac-init',          label: 'Initialising the TAIA client' },
    { id: 'ac-context',       label: 'Navigation context' },
    { id: 'ac-events',        label: 'MQTT event delivery' },
    { id: 'ac-session',       label: 'Multi-turn conversations' },
    { id: 'ac-requirements',  label: 'Requirements' },
  ],
  'ev': [
    { id: 'ev-overview',      label: 'Overview' },
    { id: 'ev-architecture',  label: 'Architecture' },
    { id: 'ev-vehicle',       label: 'Vehicle setup' },
    { id: 'ev-search',        label: 'EV charging search' },
    { id: 'ev-routing',       label: 'Long distance routing' },
    { id: 'ev-preferences',   label: 'Route preferences' },
    { id: 'ev-requirements',  label: 'Requirements' },
  ],
  'ev-overview': [
    { id: 'evo-arch',   label: 'Architecture' },
    { id: 'evo-guide',  label: 'Setup guide' },
    { id: 'evo-order',  label: 'Initialisation order' },
  ],
  'ev-battery': [
    { id: 'evb-presets',  label: 'Vehicle presets' },
    { id: 'evb-provider', label: 'Vehicle provider' },
    { id: 'evb-aux',      label: 'Auxiliary consumption' },
    { id: 'evb-offset',   label: 'Battery offset' },
    { id: 'evb-params',   label: 'Parameter reference' },
  ],
  'ev-charging-search': [
    { id: 'evcs-ui',      label: 'Search UI' },
    { id: 'evcs-options', label: 'Search API options' },
    { id: 'evcs-msp',     label: 'Preferred networks' },
  ],
  'ev-routing': [
    { id: 'evr-strategy', label: 'Charging strategy' },
    { id: 'evr-prefs',    label: 'Route preferences' },
    { id: 'evr-api',      label: 'API request' },
    { id: 'evr-response', label: 'Response fields' },
    { id: 'evr-trip',     label: 'Trip summary' },
  ],
  'ev-nav-ui': [
    { id: 'evui-soc',     label: 'SoC display' },
    { id: 'evui-range',   label: 'Range ring' },
    { id: 'evui-reroute', label: 'Rerouting' },
  ],
  'ev-requirements': [
    { id: 'evreq-checklist',  label: 'Checklist' },
    { id: 'evreq-deps',       label: 'Dependencies' },
    { id: 'evreq-permissions', label: 'Permissions' },
  ],
  'adas': [
    { id: 'adas-overview',      label: 'Overview' },
    { id: 'adas-capabilities',  label: 'Capabilities' },
    { id: 'adas-integration',   label: 'Integration model' },
  ],
  'cluster': [
    { id: 'cl-overview',     label: 'Overview' },
    { id: 'cl-start',        label: 'Starting the activity' },
    { id: 'cl-config',       label: 'Configuration' },
    { id: 'cl-position',     label: 'Positioning components' },
    { id: 'cl-runtime',      label: 'Runtime updates' },
    { id: 'cl-requirements', label: 'Requirements' },
  ],
  'screenshot-assets': [
    { id: 'sa-how',                   label: 'How to use' },
    { id: 'sa-home-screen-layout',    label: 'Home Screen Layout' },
    { id: 'sa-nav-controls',          label: 'Navigation Controls' },
    { id: 'sa-horizon-panel',         label: 'Horizon Panel' },
    { id: 'sa-instruction-panel',     label: 'Next Instruction Panel' },
    { id: 'sa-eta-panel',             label: 'ETA Panel' },
    { id: 'sa-route-bar',             label: 'Route Bar' },
    { id: 'sa-search-engine',         label: 'Search Engine' },
    { id: 'sa-ev',                    label: 'EV Support' },
    { id: 'sa-ai-overview',           label: 'TAIA' },
  ],
  'design-tokens': [
    { id: 'dt-intro',    label: 'Introduction' },
    { id: 'dt-benefits', label: 'Benefits' },
    { id: 'dt-structure', label: 'Token structure' },
    { id: 'dt-names',    label: 'Token names' },
    { id: 'dt-overview', label: 'Structure overview' },
    { id: 'dt-examples', label: 'Token examples' },
    { id: 'dt-naming',   label: 'Naming principles' },
    { id: 'dt-themes',   label: 'Themes & modes' },
  ],
};

export default function TOC({ currentPage }) {
  const { t } = useTranslation('common');
  const [activeId, setActiveId] = useState('');
  const items = TOC_MAP[currentPage] || [];

  useEffect(() => {
    if (!items.length) return;
    const ids = items.map(i => i.id);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [currentPage]);

  if (!items.length) return <aside className="toc" />;

  return (
    <aside className="toc">
      <div className="toc-heading">{t('ui.onThisPage')}</div>
      <ul className="toc-list">
        {items.map(item => {
          const label = t(`toc.${currentPage}.${item.id}`, { defaultValue: item.label });
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${item.indent ? 'indent' : ''}${activeId === item.id ? ' active' : ''}`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
