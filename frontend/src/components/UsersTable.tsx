import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import type { User } from '../hooks/useUsers';
import { sortData } from '../utils/tableUtils';
import type { SortConfig } from '../utils/tableUtils';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error?: string | null;
  onRefetch?: () => void;
  onRowClick?: (userId: number) => void;
}

const getStatusChip = (status: string): 'active' | 'inactive' | 'pending' => {
  if (status === 'active') return 'active';
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
      return <span style={{ color: 'var(--text-2)', marginLeft: '4px' }}>⇅</span>;
    }
    return <span style={{ color: 'var(--primary-bright)', marginLeft: '4px' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
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
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>No users found</p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search or filters</p>
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
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--text-2)',
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
                <td style={{ padding: '8px 12px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-0)', fontSize: '0.72rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.67rem', color: 'var(--text-2)', marginTop: '2px' }}>{user.email}</div>
                  </div>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <StatusChip status="pending" label={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} />
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ flex: 1, maxWidth: '80px', height: '4px', borderRadius: '3px', background: 'rgba(100,116,139,0.25)', overflow: 'hidden' }}>
                      <div style={{ width: `${user.usage_percent}%`, height: '100%', borderRadius: '3px', background: 'var(--primary-bright)' }} />
                    </div>
                    <span style={{ fontSize: '0.67rem', color: 'var(--text-2)' }}>{user.usage_percent}%</span>
                  </div>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <StatusChip status={getStatusChip(user.status)} label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
