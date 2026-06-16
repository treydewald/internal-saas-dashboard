import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ForecastChartProps {
  data: Array<{
    date: string;
    forecasted_requests?: number;
    forecasted_error_rate_pct?: number;
    forecasted_revenue?: number;
  }>;
  type: 'requests' | 'error_rate' | 'revenue';
  confidence: number;
}

const TYPE_CONFIG = {
  requests: { key: 'forecasted_requests', label: 'Requests', color: '#2563EB' },
  error_rate: { key: 'forecasted_error_rate_pct', label: 'Error Rate (%)', color: '#F59E0B' },
  revenue: { key: 'forecasted_revenue', label: 'Revenue ($)', color: '#10B981' },
} as const;

const ForecastChart: React.FC<ForecastChartProps> = ({ data, type, confidence }) => {
  const config = TYPE_CONFIG[type];

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const formatValue = (value: any) => {
    if (type === 'revenue') return `$${Number(value).toFixed(2)}`;
    if (type === 'error_rate') return `${Number(value).toFixed(2)}%`;
    return Number(value).toFixed(0);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            3-Day Forecast
          </h4>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
        <div
          style={{
            height: '6px',
            borderRadius: '999px',
            backgroundColor: 'var(--border-default)',
            marginTop: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${confidence * 100}%`,
              height: '100%',
              borderRadius: '999px',
              backgroundColor: 'var(--accent-info)',
            }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94A3B8' }}
          />
          <YAxis
            label={{ value: config.label, angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
            stroke="#94A3B8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94A3B8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#334155' }}
            formatter={formatValue}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={config.key}
            stroke={config.color}
            dot={{ fill: config.color, r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name={config.label}
          />
        </LineChart>
      </ResponsiveContainer>

      <p style={{ margin: '16px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
        Forecast based on historical trends. Actual results may vary.
      </p>
    </div>
  );
};

export default ForecastChart;
