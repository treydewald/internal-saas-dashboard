import React, { useState } from 'react';

interface AlertRuleBuilderProps {
  onClose: () => void;
  onCreate: (rule: {
    name: string;
    metric_name: string;
    operator: string;
    threshold: number;
  }) => void;
}

const METRIC_OPTIONS = [
  { value: 'error_rate', label: 'Error Rate (%)' },
  { value: 'response_time', label: 'Response Time (ms)' },
  { value: 'active_users', label: 'Active Users' },
  { value: 'requests_per_minute', label: 'Requests/Min' },
];

const OPERATOR_OPTIONS = [
  { value: '>', label: 'Greater than (>)' },
  { value: '<', label: 'Less than (<)' },
  { value: '>=', label: 'Greater or equal (>=)' },
  { value: '<=', label: 'Less or equal (<=)' },
  { value: '==', label: 'Equal (==)' },
];

export default function AlertRuleBuilder({ onClose, onCreate }: AlertRuleBuilderProps) {
  const [formData, setFormData] = useState({
    name: '',
    metric_name: 'error_rate',
    operator: '>',
    threshold: 5,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onCreate(formData);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Create Alert Rule
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--text-tertiary)',
              lineHeight: 1,
              padding: '4px',
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Rule Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., High Error Rate"
              required
            />
          </div>

          <div className="form-group">
            <label>Metric</label>
            <select
              value={formData.metric_name}
              onChange={(e) => handleChange('metric_name', e.target.value)}
            >
              {METRIC_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Operator</label>
            <select
              value={formData.operator}
              onChange={(e) => handleChange('operator', e.target.value)}
            >
              {OPERATOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Threshold Value</label>
            <input
              type="number"
              step="0.1"
              value={formData.threshold}
              onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
