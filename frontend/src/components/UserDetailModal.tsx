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
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
          {/* Header */}
          <div className="sticky top-0 bg-slate-700 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {editMode ? 'Edit User' : 'User Details'}
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded text-green-200 text-sm">
                {successMessage}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border border-cyan-500 border-t-transparent"></div>
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
                  <div className="space-y-4">
                    {/* User Details - Read Only */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Name
                      </label>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Email
                      </label>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Role
                      </label>
                      <p className="text-white font-medium capitalize">{user.role}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Plan
                      </label>
                      <div className="mt-1">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold capitalize inline-block ${
                            user.plan === 'free'
                              ? 'bg-slate-600 text-slate-200'
                              : user.plan === 'pro'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-yellow-900 text-yellow-200'
                          }`}
                        >
                          {user.plan}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold inline-block ${
                            user.status === 'active'
                              ? 'bg-green-900 text-green-200'
                              : 'bg-red-900 text-red-200'
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Usage
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              user.usage_percent > 80
                                ? 'bg-red-500'
                                : user.usage_percent > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${user.usage_percent}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium text-sm">
                          {user.usage_percent}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase">
                        Created At
                      </label>
                      <p className="text-white font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {user.last_login && (
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase">
                          Last Login
                        </label>
                        <p className="text-white font-medium">
                          {new Date(user.last_login).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400">User not found</p>
            )}
          </div>

          {/* Footer */}
          {!loading && user && (
            <div className="sticky bottom-0 bg-slate-700 px-6 py-4 border-t border-slate-600 flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-medium transition-colors"
              >
                Close
              </button>
              {isAdmin && !editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetailModal;
