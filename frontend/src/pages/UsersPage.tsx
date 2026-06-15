import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, loading, error, currentPage, totalPages, limit, onPageChange, refetch } =
    useUsers({ search: searchTerm, limit: 20 });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-slate-400 mt-1">Manage and view all system users</p>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar
          placeholder="Search users by name or email..."
          onSearch={setSearchTerm}
          debounceMs={300}
        />
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-slate-700 rounded-lg overflow-hidden">
        <UsersTable users={users} loading={loading} error={error} onRefetch={refetch} />
      </div>

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          limit={limit}
        />
      )}
    </div>
  );
};
