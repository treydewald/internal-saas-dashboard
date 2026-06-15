import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface APIKeyData {
  id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at?: string | null;
}

interface APIKeyListResponse {
  api_keys: APIKeyData[];
  total_count: number;
}

const APIKeySection: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<APIKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAPIKey();
  }, []);

  const fetchAPIKey = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<APIKeyListResponse>('/api/api-keys');
      setApiKey(response.data.api_keys[0] ?? null);
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to fetch API key';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">API Keys</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      {apiKey ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Primary API Key
            </label>
            <div className="bg-slate-700 px-3 py-2 rounded font-mono text-sm text-slate-300 break-all">
              {apiKey.key_prefix}***
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">
                Name
              </label>
              <p className="text-white mt-1">{apiKey.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">
                Created
              </label>
              <p className="text-white mt-1">
                {new Date(apiKey.created_at).toLocaleDateString()}
              </p>
            </div>
            {apiKey.last_used_at && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase">
                  Last Used
                </label>
                <p className="text-white mt-1">
                  {new Date(apiKey.last_used_at).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">
                Status
              </label>
              <p className="text-white mt-1">{apiKey.is_active ? 'Active' : 'Revoked'}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate('/api-keys')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors"
            >
              Manage Keys
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            API secrets are only shown once at creation time. Use the API Keys page to create, revoke, or delete keys.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-slate-400">No API keys created yet.</p>
          <button
            onClick={() => navigate('/api-keys')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors"
          >
            Open API Key Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default APIKeySection;
