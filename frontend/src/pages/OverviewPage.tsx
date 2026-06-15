import React from 'react';
import { KPICards } from '../components/KPICards';
import { APIActivityChart } from '../components/APIActivityChart';
import { DateRangePicker } from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { useDateRange } from '../hooks/useDateRange';

export const OverviewPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the dashboard. Monitor your key metrics at a glance.
        </p>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Key Performance Indicators
          </h2>
          <ExportButton exportType="kpis" label="Export KPIs" />
        </div>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
