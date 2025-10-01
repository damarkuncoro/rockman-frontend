import { User } from "@/hooks/api/v2/users/[id]/show.hook";
import { useUpdateUser } from "@/hooks/api/v2/users/[id]/update.hook";

/**
 * Interface untuk data update pengguna
 */
interface UpdateUserData {
  name?: string;
  email?: string;
  department?: string;
  region?: string;
  level?: number;
  active?: boolean;
}

/**
 * Fungsi untuk mengedit data pengguna menggunakan hook useUpdateUser
 * @param userId - ID pengguna yang akan diedit
 * @param userData - Data pengguna yang baru
 * @returns Promise dengan hasil operasi
 */
export const handleUserEdit = async (
  userId: string,
  userData: UpdateUserData
): Promise<{ success: boolean; message: string; data?: any }> => {
  // Karena hooks hanya bisa digunakan dalam komponen React,
  // kita perlu menggunakan fetch API langsung untuk fungsi ini
  try {
    const response = await fetch(`/api/v2/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Gagal memperbarui data pengguna');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Data pengguna berhasil diperbarui',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui data pengguna',
    };
  }
};

/**
 * Hook wrapper untuk handleUserEdit
 * Gunakan ini dalam komponen React
 */
export const useHandleUserEdit = (userId: string) => {
  return useUpdateUser(userId);
};