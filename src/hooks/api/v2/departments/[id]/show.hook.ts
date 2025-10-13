'use client';

import { useCallback, useState } from 'react';
import { Department } from '../types';
import { buildAuthHeaders } from '@/hooks/common/authHeaders';


/**
 * Hook untuk mengambil detail departemen berdasarkan ID
 * @param departmentId - ID departemen yang akan diambil detailnya
 * @returns Object dengan data departemen, loading state, error, dan fungsi untuk mengambil data
 */
export const useDepartmentDetail = (departmentId?: string) => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartmentDetail = useCallback(async (id?: string) => {
    if (!id && !departmentId) {
      setError(new Error('Department ID is required'));
      return null;
    }

    const targetId = id || departmentId;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/departments/${targetId}`, {
        headers: await buildAuthHeaders({ 'Content-Type': 'application/json' }),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching department: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDepartment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  return {
    department,
    loading,
    error,
    fetchDepartmentDetail,
  };
};