import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import AlertRuleBuilder from '../components/AlertRuleBuilder';
import AlertHistory from '../components/AlertHistory';
import { Bell, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AlertsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const { rules, alerts, loading, createRule, deleteRule } = useAlerts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Page Header ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
          paddingBottom: '24px',
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
                background: 'rgba(217,119,6,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-warning)',
              }}
            >
              <Bell size={14} />
            </div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-warning)',
                margin: 0,
              }}
            >
              Monitoring
            </p>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Alerts</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage alert rules and view triggered notifications
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          Create Rule
        </button>
      </div>

      {/* ── Alert Rules ─────────────────────────────── */}
      <section className="section-anchor" style={{ flex: '1 1 auto' }}>
        <h2 className="section-anchor__title">Alert Rules</h2>
        <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--accent-primary), #7C3AED)' }} />

          {/* Rules list */}
          <div>
            {loading ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  padding: '48px 24px',
                  fontSize: '14px',
                }}
              >
                Loading rules...
              </div>
            ) : rules.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  padding: '48px 24px',
                }}
              >
                <Bell size={32} style={{ color: 'var(--border-emphasis)', marginBottom: '12px' }} />
                <p style={{ fontWeight: 500, margin: '0 0 6px 0' }}>No alert rules yet</p>
                <p style={{ fontSize: '13px', margin: 0 }}>
                  Create a rule to get notified when metrics cross thresholds.
                </p>
              </div>
            ) : (
              rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="table-row--hoverable"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom:
                      index < rules.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background-color var(--duration-sm)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {rule.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                      <code
                        style={{
                          fontFamily: 'monospace',
                          background: 'var(--bg-tertiary)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {rule.metric_name} {rule.operator} {rule.threshold}
                      </code>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-chip)',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: rule.enabled
                          ? 'rgba(22,163,74,0.1)'
                          : 'rgba(100,116,139,0.1)',
                        color: rule.enabled ? 'var(--accent-success)' : 'var(--text-muted)',
                        border: `1px solid ${rule.enabled ? 'rgba(22,163,74,0.2)' : 'transparent'}`,
                      }}
                    >
                      {rule.enabled ? (
                        <CheckCircle size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'all var(--duration-sm)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.06)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.3)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-error)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                      }}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Alert History ───────────────────────────── */}
      <section className="section-anchor" style={{ flex: '1 1 auto' }}>
        <h2 className="section-anchor__title">Alert History</h2>
        <AlertHistory alerts={alerts} loading={loading} />
      </section>

      {/* ── Create Rule Modal ───────────────────────── */}
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
