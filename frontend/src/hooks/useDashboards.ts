import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export interface Dashboard {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_default: boolean;
  layout: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardCreatePayload {
  name: string;
  description?: string;
  layout: string;
  is_default?: boolean;
}

export interface DashboardUpdatePayload {
  name?: string;
  description?: string;
  layout?: string;
  is_default?: boolean;
}

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboards');
      setDashboards(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboards');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (dashboardId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/dashboards/${dashboardId}`);
      setCurrentDashboard(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboards/default');
      setCurrentDashboard(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch default dashboard');
    } finally {
      setLoading(false);
    }
  };

  const createDashboard = async (payload: DashboardCreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/dashboards', payload);
      setDashboards([...dashboards, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDashboard = async (dashboardId: number, payload: DashboardUpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/dashboards/${dashboardId}`, payload);
      setDashboards(dashboards.map((d) => (d.id === dashboardId ? response.data : d)));
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(response.data);
      }
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async (dashboardId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/dashboards/${dashboardId}`);
      setDashboards(dashboards.filter((d) => d.id !== dashboardId));
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (dashboardId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/dashboards/${dashboardId}/set-default`);
      setDashboards(
        dashboards.map((d) => ({
          ...d,
          is_default: d.id === dashboardId,
        }))
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to set default dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    currentDashboard,
    loading,
    error,
    fetchDashboards,
    fetchDashboard,
    fetchDefaultDashboard,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setDefault,
  };
};
