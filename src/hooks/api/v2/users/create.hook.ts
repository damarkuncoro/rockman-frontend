import { useCallback, useState } from 'react';
import { useMutation } from '@/lib/useMutation';

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
  const mutation = useMutation<any, CreateUserData>(
    '/api/v2/users',
    'POST'
  );

  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      const result = await mutation.mutate(userData);
      return result || null;
    } catch (err) {
      return null;
    }
  }, []);

  return {
    createUser,
    loading: mutation.loading,
    error: mutation.error,
  };
};