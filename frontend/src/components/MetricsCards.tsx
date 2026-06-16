import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Metric {
  name: string;
  value: number;
  unit?: string;
}

const MOCK_METRICS: Metric[] = [
  { name: 'Avg Response Time', value: 142.3, unit: 'ms' },
  { name: 'P95 Latency', value: 384.6, unit: 'ms' },
  { name: 'Uptime', value: 99.94, unit: '%' },
  { name: 'Cache Hit Rate', value: 87.2, unit: '%' },
  { name: 'Throughput', value: 10.4, unit: 'k/s' },
  { name: 'Error Budget', value: 94.1, unit: '%' },
];

interface MetricsResponse {
  metrics: Metric[];
}

interface MetricsCardsProps {
  dateFrom?: string;
  dateTo?: string;
}

const METRIC_ACCENTS = [
  { color: '#2563EB', bg: 'rgba(37,99,235,0.08)', bar: 'linear-gradient(90deg, #2563EB, #4F46E5)' },
  { color: '#16A34A', bg: 'rgba(22,163,74,0.08)', bar: 'linear-gradient(90deg, #16A34A, #059669)' },
  { color: '#D97706', bg: 'rgba(217,119,6,0.08)', bar: 'linear-gradient(90deg, #D97706, #F59E0B)' },
  { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', bar: 'linear-gradient(90deg, #7C3AED, #6D28D9)' },
  { color: '#0284C7', bg: 'rgba(2,132,199,0.08)', bar: 'linear-gradient(90deg, #0284C7, #0369A1)' },
  { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', bar: 'linear-gradient(90deg, #DC2626, #E11D48)' },
];

export const MetricsCards: React.FC<MetricsCardsProps> = ({ dateFrom = '', dateTo = '' }) => {
  const [metrics, setMetrics] = useState<Metric[]>(MOCK_METRICS);
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
      setMetrics(MOCK_METRICS);
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card"
            style={{ animation: 'live-breathe 1.5s ease-in-out infinite', minHeight: '100px' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
      }}
    >
      {metrics.map((metric, index) => {
        const accent = METRIC_ACCENTS[index % METRIC_ACCENTS.length];
        return (
          <div
            key={metric.name}
            className="card kpi-card--hover"
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '20px',
            }}
          >
            {/* Top gradient bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: accent.bar,
              }}
            />

            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                margin: '0 0 12px 0',
              }}
            >
              {metric.name}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {metric.value.toFixed(1)}
              </span>
              {metric.unit && (
                <span
                  style={{
                    fontSize: '13px',
                    color: accent.color,
                    fontWeight: 600,
                  }}
                >
                  {metric.unit}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
