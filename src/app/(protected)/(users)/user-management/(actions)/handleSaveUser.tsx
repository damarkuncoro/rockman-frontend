import { User } from "@/hooks/api/v2/users/all.hook";

/**
 * Interface untuk form data pengguna
 */
interface FormData {
  name: string;
  email: string;
  department: string | null;
  region: string | null;
  level: string | null;
  active: boolean;
}

/**
 * Handler untuk menyimpan data pengguna (create atau update)
 * @param selectedUser - Data pengguna yang sedang diedit (null jika membuat baru)
 * @param formData - Data form yang akan disimpan
 * @param updateUser - Fungsi untuk update user
 * @param createUser - Fungsi untuk create user
 * @param setIsEditModalOpen - Fungsi untuk mengatur status modal edit
 * @param setIsAddModalOpen - Fungsi untuk mengatur status modal add
 * @param setSelectedUser - Fungsi untuk mengatur user yang dipilih
 * @param setError - Fungsi untuk mengatur pesan error
 */
export const handleSaveUser = async (
  selectedUser: User | null,
  formData: FormData,
  updateUser: (userId: string, data: any) => Promise<any>,
  createUser: (data: any) => Promise<any>,
  setIsEditModalOpen: (isOpen: boolean) => void,
  setIsAddModalOpen: (isOpen: boolean) => void,
  setSelectedUser: (user: User | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    if (selectedUser) {
      // Update existing user
      await updateUser(selectedUser.id, {
        username: formData.name,
        email: formData.email,
        departmentId: formData.department || null,
        region: formData.region || null,
        level: formData.level ? Number(formData.level) : null,
        active: formData.active
      })
    } else {
      // Create new user
      await createUser({
        username: formData.name,
        email: formData.email,
        departmentId: formData.department || null,
        region: formData.region || null,
        level: formData.level ? Number(formData.level) : null,
        active: formData.active,
        deletedAt: null
      })
    }
    
    setIsEditModalOpen(false)
    setIsAddModalOpen(false)
    setSelectedUser(null)
  } catch (error) {
    console.error("Error saving user:", error)
    setError(error instanceof Error ? error.message : "Gagal menyimpan data pengguna")
  }
}
