/**
 * Konfigurasi API untuk aplikasi
 */

// URL dasar untuk API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999/api';

// Timeout untuk request API dalam milidetik
export const API_TIMEOUT = 30000;

// Headers default untuk request API
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};