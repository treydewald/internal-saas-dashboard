import React, { useCallback } from 'react';

interface DateRangePickerProps {
  onDateRangeChange?: (fromDate: string, toDate: string) => void;
  fromDate?: string;
  toDate?: string;
  presets?: {
    label: string;
    days: number;
  }[];
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  fromDate = '',
  toDate = '',
  presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This month', days: 0 },
  ],
}) => {
  const today = new Date();

  const handlePreset = useCallback(
    (days: number) => {
      if (days === 0) {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split('T')[0];
        const lastDay = today.toISOString().split('T')[0];
        onDateRangeChange?.(firstDay, lastDay);
      } else {
        const from = new Date(today);
        from.setDate(from.getDate() - days);
        onDateRangeChange?.(from.toISOString().split('T')[0], today.toISOString().split('T')[0]);
      }
    },
    [today, onDateRangeChange],
  );

  const handleFromDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDateRangeChange?.(e.target.value, toDate);
    },
    [toDate, onDateRangeChange],
  );

  const handleToDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDateRangeChange?.(fromDate, e.target.value);
    },
    [fromDate, onDateRangeChange],
  );

  return (
    <div className="bg-gray-800 border border-slate-700 rounded-lg p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Date Range</h3>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.days)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Date Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">To</label>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
