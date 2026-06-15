import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isConnecting, error, reconnect } = useWebSocket();

  if (!isConnected && !isConnecting && !error) {
    return null;
  }

  const getStatusColor = () => {
    if (error) return '#EF4444';
    if (isConnecting) return '#FACC15';
    if (isConnected) return '#22C55E';
    return '#6B7280';
  };

  const getGlowColor = () => {
    if (error) return 'rgba(239,68,68,0.6)';
    if (isConnecting) return 'rgba(250,204,21,0.6)';
    if (isConnected) return 'rgba(34,197,94,0.6)';
    return 'transparent';
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Live';
    return 'Disconnected';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '5px 12px',
        borderRadius: '20px',
        backgroundColor: 'rgba(15,23,42,0.7)',
        border: `1px solid ${getStatusColor()}40`,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          boxShadow: isConnected || isConnecting
            ? `0 0 0 2px ${getGlowColor()}, 0 0 8px ${getGlowColor()}`
            : 'none',
          animation: isConnecting
            ? 'statusPulse 1.4s ease-in-out infinite'
            : isConnected
            ? 'statusGlow 2.5s ease-in-out infinite'
            : 'none',
        }}
      />
      <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
      {error && (
        <button
          onClick={reconnect}
          style={{
            marginLeft: '6px',
            padding: '3px 8px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
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
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes statusGlow {
          0%, 100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.4), 0 0 6px rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2), 0 0 12px rgba(34,197,94,0.6); }
        }
      `}</style>
    </div>
  );
};
