'use client';

import { Department } from "@/hooks/api/v2/departments/types";

/**
 * Mendapatkan nama departemen berdasarkan ID
 * @param {string | null} userId - ID pengguna
 * @returns {string} Nama departemen atau pesan jika tidak ditemukan
 */
export const getDepartmentName = async (
  userId: string | null
) => {
  console.log("getDepartmentName")

  console.log("userId", userId)
  // Jika departmentId atau userId tidak ada, langsung kembalikan pesan
  if (!userId) return "Tidak ada departemen";
  
  try {
    // Langsung ambil data departemen dari API
    const response = await fetch(`/api/v2/users/${userId}/departments`);
    
    
    if (!response.ok) {
      console.error(`Error fetching departments for user ${userId}: ${response.statusText}`);
      return "Error";
    }
    
    const data = await response.json();

    console.log(`Departments data for user ${userId}:`, data);
    
    if (data && data.data && Array.isArray(data.data)) {
      console.log(`Data departemen ditemukan untuk user ${userId}:`, data.data);
      // Cari departemen dengan ID yang sesuai
      const department = data.data.find((dept: Department) => dept.id === userId);
      if (department) {
        return department.name;
      }
    }
    
    return "Departemen tidak ditemukan";
  } catch (error) {
    console.error(`Error in getDepartmentName for user ${userId}:`, error);
    return "Error";
  }
};