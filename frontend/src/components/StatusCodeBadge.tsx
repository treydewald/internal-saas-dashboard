import React from 'react';
import { StatusChip, type StatusState } from './StatusChip';

interface StatusCodeBadgeProps {
  code: number;
}

export const StatusCodeBadge: React.FC<StatusCodeBadgeProps> = ({ code }) => {
  let state: StatusState = 'healthy';

  if (code >= 500) {
    state = 'error';
  } else if (code >= 400) {
    state = 'warning';
  } else if (code >= 300) {
    state = 'running';
  } else if (code >= 200) {
    state = 'healthy';
  }

  return <StatusChip state={state} label={String(code)} size="sm" />;
};
