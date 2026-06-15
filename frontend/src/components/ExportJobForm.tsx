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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Create Export Job</h2>

      {(error || submitError) && (
        <div className="mb-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md p-3 text-red-200 text-sm">
          {error || submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Export Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          >
            <option value="users">Users</option>
            <option value="api_logs">API Logs</option>
            <option value="kpis">KPI Metrics</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">Select the data type you want to export</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
        >
          {loading ? 'Creating Export Job...' : 'Create Export Job'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-slate-700 bg-opacity-50 rounded-md">
        <p className="text-sm text-slate-300">
          <strong>Note:</strong> Export jobs are processed asynchronously. You can monitor the progress below and download the file once it's ready.
        </p>
      </div>
    </div>
  );
};
