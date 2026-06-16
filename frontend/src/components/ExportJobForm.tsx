import React, { useState } from 'react';

interface ExportJobFormProps {
  onSubmit: (jobType: string, filters?: Record<string, any>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export const ExportJobForm: React.FC<ExportJobFormProps> = ({ onSubmit, loading = false, error }) => {
  const [jobType, setJobType] = useState<string>('users');
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await onSubmit(jobType);
      setJobType('users');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create export job');
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', marginTop: 0 }}>
        Create Export Job
      </h2>

      {(error || submitError) && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          {error || submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="label-text" style={{ display: 'block', marginBottom: '8px' }}>Export Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            required
          >
            <option value="users">Users</option>
            <option value="api_logs">API Logs</option>
            <option value="kpis">KPI Metrics</option>
          </select>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Select the data type you want to export
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Creating Export Job...' : 'Create Export Job'}
        </button>
      </form>

      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--layer-1)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          <strong>Note:</strong> Export jobs are processed asynchronously. You can monitor the progress below and download the file once it&apos;s ready.
        </p>
      </div>
    </div>
  );
};
