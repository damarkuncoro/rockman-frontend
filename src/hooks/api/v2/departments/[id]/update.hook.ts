'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { Department } from '../types';

/**
 * Hook untuk mengupdate department berdasarkan ID
 * @param id - ID department yang akan diupdate
 * @returns Object yang berisi fungsi updateDepartment dan status loading/error
 */
export function useUpdateDepartment(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();

  /**
   * Mengupdate department berdasarkan ID
   * @param departmentData - Data department yang akan diupdate
   * @returns Promise yang menyelesaikan dengan data department yang telah diupdate
   */
  const updateDepartment = async (departmentData: Partial<Department>): Promise<Department | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v2/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate department');
      }

      const updatedDepartment = await response.json();

      // Invalidate cache untuk memperbarui data
      mutate('/api/v2/departments');
      mutate(`/api/v2/departments/${id}`);
      
      return updatedDepartment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengupdate department'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateDepartment,
    isLoading,
    error,
  };
}