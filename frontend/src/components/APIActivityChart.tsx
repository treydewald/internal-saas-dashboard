import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';
import { useAPIActivity } from '../hooks/useAPIActivity';

const MOCK_ACTIVITY = [
  { date: '2026-06-10', count: 28400, displayDate: 'Jun 10' },
  { date: '2026-06-11', count: 31200, displayDate: 'Jun 11' },
  { date: '2026-06-12', count: 29800, displayDate: 'Jun 12' },
  { date: '2026-06-13', count: 35600, displayDate: 'Jun 13' },
  { date: '2026-06-14', count: 38900, displayDate: 'Jun 14' },
  { date: '2026-06-15', count: 42100, displayDate: 'Jun 15' },
  { date: '2026-06-16', count: 44800, displayDate: 'Jun 16' },
];

interface APIActivityChartProps {
  dateFrom?: string;
  dateTo?: string;
}

export const APIActivityChart: React.FC<APIActivityChartProps> = ({ dateFrom = '', dateTo = '' }) => {
  const { data, loading } = useAPIActivity(7, dateFrom, dateTo);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map((point) => ({
    ...point,
    displayDate: formatDate(point.date),
  }));

  if (loading) {
    return (
      <div
        className="card"
        style={{ height: '360px', animation: 'live-breathe 1.5s ease-in-out infinite' }}
      />
    );
  }

  const displayData = (!chartData || chartData.length === 0) ? MOCK_ACTIVITY : chartData;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Chart Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Activity size={14} />
            </div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              API Request Volume
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
            Last 7 days — daily request counts
          </p>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            padding: '4px 10px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-chip)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#2563EB',
              display: 'inline-block',
            }}
          />
          Requests
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={displayData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--layer-1)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              fontSize: '13px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '10px 14px',
            }}
            labelStyle={{ color: 'var(--text-tertiary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}
            itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            formatter={(value) => [value, 'Requests']}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#requestsGradient)"
            dot={{ fill: '#fff', stroke: '#2563EB', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2.5 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
