import { useCallback, useState } from 'react';
import { useAllUsers as useAllUsersV2 } from './all.hook.v2';

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
  departmentId?: string | null;
  primaryDepartmentId?: string | null;
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
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Gunakan versi v2 berbasis useFetch sebagai sumber data kanonik
  const { data, loading, error, refetch } = useAllUsersV2();

  const users = (data?.data || []) as User[];
  const total = users.length;

  const fetchUsers = useCallback(async (
    _page = 1,
    _limit = 10,
    _filters?: { status?: string; role?: string; search?: string }
  ) => {
    // Simpan state pagination lokal untuk kompatibilitas API lama
    setPage(_page);
    setLimit(_limit);
    await refetch();
    return { message: 'refetched', data } as any;
  }, [refetch, data]);

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