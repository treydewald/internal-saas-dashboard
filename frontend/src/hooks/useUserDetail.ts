import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface UserData {
  id: number;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
  role: string;
  usage_percent: number;
  created_at: string;
  last_login?: string;
}

interface UseUserDetailReturn {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  updateUser: (updatedUser: Partial<UserData>) => Promise<void>;
}

export const useUserDetail = (userId: number): UseUserDetailReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<UserData>(`/api/users/${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch user: ${response.statusText}`);
        setUser(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const updateUser = async (updatedUser: Partial<UserData>) => {
    try {
      setError(null);
      const response = await api.put<UserData>(`/api/users/${userId}`, updatedUser);
      if (!response.ok) throw new Error(`Failed to update user: ${response.statusText}`);
      setUser(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { user, loading, error, updateUser };
};
