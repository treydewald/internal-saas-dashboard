import React, { useState } from 'react';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';
import { Building2 } from 'lucide-react';

export const OrganizationSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { currentOrg, updateOrganization, loading, error } = useOrganization();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: currentOrg?.name || '',
    description: currentOrg?.description || '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is org admin
  const isAdmin = user?.role === 'admin'; // This would need to be enhanced to check org-level role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg) return;

    try {
      await updateOrganization(currentOrg.id, {
        name: formData.name,
        description: formData.description,
      } as any);
      setSuccessMessage('Organization updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  if (!currentOrg) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div
          style={{
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Organization Settings</h1>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>Loading organization...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <div
        style={{
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <Building2 size={14} />
          </div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
            Administration
          </p>
        </div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Organization Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Manage {currentOrg.name} settings</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* Organization Details */}
      <section className="section-anchor" style={{ flex: '1 1 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 className="section-anchor__title" style={{ marginBottom: 0 }}>
            Organization Details
          </h2>
          {isAdmin && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn-primary"
            >
              Edit
            </button>
          )}
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>

        {!editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label-text">Organization Name</label>
              <p className="value-text" style={{ marginTop: '6px' }}>{currentOrg.name}</p>
            </div>
            <div>
              <label className="label-text">Organization Slug</label>
              <p className="value-text" style={{ marginTop: '6px', fontFamily: 'monospace' }}>{currentOrg.slug}</p>
            </div>
            <div>
              <label className="label-text">Description</label>
              <p className="body-text" style={{ marginTop: '6px' }}>{currentOrg.description || 'No description'}</p>
            </div>
            <div>
              <label className="label-text">Created</label>
              <p className="body-text" style={{ marginTop: '6px' }}>
                {new Date(currentOrg.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  backgroundColor: 'var(--layer-2)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-input)',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: currentOrg.name,
                    description: currentOrg.description || '',
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        </div>
      </section>

      {/* Organization Info */}
      <section className="section-anchor" style={{ flex: '1 1 auto' }}>
        <h2 className="section-anchor__title">Organization Information</h2>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Each organization is completely isolated from others</li>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Members can have different roles (admin, member, viewer)</li>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Organization data is not shared with other organizations</li>
            <li style={{ color: 'var(--text-secondary)' }}>Only organization admins can modify organization settings</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
