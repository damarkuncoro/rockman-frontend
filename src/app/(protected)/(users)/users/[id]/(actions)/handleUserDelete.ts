import { useDeleteUser } from "@/hooks/api/v2/users/[id]/delete.hook";

/**
 * Fungsi untuk menghapus pengguna menggunakan API v2
 * @param userId - ID pengguna yang akan dihapus
 * @returns Promise dengan hasil operasi
 */
export const handleUserDelete = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/v2/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus pengguna');
    }
    
    return {
      success: true,
      message: 'Pengguna berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pengguna',
    };
  }
};

/**
 * Hook wrapper untuk handleUserDelete
 * Gunakan ini dalam komponen React
 */
export const useHandleUserDelete = () => {
  return useDeleteUser();
};