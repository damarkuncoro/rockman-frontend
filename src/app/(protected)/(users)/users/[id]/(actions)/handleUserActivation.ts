/**
 * Fungsi untuk mengaktifkan atau menonaktifkan pengguna
 * @param userId - ID pengguna yang akan diaktifkan/dinonaktifkan
 * @param isActive - Status aktif yang baru
 * @returns Promise dengan hasil operasi
 */
export const handleUserActivation = async (
  userId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`Gagal ${isActive ? 'mengaktifkan' : 'menonaktifkan'} pengguna`);
    }

    return {
      success: true,
      message: `Pengguna berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengubah status pengguna',
    };
  }
};