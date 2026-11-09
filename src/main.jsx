import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import PasswordGate from './components/ui/PasswordGate.jsx'

// One-time reset of picks saved before the Nov 2026 defaults (hairline figures, Routing
// nav Option B), so returning visitors see them too. Bump PREFS_VERSION to reset again.
const PREFS_VERSION = '2026-11-hairline';
try {
  if (localStorage.getItem('prefsVersion') !== PREFS_VERSION) {
    ['illoStylePref', 'routing-nav-ia-mode'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('prefsVersion', PREFS_VERSION);
  }
} catch { /* storage blocked: defaults apply anyway */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PasswordGate>
      <App />
    </PasswordGate>
  </StrictMode>,
)
