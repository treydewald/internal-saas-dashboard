import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, isAnalystOrAdmin } from '../utils/rolePermissions';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  requiredRole?: 'admin' | 'analyst' | null;
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: '📊', requiredRole: null },
  { label: 'Users', path: '/users', icon: '👥', requiredRole: null },
  { label: 'API Logs', path: '/api-logs', icon: '📝', requiredRole: 'analyst' },
  { label: 'Insights', path: '/insights', icon: '🧠', requiredRole: 'analyst' },
  { label: 'Reports', path: '/reports', icon: '📈', requiredRole: 'admin' },
  { label: 'Settings', path: '/settings', icon: '⚙️', requiredRole: 'admin' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const shouldShowItem = (item: NavItem): boolean => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === 'admin') return isAdmin(user?.role);
    if (item.requiredRole === 'analyst') return isAnalystOrAdmin(user?.role);
    return true;
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          {navItems.filter(shouldShowItem).map((item) => (
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
