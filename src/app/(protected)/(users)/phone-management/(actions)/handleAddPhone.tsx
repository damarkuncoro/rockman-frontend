/**
 * Action untuk menambah nomor telepon baru
 */
export const handleAddPhone = (setIsAddDialogOpen: (open: boolean) => void, setSelectedPhone: (phone: any) => void) => {
  // Reset form dengan data kosong
  setSelectedPhone({
    id: "",
    userId: "",
    label: "",
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false,
    isActive: true,
    isVerified: false
  })
  
  // Buka dialog
  setIsAddDialogOpen(true)
}