import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import AlertRuleBuilder from '../components/AlertRuleBuilder';
import AlertHistory from '../components/AlertHistory';

export default function AlertsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const { rules, alerts, loading, createRule, deleteRule } = useAlerts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div>
          <h1>Alerts</h1>
          <p>Manage alert rules and view triggered alerts</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="btn-primary"
        >
          + Create Rule
        </button>
      </div>

      {/* Alert Rules Section */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Alert Rules
        </h2>
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading rules...</div>
          ) : rules.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>
              <p>No alert rules yet. Create one to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-input)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      {rule.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 }}>
                      {rule.metric_name} {rule.operator} {rule.threshold}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: rule.enabled ? 'var(--accent-success-dim)' : 'var(--border-default)',
                        color: rule.enabled ? 'var(--accent-success)' : 'var(--text-tertiary)',
                      }}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: 'var(--accent-error)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all var(--duration-sm)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      }}
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
  );
}
