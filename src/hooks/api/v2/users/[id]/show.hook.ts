import { useCallback, useState } from 'react';

/**
 * Interface untuk data pengguna
 */
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  active: boolean;
  rolesUpdatedAt: string | null;
  departmentId: string | null;
  region: string | null;
  level: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Hook untuk mengambil detail pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil detailnya
 * @returns Object dengan data pengguna, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserDetail = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserDetail = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUser(data.data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    fetchUserDetail,
  };
};