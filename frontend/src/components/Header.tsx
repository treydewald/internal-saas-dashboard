import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ConnectionStatus } from './ConnectionStatus';
import { Menu, Sun, Moon, LogOut, Zap } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Zap size={13} />
            </div>
            <span className={styles.brandName}>DataPulse</span>
          </div>
        </div>

        <div className={styles.userSection}>
          <ConnectionStatus />
          <button
            onClick={toggleTheme}
            className={styles.themeButton}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{user?.name || 'User'}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
