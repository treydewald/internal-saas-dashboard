import { useState, useEffect } from 'react';
import axios from 'axios';

interface ActivityDataPoint {
  date: string;
  count: number;
}

interface ActivityResponse {
  data: ActivityDataPoint[];
}

export const useAPIActivity = (days: number = 7) => {
  const [data, setData] = useState<ActivityDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ActivityResponse>('/api/analytics/api-activity', {
        params: { days }
      });
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
  }, [days]);

  return { data, loading, error, refetch: fetchActivity };
};
