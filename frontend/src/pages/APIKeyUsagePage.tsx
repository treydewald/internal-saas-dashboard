import React, { useState } from 'react';
import { useAPIKeys } from '../hooks/useAPIKeys';
import { useAuth } from '../hooks/useAuth';

interface APIKeyUIItem {
  id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export const APIKeyUsagePage: React.FC = () => {
  const { user } = useAuth();
  const { keys, loading, error, createKey, revokeKey, deleteKey, createdKey, clearCreatedKey } = useAPIKeys();
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreatedKey, setShowCreatedKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      await createKey(newKeyName);
      setNewKeyName('');
      setShowCreatedKey(true);
    } catch (err) {
      console.error('Failed to create key:', err);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(1); // Placeholder
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRevokeKey = async (keyId: number) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      try {
        await revokeKey(keyId);
      } catch (err) {
        console.error('Failed to revoke key:', err);
      }
    }
  };

  const handleDeleteKey = async (keyId: number) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await deleteKey(keyId);
      } catch (err) {
        console.error('Failed to delete key:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">API Key Management</h1>
        <p className="text-slate-400 mt-1">Create and manage your API keys for programmatic access</p>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Create New Key Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Create New API Key</h2>
        <form onSubmit={handleCreateKey} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production Integration, Testing"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Use a descriptive name to identify the purpose of this key</p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors"
            disabled={loading || !newKeyName.trim()}
          >
            {loading ? 'Creating...' : 'Create API Key'}
          </button>
        </form>
      </div>

      {/* Created Key Display */}
      {createdKey && showCreatedKey && (
        <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-1">API Key Created Successfully</h3>
              <p className="text-sm text-green-200">Save this key in a secure location. You won't be able to see it again.</p>
            </div>
            <button
              onClick={() => {
                setShowCreatedKey(false);
                clearCreatedKey();
              }}
              className="text-green-300 hover:text-green-200"
            >
              ✕
            </button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-md p-4 font-mono text-sm text-cyan-300 break-all">
            {createdKey.key}
          </div>
          <button
            onClick={() => handleCopyKey(createdKey.key)}
            className="mt-4 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-md transition-colors"
          >
            {copiedKeyId ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your API Keys</h2>

        {loading ? (
          <div className="text-slate-400 text-sm">Loading API keys...</div>
        ) : keys.length === 0 ? (
          <div className="text-slate-400 text-sm">No API keys created yet. Create one above to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Key</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Last Used</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key: APIKeyUIItem) => (
                  <tr key={key.id} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-50">
                    <td className="py-3 px-4 text-white">{key.name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">{key.key_prefix}***</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          key.is_active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(key.created_at)}</td>
                    <td className="py-3 px-4 space-x-2">
                      {key.is_active && (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="px-2 py-1 bg-yellow-900 bg-opacity-50 hover:bg-opacity-100 text-yellow-300 text-xs rounded-md transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="px-2 py-1 bg-red-900 bg-opacity-50 hover:bg-opacity-100 text-red-300 text-xs rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Security Guidelines</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Keep your API keys confidential—treat them like passwords</li>
          <li>• Revoke keys immediately if you suspect they've been compromised</li>
          <li>• Rotate your API keys regularly for enhanced security</li>
          <li>• Use different keys for different applications or environments</li>
          <li>• Never commit API keys to version control systems</li>
        </ul>
      </div>
    </div>
  );
};
