'use client';

import { useCallback, useState } from 'react';
import { Department } from '../../../departments/types';

/**
 * Hook untuk mengambil departemen yang dimiliki oleh user tertentu
 * @param userId - ID user yang akan diambil departemennya
 * @returns Object dengan data departemen, loading state, error, dan fungsi untuk mengambil data
 */
export const useUserDepartments = (userId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserDepartments = useCallback(async (id?: string) => {
    if (!id && !userId) {
      setError(new Error('User ID is required'));
      return null;
    }

    const targetId = id || userId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/users/${targetId}/departments`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user departments: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched user departments:', data);
      setDepartments(data.data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    departments,
    loading,
    error,
    fetchUserDepartments,
  };
};