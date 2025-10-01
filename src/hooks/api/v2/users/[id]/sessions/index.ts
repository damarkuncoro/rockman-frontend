'use client';

import { useState } from 'react';

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

  /**
   * Fungsi untuk mengambil sesi pengguna dari API
   * @param {string} userId - ID pengguna
   */
  const fetchUserSessions = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/sessions`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSessions(data.data || []);
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

      const response = await fetch(`/api/v2/users/${userId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSessions(prev => prev.filter(session => session.id !== sessionId));
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

      const response = await fetch(`/api/v2/users/${userId}/sessions/terminate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excludeSessionId: currentSessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSessions(prev => prev.filter(session => session.id === currentSessionId));
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