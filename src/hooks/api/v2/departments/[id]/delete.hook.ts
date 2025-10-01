'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';

/**
 * Hook untuk menghapus department berdasarkan ID
 * @param id - ID department yang akan dihapus
 * @returns Object yang berisi fungsi deleteDepartment dan status loading/error
 */
export function useDeleteDepartment(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();

  /**
   * Menghapus department berdasarkan ID
   * @returns Promise yang menyelesaikan ketika department berhasil dihapus
   */
  const deleteDepartment = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v2/departments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus department');
      }

      // Invalidate cache untuk memperbarui data
      mutate('/api/v2/departments');
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat menghapus department'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteDepartment,
    isLoading,
    error,
  };
}