
import { User } from "@/hooks/api/v2/users/all.hook";

/**
 * Handler untuk konfirmasi penghapusan pengguna
 * @param selectedUser - Data pengguna yang akan dihapus
 * @param deleteUser - Fungsi untuk menghapus pengguna
 * @param setIsDeleteModalOpen - Fungsi untuk mengatur status modal delete
 * @param setSelectedUser - Fungsi untuk mengatur user yang dipilih
 * @param setError - Fungsi untuk mengatur pesan error
 */
export const handleConfirmDelete = async (
  selectedUser: User | null,
  deleteUser: (userId: string) => Promise<any>,
  setIsDeleteModalOpen: (isOpen: boolean) => void,
  setSelectedUser: (user: User | null) => void,
  setError: (error: string | null) => void
) => {
  if (!selectedUser) return
  
  try {
    // Gunakan loading state dari hook
    await deleteUser(selectedUser.id)
    setIsDeleteModalOpen(false)
    setSelectedUser(null)
  } catch (error) {
    console.error("Error deleting user:", error)
    setError(error instanceof Error ? error.message : "Gagal menghapus pengguna")
  }
}
