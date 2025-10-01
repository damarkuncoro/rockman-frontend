interface SessionData {
  id: number;
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userAgent: string;
  ipAddress: string;
}

/**
 * Fungsi untuk menghapus sesi pengguna
 * @param userId - ID pengguna
 * @param sessionId - ID sesi yang akan dihapus
 * @returns Promise dengan hasil operasi
 */
export const deleteSession = async (
  userId: string,
  sessionId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus sesi');
    }
    
    return {
      success: true,
      message: 'Sesi berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus sesi',
    };
  }
};

/**
 * Fungsi untuk menghapus semua sesi pengguna kecuali sesi saat ini
 * @param userId - ID pengguna
 * @param currentSessionId - ID sesi saat ini yang tidak akan dihapus
 * @returns Promise dengan hasil operasi
 */
export const deleteAllSessions = async (
  userId: string,
  currentSessionId?: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = currentSessionId 
      ? `http://localhost:9999/api/v1/users/${userId}/sessions?except=${currentSessionId}` 
      : `http://localhost:9999/api/v1/users/${userId}/sessions`;
      
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus semua sesi');
    }
    
    return {
      success: true,
      message: 'Semua sesi berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus semua sesi',
    };
  }
};