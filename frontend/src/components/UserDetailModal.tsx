import React, { useState } from 'react';
import { useUserDetail } from '../hooks/useUserDetail';
import UserEditForm from './UserEditForm';
import { useAuth } from '../hooks/useAuth';

interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

interface UserData {
  id: number;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
  role: string;
  usage_percent: number;
  created_at: string;
  last_login?: string;
}

const getPlanStyle = (plan: string): React.CSSProperties => {
  if (plan === 'enterprise') return { backgroundColor: 'var(--accent-purple-dim)', color: 'var(--accent-purple)' };
  if (plan === 'pro') return { backgroundColor: 'var(--accent-info-dim)', color: 'var(--accent-info)' };
  return { backgroundColor: 'var(--border-default)', color: 'var(--text-tertiary)' };
};

const getUsageColor = (pct: number) => {
  if (pct > 80) return 'var(--accent-error)';
  if (pct > 60) return 'var(--accent-warning)';
  return 'var(--accent-success)';
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  userId,
  isOpen,
  onClose,
  onSave,
}) => {
  const { user: currentUser } = useAuth();
  const { user, loading, error, updateUser } = useUserDetail(userId);
  const [editMode, setEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Leave anyway?')) {
        setEditMode(false);
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      setEditMode(false);
      onClose();
    }
  };

  const handleSave = async (updatedUser: Partial<UserData>) => {
    try {
      await updateUser(updatedUser);
      setSuccessMessage('User updated successfully');
      setEditMode(false);
      setHasUnsavedChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      if (onSave) onSave();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleEditChange = () => {
    setHasUnsavedChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          gap: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-default)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--layer-2)',
            zIndex: 1,
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {editMode ? 'Edit User' : 'User Details'}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--text-tertiary)',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1 }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success" style={{ marginBottom: '16px' }}>
              <p style={{ margin: 0 }}>{successMessage}</p>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '3px solid var(--border-default)',
                  borderTopColor: 'var(--accent-primary)',
                  animation: 'spin 0.9s linear infinite',
                }}
              />
            </div>
          ) : user ? (
            <>
              {editMode ? (
                <UserEditForm
                  user={user}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditMode(false);
                    setHasUnsavedChanges(false);
                  }}
                  onChange={handleEditChange}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Role', value: user.role },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="label-text">{label}</label>
                      <p className="value-text" style={{ marginTop: '4px' }}>{value}</p>
                    </div>
                  ))}

                  <div>
                    <label className="label-text">Plan</label>
                    <div style={{ marginTop: '6px' }}>
                      <span
                        className="status-badge"
                        style={getPlanStyle(user.plan)}
                      >
                        {user.plan}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Status</label>
                    <div style={{ marginTop: '6px' }}>
                      <span
                        className="status-badge"
                        style={
                          user.status === 'active'
                            ? { backgroundColor: 'var(--accent-success-dim)', color: 'var(--accent-success)', borderColor: 'rgba(22,163,74,0.2)' }
                            : { backgroundColor: 'var(--accent-error-dim)', color: 'var(--accent-error)', borderColor: 'rgba(220,38,38,0.2)' }
                        }
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Usage</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--border-default)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${user.usage_percent}%`,
                            height: '100%',
                            borderRadius: '999px',
                            backgroundColor: getUsageColor(user.usage_percent),
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {user.usage_percent}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Created At</label>
                    <p className="value-text" style={{ marginTop: '4px' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {user.last_login && (
                    <div>
                      <label className="label-text">Last Login</label>
                      <p className="value-text" style={{ marginTop: '4px' }}>
                        {new Date(user.last_login).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>User not found</p>
          )}
        </div>

        {/* Footer */}
        {!loading && user && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              padding: '16px 24px',
              borderTop: '1px solid var(--border-default)',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'var(--layer-2)',
            }}
          >
            <button onClick={handleClose} className="btn-secondary">
              Close
            </button>
            {isAdmin && !editMode && (
              <button onClick={() => setEditMode(true)} className="btn-primary">
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;
