/**
 * Action untuk mengedit nomor telepon
 */
export const handleEditPhone = (phone: any, setIsEditDialogOpen: (open: boolean) => void, setSelectedPhone: (phone: any) => void) => {
  // Set data telepon yang akan diedit
  setSelectedPhone(phone)
  
  // Buka dialog edit
  setIsEditDialogOpen(true)
}