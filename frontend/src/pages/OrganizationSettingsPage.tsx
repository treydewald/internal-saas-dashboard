import React, { useState } from 'react';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';

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
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
        </div>
        <div className="text-slate-400">Loading organization...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
        <p className="text-slate-400 mt-1">Manage {currentOrg.name} settings</p>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900 bg-opacity-50 border border-green-700 rounded-lg p-4 text-green-200 text-sm">
          {successMessage}
        </div>
      )}

      {/* Organization Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Organization Details</h2>
          {isAdmin && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Organization Name</label>
              <p className="text-white mt-1">{currentOrg.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Organization Slug</label>
              <p className="text-white font-mono mt-1">{currentOrg.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Description</label>
              <p className="text-slate-400 mt-1">{currentOrg.description || 'No description'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Created</label>
              <p className="text-slate-400 mt-1">
                {new Date(currentOrg.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
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
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Organization Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Organization Information</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Each organization is completely isolated from others</li>
          <li>• Members can have different roles (admin, member, viewer)</li>
          <li>• Organization data is not shared with other organizations</li>
          <li>• Only organization admins can modify organization settings</li>
        </ul>
      </div>
    </div>
  );
};
