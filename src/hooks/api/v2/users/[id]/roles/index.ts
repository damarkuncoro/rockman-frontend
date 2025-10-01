import { useCallback, useState } from 'react';

/**
 * Interface untuk data peran pengguna
 */
interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil peran pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil perannya
 * @returns Object dengan data peran, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserRoles = (userId?: string) => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserRoles = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/roles`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user roles: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRoles(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    roles,
    loading,
    error,
    fetchUserRoles,
  };
};