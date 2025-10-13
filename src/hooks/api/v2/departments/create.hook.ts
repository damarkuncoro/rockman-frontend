'use client';

import { useState } from 'react';
import { Department, CreateDepartmentData } from './types';
import { useMutation } from '@/lib/useMutation';


/**
 * Hook untuk membuat departemen baru
 * @returns Object dengan fungsi untuk membuat departemen, loading state, dan error
 */
export const useCreateDepartment = () => {
  const mutation = useMutation<Department, CreateDepartmentData>(
    '/api/v2/departments',
    'POST'
  );

  const createDepartment = async (data: CreateDepartmentData): Promise<Department | null> => {
    try {
      const result = await mutation.mutate(data);
      return result || null;
    } catch (err) {
      return null;
    }
  };

  return {
    createDepartment,
    loading: mutation.loading,
    error: mutation.error,
  };
};