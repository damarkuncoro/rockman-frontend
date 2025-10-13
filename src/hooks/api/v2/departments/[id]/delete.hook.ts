'use client';

import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/useMutation';
import { cache } from '@/lib/cache';

/**
 * Hook untuk menghapus department berdasarkan ID
 * @param id - ID department yang akan dihapus
 * @returns Object yang berisi fungsi deleteDepartment dan status loading/error
 */
export function useDeleteDepartment(id: string) {
  const { mutate: swrMutate } = useSWRConfig();

  // Gunakan useMutation untuk konsistensi auth dan error handling
  const { mutate, loading, error, data } = useMutation<{ message: string }, unknown>(
    `/api/v2/departments/${id}`,
    'DELETE'
  );

  /**
   * Menghapus department berdasarkan ID
   * @returns Promise yang menyelesaikan ketika department berhasil dihapus
   */
  const deleteDepartment = async (): Promise<void> => {
    await mutate(undefined as unknown);

    // Invalidate cache untuk memperbarui data pada consumer berbasis useFetch
    cache.clear('/api/v2/departments');
    cache.clear(`/api/v2/departments/${id}`);

    // Back-compat: invalidate SWR key jika ada consumer lama
    swrMutate('/api/v2/departments');
    swrMutate(`/api/v2/departments/${id}`);
  };

  return {
    deleteDepartment,
    isLoading: loading,
    error,
    response: data,
  };
}