import { useEffect } from 'react';
import { ExportJobForm } from '../components/ExportJobForm';
import { useExports } from '../hooks/useExports';

interface ExportJobDisplay {
  id: number;
  job_type: string;
  status: string;
  progress_percent: number;
  file_url?: string;
  error_message?: string;
  row_count: number;
  created_at: string;
}

export const ExportsPage = () => {
  const { jobs, loading, error, createExportJob, cancelJob, retryJob, deleteJob, getJobStatus } = useExports();

  // Auto-refresh job status every 2 seconds
  useEffect(() => {
    const activejobs = jobs.filter(j => j.status === 'pending' || j.status === 'processing');
    if (activejobs.length > 0) {
      const interval = setInterval(() => {
        activejobs.forEach(job => {
          getJobStatus(job.id).catch(err => console.error('Failed to refresh job:', err));
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [jobs, getJobStatus]);

  const handleCreateExport = async (jobType: string) => {
    await createExportJob(jobType);
  };

  const handleCancelJob = async (jobId: number) => {
    if (window.confirm('Cancel this export job?')) {
      try {
        await cancelJob(jobId);
      } catch (err) {
        console.error('Failed to cancel job:', err);
      }
    }
  };

  const handleRetryJob = async (jobId: number) => {
    try {
      await retryJob(jobId);
    } catch (err) {
      console.error('Failed to retry job:', err);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm('Delete this export job?')) {
      try {
        await deleteJob(jobId);
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'processing':
        return 'bg-blue-900 text-blue-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'failed':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Data Exports</h1>
        <p className="text-slate-400 mt-1">Create and manage bulk data exports</p>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Create Export Form */}
      <ExportJobForm onSubmit={handleCreateExport} loading={loading} error={error ?? undefined} />

      {/* Export Jobs List */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Export Jobs</h2>

        {loading && jobs.length === 0 ? (
          <div className="text-slate-400 text-sm">Loading export jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-slate-400 text-sm">No export jobs yet. Create one above to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Progress</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Rows</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: ExportJobDisplay) => (
                  <tr key={job.id} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-50">
                    <td className="py-3 px-4 text-white capitalize">{job.job_type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32">
                        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full transition-all duration-300"
                            style={{ width: `${job.progress_percent}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{job.progress_percent.toFixed(0)}%</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{job.row_count.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{formatDate(job.created_at)}</td>
                    <td className="py-3 px-4 space-x-1">
                      {job.status === 'completed' && job.file_url && (
                        <a
                          href={job.file_url}
                          download
                          className="px-2 py-1 bg-green-900 bg-opacity-50 hover:bg-opacity-100 text-green-300 text-xs rounded-md transition-colors"
                        >
                          Download
                        </a>
                      )}
                      {(job.status === 'pending' || job.status === 'processing') && (
                        <button
                          onClick={() => handleCancelJob(job.id)}
                          className="px-2 py-1 bg-yellow-900 bg-opacity-50 hover:bg-opacity-100 text-yellow-300 text-xs rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {job.status === 'failed' && (
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          className="px-2 py-1 bg-blue-900 bg-opacity-50 hover:bg-opacity-100 text-blue-300 text-xs rounded-md transition-colors"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job.id)}
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

      {/* Information Box */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Export Information</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Exports are processed asynchronously to avoid blocking your requests</li>
          <li>• You can monitor the progress of active exports in real-time</li>
          <li>• Completed exports are available for download for 7 days</li>
          <li>• Failed exports can be retried by clicking the Retry button</li>
        </ul>
      </div>
    </div>
  );
};
