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
 * Hook untuk mengambil daftar pengguna
 * @param initialPage - Halaman awal untuk pagination
 * @param initialLimit - Jumlah item per halaman
 * @returns Object dengan data pengguna, loading state, error, dan fungsi untuk mengambil data
 */
export const useAllUsers = (initialPage = 1, initialLimit = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      role?: string;
      search?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      if (filters?.status) {
        queryParams.append('status', filters.status);
      }

      if (filters?.role) {
        queryParams.append('role', filters.role);
      }

      if (filters?.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/v2/users`);
      console.log(response)


      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("data.data", data.data)

      setUsers(data.data || []);
      setTotal(data.data?.length || 0);
      setPage(page);
      setLimit(limit);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    page,
    limit,
    total,
    fetchUsers,
    setPage,
    setLimit,
  };
};