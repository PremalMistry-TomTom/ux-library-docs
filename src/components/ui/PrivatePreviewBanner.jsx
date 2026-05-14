/* ─── PrivatePreviewBanner / VersionBanner ────────────────────────────────────
   Unified version-status banner used across all API reference pages,
   API explorers, and SDK introduction pages.

   Props:
     variant   'private' | 'public' | 'free'   — colour scheme
     compact   boolean                          — slim layout for explorer pages
     title     string                           — overrides the default title
     message   string | node                   — body text (required for compact)
     api       string                           — appended to default title: "Private Preview — {api}"
     children  node                            — CTA buttons, extra content
── ─────────────────────────────────────────────────────────────────────────── */

function LightningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="8"/>
      <line x1="12" y1="12" x2="12" y2="17"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

const VARIANTS = {
  private: {
    Icon: LightningIcon,
    rootMod: '',
    iconMod: '',
    defaultTitle: (api) => `Private Preview — ${api}`,
    defaultMessage: 'This version is currently available to selected partners only. Features, request formats, and response schemas are subject to change before general availability. Do not use in production. To request access, contact TomTom developer support.',
  },
  public: {
    Icon: InfoIcon,
    rootMod: 'ppb-root--public',
    iconMod: 'ppb-icon--public',
    defaultTitle: () => 'Public Preview — Orbis access required',
    defaultMessage: 'This endpoint is in Public Preview. The demo key covers v1 Production only. Enter a key with Orbis access enabled to use these endpoints.',
  },
  free: {
    Icon: CheckIcon,
    rootMod: 'ppb-root--free',
    iconMod: 'ppb-icon--free',
    defaultTitle: () => 'Free to start',
    defaultMessage: 'No credit card required.',
  },
};

export default function PrivatePreviewBanner({
  api = 'this API',
  variant = 'private',
  compact = false,
  title,
  message,
  children,
}) {
  const cfg = VARIANTS[variant] ?? VARIANTS.private;
  const { Icon, rootMod, iconMod } = cfg;

  const resolvedTitle   = title   ?? cfg.defaultTitle(api);
  const resolvedMessage = message ?? cfg.defaultMessage;

  const rootClass = [
    'ppb-root',
    rootMod,
    compact ? 'ppb-root--compact' : '',
  ].filter(Boolean).join(' ');

  const iconClass = ['ppb-icon', iconMod].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className={iconClass}>
        <Icon />
      </div>

      <div className="ppb-body">
        <p className="ppb-title">{resolvedTitle}</p>
        {resolvedMessage && (
          <p className="ppb-desc">{resolvedMessage}</p>
        )}
        {children && (
          <div className="ppb-actions">{children}</div>
        )}
      </div>
    </div>
  );
}
