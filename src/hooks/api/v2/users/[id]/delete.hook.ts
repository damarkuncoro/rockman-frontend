'use client';

import { useState } from 'react';
import { API_URL } from '@/config/api';

/**
 * Hook untuk menghapus user
 * @param id - ID user yang akan dihapus (opsional, jika tidak disediakan harus diberikan saat memanggil deleteUser)
 * @returns Object yang berisi fungsi deleteUser, loading state, dan error state
 */
export const useDeleteUser = (id?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fungsi untuk menghapus user
   * @param userId - ID user yang akan dihapus (jika tidak disediakan saat inisialisasi hook)
   * @returns Promise yang berisi response dari API
   */
  const deleteUser = async (userId?: string) => {
    const targetId = id || userId;
    
    if (!targetId) {
      throw new Error('User ID is required');
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/v2/users/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }

      setLoading(false);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  return { deleteUser, loading, error };
};