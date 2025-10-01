import { useUserAddresses } from "@/hooks/api/v2/users/[id]/addresses";

/**
 * Interface untuk data alamat user
 */
interface UserAddress {
  id: number;
  userId: number;
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fungsi untuk menambahkan alamat baru
 * @param userId - ID pengguna
 * @param addressData - Data alamat yang akan ditambahkan
 * @returns Promise dengan hasil operasi
 */
export const addAddress = async (
  userId: string,
  addressData: Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; message: string; data?: UserAddress }> => {
  try {
    const response = await fetch(`/api/v2/users/${userId}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error('Gagal menambahkan alamat');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Alamat berhasil ditambahkan',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan alamat',
    };
  }
};

/**
 * Fungsi untuk mengedit alamat
 * @param userId - ID pengguna
 * @param addressId - ID alamat yang akan diedit
 * @param addressData - Data alamat yang baru
 * @returns Promise dengan hasil operasi
 */
export const editAddress = async (
  userId: string,
  addressId: number,
  addressData: Partial<UserAddress>
): Promise<{ success: boolean; message: string; data?: UserAddress }> => {
  try {
    const response = await fetch(`/api/v2/users/${userId}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error('Gagal memperbarui alamat');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Alamat berhasil diperbarui',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui alamat',
    };
  }
};

/**
 * Fungsi untuk menghapus alamat
 * @param userId - ID pengguna
 * @param addressId - ID alamat yang akan dihapus
 * @returns Promise dengan hasil operasi
 */
export const deleteAddress = async (
  userId: string,
  addressId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/v2/users/${userId}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus alamat');
    }
    
    return {
      success: true,
      message: 'Alamat berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus alamat',
    };
  }
};

/**
 * Hook wrapper untuk mengakses alamat pengguna
 * Gunakan ini dalam komponen React
 */
export const useHandleUserAddresses = (userId?: string) => {
  return useUserAddresses(userId);
};