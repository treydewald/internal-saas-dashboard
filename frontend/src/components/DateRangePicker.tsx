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
    <div
      style={{
        backgroundColor: 'var(--layer-2)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <h3
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          margin: 0,
        }}
      >
        Date Range
      </h3>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.days)}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="from-date">From</label>
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="to-date">To</label>
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
