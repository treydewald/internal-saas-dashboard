import { useState } from 'react';
import { api } from '../utils/api';

export const useExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportKPIs = async (format: 'csv' | 'pdf') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<Blob>(`/api/export/kpis?format=${format}`, {}, {
        responseType: 'blob',
      });
      downloadFile(response.data, `kpis_${new Date().toISOString().split('T')[0]}.${format}`);
    } catch (err: any) {
      setError(err.message || 'Failed to export KPIs');
    } finally {
      setIsLoading(false);
    }
  };

  const exportUsers = async (format: 'csv' | 'pdf') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<Blob>(`/api/export/users?format=${format}`, {}, {
        responseType: 'blob',
      });
      downloadFile(response.data, `users_${new Date().toISOString().split('T')[0]}.${format}`);
    } catch (err: any) {
      setError(err.message || 'Failed to export users');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAPILogs = async (format: 'csv' | 'pdf') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<Blob>(`/api/export/api-logs?format=${format}`, {}, {
        responseType: 'blob',
      });
      downloadFile(response.data, `api_logs_${new Date().toISOString().split('T')[0]}.${format}`);
    } catch (err: any) {
      setError(err.message || 'Failed to export API logs');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return {
    exportKPIs,
    exportUsers,
    exportAPILogs,
    isLoading,
    error,
  };
};
