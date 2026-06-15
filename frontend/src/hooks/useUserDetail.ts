import { useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.error || err.message
            : 'Failed to fetch user details'
        );
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
      const response = await axios.put(`/api/users/${userId}`, updatedUser);
      setUser(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { user, loading, error, updateUser };
};
