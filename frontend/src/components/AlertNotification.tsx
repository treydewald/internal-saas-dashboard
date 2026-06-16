import React, { useEffect } from 'react';

interface AlertNotificationProps {
  alert: {
    id: number;
    message: string;
    status: string;
  };
  onClose: () => void;
  duration?: number;
}

const getAlertStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case 'triggered':
      return {
        backgroundColor: 'var(--accent-error-dim)',
        border: '1px solid rgba(220,38,38,0.3)',
        color: 'var(--accent-error)',
      };
    case 'acknowledged':
      return {
        backgroundColor: 'rgba(234,179,8,0.1)',
        border: '1px solid rgba(234,179,8,0.3)',
        color: 'var(--accent-warning)',
      };
    case 'resolved':
      return {
        backgroundColor: 'var(--accent-success-dim)',
        border: '1px solid rgba(22,163,74,0.3)',
        color: 'var(--accent-success)',
      };
    default:
      return {
        backgroundColor: 'var(--layer-2)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-secondary)',
      };
  }
};

const getIcon = (status: string) => {
  switch (status) {
    case 'triggered': return '⚠️';
    case 'acknowledged': return '👁️';
    case 'resolved': return '✓';
    default: return 'ℹ️';
  }
};

export default function AlertNotification({ alert, onClose, duration = 5000 }: AlertNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '360px',
        zIndex: 1100,
        boxShadow: 'var(--shadow-card)',
        ...getAlertStyle(alert.status),
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: 1, marginTop: '1px' }}>{getIcon(alert.status)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{alert.message}</p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          color: 'inherit',
          opacity: 0.6,
          padding: '2px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
      >
        ✕
      </button>
    </div>
  );
}
