import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import ExportButton from '../components/ExportButton';
import { useFilters } from '../hooks/useFilters';
import UserDetailModal from '../components/UserDetailModal';

export const UsersPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, updateFilter, clearFilters } = useFilters();
  const { users, loading, error, currentPage, totalPages, limit, onPageChange, refetch } =
    useUsers({
      search: filters.search,
      plan: filters.plan,
      status: filters.status,
      limit: 20,
    });

  const handleRowClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleModalSave = () => {
    refetch();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage and view all system users</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onSearch={(search) => {
          updateFilter('search', search);
        }}
        onPlanChange={(plan) => {
          updateFilter('plan', plan);
        }}
        onStatusChange={(status) => {
          updateFilter('status', status);
        }}
        onClearFilters={clearFilters}
        searchValue={filters.search}
        planValue={filters.plan}
        statusValue={filters.status}
      />

      {/* Users Table with Export */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <ExportButton exportType="users" label="Export Users" />
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <UsersTable
            users={users}
            loading={loading}
            error={error}
            onRefetch={refetch}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

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
