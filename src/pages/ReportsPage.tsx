import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ReportBuilder } from "../components/ReportBuilder";
import { ReportList } from "../components/ReportList";
import { useScheduledReports } from "../hooks/useScheduledReports";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const { reports, loading, error, refresh, createReport } = useScheduledReports();

  const handleCreateReport = async (reportData: any) => {
    await createReport(reportData);
    setActiveTab("list");
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "list"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "create"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
              }`}
            >
              Create Report
            </button>
          </div>
        </div>

        {activeTab === "list" ? (
          <ReportList reports={reports} loading={loading} error={error} onRefresh={refresh} />
        ) : (
          <ReportBuilder onSubmit={handleCreateReport} />
        )}
      </div>
    </DashboardLayout>
  );
};
