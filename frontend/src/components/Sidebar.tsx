import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: '📊' },
  { label: 'Users', path: '/users', icon: '👥' },
  { label: 'API Logs', path: '/api-logs', icon: '📝' },
  { label: 'Reports', path: '/reports', icon: '📈' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
              onClick={onClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
