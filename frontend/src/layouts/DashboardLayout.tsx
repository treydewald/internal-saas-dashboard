import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header onMenuToggle={handleMenuToggle} />
      <div className={styles.mainContent}>
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};
