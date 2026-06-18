import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface Trend {
  direction: 'up' | 'down';
  percent: number;
}

interface KPI {
  name: string;
  value: number;
  unit?: string;
  trend?: Trend;
}

interface KPIsResponse {
  kpis: KPI[];
}

export const useKPIs = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<KPIsResponse>('/api/analytics/kpis');
      if (!response.ok) throw new Error(`Failed to fetch KPIs: ${response.statusText}`);
      setKpis(response.data.kpis);
    } catch (err) {
      console.error('Failed to fetch KPIs:', err);
      setError('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return { kpis, loading, error, refetch: fetchKpis };
};
