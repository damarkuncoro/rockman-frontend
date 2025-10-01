'use client';

import { useCallback, useState } from 'react';

/**
 * Interface untuk data riwayat perubahan
 */
export interface ChangeHistory {
  id: string;
  userId: string;
  tableName: string;
  recordId: string;
  action: string;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  reason: string | null;
  createdAt: string;
}

/**
 * Hook untuk mengambil dan mengelola riwayat perubahan pengguna dari API
 * @returns {Object} Objek yang berisi riwayat perubahan, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserChangeHistory = () => {
  const [changeHistory, setChangeHistory] = useState<ChangeHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fungsi untuk mengambil riwayat perubahan pengguna dari API
   * @param {string} userId - ID pengguna
   */
  const fetchUserChangeHistory = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/change-history`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setChangeHistory(data.data || []);
      return data; // Mengembalikan data untuk digunakan langsung
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengambil riwayat perubahan'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mengambil riwayat perubahan berdasarkan ID
   * @param {string} userId - ID pengguna
   * @param {string} changeHistoryId - ID riwayat perubahan
   */
  const fetchChangeHistoryById = async (userId: string, changeHistoryId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/change-history/${changeHistoryId}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengambil detail riwayat perubahan'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    changeHistory,
    loading,
    error,
    fetchUserChangeHistory,
    fetchChangeHistoryById
  };
};