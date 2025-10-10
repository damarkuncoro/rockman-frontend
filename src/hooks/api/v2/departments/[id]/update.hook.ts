'use client';

import { useSWRConfig } from 'swr';
import { Department } from '../types';
import { useMutation } from '@/lib/useMutation';
import { useFetch } from '@/lib/useFetch';

/**
 * Fungsi untuk membersihkan cache localStorage terkait departemen
 * @param id - ID departemen yang akan dibersihkan cachenya
 */
function clearLocalStorageCache(id: string) {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('useFetchCache:') && 
         (key.includes('departments') || 
          key.includes('departements'))) {
        localStorage.removeItem(key);
        console.log('Menghapus cache:', key);
      }
    });
  } catch (error) {
    console.error('Error clearing localStorage cache:', error);
  }
}

/**
 * Fungsi untuk memperbarui cache SWR setelah update departemen
 * @param id - ID departemen yang diupdate
 * @param mutate - Fungsi mutate dari SWR
 */
function invalidateCache(id: string, mutate: (key: any, data?: any, opts?: any) => Promise<any>) {
  // API endpoints
  mutate('/api/v2/departments');
  mutate(`/api/v2/departments/${id}`);
  mutate(`/api/v2/departments/${id}/positions`);
  mutate(`/api/v2/departments/${id}/users`);
  
  // Frontend routes
  mutate('/departements');
  mutate(`/departements/${id}`);
  mutate(`/departements/${id}/edit`);
  
  // Global invalidation
  mutate((key: string) => typeof key === 'string' && key.includes('/api/v2/departments'), undefined, { revalidate: true });
  mutate((key: string) => typeof key === 'string' && key.includes('departements'), undefined, { revalidate: true });
  
  // Membersihkan localStorage
  clearLocalStorageCache(id);
}

/**
 * Fungsi untuk memuat ulang data departemen terbaru
 * @param id - ID departemen
 * @param mutate - Fungsi mutate dari SWR
 * @returns Data departemen terbaru
 */
async function refetchDepartmentData(id: string, mutate: (key: any, data?: any, opts?: any) => Promise<any>): Promise<Department> {
  try {
    const response = await fetch(`/api/v2/departments/${id}`);
    if (!response.ok) {
      throw new Error('Gagal memuat data departemen terbaru');
    }
    
    const freshData = await response.json();
    
    // Update cache dengan data terbaru
    mutate(`/api/v2/departments/${id}`, freshData, false);
    mutate(`/departements/${id}`, freshData, false);
    
    console.log('Refetch data departemen berhasil:', id);
    return freshData;
  } catch (err) {
    console.error('Gagal refetch data departemen:', err);
    throw err;
  }
}

/**
 * Hook untuk mengupdate department berdasarkan ID
 * @param id - ID department yang akan diupdate
 * @returns Object dengan fungsi update, loading state, error, dan data hasil update
 */
export function useUpdateDepartment(id: string) {
  const { mutate } = useSWRConfig();
  
  // Menggunakan useMutation untuk menangani request PUT (sesuai backend)
  const mutation = useMutation<Department, Partial<Department>>(
    `/api/v2/departments/${id}`,
    'PUT'
  );

  /**
   * Fungsi untuk mengupdate department
   * @param data - Data department yang akan diupdate
   * @returns Promise dengan data department yang sudah diupdate
   */
  const updateDepartment = async (data: Partial<Department>): Promise<Department> => {
    try {
      // Jalankan mutasi dengan data yang diberikan
      const updatedDepartment = await mutation.mutate(data);
      
      if (!updatedDepartment) {
        throw new Error('Gagal mengupdate departemen');
      }

      // Invalidate cache dan refetch data
      invalidateCache(id, mutate);
      await refetchDepartmentData(id, mutate);
      
      return updatedDepartment;
    } catch (err) {
      console.error('Error updating department:', err);
      throw err;
    }
  };

  return {
    updateDepartment,
    loading: mutation.loading,
    error: mutation.error,
    data: mutation.data,
  };
}