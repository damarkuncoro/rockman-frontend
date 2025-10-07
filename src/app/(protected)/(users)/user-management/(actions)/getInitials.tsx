/**
 * Fungsi untuk mendapatkan inisial nama
 * @param {string} name - Nama pengguna
 * @returns {string} Inisial dari nama pengguna (maksimal 2 karakter)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}