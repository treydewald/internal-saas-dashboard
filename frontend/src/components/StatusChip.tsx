import React from 'react';

export interface StatusChipProps {
  status: 'healthy' | 'running' | 'active' | 'degraded' | 'warning' | 'warn' |
          'error' | 'off' | 'inactive' | 'pending' | 'trial' |
          'info' | 'sky' | 'purple' |
          'get' | 'post' | 'put' | 'patch' | 'delete' | string;
  label?: string;
  pulse?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, pulse }) => {
  return (
    <span
      className={`status-chip status-chip--${status.toLowerCase()}`}
      style={pulse ? { animation: 'statusGlow 2.5s ease-in-out infinite' } : undefined}
    >
      {label || status}
    </span>
  );
};
