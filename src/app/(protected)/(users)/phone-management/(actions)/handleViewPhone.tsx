/**
 * Action untuk melihat detail nomor telepon
 */
export const handleViewPhone = (phone: any, setIsViewDialogOpen: (open: boolean) => void, setSelectedPhone: (phone: any) => void) => {
  // Set data telepon yang akan dilihat
  setSelectedPhone(phone)
  
  // Buka dialog view
  setIsViewDialogOpen(true)
}