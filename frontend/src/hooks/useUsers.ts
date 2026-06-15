import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  usage_percent: number;
  status: 'active' | 'inactive';
  role?: string;
  created_at?: string;
}

export interface UsersResponse {
  users: User[];
  total_count: number;
}

interface UseUsersOptions {
  limit?: number;
  search?: string;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { limit = 20, search = '' } = options;
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (currentOffset: number, searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/api/users?${params}`);
      const data: UsersResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      setUsers(data.users);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    setOffset(0);
    fetchUsers(0, search);
  }, [search, fetchUsers]);

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    fetchUsers(newOffset, search);
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    users,
    totalCount,
    loading,
    error,
    offset,
    limit,
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    refetch: () => fetchUsers(offset, search),
  };
};
