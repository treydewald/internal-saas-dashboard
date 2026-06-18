import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationsResponse {
  organizations: Organization[];
  total_count: number;
}

export interface UserOrg {
  id: number;
  user_id: number;
  organization_id: number;
  role: 'admin' | 'member' | 'viewer';
  is_active: boolean;
  created_at: string;
}

export const useOrganization = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<OrganizationsResponse>('/api/organizations');

      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.statusText}`);
      }

      const data = response.data;
      setOrganizations(data.organizations);
      setTotalCount(data.total_count);

      // Set first org as default
      if (data.organizations.length > 0) {
        setCurrentOrg(data.organizations[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
      setOrganizations([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const createOrganization = useCallback(
    async (name: string, slug: string, description?: string) => {
      setError(null);
      try {
        const response = await api.post<Organization>('/api/organizations', {
          name,
          slug,
          description,
        });

        if (!response.ok) {
          throw new Error(`Failed to create organization: ${response.statusText}`);
        }

        const data = response.data;
        setOrganizations([...organizations, data]);
        setTotalCount(totalCount + 1);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create organization';
        setError(errorMsg);
        throw err;
      }
    },
    [organizations, totalCount],
  );

  const updateOrganization = useCallback(
    async (orgId: number, updates: Partial<Organization>) => {
      setError(null);
      try {
        const response = await api.put<Organization>(`/api/organizations/${orgId}`, updates);

        if (!response.ok) {
          throw new Error(`Failed to update organization: ${response.statusText}`);
        }

        const data = response.data;
        setOrganizations(organizations.map(org => (org.id === orgId ? data : org)));
        if (currentOrg?.id === orgId) {
          setCurrentOrg(data);
        }
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update organization';
        setError(errorMsg);
        throw err;
      }
    },
    [organizations, currentOrg],
  );

  const switchOrganization = useCallback((orgId: number) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
    }
  }, [organizations]);

  return {
    organizations,
    currentOrg,
    totalCount,
    loading,
    error,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    switchOrganization,
  };
};
