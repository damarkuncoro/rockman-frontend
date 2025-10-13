'use client';

import { useCallback, useState } from 'react';
import { Department } from '../../../departments/types';
import { useFetch } from '@/lib/useFetch';

/**
 * Hook untuk mengambil departemen yang dimiliki oleh user tertentu
 * @param userId - ID user yang akan diambil departemennya
 * @returns Object dengan data departemen, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserDepartments = (userId?: string) => {
  const [currentId, setCurrentId] = useState<string>(userId || '');

  const url = `/api/v2/users/${currentId}/departments`;

  const { data, loading, error, refetch } = useFetch<{ message: string; data: Department[] }>(url, {
    immediate: Boolean(userId),
    useCache: true,
    cacheMaxAge: 300000,
  });

  const fetchUserDepartments = useCallback(async (id?: string) => {
    const targetId = id || userId || '';
    if (!targetId) {
      throw new Error('User ID is required');
    }
    setCurrentId(targetId);
    await refetch();
  }, [userId, refetch]);

  return {
    departments: data?.data || [],
    loading,
    error,
    fetchUserDepartments,
  };
};