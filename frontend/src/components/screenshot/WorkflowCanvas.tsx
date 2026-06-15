import type { SuccessPoint, UserRecord, Workflow } from '../../types/dashboard';

interface WorkflowCanvasProps {
  workflows: Workflow[];
  selectedWorkflowId: string;
  onSelectWorkflow: (id: string) => void;
  successSeries: SuccessPoint[];
  tableRows: UserRecord[];
}

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
        <h2>Workflow Graph</h2>
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

      <div className="workflow-steps" role="list">
        {activeWorkflow.steps.map((step, index) => (
          <div key={step.id} className="workflow-step" role="listitem">
            <span className={`step-dot step-dot--${step.status.toLowerCase()}`} />
            <p>{step.name}</p>
            <small>{step.durationMs} ms</small>
            {index < activeWorkflow.steps.length - 1 ? <span className="step-link" /> : null}
          </div>
        ))}
      </div>

      <div className="canvas-bottom">
        <div className="data-table">
          <div className="table-head">
            <h3>Data Records</h3>
            <div className="table-filters">
              <input type="text" value="Search users" readOnly aria-label="Search" />
              <input type="text" value="Last 24h" readOnly aria-label="Date range" />
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
              {tableRows.map(row => (
                <tr key={`${row.user}-${row.plan}`}>
                  <td>{row.user}</td>
                  <td>{row.plan}</td>
                  <td>{row.usage}%</td>
                  <td>{row.status}</td>
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
