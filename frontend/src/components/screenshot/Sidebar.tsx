interface SidebarProps {
  active: string;
  onSelect: (section: string) => void;
}

const navItems = ['Overview', 'Users', 'API Logs', 'Reports', 'Settings'];

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar__brand">
        <div className="sidebar__dot" />
        <div>
          <h1>Graphite</h1>
          <p>Enterprise Analytics</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        {navItems.map(item => (
          <button
            key={item}
            className={`sidebar__item ${active === item ? 'is-active' : ''}`}
            onClick={() => onSelect(item)}
            type="button"
          >
            <span>{item}</span>
            {item === 'API Logs' ? <small className="sidebar__badge">LIVE</small> : null}
          </button>
        ))}
      </nav>

      <footer className="sidebar__footer">
        <span className="status status--running">RUNNING</span>
        <p>Session synced 1s ago</p>
      </footer>
    </aside>
  );
}
