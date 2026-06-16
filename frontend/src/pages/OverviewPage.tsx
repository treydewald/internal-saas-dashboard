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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Hero Header ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: '0 0 6px 0',
            }}
          >
            Platform Analytics
          </p>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '32px',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}>
            Overview
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0,
            fontWeight: 'var(--fw-normal)'
          }}>
            Real-time performance metrics and API activity
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <DateRangePicker
            onDateRangeChange={updateDateRange}
            fromDate={dateRange.from}
            toDate={dateRange.to}
          />
          <ExportButton exportType="kpis" label="Export" />
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────── */}
      <section style={{ flex: '0 0 auto' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 16px 0'
        }}>
          Key Performance Indicators
        </h2>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      {/* ── Activity Chart (hero section) ─────────── */}
      <section style={{ flex: '1 1 auto', minHeight: 0 }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 16px 0'
        }}>
          API Activity
        </h2>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      {/* ── Advanced Metrics ───────────────────────── */}
      <section style={{ flex: '0 0 auto' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 16px 0'
        }}>
          Performance Breakdown
        </h2>
        <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
