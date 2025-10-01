/**
 * Fungsi untuk memformat tanggal ke format yang diinginkan
 * @param date - Tanggal yang akan diformat
 * @returns String tanggal yang sudah diformat
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj);
};