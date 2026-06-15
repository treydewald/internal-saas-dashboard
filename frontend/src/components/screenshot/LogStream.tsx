import type { LogEntry } from '../../types/dashboard';

interface LogStreamProps {
  logs: LogEntry[];
}

export function LogStream({ logs }: LogStreamProps) {
  return (
    <section className="log-stream glass-panel" aria-label="Execution log stream">
      <header className="panel-header">
        <h2>Execution Log Stream</h2>
        <span className="status status--running">RUNNING</span>
      </header>
      <div className="log-stream__list">
        {logs.slice(0, 10).map(log => (
          <article key={log.id} className="log-row">
            <span className="log-row__time">{log.timestamp}</span>
            <span className={`log-row__level log-row__level--${log.level.toLowerCase()}`}>{log.level}</span>
            <span className="log-row__source">{log.source}</span>
            <p className="log-row__message">{log.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
