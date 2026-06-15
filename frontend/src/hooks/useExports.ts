import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface ExportJob {
  id: number;
  user_id: number;
  organization_id?: number;
  job_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  row_count: number;
  error_message?: string;
  progress_percent: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ExportsResponse {
  jobs: ExportJob[];
  total_count: number;
}

export const useExports = () => {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (skip = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ExportsResponse>(`/api/exports?skip=${skip}&limit=${limit}`);
      const data: ExportsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      setJobs(data.jobs);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch export jobs');
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createExportJob = useCallback(
    async (jobType: string, filters?: Record<string, any>) => {
      setError(null);
      try {
        const response = await api.post<ExportJob>('/api/exports', {
          job_type: jobType,
          filters,
        });
        const data: ExportJob = await response.json();

        if (!response.ok) {
          throw new Error(data as any);
        }

        setJobs([data, ...jobs]);
        setTotalCount(totalCount + 1);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create export job';
        setError(errorMsg);
        throw err;
      }
    },
    [jobs, totalCount],
  );

  const getJobStatus = useCallback(async (jobId: number) => {
    try {
      const response = await api.get<ExportJob>(`/api/exports/${jobId}`);
      const data: ExportJob = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      // Update local state
      setJobs(jobs.map(j => (j.id === jobId ? data : j)));
      return data;
    } catch (err) {
      console.error('Failed to get job status:', err);
      throw err;
    }
  }, [jobs]);

  const cancelJob = useCallback(
    async (jobId: number) => {
      setError(null);
      try {
        const response = await api.post<ExportJob>(`/api/exports/${jobId}/cancel`, {});
        const data: ExportJob = await response.json();

        if (!response.ok) {
          throw new Error(data as any);
        }

        setJobs(jobs.map(j => (j.id === jobId ? data : j)));
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to cancel export job';
        setError(errorMsg);
        throw err;
      }
    },
    [jobs],
  );

  const retryJob = useCallback(
    async (jobId: number) => {
      setError(null);
      try {
        const response = await api.post<ExportJob>(`/api/exports/${jobId}/retry`, {});
        const data: ExportJob = await response.json();

        if (!response.ok) {
          throw new Error(data as any);
        }

        setJobs(jobs.map(j => (j.id === jobId ? data : j)));
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to retry export job';
        setError(errorMsg);
        throw err;
      }
    },
    [jobs],
  );

  const deleteJob = useCallback(
    async (jobId: number) => {
      setError(null);
      try {
        const response = await api.delete<Record<string, unknown>>(`/api/exports/${jobId}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data as any);
        }

        setJobs(jobs.filter(j => j.id !== jobId));
        setTotalCount(totalCount - 1);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete export job';
        setError(errorMsg);
        throw err;
      }
    },
    [jobs, totalCount],
  );

  return {
    jobs,
    totalCount,
    loading,
    error,
    fetchJobs,
    createExportJob,
    getJobStatus,
    cancelJob,
    retryJob,
    deleteJob,
  };
};
