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
      <div
        className="card"
        style={{ animation: 'live-breathe 1.4s ease-in-out infinite' }}
      >
        <div style={{ height: '22px', backgroundColor: 'var(--border-default)', borderRadius: 'var(--radius-sm)', width: '128px', marginBottom: '24px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ height: '14px', backgroundColor: 'var(--border-default)', borderRadius: 'var(--radius-sm)', width: '100%' }} />
          <div style={{ height: '14px', backgroundColor: 'var(--border-default)', borderRadius: 'var(--radius-sm)', width: '75%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', marginTop: 0 }}>
        API Keys
      </h2>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {apiKey ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="label-text" style={{ display: 'block', marginBottom: '8px' }}>
              Primary API Key
            </label>
            <div
              style={{
                backgroundColor: 'var(--layer-0)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-input)',
                padding: '8px 12px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                wordBreak: 'break-all',
              }}
            >
              {apiKey.key_prefix}***
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="label-text">Name</label>
              <p className="value-text" style={{ marginTop: '4px' }}>{apiKey.name}</p>
            </div>
            <div>
              <label className="label-text">Created</label>
              <p className="value-text" style={{ marginTop: '4px' }}>
                {new Date(apiKey.created_at).toLocaleDateString()}
              </p>
            </div>
            {apiKey.last_used_at && (
              <div>
                <label className="label-text">Last Used</label>
                <p className="value-text" style={{ marginTop: '4px' }}>
                  {new Date(apiKey.last_used_at).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <label className="label-text">Status</label>
              <p className="value-text" style={{ marginTop: '4px' }}>
                {apiKey.is_active ? 'Active' : 'Revoked'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button onClick={() => navigate('/api-keys')} className="btn-primary">
              Manage Keys
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            API secrets are only shown once at creation time. Use the API Keys page to create, revoke, or delete keys.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>No API keys created yet.</p>
          <div>
            <button onClick={() => navigate('/api-keys')} className="btn-primary">
              Open API Key Manager
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeySection;
