import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import type { User } from '../hooks/useUsers';
import { sortData } from '../utils/tableUtils';
import type { SortConfig } from '../utils/tableUtils';

const AVATAR_COLORS = [
  { bg: 'rgba(37,99,235,0.12)', color: '#2563EB' },
  { bg: 'rgba(22,163,74,0.12)', color: '#16A34A' },
  { bg: 'rgba(124,58,237,0.12)', color: '#7C3AED' },
  { bg: 'rgba(220,38,38,0.12)', color: '#DC2626' },
  { bg: 'rgba(217,119,6,0.12)', color: '#D97706' },
  { bg: 'rgba(6,182,212,0.12)', color: '#0891B2' },
];

const PLAN_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  enterprise: { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED', border: 'rgba(124,58,237,0.2)' },
  pro: { bg: 'rgba(37,99,235,0.08)', color: '#2563EB', border: 'rgba(37,99,235,0.18)' },
  free: { bg: 'rgba(100,116,139,0.08)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' },
};

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error?: string | null;
  onRefetch?: () => void;
  onRowClick?: (userId: number) => void;
}

const getStatusChip = (status: string): 'healthy' | 'inactive' | 'pending' => {
  if (status === 'active') return 'healthy';
  if (status === 'pending') return 'pending';
  return 'inactive';
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  onRefetch,
  onRowClick,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ column, direction });
  };

  const sortedUsers = sortData(users, sortConfig);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.column !== column) {
      return <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>⇅</span>;
    }
    return <span style={{ color: 'var(--accent-primary)', marginLeft: '4px' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-error)', marginBottom: '12px' }}>{error}</p>
        {onRefetch && (
          <button
            onClick={onRefetch}
            style={{
              padding: '6px 12px',
              background: 'var(--accent-error)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: '28px', background: 'rgba(148,163,184,0.1)', borderRadius: 'var(--radius-sm)', animation: 'live-breathe 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>No users found</p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '4px' }}>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Name', 'Plan', 'Usage', 'Status'].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col.toLowerCase())}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {col} <SortIcon column={col.toLowerCase()} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, idx) => (
              <tr
                key={user.id}
                className="table-row--hoverable"
                onClick={() => onRowClick?.(user.id)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: AVATAR_COLORS[idx % AVATAR_COLORS.length].bg,
                      color: AVATAR_COLORS[idx % AVATAR_COLORS.length].color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em',
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '1px' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {(() => {
                    const ps = PLAN_STYLES[user.plan] || PLAN_STYLES.free;
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    );
                  })()}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, maxWidth: '80px', height: '5px', borderRadius: '3px', background: 'var(--border-default)', overflow: 'hidden' }}>
                      <div style={{ width: `${user.usage_percent}%`, height: '100%', borderRadius: '3px', background: user.usage_percent > 80 ? '#DC2626' : user.usage_percent > 60 ? '#D97706' : 'var(--accent-primary)' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', minWidth: '32px' }}>{user.usage_percent}%</span>
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <StatusChip state={getStatusChip(user.status)} label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
