import React from 'react';
import ProfileSection from '../components/ProfileSection';
import APIKeySection from '../components/APIKeySection';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Restrict to admin users
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account settings</p>
        </div>

        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg p-6 text-yellow-200">
          <p>
            Only administrators can access the settings page. If you need assistance, please
            contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and API keys</p>
      </div>

      {/* Profile Section */}
      <ProfileSection />

      {/* API Keys Section */}
      <APIKeySection />

      {/* Additional Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
        <div className="space-y-2 text-slate-400 text-sm">
          <p>• All changes to your profile are saved immediately</p>
          <p>• API keys are credentials—never share them with anyone</p>
          <p>• Regenerating your API key will invalidate the previous one</p>
          <p>• For security reasons, passwords cannot be changed in this interface</p>
        </div>
      </div>
    </div>
  );
};
