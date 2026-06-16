import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, isAnalystOrAdmin } from '../utils/rolePermissions';
import {
  LayoutDashboard,
  Users,
  FileText,
  Brain,
  Bell,
  Shield,
  Layers,
  BarChart2,
  Upload,
  Key,
  Building2,
  Settings,
  Zap,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: 'admin' | 'analyst' | null;
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: <LayoutDashboard size={16} />, requiredRole: null },
  { label: 'Users', path: '/users', icon: <Users size={16} />, requiredRole: null },
  { label: 'API Logs', path: '/api-logs', icon: <FileText size={16} />, requiredRole: 'analyst' },
  { label: 'Insights', path: '/insights', icon: <Brain size={16} />, requiredRole: 'analyst' },
  { label: 'Alerts', path: '/alerts', icon: <Bell size={16} />, requiredRole: 'analyst' },
  { label: 'Audit Log', path: '/audit-log', icon: <Shield size={16} />, requiredRole: 'admin' },
  { label: 'Dashboards', path: '/dashboard-builder', icon: <Layers size={16} />, requiredRole: null },
  { label: 'Reports', path: '/reports', icon: <BarChart2 size={16} />, requiredRole: 'admin' },
  { label: 'Exports', path: '/exports', icon: <Upload size={16} />, requiredRole: null },
  { label: 'API Keys', path: '/api-keys', icon: <Key size={16} />, requiredRole: null },
  { label: 'Org Settings', path: '/org-settings', icon: <Building2 size={16} />, requiredRole: 'admin' },
  { label: 'Settings', path: '/settings', icon: <Settings size={16} />, requiredRole: 'admin' },
];

const ANALYTICS_PATHS = ['/api-logs', '/insights', '/alerts', '/audit-log', '/reports'];
const MANAGEMENT_PATHS = ['/users', '/org-settings', '/settings'];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const shouldShowItem = (item: NavItem): boolean => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === 'admin') return isAdmin(user?.role);
    if (item.requiredRole === 'analyst') return isAnalystOrAdmin(user?.role);
    return true;
  };

  const visibleItems = navItems.filter(shouldShowItem);
  const coreItems = visibleItems.filter(
    (i) => !ANALYTICS_PATHS.includes(i.path) && !MANAGEMENT_PATHS.includes(i.path)
  );
  const analyticsItems = visibleItems.filter((i) => ANALYTICS_PATHS.includes(i.path));
  const managementItems = visibleItems.filter((i) => MANAGEMENT_PATHS.includes(i.path));

  const renderLink = (item: NavItem) => (
    <Link
      key={item.path}
      to={item.path}
      className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
      onClick={onClose}
    >
      <span className={styles.icon}>{item.icon}</span>
      <span className={styles.label}>{item.label}</span>
    </Link>
  );

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Brand Header */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <Zap size={14} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>DataPulse</span>
            <span className={styles.brandTagline}>Analytics Platform</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {/* Core Navigation */}
          <div className={styles.navSection}>
            {coreItems.map(renderLink)}
          </div>

          {/* Analytics Group */}
          {analyticsItems.length > 0 && (
            <div className={styles.navSection}>
              <span className={styles.navGroupLabel}>Analytics</span>
              {analyticsItems.map(renderLink)}
            </div>
          )}

          {/* Management Group */}
          {managementItems.length > 0 && (
            <div className={styles.navSection}>
              <span className={styles.navGroupLabel}>Management</span>
              {managementItems.map(renderLink)}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
