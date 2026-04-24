export default function Callout({ type = 'info', children }) {
  const icon = type === 'warn' ? '⚠' : 'ℹ';
  return (
    <div className={`callout ${type}`}>
      <span className="callout-icon">{icon}</span>
      <div>{children}</div>
    </div>
  );
}
