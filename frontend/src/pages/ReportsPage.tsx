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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div>
          <h1>Reports</h1>
          <p>Schedule automated reports for delivery via email</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Schedule Report
        </button>
      </div>

      {/* Create Report Form */}
      {showForm && (
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
            New Scheduled Report
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Report Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Weekly KPI Summary"
                />
              </div>
              <div className="form-group">
                <label>Report Type</label>
                <select
                  value={form.report_type}
                  onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}
                >
                  {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <select
                  value={form.schedule_type}
                  onChange={e => setForm(p => ({ ...p, schedule_type: e.target.value }))}
                >
                  {SCHEDULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Export Format</label>
                <select
                  value={form.export_format}
                  onChange={e => setForm(p => ({ ...p, export_format: e.target.value }))}
                >
                  {FORMAT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>

            <div className="form-group">
              <label>Recipient Emails *</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
                  placeholder="user@example.com"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addEmail} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {form.recipient_emails.map(email => (
                  <span key={email} className="status-badge" style={{ backgroundColor: 'var(--accent-primary-dim)', color: 'var(--accent-primary)', borderColor: 'rgba(37,99,235,0.2)' }}>
                    {email}
                    <button type="button" onClick={() => removeEmail(email)} style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '14px' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="include_charts"
                checked={form.include_charts}
                onChange={e => setForm(p => ({ ...p, include_charts: e.target.checked }))}
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <label htmlFor="include_charts" style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Include charts in report</label>
            </div>

            {formError && <div className="alert alert-error"><p style={{ margin: 0 }}>{formError}</p></div>}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Create Report'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
          </div>
        )}

      {/* Reports List */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Scheduled Reports ({reports.length})
        </h2>
        {loading && <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>Loading reports...</div>}
        {error && <div className="alert alert-error"><p style={{ margin: 0 }}>{error}</p></div>}
        {!loading && !error && reports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
            No scheduled reports yet. Click "+ Schedule Report" to create one.
          </div>
        )}
        {!loading && reports.map((report, idx) => (
          <div key={report.id} style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: idx < reports.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{report.name}</h3>
                  <span className="status-badge" style={{ backgroundColor: report.is_active ? 'var(--accent-success-dim)' : 'var(--border-default)', color: report.is_active ? 'var(--accent-success)' : 'var(--text-tertiary)' }}>
                    {report.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="status-badge" style={{ backgroundColor: 'var(--accent-info-dim)', color: 'var(--accent-info)', borderColor: 'rgba(2,132,199,0.2)' }}>
                    {report.export_format.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '8px', margin: '8px 0 0 0' }}>
                  {REPORT_TYPES.find(t => t.value === report.report_type)?.label} · {report.schedule_type} · {report.recipient_emails.join(', ')}
                </p>
                {report.next_run_at && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Next run: {new Date(report.next_run_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleReport(report.id, !report.is_active)}
                  className="btn-secondary"
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  {report.is_active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => { if (window.confirm('Delete this report?')) deleteReport(report.id); }}
                  className="btn-ghost"
                  style={{ color: 'var(--accent-error)', fontSize: '13px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

