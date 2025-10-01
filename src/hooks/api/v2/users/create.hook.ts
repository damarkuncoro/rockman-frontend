import { useCallback, useState } from 'react';

/**
 * Interface untuk data pengguna baru
 */
interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  department?: string;
  region?: string;
  level?: number;
  active?: boolean;
}

/**
 * Hook untuk membuat pengguna baru
 * @returns Object dengan fungsi createUser, loading state, dan error
 */
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = useCallback(async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser,
    loading,
    error,
  };
};