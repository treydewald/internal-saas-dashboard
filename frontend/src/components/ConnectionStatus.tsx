import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isConnecting, error, reconnect } = useWebSocket();

  const state = error ? 'error' : isConnecting ? 'connecting' : isConnected ? 'connected' : 'offline';

  const dotOverride: React.CSSProperties = state === 'connecting'
    ? { background: 'var(--warn)', animation: 'statusPulse 1.4s ease-in-out infinite' }
    : state === 'error'
    ? { background: 'var(--danger)', animation: 'none' }
    : state === 'offline'
    ? { background: '#64748B', animation: 'none' }
    : {};

  const badgeOverride: React.CSSProperties = state === 'connecting'
    ? { color: 'var(--warn)', borderColor: 'rgba(250,204,21,0.30)', background: 'rgba(250,204,21,0.10)' }
    : state === 'error'
    ? { color: 'var(--danger)', borderColor: 'rgba(251,113,133,0.30)', background: 'rgba(251,113,133,0.10)' }
    : state === 'offline'
    ? { color: '#64748B', borderColor: 'rgba(100,116,139,0.22)', background: 'rgba(100,116,139,0.08)' }
    : {};

  const label = { connected: 'Live', connecting: 'Connecting', error: 'Error', offline: 'Offline' }[state];

  return (
    <div className="live-badge live-badge--sm" style={badgeOverride}>
      <span className="live-badge__dot" style={dotOverride} />
      <span className="connection-status__text">{label}</span>
      {state === 'error' && (
        <button onClick={reconnect} className="btn btn--ghost" style={{ fontSize: '10px', padding: '2px 6px', marginLeft: '2px' }}>↻</button>
      )}
    </div>
  );
};
