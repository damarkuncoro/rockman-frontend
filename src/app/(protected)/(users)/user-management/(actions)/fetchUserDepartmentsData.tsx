'use client';

import { Department } from "@/hooks/api/v2/departments/types";

/**
 * Fungsi untuk mengambil departemen pengguna
 * @param {string} userId - ID pengguna
 * @param {Function} fetchUserDepartments - Fungsi untuk fetch data departemen dari API
 * @param {Object} loadingUserDepartments - State loading untuk setiap user
 * @param {Object} userDepartments - State departemen untuk setiap user
 * @param {Function} setLoadingUserDepartments - Setter untuk state loading
 * @param {Function} setUserDepartments - Setter untuk state departemen
 */
export const fetchUserDepartmentsData = async (
  userId: string,
  fetchUserDepartments: (id: string) => Promise<any>,
  loadingUserDepartments: Record<string, boolean>,
  userDepartments: Record<string, Department[]>,
  setLoadingUserDepartments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setUserDepartments: React.Dispatch<React.SetStateAction<Record<string, Department[]>>>
) => {
  // Jika sudah loading atau data sudah ada, tidak perlu fetch lagi
  if (loadingUserDepartments[userId] || userDepartments[userId]) return;
  
  try {
    // Set loading state untuk user ini
    setLoadingUserDepartments(prev => ({ ...prev, [userId]: true }));
    
    // Fetch data departemen
    const data = await fetchUserDepartments(userId);
    console.log(`Departments for user ${userId}:`, data);
    
    // Simpan data jika berhasil
    if (data && data.data) {
      console.log(`Data departemen ditemukan untuk user ${userId}:`, data.data);
      setUserDepartments(prev => ({ ...prev, [userId]: data.data }));
    } else {
      console.warn(`Tidak ada data departemen untuk user ${userId} atau format data tidak sesuai:`, data);
    }
  } catch (error) {
    console.error(`Error fetching departments for user ${userId}:`, error);
  } finally {
    // Reset loading state
    setLoadingUserDepartments(prev => ({ ...prev, [userId]: false }));
  }
};