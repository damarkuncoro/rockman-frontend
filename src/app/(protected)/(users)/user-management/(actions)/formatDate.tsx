
  /**
   * Fungsi untuk format tanggal
   */
  export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }
  
