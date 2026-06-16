import React from 'react';
import ProfileSection from '../components/ProfileSection';
import APIKeySection from '../components/APIKeySection';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Restrict to admin users
  if (user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your account settings</p>
        </div>

        <div className="alert alert-warning">
          <p>
            Only administrators can access the settings page. If you need assistance, please
            contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account settings and API keys</p>
      </div>

      {/* Profile Section */}
      <ProfileSection />

      {/* API Keys Section */}
      <APIKeySection />

      {/* Additional Info */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Account Information
        </h3>
        <div className="info-card">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>All changes to your profile are saved immediately</li>
            <li>API keys are credentials—never share them with anyone</li>
            <li>Regenerating your API key will invalidate the previous one</li>
            <li>For security reasons, passwords cannot be changed in this interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
