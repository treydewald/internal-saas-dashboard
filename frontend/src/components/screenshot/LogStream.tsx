import type { LogEntry } from '../../types/dashboard';

interface LogStreamProps {
  logs: LogEntry[];
}

const LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  INFO:    { color: '#78c0ff', bg: 'rgba(120,192,255,0.08)', border: 'rgba(120,192,255,0.15)' },
  SUCCESS: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.15)'  },
  WARN:    { color: '#facc15', bg: 'rgba(250,204,21,0.08)',  border: 'rgba(250,204,21,0.15)'  },
  ERROR:   { color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.15)' },
};

export function LogStream({ logs }: LogStreamProps) {
  return (
    <section className="log-stream glass-panel" aria-label="Execution log stream">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Real-Time Feed</p>
          <h2>Execution Log Stream</h2>
        </div>
        <span className="live-badge">
          <span className="live-badge__dot" aria-hidden="true" />
          LIVE
        </span>
      </header>
      <div className="log-stream__list">
        {logs.slice(0, 12).map((log, i) => {
          const cfg = LEVEL_CONFIG[log.level] ?? LEVEL_CONFIG.INFO;
          const isEven = i % 2 === 1;
          return (
            <article
              key={log.id}
              className="log-row log-row--hoverable"
              style={{
                background: isEven
                  ? 'rgba(255,255,255,0.015)'
                  : 'transparent',
              }}
            >
              <span className="log-row__time">{log.timestamp}</span>
              <span
                className="log-row__level"
                style={{
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '999px',
                  padding: '1px 7px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                {log.level}
              </span>
              <span className="log-row__source">{log.source}</span>
              <p className="log-row__message">{log.message}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
