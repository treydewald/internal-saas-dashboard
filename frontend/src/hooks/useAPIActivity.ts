import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface ActivityDataPoint {
  date: string;
  count: number;
}

interface ActivityResponse {
  data: ActivityDataPoint[];
}

export const useAPIActivity = (days: number = 7, dateFrom: string = '', dateTo: string = '') => {
  const [data, setData] = useState<ActivityDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `/api/analytics/api-activity?days=${days}`;
      if (dateFrom && dateTo) {
        url = `/api/analytics/api-activity?date_from=${dateFrom}&date_to=${dateTo}`;
      }
      const response = await api.get<ActivityResponse>(url);
      if (!response.ok) throw new Error(`Failed to fetch activity: ${response.statusText}`);
      setData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch API activity:', err);
      setError('Failed to load API activity data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [days, dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchActivity };
};
