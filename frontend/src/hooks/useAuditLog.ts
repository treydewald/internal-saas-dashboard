import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  status: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: null as string | null,
    resource_type: null as string | null,
    user_id: null as number | null,
    limit: 100,
    offset: 0,
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.action) params.append('action', filters.action);
      if (filters.resource_type) params.append('resource_type', filters.resource_type);
      if (filters.user_id) params.append('user_id', filters.user_id.toString());
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await axios.get(`/api/audit/logs?${params}`);
      setLogs(response.data.logs);
      setTotalCount(response.data.total_count);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilter = (filterKey: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
      offset: 0, // Reset pagination on filter change
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: null,
      resource_type: null,
      user_id: null,
      limit: 100,
      offset: 0,
    });
  };

  const paginate = (newOffset: number) => {
    setFilters((prev) => ({ ...prev, offset: newOffset }));
  };

  return {
    logs,
    totalCount,
    loading,
    filters,
    fetchLogs,
    updateFilter,
    clearFilters,
    paginate,
  };
}
