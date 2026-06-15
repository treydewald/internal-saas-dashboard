import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface APIKey {
  id: number;
  user_id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface APIKeyWithSecret extends Omit<APIKey, 'id' | 'user_id' | 'is_active' | 'last_used_at' | 'created_at' | 'updated_at'> {
  key: string;
}

export interface APIKeysResponse {
  api_keys: APIKey[];
  total_count: number;
}

export const useAPIKeys = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<APIKeyWithSecret | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/api-keys');
      const data: APIKeysResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      setKeys(data.api_keys);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API keys');
      setKeys([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = useCallback(async (name: string) => {
    setError(null);
    try {
      const response = await api.post('/api/api-keys', { name });
      const data: APIKeyWithSecret = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      setCreatedKey(data);
      // Refetch to include the new key in the list
      await fetchKeys();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create API key';
      setError(errorMsg);
      throw err;
    }
  }, [fetchKeys]);

  const revokeKey = useCallback(async (keyId: number) => {
    setError(null);
    try {
      const response = await api.post(`/api/api-keys/${keyId}/revoke`, {});
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data as any);
      }

      // Update local state
      setKeys(keys.map(k => (k.id === keyId ? { ...k, is_active: false } : k)));
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to revoke API key';
      setError(errorMsg);
      throw err;
    }
  }, [keys]);

  const deleteKey = useCallback(async (keyId: number) => {
    setError(null);
    try {
      const response = await api.delete(`/api/api-keys/${keyId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data as any);
      }

      // Update local state
      setKeys(keys.filter(k => k.id !== keyId));
      setTotalCount(totalCount - 1);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete API key';
      setError(errorMsg);
      throw err;
    }
  }, [keys, totalCount]);

  const clearCreatedKey = useCallback(() => {
    setCreatedKey(null);
  }, []);

  return {
    keys,
    totalCount,
    loading,
    error,
    createdKey,
    createKey,
    revokeKey,
    deleteKey,
    refetch: fetchKeys,
    clearCreatedKey,
  };
};
