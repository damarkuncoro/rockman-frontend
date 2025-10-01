
import { User } from "@/hooks/api/v2/users/all.hook";

/**
 * Handler untuk membuka modal konfirmasi hapus pengguna
 * @param user - Data pengguna yang akan dihapus
 * @param setSelectedUser - Fungsi untuk mengatur user yang dipilih
 * @param setIsDeleteModalOpen - Fungsi untuk mengatur status modal delete
 */
export const handleDeleteUser = (
  user: User,
  setSelectedUser: (user: User) => void,
  setIsDeleteModalOpen: (isOpen: boolean) => void
) => {
  setSelectedUser(user)
  setIsDeleteModalOpen(true)
}
