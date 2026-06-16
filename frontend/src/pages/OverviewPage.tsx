import React from 'react';
import { KPICards } from '../components/KPICards';
import { MetricsCards } from '../components/MetricsCards';
import { APIActivityChart } from '../components/APIActivityChart';
import { DateRangePicker } from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { useDateRange } from '../hooks/useDateRange';

export const OverviewPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Hero Header ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: '0 0 6px 0',
            }}
          >
            Platform Analytics
          </p>
          <h1 style={{ margin: '0 0 4px 0' }}>Overview</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
            Real-time performance metrics and API activity
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <DateRangePicker
            onDateRangeChange={updateDateRange}
            fromDate={dateRange.from}
            toDate={dateRange.to}
          />
          <ExportButton exportType="kpis" label="Export" />
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────── */}
      <section>
        <p className="eyebrow" style={{ marginBottom: '14px' }}>Key Performance Indicators</p>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      {/* ── Activity Chart (hero section) ─────────── */}
      <section>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      {/* ── Advanced Metrics ───────────────────────── */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <p className="eyebrow">Performance Breakdown</p>
        </div>
        <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
