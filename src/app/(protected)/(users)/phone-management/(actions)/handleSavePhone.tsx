/**
 * Action untuk menyimpan nomor telepon (create atau update)
 */
export const handleSavePhone = async (
  phone: any, 
  isNewPhone: boolean,
  setIsAddDialogOpen: (open: boolean) => void,
  setIsEditDialogOpen: (open: boolean) => void,
  refreshPhones: () => void,
  setError: (error: string | null) => void
) => {
  try {
    // Reset error
    setError(null)
    
    // Tutup dialog
    if (isNewPhone) {
      setIsAddDialogOpen(false)
    } else {
      setIsEditDialogOpen(false)
    }
    
    // Refresh data
    refreshPhones()
    
  } catch (error) {
    console.error("Error saving phone:", error)
    setError("Terjadi kesalahan saat menyimpan nomor telepon")
  }
}