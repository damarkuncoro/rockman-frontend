'use client';

import { useState } from 'react';
import { Department, CreateDepartmentData } from './types';


/**
 * Hook untuk membuat departemen baru
 * @returns Object dengan fungsi untuk membuat departemen, loading state, dan error
 */
export const useCreateDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createDepartment = async (data: CreateDepartmentData): Promise<Department | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v2/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating department: ${response.statusText}`);
      }
      
      const createdDepartment = await response.json();
      return createdDepartment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDepartment,
    loading,
    error,
  };
};