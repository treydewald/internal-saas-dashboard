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

const ForecastChart: React.FC<ForecastChartProps> = ({ data, type, confidence }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const getDataKey = () => {
    switch (type) {
      case 'requests':
        return 'forecasted_requests';
      case 'error_rate':
        return 'forecasted_error_rate_pct';
      case 'revenue':
        return 'forecasted_revenue';
      default:
        return '';
    }
  };

  const getYAxisLabel = () => {
    switch (type) {
      case 'requests':
        return 'Requests';
      case 'error_rate':
        return 'Error Rate (%)';
      case 'revenue':
        return 'Revenue ($)';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'requests':
        return '#38BDF8';
      case 'error_rate':
        return '#F59E0B';
      case 'revenue':
        return '#10B981';
      default:
        return '#38BDF8';
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-gray-300 font-medium">3-Day Forecast</h4>
          <span className="text-xs text-gray-500">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
        <div className="bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-cyan-500 h-2 rounded-full"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#E5E7EB' }}
            formatter={(value: any) => {
              if (type === 'revenue') {
                return `$${value.toFixed(2)}`;
              }
              if (type === 'error_rate') {
                return `${value.toFixed(2)}%`;
              }
              return value.toFixed(0);
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={getDataKey()}
            stroke={getColor()}
            dot={{ fill: getColor(), r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name={type === 'requests' ? 'Requests' : type === 'error_rate' ? 'Error Rate (%)' : 'Revenue ($)'}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-gray-500 text-xs mt-4">
        Forecast based on historical trends. Actual results may vary.
      </p>
    </div>
  );
};

export default ForecastChart;
