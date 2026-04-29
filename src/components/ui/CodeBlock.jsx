import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);

// Map tab label → hljs language id
const LANG_MAP = {
  'kotlin':       'kotlin',
  'rest (json)':  'json',
  'json':         'json',
  'xml':          'xml',
  'bash':         'bash',
  'shell':        'bash',
};

function detectLang(label = '') {
  return LANG_MAP[label.toLowerCase()] || null;
}

function HighlightedPre({ code, lang }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.removeAttribute('data-highlighted');
    if (lang && hljs.getLanguage(lang)) {
      const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
      ref.current.innerHTML = result.value;
    } else {
      ref.current.textContent = code;
    }
  }, [code, lang]);

  return (
    <pre>
      <code ref={ref} />
    </pre>
  );
}

export default function CodeBlock({ label, tabs, children }) {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabList = tabs || (label ? [label] : []);
  const panels = Array.isArray(children) ? children : [children];
  const activePanel = panels[activeTab];
  const activeLabel = tabList[activeTab] || '';
  const lang = detectLang(activeLabel);

  // Extract raw text from the child <pre> node
  const rawCode = extractText(activePanel?.props?.children ?? activePanel);

  function handleCopy() {
    navigator.clipboard?.writeText(rawCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="code-block">
      <div className="code-bar">
        {tabList.length > 1 ? (
          <div className="code-tabs">
            {tabList.map((tab, i) => (
              <span
                key={tab}
                className={`code-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </span>
            ))}
          </div>
        ) : tabList.length === 1 ? (
          <span className="code-bar-label">{tabList[0]}</span>
        ) : null}
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? t('ui.copied') : t('ui.copy')}
        </button>
      </div>
      <HighlightedPre code={rawCode} lang={lang} />
    </div>
  );
}

function extractText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props?.children !== undefined) return extractText(node.props.children);
  return '';
}
