import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export const Header: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <button
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 className={styles.title}>Internal SaaS Dashboard</h1>
        <div className={styles.userSection}>
          <span className={styles.userName}>{user?.name || 'User'}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
