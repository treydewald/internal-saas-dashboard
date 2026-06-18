import React from 'react';
import ProfileSection from '../components/ProfileSection';
import APIKeySection from '../components/APIKeySection';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Restrict to admin users
  if (user?.role !== 'admin') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '20px',
            flexWrap: 'wrap',
            flex: '0 0 auto',
            paddingBottom: '16px',
            marginBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'rgba(37,99,235,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <SettingsIcon size={14} />
              </div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 'var(--fw-semibold)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                  margin: 0,
                }}
              >
                Account
              </p>
            </div>
            <h1
              style={{
                margin: '0 0 4px 0',
                fontSize: '32px',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Manage your account settings
            </p>
          </div>
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '20px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <SettingsIcon size={14} />
            </div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                margin: 0,
              }}
            >
              Account
            </p>
          </div>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: '32px',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Settings
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage your account settings and API keys
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '12px' }}>
        {/* Profile Section */}
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Profile
          </h2>
          <ProfileSection />
        </section>

        {/* API Keys Section */}
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            API Keys
          </h2>
          <APIKeySection />
        </section>

        {/* Additional Info */}
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Information
          </h2>
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
        </section>
      </div>
    </div>
  );
};
