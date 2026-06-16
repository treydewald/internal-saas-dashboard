import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface ProfileSectionProps {
  onSave?: () => void;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onSave }) => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(user || null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({ name: user.name });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!user) throw new Error('User is not available');
      const response = await axios.put(`/api/users/${user.id}`, { name: formData.name });
      setProfile(response.data);
      updateUser({ name: response.data.name });
      setEditMode(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      if (onSave) onSave();
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to update profile';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: profile?.name || '' });
    setEditMode(false);
    setError('');
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', marginTop: 0 }}>
        Profile Settings
      </h2>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>{success}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="label-text" style={{ display: 'block', marginBottom: '8px' }}>Name</label>
          {editMode ? (
            <input type="text" value={formData.name} onChange={handleChange} />
          ) : (
            <p className="value-text" style={{ margin: 0 }}>{profile?.name}</p>
          )}
        </div>

        <div>
          <label className="label-text" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
          <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '14px' }}>{profile?.email}</p>
        </div>

        <div>
          <label className="label-text" style={{ display: 'block', marginBottom: '8px' }}>Role</label>
          <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '14px', textTransform: 'capitalize' }}>{profile?.role}</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="btn-primary">
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
