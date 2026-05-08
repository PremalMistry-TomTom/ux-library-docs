import { useState, useEffect, useRef } from 'react';

/* ─── Change this to update the password ──────────────────────────────────── */
const SITE_PASSWORD = 'FasterRouteFound';
const SESSION_KEY   = 'tt-docs-auth';

/* ─── Minimal keyframe injection (avoids adding to index.css) ────────────── */
const SHAKE_STYLE = `
@keyframes tt-gate-shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
@keyframes tt-gate-fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tt-gate-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
`;

export default function PasswordGate({ children }) {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [value,  setValue]      = useState('');
  const [error,  setError]      = useState(false);
  const [shake,  setShake]      = useState(false);
  const [leaving, setLeaving]   = useState(false);
  const inputRef = useRef(null);

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById('tt-gate-styles')) return;
    const el = document.createElement('style');
    el.id = 'tt-gate-styles';
    el.textContent = SHAKE_STYLE;
    document.head.appendChild(el);
  }, []);

  // Focus input when gate appears
  useEffect(() => {
    if (!authed) setTimeout(() => inputRef.current?.focus(), 80);
  }, [authed]);

  if (authed) return children;

  function submit(e) {
    e.preventDefault();
    if (value === SITE_PASSWORD) {
      setLeaving(true);
      setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setAuthed(true);
      }, 350);
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
    }
  }

  // Derive dark from localStorage so the gate respects the saved theme
  const isDark = localStorage.getItem('ux-theme') === 'dark';

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: isDark ? '#13131d' : '#f4f5f7',
    animation: leaving ? 'tt-gate-out 0.35s ease forwards' : 'none',
  };

  const card = {
    width: 340, padding: '40px 36px 36px',
    background: isDark ? '#1e1e2a' : '#ffffff',
    border: `1px solid ${isDark ? '#2c2c3e' : '#e2e2e8'}`,
    borderRadius: 16,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.5)'
      : '0 8px 40px rgba(0,0,0,0.10)',
    animation: shake
      ? 'tt-gate-shake 0.45s ease'
      : 'tt-gate-fade-in 0.3s ease',
    fontFamily: "'proxima-nova', 'Proxima Nova', system-ui, sans-serif",
  };

  const label = {
    display: 'block',
    fontSize: '0.75rem', fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color: isDark ? '#80809a' : '#888',
    marginBottom: 8,
  };

  const input = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px',
    fontSize: '0.9375rem',
    background: isDark ? '#13131d' : '#f4f5f7',
    border: `1.5px solid ${error ? '#DF1B12' : (isDark ? '#2c2c3e' : '#d8d8e0')}`,
    borderRadius: 8,
    color: isDark ? '#e2e2ee' : '#111',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  const btn = {
    marginTop: 16, width: '100%',
    padding: '11px 0',
    background: '#DF1B12', border: 'none', borderRadius: 8,
    color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  };

  const errMsg = {
    marginTop: 8, fontSize: '0.8125rem',
    color: '#DF1B12', minHeight: 18,
  };

  return (
    <>
      <div style={overlay}>
        <div style={card}>
          {/* TomTom wordmark */}
          <svg width="88" height="17" viewBox="0 0 125 24" fill="none" style={{ display: 'block', marginBottom: 24 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M121.444 22.1291H124.999L125 13.0887C125 12.5 124.925 12.0676 124.859 11.7567C124.836 11.6515 124.816 11.5678 124.794 11.4864C124.092 8.90785 121.577 7.123 118.811 7.23655C117.528 7.29129 116.321 7.76661 115.225 8.64915L115.085 8.76169L114.945 8.64915C113.849 7.76661 112.642 7.29129 111.359 7.23655C108.59 7.12114 106.078 8.90785 105.376 11.4864C105.354 11.568 105.334 11.652 105.311 11.7577C105.242 12.0876 105.17 12.5049 105.17 13.0887L105.171 22.1291H108.726V13.242C108.726 11.9833 109.753 10.9593 111.015 10.9593C112.266 10.9593 113.292 11.9744 113.303 13.222C113.304 13.2264 113.304 13.2342 113.304 13.242V22.1291H116.866L116.867 13.2212C116.878 11.9743 117.904 10.9593 119.155 10.9593C120.417 10.9593 121.444 11.9833 121.444 13.242V22.1291Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M95.1744 18.5808C93.0256 18.5808 91.2773 16.8374 91.2773 14.6945C91.2773 12.5516 93.0256 10.8081 95.1744 10.8081C97.3234 10.8081 99.0716 12.5516 99.0716 14.6945C99.0716 16.8374 97.3234 18.5808 95.1744 18.5808ZM95.1741 7.25977C91.0633 7.25977 87.7188 10.5949 87.7188 14.6944C87.7188 18.794 91.0633 22.1292 95.1741 22.1292C99.285 22.1292 102.629 18.794 102.629 14.6944C102.629 10.5949 99.285 7.25977 95.1741 7.25977Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M82.9062 22.1324H87.5178L85.4546 18.5805C85.0074 18.58 83.1692 18.5776 83.026 18.5776C81.8791 18.5776 80.8802 17.7512 80.7994 16.7353C80.7887 16.6023 80.7791 16.4376 80.7716 16.2566V10.9014H85.4537L87.2833 7.69089H80.7716V1.86743L77.2102 4.32446V7.52023H74.9629V11.072H77.21L77.2134 15.9215C77.2134 15.9236 77.211 16.1479 77.2144 16.2125L77.228 16.4827C77.3498 18.8376 78.5126 20.5715 80.684 21.6355C81.2652 21.9202 81.908 22.0772 82.7073 22.1294L82.9062 22.1291V22.1324Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M68.864 22.129H72.4192L72.4198 13.0887C72.4198 12.5 72.3444 12.0676 72.2785 11.7567C72.2556 11.6514 72.2355 11.5677 72.2135 11.4863C71.512 8.90779 68.9973 7.12293 66.2307 7.23648C64.9479 7.29123 63.7413 7.76655 62.6447 8.64909L62.5049 8.76163L62.3651 8.64909C61.2685 7.76655 60.0619 7.29123 58.7788 7.23648C56.01 7.12108 53.4979 8.90779 52.7962 11.4863C52.774 11.5679 52.754 11.6519 52.731 11.7577C52.6613 12.0875 52.5898 12.5049 52.5898 13.0887L52.5905 22.129H56.1459V13.2419C56.1459 11.9833 57.1727 10.9593 58.4348 10.9593C59.6856 10.9593 60.7119 11.9743 60.7229 13.222C60.7233 13.2264 60.7238 13.2342 60.7238 13.2419V22.129H64.2861L64.2869 13.2211C64.2978 11.9743 65.3242 10.9593 66.5749 10.9593C67.8372 10.9593 68.864 11.9833 68.864 13.2419V22.129Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M42.5944 18.5808C40.4454 18.5808 38.6973 16.8374 38.6973 14.6945C38.6973 12.5516 40.4454 10.8081 42.5944 10.8081C44.7434 10.8081 46.4915 12.5516 46.4915 14.6945C46.4915 16.8374 44.7434 18.5808 42.5944 18.5808ZM42.594 7.25977C38.4831 7.25977 35.1387 10.5949 35.1387 14.6944C35.1387 18.794 38.4831 22.1292 42.594 22.1292C46.7049 22.1292 50.0493 18.794 50.0493 14.6944C50.0493 10.5949 46.7049 7.25977 42.594 7.25977Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M30.3261 22.1325H34.9378L32.8745 18.5805C32.4273 18.58 30.5891 18.5777 30.4459 18.5777C29.299 18.5777 28.3001 17.7512 28.2193 16.7354C28.2086 16.6024 28.199 16.4376 28.1915 16.2567V10.9014H32.8736L34.7033 7.69095H28.1915V1.86749L24.6301 4.32452V7.52029H22.3828V11.0721H24.6299L24.6333 15.9216C24.6333 15.9236 24.6309 16.148 24.6343 16.2126L24.6479 16.4827C24.7697 18.8377 25.9326 20.5715 28.1039 21.6355C28.6851 21.9203 29.328 22.0772 30.1272 22.1295L30.3261 22.1291V22.1325Z" fill={isDark ? '#e2e2ee' : '#111'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.28764 24.0001L11.4639 18.5139H5.11133L8.28764 24.0001Z" fill="#DF1B12"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.28694 12.5839C5.89835 12.5839 3.95522 10.6459 3.95522 8.26409C3.95522 5.88209 5.89835 3.94415 8.28694 3.94415C10.6755 3.94415 12.6187 5.88209 12.6187 8.26409C12.6187 10.6459 10.6755 12.5839 8.28694 12.5839ZM8.28694 0C3.7175 0 0 3.70725 0 8.26409C0 12.8208 3.7175 16.528 8.28694 16.528C12.8564 16.528 16.5739 12.8208 16.5739 8.26409C16.5739 3.70725 12.8564 0 8.28694 0Z" fill="#DF1B12"/>
          </svg>

          <p style={{ margin: '0 0 20px', fontSize: '0.9375rem', color: isDark ? '#b0b0c8' : '#555', lineHeight: 1.5 }}>
            This is an internal preview. Enter the password to continue.
          </p>

          <form onSubmit={submit} noValidate>
            <label style={label} htmlFor="tt-gate-pw">Password</label>
            <input
              ref={inputRef}
              id="tt-gate-pw"
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false); }}
              placeholder="Enter password"
              style={input}
              autoComplete="current-password"
            />
            <p style={errMsg}>{error ? 'Incorrect password — try again.' : ''}</p>
            <button type="submit" style={btn}>
              Continue
            </button>
          </form>
        </div>
      </div>
      {/* Render children so they mount (but are hidden under overlay) */}
      <div style={{ visibility: 'hidden', pointerEvents: 'none', position: 'fixed' }} aria-hidden="true" />
    </>
  );
}
