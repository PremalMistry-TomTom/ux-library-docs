import { useState } from 'react';

export function Swatch({ name, hex, compact }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }

  if (compact) {
    return (
      <div className={`ctx-swatch${copied ? ' copied' : ''}`} onClick={handleClick}>
        <div className="sw-color" style={{ background: hex }} />
        <div className="sw-info">
          <div className="sw-name">{name}</div>
          <div className="sw-hex">{hex}</div>
        </div>
        <div className="sw-toast">Copied!</div>
      </div>
    );
  }

  return (
    <div className={`swatch${copied ? ' copied' : ''}`} onClick={handleClick}>
      <div className="sw-color" style={{ background: hex }} />
      <div className="sw-info">
        <div className="sw-name">{name}</div>
        <div className="sw-hex">{hex}</div>
      </div>
      <div className="sw-toast">Copied!</div>
    </div>
  );
}

export function TokenDot({ hex }) {
  const [copied, setCopied] = useState(false);

  function handleClick(e) {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }

  return (
    <div
      className={`token-dot${copied ? ' copied' : ''}`}
      style={{ background: hex }}
      onClick={handleClick}
    >
      <div className="sw-toast">✓</div>
    </div>
  );
}
