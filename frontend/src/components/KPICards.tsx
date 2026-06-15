import React, { useEffect, useState } from 'react';
import { KPICard } from './KPICard';
import axios from 'axios';

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

export const KPICards: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<KPIsResponse>('/api/analytics/kpis');
      setKpis(response.data.kpis);
    } catch (err) {
      console.error('Failed to fetch KPIs:', err);
      setError('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded mb-2 w-1/2"></div>
            <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchKpis}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.name}
          name={kpi.name}
          value={kpi.value}
          unit={kpi.unit}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
};
