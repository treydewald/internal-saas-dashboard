import React from 'react';
import { KPICards } from '../components/KPICards';

export const OverviewPage: React.FC = () => {
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

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Key Performance Indicators
        </h2>
        <KPICards />
      </section>
    </div>
  );
};
