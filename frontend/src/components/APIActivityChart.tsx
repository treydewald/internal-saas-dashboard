import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAPIActivity } from '../hooks/useAPIActivity';

interface APIActivityChartProps {
  dateFrom?: string;
  dateTo?: string;
}

export const APIActivityChart: React.FC<APIActivityChartProps> = ({ dateFrom = '', dateTo = '' }) => {
  const { data, loading, error, refetch } = useAPIActivity(7, dateFrom, dateTo);

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
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-80 animate-pulse">
        <div className="h-full bg-gray-300 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={refetch}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No API activity data available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a2542 0%, #131e35 100%)',
        border: '1px solid #1e2d4a',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <h3
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: '#64748B',
          marginBottom: '20px',
        }}
      >
        API Request Volume — Last 7 Days
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="#2d3e5f"
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={{ stroke: '#1e2d4a' }}
            tickLine={false}
          />
          <YAxis
            stroke="#2d3e5f"
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d1829',
              border: '1px solid #1e2d4a',
              borderRadius: '8px',
              color: '#E2E8F0',
              fontSize: '13px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
            formatter={(value) => [value, 'Requests']}
            labelFormatter={(label) => `Date: ${label}`}
            cursor={{ stroke: '#38BDF820', strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#38BDF8"
            strokeWidth={2.5}
            dot={{ fill: '#0d1829', stroke: '#38BDF8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#38BDF8', stroke: '#0d1829', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
