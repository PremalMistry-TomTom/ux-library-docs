export default function Callout({ type = 'info', children }) {
  const icon = type === 'warn' ? '⚠' : type === 'danger' ? '✕' : type === 'success' ? '✓' : 'ℹ';
  const label = type === 'warn' ? 'Warning' : type === 'danger' ? 'Error' : type === 'success' ? 'Success' : 'Note';
  return (
    <div className={`callout ${type}`} role="note" aria-label={label}>
      <span className="callout-icon" aria-hidden="true">{icon}</span>
      <div>
        <span className="sr-only">{label}: </span>
        {children}
      </div>
    </div>
  );
}
