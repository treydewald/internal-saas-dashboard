import React, { useState } from 'react';
import { useScheduledReports } from '../hooks/useScheduledReports';
import type { ScheduledReportCreate } from '../hooks/useScheduledReports';

const REPORT_TYPES = [
  { value: 'kpis', label: 'KPI Summary' },
  { value: 'users', label: 'User Activity' },
  { value: 'api_logs', label: 'API Logs' },
  { value: 'custom', label: 'Custom Report' },
];

const SCHEDULE_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
];

const defaultForm: ScheduledReportCreate = {
  name: '',
  description: '',
  report_type: 'kpis',
  include_charts: true,
  export_format: 'pdf',
  schedule_type: 'daily',
  schedule_config: { cron: '0 8 * * *', timezone: 'UTC' },
  recipient_emails: [],
  delivery_method: 'email',
  is_active: true,
};

export const ReportsPage: React.FC = () => {
  const { reports, loading, error, createReport, deleteReport, toggleReport } = useScheduledReports();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScheduledReportCreate>(defaultForm);
  const [emailInput, setEmailInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (form.recipient_emails.length === 0) { setFormError('At least one recipient email is required'); return; }
    setSaving(true);
    setFormError(null);
    try {
      await createReport(form);
      setShowForm(false);
      setForm(defaultForm);
      setEmailInput('');
    } catch {
      setFormError('Failed to create report. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && !form.recipient_emails.includes(trimmed)) {
      setForm(prev => ({ ...prev, recipient_emails: [...prev.recipient_emails, trimmed] }));
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setForm(prev => ({ ...prev, recipient_emails: prev.recipient_emails.filter(e => e !== email) }));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule automated reports for delivery via email</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            + Schedule Report
          </button>
        </div>

        {/* Create Report Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">New Scheduled Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Weekly KPI Summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                  <select
                    value={form.report_type}
                    onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule</label>
                  <select
                    value={form.schedule_type}
                    onChange={e => setForm(p => ({ ...p, schedule_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {SCHEDULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Export Format</label>
                  <select
                    value={form.export_format}
                    onChange={e => setForm(p => ({ ...p, export_format: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {FORMAT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Emails *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="user@example.com"
                  />
                  <button type="button" onClick={addEmail} className="px-3 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.recipient_emails.map(email => (
                    <span key={email} className="flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-sm">
                      {email}
                      <button type="button" onClick={() => removeEmail(email)} className="ml-1 text-xs">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include_charts"
                  checked={form.include_charts}
                  onChange={e => setForm(p => ({ ...p, include_charts: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="include_charts" className="text-sm text-gray-700 dark:text-gray-300">Include charts in report</label>
              </div>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Create Report'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Reports ({reports.length})</h2>
          </div>
          {loading && <div className="p-6 text-center text-gray-500">Loading reports...</div>}
          {error && <div className="p-6 text-center text-red-500">{error}</div>}
          {!loading && !error && reports.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No scheduled reports yet. Click "+ Schedule Report" to create one.
            </div>
          )}
          {!loading && reports.map(report => (
            <div key={report.id} className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${report.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'}`}>
                      {report.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {report.export_format.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {REPORT_TYPES.find(t => t.value === report.report_type)?.label} · {report.schedule_type} · {report.recipient_emails.join(', ')}
                  </p>
                  {report.next_run_at && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Next run: {new Date(report.next_run_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleReport(report.id, !report.is_active)}
                    className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    {report.is_active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => { if (window.confirm('Delete this report?')) deleteReport(report.id); }}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

