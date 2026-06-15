interface ControlPanelProps {
  onRun: () => void;
  onCreate: () => void;
  onEdit: () => void;
  isRunning: boolean;
}

export function ControlPanel({ onRun, onCreate, onEdit, isRunning }: ControlPanelProps) {
  return (
    <section className="control-panel glass-panel" aria-label="Workflow controls">
      <div className="control-panel__info">
        <p className="eyebrow">Workflow Controls</p>
        <h2>Orchestration Engine</h2>
        <p className="control-panel__sub">Run, create, and tune workflows — no backend required.</p>
      </div>
      <div className="control-panel__buttons">
        <button
          type="button"
          className={`btn btn--primary${isRunning ? ' btn--active' : ''}`}
          onClick={onRun}
        >
          <span className="btn__icon" aria-hidden="true">{isRunning ? '⏸' : '▶'}</span>
          {isRunning ? 'Running…' : 'Run Workflow'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCreate}>
          <span className="btn__icon" aria-hidden="true">＋</span>
          Create
        </button>
        <button type="button" className="btn btn--ghost" onClick={onEdit}>
          <span className="btn__icon" aria-hidden="true">✎</span>
          Edit
        </button>
      </div>
    </section>
  );
}
