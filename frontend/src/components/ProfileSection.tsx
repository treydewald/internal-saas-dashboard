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
  const { user } = useAuth();
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
    const { value } = e.target;
    setFormData({ name: value });
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
      const response = await axios.put('/api/users/me', { name: formData.name });
      setProfile(response.data);
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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded text-green-200 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Name
          </label>
          {editMode ? (
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          ) : (
            <p className="text-white">{profile?.name}</p>
          )}
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Email
          </label>
          <p className="text-slate-400">{profile?.email}</p>
        </div>

        {/* Role Field (Read-only) */}
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Role
          </label>
          <p className="text-slate-400 capitalize">{profile?.role}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-medium transition-colors disabled:cursor-not-allowed"
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
