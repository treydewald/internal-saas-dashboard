import React, { useState } from 'react';
import type { User } from '../hooks/useUsers';
import { sortData } from '../utils/tableUtils';
import type { SortConfig } from '../utils/tableUtils';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  onRefetch,
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-slate-700 text-slate-200';
      case 'pro':
        return 'bg-blue-900 text-blue-200';
      case 'enterprise':
        return 'bg-amber-900 text-amber-200';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-900 text-green-200'
      : 'bg-red-900 text-red-200';
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.column !== column) {
      return <span className="text-slate-500 ml-1">⇅</span>;
    }
    return (
      <span className="text-cyan-400 ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const SkeletonRow = () => (
    <tr className="border-b border-slate-800 hover:bg-gray-900 transition-colors">
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-16 animate-pulse" /></td>
    </tr>
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-4">{error}</div>
        {onRefetch && (
          <button
            onClick={onRefetch}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-slate-700 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Plan</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Usage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-slate-400 text-lg">No users found</div>
        <div className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-900 border-b border-slate-700 sticky top-0">
          <tr>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('name')}
            >
              Name <SortIcon column="name" />
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('plan')}
            >
              Plan <SortIcon column="plan" />
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('usage_percent')}
            >
              Usage <SortIcon column="usage_percent" />
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('status')}
            >
              Status <SortIcon column="status" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-800 hover:bg-gray-900 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-slate-400">{user.email}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                    user.plan
                  )}`}
                >
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-xs bg-gray-900 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${user.usage_percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400">{user.usage_percent}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
