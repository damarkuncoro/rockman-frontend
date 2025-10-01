import { useCallback, useState } from 'react';

/**
 * Interface untuk data pengaturan pengguna
 */
interface UserSettings {
  id: number;
  userId: number;
  theme: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil pengaturan pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil pengaturannya
 * @returns Object dengan data pengaturan, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserSettings = (userId?: string) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserSettings = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/settings`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user settings: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSettings(data.data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    settings,
    loading,
    error,
    fetchUserSettings,
  };
};