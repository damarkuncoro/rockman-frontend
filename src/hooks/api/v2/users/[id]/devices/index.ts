import { useCallback, useState } from 'react';

/**
 * Interface untuk data perangkat pengguna
 */
interface UserDevice {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: string;
  deviceToken: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil perangkat pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil perangkatnya
 * @returns Object dengan data perangkat, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserDevices = (userId?: string) => {
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserDevices = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/devices`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user devices: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDevices(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    devices,
    loading,
    error,
    fetchUserDevices,
  };
};