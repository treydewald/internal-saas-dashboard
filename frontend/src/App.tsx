import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { UsersPage } from './pages/UsersPage';
import { APILogsPage } from './pages/APILogsPage';
import InsightsPage from './pages/InsightsPage';
import AlertsPage from './pages/AlertsPage';
import AuditLogPage from './pages/AuditLogPage';
import { DashboardBuilderPage } from './pages/DashboardBuilderPage';
import { ReportsPage } from './pages/ReportsPage';
import { ExportsPage } from './pages/ExportsPage';
import { APIKeyUsagePage } from './pages/APIKeyUsagePage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WebSocketProvider } from './context/WebSocketContext';
import './App.css';

function AppShell() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="dashboard-app">
      <Sidebar />
      <div className="main-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
            <Route path="/api-logs" element={<ProtectedRoute><APILogsPage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/audit-log" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
            <Route path="/dashboard-builder" element={<ProtectedRoute><DashboardBuilderPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/exports" element={<ProtectedRoute><ExportsPage /></ProtectedRoute>} />
            <Route path="/api-keys" element={<ProtectedRoute><APIKeyUsagePage /></ProtectedRoute>} />
            <Route path="/org-settings" element={<ProtectedRoute><OrganizationSettingsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WebSocketProvider>
          <AppShell />
        </WebSocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
