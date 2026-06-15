import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { copyToClipboard } from '../utils/clipboard';

interface APIKeySectionProps {
  onKeyRegenerated?: () => void;
}

interface APIKeyData {
  key: string;
  maskedKey: string;
  created_at: string;
  last_used?: string;
}

const APIKeySection: React.FC<APIKeySectionProps> = ({ onKeyRegenerated }) => {
  const [apiKey, setApiKey] = useState<APIKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFullKey, setShowFullKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchAPIKey();
  }, []);

  const fetchAPIKey = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/api-keys');
      setApiKey(response.data);
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to fetch API key';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!apiKey) return;

    try {
      await copyToClipboard(apiKey.key);
      setSuccess('API key copied to clipboard');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleRegenerate = async () => {
    if (
      !window.confirm(
        'Are you sure you want to regenerate your API key? The old key will be invalidated.'
      )
    ) {
      return;
    }

    try {
      setRegenerating(true);
      setError('');
      const response = await axios.post('/api/api-keys/regenerate');
      setApiKey(response.data);
      setSuccess('API key regenerated successfully');
      setShowFullKey(false);
      setTimeout(() => setSuccess(''), 3000);
      if (onKeyRegenerated) onKeyRegenerated();
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to regenerate API key';
      setError(errorMsg);
    } finally {
      setRegenerating(false);
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

      {success && (
        <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded text-green-200 text-sm">
          {success}
        </div>
      )}

      {apiKey ? (
        <div className="space-y-4">
          {/* API Key Display */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              API Key
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="bg-slate-700 px-3 py-2 rounded font-mono text-sm text-slate-300 break-all">
                  {showFullKey ? apiKey.key : apiKey.maskedKey}
                </div>
              </div>
              <button
                onClick={() => setShowFullKey(!showFullKey)}
                className="px-2 py-2 text-slate-400 hover:text-white transition-colors"
                title={showFullKey ? 'Hide key' : 'Show key'}
              >
                {showFullKey ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">
                Created
              </label>
              <p className="text-white mt-1">
                {new Date(apiKey.created_at).toLocaleDateString()}
              </p>
            </div>
            {apiKey.last_used && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase">
                  Last Used
                </label>
                <p className="text-white mt-1">
                  {new Date(apiKey.last_used).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors flex items-center gap-2"
            >
              📋 Copy
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded font-medium transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {regenerating ? 'Regenerating...' : '🔄 Regenerate'}
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            ⚠️ Keep your API key secret. Do not share it publicly or commit it to version control.
          </p>
        </div>
      ) : (
        <p className="text-slate-400">No API key found</p>
      )}
    </div>
  );
};

export default APIKeySection;
