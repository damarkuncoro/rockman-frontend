'use client';

import { useEffect } from 'react';
import { useAllDepartments } from '@/hooks/api/v2/departments';

export function useDepartments() {
  const { departments, loading, error, fetchDepartments } = useAllDepartments();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    isLoading: loading,
    error,
    refetch: fetchDepartments,
  };
}