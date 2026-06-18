import { useState } from 'react';
import { useAPIKeys } from '../hooks/useAPIKeys';
import { Key } from 'lucide-react';

export const APIKeyUsagePage = () => {
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <Key size={14} />
          </div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
            Developer Tools
          </p>
        </div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>API Key Management</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Create and manage your API keys for programmatic access</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Create New Key Section */}
      <section style={{ flex: '0 0 auto', marginBottom: '12px' }}>
        <h2 className="section-anchor__title">Create New API Key</h2>
        <form className="card" onSubmit={handleCreateKey} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production Integration, Testing"
              required
            />
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
              Use a descriptive name to identify the purpose of this key
            </p>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !newKeyName.trim()}
          >
            {loading ? 'Creating...' : 'Create API Key'}
          </button>
        </form>
      </section>

      {/* Created Key Display */}
      {createdKey && showCreatedKey && (
        <div className="alert alert-success">
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent-success)', marginBottom: '4px' }}>
              API Key Created Successfully
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--accent-success)', margin: 0 }}>
              Save this key in a secure location. You won't be able to see it again.
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreatedKey(false);
              clearCreatedKey();
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--accent-success)' }}
          >
            ✕
          </button>
        </div>
      )}

      {createdKey && showCreatedKey && (
        <div style={{
          backgroundColor: 'var(--layer-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-input)',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: 'var(--accent-primary)',
          wordBreak: 'break-all',
          marginBottom: '16px'
        }}>
          {createdKey.key}
        </div>
      )}

      {createdKey && showCreatedKey && (
        <button
          onClick={() => handleCopyKey(createdKey.key)}
          className="btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          {copiedKeyId ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      )}

      {/* API Keys List */}
      <section style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>Your API Keys</h2>
        <div className="glass-panel" style={{ padding: '16px', flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {loading ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading API keys...</div>
        ) : keys.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No API keys created yet. Create one above to get started.</div>
        ) : (
          <div style={{ overflowX: 'auto', flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Key</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Last Used</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Created</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{key.name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-tertiary)', fontFamily: 'monospace', fontSize: '12px' }}>{key.key_prefix}***</td>
                    <td style={{ padding: '12px' }}>
                      <span className="status-badge" style={{
                        backgroundColor: key.is_active ? 'var(--accent-success-dim)' : 'var(--accent-error-dim)',
                        color: key.is_active ? 'var(--accent-success)' : 'var(--accent-error)',
                        borderColor: 'transparent'
                      }}>
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(key.created_at)}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                      {key.is_active && (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="btn-ghost"
                          style={{ fontSize: '12px', padding: '4px 8px', color: 'var(--accent-warning)' }}
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="btn-ghost"
                        style={{ fontSize: '12px', padding: '4px 8px', color: 'var(--accent-error)' }}
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
      </section>

      {/* Security Notice */}
      <section className="section-anchor" style={{ flex: '1 1 auto' }}>
        <h2 className="section-anchor__title">Security Guidelines</h2>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Keep your API keys confidential—treat them like passwords</li>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Revoke keys immediately if you suspect they've been compromised</li>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Rotate your API keys regularly for enhanced security</li>
            <li style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Use different keys for different applications or environments</li>
            <li style={{ color: 'var(--text-secondary)' }}>Never commit API keys to version control systems</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
