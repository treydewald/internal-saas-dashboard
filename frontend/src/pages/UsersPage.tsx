import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import ExportButton from '../components/ExportButton';
import { useFilters } from '../hooks/useFilters';
import UserDetailModal from '../components/UserDetailModal';
import { Users } from 'lucide-react';

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
      {/* Hero Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Users size={14} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
              User Management
            </p>
          </div>
          <h1 style={{ margin: '0 0 4px 0' }}>Users</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
            Manage accounts, plans, and access across your organization
          </p>
        </div>
        <ExportButton exportType="users" label="Export Users" />
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

      {/* Users Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <UsersTable
          users={users}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onRowClick={handleRowClick}
        />
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
