'use client';

import { useState } from 'react';
import { cache } from '@/lib/cache';

/**
 * Interface untuk data sesi pengguna
 */
interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

/**
 * Hook untuk mengambil dan mengelola sesi pengguna dari API
 * @returns {Object} Objek yang berisi sesi, loading state, error, dan fungsi untuk mengelola sesi
 */
export const useUserSessions = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const CACHE_MAX_AGE = 300000; // 5 menit

  /**
   * Fungsi untuk mengambil sesi pengguna dari API
   * @param {string} userId - ID pengguna
   */
  const fetchUserSessions = async (userId: string) => {
    try {
      setError(null);

      const url = `/api/v2/users/${userId}/sessions`;

      // Tampilkan data cache terlebih dahulu jika tersedia agar UI langsung terisi
      const cached = cache.get<{ message?: string; data: UserSession[] }>(url, CACHE_MAX_AGE);
      if (cached && Array.isArray(cached.data)) {
        setSessions(cached.data);
      }

      setLoading(true);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const nextSessions: UserSession[] = Array.isArray(data?.data) ? data.data : [];
      setSessions(nextSessions);

      // Simpan ke cache agar navigasi berikutnya langsung menampilkan data tanpa reload
      cache.set(url, { message: data?.message, data: nextSessions });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengambil sesi pengguna'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mengakhiri sesi pengguna
   * @param {string} userId - ID pengguna
   * @param {string} sessionId - ID sesi yang akan diakhiri
   */
  const terminateSession = async (userId: string, sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/v2/users/${userId}/sessions/${sessionId}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSessions(prev => {
        const updated = prev.filter(session => session.id !== sessionId);
        // Update cache list untuk endpoint list
        const listUrl = `/api/v2/users/${userId}/sessions`;
        cache.set(listUrl, { data: updated });
        return updated;
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengakhiri sesi'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mengakhiri semua sesi pengguna kecuali sesi saat ini
   * @param {string} userId - ID pengguna
   * @param {string} currentSessionId - ID sesi saat ini yang tidak akan diakhiri
   */
  const terminateAllOtherSessions = async (userId: string, currentSessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/v2/users/${userId}/sessions/terminate-all`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excludeSessionId: currentSessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSessions(prev => {
        const updated = prev.filter(session => session.id === currentSessionId);
        // Update cache list untuk endpoint list
        const listUrl = `/api/v2/users/${userId}/sessions`;
        cache.set(listUrl, { data: updated });
        return updated;
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengakhiri semua sesi'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    loading,
    error,
    fetchUserSessions,
    terminateSession,
    terminateAllOtherSessions
  };
};