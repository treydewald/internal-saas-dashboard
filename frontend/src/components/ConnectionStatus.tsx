import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isConnecting, error, reconnect } = useWebSocket();

  if (!isConnected && !isConnecting && !error) {
    return null;
  }

  const getStatusColor = () => {
    if (error) return '#EF4444'; // red
    if (isConnecting) return '#FACC15'; // yellow
    if (isConnected) return '#22C55E'; // green
    return '#6B7280'; // gray
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Real-time Connected';
    return 'Disconnected';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: '#F3F4F6',
        fontSize: '12px',
        fontWeight: '500',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          animation: isConnecting ? 'pulse 2s infinite' : 'none',
        }}
      />
      <span style={{ color: '#374151' }}>{getStatusText()}</span>
      {error && (
        <button
          onClick={reconnect}
          style={{
            marginLeft: '8px',
            padding: '4px 8px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
          }}
        >
          Reconnect
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};
