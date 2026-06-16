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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <h1>Overview</h1>
        <p>Monitor your key metrics at a glance.</p>
      </div>

      {/* Date Range Selector */}
      <section>
        <DateRangePicker
          onDateRangeChange={updateDateRange}
          fromDate={dateRange.from}
          toDate={dateRange.to}
        />
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <p className="eyebrow">Key Performance Indicators</p>
          <ExportButton exportType="kpis" label="Export KPIs" />
        </div>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <p className="eyebrow" style={{ marginBottom: '20px' }}>Advanced Metrics</p>
        <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
