import React from 'react';

interface Trend {
  direction: 'up' | 'down';
  percent: number;
}

interface KPICardProps {
  name: string;
  value: number;
  unit?: string;
  trend?: Trend;
}

export const KPICard: React.FC<KPICardProps> = ({ name, value, unit, trend }) => {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  const trendColor = trend?.direction === 'up' ? 'text-green-500' : 'text-red-500';
  const trendArrow = trend?.direction === 'up' ? '↑' : '↓';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
        {name}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formattedValue}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        {trend && (
          <div className={`${trendColor} text-sm font-semibold`}>
            <span>{trendArrow} {trend.percent}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
