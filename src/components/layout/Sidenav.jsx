import { useState } from 'react';
import { NAV } from '../../data/navigation';

function ChevronIcon() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
      <path d="M2 1l4 3-4 3" />
    </svg>
  );
}

function NavGroup({ group, currentPage, onNavigate }) {
  const [open, setOpen] = useState(group.defaultOpen);

  return (
    <div className="sidenav-group">
      <div
        className={`sidenav-label${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {group.label} <ChevronIcon />
      </div>
      <div className={`sidenav-items${open ? ' open' : ''}`}>
        {group.items.map(item => (
          <span
            key={item.id}
            className={`sidenav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Sidenav({ currentPage, onNavigate }) {
  return (
    <aside className="sidenav">
      {NAV.map((entry, i) => {
        if (entry.type === 'top') {
          return (
            <span
              key={entry.id}
              className={`sidenav-top-link${currentPage === entry.id ? ' active' : ''}`}
              onClick={() => onNavigate(entry.id)}
            >
              {entry.label}
            </span>
          );
        }
        return (
          <NavGroup
            key={i}
            group={entry}
            currentPage={currentPage}
            onNavigate={onNavigate}
          />
        );
      })}
    </aside>
  );
}
