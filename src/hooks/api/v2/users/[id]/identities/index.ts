import { useCallback, useState } from 'react';

/**
 * Interface untuk data identitas pengguna
 */
interface UserIdentity {
  id: string;
  userId: string;
  identityType: string;
  identityNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil identitas pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil identitasnya
 * @returns Object dengan data identitas, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserIdentities = (userId?: string) => {
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserIdentities = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/identities`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user identities: ${response.statusText}`);
      }
      
      const data = await response.json();
      setIdentities(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    identities,
    loading,
    error,
    fetchUserIdentities,
  };
};