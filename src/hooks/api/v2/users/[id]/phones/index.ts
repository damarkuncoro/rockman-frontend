import { useCallback, useState } from 'react';

/**
 * Interface untuk data nomor telepon pengguna
 */
interface UserPhone {
  id: number;
  userId: number;
  label: string;
  phoneNumber: string;
  countryCode: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil nomor telepon pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil nomor teleponnya
 * @returns Object dengan data nomor telepon, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserPhones = (userId?: string) => {
  const [phones, setPhones] = useState<UserPhone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserPhones = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      
      const response = await fetch(`/api/v2/users/${targetId}/phones`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user phones: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPhones(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    phones,
    loading,
    error,
    fetchUserPhones,
  };
};