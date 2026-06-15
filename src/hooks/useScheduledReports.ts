import { useState, useCallback, useEffect } from "react";
import api from "../utils/api";

interface Report {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  filters?: Record<string, any>;
  include_charts: boolean;
  export_format: string;
  schedule_type: string;
  schedule_config: Record<string, any>;
  recipient_emails: string[];
  delivery_method: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_run_at?: string;
  next_run_at?: string;
}

interface ReportExecution {
  id: number;
  scheduled_report_id: number;
  status: string;
  error_message?: string;
  file_path?: string;
  file_size?: number;
  started_at?: string;
  completed_at?: string;
  execution_time_ms?: number;
  delivery_status: string;
  delivery_error?: string;
  delivered_at?: string;
  created_at: string;
}

export const useScheduledReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Report[]>("/api/reports");
      setReports(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const createReport = useCallback(
    async (reportData: Omit<Report, "id" | "created_at" | "updated_at">) => {
      try {
        await api.post("/api/reports", reportData);
        await fetchReports();
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || "Failed to create report";
        setError(errorMsg);
        throw err;
      }
    },
    [fetchReports]
  );

  const updateReport = useCallback(
    async (reportId: number, reportData: Partial<Report>) => {
      try {
        await api.put(`/api/reports/${reportId}`, reportData);
        await fetchReports();
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || "Failed to update report";
        setError(errorMsg);
        throw err;
      }
    },
    [fetchReports]
  );

  const deleteReport = useCallback(
    async (reportId: number) => {
      try {
        await api.delete(`/api/reports/${reportId}`);
        await fetchReports();
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || "Failed to delete report";
        setError(errorMsg);
        throw err;
      }
    },
    [fetchReports]
  );

  const executeReport = useCallback(async (reportId: number): Promise<ReportExecution> => {
    try {
      const response = await api.post<ReportExecution>(`/api/reports/${reportId}/run`);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to execute report";
      setError(errorMsg);
      throw err;
    }
  }, []);

  const getExecutionHistory = useCallback(
    async (reportId: number, limit: number = 10): Promise<ReportExecution[]> => {
      try {
        const response = await api.get<ReportExecution[]>(`/api/reports/${reportId}/executions?limit=${limit}`);
        return response.data;
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || "Failed to fetch execution history";
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const refresh = useCallback(() => {
    return fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    executeReport,
    getExecutionHistory,
    refresh,
  };
};
