
/**
 * Handler untuk membuka modal tambah pengguna baru
 * @param setFormData - Fungsi untuk mengatur data form
 * @param setIsAddModalOpen - Fungsi untuk mengatur status modal tambah
 */
export const handleAddUser = (
  setFormData: (data: {
    name: string;
    email: string;
    department: string;
    region: string;
    level: string;
    active: boolean;
  }) => void,
  setIsAddModalOpen: (isOpen: boolean) => void
) => {
  setFormData({
    name: "",
    email: "",
    department: "",
    region: "",
    level: "",
    active: true
  })
  setIsAddModalOpen(true)
}