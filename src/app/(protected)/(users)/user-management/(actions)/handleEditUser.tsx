
import { User } from "@/hooks/api/v2/users/all.hook";

/**
 * Handler untuk membuka modal edit pengguna
 * @param user - Data pengguna yang akan diedit
 * @param setSelectedUser - Fungsi untuk mengatur user yang dipilih
 * @param setFormData - Fungsi untuk mengatur data form
 * @param setIsEditModalOpen - Fungsi untuk mengatur status modal edit
 */
export const handleEditUser = (
  user: User,
  setSelectedUser: (user: User) => void,
  setFormData: (data: {
    name: string;
    email: string;
    department: string;
    region: string;
    level: string;
    active: boolean;
  }) => void,
  setIsEditModalOpen: (isOpen: boolean) => void
) => {
  setSelectedUser(user)
  setFormData({
    name: user.username,
    email: user.email,
    department: user.departmentId || "",
    region: user.region || "",
    level: user.level?.toString() || "",
    active: user.active
  })
  setIsEditModalOpen(true)
}

