import React, { useState, useEffect } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import AlertRuleBuilder from '../components/AlertRuleBuilder';
import AlertHistory from '../components/AlertHistory';

export default function AlertsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const { rules, alerts, loading, createRule, deleteRule } = useAlerts();

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage alert rules and view triggered alerts</p>
          </div>
          <button
            onClick={() => setShowBuilder(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            + Create Rule
          </button>
        </div>

        {/* Alert Rules Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alert Rules</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading rules...</div>
            ) : rules.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No alert rules yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex justify-between items-center p-4 border border-gray-200 dark:border-slate-700 rounded"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{rule.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rule.metric_name} {rule.operator} {rule.threshold}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          rule.enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alert History Section */}
        <AlertHistory alerts={alerts} loading={loading} />

        {/* Create Rule Modal */}
        {showBuilder && (
          <AlertRuleBuilder
            onClose={() => setShowBuilder(false)}
            onCreate={(rule) => {
              createRule(rule);
              setShowBuilder(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
