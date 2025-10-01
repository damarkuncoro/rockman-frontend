interface UserPhone {
  id: number;
  userId: number;
  phoneNumber: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fungsi untuk menambahkan nomor telepon baru
 * @param userId - ID pengguna
 * @param phoneData - Data nomor telepon yang akan ditambahkan
 * @returns Promise dengan hasil operasi
 */
export const addPhone = async (
  userId: string,
  phoneData: { phoneNumber: string; isPrimary: boolean }
): Promise<{ success: boolean; message: string; data?: UserPhone }> => {
  try {
    const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/phones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(phoneData),
    });

    if (!response.ok) {
      throw new Error('Gagal menambahkan nomor telepon');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Nomor telepon berhasil ditambahkan',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan nomor telepon',
    };
  }
};

/**
 * Fungsi untuk mengedit nomor telepon
 * @param userId - ID pengguna
 * @param phoneId - ID nomor telepon yang akan diedit
 * @param phoneData - Data nomor telepon yang baru
 * @returns Promise dengan hasil operasi
 */
export const editPhone = async (
  userId: string,
  phoneId: number,
  phoneData: Partial<UserPhone>
): Promise<{ success: boolean; message: string; data?: UserPhone }> => {
  try {
    const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/phones/${phoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(phoneData),
    });

    if (!response.ok) {
      throw new Error('Gagal memperbarui nomor telepon');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Nomor telepon berhasil diperbarui',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui nomor telepon',
    };
  }
};

/**
 * Fungsi untuk menghapus nomor telepon
 * @param userId - ID pengguna
 * @param phoneId - ID nomor telepon yang akan dihapus
 * @returns Promise dengan hasil operasi
 */
export const deletePhone = async (
  userId: string,
  phoneId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/phones/${phoneId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus nomor telepon');
    }
    
    return {
      success: true,
      message: 'Nomor telepon berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus nomor telepon',
    };
  }
};