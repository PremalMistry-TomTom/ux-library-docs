import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);

// Map tab label → hljs language id
const LANG_MAP = {
  'kotlin':       'kotlin',
  'rest (json)':  'json',
  'json':         'json',
  'xml':          'xml',
  'bash':         'bash',
  'shell':        'bash',
  'javascript':   'javascript',
  'js':           'javascript',
  'typescript':   'typescript',
  'ts':           'typescript',
};

function detectLang(label = '') {
  return LANG_MAP[label.toLowerCase()] || null;
}

/** Wrap each line of highlighted (or plain-escaped) HTML in a <span class="cb-line"> */
function addLineNumbers(html) {
  const lines = html.split('\n');
  if (lines[lines.length - 1] === '') lines.pop(); // trim trailing blank
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
}

function HighlightedPre({ code, lang, maxHeight, id, role, 'aria-labelledby': ariaLabelledBy, tabIndex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.removeAttribute('data-highlighted');
    let html;
    if (lang && hljs.getLanguage(lang)) {
      html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    } else {
      // escape plain text so it's safe for innerHTML
      html = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    ref.current.innerHTML = addLineNumbers(html);
  }, [code, lang]);

  return (
    <pre
      className="cb-pre"
      style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      tabIndex={tabIndex}
    >
      <code ref={ref} />
    </pre>
  );
}

export default function CodeBlock({ label, tabs, children, code, language }) {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabList = tabs || (label ? [label] : []);
  const panels = Array.isArray(children) ? children : [children];
  const activePanel = panels[activeTab];
  const activeLabel = tabList[activeTab] || '';

  // `code` + `language` props take priority over children-based extraction
  const lang = code ? detectLang(language || '') : detectLang(activeLabel);
  const rawCode = code ?? extractText(activePanel?.props?.children ?? activePanel);

  function handleCopy() {
    navigator.clipboard?.writeText(rawCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleTabKeyDown(e, i) {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActiveTab((i + 1) % tabList.length); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setActiveTab((i - 1 + tabList.length) % tabList.length); }
    if (e.key === 'Home')       { e.preventDefault(); setActiveTab(0); }
    if (e.key === 'End')        { e.preventDefault(); setActiveTab(tabList.length - 1); }
  }

  return (
    <div className="code-block">
      <div className="code-bar">
        {tabList.length > 1 ? (
          <div className="code-tabs" role="tablist" aria-label="Code language">
            {tabList.map((tab, i) => (
              <span
                key={tab}
                className={`code-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
                role="tab"
                tabIndex={activeTab === i ? 0 : -1}
                aria-selected={activeTab === i}
                aria-controls={`code-panel-${i}`}
                id={`code-tab-${i}`}
                onKeyDown={e => handleTabKeyDown(e, i)}
              >
                {tab}
              </span>
            ))}
          </div>
        ) : tabList.length === 1 ? (
          <span className="code-bar-label">{tabList[0]}</span>
        ) : null}
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? t('ui.copied') : t('ui.copy')}
        </button>
      </div>
      <HighlightedPre
        code={rawCode}
        lang={lang}
        tabIndex={0}
        id={tabList.length > 1 ? `code-panel-${activeTab}` : undefined}
        aria-labelledby={tabList.length > 1 ? `code-tab-${activeTab}` : undefined}
        role={tabList.length > 1 ? 'tabpanel' : undefined}
      />
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
