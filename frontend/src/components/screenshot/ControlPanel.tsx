interface ControlPanelProps {
  onRun: () => void;
  onCreate: () => void;
  onEdit: () => void;
  isRunning: boolean;
}

export function ControlPanel({ onRun, onCreate, onEdit, isRunning }: ControlPanelProps) {
  return (
    <section className="control-panel glass-panel" aria-label="Workflow controls">
      <div>
        <h2>Workflow Controls</h2>
        <p>Run, create, and tune workflows without backend connectivity.</p>
      </div>
      <div className="control-panel__buttons">
        <button type="button" className="btn btn--primary" onClick={onRun}>
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCreate}>
          Create
        </button>
        <button type="button" className="btn btn--ghost" onClick={onEdit}>
          Edit
        </button>
      </div>
    </section>
  );
}
