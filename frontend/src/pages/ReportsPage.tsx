import React, { useState } from 'react';
import { useScheduledReports } from '../hooks/useScheduledReports';
import type { ScheduledReportCreate } from '../hooks/useScheduledReports';
import { FileText } from 'lucide-react';

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <FileText size={14} />
            </div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                margin: 0,
              }}
            >
              Automation
            </p>
          </div>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: '32px',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Reports
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Schedule automated reports for delivery via email
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ flex: '0 0 auto' }}
        >
          + Schedule Report
        </button>
      </div>

      {/* Two-Panel Layout: Reports List (Left) | Form (Right) */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 420px', gap: '16px', overflow: 'hidden' }}>

        {/* Reports List (Left, scrollable) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>
            Scheduled Reports ({reports.length})
          </h2>
          <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            {loading && <div className="card" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>Loading reports...</div>}
            {error && <div className="card alert alert-error"><p style={{ margin: 0 }}>{error}</p></div>}
            {!loading && !error && reports.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
                No scheduled reports yet. Create one in the panel to the right.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!loading && reports.map((report) => (
                <div key={report.id} className="glass-panel" style={{ padding: '20px', flex: '0 0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{report.name}</h3>
                        <span className="status-badge" style={{ backgroundColor: report.is_active ? 'var(--accent-success-dim)' : 'var(--border-default)', color: report.is_active ? 'var(--accent-success)' : 'var(--text-tertiary)', flex: '0 0 auto' }}>
                          {report.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="status-badge" style={{ backgroundColor: 'var(--accent-info-dim)', color: 'var(--accent-info)', borderColor: 'rgba(2,132,199,0.2)', flex: '0 0 auto' }}>
                          {report.export_format.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {REPORT_TYPES.find(t => t.value === report.report_type)?.label} · {report.schedule_type}
                      </p>
                      {report.next_run_at && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                          Next run: {new Date(report.next_run_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
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
        </div>

        {/* Form Panel (Right, sticky) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
          {!showForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-tertiary)', flex: '1' }}>
              <FileText size={40} style={{ marginBottom: '12px', color: 'var(--border-emphasis)' }} />
              <p style={{ fontWeight: 500, margin: '0 0 6px 0' }}>Create a Report</p>
              <p style={{ fontSize: '13px', margin: 0, maxWidth: '280px' }}>
                Click "+ Schedule Report" above to set up automated reporting
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
              <div className="form-group">
                <label>Report Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Weekly KPI Summary"
                  style={{ fontSize: '13px' }}
                />
              </div>
              <div className="form-group">
                <label>Report Type</label>
                <select
                  value={form.report_type}
                  onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}
                  style={{ fontSize: '13px' }}
                >
                  {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <select
                  value={form.schedule_type}
                  onChange={e => setForm(p => ({ ...p, schedule_type: e.target.value }))}
                  style={{ fontSize: '13px' }}
                >
                  {SCHEDULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Export Format</label>
                <select
                  value={form.export_format}
                  onChange={e => setForm(p => ({ ...p, export_format: e.target.value }))}
                  style={{ fontSize: '13px' }}
                >
                  {FORMAT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Optional"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label>Recipient Email *</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
                    placeholder="user@example.com"
                    style={{ flex: 1, fontSize: '13px' }}
                  />
                  <button type="button" onClick={addEmail} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 10px', flex: '0 0 auto' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                  {form.recipient_emails.map(email => (
                    <span key={email} className="status-badge" style={{ backgroundColor: 'var(--accent-primary-dim)', color: 'var(--accent-primary)', borderColor: 'rgba(37,99,235,0.2)', fontSize: '12px', padding: '3px 8px', flex: '0 0 auto' }}>
                      {email}
                      <button type="button" onClick={() => removeEmail(email)} style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
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
                <label htmlFor="include_charts" style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Include charts</label>
              </div>

              {formError && <div className="alert alert-error" style={{ flex: '0 0 auto' }}><p style={{ margin: 0, fontSize: '12px' }}>{formError}</p></div>}

              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', flex: '0 0 auto' }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: '13px', flex: 1 }}>
                  {saving ? 'Saving...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '13px', flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

