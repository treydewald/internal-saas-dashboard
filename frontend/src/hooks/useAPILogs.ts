import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface APILog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  user_id?: string;
  request_id?: string;
}

export interface APILogsResponse {
  logs: APILog[];
  total_count: number;
}

interface UseAPILogsOptions {
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  statusCode?: number;
  endpoint?: string;
}

export const useAPILogs = (options: UseAPILogsOptions = {}) => {
  const { limit = 20, dateFrom = '', dateTo = '', statusCode = 0, endpoint = '' } = options;
  const [logs, setLogs] = useState<APILog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(
    async (
      currentOffset: number,
      fromDate: string,
      toDate: string,
      status: number,
      endpointFilter: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: currentOffset.toString(),
        });

        if (fromDate) {
          params.append('date_from', fromDate);
        }
        if (toDate) {
          params.append('date_to', toDate);
        }
        if (status > 0) {
          params.append('status_code', status.toString());
        }
        if (endpointFilter) {
          params.append('endpoint', endpointFilter);
        }

        const response = await api.get<APILogsResponse>(`/api/api-logs?${params}`);
        const data: APILogsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data as any);
        }

        setLogs(data.logs);
        setTotalCount(data.total_count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch API logs');
        setLogs([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    setOffset(0);
    fetchLogs(0, dateFrom, dateTo, statusCode, endpoint);
  }, [dateFrom, dateTo, statusCode, endpoint, fetchLogs]);

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    fetchLogs(newOffset, dateFrom, dateTo, statusCode, endpoint);
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    logs,
    totalCount,
    loading,
    error,
    offset,
    limit,
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    refetch: () => fetchLogs(offset, dateFrom, dateTo, statusCode, endpoint),
  };
};
