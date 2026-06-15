interface SidebarProps {
  active: string;
  onSelect: (section: string) => void;
}

interface NavItem {
  label: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Overview',   icon: '◈' },
  { label: 'Users',      icon: '◎' },
  { label: 'API Logs',   icon: '⌘', badge: 'LIVE' },
  { label: 'Insights',   icon: '◆' },
  { label: 'Alerts',     icon: '◉' },
  { label: 'Audit Log',  icon: '▣' },
  { label: 'Reports',    icon: '◳' },
  { label: 'Settings',   icon: '⊙' },
];

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar glass-panel">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__dot" />
        <div>
          <h1>Graphite</h1>
          <p>Enterprise Analytics</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navItems.map(item => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              className={`sidebar__item ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(item.label)}
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar__item-inner">
                <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge ? (
                <small className="sidebar__badge">{item.badge}</small>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="sidebar__footer">
        <div className="sidebar__live-row">
          <span className="live-badge live-badge--sm">
            <span className="live-badge__dot" aria-hidden="true" />
            RUNNING
          </span>
        </div>
        <p className="sidebar__footer-meta">Session synced 1s ago</p>
        <div className="sidebar__user">
          <div className="sidebar__avatar">A</div>
          <div>
            <p className="sidebar__user-name">Admin User</p>
            <p className="sidebar__user-role">admin</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
