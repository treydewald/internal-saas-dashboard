import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface ScheduledReport {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  report_type: string;
  filters?: Record<string, unknown>;
  include_charts: boolean;
  export_format: string;
  schedule_type: string;
  schedule_config: Record<string, unknown>;
  recipient_emails: string[];
  delivery_method: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_run_at?: string;
  next_run_at?: string;
}

export interface ScheduledReportCreate {
  name: string;
  description?: string;
  report_type: string;
  filters?: Record<string, unknown>;
  include_charts: boolean;
  export_format: string;
  schedule_type: string;
  schedule_config: Record<string, unknown>;
  recipient_emails: string[];
  delivery_method: string;
  is_active: boolean;
}

export function useScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ScheduledReport[]>('/api/reports');
      if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`);
      setReports(response.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const createReport = async (data: ScheduledReportCreate): Promise<ScheduledReport> => {
    const response = await api.post<ScheduledReport>('/api/reports', data);
    if (!response.ok) throw new Error(`Failed to create report: ${response.statusText}`);
    setReports(prev => [response.data, ...prev]);
    return response.data;
  };

  const deleteReport = async (id: number): Promise<void> => {
    const response = await api.delete(`/api/reports/${id}`);
    if (!response.ok) throw new Error(`Failed to delete report: ${response.statusText}`);
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const toggleReport = async (id: number, is_active: boolean): Promise<void> => {
    const response = await api.put<ScheduledReport>(`/api/reports/${id}`, { is_active });
    if (!response.ok) throw new Error(`Failed to update report: ${response.statusText}`);
    setReports(prev => prev.map(r => r.id === id ? response.data : r));
  };

  return { reports, loading, error, createReport, deleteReport, toggleReport, refetch: fetchReports };
}
