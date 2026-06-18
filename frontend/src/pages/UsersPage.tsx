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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Users size={14} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
              User Management
            </p>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Users</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage accounts, plans, and access across your organization
          </p>
        </div>
        <ExportButton exportType="users" label="Export Users" />
      </div>

      {/* Filter Bar */}
      <div style={{ flex: '0 0 auto', marginBottom: '12px' }}>
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
      </div>

      {/* Users Table */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <UsersTable
          users={users}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <div style={{ flex: '0 0 auto', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            limit={limit}
          />
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};
