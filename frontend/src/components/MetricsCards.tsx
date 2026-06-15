import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Metric {
  name: string;
  value: number;
  unit?: string;
}

interface MetricsResponse {
  metrics: Metric[];
}

interface MetricsCardsProps {
  dateFrom?: string;
  dateTo?: string;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ dateFrom = '', dateTo = '' }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axios.get<MetricsResponse>(`/api/analytics/metrics${queryString}`);
      setMetrics(response.data.metrics);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError('Failed to load metrics data');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    setLoading(true);
    fetchMetrics();
  }, [dateFrom, dateTo, fetchMetrics]);

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
          onClick={fetchMetrics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          style={{
            background: 'linear-gradient(135deg, #1a2947 0%, #162035 100%)',
            border: '1px solid #334155',
            borderLeft: '3px solid #38BDF8',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#64748B',
              marginBottom: '10px',
            }}
          >
            {metric.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#E2E8F0',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {metric.value.toFixed(1)}
            </span>
            {metric.unit && (
              <span style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 500 }}>
                {metric.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
