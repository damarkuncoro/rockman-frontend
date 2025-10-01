'use client';

import { useState } from 'react';
import { API_URL } from '@/config/api';

/**
 * Interface untuk data update pengguna
 */
interface UpdateUserData {
  name?: string;
  email?: string;
  department?: string;
  region?: string;
  level?: number;
  active?: boolean;
}

/**
 * Hook untuk mengupdate data user
 * @param id - ID user yang akan diupdate
 * @returns Object yang berisi fungsi updateUser, loading state, dan error state
 */
export const useUpdateUser = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fungsi untuk mengupdate data user
   * @param userData - Data user yang akan diupdate
   * @returns Promise yang berisi response dari API
   */
  const updateUser = async (userData: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/v2/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  return { updateUser, loading, error };
};