/**
 * Action untuk konfirmasi penghapusan nomor telepon
 */
export const handleConfirmDelete = async (
  phone: any,
  setIsDeleteDialogOpen: (open: boolean) => void,
  refreshPhones: () => void,
  setError: (error: string | null) => void
) => {
  try {
    // Reset error
    setError(null)
    
    // Tutup dialog konfirmasi
    setIsDeleteDialogOpen(false)
    
    // Refresh data
    refreshPhones()
    
  } catch (error) {
    console.error("Error deleting phone:", error)
    setError("Terjadi kesalahan saat menghapus nomor telepon")
  }
}