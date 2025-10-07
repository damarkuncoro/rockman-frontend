/**
 * Action untuk menghapus nomor telepon
 */
export const handleDeletePhone = (phone: any, setIsDeleteDialogOpen: (open: boolean) => void, setSelectedPhone: (phone: any) => void) => {
  // Set data telepon yang akan dihapus
  setSelectedPhone(phone)
  
  // Buka dialog konfirmasi hapus
  setIsDeleteDialogOpen(true)
}