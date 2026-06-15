import type { SuccessPoint, UserRecord, Workflow } from '../../types/dashboard';

interface WorkflowCanvasProps {
  workflows: Workflow[];
  selectedWorkflowId: string;
  onSelectWorkflow: (id: string) => void;
  successSeries: SuccessPoint[];
  tableRows: UserRecord[];
}

const STEP_STATUS_COLORS: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  IDLE:    { bg: 'rgba(15,22,48,0.82)',  border: 'rgba(100,116,139,0.38)', dot: '#475569', text: '#64748B' },
  RUNNING: { bg: 'rgba(10,25,58,0.90)',  border: 'rgba(120,192,255,0.65)', dot: '#78c0ff', text: '#CBD5E1' },
  SUCCESS: { bg: 'rgba(6,28,22,0.82)',   border: 'rgba(52,211,153,0.45)',  dot: '#34d399', text: '#94A3B8' },
  ERROR:   { bg: 'rgba(28,8,16,0.82)',   border: 'rgba(251,113,133,0.45)', dot: '#fb7185', text: '#94A3B8' },
};

export function WorkflowCanvas({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  successSeries,
  tableRows,
}: WorkflowCanvasProps) {
  const activeWorkflow = workflows.find(workflow => workflow.id === selectedWorkflowId) ?? workflows[0];
  const maxSuccessValue = Math.max(...successSeries.map(point => point.value));

  return (
    <section className="workflow-canvas glass-panel" aria-label="Workflow canvas">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Orchestration Engine</p>
          <h2>Workflow Graph</h2>
        </div>
        <div className="workflow-switcher">
          {workflows.map(workflow => (
            <button
              key={workflow.id}
              type="button"
              onClick={() => onSelectWorkflow(workflow.id)}
              className={workflow.id === selectedWorkflowId ? 'is-active' : ''}
            >
              {workflow.name}
            </button>
          ))}
        </div>
      </header>

      {/* Graph node strip */}
      <div className="workflow-steps" role="list">
        {activeWorkflow.steps.map((step, index) => {
          const colors = STEP_STATUS_COLORS[step.status] ?? STEP_STATUS_COLORS.IDLE;
          const isRunning = step.status === 'RUNNING';
          const isLast = index === activeWorkflow.steps.length - 1;
          return (
            <div key={step.id} className="workflow-step-wrapper" role="listitem">
              <div
                className={`workflow-step${isRunning ? ' workflow-step--running' : ''}`}
                style={{
                  background: `linear-gradient(145deg, ${colors.bg} 0%, rgba(8,13,34,0.72) 100%)`,
                  borderColor: colors.border,
                  boxShadow: isRunning
                    ? `0 0 0 1px ${colors.border}, 0 0 20px rgba(120,192,255,0.18), inset 0 1px 0 rgba(255,255,255,0.08)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Status dot */}
                <div className="step-dot-row">
                  <span
                    className={`step-dot step-dot--${step.status.toLowerCase()}`}
                    style={{ background: colors.dot }}
                  />
                  <span className="step-status-label" style={{ color: colors.dot }}>
                    {step.status}
                  </span>
                </div>
                <p className="step-name">{step.name}</p>
                <small className="step-duration" style={{ color: colors.text }}>
                  {step.durationMs} ms
                </small>
              </div>
              {!isLast && (
                <div className="step-connector" aria-hidden="true">
                  <div className="step-connector__line" />
                  {isRunning && <div className="step-connector__dot" />}
                  <div className="step-connector__arrow">›</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom: data table + success chart */}
      <div className="canvas-bottom">
        <div className="data-table">
          <div className="table-head">
            <h3>Data Records</h3>
            <div className="table-filters">
              <input type="text" defaultValue="Search users…" aria-label="Search" readOnly />
              <input type="text" defaultValue="Last 24h" aria-label="Date range" readOnly />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Usage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={`${row.user}-${i}`} className="table-row--hoverable">
                  <td style={{ fontWeight: 600, color: 'var(--text-0)' }}>{row.user}</td>
                  <td style={{ color: 'var(--text-1)' }}>{row.plan}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '48px',
                        height: '4px',
                        borderRadius: '3px',
                        background: 'rgba(100,116,139,0.25)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${row.usage}%`,
                          height: '100%',
                          borderRadius: '3px',
                          background: row.usage > 80
                            ? 'linear-gradient(90deg, #fb7185, #f43f5e)'
                            : 'linear-gradient(90deg, #78c0ff, #6d7dff)',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: row.usage > 80 ? '#fb7185' : 'var(--text-1)' }}>
                        {row.usage}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-chip status-chip--${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="success-chart">
          <h3>Success Rate</h3>
          <div className="success-chart__bars">
            {successSeries.map(point => (
              <div key={point.label} className="bar-wrap">
                <div
                  className="bar"
                  style={{ height: `${(point.value / maxSuccessValue) * 100}%` }}
                  title={`${point.value}%`}
                />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
