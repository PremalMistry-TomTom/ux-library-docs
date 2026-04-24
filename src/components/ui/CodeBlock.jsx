import { useState } from 'react';

export default function CodeBlock({ label, tabs, children }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabList = tabs || (label ? [label] : []);
  const panels = Array.isArray(children) ? children : [children];
  const activeContent = panels[activeTab];

  function handleCopy() {
    const text = activeContent?.props?.children || '';
    const raw = typeof text === 'string' ? text : extractText(text);
    navigator.clipboard?.writeText(raw).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="code-block">
      <div className="code-bar">
        {tabList.length > 1 ? (
          <div className="code-tabs">
            {tabList.map((t, i) => (
              <span
                key={t}
                className={`code-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </span>
            ))}
          </div>
        ) : tabList.length === 1 ? (
          <span className="code-bar-label">{tabList[0]}</span>
        ) : null}
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {panels[activeTab]}
    </div>
  );
}

function extractText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props?.children) return extractText(node.props.children);
  return '';
}
