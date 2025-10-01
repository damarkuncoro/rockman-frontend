import { useCallback, useState } from 'react';
 
/**
 * Interface untuk data alamat user
 */
interface UserAddress {
  id: number;
  userId: number;
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil alamat pengguna berdasarkan ID
 * @param userId - ID pengguna yang akan diambil alamatnya
 * @returns Object dengan data alamat, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserAddresses = (userId?: string) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserAddresses = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/addresses`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user addresses: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAddresses(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    addresses,
    loading,
    error,
    fetchUserAddresses,
  };
};