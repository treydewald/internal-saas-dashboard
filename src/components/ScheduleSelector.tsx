import React, { useState } from "react";

interface ScheduleConfig {
  cron?: string;
  timezone: string;
}

interface ScheduleSelectorProps {
  scheduleType: string;
  scheduleConfig: ScheduleConfig;
  onScheduleChange: (type: string, config: ScheduleConfig) => void;
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  scheduleType,
  scheduleConfig,
  onScheduleChange,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    onScheduleChange(newType, scheduleConfig);
  };

  const handleCronChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScheduleChange(scheduleType, {
      ...scheduleConfig,
      cron: e.target.value,
    });
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onScheduleChange(scheduleType, {
      ...scheduleConfig,
      timezone: e.target.value,
    });
  };

  return (
    <div className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Schedule Configuration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Schedule Type
          </label>
          <select
            value={scheduleType}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom (Cron)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
          <select
            value={scheduleConfig.timezone}
            onChange={handleTimezoneChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="CST">Central Time</option>
            <option value="MST">Mountain Time</option>
            <option value="PST">Pacific Time</option>
          </select>
        </div>
      </div>

      {scheduleType === "custom" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Cron Expression
          </label>
          <input
            type="text"
            value={scheduleConfig.cron || ""}
            onChange={handleCronChange}
            placeholder="e.g., 0 9 * * 1 (every Monday at 9am)"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Format: minute hour day month weekday. See crontab.guru for help.
          </p>
        </div>
      )}

      {scheduleType === "weekly" && (
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-sm text-slate-700 dark:text-slate-300">
          Report will be generated every week.
        </div>
      )}
      {scheduleType === "monthly" && (
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-sm text-slate-700 dark:text-slate-300">
          Report will be generated every month (30-day interval).
        </div>
      )}
      {scheduleType === "daily" && (
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-sm text-slate-700 dark:text-slate-300">
          Report will be generated every day.
        </div>
      )}
    </div>
  );
};
