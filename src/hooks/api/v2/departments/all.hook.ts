'use client';

import { useCallback, useState } from 'react';
import { Department } from './types';


/**
 * Hook untuk mengambil daftar departemen
 * @param initialPage - Halaman awal untuk pagination
 * @param initialLimit - Jumlah item per halaman
 * @returns Object dengan data departemen, loading state, error, dan fungsi untuk mengambil data
 */
export const useAllDepartments = (initialPage = 1, initialLimit = 10) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchDepartments = useCallback(async (
    page = 1, 
    limit = 10, 
    filters?: { 
      search?: string;
      isActive?: boolean;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters?.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive.toString());
      }
      
      // API v2 tidak menghandle query params, jadi kita tidak mengirimkannya
      const response = await fetch(`/api/v2/departments`);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Error fetching departments: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDepartments(data.departments || []);
      setTotal(data.meta?.total || data.departments?.length || 0);
      setPage(page);
      setLimit(limit);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    departments,
    loading,
    error,
    page,
    limit,
    total,
    fetchDepartments,
    setPage,
    setLimit,
  };
};