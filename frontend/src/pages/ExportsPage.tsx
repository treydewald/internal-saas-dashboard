import { useEffect } from 'react';
import { ExportJobForm } from '../components/ExportJobForm';
import { useExports } from '../hooks/useExports';
import { Download } from 'lucide-react';

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

  const getStatusColor = (status: string): { bg: string, text: string } => {
    switch (status) {
      case 'completed':
        return { bg: 'var(--accent-success-dim)', text: 'var(--accent-success)' };
      case 'processing':
        return { bg: 'var(--accent-info-dim)', text: 'var(--accent-info)' };
      case 'pending':
        return { bg: 'var(--accent-warning-dim)', text: 'var(--accent-warning)' };
      case 'failed':
        return { bg: 'var(--accent-error-dim)', text: 'var(--accent-error)' };
      default:
        return { bg: 'var(--border-default)', text: 'var(--text-tertiary)' };
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Download size={14} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
              Data Management
            </p>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Data Exports</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Create and manage bulk data exports</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ flex: '0 0 auto', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {/* Two-Panel Layout: Form (Left) | Jobs List (Right) */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'grid', gridTemplateColumns: '360px 1fr', gap: '16px', overflow: 'hidden' }}>

        {/* Form Panel (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', borderRight: '1px solid var(--border-subtle)', paddingRight: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>
            New Export
          </h2>
          <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            <ExportJobForm onSubmit={handleCreateExport} loading={loading} error={error ?? undefined} />
          </div>
        </div>

        {/* Jobs List (Right, scrollable) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>
            Export Jobs
          </h2>

          <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            {loading && jobs.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading export jobs...</div>
            ) : jobs.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No export jobs yet. Create one on the left to get started.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Progress</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Rows</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job: ExportJobDisplay) => {
                      const statusColors = getStatusColor(job.status);
                      return (
                        <tr key={job.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <td style={{ padding: '12px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{job.job_type}</td>
                          <td style={{ padding: '12px' }}>
                            <span className="status-badge" style={{ backgroundColor: statusColors.bg, color: statusColors.text, borderColor: 'transparent', fontSize: '11px' }}>
                              {job.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ width: '100px' }}>
                              <div style={{ backgroundColor: 'var(--border-default)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                                <div
                                  style={{
                                    backgroundColor: 'var(--accent-primary)',
                                    height: '100%',
                                    transition: 'width 0.3s ease',
                                    width: `${job.progress_percent}%`
                                  }}
                                />
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                {job.progress_percent.toFixed(0)}%
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '12px' }}>{job.row_count.toLocaleString()}</td>
                          <td style={{ padding: '12px', display: 'flex', gap: '6px' }}>
                            {job.status === 'completed' && job.file_url && (
                              <a
                                href={job.file_url}
                                download
                                className="btn-ghost"
                                style={{ fontSize: '11px', padding: '3px 6px' }}
                              >
                                DL
                              </a>
                            )}
                            {(job.status === 'pending' || job.status === 'processing') && (
                              <button
                                onClick={() => handleCancelJob(job.id)}
                                className="btn-ghost"
                                style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--accent-warning)' }}
                              >
                                Cancel
                              </button>
                            )}
                            {job.status === 'failed' && (
                              <button
                                onClick={() => handleRetryJob(job.id)}
                                className="btn-ghost"
                                style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--accent-info)' }}
                              >
                                Retry
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="btn-ghost"
                              style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--accent-error)' }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
