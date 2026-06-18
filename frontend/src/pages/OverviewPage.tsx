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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

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
              margin: '0 0 4px 0',
            }}
          >
            PLATFORM ANALYTICS
          </p>
          <h1 style={{
            margin: '0 0 2px 0',
            fontSize: '36px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <DateRangePicker
            onDateRangeChange={updateDateRange}
            fromDate={dateRange.from}
            toDate={dateRange.to}
          />
          <ExportButton exportType="kpis" label="Export" />
        </div>
      </div>

      {/* ── KPI Cards (Primary Focus) ──────────────────────────────── */}
      <section style={{ flex: '0 0 auto', paddingBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Key Performance Indicators
        </h2>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      {/* ── Activity Chart & Metrics ─────────────────── */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', overflow: 'hidden' }}>
        <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>
            API Activity
          </h2>
          <div style={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
            <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>
            Performance Breakdown
          </h2>
          <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
          </div>
        </section>
      </div>
    </div>
  );
};
